// import { Redirect } from 'expo-router';

// export default function Index() {
//   return <Redirect href="/auth/login" />;
// }




 import { setUser } from "@/reduxToolkit/slice/User.slice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useDispatch } from "react-redux";

export default function Index() {
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userString = await AsyncStorage.getItem("user");

        if (token && userString) {
          const user = JSON.parse(userString);

          // ✅ hydrate redux
          dispatch(
            setUser({
              token,
              user,
            })
          );

          // ✅ go dashboard
          setRedirectTo("/dashboard/dashboard");
        } else {
          // ❌ go login
          setRedirectTo("/auth/login");
        }
      } catch (error) {
        console.log("Auth check error:", error);

        setRedirectTo("/auth/login");
      }
    };

    checkAuth();
  }, [dispatch]);

  // 🔄 loading state while checking storage
  if (!redirectTo) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#155DFC" />
      </View>
    );
  }

  return <Redirect href={redirectTo} />;
}
 

// import { setUser } from '@/reduxToolkit/slice/User.slice';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Redirect } from 'expo-router';
// import { useEffect, useState } from 'react';
// import { ActivityIndicator, View } from 'react-native';
// import { useDispatch } from 'react-redux';
 
// export default function Index() {
//   const [redirectTo, setRedirectTo] = useState<string | null>(null);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const checkToken = async () => {
//       try {
//         const token = await AsyncStorage.getItem('token');
//         const userString = await AsyncStorage.getItem('user');

//         if (token && userString) {
//           // ✅ Populate Redux
//           const user = JSON.parse(userString);
//           dispatch(setUser({ token, user }));

//           setRedirectTo('/dashboard'); // Navigate to dashboard
//         } else {
//           setRedirectTo('/auth/email-varification'); // Navigate to login/email screen
//         }
//       } catch (error) {
//         console.log('Error reading token/user from AsyncStorage', error);
//         setRedirectTo('/auth/email-verification'); // fallback
//       }
//     };

//     checkToken();
//   }, [dispatch]);

//   if (!redirectTo) {
//     // Show loader while checking AsyncStorage
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#155DFC" />
//       </View>
//     );
//   }

//   return <Redirect href={redirectTo} />;
// }