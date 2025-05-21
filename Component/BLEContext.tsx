import React, { createContext, useContext, useReducer, useRef } from 'react';
import { dataStore } from '../store/dataStore';
import dayjs from 'dayjs';

// 상태 타입 정의
interface DataPoint { 
  timestamp: string;
  ir: number;
  red: number;
  spo2: number;
  hr: number;
  temp: number;
}

interface BLEState {
  connectedDevice: {
    startDate: string;
    startTime: string;
    deviceCode: string;
    petCode: string;
  } | null;
  chartData: number[];
  collectedData: DataPoint[];
}

// 액션 타입 정의
type BLEAction = 
  | { type: 'CONNECT_DEVICE'; payload: { startDate: string; startTime: string; deviceCode: string; petCode: string } }
  | { type: 'UPDATE_CHART_DATA'; payload: number; skipAnimation: boolean }
  | { type: 'COLLECT_DATA'; payload: DataPoint }
  | { type: 'CLEAR_COLLECTED_DATA' };

// 초기 상태
const initialState: BLEState = {
  connectedDevice: null,
  chartData: [],
  collectedData: [],
};

// 리듀서 함수
const bleReducer = (state: BLEState, action: BLEAction): BLEState => {
  switch (action.type) {
    case 'CONNECT_DEVICE':
      return { ...state, connectedDevice: action.payload };
    case 'UPDATE_CHART_DATA':
      const newData = [...state.chartData, action.payload];
      if (newData.length > 100) {
        newData.shift();
      }
      return { ...state, chartData: newData };
    case 'COLLECT_DATA':
      const newState = { ...state, collectedData: [...state.collectedData, action.payload] };
      return newState;
    case 'CLEAR_COLLECTED_DATA':
      return { ...state, collectedData: [] };
    default:
      return state;
  }
};

// Context 생성
const BLEContext = createContext<{
  state: BLEState;
  dispatch: React.Dispatch<BLEAction>;
  addChartData: (data: number) => void;
  collectData: (data: number[]) => void;
  getConnectedDevice: () => BLEState['connectedDevice'];
} | undefined>(undefined);

let globalGetConnectedDevice: (() => BLEState['connectedDevice']) | null = null;

// Provider 컴포넌트
export const BLEProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(bleReducer, initialState);
  const lastUpdateTime = useRef<number>(Date.now());
  const { createCSV } = dataStore();
  const {sendData} = dataStore();
  
  let cnt = 0;
  const collectData = (data: number[]) => {
    cnt++;
    const timestamp = dayjs().format('HHmmssSSS');
    console.log(`cnt : ${cnt}, data : ${data}, 현재 저장된 데이터 길이 : ${state.collectedData.length}`);
    
    dispatch({
      type: "COLLECT_DATA",
      payload: {
        timestamp,
        ir: data[0],
        red: data[1],
        spo2: data[2] ?? 0, 
        hr: data[3] ?? 0,    
        temp: data[4] ?? 0,
      }
    });
  };

  globalGetConnectedDevice = () => state.connectedDevice;

  // 데이터 전송 로직을 useEffect로 분리
  React.useEffect(() => {
    if ((state.collectedData.length+1) / 500 > 1) {
      const dataToSend = [...state.collectedData]; 
      dispatch({ type: 'CLEAR_COLLECTED_DATA' }); 
      
      if (state.connectedDevice) {
        sendData(dataToSend, state.connectedDevice)
          .then(() => {
            console.log("데이터 전송 완료");
          })
          .catch(error => {
            console.error('Error sending data:', error);
          });
      } else {
        console.error('Device information not available');
      }
    }
  }, [state.collectedData.length]);

  const addChartData = React.useCallback((data: number) => {
    const now = Date.now();
    if (now - lastUpdateTime.current >= 100) {
      dispatch({ 
        type: 'UPDATE_CHART_DATA', 
        payload: data,
        skipAnimation: true // 애니메이션 스킵 플래그 추가
      });
      lastUpdateTime.current = now;
    }
  }, []);

  React.useEffect(() => {
    if (state.connectedDevice) {
      createCSV(
        state.connectedDevice.startDate,
        state.connectedDevice.startTime,
        state.connectedDevice.petCode,
        state.connectedDevice.deviceCode
      );
    }
  }, [state.connectedDevice]);

  return (
    <BLEContext.Provider value={{ state, dispatch, addChartData, collectData, getConnectedDevice }}>
      {children}
    </BLEContext.Provider>
  );
};

export const getConnectedDevice = () => {
  if (!globalGetConnectedDevice) {
    throw new Error('BLE Provider not initialized');
  }
  return globalGetConnectedDevice();
};

// Custom Hook
export const useBLE = () => {
  const context = useContext(BLEContext);
  if (!context) {
    throw new Error('useBLE must be used within a BLEProvider');
  }
  return context;
}; 