 



import { dashboardService } from "@/lib/service/dashboard.service";
import { responsiveFontSize, responsiveHeight } from "@/lib/utils/helper";
import { hideLoader, showLoader } from "@/reduxToolkit/slice/loader.slice";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import { useDispatch, useSelector } from "react-redux";
 
interface QRItem {
  id: string;
  qrName: string;
  type: string;
  phone?: string;
  message?: string;
  url?: string;
  qrValue: string;
  scanCount: number;
  createdAt: Date;
}

const Dashboard = () => {
  const router = useRouter();
  const dispatch = useDispatch();


  // MODAL STATES
  const [modalVisible, setModalVisible] = useState(false);
  const [qrPreviewVisible, setQrPreviewVisible] = useState(false);
  const [selectedQR, setSelectedQR] = useState<QRItem | null>(null);

  // FORM STATES
  const [qrName, setQrName] = useState("");
  const [type, setType] = useState<any>(null);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState<any>({});
  const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;

   // For Edit Mode
  const [editingId, setEditingId] = useState<string | null>(null);

  // QR LIST
  const [qrList, setQrList] = useState<QRItem[]>([]);

  // Ref for capturing QR code
  const qrRef = useRef<ViewShot>(null);
  const [refreshing, setRefreshing] = useState(false);


  const data = [
    { label: "WhatsApp", value: "whatsapp" },
    { label: "Website", value: "website" },
  ];

  // VALIDATION (unchanged)
  const validate = () => {
    let valid = true;
    let err: any = {};
    if (!qrName.trim()) {
      err.qrName = "QR name is required";
      valid = false;
    }
    if (!type) {
      err.type = "Select QR type";
      valid = false;
    }
    if (type === "whatsapp") {
      if (!phone.trim()) {
        err.phone = "Phone is required";
        valid = false;
      }
      if (!message.trim()) {
        err.message = "Message is required";
        valid = false;
      }
    }
    if (type === "website") {
      if (!url.trim()) {
        err.url = "URL is required";
        valid = false;
      } else if (!url.startsWith("http")) {
        err.url = "Enter valid URL";
        valid = false;
      }
    }
    setErrors(err);
    return valid;
  };

  // OPEN MODAL FOR CREATE OR EDIT
  const openModal = (item?: QRItem) => {
    if (item) {
      // Edit Mode
      setEditingId(item.id);
      setQrName(item.qrName);
      setType(item.type);
      setPhone(item.phone || "");
      setMessage(item.message || "");
      setUrl(item.url || "");
    } else {
      // Create Mode
      setEditingId(null);
      setQrName("");
      setType(null);
      setPhone("");
      setMessage("");
      setUrl("");
    }
    setErrors({});
    setModalVisible(true);
  };

  // GENERATE / UPDATE QR
  // const handleGenerate = () => {
  //   if (!validate()) return;

  //   let qrData = type === "website" 
  //     ? url 
  //     : `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  //   const newQRData: Omit<QRItem, 'id' | 'scanCount' | 'createdAt'> = {
  //     qrName: qrName.trim(),
  //     type,
  //     phone: type === "whatsapp" ? phone : undefined,
  //     message: type === "whatsapp" ? message : undefined,
  //     url: type === "website" ? url : undefined,
  //     qrValue: qrData,
  //   };

  //   if (editingId) {
  //     // UPDATE EXISTING QR
  //     setQrList((prev) =>
  //       prev.map((item) =>
  //         item.id === editingId
  //           ? { ...item, ...newQRData }
  //           : item
  //       )
  //     );
  //   } else {
  //     // CREATE NEW QR
  //     const newQR: QRItem = {
  //       id: Date.now().toString(),
  //       ...newQRData,
  //       scanCount: 0,
  //       createdAt: new Date(),
  //     };

  //     setQrList((prev) => [newQR, ...prev]);
  //     setSelectedQR(newQR);
  //     setQrPreviewVisible(true);
  //   }

  //   // Reset and close modal
  //   setModalVisible(false);
  //   setEditingId(null);
  //   setQrName("");
  //   setType(null);
  //   setPhone("");
  //   setMessage("");
  //   setUrl("");
  //   setErrors({});
  // };



  // const handleGenerate = async () => {
  //   if (!validate()) return;
  
  //   try {
  //     let payload: any = {
  //       name: qrName.trim(),
  //       type,
  //     };
  
  //     if (type === "whatsapp") {
  //       payload.whatsappData = {
  //         phone,
  //         message,
  //       };
  //     }
  
  //     if (type === "website") {
  //       payload.websiteData = {
  //         url,
  //       };
  //     }
  
  //     const res = await dashboardService.createQR(payload);
  
  //     const qr = res.data.qr;
  
  //     // convert API QR → local UI format
  //     const newQR: QRItem = {
  //       id: qr.id,
  //       qrName: qr.name,
  //       type: qr.type,
  //       phone: qr.whatsappData?.phone,
  //       message: qr.whatsappData?.message,
  //       url: qr.websiteData?.url,
  //       qrValue:
  //         qr.type === "website"
  //           ? qr.websiteData?.url || ""
  //           : `http://localhost:5000/api/${qr.id} || ''`,
  //       scanCount: qr.scans,
  //       createdAt: new Date(qr.createdAt),
  //     };
  
  //     setQrList((prev) => [newQR, ...prev]);
  
  //     setSelectedQR(newQR);
  //     setQrPreviewVisible(true);
  
  //     setModalVisible(false);
  //     setQrName("");
  //     setType(null);
  //     setPhone("");
  //     setMessage("");
  //     setUrl("");
  //     setErrors({});
  //   } catch (error: any) {
  //     console.log("Create QR Error:", error?.response?.data || error);
  //     Alert.alert(
  //       "Error",
  //       error?.response?.data?.message || "Failed to create QR"
  //     );
  //   }
  // };


  const handleGenerate = async () => {
    if (!validate()) return;
  
    try {
      dispatch(showLoader());
  
      let payload: any = {
        name: qrName.trim(),
        type,
      };
  
      if (type === "whatsapp") {
        payload.whatsappData = {
          phone,
          message,
        };
      }
  
      if (type === "website") {
        payload.websiteData = {
          url,
        };
      }
  
      // ===============================
      // UPDATE MODE
      // ===============================
      // if (editingId) {
      //   await dashboardService.updateQR(editingId, payload);
  
      //   // refresh list
      //   await fetchQRs();
  
      //   Alert.alert("Success", "QR updated successfully");
      // }



      if (editingId) {
        const res = await dashboardService.updateQR(editingId, payload);
      
        const qr = res.data.qr;
      
        const updatedQR: QRItem = {
          id: qr.id,
          qrName: qr.name,
          type: qr.type,
          phone: qr.whatsappData?.phone,
          message: qr.whatsappData?.message,
          url: qr.websiteData?.url,
          qrValue:`${BASE_URL}/q/${qr.id}`,
          scanCount: qr.scans,
          createdAt: new Date(qr.createdAt),
        };
      
        // 🔥 UPDATE SAME LIST (NO API REFETCH)
        setQrList((prev) =>
          prev.map((item) =>
            item.id === editingId ? updatedQR : item
          )
        );
      
        Alert.alert("Success", "QR updated successfully");
      }
  
      // ===============================
      // CREATE MODE
      // ===============================
      else {
        const res = await dashboardService.createQR(payload);
  
        const qr = res.data.qr;
  
        const newQR: QRItem = {
          id: qr.id,
          qrName: qr.name,
          type: qr.type,
          phone: qr.whatsappData?.phone,
          message: qr.whatsappData?.message,
          url: qr.websiteData?.url,
          qrValue:`${BASE_URL}/q/${qr.id}`,
          scanCount: qr.scans,
          createdAt: new Date(qr.createdAt),
        };
  
        setQrList((prev) => [newQR, ...prev]);
        setSelectedQR(newQR);
        setQrPreviewVisible(true);
      }
  
      // reset form
      setModalVisible(false);
      setEditingId(null);
      setQrName("");
      setType(null);
      setPhone("");
      setMessage("");
      setUrl("");
      setErrors({});
    } catch (error: any) {
      console.log("QR Error:", error?.response?.data || error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      dispatch(hideLoader());
    }
  };


  useEffect(() => {
    fetchQRs();
  }, []);
 
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchQRs();
    } catch (error) {
      console.log("Refresh Error:", error);
    } finally {
      setRefreshing(false);
    }
  };


  const fetchQRs = async () => {
    try {
dispatch(showLoader());
       const res = await dashboardService.getAllQRs();
  
      const formatted: QRItem[] = res.data.qrs.map((qr) => ({
        id: qr.id,
        qrName: qr.name,
        type: qr.type,
        phone: qr.whatsappData?.phone,
        message: qr.whatsappData?.message,
        url: qr.websiteData?.url,
        qrValue: `${BASE_URL}/q/${qr.id} || ''`,
        scanCount: qr.scans,
        createdAt: new Date(qr.createdAt),
      }));
  
      setQrList(formatted);
    } catch (error: any) {
      console.log("Fetch QR Error:", error?.response?.data || error);
      Alert.alert("Error", "Failed to load QR codes");
    } finally {
      dispatch(hideLoader());
     }
  };

  const showQRPreview = (item: QRItem) => {
    setSelectedQR(item);
    setQrPreviewVisible(true);
  };

  // const deleteQR = (id: string) => {
  //   Alert.alert("Delete QR Code", "Are you sure you want to delete this?", [
  //     { text: "Cancel", style: "cancel" },
  //     {
  //       text: "Delete",
  //       style: "destructive",
  //       onPress: () => setQrList((prev) => prev.filter((item) => item.id !== id)),
  //     },
  //   ]);
  // };

  const deleteQR = (id: string) => {
    Alert.alert("Delete QR Code", "Are you sure you want to delete this?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            dispatch(showLoader());
  
            await dashboardService.deleteQR(id);
  
            // 🔥 instant UI update (NO REFETCH)
            setQrList((prev) => prev.filter((item) => item.id !== id));
  
            // if deleted QR is open in preview modal
            if (selectedQR?.id === id) {
              setQrPreviewVisible(false);
              setSelectedQR(null);
            }
  
            Alert.alert("Success", "QR deleted successfully");
          } catch (error: any) {
            console.log("Delete QR Error:", error?.response?.data || error);
            Alert.alert(
              "Error",
              error?.response?.data?.message || "Failed to delete QR"
            );
          } finally {
            dispatch(hideLoader());
          }
        },
      },
    ]);
  };

  // Download / Share QR as Image
  const downloadQR = async (item: QRItem) => {
    if (!qrRef.current) return;

    try {
      const uri = await qrRef.current.capture?.();
      if (uri && (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(uri, {
          mimeType: "image/png",
          dialogTitle: `QR Code - ${item.qrName}`,
        });
      } else {
        Alert.alert("Error", "Sharing is not available on this device");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to capture QR code");
      console.error(error);
    }
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });


  const user = useSelector((state) => state.user?.user);

  return (
    <View style={{ flex: 1, backgroundColor: "#F9F9F9", paddingHorizontal: 20 }}>
      {/* HEADER */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: responsiveHeight(6.5),
        }}
      >
        <Text style={{ fontSize: responsiveFontSize(24), fontWeight: "700", color: "#111827" }}>
          QR Codes
        </Text>
        <TouchableOpacity onPress={()=> router.push('/dashboard/profile')} style={{width: 60,
        height: 60,
        borderRadius: 40,
        backgroundColor: "#1A1A40", // blue
        justifyContent: "center",
        alignItems: "center",}}>
        <Text style={{ color: "#fff",
        fontSize: responsiveFontSize(28),
        fontWeight: "700",}}>
    {user?.username?.charAt(0).toUpperCase()}
  </Text>
        </TouchableOpacity>

         

      </View>

      {/* QR LIST */}
      <FlatList
        data={qrList}
          // 🔥 ADD THIS
  refreshing={refreshing}
  onRefresh={onRefresh}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
        renderItem={({ item }) => {
          console.log('Item' ,item)
return(
        
          <TouchableOpacity
            onPress={() => showQRPreview(item)}
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 16,
              marginBottom: 15,
              borderWidth:1,
              borderColor:'#C7C7C7',
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 5,
              elevation: 3,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: responsiveFontSize(18), fontWeight: "600" }}>
                {item.qrName}
              </Text>
              <Text
                style={{
                  fontSize: responsiveFontSize(13),
                  color: item.type === "whatsapp" ? "#25D366" : "#3b82f6",
                  fontWeight: "500",
                }}
              >
                {item.type.toUpperCase()}
              </Text>
            </View>

            {item.type === "whatsapp" && (
              <>
                <Text style={{ marginTop: 8, fontSize: responsiveFontSize(14), color: "#555" }}>
                  <Text style={{ fontWeight: "500" ,fontSize:responsiveFontSize(16),color:'#000000'  }}>Phone: </Text>
                  {item.phone}
                </Text>
                <Text style={{ fontSize: responsiveFontSize(14), color: "#555" }}>
                  <Text style={{ fontWeight: "500" , fontSize:responsiveFontSize(16) ,color:'#000000' }}>Message: </Text>
                  {item.message}
                </Text>
              </>
            )}

            {item.type === "website" && (
              <Text style={{ marginTop: 8, fontSize: responsiveFontSize(14), color: "#555" }}>
                <Text style={{ fontWeight: "600" ,fontSize:responsiveFontSize(16) ,color:'#000000' }}>Destination: </Text>
                {item.url}
              </Text>
            )}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 12,
                paddingTop: 10,
                borderTopWidth: 1,
                borderTopColor: "#f0f0f0",
              }}
            >
              <Text style={{  fontSize:responsiveFontSize(16) ,color:'#000000' }}>
                Scans: <Text style={{ fontWeight: "400" ,color: "#555" }}>{item.scanCount}</Text>
              </Text>
              <Text style={{ fontSize:responsiveFontSize(16) ,color:'#000000' }}>
                Created: <Text style={{ fontWeight: "400" ,color: "#555" }}>{formatDate(item.createdAt)}</Text>
              </Text>
            </View>

            {/* Action Buttons */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 12,
                gap: 20,
              }}
            >
              <TouchableOpacity onPress={() => openModal(item)}>
                <AntDesign name="edit" size={22} color="#1A1A40" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => showQRPreview(item)}>
                <AntDesign name="eye" size={22} color="#1A1A40" />
              </TouchableOpacity>
 

              <TouchableOpacity onPress={() => deleteQR(item.id)}>
                <Feather name="trash-2" size={24} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
    )  }
      
      }
        ListEmptyComponent={
          <View style={{alignItems:"center" ,justifyContent:'center' , height:responsiveHeight(80) ,width:'100%' }}>
          <Text
            style={{
              textAlign: "center",
               color: "#888",
              fontSize: responsiveFontSize(16),
            }}
          >
            No QR codes created yet.
          </Text>
          </View>
        }
      />

      {/* FLOATING + BUTTON */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 60,
          right: 30,
          width: 70,
          height: 70,
          borderRadius: 60,
          backgroundColor: "#1A1A40",
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 6,
          elevation: 5,
        }}
        onPress={() => openModal()}   // Changed to openModal()
      >
        <AntDesign name="plus" size={26} color="#fff" />
      </TouchableOpacity>

      {/* CREATE / EDIT QR MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 20 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: responsiveFontSize(24), fontWeight: "500" }}>
                {editingId ? "Edit QR" : "Create QR"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <AntDesign name="close" size={26} color="#000" />
              </TouchableOpacity>
            </View>

            {/* QR Name */}
            <Text style={{ fontSize: responsiveFontSize(14), marginTop: 15, marginBottom: 5 }}>
              QR Name
            </Text>
            <TextInput
              placeholder="QR Name"
              value={qrName}
              onChangeText={(t) => {
                setQrName(t);
                setErrors({ ...errors, qrName: "" });
              }}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                fontSize: responsiveFontSize(14),
                borderRadius: 8,
                padding: 15,
              }}
            />
            {errors.qrName && <Text style={{ color: "red", marginTop: 5 }}>{errors.qrName}</Text>}

            {/* Type */}
            <Text style={{ fontSize: responsiveFontSize(14), marginTop: 15, marginBottom: 5 }}>
              Select Type
            </Text>
            <Dropdown
              data={data}
              labelField="label"
              valueField="value"
              placeholder="Select Type"
              value={type}
              onChange={(item) => {
                setType(item.value);
                setErrors({ ...errors, type: "" });
              }}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                padding: 15,
              }}
            />
            {errors.type && <Text style={{ color: "red" }}>{errors.type}</Text>}

            {/* WhatsApp Fields */}
            {type === "whatsapp" && (
              <>
                <Text style={{ fontSize: responsiveFontSize(14), marginTop: 15, marginBottom: 5 }}>Phone</Text>
                <TextInput
                  placeholder="Phone (with country code)"
                  value={phone}
                  onChangeText={(t) => {
                    setPhone(t);
                    setErrors({ ...errors, phone: "" });
                  }}
                  keyboardType="phone-pad"
                  style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 8,
                    padding: 15,
                    fontSize: responsiveFontSize(14),
                  }}
                />
                {errors.phone && <Text style={{ color: "red" }}>{errors.phone}</Text>}

                <Text style={{ fontSize: responsiveFontSize(14), marginTop: 15, marginBottom: 5 }}>Message</Text>
                <TextInput
                  placeholder="Message"
                  value={message}
                  onChangeText={(t) => {
                    setMessage(t);
                    setErrors({ ...errors, message: "" });
                  }}
                  style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 8,
                    padding: 15,
                    fontSize: responsiveFontSize(14),
                  }}
                />
                {errors.message && <Text style={{ color: "red" }}>{errors.message}</Text>}
              </>
            )}

            {/* Website Field */}
            {type === "website" && (
              <>
                <Text style={{ fontSize: responsiveFontSize(14), marginTop: 15, marginBottom: 5 }}>URL</Text>
                <TextInput
                  placeholder="https://example.com"
                  value={url}
                  onChangeText={(t) => {
                    setUrl(t);
                    setErrors({ ...errors, url: "" });
                  }}
                  style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 8,
                    padding: 15,
                    fontSize: responsiveFontSize(14),
                  }}
                />
                {errors.url && <Text style={{ color: "red" }}>{errors.url}</Text>}
              </>
            )}

            <TouchableOpacity
              onPress={handleGenerate}
              style={{
                backgroundColor: "#1A1A40",
                padding: 15,
                borderRadius: 10,
                marginTop: 25,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: responsiveFontSize(16), fontWeight: "500" }}>
                {editingId ? "Update QR" : "Generate QR"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* QR PREVIEW MODAL */}
      <Modal visible={qrPreviewVisible} animationType="fade" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.75)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          {selectedQR && (
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 16,
                padding: 25,
                alignItems: "center",
                width: "100%",
                maxWidth: 340,
              }}
            >
              <Text style={{ fontSize: responsiveFontSize(20), fontWeight: "600", marginBottom: 20 }}>
                {selectedQR.qrName}
              </Text>

              <ViewShot ref={qrRef} options={{ format: "png", quality: 1.0 }}>
                <View style={{ padding: 20, backgroundColor: "white" }}>
                  <QRCode value={selectedQR.qrValue} size={230} />
                </View>
              </ViewShot>

              <Text style={{ marginTop: 15, marginBottom: 25, color: "#666" }}>Scan this QR code</Text>

              <View style={{ flexDirection: "row", gap: 15 }}>
                <TouchableOpacity
                  onPress={() => downloadQR(selectedQR)}
                  style={{
                    backgroundColor: "#1A1A40",
                    paddingVertical: 12,
                    paddingHorizontal: 25,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ color: "#fff" }}>Download</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setQrPreviewVisible(false)}
                  style={{
                    backgroundColor: "#ddd",
                    paddingVertical: 12,
                    paddingHorizontal: 25,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ color: "#333" }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default Dashboard;



