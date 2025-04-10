import { Stack } from 'expo-router';
import { View } from 'react-native';
import Header from '../components/Header';
import { ThemeProvider } from '../lib/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <View style={{ flex: 1, backgroundColor: '#1a1b1e' }}>
        <Header />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#1a1b1e' },
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </View>
    </ThemeProvider>
  );
}
