 import { responsiveFontSize, responsiveHeight } from '@/lib/utils/helper';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function InputField({ value, keyboardType, onChangeText, secureTextEntry, color ,placeholder ,containerStyle ,editable ,title }:any) {


  return (
    <View style={[styles.container ,containerStyle ]}>
      { title &&
      <Text style={[styles.title ,{color:color, marginBottom:color?8:10 }]}>{title}</Text>
}
      <TextInput
        style={styles.input}
        value={value}
        
        secureTextEntry={secureTextEntry}
        editable={editable}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={'#9CA3AF'}
        keyboardType={keyboardType? keyboardType : "email-address"}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: responsiveFontSize(16),
    color: '#0000000',
    marginBottom: 6,
    fontWeight:"400",
  },
  input: {
    height:responsiveHeight(5.5),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    
    borderRadius: 8,
    paddingHorizontal: 12,

    paddingVertical: 10,
    fontSize: responsiveFontSize(15),
    backgroundColor: '#fff',
  },
});