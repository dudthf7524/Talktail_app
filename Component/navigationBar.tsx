import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NavigationBar: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text style={styles.buttonText}>홈</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('ConnectBle')}
      >
        <Text style={styles.buttonText}>블루투스</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('PetList')}
      >
        <Text style={styles.buttonText}>반려동물</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>알림</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>설정</Text>
      </TouchableOpacity>
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