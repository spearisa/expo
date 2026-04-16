import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          initialRouteName="(tabs)"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" options={{ animation: 'none' }} />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="property/[id]"
            options={{ animation: 'slide_from_bottom', presentation: 'card' }}
          />
          <Stack.Screen
            name="auth/login"
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen
            name="auth/signup"
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen
            name="auth/forgot-password"
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen
            name="listings/create"
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen name="listings/edit" />
          <Stack.Screen name="dashboard/buyer" />
          <Stack.Screen name="dashboard/broker" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
