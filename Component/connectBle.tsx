import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from './header';
import NavigationBar from './navigationBar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  ConnectBle: undefined;
  Dashboard: {
    selectedPet: {
      name: string;
      gender: string;
      birthDate: string;
      breed: string;
      isNeutered: boolean;
      diseases: string;
    };
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ConnectBle: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isScanning, setIsScanning] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Mock device list
  const mockDevices = [
    { id: '1', name: 'Zephy45' },
    { id: '2', name: 'Zephy46' },
    { id: '3', name: 'Zephy47' },
  ];

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning delay
    setTimeout(() => {
      setIsScanning(false);
    }, 2000);
  };

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevice(deviceId);
    // Simulate connection delay
    setTimeout(() => {
      setIsConnected(true);
    }, 2000);
  };

  const handleDisconnect = () => {
    setSelectedDevice(null);
    setIsConnected(false);
  };

  const handleMonitoring = () => {
    // Mock pet data for navigation
    const mockPetData = {
      name: '멍멍이',
      gender: 'male',
      birthDate: '2020-05-15',
      breed: '리트리버',
      isNeutered: true,
      diseases: '심장사상충, 슬개골 탈구',
    };
    
    navigation.navigate('Dashboard', {
      selectedPet: mockPetData
    });
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
            {mockDevices.map((device) => (
              <TouchableOpacity
                key={device.id}
                style={[
                  styles.deviceItem,
                  selectedDevice === device.id && styles.selectedDevice,
                  isConnected && selectedDevice === device.id && styles.connectedDevice,
                ]}
                onPress={() => handleDeviceSelect(device.id)}
              >
                <Text style={styles.deviceName}>{device.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <TouchableOpacity
          style={[
            styles.scanButton,
            isConnected && styles.disconnectButton,
          ]}
          onPress={isConnected ? handleDisconnect : handleScan}
        >
          <Text style={styles.buttonText}>
            {isConnected ? '디바이스 연결 끊기' : '주변 기기 탐색'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.monitoringButton}
          onPress={handleMonitoring}
        >
          <Text style={styles.buttonText}>모니터링 하기</Text>
        </TouchableOpacity>
      </SafeAreaView>
      <NavigationBar />
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
});

export default ConnectBle; 