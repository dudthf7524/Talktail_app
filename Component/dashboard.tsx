import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
  Dimensions,
  ScrollView,
} from 'react-native';
import { RouteProp} from '@react-navigation/native';
import Header from "./header"
import NavigationBar from './navigationBar';

import DashboardInfo from './dashboardInfo';
import DashboardChart from './dashboardChart';
import DashboardData from './dashboardData';

type RootStackParamList = {
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
  DetailHeart: {
    hrData: number;
  };
  DetailTemp: {
    tempData: number;
  };
};

type DashboardScreenRouteProp = RouteProp<RootStackParamList, 'Dashboard'>;

const windowWidth = Dimensions.get('window').width;

import BleManager, {
  BleDisconnectPeripheralEvent,
 
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
    } else {
      console.log('Location permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

declare module 'react-native-ble-manager' {
  interface Peripheral {
    connected?: boolean;
    connecting?: boolean;
  }
}

const Dashboard = ({ route }: { route: DashboardScreenRouteProp }) => {
  const { selectedPet } = route.params;
  const [isScanning, setIsScanning] = useState(false);
  const [peripherals, setPeripherals] = useState(
    new Map<Peripheral['id'], Peripheral>(),
  );
  const [hrData, setHrData] = useState(0);
  const [spo2Data, setSpo2Data] = useState(0);
  const [tempData, setTempData] = useState(0);
  const [orientation, setOrientation] = useState('PORTRAIT');

  peripherals.get;

  const addOrUpdatePeripheral = (id: string, updatedPeripheral: Peripheral) => {
    setPeripherals(map => new Map(map.set(id, updatedPeripheral)));
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
 

  const handleDiscoverPeripheral = (peripheral: Peripheral) => {
    if (
      peripheral.name === 'Zephy45' ||
      peripheral.advertising.localName === 'Zephy45'
    ) {
      addOrUpdatePeripheral(peripheral.id, peripheral); 
    }
  };

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

  useEffect(() => {
    const { width, height } = Dimensions.get('window');
    setOrientation(width < height ? 'PORTRAIT' : 'LANDSCAPE');

    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setOrientation(window.width < window.height ? 'PORTRAIT' : 'LANDSCAPE');
    });

    return () => subscription.remove();
  }, []);

  return (
    <>
    {orientation === 'PORTRAIT' && <Header title="디바이스 모니터링" />}

    <ScrollView style={styles.container}>
      <DashboardInfo screen={orientation} pet={selectedPet}/>
      <DashboardChart screen={orientation}/>
      <DashboardData screen={orientation} data={{
        hrData : hrData,
        spo2Data : spo2Data,
        tempData : tempData,  
      }}/>
      {orientation === "PORTRAIT" ? (<View style={styles.portrait_view}><Text style={styles.portrait_text}>가로로 화면을 봐보세요.</Text></View>) : ""}
    </ScrollView>
    {orientation === 'PORTRAIT' && <NavigationBar />}
 
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 'auto',
  },
  ble_box: {
    width: '100%',
    height: 28,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  ble_status: {
    color: '#7b7b7b',
    fontSize: 12,
    fontWeight: '400',
  },
  ble_icon: {
    width: 28,
    height: 28,
  },

  basic_info: {
    width: '100%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  basic_icon: {
    width: 24,
    height: 24,
    marginRight: 4,
  },
  basic_text: {
    fontSize: 16,
    fontWeight: '400',
    color: "#262626"
  },
  article_box: {
    width: '100%',
    height: 52,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
    position: 'relative',
  },
  icon_box: {
    width: 105,
    height: 24,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  detail: {
    fontSize: 12,
    fontWeight: '400',
    color: '#262626',
    marginLeft: 'auto',
  },
  box_line: {
    width: '100%',
    height: 1,
    backgroundColor: '#F5B75C',
  },
  title: {
    width: '100%',
    marginTop: 40,
    marginLeft: 60,
    fontSize: 30,
    fontWeight: '700',
    color: 'white',
    textAlign: 'left',
  },
  img_box: {
    width: '100%',
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
  },
  ble_touch: {
    width: 300,
    height: 300,
    borderWidth: 1,
    borderColor: 'white',
  },
  ble_img: {
    width: 300,
    height: 300,
  },
  ble_text: {
    fontSize: 15,
    color: 'white',
    marginTop: 20,
    textAlign: 'center',
  },
  btn_box: {
    paddingTop: 13,
  },
  back_btn: {
    fontSize: 12,
    color: '#12B6D1',
    fontWeight: 'bold',
    marginLeft: 31,
  },
  body: {
    alignItems: 'center',
  },
  scan_button: {
    width: 207,
    height: 41,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#12B6D1',
    marginTop: 22,
    borderRadius: 6,
  },
  input_box: {
    width: '80%',
    height: 41,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scan_button_text: {
    fontSize: 20,
    color: 'white',
  },
  list_box: {
    width: '90%',
    height: '25%',
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: '#2D7C9B',
    display: 'flex',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    marginBottom: 0,
  },
  row: {
    width: windowWidth * 0.8,
    height: 47,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 4,
    paddingRight: 14,
  },
  touch_box: {
    height: 47,
    marginTop: 15,
    marginBottom: 15,
  },
  icon: {
    width: 30,
    height: 30,
  },
  peripheral_name: {
    width: windowWidth * 0.55,
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  connecting: {
    width: 30,
    height: 30,
  },
  state: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  input_text: {
    width: '70%',
    height: 41,
    marginTop: 22,
    borderWidth: 1,
    borderColor: '#12B6D1',
    paddingLeft: 20,
  },
  chart_container: {
    width: '100%',
    height: 300,
    marginVertical: 20,
  },
  split_chart_container: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  half_chart: {
    flex: 1,
    height: '100%',
  },
  play_pause_button: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  play_pause_button_text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  portrait_view: {
    width: "100%",
    height: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  portrait_text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#262626",
  }
});
export default Dashboard;
