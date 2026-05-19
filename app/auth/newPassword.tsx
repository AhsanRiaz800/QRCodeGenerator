// import Button from "@/components/Button";
// import {
//     responsiveFontSize,
//     responsiveHeight,
//     responsiveWidth,
//     showToast,
// } from "@/lib/utils/helper";

// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useState } from "react";
// import { Image, StyleSheet, Text, TextInput, View } from "react-native";
// import { useDispatch } from "react-redux";

// export default function NewPassword() {
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const { email, otp } = useLocalSearchParams();

//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const handleAddnewPass = async () => {
//     if (!newPassword || !confirmPassword) {
//       showToast("error", "Please fill all fields");
//       return;
//     }

//     if (newPassword.length < 6) {
//       showToast("error", "Password must be at least 6 characters");
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       showToast("error", "Passwords do not match");
//       return;
//     }

//     console.log("Email:", email);
//     console.log("OTP:", otp);
//     console.log("New Password:", newPassword);

//     // 🔥 Here you will call reset password API later
//   };

//   return (
//     <View
//       style={{
//         flex: 1,
//         backgroundColor: "#F9F9F9",
//         paddingHorizontal: 20,
//       }}
//     >
//       {/* Logo */}
//       <Image
//         source={require("../../assets/images/QRlogo.png")}
//         style={{
//           width: responsiveWidth(100),
//           height: responsiveHeight(20),
//           marginTop: 80,
//           marginBottom: 25,
//         }}
//         resizeMode="contain"
//       />

//       <Text style={{ fontSize: responsiveFontSize(16),
//     color: '#0000000',
//      fontWeight:"400", marginBottom:10 }}>New Password</Text>
 
//       {/* New Password Input */}
//       <TextInput
//         placeholder="New Password"
//         secureTextEntry
//         value={newPassword}
//         onChangeText={setNewPassword}
//         style={styles.input}
//       />

//       {/* Confirm Password Input */}

//       <Text style={{ fontSize: responsiveFontSize(16),
//     color: '#0000000',
//      fontWeight:"400", marginBottom:10 }}>Confirm Password</Text>
 
//       <TextInput
//         placeholder="Confirm New Password"
//         secureTextEntry
//         value={confirmPassword}
//         onChangeText={setConfirmPassword}
//         style={styles.input}
//       />

//       <Button title="Continue" onPress={handleAddnewPass} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   input: {
//     height: 50,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     marginBottom: 15,
//     backgroundColor: "#fff",
//     fontSize: responsiveFontSize(16),
//   },
// });


import Button from "@/components/Button";
import {
    responsiveFontSize,
    responsiveHeight,
    responsiveWidth,
    showToast,
} from "@/lib/utils/helper";

import { authService } from "@/lib/service/auth.service";
import { hideLoader, showLoader } from "@/reduxToolkit/slice/loader.slice";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useDispatch } from "react-redux";
 
export default function NewPassword() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { email, otp } = useLocalSearchParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleAddnewPass = async () => {
    if (!newPassword || !confirmPassword) {
      showToast("error", "Please fill all fields");
      return;
    }

    if (newPassword.length < 6) {
      showToast("error", "Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("error", "Passwords do not match");
      return;
    }

    try {
      const payload = {
        email: String(email),
        otp: String(otp),
        newPassword,
      };

      console.log("Reset Password Payload:", payload);

      dispatch(showLoader());

      const res = await authService.resetPassword(payload);

      dispatch(hideLoader());

      console.log("Reset Response:", res);

      if (res?.success) {
        showToast("success", res.message);

        // redirect to login screen
        router.replace("/auth/login");
      } else {
        showToast("error", res?.message || "Reset failed");
      }
    } catch (err: any) {
      dispatch(hideLoader());

      console.log(
        "Reset Error:",
        err?.response?.data || err.message
      );

      showToast(
        "error",
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong"
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

      <Text
        style={{
          fontSize: responsiveFontSize(16),
          color: "#000",
          fontWeight: "400",
          marginBottom: 10,
        }}
      >
        New Password
      </Text>

      {/* New Password */}
      <TextInput
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        style={styles.input}
      />

      <Text
        style={{
          fontSize: responsiveFontSize(16),
          color: "#000",
          fontWeight: "400",
          marginBottom: 10,
        }}
      >
        Confirm Password
      </Text>

      {/* Confirm Password */}
      <TextInput
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
      />

      <Button title="Continue" onPress={handleAddnewPass} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: responsiveFontSize(16),
  },
});