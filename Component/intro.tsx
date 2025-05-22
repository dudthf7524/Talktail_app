import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Intro: undefined;
  Login: undefined;
  SignUp: undefined;
  Dashboard: undefined;
  DetailTemp: undefined;
  DetailHeart: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;


const Intro = () => {
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }, 4000);  

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/images/intro.mp4')}
        style={styles.video}
        resizeMode="contain"
        repeat={false}
        muted={false}
        playInBackground={false}
        playWhenInactive={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  video: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default Intro;

