import { Tabs } from 'expo-router';
import { QrCode, Search, Settings } from 'lucide-react-native';
import { useTheme } from '../../lib/ThemeContext';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.primary,
          borderTopColor: colors.secondary,
        },
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, size }) => <QrCode size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
