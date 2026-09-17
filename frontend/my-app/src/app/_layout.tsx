import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme, View } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider } from '@/context/AuthContext';
import { TicketProvider } from '@/context/TicketContext';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <TicketProvider>
          <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
            <AnimatedSplashOverlay />
            <Slot />
          </View>
        </TicketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
