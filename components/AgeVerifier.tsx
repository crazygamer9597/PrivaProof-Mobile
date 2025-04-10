import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Check } from 'lucide-react-native';
import { useTheme } from '../lib/ThemeContext';

interface AgeVerifierProps {
  itemAge: number | null;
}

export default function AgeVerifier({ itemAge }: AgeVerifierProps) {
  const { colors } = useTheme();
  const [verifierAge, setVerifierAge] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<{
    message: string;
    isError: boolean;
    passed: boolean;
  } | null>(null);

  const handleAgeVerification = () => {
    if (!itemAge) {
      setVerificationResult({
        message: 'No age data available for this item',
        isError: true,
        passed: false,
      });
      return;
    }

    const inputAge = parseInt(verifierAge);
    if (isNaN(inputAge) || inputAge < 4 || inputAge > 99) {
      setVerificationResult({
        message: 'Please enter a valid age between 4 and 99',
        isError: true,
        passed: false,
      });
      return;
    }

    const isAgeValid = inputAge < itemAge;
    setVerificationResult({
      message: isAgeValid 
        ? 'Age verification passed'
        : 'Age verification failed',
      isError: !isAgeValid,
      passed: isAgeValid,
    });
  };

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Verifier</Text>
      <View style={styles.verifierContainer}>
        <View style={styles.ageInputContainer}>
          <Text style={[styles.ageLabel, { color: colors.text }]}>Check Age:</Text>
          <TextInput
            style={[styles.ageInput, { 
              backgroundColor: colors.input,
              color: colors.text,
              borderColor: colors.border,
            }]}
            value={verifierAge}
            onChangeText={setVerifierAge}
            keyboardType="numeric"
            placeholder="Enter age (4-99)"
            placeholderTextColor={colors.placeholder}
          />
        </View>
        <TouchableOpacity
          style={[styles.verifyButton, { backgroundColor: colors.primary }]}
          onPress={handleAgeVerification}
        >
          <Text style={styles.verifyButtonText}>Verify Age</Text>
        </TouchableOpacity>
        {verificationResult && (
          <View style={styles.resultContainer}>
            <Text
              style={[
                styles.verificationResult,
                verificationResult.isError ? { color: colors.error } : { color: colors.success },
              ]}
            >
              {verificationResult.message}
            </Text>
            {verificationResult.passed && (
              <View style={styles.tickContainer}>
                <Check size={24} color={colors.success} />
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  verifierContainer: {
    marginTop: 10,
  },
  ageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ageLabel: {
    fontSize: 14,
    marginRight: 10,
  },
  ageInput: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    fontSize: 14,
    borderWidth: 1,
  },
  verifyButton: {
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  resultContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  verificationResult: {
    fontSize: 14,
    textAlign: 'center',
  },
  tickContainer: {
    marginTop: 5,
  },
}); 