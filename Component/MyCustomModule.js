import { NativeModules, NativeEventEmitter } from 'react-native';

const { MyCustomModule } = NativeModules;

const eventEmitter = new NativeEventEmitter(MyCustomModule);
const subscription = eventEmitter.addListener('onRotate', (event) => {
  console.log('화면 회전 감지됨!', event);
});

// 필요할 때 unsubscribe
// subscription.remove();
