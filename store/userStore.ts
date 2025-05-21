import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '../Component/constant/contants';
import { getToken } from '../utils/storage';

export interface Pet {
  device_code: string;
  pet_code: string;
  name: string;
  birth: string;
  breed: string;
  gender: boolean;  
  isNeutered: boolean;
  disease: string;
}

interface PetFormData {
  name: string;
  birth: string;
  breed: string;
  gender: boolean;
  isNeutered: boolean;
  disease: string;
  device_code: string;
}

interface UserStore {
  pets: Pet[];
  loadLoading: boolean;
  loadError: string | null;
  registerLoading: boolean;
  registerError: string | null;
  updateLoading: boolean;
  updateError: string | null;
  deleteLoading: boolean;
  deleteError: string | null;
  fetchPets: () => Promise<void>;
  registerPet: (formData: PetFormData) => Promise<void>;
  updatePet: (petData: PetFormData & { pet_code: string }) => Promise<void>;
  deletePet: (petCode: string) => Promise<void>;
}

export const userStore = create<UserStore>((set, get) => ({
  pets: [],
  loadLoading: false,
  loadError: null,
  registerLoading: false,
  registerError: null,
  updateLoading: false,
  updateError: null,
  deleteLoading: false,
  deleteError: null,

  fetchPets: async () => {
    try {
      set({ loadLoading: true, loadError: null });
      const token = await getToken();
      if (!token) {
        throw new Error('토큰이 없습니다.');
      }

      const response = await axios.post(`${API_URL}/pet/load`, {
        // device_code: 'DEVICE001'
        device_code: token.device_code
      });

      set({ pets: response.data, loadLoading: false });
    } catch (error) {
      set({ 
        loadError: error instanceof Error ? error.message : '펫 데이터를 가져오는데 실패했습니다.', 
        loadLoading: false 
      });
    }
  },

  registerPet: async (formData: PetFormData) => {
    try {
      set({ registerLoading: true, registerError: null });
      const response = await axios.post(`${API_URL}/pet/register`, formData);
      
      if (response.status === 200) {
        const token = await getToken();
        if (!token) {
          throw new Error('토큰이 없습니다.');
        }
        const petsResponse = await axios.post(`${API_URL}/pet/load`, {
          device_code: token.device_code
        });
        set({ pets: petsResponse.data, registerLoading: false });
      }
    } catch (error) {
      set({ 
        registerError: error instanceof Error ? error.message : '펫 등록에 실패했습니다.', 
        registerLoading: false 
      });
      throw error; 
    }
  },

  updatePet: async (petData: PetFormData & { pet_code: string }) => {
    try {
      set({ updateLoading: true, updateError: null });
      const token = await getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.post(
        `${API_URL}/pet/edit`,
        petData
      );

      if (response.status === 200) {
        // Refresh the pet list after successful update
        await get().fetchPets();
      }
    } catch (error) {
      console.error('Error updating pet:', error);
      set({ updateError: error instanceof Error ? error.message : 'Failed to update pet' });
      throw error;
    } finally {
      set({ updateLoading: false });
    }
  },

  deletePet: async (petCode: string) => {
    try {
      set({ deleteLoading: true, deleteError: null });
      const token = await getToken();
      if (!token) {
        throw new Error('토큰이 없습니다.');
      }

      const response = await axios.post(`${API_URL}/pet/delete`, {
        device_code: token.device_code,
        pet_code: petCode
      });

      if (response.status === 200) {
        // 삭제 후 펫 목록 새로고침
        const petsResponse = await axios.post(`${API_URL}/pet/load`, {
          device_code: token.device_code
        });
        set({ pets: petsResponse.data, deleteLoading: false });
      }
    } catch (error) {
      set({ 
        deleteError: error instanceof Error ? error.message : '펫 삭제에 실패했습니다.', 
        deleteLoading: false 
      });
      throw error;
    }
  }
}));
