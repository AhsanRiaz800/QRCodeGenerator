 import { responsiveFontSize } from '@/lib/utils/helper';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function Button({ title, onPress, disabled }:any) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled ? styles.disabled : null]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, disabled ? styles.textDisabled : null]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#1A1A40',
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 20,
  },
  disabled: {
    backgroundColor: '#3B3B98',
  },
  text: {
    color: '#fff',
    fontSize: responsiveFontSize(16),
    // fontWeight: 'bold',
  },
  textDisabled: {
    color: '#E5E7EB',
  },
});