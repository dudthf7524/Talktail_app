import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import { API_URL } from './constant/contants';

const DownloadData = () => {
  const [isSaving, setIsSaving] = useState(false);

  // 현재 시간을 YYYYMMDD-HHmmss 형식으로 반환 (한국 시간)
  const getCurrentTimestamp = () => {
    const now = new Date();
    // 한국 시간으로 변환 (UTC+9)
    const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    
    const year = koreaTime.getUTCFullYear();
    const month = String(koreaTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(koreaTime.getUTCDate()).padStart(2, '0');
    const hours = String(koreaTime.getUTCHours()).padStart(2, '0');
    const minutes = String(koreaTime.getUTCMinutes()).padStart(2, '0');
    const seconds = String(koreaTime.getUTCSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}-${hours}${minutes}${seconds}`;
  };

  // 더미 데이터 생성 함수
  const generateDummyData = () => {
    const data: string[] = [];
    const baseTimestamp = new Date();
    // 한국 시간으로 변환 (UTC+9)
    const koreaBaseTime = new Date(baseTimestamp.getTime() + (9 * 60 * 60 * 1000));
    
    for (let i = 0; i < 30; i++) {
      // 각 데이터 포인트마다 1초씩 증가하는 타임스탬프 (한국 시간)
      const timestamp = new Date(koreaBaseTime.getTime() + (i * 1000));
      
      const year = timestamp.getUTCFullYear();
      const month = String(timestamp.getUTCMonth() + 1).padStart(2, '0');
      const day = String(timestamp.getUTCDate()).padStart(2, '0');
      const hours = String(timestamp.getUTCHours()).padStart(2, '0');
      const minutes = String(timestamp.getUTCMinutes()).padStart(2, '0');
      const seconds = String(timestamp.getUTCSeconds()).padStart(2, '0');
      
      const timeStr = `${year}${month}${day}-${hours}${minutes}${seconds}`;
      
      // 0-100 사이의 랜덤 숫자 두 개 생성
      const ir = Math.floor(Math.random() * 101);
      const red = Math.floor(Math.random() * 101);
      
      // time, ir, red 순서로 데이터 생성
      data.push(`${timeStr},${ir},${red}`);
    }
    return data;
  };

  // CSV 데이터 생성
  const createCSVData = (dummyData: string[]) => {
    const csvRows = ['time,ir,red']; // 헤더
    csvRows.push(...dummyData); // 데이터 추가
    return csvRows.join('\n');
  };

  // 데이터 저장 테스트
  const testSaveData = async () => {
    try {
      setIsSaving(true);
      
      // 더미 데이터 생성
      const dummyData = generateDummyData();
      const csvData = createCSVData(dummyData);
      
      // 파일명 생성 (예: DEVICE001_PET001_20240315-143022.csv)
      const timestamp = getCurrentTimestamp();
      const filename = `DEVICE001_PET002_${timestamp}.csv`;

      // 백엔드로 데이터 전송
      const response = await axios.post(`${API_URL}/data/save`, {
        filename,
        data: csvData
      });

      console.log('Data saved successfully:', response.data);
      alert('데이터가 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('데이터 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>데이터 저장 테스트</Text>
        <TouchableOpacity 
          style={[styles.button, isSaving && styles.buttonDisabled]}
          onPress={testSaveData}
          disabled={isSaving}
        >
          <Text style={styles.buttonText}>
            {isSaving ? '저장 중...' : '더미 데이터 저장 테스트'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333333',
  },
  button: {
    backgroundColor: '#F0663F',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default DownloadData;