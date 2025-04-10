import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useTheme } from '../../lib/ThemeContext';
import { Bell, Moon, Vibrate as Vibration } from 'lucide-react-native';

export default function SettingsScreen() {
  const { theme, toggleTheme, colors } = useTheme();
  const [notifications, setNotifications] = React.useState(true);
  const [haptics, setHaptics] = React.useState(true);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
              <Text style={[styles.settingDescription, { color: colors.text }]}>
                Toggle between light and dark theme
              </Text>
            </View>
            <Switch
              id="dark-mode-switch"
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={theme === 'dark' ? '#ffffff' : '#f4f3f4'}
              style={{ pointerEvents: 'auto' }}
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>
          
          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <Bell size={24} color={colors.text} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>Notifications</Text>
            </View>
            <Switch
              id="notifications-switch"
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={notifications ? '#ffffff' : '#f4f3f4'}
              style={{ pointerEvents: 'auto' }}
            />
          </View>

          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <Moon size={24} color={colors.text} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>Haptic Feedback</Text>
            </View>
            <Switch
              id="haptics-switch"
              value={haptics}
              onValueChange={setHaptics}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={haptics ? '#ffffff' : '#f4f3f4'}
              style={{ pointerEvents: 'auto' }}
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          <TouchableOpacity style={[styles.aboutItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.aboutText, { color: colors.text }]}>Version 1.1.0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.aboutItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.aboutText, { color: colors.text }]}>Terms of Service</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.aboutItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.aboutText, { color: colors.text }]}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32, // Add extra padding at the bottom for better scrolling
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  aboutItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  aboutText: {
    fontSize: 16,
  },
});