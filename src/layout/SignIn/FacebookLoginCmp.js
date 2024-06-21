import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Icon from 'react-native-vector-icons/FontAwesome';
import { v4 as uuidv4 } from 'uuid';
import { APP_GOOGLE_CLIENT_ID, IOS_GOOGLE_CLIENT_ID } from '../../utils/api';

const FacebookLoginCmp = ({ handleGoogleLogin }) => {
  const [isSigninInProgress, setIsSigninInProgress] = useState(false);
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: APP_GOOGLE_CLIENT_ID,
      iosClientId: IOS_GOOGLE_CLIENT_ID,
    });
  }, []);

  const signIn = async () => {
    if (!isSigninInProgress) {
      setIsSigninInProgress(true);
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const myUUID = uuidv4();
        handleGoogleLogin({ ...userInfo, id: myUUID });
      } catch (error) {
        console.log("Couldn't connect Google Login", JSON.stringify(error));
      }
      setIsSigninInProgress(false);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={signIn}>
      <Icon
        style={{ paddingHorizontal: 10 }}
        name="facebook"
        size={20}
        color="#4285F4"
        brand
      />
      <Text>Facebook</Text>
    </TouchableOpacity>
  );
};

export default FacebookLoginCmp;

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
