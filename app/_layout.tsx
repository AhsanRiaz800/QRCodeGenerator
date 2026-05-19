// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import 'react-native-reanimated';

// import { useColorScheme } from '@/hooks/use-color-scheme';

// export const unstable_settings = {
//   anchor: '(tabs)',
// };

// export default function RootLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <Stack>
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
//       </Stack>
//       <StatusBar style="auto" />
//     </ThemeProvider>
//   );
// }



import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

// ✅ ADD THESE
 import Loader from '@/components/Loader';
import toastConfig from '@/lib/utils/helper';
import store from '@/reduxToolkit/store/store';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsReady(true);
      await SplashScreen.hideAsync();
    }

    prepare();
  }, []);

  if (!isReady) return null;

  return (

    <Provider store={store}>

    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
       <Loader />
      <Stack screenOptions={{ headerShown: false }}>
        <Slot />
      </Stack>

      <StatusBar style="auto" />

      {/* ✅ THIS IS REQUIRED */}
      <Toast config={toastConfig} />

    </ThemeProvider>
 </Provider>
  );
}