import { StyleSheet, Text, View, TouchableOpacity, Switch } from 'react-native';
import { useState } from 'react';
import { Bell, Moon, Vibrate as Vibration } from 'lucide-react-native';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [haptics, setHaptics] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.setting}>
          <View style={styles.settingInfo}>
            <Bell size={24} color="#6366f1" />
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#2c2d31', true: '#6366f1' }}
            thumbColor={notifications ? '#fff' : '#9ca3af'}
          />
        </View>

        <View style={styles.setting}>
          <View style={styles.settingInfo}>
            <Moon size={24} color="#6366f1" />
            <Text style={styles.settingText}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#2c2d31', true: '#6366f1' }}
            thumbColor={darkMode ? '#fff' : '#9ca3af'}
          />
        </View>

        <View style={styles.setting}>
          <View style={styles.settingInfo}>
            <Vibration size={24} color="#6366f1" />
            <Text style={styles.settingText}>Haptic Feedback</Text>
          </View>
          <Switch
            value={haptics}
            onValueChange={setHaptics}
            trackColor={{ false: '#2c2d31', true: '#6366f1' }}
            thumbColor={haptics ? '#fff' : '#9ca3af'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <TouchableOpacity style={styles.aboutItem}>
          <Text style={styles.aboutText}>Version 1.0.0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.aboutItem}>
          <Text style={styles.aboutText}>Terms of Service</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.aboutItem}>
          <Text style={styles.aboutText}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1b1e',
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    color: '#fff',
    fontSize: 16,
  },
  aboutItem: {
    paddingVertical: 12,
  },
  aboutText: {
    color: '#fff',
    fontSize: 16,
  },
});