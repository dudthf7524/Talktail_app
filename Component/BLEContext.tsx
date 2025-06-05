import React, { createContext, useContext, useReducer, useRef } from 'react';
import { dataStore } from '../store/dataStore';
import dayjs from 'dayjs';

// 상태 타입 정의
interface DataPoint { 
  timestamp: number;
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
  currentHR: number | null;
  currentSpO2: number | null;
  currentTemp: { value: number; timestamp: number } | null;
  tempChartData: Array<{ value: number; timestamp: number }>;
}

// 액션 타입 정의
type BLEAction = 
  | { type: 'CONNECT_DEVICE'; payload: { startDate: string; startTime: string; deviceCode: string; petCode: string } | null }
  | { type: 'UPDATE_CHART_DATA'; payload: number; skipAnimation: boolean }
  | { type: 'COLLECT_DATA'; payload: DataPoint }
  | { type: 'CLEAR_COLLECTED_DATA' }
  | { type: 'UPDATE_HR'; payload: number }
  | { type: 'UPDATE_SPO2'; payload: number }
  | { type: 'UPDATE_TEMP'; payload: { value: number; timestamp: number } };

// 초기 상태
const initialState: BLEState = {
  connectedDevice: null,
  chartData: [],
  collectedData: [],
  currentHR: null,
  currentSpO2: null,
  currentTemp: null,
  tempChartData: [],
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
    case 'UPDATE_HR':
      return { ...state, currentHR: action.payload };
    case 'UPDATE_SPO2':
      return { ...state, currentSpO2: action.payload };
    case 'UPDATE_TEMP':
      const newTempData = [...state.tempChartData, action.payload];
      if (newTempData.length > 60) { // 최대 50개 데이터 포인트 유지
        newTempData.shift();
      }
      return { 
        ...state, 
        currentTemp: action.payload,
        tempChartData: newTempData
      };
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
  const cntRef = useRef(0);  // cnt를 useRef로 관리
  
  const collectData = (data: number[]) => {
    cntRef.current++;
    const timestamp = Date.now(); // dayjs 대신 Date.now() 사용
    // console.log(`cnt : ${cntRef.current}, data : ${data}, 현재 저장된 데이터 길이 : ${state.collectedData.length}`);
    
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
      cntRef.current = 0;  // 데이터 전송 시 cnt 초기화
      
      if (state.connectedDevice) {
        // BLEDataPoint를 DataStore의 DataPoint로 변환
        const convertedData = dataToSend.map(item => ({
          ...item,
          timestamp: dayjs(item.timestamp).format('HH:mm:ss.SSS')
        }));
        
        sendData(convertedData, state.connectedDevice)
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

  // 디바이스 연결 상태 변경 감지
  React.useEffect(() => {
    if (!state.connectedDevice) {
      cntRef.current = 0;  // 디바이스 연결이 끊어질 때 cnt 초기화
    }
  }, [state.connectedDevice]);

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