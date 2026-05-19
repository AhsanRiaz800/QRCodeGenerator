
import Button from "@/components/Button";
import OtpInput from "@/components/OtpInput";
import {
    responsiveFontSize,
    responsiveHeight,
    responsiveWidth,
    showToast,
} from "@/lib/utils/helper";

import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";

export default function ForgotOtpvarification() {
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
  
    router.push({
      pathname: "/auth/newPassword", // change this to your next screen
      params: {
        email: String(email),
        otp: otp,
      },
    });
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