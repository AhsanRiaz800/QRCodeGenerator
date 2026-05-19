 



// import InputField from "@/components/InputField";
// import { Feather, MaterialIcons } from "@expo/vector-icons";
// import React, { useState } from "react";
// import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";


//  import { responsiveFontSize, showToast } from "@/lib/utils/helper";
// import { clearUser } from '@/reduxToolkit/slice/User.slice';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useRouter } from 'expo-router';
// import { useDispatch, useSelector } from 'react-redux';


// const Profile = () => {
//   const [fullName, setFullName] = useState("John Doe");
//   const [email, setEmail] = useState("john.doe@example.com");
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const user = useSelector((state) => state.user?.user); // get user from Redux

//   console.log('User',user)
//   const handleLogout = async () => {
//     console.log('LOGOUT')
//     try {
//       // ✅ Remove from AsyncStorage
//       await AsyncStorage.removeItem('token');
//       await AsyncStorage.removeItem('user');
  
//       // ✅ Clear Redux
//       dispatch(clearUser());
  
//       // ✅ Optional toast
//       showToast('success', 'Logged out successfully');
  
//       // ✅ Navigate (replace so user can't go back)
//       router.replace('/auth/login');
//     } catch (error) {
//       console.log('Logout Error:', error);
//       showToast('error', 'Something went wrong');
//     }
//   };




//   return (
//     <View style={styles.container}>
      
//       {/* Title */}
 
//       {/* Profile Section */}
//       <View style={styles.profileRow}>
//         <View style={styles.imageWrapper}>
//           <Image
//             source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
//             style={styles.profileImage}
//           />

//           {/* Edit Icon */}
//           <TouchableOpacity style={styles.editIcon}>
//             <MaterialIcons name="edit" size={20} color="#525867" />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.info}>
//           <Text style={styles.name}>{fullName}</Text>
//           <Text style={styles.phone}>+92 3048026951</Text>
//         </View>
//       </View>

//       {/* Bottom White Sheet */}
//       <View style={styles.bottomSheet}>
           
//           {/* Input Fields */}
//           <InputField
//             title="Full Name"
//             value={fullName}
//             color="#6D7A8D"
//             onChangeText={setFullName}
//             placeholder="Enter full name"
//           />
//           <InputField
//             title="Email"
//             color="#6D7A8D"
//             value={email}
//             onChangeText={setEmail}
//             placeholder="Enter email"
//           />

//           {/* Divider */}
//           <View style={[styles.divider ,{marginTop:25 ,height:10 ,backgroundColor:'#F7F9FA'}]} />
//           <Text style={{fontSize:responsiveFontSize(18), fontWeight:'600' ,marginTop:15 ,color:'#2B3137'}}>Other menu</Text>

           
//           {/* Action Rows */}
//           <TouchableOpacity style={[styles.actionRow ,{marginTop:20}]}>
//             <Text style={styles.actionText}>Share Feedback</Text>
//             <Feather name="chevron-right" size={24} color="#9FA6B0" />
//           </TouchableOpacity>
//           <View style={styles.divider} />

//           <TouchableOpacity style={styles.actionRow}>
//             <Text style={styles.actionText}>FAQ</Text>
//             <Feather name="chevron-right" size={24} color="#9FA6B0" />
//           </TouchableOpacity>
//           <View style={styles.divider} />

//           <TouchableOpacity onPress={handleLogout} style={styles.actionRow}>
//             <Text style={[styles.actionText ,{color:'#EF144A' }]}>Log Out</Text>
//             <Feather name="chevron-right" size={24} color="#9FA6B0" />
//           </TouchableOpacity>
//           <View style={styles.divider} />

//        </View>
//     </View>
//   );
// };

// export default Profile;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//   },
//   title: {
//     color: "#fff",
//     fontSize: responsiveFontSize(20),
//     fontWeight: "600",
//     paddingHorizontal: 20,
//     marginTop: 55,
//     marginBottom: 20,
//   },
//   profileRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     marginTop: 80,
//   },
//   imageWrapper: {
//     position: "relative",
//   },
//   profileImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//   },
//   editIcon: {
//     position: "absolute",
//     top: -3.5,
//     right: -3.5,
//     backgroundColor: "white",
//     borderWidth: 3,
//     borderRadius: 40,
//     borderColor: "#278BF7",
//     padding: 4,
//   },
//   info: {
//     marginLeft: 15,
//   },
//   name: {
//     color: "#000000",
//     fontSize: responsiveFontSize(22),
//     fontWeight: "700",
//   },
//   phone: {
//     color: "#ddd",
//     fontSize: responsiveFontSize(16),
//     marginTop: 5,
//   },
//   bottomSheet: {
//     height: '73%',
//     paddingHorizontal : 20 ,paddingTop:30,
      
//     borderTopLeftRadius: 22,
//     borderTopRightRadius: 22,
//     width: '100%',
//     backgroundColor: 'white',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#F3F4F5',
//     marginVertical: 10,
//   },
//   actionRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 10,
//   },
//   actionText: {
//     fontSize: responsiveFontSize(16),
//     color: '#2B3137',
//     fontWeight: '400',
//   },
// });

import InputField from "@/components/InputField";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import { authService } from "@/lib/service/auth.service";
import { responsiveFontSize, showToast } from "@/lib/utils/helper";
import { clearUser, setUser } from "@/reduxToolkit/slice/User.slice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

const Profile = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state) => state.user?.user);

  // ✅ Local states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // ✅ Store original values to compare
  const [originalName, setOriginalName] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");

  // ✅ Set initial values from Redux
  useEffect(() => {
    if (user) {
      setFullName(user?.username || "");
      setEmail(user?.email || "");

      setOriginalName(user?.username || "");
      setOriginalEmail(user?.email || "");
    }
  }, [user]);

  // ✅ Check if anything changed
  const isChanged = useMemo(() => {
    return fullName !== originalName || email !== originalEmail;
  }, [fullName, email, originalName, originalEmail]);

  // ✅ Update handler
//   const handleUpdate = async () => {
//     try {
//       console.log("Updating...", { fullName, email });

//       // 👉 Call your API here
//       // await updateProfile({ username: fullName, email });

//       // After success:
//       showToast("success", "Profile updated");

//       // Update original values so button disables again
//       setOriginalName(fullName);
//       setOriginalEmail(email);
//     } catch (error) {
//       console.log("Update Error:", error);
//       showToast("error", "Update failed");
//     }
//   };



const handleUpdate = async () => {
    try {
      const payload = {};
  
      if (fullName !== originalName) {
        payload.username = fullName;
      }
  
      if (email !== originalEmail) {
        payload.email = email;
      }
  
      if (Object.keys(payload).length === 0) return;
  
      const res = await authService.updateProfile(payload);
  
      if (res?.success) {
        showToast("success", res.message);
  
        // ✅ Update Redux (keep token)
        dispatch(
          setUser({
            user: res.data.user,
            token: user?.token,
          })
        );
  
        // ✅ Update AsyncStorage
        await AsyncStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );
  
        // ✅ Reset original values
        setOriginalName(res.data.user.username);
        setOriginalEmail(res.data.user.email);
      }
    } catch (error) {
      console.log("Update Error:", error);
  
      showToast(
        "error",
        error?.response?.data?.message || "Update failed"
      );
    }
  };


  // ✅ Logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");

      dispatch(clearUser());

      showToast("success", "Logged out successfully");

      router.replace("/auth/login");
    } catch (error) {
      console.log("Logout Error:", error);
      showToast("error", "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileRow}>
        {/* <View style={styles.imageWrapper}>
          <Image
            source={{
              uri: "https://randomuser.me/api/portraits/men/1.jpg",
            }}
            style={styles.profileImage}
          />
 

        </View> */}
        <View style={styles.avatar}>
  <Text style={styles.avatarText}>
    {fullName?.charAt(0).toUpperCase()}
  </Text>
</View>

        <View style={styles.info}>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.phone}>
            {user?.phoneNumber || "No phone"}
          </Text>
        </View>
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        {/* Inputs */}
        <InputField
          title="Full Name"
          value={fullName}
          color="#6D7A8D"
          onChangeText={setFullName}
          placeholder="Enter full name"
        />

        <InputField
          title="Email"
          color="#6D7A8D"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email"
        />

        {/* ✅ Update Button */}
        <TouchableOpacity
          onPress={handleUpdate}
          disabled={!isChanged}
          style={[
            styles.updateBtn,
            {
              backgroundColor: isChanged ? "#1A1A40" : "#C7CDD6",
            },
          ]}
        >
          <Text style={styles.updateText}>Update</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View
          style={[
            styles.divider,
            { marginTop: 25, height: 10, backgroundColor: "#F7F9FA" },
          ]}
        />

        <Text style={styles.menuTitle}>Other menu</Text>

        {/* Menu */}
        <TouchableOpacity style={[styles.actionRow, { marginTop: 20 }]}>
          <Text style={styles.actionText}>Share Feedback</Text>
          <Feather name="chevron-right" size={24} color="#9FA6B0" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.actionRow}>
          <Text style={styles.actionText}>FAQ</Text>
          <Feather name="chevron-right" size={24} color="#9FA6B0" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity onPress={handleLogout} style={styles.actionRow}>
          <Text style={[styles.actionText, { color: "#EF144A" }]}>
            Log Out
          </Text>
          <Feather name="chevron-right" size={24} color="#9FA6B0" />
        </TouchableOpacity>

        <View style={styles.divider} />
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({

    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#1A1A40", // blue
        justifyContent: "center",
        alignItems: "center",
      },
      
      avatarText: {
        color: "#fff",
        fontSize: responsiveFontSize(28),
        fontWeight: "700",
      },

      
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 80,
  },
  imageWrapper: {
    position: "relative",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editIcon: {
    position: "absolute",
    top: -3.5,
    right: -3.5,
    backgroundColor: "white",
    borderWidth: 3,
    borderRadius: 40,
    borderColor: "#1A1A40",
    padding: 4,
  },
  info: {
    marginLeft: 15,
  },
  name: {
    color: "#000000",
    fontSize: responsiveFontSize(22),
    fontWeight: "700",
  },
  phone: {
    color: "#888",
    fontSize: responsiveFontSize(16),
    marginTop: 5,
  },
  bottomSheet: {
    height: "73%",
    paddingHorizontal: 20,
    paddingTop: 30,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    width: "100%",
    backgroundColor: "white",
  },
  updateBtn: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  updateText: {
    color: "#fff",
    fontSize: responsiveFontSize(16),
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F5",
    marginVertical: 10,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  actionText: {
    fontSize: responsiveFontSize(16),
    color: "#2B3137",
    fontWeight: "400",
  },
  menuTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: "600",
    marginTop: 15,
    color: "#2B3137",
  },
});