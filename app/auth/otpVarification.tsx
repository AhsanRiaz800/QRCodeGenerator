 

// import Button from '@/components/Button';
// import OtpInput from '@/components/OtpInput';
// import { responsiveFontSize, responsiveHeight, responsiveWidth, showToast } from '@/lib/utils/helper';
 
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import React, { useState } from 'react';
// import { Image, StyleSheet, Text, View } from 'react-native';
// import { useDispatch } from 'react-redux';

// export default function OtpVerification() {
//   const { email } = useLocalSearchParams();
//   const [otp, setOtp] = useState('');
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const handleOtpComplete = (code: string) => setOtp(code);

//   const handleVerifyOtp = async () => {
//     if (otp.length !== 6) {
//       showToast('error', 'Please enter a 6-digit OTP');
//       return;
//     }

 
//   };

//   return (
//     <View
//     style={{
//       flex: 1,
//       backgroundColor: "#F9F9F9",
//       paddingHorizontal: 20,
//     //   alignItems: "center",
//     }}
//   >
//     {/* Logo */}
//     <Image
//       source={require("../../assets/images/QRlogo.png")}
//       style={{ width: responsiveWidth(100), height: responsiveHeight(20), marginTop: 80, marginBottom: 25 }}
//       resizeMode="contain"
//     />

//       <Text style={styles.logoText}>We just sent you an SMS</Text>
//       <Text style={styles.subTitle}>
//         Enter the one-time password sent to <Text style={{ color: 'black' }}>{email}</Text>
//       </Text>
//       <OtpInput length={6} onComplete={handleOtpComplete} />
//       <Text style={[styles.subTitle, { marginTop: 30, color: '#717784' }]}>
//         Didn’t Receive the code yet? <Text style={{ color: '#3B3B98' }}>Resend Code</Text>
//       </Text>
//       <Button title="Continue" onPress={handleVerifyOtp} disabled={otp.length !== 6} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#EFF6FF80', paddingHorizontal: 16, paddingTop: 80 },
//   logoImage: { width: 110, height: 110, marginBottom: 20 },
//   logoText: { fontSize: responsiveFontSize(26), color: '#000', marginBottom: 6 },
//   subTitle: { color: '#9CA3AF', marginBottom: 30, fontSize: responsiveFontSize(16) },
// });


import Button from "@/components/Button";
import OtpInput from "@/components/OtpInput";
import {
    responsiveFontSize,
    responsiveHeight,
    responsiveWidth,
    showToast,
} from "@/lib/utils/helper";

import { authService } from "@/lib/service/auth.service";
import { hideLoader, showLoader } from "@/reduxToolkit/slice/loader.slice";
import { setUser } from "@/reduxToolkit/slice/User.slice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";

export default function OtpVerification() {
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const handleOtpComplete = (code: string) => setOtp(code);

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      showToast("error", "Please enter a 6-digit OTP");
      return;
    }

    try {
      dispatch(showLoader());

      const res = await authService.verifyOtp({
        email: String(email),
        otp,
      });

      dispatch(hideLoader());

      console.log("OTP Response:", res);

      if (res?.success) {
        // ===============================
        // STORE USER + TOKEN
        // ===============================
        await AsyncStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );

        await AsyncStorage.setItem("token", res.data.token);

        dispatch(
            setUser({
              user: res.data.user,
              token: res.data.token,
            })
          );

        showToast("success", res.message || "Verified successfully");

        // Navigate to home (or dashboard)
 
        router.replace('/dashboard/dashboard')

      } else {
        showToast("error", res?.message || "Verification failed");
      }
    } catch (err: any) {
      dispatch(hideLoader());

      console.log("OTP Error:", err?.response?.data || err.message);

      showToast(
        "error",
        err?.response?.data?.message ||
          err?.message ||
          "OTP verification failed"
      );
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F9F9F9",
        paddingHorizontal: 20,
      }}
    >
      {/* Logo */}
      <Image
        source={require("../../assets/images/QRlogo.png")}
        style={{
          width: responsiveWidth(100),
          height: responsiveHeight(20),
          marginTop: 80,
          marginBottom: 25,
        }}
        resizeMode="contain"
      />

      <Text style={styles.logoText}>We just sent you an SMS</Text>

      <Text style={styles.subTitle}>
        Enter the one-time password sent to{" "}
        <Text style={{ color: "black" }}>{email}</Text>
      </Text>

      <OtpInput length={6} onComplete={handleOtpComplete} />

      <Text style={[styles.subTitle, { marginTop: 30, color: "#717784" }]}>
        Didn’t Receive the code yet?{" "}
        <Text style={{ color: "#3B3B98" }}>Resend Code</Text>
      </Text>

      <Button
        title="Continue"
        onPress={handleVerifyOtp}
        disabled={otp.length !== 6}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  logoText: {
    fontSize: responsiveFontSize(26),
    color: "#000",
    marginBottom: 6,
  },
  subTitle: {
    color: "#9CA3AF",
    marginBottom: 30,
    fontSize: responsiveFontSize(16),
  },
});