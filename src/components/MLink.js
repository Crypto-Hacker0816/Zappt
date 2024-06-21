import React from 'react';
import { Linking } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function MLink({ href, children }) {
  const openURL = () => {
    Linking.openURL(href);
  };

  return <TouchableOpacity onPress={openURL}>{children}</TouchableOpacity>;
}
