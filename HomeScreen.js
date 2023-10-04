import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Parse from 'parse/react-native';
import { useNavigation } from '@react-navigation/native';
import LoginScreen from './LoginScreen'; // Check the file path


const HomeScreen = ({ user }) => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await Parse.User.logOut();

      // To verify that the current user is now empty, you can use currentAsync
      const currentUser = await Parse.User.currentAsync();

      if (currentUser === null) {
        Alert.alert('Success!', 'No user is logged in anymore!');
        
        // Navigate back to the login screen
        navigation.navigate('Login');
      }
    } catch (error) {
      Alert.alert('Error!', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <Text style={styles.welcomeText}>Welcome, {user.get('username')}!</Text>
      ) : (
        <Text style={styles.welcomeText}>Welcome to the Home Screen!</Text>
      )}

      {/* Add your home screen content here */}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default HomeScreen;
