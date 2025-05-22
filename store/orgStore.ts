import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '../Component/constant/contants';
import { getToken, removeToken } from '../utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Org {
  device_code: string;
  org_name: string;
  org_address: string;
  org_id: string;
  org_pw: string;
  org_phone: string;
  org_email: string;
}

interface ChangePW {
  org_pw: string;
  org_new_pw: string;
}

interface ChangeInfo {
  org_name: string;
  org_address: string;
  org_phone: string;
  org_email: string;
}

interface OrgStore {
  org: Org;
  loadLoading: boolean;
  loadError: string | null;
  updateLoading: boolean;
  updateError: string | null;
  changePWLoading: boolean;
  changePWError: string | null;
  changePWSuccess: boolean;
  changeInfoLoading: boolean;
  changeInfoError: string | null;
  changeInfoSuccess: boolean;
  logoutLoading: boolean;
  logoutError: string | null;
  logoutSuccess: boolean;
  loadOrg: () => Promise<void>;
  updateOrg: (org: Org) => Promise<void>;
  changePW: (info: ChangePW) => Promise<void>;
  changeInfo: (info: ChangeInfo) => Promise<void>;
  logout: () => Promise<void>;
  offChangePWSuccess: () => void;
  offChangePWError: () => void;
  offChangeInfoSuccess: () => void;
  offChangeInfoError: () => void;
  offLogoutSuccess: () => void;
  offLogoutError: () => void;
}

export const orgStore = create<OrgStore>((set, get) => ({
  org: {
    device_code: '',
    org_name: '',
    org_address: '',
    org_id: '',
    org_pw: '',
    org_phone: '',
    org_email: '',
  },
  loadLoading: false,
  loadError: null,
  updateLoading: false,
  updateError: null,
  changePWLoading: false,
  changePWError: null,
  changePWSuccess: false,
  changeInfoLoading: false,
  changeInfoError: null,
  changeInfoSuccess: false,
  logoutLoading: false,
  logoutError: null,
  logoutSuccess: false,

  loadOrg: async () => {
    try {
      set({loadLoading: true, loadError: null});
      const token = await getToken();
      if (!token) {
        throw new Error('토큰이 없습니다.');
      }
      const response = await axios.post(`${API_URL}/org/load`, token);
      set({org: response.data.data, loadLoading: false});
    }
    catch(error) {
      console.error(error);
      set({loadError: '기관 정보를 불러오는데 실패했습니다.', loadLoading: false});
      throw error;
    }
  },

  updateOrg: async (org: Org) => {
    try {
      set({updateLoading: true, updateError: null});
      const token = await getToken();
      if (!token) {
        throw new Error('토큰이 없습니다.');
      }
      const response = await axios.post(`${API_URL}/org/update`, org);
      set({org: response.data.data, updateLoading: false});
    }
    catch(error) {
      console.error(error);
      set({updateError: '기관 정보 업데이트에 실패했습니다.', updateLoading: false});
      throw error;
    }
  },

  changePW: async(info: ChangePW) => {
    try {
      set({changePWLoading: true, changePWError: null, changePWSuccess: false});
      const token = await getToken();
      if (!token) {
        throw new Error('토큰이 없습니다.');
      }
      const sendData = {token, org_pw: info.org_pw, org_new_pw: info.org_new_pw};
      const response = await axios.post(`${API_URL}/org/changePW`, sendData);
      if(response.status === 200) {
        set({changePWLoading: false, changePWSuccess: true});
      }
    }
    catch(error: any) {
      console.error(error);
      set({
        changePWLoading: false, 
        changePWSuccess: false,
        changePWError: error.response?.data?.message || '비밀번호 변경에 실패했습니다.'
      });
      throw error;
    }
  },

  changeInfo: async(info: ChangeInfo) => {
    try {
      set({changeInfoLoading: true, changeInfoError: null, changeInfoSuccess: false});
      const token = await getToken();
      if(!token) {
        throw new Error('토큰이 없습니다.');
      }
      const sendData = {token, org_name: info.org_name, org_address: info.org_address, org_phone: info.org_phone, org_email: info.org_email};
      const response = await axios.post(`${API_URL}/org/changeInfo`, sendData);
      if(response.status === 200) {
        set({changeInfoLoading: false, changeInfoSuccess: true});
      }
    }
    catch(error: any) {
      console.error(error);
      set({
        changeInfoLoading: false, 
        changeInfoSuccess: false,
        changeInfoError: error.response?.data?.message || '정보 수정에 실패했습니다.'
      });
      throw error;
    }
  },

  logout: async() => {
    try {
      set({ logoutLoading: true, logoutError: null, logoutSuccess: false });
      await removeToken();
      set({
        org: {
          device_code: '',
          org_name: '',
          org_address: '',
          org_id: '',
          org_pw: '',
          org_phone: '',
          org_email: '',
        },
        loadLoading: false,
        loadError: null,
        updateLoading: false,
        updateError: null,
        changePWLoading: false,
        changePWError: null,
        changePWSuccess: false,
        changeInfoLoading: false,
        changeInfoError: null,
        changeInfoSuccess: false,
        logoutLoading: false,
        logoutSuccess: true
      });
    }
    catch(error) {
      console.error(error);
      set({
        logoutLoading: false,
        logoutSuccess: false,
        logoutError: '로그아웃에 실패했습니다.'
      });
      throw error;
    }
  },

  offChangePWSuccess: () => set({ changePWSuccess: false }),
  offChangePWError: () => set({ changePWError: null }),
  offChangeInfoSuccess: () => set({ changeInfoSuccess: false }),
  offChangeInfoError: () => set({ changeInfoError: null }),
  offLogoutSuccess: () => set({ logoutSuccess: false }),
  offLogoutError: () => set({ logoutError: null }),
}));