// import Button from "@/components/Button";
// import InputField from "@/components/InputField";
// import { responsiveFontSize, responsiveHeight, responsiveWidth } from "@/lib/utils/helper";
// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import { Image, Text, TouchableOpacity, View } from "react-native";

// const Login = () => {
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

//     // Password validation
//     if (!password.trim()) {
//       newErrors.password = "Password is required";
//       valid = false;
//     } else if (password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//       valid = false;
//     }

//     setErrors(newErrors);
//     return valid;
//   };

//   const handleLogin = () => {
//     if (validate()) {
//       console.log("Login success", { email, password });
//       router.replace('/dashboard/dashboard')
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

//       {/* Password */}
//       <InputField
//         title="Password"
//         value={password}
//         onChangeText={(text: string) => {
//           setPassword(text);
//           setErrors({ ...errors, password: "" });
//         }}
//         placeholder="Enter your password"
//         secureTextEntry={true}   // 🔒 dots enabled
//       />
//       {errors.password && (
//         <Text style={{ color: "red", fontSize: responsiveFontSize(12), alignSelf: "flex-start" }}>
//           {errors.password}
//         </Text>
//       )}


//  <TouchableOpacity
//   style={{
//     width: "100%",
//     alignItems: "flex-end",
//     marginTop: 8,
//   }}
//   onPress={()=>router.push('/auth/forgotPassword')}
// >
//   <Text
//     style={{
//       color: "#3B3B98",
//       fontSize: responsiveFontSize(13),
//       fontWeight: "500",
//     }}
//   >
//     Forgot Password?
//   </Text>
// </TouchableOpacity>

//       {/* Login Button */}
//       <View style={{ width: "100%", marginTop: 10 }}>
//         <Button title="Login" onPress={handleLogin} />
//       </View>

//       {/* Signup */}
//       <View style={{ flexDirection: "row", marginTop: 20 }}>
//         <Text style={{ color: "#6B7280" }}>Don't have an account? </Text>

//         <TouchableOpacity onPress={()=>router.push('/auth/createAccount')}>
//           <Text
//             style={{
//               color: "#1A1A40",
//               textDecorationLine: "underline",
//               fontWeight: "600",
//             }}
//           >
//             Sign up
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default Login;


import Button from "@/components/Button";
import InputField from "@/components/InputField";
import { authService } from "@/lib/service/auth.service";
import {
    responsiveFontSize,
    responsiveHeight,
    responsiveWidth,
    showToast,
} from "@/lib/utils/helper";
import { hideLoader, showLoader } from "@/reduxToolkit/slice/loader.slice";
import { setUser } from "@/reduxToolkit/slice/User.slice";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useDispatch } from "react-redux";
 
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    if (!password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // ===============================
  // LOGIN FUNCTION (API INTEGRATED)
  // ===============================
  const handleLogin = async () => {
    if (!validate()) return;

    try {
      const payload = {
        email,
        password,
      };

      console.log("Login Payload:", payload);

      dispatch(showLoader());

       
      const res = await authService.login(payload);

      dispatch(hideLoader());

      console.log("Login Response:", res);

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
          
        showToast("success", res.message || "Login successful");

        router.replace("/dashboard/dashboard");
      } else {
        showToast("error", res?.message || "Login failed");
      }
    } catch (err: any) {
      dispatch(hideLoader());

      console.log("Login Error:", err?.response?.data || err.message);

      showToast(
        "error",
        err?.response?.data?.message ||
          err?.message ||
          "Login failed"
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

      {/* Password */}
      <InputField
        title="Password"
        value={password}
        onChangeText={(text: string) => {
          setPassword(text);
          setErrors({ ...errors, password: "" });
        }}
        placeholder="Enter your password"
        secureTextEntry={true}
      />
      {errors.password && (
        <Text
          style={{
            color: "red",
            fontSize: responsiveFontSize(12),
            alignSelf: "flex-start",
          }}
        >
          {errors.password}
        </Text>
      )}

      {/* Forgot Password */}
      <TouchableOpacity
        style={{
          width: "100%",
          alignItems: "flex-end",
          marginTop: 8,
        }}
        onPress={() => router.push("/auth/forgotPassword")}
      >
        <Text
          style={{
            color: "#3B3B98",
            fontSize: responsiveFontSize(13),
            fontWeight: "500",
          }}
        >
          Forgot Password?
        </Text>
      </TouchableOpacity>

      {/* Login Button */}
      <View style={{ width: "100%", marginTop: 10 }}>
        <Button title="Login" onPress={handleLogin} />
      </View>

      {/* Signup */}
      <View style={{ flexDirection: "row", marginTop: 20 }}>
        <Text style={{ color: "#6B7280" }}>
          Don't have an account?{" "}
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/auth/createAccount")}
        >
          <Text
            style={{
              color: "#1A1A40",
              textDecorationLine: "underline",
              fontWeight: "600",
            }}
          >
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

