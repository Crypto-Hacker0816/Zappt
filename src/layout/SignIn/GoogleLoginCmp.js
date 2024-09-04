import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Icon from 'react-native-vector-icons/FontAwesome';
import uuid from 'react-native-uuid';
import { APP_GOOGLE_CLIENT_ID, IOS_GOOGLE_CLIENT_ID, ANDROID_GOOGLE_CLIENT_ID } from '../../utils/api';

const GoogleLoginCmp = ({ handleGoogleLogin }) => {
  const [isSigninInProgress, setIsSigninInProgress] = useState(false);
  const [clearGoogleAccount, setClearGoogleAccount] = useState(false);
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: APP_GOOGLE_CLIENT_ID,
      iosClientId: IOS_GOOGLE_CLIENT_ID,
      androidClientId : ANDROID_GOOGLE_CLIENT_ID,
      scopes: ['profile', 'email', 'openid'],
    });

    
  }, []);
  useEffect(() => {
    if(Platform.OS === "android" && clearGoogleAccount) {
      signOut()
      setClearGoogleAccount(false)
    }
      
  }, [clearGoogleAccount])

  const signOut = async () => {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  }

  const signIn = async () => {
    if (!isSigninInProgress) {
      setIsSigninInProgress(true);
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const myUUID = uuid.v4();
        const profileInfor = {
          family_name : userInfo.user.familyName,
          email : userInfo.user.email,
          given_name : userInfo.user.givenName
        }
        handleGoogleLogin({ ...profileInfor, id: myUUID });
      } catch (error) {
        console.log("Couldn't connect Google Login", JSON.stringify(error));
      }
      setIsSigninInProgress(false);
    }
    setClearGoogleAccount(true)
  };

  return (
    <TouchableOpacity style={styles.button} onPress={signIn}>
      <Icon
        style={{ paddingHorizontal: 10 }}
        name="google"
        size={20}
        color="#4285F4"
        brand
      />
      <Text>Google</Text>
    </TouchableOpacity>
  );
};

export default GoogleLoginCmp;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    width: '45%',
    minHeight: 50,
    margin: 10,
    backgroundColor: '#f6f6f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});
