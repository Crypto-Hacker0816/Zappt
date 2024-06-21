import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from 'react-native';
import { Divider, TextInput, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AuthState } from '../../context/Provider';
import notify from '../../utils/notify';
import { googleSign, signIn } from '../../utils/api';
import MButton from '../../components/MButton';
import GoogleLoginCmp from './GoogleLoginCmp';
import FacebookLoginCmp from './FacebookLoginCmp';
import image from '../../assets/images';

export default function SignIn(props) {
  const navigation = useNavigation(false);
  const { auth, setAuth } = AuthState();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(show => !show);

  const handleCredentials = (target, e) => {
    setCredentials({ ...credentials, [target]: e });
  };

  const loginHandler = async e => {
    e.preventDefault();
    setIsLoading(true);

    // If any field is missing
    if (!credentials.email || !credentials.password) {
      setIsLoading(false);
      return notify('Please Fill all the Fields', 'warn');
    }

    try {
      const data = await signIn(credentials);
      handleSignSuccess(data);
    } catch (error) {
      setIsLoading(false);
      return notify('Internal server error', 'error');
    }
  };

  const handleGoogleLogin = async cred => {
    try {
      const data = await googleSign(cred);
      handleSignSuccess(data);
    } catch (error) {
      setIsLoading(false);
      return notify('Internal server error', 'error');
    }
  };

  const handleSignSuccess = data => {
    if (data.success) {
      setAuth({ ...auth, ...data });
      setIsLoading(false);
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
      return notify('You are successfully logged in', 'success');
    } else {
      setIsLoading(false);
      return notify(data.error, 'warn');
    }
  };

  return (
    <ScrollView style={{ backgroundColor: '#fff' }}>
      <View style={styles.mainContainer}>
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              fontSize: 36,
              fontWeight: '700',
              paddingTop: 10,
              textAlign: 'center',
              color: '#1C1C1F',
            }}>
           Welcome back!
          </Text>
          <Text
            style={{
              fontSize: 15,
              padding: 10,
              textAlign: 'center',
            }}>
            Join now and turn every journey into a melody!
          </Text>
          <TextInput
            style={styles.text_input}
            // activeUnderlineColor="#FFFFFF"
            underlineColor="#FFFFFF"
            placeholder="Enter email address"
            onChangeText={e => {
              const lowercasedFirstChar =
                e.charAt(0).toLowerCase() + e.slice(1);
              handleCredentials('email', lowercasedFirstChar);
            }}
            value={credentials.email || ''}
            left={<TextInput.Icon icon="at" size={20} />}
          />
          <TextInput
            style={styles.text_input}
            placeholder="Password"
            secureTextEntry={!showPassword}
            // activeUnderlineColor="#FFFFFF"
            underlineColor="#FFFFFF"
            onChangeText={value => handleCredentials('password', value)}
            value={credentials.password}
            left={<TextInput.Icon icon="lock" size={20} />}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                onPress={handleClickShowPassword}
              />
            }
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <TouchableOpacity
              onPress={() => console.log('Navigate to forget password')}>
              <Text
                style={{
                  textDecorationLine: 'underline',
                  marginBottom: 10,
                }}
                onPress={() => props.navigation.navigate('forgetPassword')}>
                Forgot Password
              </Text>
            </TouchableOpacity>
          </View>
          <MButton style={{marginTop: '7%', height: 55, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 100, fontWeight: '500'}} onPress={loginHandler} disabled={isLoading}>
            {isLoading ? <ActivityIndicator animating="true" /> : <Text style={{fontSize : 16}}>Log In</Text>}
          </MButton>
          {/* <View style={s.d_flex}>
            <Pressable
              onPress={() => {
                setAuth({ ...auth, rememberMe: !auth.rememberMe });
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Checkbox status={auth.rememberMe ? 'checked' : 'unchecked'} />
              <Text>Remember me</Text>
            </Pressable>
          </View> */}
          <View style={styles.dividerContainer}>
            <Divider style={styles.divider} />
            <Text style={styles.text}>OR</Text>
            <Divider style={styles.divider} />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <FacebookLoginCmp handleGoogleLogin={handleGoogleLogin} />
            <GoogleLoginCmp handleGoogleLogin={handleGoogleLogin} />
          </View>
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
        <Text style={{ paddingHorizontal: 5 }}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => props.navigation.navigate('signup')}>
          <Text
            style={{
              fontWeight: 'bold',
              textDecorationLine: 'underline',
            }}>
            SignUp
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '15%',
    marginBottom: '15%',
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
    marginTop: '10%',
    color: '#9D9D9D',
    fontSize: 14,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  mainContainer: {
    flex: 1,
    height: '100%',
    width: '95%',
    justifyContent: 'center',
    marginTop: Platform.OS === 'ios'? '45%':'30%',
    marginLeft: '2.5%',
  },
  imageLayer: {
    flex: 1,
    width: '100%',
    height: 250,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
    marginTop: '-15%',
  },
});
