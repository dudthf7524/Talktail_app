import React, { useEffect } from 'react';
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BLEProvider } from './Component/BLEContext';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { AppState, NativeModules, PermissionsAndroid, Platform, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Login from './Component/logIn';
import SignUp from './Component/sign';
import Dashboard from './Component/dashboard';
import DetailTemp from './Component/detailTemp';
import DetailHeart from './Component/detailHeart';
import Intro from './Component/intro';
import RegisterPet from './Component/registerPet';
import PetLists from './Component/petLists';
import ConnectBle from './Component/connectBle';
import EditPet from './Component/editPet';
import Record from './Component/record';
import Mypage from './Component/mypage';
import MypageChangeInfo from './Component/mypageChangeInfo';
import MypageChangePW from './Component/mypageChangePW';
import MypageAgree from './Component/mypageAgree';
import MypageOut from './Component/mypageOut';
import Board from './Component/board';
import BoardDetail from './Component/boardDetail';
import CustomerService from './Component/customerService';
import BatteryTest from './Component/BatteryTest';
import { RootStackParamList } from './types/navigation';
import './backgroundEventHandler';
import Orientation from 'react-native-orientation-locker';
export const navigationRef = createNavigationContainerRef();

const Stack = createNativeStackNavigator<RootStackParamList>();

async function requestNotificationPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log('🔕 알림 권한 거부됨');
      return false;
    } else {
      console.log('🔔 알림 권한 허용됨');
      return true;
    }
  }
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    console.log('iOS 권한 상태:', authStatus);
  }
  return true;
}
const shownMessages = new Set();
async function setupNotifications() {
  await notifee.createChannel({
    id: 'riders',
    name: '앱 전반',
    sound: 'default',
    importance: AndroidImportance.HIGH,
  });

  await messaging().requestPermission();
  if (Platform.OS === 'ios') {
    await notifee.requestPermission();
  }



  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('aaaaa')
    console.log(remoteMessage)
    if (shownMessages.has(remoteMessage.messageId)) return;
    shownMessages.add(remoteMessage.messageId);
    await notifee.displayNotification({
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      android: {
        channelId: 'riders',
        pressAction: {
          id: 'default', // 반드시 id 지정 (대부분 'default' 사용)
        },
      },
      data: { screen: remoteMessage.data?.screen ?? '' },
    });
  });

  messaging().onMessage(async remoteMessage => {
    console.log('aaaaa')
    console.log(remoteMessage)
    if (shownMessages.has(remoteMessage.messageId)) return;
    shownMessages.add(remoteMessage.messageId);
    await notifee.displayNotification({
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      android: {
        channelId: 'riders',
        pressAction: {
          id: 'default', // 반드시 id 지정 (대부분 'default' 사용)
        },
      },
      data: { screen: remoteMessage.data?.screen ?? '' },
    });
  });
}

function setupNotificationNavigationHandlers() {
  console.log('aaaaa')
  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      const screen = detail.notification?.data?.screen;
      if (screen && navigationRef.isReady()) {
        navigationRef.navigate(screen);
      }
    }
  });

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('aaaa')
    const screen = remoteMessage?.data?.screen;
    console.log(screen)
    if (screen && navigationRef.isReady()) {
      navigationRef.navigate(screen);
    }
  });

  messaging().getInitialNotification().then(remoteMessage => {
    console.log('aaa')
    const screen = remoteMessage?.data?.screen;
    console.log(remoteMessage)
    console.log(screen)

    if (screen) {
      const interval = setInterval(() => {
        if (navigationRef.isReady()) {
          navigationRef.navigate(screen);
          clearInterval(interval);
        }
      }, 300);
    }
  });
}

function handleInitialNotification() {
  console.log('aaa')
  messaging().getInitialNotification().then(remoteMessage => {
    if (remoteMessage) {
      const screen = remoteMessage?.data?.screen;
      console.log(screen)
      if (screen) {
        navigationRef.navigate(screen);
      }
    }
  });
}


const App = () => {
  useEffect(() => {
    messaging().setAutoInitEnabled(true);
    requestNotificationPermission();
    setupNotifications();
    setupNotificationNavigationHandlers();


  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      NativeModules.MyServiceStarter.startService();
    }
  }, []);


  useEffect(() => {
    const subscription = AppState.addEventListener('change', async nextAppState => {
      if (nextAppState === 'active') {
        try {
          const isRunning = await NativeModules.MyServiceStarter.isServiceRunning?.();
          console.log('[서비스 상태]', isRunning);
          if (!isRunning && Platform.OS === 'android') {
            console.log('[서비스 재시작]');
            NativeModules.MyServiceStarter.startService();
          }
        } catch (e) {
          console.error('서비스 상태 확인 실패', e);
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // const portraitScreens = ['Login', 'Intro'];
  // if (portraitScreens.includes(currentScreen)) {
  //   Orientation.lockToPortrait();
  // } else {
  //   Orientation.unlockAllOrientations();
  // }

  useEffect(() => {
    const unsubscribe = navigationRef.addListener('state', () => {
      const currentRoute = navigationRef.getCurrentRoute();
      const currentScreen = currentRoute?.name;

      if (currentScreen === 'Login') {
        Orientation.lockToPortrait();
      } else {
        Orientation.unlockAllOrientations();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <BLEProvider>
        <NavigationContainer ref={navigationRef} onReady={handleInitialNotification}>
          <Stack.Navigator
            initialRouteName="Intro"
            screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFFFFF' } }}
          >
            <Stack.Screen name="Intro" component={Intro} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="DetailTemp" component={DetailTemp} />
            <Stack.Screen name="DetailHeart" component={DetailHeart} />
            <Stack.Screen name="RegisterPet" component={RegisterPet} />
            <Stack.Screen name="PetLists" component={PetLists} />
            <Stack.Screen name="ConnectBle" component={ConnectBle} />
            <Stack.Screen name="EditPet" component={EditPet} />
            <Stack.Screen name="Record" component={Record} />
            <Stack.Screen name="Mypage" component={Mypage} />
            <Stack.Screen name="MypageChangeInfo" component={MypageChangeInfo} />
            <Stack.Screen name="MypageChangePW" component={MypageChangePW} />
            <Stack.Screen name="MypageAgree" component={MypageAgree} />
            <Stack.Screen name="MypageOut" component={MypageOut} />
            <Stack.Screen name="Board" component={Board} />
            <Stack.Screen name="BoardDetail" component={BoardDetail} />
            <Stack.Screen name="CustomerService" component={CustomerService} />
            <Stack.Screen name="BatteryTest" component={BatteryTest} />
          </Stack.Navigator>
        </NavigationContainer>
      </BLEProvider>
    </SafeAreaProvider>
  );
};

export default App;
