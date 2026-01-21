import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../theme';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  style,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return COLORS.gray300;
    switch (variant) {
      case 'primary':
        return COLORS.primary;
      case 'secondary':
        return COLORS.accent;
      case 'outline':
        return COLORS.white;
      case 'danger':
        return COLORS.error;
      default:
        return COLORS.primary;
    }
  };

  const getTextColor = () => {
    if (variant === 'outline') return COLORS.primary;
    return COLORS.white;
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return SPACING.sm;
      case 'medium':
        return SPACING.md;
      case 'large':
        return SPACING.lg;
      default:
        return SPACING.md;
    }
  };

  const styles = StyleSheet.create({
    button: {
      backgroundColor: getBackgroundColor(),
      paddingVertical: getPadding(),
      paddingHorizontal: SPACING.lg,
      borderRadius: BORDER_RADIUS.lg,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      minHeight: 44,
      ...(variant === 'outline' && {
        borderWidth: 2,
        borderColor: COLORS.primary,
      }),
      ...SHADOWS.md,
    },
    text: {
      color: getTextColor(),
      fontSize: TYPOGRAPHY.button.fontSize,
      lineHeight: TYPOGRAPHY.button.lineHeight,
      fontWeight: TYPOGRAPHY.button.fontWeight,
    } as TextStyle,
  });

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress || (() => {})}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={styles.text}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};
