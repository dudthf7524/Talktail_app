import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { navigationRef } from './App';

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const screen = detail.notification?.data?.screen;
  console.log('🔙 [Notifee] Background event:', type);
  if (type === EventType.PRESS) {
    console.log('📩 백그라운드 알림 클릭됨 → 화면:', screen);
    // 화면 이동은 App.tsx의 getInitialNotification에서!
    if (screen && navigationRef.isReady()) {
      navigationRef.navigate(screen);  // 🔥 여기서 바로 이동
    }
  }

  // 선택: 알림 제거
  if (detail.notification?.id) {
    await notifee.cancelNotification(detail.notification.id);
  }
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('📩 [FCM] 백그라운드 수신:', remoteMessage);
});
