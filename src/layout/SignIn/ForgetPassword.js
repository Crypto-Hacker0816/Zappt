import React, { useState } from 'react';
import { StyleSheet, View, Text, ImageBackground } from 'react-native';
import { TextInput, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AuthState } from '../../context/Provider';
import { forgetPassword } from '../../utils/api';
import MButton from '../../components/MButton';
import image from '../../assets/images';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

export default function ForgetPassword(props) {
  const navigation = useNavigation(false);
  const { auth } = AuthState();
  const [credentials, setCredentials] = useState({
    email : '',
    phoneNumber : ''
  });
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const handleCredentials = (target, e) => {
    setCredentials({ ...credentials, [target]: e });
  };
  const CELL_COUNT = 5;
  const [codeValue, setValue] = useState('');
  const ref = useBlurOnFulfill({ codeValue, cellCount: CELL_COUNT });
  const [codeProps, getCellOnLayoutHandler] = useClearByFocusCell({
    codeValue,
    setValue,
  });
  const handleSubmit = async e => {
    props.navigation.navigate('dashboard');
    e.preventDefault();
    setIsLoading(true);

    if (!credentials.email) {
      setIsLoading(false);
      return notify('Please Fill all the Fields', 'warn');
    }

    try {
      await forgetPassword(credentials);
      setIsLoading(false);
    } catch (error) {
      return notify('Internal server error', 'error');
    }
  };

  if (step === 1) {
    return (
      <View style={styles.container}>
        <View
          style={{
            marginTop: '20%',
            padding: 10,
            width: '10%',
            height: '10%',
          }}>
          <IconButton
            style={{ borderRadius: 10 }}
            icon="chevron-left"
            iconColor="#000"
            containerColor="#E9E9E9"
            mode="contained"
            animated="true"
            onPress={() => props.navigation.navigate('signIn')}
          />
        </View>
        <View style={{ width: '100%', alignItems: 'center', marginTop: '20%' }}>
          <Text
            style={{
              fontSize: 36,
              fontWeight: '700',
              textAlign: 'center',
              color: '#1C1C1F',
            }}>
            Forgot Your Password?
          </Text>
          <Text
            style={{
              fontSize: 16,
              paddingVertical: 20,
              textAlign: 'center',
              width: '80%',
              fontWeight : '400'
            }}>
            No worries! We're here to help you regain access to your account.
          </Text>
          <TextInput
            style={styles.text_input}
            placeholder="Enter email"
            onChangeText={e => {
              const lowercasedFirstChar =
                e.charAt(0).toLowerCase() + e.slice(1);
              handleCredentials('email', lowercasedFirstChar);
            }}
            // activeUnderlineColor="#FFFFFF"
            underlineColor="#FFFFFF"
            value={credentials.email || ''}
            left={<TextInput.Icon icon="at" size={20} />}
          />
          <MButton
            style={styles.btn_continue}
            onPress={() => setStep(prev => prev + 1)}
            disabled={isLoading}>
            <Text style={{fontSize : 16, fontWeight : '600'}}>Continue</Text>
          </MButton>
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
        </ImageBackground>
      </View>
    );
  } else if (step === 2) {
    return (
      <View style={styles.container}>
        <View
          style={{
            marginTop: '20%',
            padding: 10,
            width: '10%',
            height: '10%',
          }}>
          <IconButton
            style={{ borderRadius: 10 }}
            icon="chevron-left"
            iconColor="#000"
            containerColor="#E9E9E9"
            mode="contained"
            animated="true"
            onPress={() => setStep(prev => prev - 1)}
          />
        </View>
        <View style={{ width: '100%', alignItems: 'center', marginTop: '20%' }}>
          <Text
            style={{
              fontSize: 36,
              fontWeight: '700',
              textAlign: 'center',
              color: '#1C1C1F',
            }}>
            Mobile Number
          </Text>
          <Text
            style={{
              fontSize: 16,
              paddingVertical: 20,
              textAlign: 'center',
              width: '80%',
              fontWeight : '400'
            }}>
            We will send you a{' '}
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
              }}>
              One Time Password
            </Text>{' '}
            on your phone number
          </Text>
          <TextInput
            style={styles.text_input}
            placeholder="+92 318**********"
            onChangeText={e => handleCredentials('email', e)}
            value={credentials.email || ''}
            left={<TextInput.Icon icon="phone-outline" size={20} />}
          />
          <MButton
            style={styles.btn_continue}
            onPress={() => setStep(prev => prev + 1)}
            disabled={isLoading}>
            <Text style={{fontSize : 16, fontWeight : '600'}}>Continue</Text>
          </MButton>
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
        </ImageBackground>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View
          style={{
            marginTop: '20%',
            padding: 10,
            width: '10%',
            height: '10%',
          }}>
          <IconButton
            style={{ borderRadius: 10 }}
            icon="chevron-left"
            iconColor="#000"
            containerColor="#E9E9E9"
            mode="contained"
            animated="true"
            onPress={() => setStep(prev => prev - 1)}
          />
        </View>
        <View style={{ width: '100%', alignItems: 'center', marginTop: '20%' }}>
          <Text
            style={{
              fontSize: 36,
              fontWeight: '700',
              textAlign: 'center',
              color: '#1C1C1F',
            }}>
            Verify Phone
          </Text>
          <Text
            style={{
              fontSize: 16,
              paddingTop: 20,
              textAlign: 'center',
              width: '80%',
              fontWeight : '400'
            }}>
            Code is sent to +92 318**********
          </Text>
          <CodeField
            ref={ref}
            {...codeProps}
            value={codeValue}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
          <Text
            style={{
              fontSize: 16,
              marginTop: 30,
              textAlign: 'center',
              width: '80%',
            }}>
            Didn't receive code?
            <Text style={{ fontWeight: 'bold' }}>Request again</Text>
          </Text>
          <Text
            style={{
              fontSize: 16,
              textAlign: 'center',
              fontWeight: 'bold',
            }}>
            Get via call
          </Text>
          <MButton
            style={styles.btn_continue}
            onPress={handleSubmit}
            disabled={isLoading}>
            <Text style={{fontSize : 16}}>Continue</Text>
          </MButton>
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
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formStyle: {
    flex: 1,
    width: '90%',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
  },
  text_input: {
    backgroundColor: '#F9F9F9',
    width: '90%',
    height: 50,
    marginTop: 20,
    marginBottom :  '5%',
    color: '#9D9D9D',
    fontSize: 14,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  btn_continue: {
    marginTop : '15%',
    height: 55, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontSize: 100, 
    fontWeight: '500',
    width: '90%',
    marginTop: '5%',
  },
  imageLayer: {
    flex: 1,
    width: '100%',
    height: 400,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '27%',
  },
  title: { textAlign: 'center', fontSize: 30 },
  cell: {
    width: 32.5,
    height: 35,
    lineHeight: 27.6,
    fontSize: 20,
    backgroundColor: '#C8C8C8',
    textAlign: 'center',
    margin: 10,
    borderWidth : 1,
    borderColor : '#C8C8C8',
    top: 15,
    padding: 5,
    paddingTop : 3,
    color : '#5B5B63',
    borderRadius : 5,
  },
  focusCell: {
    borderColor: '#C8C8C8',
  },
});
