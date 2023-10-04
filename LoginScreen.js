import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import Parse from 'parse/react-native';
import { useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

// LoginScreen component
function LoginScreen({ route }) {
  const navigation = useNavigation(); 
  const { control, handleSubmit, formState: { errors }, reset } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data) => {
    setLoading(true);

    try {
      const { emailOrMobile, password } = data;

      // Create a query to check if the input is either an email or a mobile number
      const emailQuery = new Parse.Query(Parse.User);
      emailQuery.equalTo('email', emailOrMobile.toLowerCase()); // Ensure case-insensitivity
      emailQuery.limit(1);

      const mobileQuery = new Parse.Query(Parse.User);
      mobileQuery.equalTo('mobileNumber', emailOrMobile);
      mobileQuery.limit(1);

      const mainQuery = Parse.Query.or(emailQuery, mobileQuery);
      const user = await mainQuery.first();

      if (!user) {
        throw new Error('User not found');
      }

      // Perform the login
      await Parse.User.logIn(user.get('username'), password);

      // Reset the form
      reset({
        emailOrMobile: '',
        password: '',
      });

      // Show a success message
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: `Welcome, ${user.get('username')}`,
        visibilityTime: 2000,
      });

      // Redirect to the HomeScreen
      navigation.reset({
        index: 0,
        routes: [{ name: 'HomeScreen', params: { user } }],
      });
    } catch (error) {
      console.error('Login error:', error);

      // Check for invalid session token error
      if (error.code === 209) {
        // Invalid session token, handle accordingly (e.g., re-authenticate user)
        console.error('Invalid session token. Re-authenticate user.');
      }

      // Show an error message for invalid credentials
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: 'Invalid email/mobile or password. Please try again.',
        visibilityTime: 2000,
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.spaceAboveContainer} />

      <View style={styles.inputAndButtonContainer}>
        <View style={styles.loginSignupButtons}>
          <TouchableOpacity
            style={[
              styles.touchableButton,
              route.name === 'Login' && styles.activeButton,
            ]}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.7}
          >
             <Text style={[
              styles.buttonText,
              route.name === 'Login<' && styles.activeButtonText,
            ]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.touchableButton,
              route.name === 'SignUp' && styles.activeButton,
            ]}
            onPress={() => navigation.navigate('SignUp')}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.buttonText,
              route.name === 'SignUp' && styles.activeButtonText,
            ]}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.header}>Let's Connect</Text>
          <Controller
            control={control}
            render={({ field }) => (
              <TextInput
                placeholder="Email or Mobile Number"
                value={field.value}
                onChangeText={field.onChange}
                style={[styles.input, errors.emailOrMobile && styles.inputError]}
                placeholderTextColor="#777777"
              />
            )}
            name="emailOrMobile"
            rules={{
              required: 'Email or Mobile Number is required',
            }}
            defaultValue=""
          />
          <Text style={styles.errorText}>{errors.emailOrMobile?.message}</Text>

          <Controller
            control={control}
            render={({ field }) => (
              <View style={styles.passwordInputContainer}>
                <TextInput
                  placeholder="Password"
                  value={field.value}
                  onChangeText={field.onChange}
                  secureTextEntry={!showPassword}
                  style={[styles.input, errors.password && styles.inputError]}
                  placeholderTextColor="#777777"
                />
                <TouchableOpacity
                  style={styles.eyeIconContainer}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Image
                    source={showPassword ? require('./eye-on.png') : require('./eye-off.png')}
                    style={styles.eyeIcon}
                  />
                </TouchableOpacity>
              </View>
            )}
            name="password"
            rules={{
              required: 'Password is required',
            }}
            defaultValue=""
          />
          <Text style={styles.errorText}>{errors.password?.message}</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleSubmit(handleLogin)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.loginButtonText}>Join in</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.ortext}>or</Text>

          <View style={styles.socialIconsContainer}>
            <TouchableOpacity
              style={styles.socialIcon}
              onPress={() => {
                // Add your social media login logic here (e.g., Google)
              }}
            >
              <View style={{ width: 50, height: 50 }}>
                <Image
                  source={require('./googleicon.png')}
                  style={{ flex: 1, width: null, height: null, resizeMode: 'contain' }}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialIcon}
              onPress={() => {
                // Add your social media login logic here (e.g., Facebook)
              }}
            >
              <View style={{ width: 50, height: 50 }}>
                <Image
                  source={require('./fb.png')}
                  style={{ flex: 1, width: null, height: null, resizeMode: 'contain' }}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialIcon}
              onPress={() => {
                // Add your social media login logic here (e.g., iOS)
              }}
            >
              <View style={{ width: 50, height: 50 }}>
                <Image
                  source={require('./ios.png')}
                  style={{ flex: 1, width: null, height: null, resizeMode: 'contain' }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  spaceAboveContainer: {
    flex: 1,
    backgroundColor: '#FFC836',
  },
  inputAndButtonContainer: {
    backgroundColor: '#FFC836',
    marginBottom: 60,
  },
  loginSignupButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  touchableButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  buttonText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 24,
  },
  activeButton: {
    borderBottomWidth: 2,
    borderColor: 'red',
  },
  activeButtonText: {
    color: 'red',
  },
  inputContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
  },
  input: {
    marginBottom: 18,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#D1D0CE',
    borderColor: 'white',
    borderRadius: 15,
    fontSize: 16,
    color: 'black',
    fontWeight: 'normal',
  },
  inputError: {
    borderColor: 'red', // Change this to the color you want for error borders
  },
  forgotPassword: {
    color: 'black',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 16,
    fontSize: 20,
  },
  loginButton: {
    backgroundColor: 'red',
    borderRadius: 25,
    alignItems: 'center',
    paddingVertical: 12,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  ortext: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  socialIcon: {
    marginRight: 20,
  },
  passwordInputContainer: {
    position: 'relative',
  },
  eyeIconContainer: {
    position: 'absolute',
    top: 12,
    right: 10,
  },
  eyeIcon: {
    width: 24,
    height: 24,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginLeft: 12,
  },
});

export default LoginScreen;
