import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import Parse from 'parse/react-native';
import { useForm, Controller } from 'react-hook-form';
import { useRoute } from '@react-navigation/native';

function SignUpScreen({ navigation }) {
  const route = useRoute();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isStrongPassword = (input) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/;
    return passwordRegex.test(input);
  };

  const handleSignUp = async (data) => {
    try {
      const { username, emailOrMobile, password, confirmPassword } = data;

      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }

      if (!isStrongPassword(password)) {
        Alert.alert('Error', 'Password requirements not met');
        return;
      }

      const user = new Parse.User();
      user.set('username', username);
      user.set('password', password);

      if (emailOrMobile.includes('@')) {
        user.set('email', emailOrMobile);
      } else {
        user.set('mobileNumber', emailOrMobile);
      }

      await user.signUp();
      console.log('Signed up successfully:', user);

      // Reset the form after successful registration
      reset();

      // Display success alert message
      Alert.alert('Great job! Registration successful. Log in to start using.');

      // Redirect to the login page
      navigation && navigation.navigate('Login');
    } catch (error) {
      console.error('Sign-up error:', error);
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
              route.name === 'Login' && styles.activeButtonText,
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
            ]}>SignUp</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.header}>Start Today</Text>
          <Controller
            control={control}
            render={({ field }) => (
              <View>
                <TextInput
                  placeholder="Name"
                  value={field.value}
                  onChangeText={field.onChange}
                  style={[styles.input, errors.username && styles.inputError]}
                  placeholderTextColor="#777777"
                />
                <Text style={styles.inputError}>{errors.username?.message}</Text>
              </View>
            )}
            name="username"
            rules={{ required: 'Name is required' }}
            defaultValue=""
          />
          <Controller
            control={control}
            render={({ field }) => (
              <View>
                <TextInput
                  placeholder="Email or Mobile Number"
                  value={field.value}
                  onChangeText={field.onChange}
                  style={[styles.input, errors.emailOrMobile && styles.inputError]}
                  placeholderTextColor="#777777"
                />
                <Text style={styles.inputError}>{errors.emailOrMobile?.message}</Text>
              </View>
            )}
            name="emailOrMobile"
            rules={{ required: 'Email or Mobile Number is required' }}
            defaultValue=""
          />

          <View style={styles.passwordInputContainer}>
            <Controller
              control={control}
              render={({ field }) => (
                <View>
                  <TextInput
                    placeholder="Password"
                    value={field.value}
                    onChangeText={field.onChange}
                    secureTextEntry={!showPassword}
                    style={[styles.input, errors.password && styles.inputError]}
                    placeholderTextColor="#777777"
                  />
                  <Text style={styles.inputError}>{errors.password?.message}</Text>
                </View>
              )}
              name="password"
              rules={{
                required: 'Password is required',
                validate: (value) =>
                  isStrongPassword(value) ||
                  'Password too weak! Strengthen it with 8 characters, including an uppercase letter and a special character',
              }}
              defaultValue=""
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

          <View style={styles.passwordInputContainer}>
            <Controller
              control={control}
              render={({ field }) => (
                <View>
                  <TextInput
                    placeholder="Confirm Password"
                    value={field.value}
                    onChangeText={field.onChange}
                    secureTextEntry={!showConfirmPassword}
                    style={[styles.input, errors.confirmPassword && styles.inputError]}
                    placeholderTextColor="#777777"
                  />
                  <Text style={styles.inputError}>{errors.confirmPassword?.message}</Text>
                </View>
              )}
              name="confirmPassword"
              rules={{
                required: 'Confirm Password is required',
                validate: (value) =>
                  value === getValues('password') || 'Passwords do not match',
              }}
              defaultValue=""
            />
            <TouchableOpacity
              style={styles.eyeIconContainer}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Image
                source={
                  showConfirmPassword ? require('./eye-on.png') : require('./eye-off.png')
                }
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.signUpButton}
            onPress={handleSubmit(handleSignUp)}
          >
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>
          <Text style={styles.ortext}>or</Text>

          <View style={styles.socialIconsContainer}>
            <TouchableOpacity
              style={styles.socialIcon}
              onPress={() => {
                // Add your social media sign-up logic here (e.g., Google)
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
                // Add your social media sign-up logic here (e.g., Facebook)
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
                // Add your social media sign-up logic here (e.g., iOS)
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
    marginBottom: 1,
  },
  loginSignupButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
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
    padding: 18,
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
    marginBottom: 5,
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
    borderColor: 'red',
    color: 'red',
  },
  signUpButton: {
    backgroundColor: 'red',
    borderRadius: 25,
    alignItems: 'center',
    paddingVertical: 12,
  },
  signUpButtonText: {
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
});

export default SignUpScreen;
