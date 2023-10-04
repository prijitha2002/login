import 'react-native-get-random-values';
import React, { useEffect } from 'react';
import Parse from 'parse/react-native';
import Navigation from './Navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Parse before rendering the app
Parse.setAsyncStorage(AsyncStorage);
Parse.initialize('Ac0Gd56taUyJq0RaQeroXLerpAhPGZVEsrBewuXB', 'lcUW1Yxoby7moIJm2jLHfc30VAHg0nIKSljw6MsG');
Parse.serverURL = 'https://parseapi.back4app.com/';

function App() {
  useEffect(() => {
    // Any code that depends on Parse can be placed here

    // Example: Query Parse data
    const query = new Parse.Query('YourParseClassName');
    query.find().then((results) => {
      // Handle the query results here
      console.log('Parse Query Results:', results);
    }).catch((error) => {
      if (error.code === 209) {
        // Handle the "Invalid session token" error here
        // Clear the existing session token
        Parse.User.logOut();
        // Redirect the user to the login screen
        // You should replace 'Login' with the name of your login screen
        // Ensure that you have a navigation mechanism set up to navigate to the login screen
        // Also, consider displaying an error message to the user
        // to inform them that they need to log in again.
        navigation.navigate('Login');
      } else {
        // Handle other errors
        console.error('Parse Query Error:', error);
      }
    });
  }, []);

  return <Navigation />;
}

export default App;
