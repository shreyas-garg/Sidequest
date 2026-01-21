import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { Input } from '@/src/components/Input';
import { Button } from '@/src/components/Button';
import { COLORS, SPACING, TYPOGRAPHY } from '@/src/theme';

export const SignUpScreen = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { register } = useAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      console.log('Starting signup with:', { name, email });
      await register(name, email, password);
      console.log('Signup successful');
      router.replace('/(app)/home');
    } catch (error: any) {
      console.error('Signup error in screen:', error);
      const errorMessage = typeof error === 'string' ? error : error?.message || 'An error occurred during registration';
      Alert.alert('Sign Up Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: SPACING.lg,
    },
    header: {
      marginBottom: SPACING.xl,
      alignItems: 'center',
    },
    title: {
      ...TYPOGRAPHY.h1,
      color: COLORS.primary,
      marginBottom: SPACING.sm,
    },
    subtitle: {
      ...TYPOGRAPHY.body1,
      color: COLORS.gray600,
      textAlign: 'center',
    },
    form: {
      marginBottom: SPACING.lg,
    },
    signupButton: {
      marginBottom: SPACING.md,
    },
    loginLink: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loginText: {
      ...TYPOGRAPHY.body1,
      color: COLORS.gray600,
    },
    loginBold: {
      color: COLORS.primary,
      fontWeight: '700',
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>SideQuest</Text>
          <Text style={styles.subtitle}>Create your adventure profile</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
            icon="person"
            error={errors.name}
          />

          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            icon="mail"
            error={errors.email}
          />

          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="lock-closed"
            error={errors.password}
          />

          <Input
            label="Confirm Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            icon="lock-closed"
            error={errors.confirmPassword}
          />
        </View>

        <Button
          label="Create Account"
          onPress={handleSignUp}
          isLoading={isLoading}
          style={styles.signupButton}
        />

        <View style={styles.loginLink}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <Text
            style={[styles.loginText, styles.loginBold]}
            onPress={() => router.replace('/(auth)/login')}
          >
            Sign In
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
