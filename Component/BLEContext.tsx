import React, { createContext, useContext, useReducer, useRef } from 'react';

// 상태 타입 정의
interface BLEState {
    connectedDevice: string | null;
    chartData: number[];
}

// 액션 타입 정의
type BLEAction =
    | { type: 'CONNECT_DEVICE'; payload: string }
    | { type: 'UPDATE_CHART_DATA'; payload: number };

// 초기 상태
const initialState: BLEState = {
    connectedDevice: null,
    chartData: [],
};

// 리듀서 함수
const bleReducer = (state: BLEState, action: BLEAction): BLEState => {
    switch (action.type) {
        case 'CONNECT_DEVICE':
            return { ...state, connectedDevice: action.payload };
        case 'UPDATE_CHART_DATA':
            // 최대 100개의 데이터 포인트만 유지
            const newData = [...state.chartData, action.payload];
            if (newData.length > 100) {
                newData.shift();
            }
            return { ...state, chartData: newData };
        default:
            return state;
    }
};

// Context 생성
const BLEContext = createContext<{
    state: BLEState;
    dispatch: React.Dispatch<BLEAction>;
    addChartData: (data: number) => void;
} | undefined>(undefined);

// Provider 컴포넌트
export const BLEProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(bleReducer, initialState);
    const lastUpdateTime = useRef<number>(Date.now());

    // Throttling 함수 (100ms 간격으로 업데이트)
    const addChartData = (data: number) => {
        const now = Date.now();
        if (now - lastUpdateTime.current >= 100) { // 100ms마다 업데이트 (초당 10회)
            dispatch({ type: 'UPDATE_CHART_DATA', payload: data });
            lastUpdateTime.current = now;
        }
    };

    return (
        <BLEContext.Provider value={{ state, dispatch, addChartData }}>
            {children}
        </BLEContext.Provider>
    );
};

// Custom Hook
export const useBLE = () => {
    const context = useContext(BLEContext);
    if (!context) {
        throw new Error('useBLE must be used within a BLEProvider');
    }
    return context;
}; 