import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import POIDetails from '../components/Models/POIDetails';
import {NavigationContainer} from '@react-navigation/native';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="POIDetails">
        <Stack.Screen
          name="POIDetails"
          component={POIDetails}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
