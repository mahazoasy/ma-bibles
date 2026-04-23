import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { BibleProvider } from '../src/context/BibleContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <BibleProvider>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ title: 'Page non trouvée' }} />
        </Stack>
      </BibleProvider>
    </SafeAreaProvider>
  );
}
