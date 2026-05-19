// import Button from "@/components/Button";
// import InputField from "@/components/InputField";
// import { responsiveFontSize, responsiveHeight, responsiveWidth } from "@/lib/utils/helper";
// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import { Image, Text, TouchableOpacity, View } from "react-native";

// const CreateAccount = () => {
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const router =useRouter();

//   const [errors, setErrors] = useState<any>({});

//   const validate = () => {
//     let valid = true;
//     let newErrors: any = {};

//     // Full Name
//     if (!fullName.trim()) {
//       newErrors.fullName = "Full name is required";
//       valid = false;
//     }

//     // Email
//     if (!email.trim()) {
//       newErrors.email = "Email is required";
//       valid = false;
//     } else if (!/\S+@\S+\.\S+/.test(email)) {
//       newErrors.email = "Enter a valid email";
//       valid = false;
//     }

//     // Phone
//     if (!phone.trim()) {
//       newErrors.phone = "Phone number is required";
//       valid = false;
//     } else if (phone.length < 10) {
//       newErrors.phone = "Enter a valid phone number";
//       valid = false;
//     }

//     // Password
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
//    const handleSignup = () => {
//     if (validate()) {
//       console.log("Signup success", {
//         fullName,
//         email,
//         phone,
//         password,
//       });
//     }
 
//  router.push({
//     pathname: '/auth/otpVarification',
//     params: { email },
//   });

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
//         style={{
//           width: responsiveWidth(90),
//           height: responsiveHeight(18),
//           marginTop: 60,
//           marginBottom: 40,
//         }}
//         resizeMode="contain"
//       />

//       {/* Full Name */}
//       <InputField
//         title="Full Name"
//         value={fullName}
//         onChangeText={(text: string) => {
//           setFullName(text);
//           setErrors({ ...errors, fullName: "" });
//         }}
//         placeholder="Enter your full name"
//       />
//       {errors.fullName && (
//         <Text style={{ color: "red", fontSize: responsiveFontSize(12), alignSelf: "flex-start" }}>
//           {errors.fullName}
//         </Text>
//       )}

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

//       {/* Phone */}
//       <InputField
//         title="Phone"
//         value={phone}
//         onChangeText={(text: string) => {
//           setPhone(text);
//           setErrors({ ...errors, phone: "" });
//         }}
//         placeholder="Enter your phone number"
//         keyboardType="phone-pad"
//       />
//       {errors.phone && (
//         <Text style={{ color: "red", fontSize: responsiveFontSize(12), alignSelf: "flex-start" }}>
//           {errors.phone}
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
//         secureTextEntry={true}
//       />
//       {errors.password && (
//         <Text style={{ color: "red", fontSize: responsiveFontSize(12), alignSelf: "flex-start" }}>
//           {errors.password}
//         </Text>
//       )}

//       {/* Signup Button */}
//       <View style={{ width: "100%", marginTop: 15 }}>
//         <Button title="Sign Up" onPress={handleSignup} />
//       </View>

//       {/* Login Link */}
//       <View style={{ flexDirection: "row", marginTop: 20 }}>
//         <Text style={{ color: "#6B7280" }}>Already have an account? </Text>

//         <TouchableOpacity onPress={()=>router.back()}>
//           <Text
//             style={{
//               color: "#1A1A40",
//               textDecorationLine: "underline",
//               fontWeight: "600",
//             }}
//           >
//             Login
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default CreateAccount;



import Button from "@/components/Button";
import InputField from "@/components/InputField";
import { authService } from "@/lib/service/auth.service";
import { responsiveFontSize, responsiveHeight, responsiveWidth, showToast } from "@/lib/utils/helper";
import { hideLoader, showLoader } from "@/reduxToolkit/slice/loader.slice";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
 
const CreateAccount = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    let valid = true;
    let newErrors: any = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
      valid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email";
      valid = false;
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
      valid = false;
    } else if (phone.length < 10) {
      newErrors.phone = "Enter a valid phone number";
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
  // SIGNUP FUNCTION (API INTEGRATED)
  // ===============================


 

const handleSignup = async () => {
  if (!validate()) return;

  try {
    const payload = {
      username: fullName,
      email: email,
      phoneNumber: phone,
      password: password,
    };

    console.log("Signup Payload:", payload);

    dispatch(showLoader());

    const res = await authService.signup(payload);

    console.log("Signup Response:", res);

    dispatch(hideLoader());

    if (res?.success) {
      showToast("success", res.message || "Signup successful");

      router.push({
        pathname: "/auth/otpVarification",
        params: { email },
      });
    } else {
      showToast("error", res?.message || "Signup failed");
    }
  } catch (err: any) {
    console.log("Signup Error:", err?.response?.data || err.message);

    dispatch(hideLoader());

    showToast(
      "error",
      err?.response?.data?.message ||
        err?.message ||
        "Error while signing up"
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
          width: responsiveWidth(90),
          height: responsiveHeight(18),
          marginTop: 60,
          marginBottom: 40,
        }}
        resizeMode="contain"
      />

      {/* Full Name */}
      <InputField
        title="Full Name"
        value={fullName}
        onChangeText={(text: string) => {
          setFullName(text);
          setErrors({ ...errors, fullName: "" });
        }}
        placeholder="Enter your full name"
      />
      {errors.fullName && (
        <Text style={{ color: "red", fontSize: responsiveFontSize(12), alignSelf: "flex-start" }}>
          {errors.fullName}
        </Text>
      )}

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
        <Text style={{ color: "red", fontSize: responsiveFontSize(12), alignSelf: "flex-start" }}>
          {errors.email}
        </Text>
      )}

      {/* Phone */}
      <InputField
        title="Phone"
        value={phone}
        onChangeText={(text: string) => {
          setPhone(text);
          setErrors({ ...errors, phone: "" });
        }}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
      />
      {errors.phone && (
        <Text style={{ color: "red", fontSize: responsiveFontSize(12), alignSelf: "flex-start" }}>
          {errors.phone}
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
        <Text style={{ color: "red", fontSize: responsiveFontSize(12), alignSelf: "flex-start" }}>
          {errors.password}
        </Text>
      )}

      {/* Signup Button */}
      <View style={{ width: "100%", marginTop: 15 }}>
        <Button title="Sign Up" onPress={handleSignup} />
      </View>

      {/* Login Link */}
      <View style={{ flexDirection: "row", marginTop: 20 }}>
        <Text style={{ color: "#6B7280" }}>Already have an account? </Text>

        <TouchableOpacity onPress={() => router.back()}>
          <Text
            style={{
              color: "#1A1A40",
              textDecorationLine: "underline",
              fontWeight: "600",
            }}
          >
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateAccount;