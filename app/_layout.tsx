import { Stack } from 'expo-router';
import { View } from 'react-native';
import Header from '../components/Header';

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#1a1b1e' }}>
      <Header />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#1a1b1e' },
        }}
      />
    </View>
  );
}
