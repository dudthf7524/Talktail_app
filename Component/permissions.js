import { PermissionsAndroid, Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const requestBleAndLocationPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      ]);
      const allGranted = Object.values(granted).every(
        (result) => result === PermissionsAndroid.RESULTS.GRANTED
      );
      if (allGranted) {
        console.log('✅ Android BLE & 위치 권한 승인됨');
      } else {
        console.warn('❌ Android 권한 거부됨');
      }
    } catch (err) {
      console.warn('권한 요청 에러:', err);
    }
  } else if (Platform.OS === 'ios') {
    try {
      const bleStatus = await check(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);
      if (bleStatus !== RESULTS.GRANTED) {
        await request(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);
      }

      const locStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (locStatus !== RESULTS.GRANTED) {
        await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      }

      console.log('✅ iOS BLE & 위치 권한 요청 완료');
    } catch (error) {
      console.warn('iOS 권한 요청 실패:', error);
    }
  }
};
