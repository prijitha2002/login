// Navigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import HomeScreen from './HomeScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen'; // Import the ForgotPasswordScreen component

const Stack = createStackNavigator();

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
