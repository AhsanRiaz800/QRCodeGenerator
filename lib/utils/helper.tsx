import React from 'react';
import { Dimensions, PixelRatio, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
   const { width: SCREEN_WIDTH } =
    Dimensions.get('window'); const toastConfig =
     { success: ({ text1 }:any) => ( <View style={styles.successToastContainer}> 
     {/* <Sucess width={20} height={20} /> */} 
     <Text style={styles.successToastText}>{text1}</Text>
      </View> ),
       error: ({ text1 }:any) => ( <View style={styles.errorToastContainer}>
         {/* <Error width={20} height={20} /> */}
          <Text style={styles.errorToastText}>{text1}</Text> 
          </View> ), }; 
          
          const styles = StyleSheet.create({ successToastContainer: { alignItems:'center', width:'85%', height:45, backgroundColor: '#BBF7D0',
             // padding: 10,
              borderRadius: 8, flexDirection:'row', paddingHorizontal:15, 
              // marginHorizontal: 10,
               // marginBottom: ,
               // positions the toast at the bottom 
               }, 
               errorToastContainer: { 
                alignItems:'center', width:'85%', 
                height:45, backgroundColor: '#FECACA', 
                // padding: 10, 
                flexDirection:'row',
                 borderRadius: 8, 
                 // marginHorizontal: 0,
                  paddingHorizontal:15, 
                  // marginBottom: 15,
                   // positions the toast at the bottom
                    }, 
                    successToastText: { 
                        color: '222222', fontFamily:"WorkSans-Regular", marginLeft:7, fontSize: 16, }, 
                        errorToastText: { color: '#222222', fontFamily:"WorkSans-Regular", fontSize: 16, marginLeft:7, }, });
                         export default toastConfig; export const showToast = (type:any, message:any) => { 
                            // const icon = type === 'error'
                             // ? <Error width={20} height={20} />
                              // Replace with your error icon path 
                              // : <Sucess width={20} height={20} /> 
                              // Replace with your success icon path 
                              Toast.show({ type: type, text1: message, 
                                // props: { icon: icon }, 
                                position: 'bottom', }); };
                                 // Define a scale factor based on the screen width 
                                 const scaleFactor = SCREEN_WIDTH / 400; 
                                 // Use 400 as a general base reference
                                  export function responsiveFontSize(fontSize: number):
                                   number { return PixelRatio.roundToNearestPixel(fontSize * scaleFactor); } 
                                   const { height } = Dimensions.get('window'); 
                                   /** * Calculates responsive height based on percentage of screen height. * @param {number} percent - The percentage of the screen height. * @returns {number} - The calculated height. */ 
                                   export const responsiveHeight = (percent:any) => (height * percent) / 100; const { width } = Dimensions.get('window'); 
                                   /** * Calculates responsive width based on percentage of screen width. * @param {number} percent - The percentage of the screen width. * @returns {number} - The calculated width. */ 
                                   export const responsiveWidth = (percent:any) => (width * percent) / 100;