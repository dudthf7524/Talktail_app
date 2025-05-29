import AsyncStorage from '@react-native-async-storage/async-storage';
import { toByteArray } from 'react-native-quick-base64';


const TOKEN_KEY = '@auth_token';
const DEVICE_CODE_KEY = '@device_code';

interface DecodedToken {
  org_id: string;
  device_code: string;
  iat: number;
  exp: number;
}

// Base64 디코딩 함수
const base64Decode = (str: string): string => {
  // Base64 URL 안전 문자를 표준 Base64로 변환
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  // 패딩 추가
  const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
  // 디코딩
  const bytes = toByteArray(padded);
  return String.fromCharCode.apply(null, bytes);
};

// JWT 토큰 디코딩
const decodeJWT = (token: string): DecodedToken => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    const payload = JSON.parse(base64Decode(parts[1]));
    return payload as DecodedToken;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    throw error;
  }
};

// 토큰 저장
export const setToken = async (token: string): Promise<void> => {
  try {
    if (!token) {
      throw new Error('Token is required');
    }
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token:', error);
    throw error;
  }
};

// 토큰 가져오기 (디코딩된 형태로 반환)
export const getToken = async (): Promise<{ org_id: string; device_code: string } | null> => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    
    if (!token) {
      console.log("No token found in storage");
      return null;
    }

    const decoded = decodeJWT(token);
    return {
      org_id: decoded.org_id,
      device_code: decoded.device_code
    };
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// device_code 저장
export const setDeviceCode = async (deviceCode: string): Promise<void> => {
  try {
    if (!deviceCode) {
      throw new Error('Device code is required');
    }
    await AsyncStorage.setItem(DEVICE_CODE_KEY, deviceCode);
  } catch (error) {
    console.error('Error saving device code:', error);
    throw error;
  }
};

// device_code 가져오기
export const getDeviceCode = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(DEVICE_CODE_KEY);
  } catch (error) {
    console.error('Error getting device code:', error);
    return null;
  }
};

// 토큰 삭제 (로그아웃 시 사용)
export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(DEVICE_CODE_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
    throw error;
  }
};

// 토큰 존재 여부 확인
export const hasToken = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return token !== null;
  } catch (error) {
    console.error('Error checking token:', error);
    return false;
  }
};
