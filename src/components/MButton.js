import { StyleSheet } from 'react-native';
import React from 'react';
import { Button } from 'react-native-paper';

export default function MButton({
  children,
  mode = 'contained',
  style,
  ...props
}) {
  return (
    <Button
      mode={mode}
      textColor={mode === 'outlined' || mode === 'text' ? 'black' : ''}
      style={[styles.button, style]}
      {...props}>
      {children}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
  },
});
