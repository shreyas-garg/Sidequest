import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/src/theme';

interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  icon?: string;
}

export const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChangeText,
  label,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  style,
  icon,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const styles = StyleSheet.create({
    container: {
      marginBottom: SPACING.md,
    },
    label: {
      fontSize: TYPOGRAPHY.body2.fontSize,
      lineHeight: TYPOGRAPHY.body2.lineHeight,
      fontWeight: TYPOGRAPHY.body2.fontWeight,
      color: COLORS.gray700,
      marginBottom: SPACING.sm,
    } as TextStyle,
    inputWrapper: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      borderWidth: 2,
      borderColor: isFocused ? COLORS.primary : COLORS.gray200,
      borderRadius: BORDER_RADIUS.lg,
      paddingHorizontal: SPACING.md,
      backgroundColor: COLORS.gray50,
      ...SHADOWS.sm,
    },
    input: {
      flex: 1,
      paddingVertical: SPACING.md,
      fontSize: TYPOGRAPHY.body1.fontSize,
      lineHeight: TYPOGRAPHY.body1.lineHeight,
      fontWeight: TYPOGRAPHY.body1.fontWeight,
      color: COLORS.gray900,
    } as TextStyle,
    icon: {
      marginRight: SPACING.sm,
    },
    passwordToggle: {
      padding: SPACING.sm,
    },
    errorText: {
      fontSize: TYPOGRAPHY.caption.fontSize,
      lineHeight: TYPOGRAPHY.caption.lineHeight,
      fontWeight: TYPOGRAPHY.caption.fontWeight,
      color: COLORS.error,
      marginTop: SPACING.sm,
    } as TextStyle,
  });

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        {icon && (
          <Ionicons
            name={icon as any}
            size={20}
            color={isFocused ? COLORS.primary : COLORS.gray400}
            style={styles.icon}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray400}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye' : 'eye-off'}
              size={20}
              color={COLORS.gray400}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};
