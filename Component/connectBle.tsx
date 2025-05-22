import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import Header from './header';
import NavigationBar from './navigationBar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BleManager from 'react-native-ble-manager';
import { NativeEventEmitter, NativeModules } from 'react-native';
import MessageModal from './modal/messageModal';
import AlertModal from "./modal/alertModal";
import { Buffer } from 'buffer';
import { useBLE } from './BLEContext';
import dayjs from 'dayjs';

type RootStackParamList = {
  ConnectBle: {
    selectedPet: {
      device_code: string;
      pet_code: string;
      name: string;
      gender: boolean;
      birth: string;
      breed: string;
      isNeutered: boolean;
      disease: string;
    };
  };
  Dashboard: {
    selectedPet: {
      name: string;
      gender: boolean;
      birth: string;
      breed: string;
      isNeutered: boolean;
      disease: string;
    };
  };
};

type ConnectBleScreenRouteProp = RouteProp<RootStackParamList, 'ConnectBle'>;

type Props = {
  route: ConnectBleScreenRouteProp;
};

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const SERVICE_UUID = 'a3c87500-8ed3-4bdf-8a39-a01bebede295';
const CHARACTERISTIC_UUID_RX = 'a3c87502-8ed3-4bdf-8a39-a01bebede295';

const ConnectBle = ({ route }: Props) => {
  
  const { selectedPet } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { dispatch, addChartData, collectData } = useBLE();
  const [isScanning, setIsScanning] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [peripherals, setPeripherals] = useState(new Map());
  const [openMessageModal, setOpenMessageModal] = useState(false);
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  const [dataBuffer, setDataBuffer] = useState<number[]>([]);

  useEffect(() => {
    // BLE 초기화
    BleManager.start({ showAlert: false })
      .then(() => {
        console.log('BLE Manager initialized');
      })
      .catch((error) => {
        console.error('BLE Manager initialization error:', error);
      });

    // 이벤트 리스너 등록
    const listeners = [
      bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral),
      bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan),
      bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic),
      bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectPeripheral),
    ];

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      listeners.forEach(listener => listener.remove());
      if (selectedDevice) {
        BleManager.disconnect(selectedDevice);
      }
    };
  }, []);

  const handleDiscoverPeripheral = (peripheral) => {
    // console.log('Discovered peripheral:', peripheral);
    if (peripheral.name === 'Zephy46') {
      setPeripherals(map => new Map(map.set(peripheral.id, {
        ...peripheral,
        connected: false
      })));
    }
  };

  const handleStopScan = () => {
    console.log('Scan stopped');
    setIsScanning(false);
  };

  const startScan = async () => {
    try {
      // 안드로이드 권한 체크
      if (Platform.OS === 'android') {
        await handleAndroidPermissions();
      }

      // 이미 스캔 중이면 중지
      if (isScanning) {
        BleManager.stopScan();
        setIsScanning(false);
        return;
      }

      // 스캔 시작
      setPeripherals(new Map());
      setIsScanning(true);
      setIsConnected(false);
      setIsSubscribed(false);
      setSelectedDevice(null);
      
      console.log('Starting scan...');
      BleManager.scan([], 10, true)
        .then(() => {
          console.log('Scan started');
        })
        .catch((error) => {
          console.error('Scan error:', error);
          setIsScanning(false);
        });
    } catch (error) {
      console.error('Error in startScan:', error);
      setIsScanning(false);
    }
  };

  const handleAndroidPermissions = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      
      if (result) {
        console.log('Android 12+ permissions granted');
      } else {
        console.error('Android 12+ permissions denied');
        // 권한 필요 모달 표시
        setModalContent({
          title: '권한 필요',
          content: '블루투스 스캔을 위해 권한이 필요합니다.'
        });
        setOpenMessageModal(true);
      }
    } else if (Platform.OS === 'android' && Platform.Version >= 23) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      
      if (result) {
        console.log('Android <12 permissions granted');
      } else {
        console.error('Android <12 permissions denied');
        // 권한 필요 모달 표시
        setModalContent({
          title: '권한 필요',
          content: '블루투스 스캔을 위해 위치 권한이 필요합니다.'
        });
        setOpenMessageModal(true);
      }
    }
  };

  const handleDeviceSelect = async (deviceId: string) => {
    try {
      await BleManager.connect(deviceId);
      
      // 연결 상태 업데이트
      setIsConnected(true);
      dispatch({type: 'CONNECT_DEVICE', payload: {startDate: dayjs().format('YYYYMMDD'), startTime: dayjs().format('HHmmss'), deviceCode: selectedPet.device_code, petCode: selectedPet.pet_code}})

      // peripherals 맵 업데이트
      setPeripherals(prevPeripherals => {
        const newPeripherals = new Map(prevPeripherals);
        const peripheral = newPeripherals.get(deviceId);
        if (peripheral) {
          newPeripherals.set(deviceId, { ...peripheral, connected: true });
        }
        return newPeripherals;
      });

      // 서비스 및 특성 검색
      const peripheralInfo = await BleManager.retrieveServices(deviceId);

      // 알림 시작
      await BleManager.startNotification(deviceId, SERVICE_UUID, CHARACTERISTIC_UUID_RX)
        .then(() => {
          console.log('Notification started on characteristic:', CHARACTERISTIC_UUID_RX);
          setIsSubscribed(true);
        })
        .catch(error => {
          console.error('Error starting notification:', error);
        });

      setModalContent({
        title: '연결 성공',
        content: '디바이스가 연결되었습니다.'
      });
      setOpenMessageModal(true);
    } catch (error) {
      console.error('Connection error:', error);
      setIsConnected(false);
      setIsSubscribed(false);
      setModalContent({
        title: '연결 실패',
        content: '디바이스 연결에 실패했습니다.'
      });
      setOpenMessageModal(true);
    }
  };

  const handleUpdateValueForCharacteristic = (data: any) => {
    const value = data.value;
    const decodedValue = Buffer.from(value, 'base64').toString('utf-8');
    
    const numbers = decodedValue.split(',').map(num => {
      const parsed = parseInt(num.trim());
      return isNaN(parsed) ? 0 : parsed;
    });
    if (numbers.length > 0 && !isNaN(numbers[0])) {
      addChartData(numbers[0]);
      collectData(numbers);
    }
  };

  const handleDisconnectPeripheral = (data: any) => {
    console.log('Device disconnected:', data.peripheral);
    setIsConnected(false);
    setIsSubscribed(false);
    setSelectedDevice(null);
    
    // peripherals 맵 업데이트
    setPeripherals(map => {
      const newMap = new Map(map);
      const peripheral = newMap.get(data.peripheral);
      if (peripheral) {
        newMap.set(data.peripheral, { ...peripheral, connected: false });
      }
      return newMap;
    });

    // 모달 표시를 setTimeout으로 감싸서 상태 업데이트 후 실행되도록 함
    setTimeout(() => {
      setModalContent({
        title: '연결 끊김',
        content: '디바이스와의 연결이 끊어졌습니다.'
      });
      setOpenMessageModal(true);
    }, 100);
  };

  // 컴포넌트 언마운트 시 남은 데이터 처리
  useEffect(() => {
    return () => {
      if (dataBuffer.length > 0) {
        collectData(dataBuffer);
      }
    };
  }, [dataBuffer]);

  const handleDisconnect = async () => {
    if (selectedDevice) {
      try {
        // 구독 중지
        if (isSubscribed) {
          const peripheralInfo = await BleManager.retrieveServices(selectedDevice);
          if (peripheralInfo.services && peripheralInfo.characteristics) {
            for (const service of peripheralInfo.services) {
              const characteristics = peripheralInfo.characteristics[service.uuid];
              if (characteristics) {
                for (const characteristic of characteristics) {
                  if (characteristic.properties.Notify || characteristic.properties.Indicate) {
                    await BleManager.stopNotification(selectedDevice, service.uuid, characteristic.uuid);
                  }
                }
              }
            }
          }
          setIsSubscribed(false);
        }

        await BleManager.disconnect(selectedDevice);
        console.log('Disconnected from device:', selectedDevice);
        
        // 연결 해제 시 상태 업데이트
        setPeripherals(map => {
          const newMap = new Map(map);
          const peripheral = newMap.get(selectedDevice);
          if (peripheral) {
            newMap.set(selectedDevice, { ...peripheral, connected: false });
          }
          return newMap;
        });
      } catch (error) {
        console.error('Disconnection error:', error);
      }
    }
    setSelectedDevice(null);
    setIsConnected(false);
  };

  const handleMonitoring = () => {
    if(!isConnected) {
      setOpenAlertModal(true);
    } else {
      navigation.navigate('Dashboard', {
        selectedPet,
      });
    }
      // navigation.navigate('Dashboard');
    
  };

  return (
    <>
      <Header title="블루투스 연결" />
      <SafeAreaView style={styles.container}>
        <View style={styles.monitorBox}>
          <ScrollView 
            style={styles.deviceList}
            contentContainerStyle={styles.deviceListContent}
          >
            {Array.from(peripherals.values()).map((peripheral) => (
              <Pressable
                key={peripheral.id}
                style={({ pressed }) => [
                  styles.deviceItem,
                  selectedDevice === peripheral.id && styles.selectedDevice,
                  peripheral.connected && styles.connectedDevice,
                  pressed && styles.pressedDevice
                ]}
                onPress={() => handleDeviceSelect(peripheral.id)}
                disabled={peripheral.connected}
              >
                <Text style={styles.deviceName}>
                  {peripheral.name}
                  {peripheral.connected ? ' (연결됨)' : ''}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.scanButton,
            isConnected && styles.disconnectButton,
            pressed && styles.pressedButton
          ]}
          onPress={isConnected ? handleDisconnect : startScan}
        >
          <Text style={styles.buttonText}>
            {isConnected ? '디바이스 연결 끊기' : (isScanning ? '탐색 중...' : '주변 기기 탐색')}
          </Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.monitoringButton,
            pressed && styles.pressedButton
          ]}
          onPress={handleMonitoring}
        >
          <Text style={styles.buttonText}>모니터링 하기</Text>
        </Pressable>
        {/* <Pressable
          style={({ pressed }) => [
            styles.monitoringButton,
            pressed && styles.pressedButton
          ]}
          onPress={handleMonitoring}
        >
          <Text style={styles.buttonText}>{isConnected ? '연결 중' : '연결 안중'}</Text>
        </Pressable> */}
      </SafeAreaView>
      <NavigationBar />
      <MessageModal
        visible={openMessageModal}
        title={modalContent.title}
        content={modalContent.content}
        onClose={() => setOpenMessageModal(false)}
      />  
      <AlertModal
        visible={openAlertModal}
        title="연결 오류"
        content="디바이스와의 연결을 확인해주세요."
        onClose={() => setOpenAlertModal(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  monitorBox: {
    width: '100%',
    height: 300,
    backgroundColor: '#F5B75C',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    padding: 15,
  },
  deviceList: {
    flex: 1,
  },
  deviceListContent: {
    alignItems: 'center',
  },
  deviceItem: {
    width: '90%',
    padding: 20,
    height: 70,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowRadius: 0.5,
    elevation: 0.01,
    justifyContent: 'center',
  },
  selectedDevice: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    shadowOpacity: 0.02,
    elevation: 0.8,
  },
  connectedDevice: {
    backgroundColor: '#FF8C6B',
    shadowOpacity: 0.02,
    elevation: 0.8,
  },
  deviceName: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  scanButton: {
    backgroundColor: '#F0663F',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  disconnectButton: {
    backgroundColor: '#F5B75C',
  },
  monitoringButton: {
    backgroundColor: '#F0663F',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  pressedDevice: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }]
  },
  pressedButton: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }]
  },
});

export default ConnectBle; 