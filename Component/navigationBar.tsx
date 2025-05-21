import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Dashboard: undefined;
  ConnectBle: undefined;
  PetList: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const NavigationBar: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Pressable 
        style={styles.button}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text style={styles.buttonText}>개목록</Text>
      </Pressable>
      <Pressable 
        style={styles.button}
        onPress={() => navigation.navigate('Record')}
      >
        <Text style={styles.buttonText}>데이터목록</Text>
      </Pressable>
      {/* <Pressable 
        style={styles.button}
        onPress={() => navigation.navigate('PetList')}
      >
        <Text style={styles.buttonText}></Text>
      </Pressable>
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}></Text>
      </Pressable>
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}></Text>
      </Pressable> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
  },
  button: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 12,
    color: '#666',
  },
});

export default NavigationBar; 