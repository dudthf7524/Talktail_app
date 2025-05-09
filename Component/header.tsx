import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Image 
          source={require('../assets/images/arrow_left.png')}
          style={styles.backButtonImage}
        />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text> 
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0663F',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: '50%',
    left: 16,
    transform: [{ translateY: -12 }],
  },
  backButtonImage: {
    width: 29.4,
    height: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '400',
    color: '#FFF',

  },

});

export default Header; 