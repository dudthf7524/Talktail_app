import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    NativeEventEmitter,
    NativeModules,
    Platform,
    PermissionsAndroid,
    Alert,
} from 'react-native';
import BleManager, {
    Peripheral
} from 'react-native-ble-manager';
import { requestBleAndLocationPermissions } from './permissions';
import Header from './header';
import NavigationBar from './navigationBar';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const ConnectBleIos: React.FC = () => {
    const [peripherals, setPeripherals] = useState<Map<string, Peripheral>>(new Map());
    const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const [connectedDeviceId, setConnectedDeviceId] = useState<string | null>(null);

    useEffect(() => {
        BleManager.start({ showAlert: false });
        requestBleAndLocationPermissions();

        const discoverListener = bleManagerEmitter.addListener(
            'BleManagerDiscoverPeripheral',
            handleDiscoverPeripheral
        );
        const connectListener = bleManagerEmitter.addListener(
            'BleManagerConnectPeripheral',
            handleConnectPeripheral
        );
        const disconnectListener = bleManagerEmitter.addListener(
            'BleManagerDisconnectPeripheral',
            handleDisconnectPeripheral
        );

        return () => {
            discoverListener.remove();
            connectListener.remove();
            disconnectListener.remove();
        };
    }, []);

    const handleDiscoverPeripheral = (peripheral: Peripheral) => {
        if (!peripheral.name) peripheral.name = '이름 없음';
        setPeripherals((prev) => new Map(prev.set(peripheral.id, peripheral)));
    };

    const handleConnectPeripheral = (data: { peripheral: string }) => {
        console.log('✅ 연결됨:', data.peripheral);
        setConnectedDeviceId(data.peripheral);
        setPeripherals((prev) => {
            const updated = new Map(prev);
            const device = updated.get(data.peripheral);
            if (device) (device as any).connected = true; // 타입 강제 (BleManager에서는 `connected` 안줌)
            return updated;
        });
    };

    const handleDisconnectPeripheral = (data: { peripheral: string }) => {
        console.log('⛔ 연결 해제됨:', data.peripheral);
        setConnectedDeviceId(null);
        setPeripherals((prev) => {
            const updated = new Map(prev);
            const device = updated.get(data.peripheral);
            if (device) (device as any).connected = false;
            return updated;
        });
    };

    const startScan = () => {
        if (!isScanning) {
            setPeripherals(new Map());
            setIsScanning(true);
            BleManager.scan([], 5, true)
                .then(() => {
                    console.log('🔍 BLE 스캔 시작');
                })
                .catch((err) => {
                    console.warn('스캔 오류:', err);
                })
                .finally(() => {
                    setTimeout(() => setIsScanning(false), 5000);
                });
        }
    };

    const connectToDevice = (deviceId: string) => {
        setSelectedDevice(deviceId);
        BleManager.connect(deviceId)
            .then(() => {
                console.log('🔗 연결 시도:', deviceId);
                setConnectedDeviceId(deviceId);
            })
            .catch((error) => {
                console.warn('❌ 연결 실패:', error);
                Alert.alert('연결 실패', '기기 연결 중 오류가 발생했습니다.');
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
                        {Array.from(peripherals.values()).map((peripheral) => {
                            const isConnected = (peripheral as any).connected;
                            return (
                                <TouchableOpacity
                                    key={peripheral.id}
                                    style={[
                                        styles.deviceItem,
                                        selectedDevice === peripheral.id && styles.selectedDevice,
                                        isConnected && styles.connectedDevice,
                                    ]}
                                    onPress={() => connectToDevice(peripheral.id)}
                                    disabled={isConnected}
                                >
                                    <Text style={styles.deviceName}>
                                        {peripheral.name}
                                        {isConnected ? ' (연결됨)' : ''}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
                <TouchableOpacity style={styles.scanButton} onPress={startScan}>
                    <Text style={styles.buttonText}>
                        {isScanning ? '탐색 중...' : '주변 기기 탐색'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.monitoringButton}
                    onPress={() => {
                        if (!connectedDeviceId) {
                            Alert.alert('연결 필요', '먼저 기기를 연결하세요.');
                            return;
                        }
                        console.log('📡 모니터링 시작');
                    }}
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
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
    },
    selectedDevice: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    connectedDevice: {
        backgroundColor: '#FF8C6B',
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

export default ConnectBleIos;
