// import Button from "@/components/Button";
// import InputField from "@/components/InputField";
// import { responsiveFontSize, responsiveHeight, responsiveWidth } from "@/lib/utils/helper";
// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import { Image, Text, View } from "react-native";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
// const router =useRouter();

//   const [errors, setErrors] = useState<any>({});

//   const validate = () => {
//     let valid = true;
//     let newErrors: any = {};

//     // Email validation
//     if (!email.trim()) {
//       newErrors.email = "Email is required";
//       valid = false;
//     } else if (!/\S+@\S+\.\S+/.test(email)) {
//       newErrors.email = "Enter a valid email";
//       valid = false;
//     }

   
//     setErrors(newErrors);
//     return valid;
//   };

//   const handleLogin = () => {
//     if (validate()) {
//       console.log("Login success", { email, password });
//       router.push({
//         pathname: '/auth/otpVarification',
//         params: { email },
//       });
//     }
//   };

//   return (
//     <View
//       style={{
//         flex: 1,
//         backgroundColor: "#F9F9F9",
//         paddingHorizontal: 20,
//         alignItems: "center",
//       }}
//     >
//       {/* Logo */}
//       <Image
//         source={require("../../assets/images/QRlogo.png")}
//         style={{ width: responsiveWidth(100), height: responsiveHeight(20), marginTop: 80, marginBottom: 80 }}
//         resizeMode="contain"
//       />

//       {/* Email */}
//       <InputField
//         title="Email"
//         value={email}
//         onChangeText={(text: string) => {
//           setEmail(text);
//           setErrors({ ...errors, email: "" });
//         }}
//         placeholder="Enter your email"
//         keyboardType="email-address"
//       />
//       {errors.email && (
//         <Text style={{ color: "red", fontSize: responsiveFontSize(12), alignSelf: "flex-start" }}>
//           {errors.email}
//         </Text>
//       )}

      


 

//       {/* Login Button */}
//       <View style={{ width: "100%", marginTop: 10 }}>
//         <Button title="Continue" onPress={handleLogin} />
//       </View>

    
//     </View>
//   );
// };

// export default ForgotPassword;



import Button from "@/components/Button";
import InputField from "@/components/InputField";
import {
    responsiveFontSize,
    responsiveHeight,
    responsiveWidth,
    showToast,
} from "@/lib/utils/helper";

import { authService } from "@/lib/service/auth.service";
import { hideLoader, showLoader } from "@/reduxToolkit/slice/loader.slice";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    Text,
    View,
} from "react-native";
import { useDispatch } from "react-redux";
 
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    let valid = true;
    let newErrors: any = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // ===============================
  // FORGOT PASSWORD FUNCTION
  // ===============================
  const handleForgotPassword = async () => {
    if (!validate()) return;

    try {
      const payload = { email };

      console.log("Forgot Password Payload:", payload);

      dispatch(showLoader());

      const res = await authService.forgotPassword(payload);

      dispatch(hideLoader());

      console.log("Forgot Response:", res);

      if (res?.success) {
        showToast("success", res.message);

        router.push({
          pathname: "/auth/forgotOtpvarification",
          params: { email },
        });
      } else {
        showToast("error", res?.message || "Request failed");
      }
    } catch (err: any) {
      dispatch(hideLoader());

      console.log("Forgot Error:", err?.response?.data || err.message);

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
        alignItems: "center",
      }}
    >
      {/* Logo */}
      <Image
        source={require("../../assets/images/QRlogo.png")}
        style={{
          width: responsiveWidth(100),
          height: responsiveHeight(20),
          marginTop: 80,
          marginBottom: 80,
        }}
        resizeMode="contain"
      />

       {/* Email */}
      <InputField
        title="Email"
        value={email}
        onChangeText={(text: string) => {
          setEmail(text);
          setErrors({ ...errors, email: "" });
        }}
        placeholder="Enter your email"
        keyboardType="email-address"
      />

      {errors.email && (
        <Text
          style={{
            color: "red",
            fontSize: responsiveFontSize(12),
            alignSelf: "flex-start",
          }}
        >
          {errors.email}
        </Text>
      )}

      {/* Button */}
      <View style={{ width: "100%", marginTop: 10 }}>
        <Button title="Continue" onPress={handleForgotPassword} />
      </View>
    </View>
  );
};

export default ForgotPassword;