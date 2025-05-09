import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
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

const { width, height } = Dimensions.get('window');

const Intro = () => {
  const navigation = useNavigation<NavigationProp>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const tailAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 페이드인 애니메이션
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // 스케일 애니메이션
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.elastic(1),
      useNativeDriver: true,
    }).start();

    // 슬라이드 애니메이션
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // 꼬리 애니메이션
    Animated.loop(
      Animated.sequence([
        Animated.timing(tailAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(tailAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 2.5초 후 종료
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // 꼬리 SVG 컴포넌트
  const Tail = () => (
    <Svg width="80" height="120" viewBox="0 0 80 120" fill="none">
      <Path
        d="M40 0C20 0 10 20 10 40C10 60 20 80 40 80C60 80 70 60 70 40C70 20 60 0 40 0Z"
        fill="#F5B75C"
      />
      <Path
        d="M40 80C20 80 10 100 10 120C10 140 20 160 40 160C60 160 70 140 70 120C70 100 60 80 40 80Z"
        fill="#F5B75C"
      />
      <Path
        d="M40 0C60 0 70 20 70 40C70 60 60 80 40 80C20 80 10 60 10 40C10 20 20 0 40 0Z"
        fill="#F5B75C"
        opacity="0.8"
      />
      <Path
        d="M40 80C60 80 70 100 70 120C70 140 60 160 40 160C20 160 10 140 10 120C10 100 20 80 40 80Z"
        fill="#F5B75C"
        opacity="0.6"
      />
    </Svg>
  );

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim },
            ],
          },
        ]}
      >
        <Text style={styles.title}>Tailing</Text>
        <Text style={styles.subtitle}>반려견과의 새로운 소통</Text>
        
        <Animated.View
          style={[
            styles.tailContainer,
            {
              transform: [
                {
                  rotate: tailAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['-30deg', '30deg'],
                  }),
                },
              ],
            },
          ]}
        >
          <Tail />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#F0663F',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    color: '#F5B75C',
    marginBottom: 24,
  },
  tailContainer: {
    marginTop: 20,
    transformOrigin: 'top',
  },
});

export default Intro;

