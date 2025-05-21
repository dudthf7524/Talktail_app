/**
 * Sample BLE React Native App
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
  FlatList,
  TouchableHighlight,
  Pressable,
  Dimensions,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {LineChart} from 'react-native-chart-kit';
const SECONDS_TO_SCAN_FOR = 7;
const SERVICE_UUIDS: string[] = [];
// const SERVICE_UUID = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
const SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const CHARACTERISTIC_UUID_RX = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E';
// const CHARACTERISTIC_UUID_TX = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E';
const CHARACTERISTIC_UUID_TX = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
const targetDeviceId = 'F4:12:FA:41:96:A1';
const targetDeviceName = 'BLE_test_esp32s3';
const ALLOW_DUPLICATES = true;

import BleManager, {
  BleDisconnectPeripheralEvent,
  BleManagerDidUpdateValueForCharacteristicEvent,
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
  Peripheral,
} from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message:
          'App needs access to your location for Bluetooth functionality.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Location permission granted');
      // 위치 권한이 부여되었습니다. BLE 작업을 계속할 수 있습니다.
    } else {
      console.log('Location permission denied');
      // 위치 권한이 거부되었습니다. 적절한 처리를 해야 합니다.
    }
  } catch (err) {
    console.warn(err);
  }
}

declare module 'react-native-ble-manager' {
  // enrich local contract with custom state properties needed by App.tsx
  interface Peripheral {
    connected?: boolean;
    connecting?: boolean;
  }
}
let cnt = 0;
const App = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [peripherals, setPeripherals] = useState(
    new Map<Peripheral['id'], Peripheral>(),
  );
  const [rawDatas, setRawDatas] = useState(0);
  const [graphDatas, setGraphDatas] = useState<number[]>([
    50, 50, 50, 50, 50, 50,
  ]);
  const [graphLabels, setGraphLabels] = useState([
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
  ]);

  // console.debug('peripherals map updated', [...peripherals.entries()]);
  peripherals.get;

  const addOrUpdatePeripheral = (id: string, updatedPeripheral: Peripheral) => {
    // new Map() enables changing the reference & refreshing UI.
    // TOFIX not efficient.
    setPeripherals(map => new Map(map.set(id, updatedPeripheral)));
  };

  const startScan = () => {
    cnt = 1;
    if (!isScanning) {
      // reset found peripherals before scan
      setPeripherals(new Map<Peripheral['id'], Peripheral>());
      try {
        console.debug('[startScan] starting scan...');
        setIsScanning(true);
        BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
          matchMode: BleScanMatchMode.Sticky,
          scanMode: BleScanMode.LowLatency,
          callbackType: BleScanCallbackType.AllMatches,
        })
          .then(() => {
            console.debug('[startScan] scan promise returned successfully.');
          })
          .catch(err => {
            console.error('[startScan] ble scan returned in error', err);
          });
      } catch (error) {
        console.error('[startScan] ble scan error thrown', error);
      }
    }
  };

  const handleStopScan = () => {
    setIsScanning(false);
    console.debug('[handleStopScan] scan is stopped.');
  };

  const handleDisconnectedPeripheral = (
    event: BleDisconnectPeripheralEvent,
  ) => {
    let peripheral = peripherals.get(event.peripheral);
    if (peripheral) {
      console.debug(
        `[handleDisconnectedPeripheral][${peripheral.id}] previously connected peripheral is disconnected.`,
        event.peripheral,
      );
      addOrUpdatePeripheral(peripheral.id, {...peripheral, connected: false});
    }
    console.debug(
      `[handleDisconnectedPeripheral][${event.peripheral}] disconnected.`,
    );
  };

  const handleUpdateValueForCharacteristic = (
    data: BleManagerDidUpdateValueForCharacteristicEvent,
  ) => {
    const parts = data.value
      .toString()
      .split(',')
      .map(part => parseInt(part.trim(), 10));
    const number1 = parts[0];
    setRawDatas(number1);
    // console.debug(
    //   `[handleUpdateValueForCharacteristic] received data from '${data.peripheral}' with characteristic='${data.characteristic}' and value='${data.value}'`,
    // );

    // if (graphLabels.length < 20) {
    //   console.log('20 이하 ', graphDatas.length);
    //   setGraphDatas(prevGraphDatas => [...prevGraphDatas, number1]);
    //   setGraphLabels(prevGraphLabels => [...prevGraphLabels, cnt]);
    // } else {
    //   console.log(graphDatas.length);
    //   setGraphDatas(prevGraphDatas => {
    //     const newGraphDatas = [...prevGraphDatas.slice(1), number1]; // 새 배열을 생성하고 데이터 추가
    //     return newGraphDatas; // 새로운 배열을 반환
    //   });

    //   setGraphLabels(prevGraphLabels => {
    //     const newGraphLabels = [...prevGraphLabels.slice(1), cnt]; // 새 배열을 생성하고 레이블 추가
    //     return newGraphLabels;
    //   });
    // }
    // cnt++;
  };

  useEffect(() => {
    if (graphLabels.length < 15) {
      setGraphDatas(prevGraphDatas => [...prevGraphDatas, rawDatas]);
      setGraphLabels(prevGraphLabels => [...prevGraphLabels, cnt]);
    } else {
      setGraphDatas(prevGraphDatas => {
        const newGraphDatas = [...prevGraphDatas.slice(1), rawDatas]; // 새 배열을 생성하고 데이터 추가
        return newGraphDatas; // 새로운 배열을 반환
      });

      setGraphLabels(prevGraphLabels => {
        const newGraphLabels = [...prevGraphLabels.slice(1), cnt]; // 새 배열을 생성하고 레이블 추가
        return newGraphLabels;
      });
    }
    cnt++;
  }, [rawDatas]);

  const handleDiscoverPeripheral = (peripheral: Peripheral) => {
    // console.debug('[handleDiscoverPeripheral] new BLE peripheral=', peripheral);
    // if (!peripheral.name) {
    //   peripheral.name = 'NO NAME1';
    // }
    // addOrUpdatePeripheral(peripheral.id, peripheral);
    if (peripheral.name === targetDeviceName) {
      addOrUpdatePeripheral(peripheral.id, peripheral);
    }
  };

  const togglePeripheralConnection = async (peripheral: Peripheral) => {
    if (peripheral && peripheral.connected) {
      try {
        await BleManager.disconnect(peripheral.id);
      } catch (error) {
        console.error(
          `[togglePeripheralConnection][${peripheral.id}] error when trying to disconnect device.`,
          error,
        );
      }
    } else {
      await connectPeripheral(peripheral);
      // await connectToDevice(peripheral);
    }
  };

  const retrieveConnected = async () => {
    try {
      const connectedPeripherals = await BleManager.getConnectedPeripherals();
      if (connectedPeripherals.length === 0) {
        console.warn('[retrieveConnected] No connected peripherals found.');
        return;
      }

      console.debug(
        '[retrieveConnected] connectedPeripherals',
        connectedPeripherals,
      );

      for (var i = 0; i < connectedPeripherals.length; i++) {
        var peripheral = connectedPeripherals[i];
        addOrUpdatePeripheral(peripheral.id, {...peripheral, connected: true});
      }
    } catch (error) {
      console.error(
        '[retrieveConnected] unable to retrieve connected peripherals.',
        error,
      );
    }
  };

  const connectPeripheral = async (peripheral: Peripheral) => {
    try {
      if (peripheral) {
        addOrUpdatePeripheral(peripheral.id, {...peripheral, connecting: true});
        // console.log('연결 상태 : ', peripherals.get(targetDeviceId).connected);
        await BleManager.connect(peripheral.id);
        console.debug(`[connectPeripheral][${peripheral.id}] connected.`);

        addOrUpdatePeripheral(peripheral.id, {
          ...peripheral,
          connecting: false,
          connected: true,
        });
        await BleManager.checkState().then(state =>
          console.log(`current BLE state = '${state}'.`),
        );
        console.debug(`[connectPeripheral][${peripheral.id}] connected.`);
        await BleManager.startNotification(
          peripheral.id,
          '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
          '6e400003-b5a3-f393-e0a9-e50e24dcca9e',
        )
          .then(() => {
            // Success code
            console.log('Notification started');
          })
          .catch(error => {
            // Failure code
            console.log('에러는 : ', error);
          });

        await sleep(900);

        /* Test read current RSSI value, retrieve services first */
        const peripheralData = await BleManager.retrieveServices(peripheral.id);
        console.debug(
          `[connectPeripheral][${peripheral.id}] retrieved peripheral services`,
          peripheralData,
        );

        const rssi = await BleManager.readRSSI(peripheral.id);
        console.debug(
          `[connectPeripheral][${peripheral.id}] retrieved current RSSI value: ${rssi}.`,
        );

        if (peripheralData.characteristics) {
          for (let characteristic of peripheralData.characteristics) {
            if (characteristic.descriptors) {
              for (let descriptor of characteristic.descriptors) {
                try {
                  let data = await BleManager.readDescriptor(
                    peripheral.id,
                    characteristic.service,
                    characteristic.characteristic,
                    descriptor.uuid,
                  );
                  console.debug(
                    `[connectPeripheral][${peripheral.id}] descriptor read as:`,
                    data,
                  );
                } catch (error) {
                  console.error(
                    `[connectPeripheral][${peripheral.id}] failed to retrieve descriptor ${descriptor} for characteristic ${characteristic}:`,
                    error,
                  );
                }
              }
            }
          }
        }
        console.log('peripheral.connected : ', peripheral.connected);
        let p = peripherals.get(peripheral.id);
        if (p) {
          addOrUpdatePeripheral(peripheral.id, {...peripheral, rssi});
        }
      }
    } catch (error) {
      console.error(
        `[connectPeripheral][${peripheral.id}] connectPeripheral error`,
        error,
      );
      console.log('연결에 실패했다.');
    }
  };

  function sleep(ms: number) {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  }

  useEffect(() => {
    try {
      BleManager.start({showAlert: false})
        .then(() => {
          console.debug('BleManager started.');
          requestLocationPermission();
        })
        .catch(error =>
          console.error('BeManager could not be started.', error),
        );
    } catch (error) {
      console.error('unexpected error starting BleManager.', error);
      return;
    }

    const listeners = [
      bleManagerEmitter.addListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral,
      ),
      bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan),
      bleManagerEmitter.addListener(
        'BleManagerDisconnectPeripheral',
        handleDisconnectedPeripheral,
      ),
      bleManagerEmitter.addListener(
        'BleManagerDidUpdateValueForCharacteristic',
        handleUpdateValueForCharacteristic,
      ),
      bleManagerEmitter.addListener(
        'BleManagerConnectPeripheral',
        peripheral => {
          const isConnected = peripheral.connected;
          console.log('연결 상태 변경:', isConnected);

          // 연결 상태를 상태에 업데이트
          const updatedPeripheral = {
            ...peripheral,
            connected: isConnected,
          };
          addOrUpdatePeripheral(updatedPeripheral.id, updatedPeripheral);
        },
      ),
    ];

    handleAndroidPermissions();

    return () => {
      console.debug('[app] main component unmounting. Removing listeners...');
      for (const listener of listeners) {
        listener.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAndroidPermissions = () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]).then(result => {
        if (result) {
          console.debug(
            '[handleAndroidPermissions] User accepts runtime permissions android 12+',
          );
        } else {
          console.error(
            '[handleAndroidPermissions] User refuses runtime permissions android 12+',
          );
        }
      });
    } else if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(checkResult => {
        if (checkResult) {
          console.debug(
            '[handleAndroidPermissions] runtime permission Android <12 already OK',
          );
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(requestResult => {
            if (requestResult) {
              console.debug(
                '[handleAndroidPermissions] User accepts runtime permission android <12',
              );
            } else {
              console.error(
                '[handleAndroidPermissions] User refuses runtime permission android <12',
              );
            }
          });
        }
      });
    }
  };

  const renderItem = ({item}: {item: Peripheral}) => {
    if (item.id === targetDeviceId) {
      const backgroundColor = item.connected ? '#069400' : Colors.white;
      return (
        <TouchableHighlight
          underlayColor="#0082FC"
          onPress={() => {
            togglePeripheralConnection(item);
          }}
          key={item.id}>
          <View style={[styles.row, {backgroundColor}]}>
            <Text style={styles.peripheralName}>
              {item.name} - {item?.advertising?.localName}
              {item.connecting && ' - Connecting...'}
            </Text>
            <Text style={styles.rssi}>RSSI: {item.rssi}</Text>
            <Text style={styles.peripheralId}>{item.id}</Text>
          </View>
        </TouchableHighlight>
      );
    }
    return null;
  };

  const removeAllExceptSpecificDevice = deviceID => {
    // 새로운 맵을 생성하여 특정 디바이스 정보만을 포함시킵니다.
    const newPeripherals = new Map<Peripheral['id'], Peripheral>();

    // 원하는 디바이스 ID와 일치하는 디바이스를 찾습니다.
    const specificDevice = peripherals.get(deviceID);

    if (specificDevice) {
      newPeripherals.set(specificDevice.id, specificDevice);
      // 기존 peripherals 상태를 새로운 맵으로 업데이트합니다.
      setPeripherals(newPeripherals);
    } else {
      console.error(`Device with ID ${deviceID} not found.`);
    }
  };

  return (
    <>
      <StatusBar />
      <SafeAreaView style={styles.body}>
        <Pressable style={styles.scanButton} onPress={startScan}>
          <Text style={styles.scanButtonText}>
            {isScanning ? 'Scanning...' : 'Scan Bluetooth1'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.scanButton}
          onPress={() => {
            retrieveConnected;
            removeAllExceptSpecificDevice(targetDeviceId);
          }}>
          <Text style={styles.scanButtonText}>
            {'Retrieve connected peripherals'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.scanButton}
          onPress={() => {
            console.log(
              '연결되어있나? : ',
              peripherals.get(targetDeviceId)?.connected,
            );
            console.log('graphData : ', graphDatas);
            console.log('graphData : ', graphLabels);
            handleUpdateValueForCharacteristic;
          }}>
          <Text style={styles.scanButtonText}>Click</Text>
        </Pressable>

        <Pressable style={styles.scanButton}>
          <Text style={styles.scanButtonText}>
            <Text style={styles.scanButtonText}>{rawDatas}</Text>
          </Text>
        </Pressable>

        {Array.from(peripherals.values()).length === 0 && (
          <View style={styles.row}>
            <Text style={styles.noPeripherals}>
              No Peripherals, press "Scan Bluetooth" above.
            </Text>
          </View>
        )}

        <FlatList
          data={Array.from(peripherals.values())}
          contentContainerStyle={{rowGap: 12}}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
        <LineChart
          data={{
            labels: graphLabels,
            datasets: [
              {
                data: graphDatas,
                strokeWidth: 1,
              },
            ],
          }}
          xLabelsOffset={10}
          width={Dimensions.get('window').width} // from react-native
          height={220}
          withHorizontalLabels={false}
          withVerticalLabels={false}
          // xAxisLabel=""
          // fromZero={true}
          // yAxisLabel="$"
          // yAxisSuffix="k"
          yAxisLabel=""
          yAxisInterval={2}
          chartConfig={{
            width: 1,
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 0) => `#009111`,
            labelColor: (opacity = 1) => `black`,
            propsForDots: {
              r: '0',
              strokeWidth: '0',
              stroke: '#ffa726',
            },
            propsForBackgroundLines: {
              strokeWidth: 1,
            },
          }}
          bezier
          style={{
            borderRadius: 16,
            paddingRight: 2, // 오른쪽 여백 조절
            paddingLeft: 0, // 왼쪽 여백 조절
            paddingTop: 55, // 상단 여백 조절
          }}
        />
      </SafeAreaView>
    </>
  );
};

const boxShadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
};

const styles = StyleSheet.create({
  engine: {
    position: 'absolute',
    right: 10,
    bottom: 0,
    color: Colors.black,
  },
  scanButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#0a398a',
    margin: 10,
    borderRadius: 12,
    ...boxShadow,
  },
  scanButtonText: {
    fontSize: 20,
    letterSpacing: 0.25,
    color: Colors.white,
  },
  body: {
    backgroundColor: '#0082FC',
    flex: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  peripheralName: {
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
  },
  rssi: {
    fontSize: 12,
    textAlign: 'center',
    padding: 2,
  },
  peripheralId: {
    fontSize: 12,
    textAlign: 'center',
    padding: 2,
    paddingBottom: 20,
  },
  row: {
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 20,
    ...boxShadow,
  },
  noPeripherals: {
    margin: 10,
    textAlign: 'center',
    color: Colors.white,
  },
});

export default App;
