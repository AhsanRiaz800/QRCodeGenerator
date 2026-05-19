
 import { responsiveFontSize } from '@/lib/utils/helper';
import React, { useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const OtpInput = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const [focusedIndex, setFocusedIndex] = useState(0); // Track focused box
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    if (!/^[0-9]?$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input
    if (text && index < length - 1) {
      inputs.current[index + 1].focus();
    }

    // Trigger onComplete if all digits filled
    if (newOtp.every(digit => digit !== '')) {
      onComplete && onComplete(newOtp.join(''));
    } else {
      onComplete && onComplete(''); // reset if not complete
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index] === '') {
        // Move focus to previous if current empty
        if (index > 0) {
          inputs.current[index - 1].focus();
          const prevOtp = [...newOtp];
          prevOtp[index - 1] = '';
          setOtp(prevOtp);
        }
      } else {
        // Clear current value
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((digit, index) => (
        <React.Fragment key={index}>
          <TextInput
            ref={ref => (inputs.current[index] = ref)}
            style={[
              styles.input,
              {
                borderColor:
                  focusedIndex === index ? '#3B3B98' : '#E1E4EA',
              },
            ]}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(-1)}
          />
          {/* Add dash after 3rd input */}
          {index === 2 && (
            <View
              style={{
                width: 16,
                marginHorizontal: 5,
                height: 1,
                backgroundColor: 'black',
                alignSelf: 'center',
              }}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

export default OtpInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 50,
    height: 48,
    borderWidth: 1,
    margin: 4,
    borderRadius: 12,
    textAlign: 'center',
    backgroundColor: 'white',
    fontSize: responsiveFontSize(20),
    fontWeight: '500',
  },
});