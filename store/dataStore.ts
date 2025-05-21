import {create} from "zustand";
import axios from "axios";
import {API_URL} from "../Component/constant/contants";
import {getToken} from "../utils/storage";

interface DataPoint { 
  timestamp: string;
  ir: number;
  red: number;
  spo2: number;
  hr: number;
  temp: number;
}

interface DataStore {
    createLoading: boolean;
    createError: string | null;
    loadLoading: boolean;
    loadError: string | null;
    createCSV: (date: string, time: string, pet_code: string, device_code: string) => Promise<void>;
    loadData: (date: string, pet_code: string) => Promise<void>;
    sendData: (data: DataPoint[], deviceInfo: {
      startDate: string;
      startTime: string;
      deviceCode: string;
      petCode: string;
    }) => Promise<void>;
}

export const dataStore = create<DataStore>((set, get) => ({
  createLoading: false,
  createError: null,
  loadLoading: false,
  loadError: null,
  createCSV: async (date: string, time: string, pet_code: string, device_code: string) => {
    try {
      set({createLoading: true, createError: null});
      const response = await axios.post(`${API_URL}/data/create`, {date, time, pet_code, device_code});
      if(response.status === 200){
        set({createLoading: false, createError: null});
      } else {
        set({createError: 'CSV 생성에 실패했습니다.', createLoading: false});
      }
    } catch (error) {
      set({createError: error instanceof Error ? error.message : 'CSV 생성에 실패했습니다.', createLoading: false});
    }
  },
  sendData: async(data: DataPoint[], deviceInfo: {
    startDate: string;
    startTime: string;
    deviceCode: string;
    petCode: string;
  }) => {
    try {
      const response = await axios.post(`${API_URL}/data/send`, { 
        data, 
        connectedDevice: deviceInfo
      });
      
      if (response.status === 200) {
        console.log('데이터 전송 성공');
      } else {
        console.error('데이터 전송 실패');
      }
    } catch (error) {
      console.error('데이터 전송 에러:', error);
      set({ createError: error instanceof Error ? error.message : '데이터 전송에 실패했습니다.' });
    }
  },
  loadData: async (date: string, pet_code: string) => {
    try {
      set({loadLoading: true, loadError: null});
      const token = await getToken();
      const device_code=token?.device_code;

      const response = await axios.post(`${API_URL}/data/load`, {date, pet_code, device_code});
      
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        set({ 
          loadError: '잘못된 디바이스 코드입니다.',
          loadLoading: false 
        });
      } else {
        set({ 
          loadError: error instanceof Error ? error.message : '디바이스 코드 검증에 실패했습니다.', 
          loadLoading: false 
        });
      }
      throw error; 
    }
  }
}))