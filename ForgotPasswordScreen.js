import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import { useForm, Controller } from 'react-hook-form';
import Parse from 'parse/react-native'; // Import Parse

function ForgotPasswordScreen({ navigation }) {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [step, setStep] = useState(1);
  const [errorText, setErrorText] = useState(''); // State for error message

  const handleSendVerificationCode = async (data) => {
    try {
      // Check if the provided email or phone exists in your Parse User table
      const query = new Parse.Query(Parse.User);
      query.equalTo('email', data.emailOrMobile); // Change 'email' to the appropriate field name
      // Add more conditions for phone number, if needed
      const user = await query.first();

      if (user) {
        // Email or phone exists, you can proceed to send the verification code
        console.log('Email or phone is registered:', user.get('email'));
        setErrorText(''); // Clear any previous error message
        setStep(2); // Move to the next step
      } else {
        // Email or phone doesn't exist, show an error message
        console.log('Email or phone is not registered.');
        setErrorText('Email or phone is not registered.');
      }
    } catch (error) {
      // Handle any errors that occur during the query or verification code sending process
      console.error('Error:', error);
    }
  };

  const handleVerifyCode = (data) => {
    // Handle code verification here
    console.log(data.verificationCode);
    setStep(3); // Move to the next step
  };

  const handleSetPassword = (data) => {
    // Handle setting the new password here
    console.log(data.newPassword);
    console.log(data.confirmPassword);
    // After setting the password, you can navigate to the login screen or perform other actions.
    navigation.navigate('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.whiteContainer}>
        <Text style={styles.header}>Forgot Password</Text>
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Controller
              control={control}
              render={({ field }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Email or Mobile Number"
                    value={field.value}
                    onChangeText={field.onChange}
                    style={styles.input}
                    placeholderTextColor="#777777"
                  />
                </View>
              )}
              name="emailOrMobile"
              rules={{ required: true }}
              defaultValue=""
            />
            {errors.emailOrMobile && (
              <Text style={styles.errorText}>Email or Mobile Number is required.</Text>
            )}
            {errorText !== '' && (
              <Text style={styles.errorText}>{errorText}</Text>
            )}
            <Button
              title="Send Verification Code"
              buttonStyle={styles.button}
              onPress={handleSubmit(handleSendVerificationCode)}
            />
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.subheader}>Step 2: Enter Verification Code</Text>
            <Controller
              control={control}
              render={({ field }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Verification Code"
                    value={field.value}
                    onChangeText={field.onChange}
                    style={styles.input}
                    placeholderTextColor="#777777"
                  />
                </View>
              )}
              name="verificationCode"
              rules={{ required: true }}
              defaultValue=""
            />
            {errors.verificationCode && (
              <Text style={styles.errorText}>Verification Code is required.</Text>
            )}
            <Button
              title="Verify"
              buttonStyle={styles.button}
              onPress={handleSubmit(handleVerifyCode)}
            />
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.subheader}>Step 3: Set New Password</Text>
            <Controller
              control={control}
              render={({ field }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="New Password"
                    value={field.value}
                    onChangeText={field.onChange}
                    style={styles.input}
                    placeholderTextColor="#777777"
                    secureTextEntry
                  />
                </View>
              )}
              name="newPassword"
              rules={{ required: true }}
              defaultValue=""
            />
            {errors.newPassword && (
              <Text style={styles.errorText}>New Password is required.</Text>
            )}
            <Controller
              control={control}
              render={({ field }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Confirm Password"
                    value={field.value}
                    onChangeText={field.onChange}
                    style={styles.input}
                    placeholderTextColor="#777777"
                    secureTextEntry
                  />
                </View>
              )}
              name="confirmPassword"
              rules={{ required: true }}
              defaultValue=""
            />
            {errors.confirmPassword && (
              <Text style={styles.errorText}>Confirm Password is required.</Text>
            )}
            <Button
              title="Set Password"
              buttonStyle={styles.button}
              onPress={handleSubmit(handleSetPassword)}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFC836',
    paddingTop: 20,
    alignItems: 'center',
  },
  whiteContainer: {
    backgroundColor: 'white',
    padding: 30,
    width: "95%",
    borderRadius: 40,
    marginTop: 200,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subheader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  stepContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 10,
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: 'red',
    borderRadius: 5,
  },
});

export default ForgotPasswordScreen;
