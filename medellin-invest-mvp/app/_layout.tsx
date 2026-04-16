import { Component, ErrorInfo, ReactNode, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

type BoundaryState = { error: Error | null };

class RenderErrorBoundary extends Component<{ children: ReactNode }, BoundaryState> {
  state: BoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[RootLayout] render error:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <ScrollView
          style={boundaryStyles.root}
          contentContainerStyle={boundaryStyles.content}
        >
          <Text style={boundaryStyles.title}>App failed to render</Text>
          <Text style={boundaryStyles.message}>{this.state.error.message}</Text>
          {this.state.error.stack ? (
            <Text style={boundaryStyles.stack}>{this.state.error.stack}</Text>
          ) : null}
        </ScrollView>
      );
    }
    return this.props.children;
  }
}

const boundaryStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#7f1d1d' },
  content: { padding: 24, paddingTop: 64 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 12 },
  message: { color: '#fecaca', fontSize: 15, marginBottom: 16 },
  stack: { color: '#fde68a', fontSize: 12, fontFamily: 'Courier' },
});

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <RenderErrorBoundary>
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
              <Stack.Screen name="auth/login" options={{ presentation: 'modal' }} />
              <Stack.Screen name="auth/signup" options={{ presentation: 'modal' }} />
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
      </RenderErrorBoundary>
    </View>
  );
}
