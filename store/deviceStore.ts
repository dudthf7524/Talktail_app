import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '../Component/constant/contants';
import { getToken } from '../utils/storage';

interface DeviceStore {
  checkLoading: boolean;
  checkError: string | null;

  checkCode: (deviceCode: string) => Promise<void>;
}

export const deviceStore = create<DeviceStore>((set, get) => ({
  checkLoading: false,
  checkError: null,

  checkCode: async (deviceCode: string) => {
    try {
      set({ checkLoading: true, checkError: null });
      const response = await axios.post(`${API_URL}/device/check`, {deviceCode});
      
      if (response.status === 200) {
        const token = await getToken();
        if (!token) {
          throw new Error('토큰이 없습니다.');
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        set({ 
          checkError: '잘못된 디바이스 코드입니다.',
          checkLoading: false 
        });
      } else {
        set({ 
          checkError: error instanceof Error ? error.message : '디바이스 코드 검증에 실패했습니다.', 
          checkLoading: false 
        });
      }
      throw error; 
    }
  },

 

}));
