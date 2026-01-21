import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '@/src/theme';

export const SplashScreen = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      ...TYPOGRAPHY.h1,
      color: COLORS.white,
      marginBottom: SPACING.lg,
    },
    loader: {
      marginTop: SPACING.lg,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SideQuest</Text>
      <ActivityIndicator color={COLORS.white} size="large" style={styles.loader} />
    </View>
  );
};
