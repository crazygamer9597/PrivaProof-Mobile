import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../lib/ThemeContext';

export default function Header() {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.header, { 
      backgroundColor: colors.primary,
      borderBottomColor: colors.secondary 
    }]}>
      <View style={styles.heroSection}>
        <Text style={[styles.title, { color: colors.text }]}>Priva Proof Verifier</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>Secure QR Code Verification</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
});
