import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BLEProvider } from './Component/BLEContext';
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
import DownloadData from './Component/downloadData';
import Record from './Component/record';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <BLEProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: '#FFFFFF'
            }
          }}
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
          <Stack.Screen name="DownloadData" component={DownloadData} />
          <Stack.Screen name="Record" component={Record} />
        </Stack.Navigator>
      </NavigationContainer>
    </BLEProvider>
  );
};

export default App;