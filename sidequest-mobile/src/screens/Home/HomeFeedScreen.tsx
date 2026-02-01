import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { sideQuestService } from '@/src/services/api';
import { SideQuestCard } from '@/src/components/SideQuestCard';
import { useAuth } from '@/src/contexts/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY } from '@/src/theme';

export const HomeFeedScreen = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [filters, setFilters] = useState<any>({});

  const { data: sideQuests = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['sidequests', filters],
    queryFn: async () => {
      const response = await sideQuestService.getSideQuests(filters);
      return response.data;
    },
  });

  const handleSideQuestPress = (id: string) => {
    router.push(`/(app)/details?id=${id}`);
  };

  const handleProfilePress = () => {
    Alert.alert(
      'Profile',
      `Logged in as ${user?.name || 'User'}`,
      [
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.gray50,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      backgroundColor: COLORS.white,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.gray100,
    },
    title: {
      ...TYPOGRAPHY.h2,
      color: COLORS.gray900,
    },
    headerActions: {
      flexDirection: 'row',
      gap: SPACING.md,
    },
    listContent: {
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: SPACING.lg,
    },
    emptyText: {
      ...TYPOGRAPHY.body1,
      color: COLORS.gray600,
      textAlign: 'center',
      marginTop: SPACING.md,
    },
    fab: {
      position: 'absolute',
      bottom: SPACING.lg,
      right: SPACING.lg,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: COLORS.primary,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    loader: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loader]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const renderItem = ({ item }: any) => (
    <SideQuestCard
      id={item._id}
      title={item.title}
      description={item.description}
      category={item.category}
      dateTime={item.dateTime}
      location={item.location}
      participants={item.participants.length}
      maxParticipants={item.maxParticipants}
      creatorName={item.creatorId.name}
      onPress={() => handleSideQuestPress(item._id)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="filter" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleProfilePress}>
            <Ionicons name="person-circle" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={sideQuests}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="compass-outline" size={64} color={COLORS.gray300} />
            <Text style={styles.emptyText}>No sidequests found</Text>
            <Text style={styles.emptyText}>Create one or check back later!</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(app)/create')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={COLORS.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};
