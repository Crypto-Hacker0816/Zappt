import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  ImageBackground,
  Platform,
} from 'react-native';
import { TextInput, Checkbox, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AuthState } from '../../context/Provider';
import notify from '../../utils/notify';
import { googleSign, signUp } from '../../utils/api';
import MButton from '../../components/MButton';
import s from '../../utils/styles';
import uuid from 'react-native-uuid';
import image from '../../assets/images';

export default function SignUp(props) {
  const navigation = useNavigation(false);
  const { auth, setAuth } = AuthState();
  const [credentials, setCredentials] = useState({
    firstName: '',
    // lastName: '',
    email: '',
    password: '',
    // confirmPassword: '',
    id: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [checkState, setCheckState] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(show => !show);
  const handleCredentials = (target, e) => {
    if (credentials.id == null) {
      const myUUID = uuid.v4();
      setCredentials({
        ...credentials,
        [target]: e,
        id: myUUID,
      });
    } else {
      setCredentials({
        ...credentials,
        [target]: e,
      });
    }
  };
  const registerHandler = async e => {
    e.preventDefault();
    setIsLoading(true);
    // If any field is missing
    if (
      !credentials.firstName ||
      !credentials.lastName ||
      !credentials.email ||
      !credentials.password ||
      !credentials.confirmPassword
    ) {
      setIsLoading(false);
      return notify('Please Fill all the Fields', 'warn');
    }

    // If password and confirm password doesn't match
    if (credentials.password !== credentials.confirmPassword) {
      setIsLoading(false);
      return notify('Passwords Do Not Match', 'warn');
    }

    // If password is less than 8 characters
    if (credentials.password.length < 8) {
      setIsLoading(false);
      return notify('Password must be at least 8 characters', 'warn');
    }

    try {
      // Register user
      const data = await signUp(credentials);
      handleSignUpSuccess(data);
    } catch (error) {
      setIsLoading(false);
      return notify('Internal server error', 'error');
    }
  };

  const handleGoogleLogin = async cred => {
    try {
      const data = await googleSign(cred);
      handleSignUpSuccess(data);
    } catch (error) {
      setIsLoading(false);
      return notify('Internal server error', 'error');
    }
  };

  const handleSignUpSuccess = data => {
    if (data.success) {
      setAuth(data);
      setIsLoading(false);
      navigation.goBack(); // Go to page user was previously on g
      return notify('Your account has been successfully created', 'success');
    } else {
      setIsLoading(false);
      return notify(data.error, 'error');
    }
  };

  return (
    <ScrollView style={{ backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <View style={{ padding: 20 }}>
          <Text
            style={{
              fontSize: 36,
              fontWeight: '900',
              textAlign: 'center',
              color: '#1C1C1F',
            }}>
            Create an account
          </Text>
          <Text
            style={{ fontSize: 15, paddingVertical: 10, textAlign: 'center' }}>
            Discover the Symphony of Your Adventures
          </Text>
          <TextInput
            style={styles.text_input}
            placeholder="First Name"
            onChangeText={e => handleCredentials('firstName', e)}
            value={credentials.firstName}
            left={<TextInput.Icon icon="account" size={20} />}
            // activeUnderlineColor="#FFFFFF"
            underlineColor="#FFFFFF"
          />
          <TextInput
            style={styles.text_input}
            placeholder="Last name"
            onChangeText={e => handleCredentials('lastName', e)}
            value={credentials.lastName}
            left={<TextInput.Icon icon="account" size={20} />}
          />
          <TextInput
            style={styles.text_input}
            placeholder="Enter email address"
            onChangeText={e => {
              const lowercasedFirstChar =
                e.charAt(0).toLowerCase() + e.slice(1);
              handleCredentials('email', lowercasedFirstChar);
            }}
            value={credentials.email}
            // activeUnderlineColor="#FFFFFF"
            underlineColor="#FFFFFF"
            left={<TextInput.Icon icon="at" size={20} />}
          />
          <TextInput
            style={styles.text_input}
            placeholder="Password"
            secureTextEntry={!showPassword}
            onChangeText={e => handleCredentials('password', e)}
            value={credentials.password}
            left={<TextInput.Icon icon="lock" size={20} />}
            // activeUnderlineColor="#FFFFFF"
            underlineColor="#FFFFFF"
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                onPress={handleClickShowPassword}
              />
            }
          />
          <TextInput
            style={styles.text_input}
            placeholder="Confirm password"
            secureTextEntry={!showPassword}
            onChangeText={e => handleCredentials('confirmPassword', e)}
            value={credentials.confirmPassword}
            left={<TextInput.Icon icon="lock" size={20} />}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                onPress={handleClickShowPassword}
              />
            }
          />
          <View style={(s.d_flex, { marginTop: 20 })}>
            <Pressable
              onPress={() => {
                setCheckState(prev => !prev);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 20,
              }}>
              <Checkbox status={checkState ? 'checked' : 'unchecked'} />
              <View style={{ width: '90%' }}>
                <Text style={{ fontSize: 13 }}>
                  By signing up, you're agree to our{' '}
                  <Text style={{ fontWeight: 'bold' }}>
                    Terms & Condition and Privacy Policy
                  </Text>
                </Text>
              </View>
            </Pressable>
          </View>
          <MButton style={{marginTop: '7%', height: 55, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 100, fontWeight: '500'}} onPress={registerHandler} disabled={isLoading}>
            {isLoading ? <ActivityIndicator animating="true" /> : <Text style={{fontSize : 16, fontWeight : '500'}}>Sign up</Text>}
          </MButton>
        </View>
      </View>
      <ImageBackground
        source={image.sign_back}
        resizeMode="cover"
        style={styles.imageLayer}>
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(255,255,255, 0.5)',
          }}
        />
        <Text style={{ paddingHorizontal: 5, fontSize : 16 }}>Already have an account?</Text>
        <TouchableOpacity onPress={() => props.navigation.navigate('signIn')}>
          <Text style={{ fontWeight: 'bold',fontSize : 16, textDecorationLine: 'underline' }}>
            Login
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? '30%':'15%',
  },
  formStyle: {
    flex: 1,
    width: '90%',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  divider: {
    color: 'black',
    flex: 1,
    height: 1,
  },
  text: {
    marginHorizontal: 10,
  },
  text_input: {
    backgroundColor: '#F9F9F9',
    height: 50,
    marginTop: 10,
    color: '#9D9D9D',
    fontSize: 14,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  imageLayer: {
    flex: 1,
    width: '100%',
    height: 250,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
    marginTop: '5%',
  },
});
