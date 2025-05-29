import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '../Component/constant/contants';
import { getToken, setToken } from '../utils/storage';

interface DeviceStore {
  checkLoading: boolean;
  checkError: string | null;
  checkSuccess: boolean;
  signupLoading: boolean;
  signupError: string | null;
  signupSuccess: boolean;
  checkIDLoading: boolean;
  checkIDError: string | null;
  checkIDSuccess: boolean;
  loginLoading: boolean;
  loginError: string | null;
  loginSuccess: boolean;
  checkCode: (deviceCode: string) => Promise<void>;
  signup: (params: {
    deviceCode: string;
    org_name: string;
    org_address: string;
    org_id: string;
    org_pw: string;
    org_phone: string;
    org_email: string;
    marketingAgreed: boolean;
    smsAgreed: boolean;
    emailAgreed: boolean;
    pushAgreed: boolean;
  }) => Promise<void>; 
  offSignupSuccess: () => void;
  offSignupError: () => void;
  offCheckSuccess: () => void;
  offCheckError: () => void;
  checkID: (org_id: string) => Promise<void>;
  offCheckIDSuccess: () => void;
  offCheckIDError: () => void;
  login: (data: { id: string; password: string }) => Promise<void>;
  offLoginSuccess: () => void;
  offLoginError: () => void;
}

export const deviceStore = create<DeviceStore>((set, get) => ({
  checkLoading: false,
  checkError: null,
  checkSuccess: false,
  signupLoading: false,
  signupError: null,
  signupSuccess: false,
  checkIDLoading: false,
  checkIDError: null,
  checkIDSuccess: false,
  loginLoading: false,
  loginError: null,
  loginSuccess: false,
  checkCode: async (deviceCode: string) => {
    try {
      set({ checkLoading: true, checkError: null });
      const response = await axios.post(`${API_URL}/device/check`, { deviceCode });
      
      if (response.status === 200) {
        set({ checkSuccess: true, checkLoading: false, checkError: null });
        const token = await getToken();
        if (!token) {
          throw new Error('토큰이 없습니다.');
        }
      }
    } catch (error) {
      set({
        checkError: error.response.data.message,
        checkLoading: false
      });
      throw new Error();
    }
  },
  signup: async ({ 
    deviceCode, 
    org_name, 
    org_address, 
    org_id, 
    org_pw, 
    org_phone, 
    org_email,
    marketingAgreed,
    smsAgreed,
    emailAgreed,
    pushAgreed 
  }) => {
    try {
      set({ signupLoading: true, signupError: null, signupSuccess: false });
      const response = await axios.post(`${API_URL}/user/signup`, {
        deviceCode,
        org_name,
        org_address,
        org_id,
        org_pw,
        org_phone,
        org_email,
        marketingAgreed,
        smsAgreed,
        emailAgreed,
        pushAgreed
      });
      if (response.status === 201) {
        set({ signupLoading: false, signupError: null, signupSuccess: true, checkSuccess:false });
      } else {
        set({ signupLoading: false, signupError: response.data.message, signupSuccess: false });
      }
    } catch (error) {
      set({ signupLoading: false, signupError: error.response.data.message, signupSuccess: false });
      throw new Error();
    }
  },
  offSignupSuccess: () => {
    set({ signupSuccess: false });
  },
  offSignupError: () => {
    set({ signupError: null });
  },
  offCheckSuccess: () => {
    set({ checkSuccess: false });
  },
  offCheckError: () => {
    set({ checkError: null });
  },
  checkID: async (org_id: string) => {
    try {
      set({ checkIDLoading: true, checkIDError: null });
      const response = await axios.post(`${API_URL}/user/checkId`, { org_id });

      if (response.status === 200) {
        set({ checkIDSuccess: true, checkIDLoading: false, checkIDError: null });
      } else {
        set({ checkIDSuccess: false, checkIDLoading: false, checkIDError: response.data.message });
      }
    } catch(error) {
      set({
        checkIDError: error.response.data.message,
        checkIDLoading: false
      });
      throw new Error();
    }
  },
  offCheckIDSuccess: () => {
    set({ checkIDSuccess: false });
  },
  offCheckIDError: () => {
    set({ checkIDError: null });
  },
  login: async ({ id, password }) => {
    try {
      set({ loginLoading: true, loginError: null, loginSuccess: false });
      const response = await axios.post(`${API_URL}/user/login`, { id, password });
      if (response.status === 200) {
        const token = response.data.data.token;
        await setToken(token);
        set({ loginLoading: false, loginSuccess: true });
      }
    } catch (error: any) {
      let errorMessage = '로그인에 실패했습니다.';
      
      if (error.message === 'Network Error') {
        errorMessage = '네트워크 연결을 확인해주세요.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      set({
        loginLoading: false,
        loginSuccess: false,
        loginError: errorMessage
      });
      throw error;
    }
  },
  offLoginSuccess: () => set({ loginSuccess: false }),
  offLoginError: () => set({ loginError: null }),
}));