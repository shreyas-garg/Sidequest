import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { sideQuestService, joinRequestService } from '@/src/services/api';
import { useAuth } from '@/src/contexts/AuthContext';
import { Button } from '@/src/components/Button';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '@/src/theme';

export const SideQuestDetailsScreen = ({ route }: any) => {
  const router = useRouter();
  const { id } = route?.params || {};
  const { user } = useAuth();

  const { data: sideQuest, isLoading } = useQuery({
    queryKey: ['sidequest', id],
    queryFn: async () => {
      const response = await sideQuestService.getSideQuestById(id);
      return response.data;
    },
  });

  const joinMutation = useMutation({
    mutationFn: () => joinRequestService.requestToJoin(id),
    onSuccess: () => {
      Alert.alert('Success', 'Request to join sent!');
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message || 'Failed to send request');
    },
  });

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      concert: '#FF6B6B',
      travel: '#4ECDC4',
      café: '#8B4513',
      idea: '#FFE66D',
      sports: '#FF9F1C',
      gaming: '#9D4EDD',
      food: '#FF006E',
      learning: '#3A86FF',
    };
    return colors[cat] || COLORS.primary;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isCreator = sideQuest?.creatorId._id === user?.id;
  const isParticipant = sideQuest?.participants?.some((p: any) => p._id === user?.id);
  const isFull = sideQuest?.participants?.length >= sideQuest?.maxParticipants;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.gray100,
    },
    backButton: {
      padding: SPACING.sm,
    },
    headerTitle: {
      ...TYPOGRAPHY.body1,
      fontWeight: '600',
      color: COLORS.gray900,
    },
    heroSection: {
      height: 200,
      backgroundColor: getCategoryColor(sideQuest?.category),
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroText: {
      ...TYPOGRAPHY.h3,
      color: COLORS.white,
      textAlign: 'center',
    },
    content: {
      padding: SPACING.lg,
    },
    title: {
      ...TYPOGRAPHY.h2,
      color: COLORS.gray900,
      marginBottom: SPACING.md,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      borderRadius: 20,
      marginBottom: SPACING.md,
      backgroundColor: COLORS.gray100,
    },
    statusText: {
      ...TYPOGRAPHY.caption,
      color: COLORS.gray700,
      fontWeight: '600',
      marginLeft: SPACING.sm,
    },
    description: {
      ...TYPOGRAPHY.body1,
      color: COLORS.gray600,
      lineHeight: 24,
      marginBottom: SPACING.lg,
    },
    section: {
      marginBottom: SPACING.lg,
    },
    sectionLabel: {
      ...TYPOGRAPHY.body2,
      fontWeight: '600',
      color: COLORS.gray700,
      marginBottom: SPACING.md,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: SPACING.md,
    },
    infoIcon: {
      marginRight: SPACING.md,
      marginTop: SPACING.xs,
    },
    infoText: {
      flex: 1,
      ...TYPOGRAPHY.body1,
      color: COLORS.gray700,
    },
    creatorCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: SPACING.md,
      backgroundColor: COLORS.gray50,
      borderRadius: 12,
      marginBottom: SPACING.lg,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: COLORS.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: SPACING.md,
    },
    avatarText: {
      color: COLORS.white,
      fontWeight: '700',
      fontSize: 18,
    },
    creatorName: {
      ...TYPOGRAPHY.body1,
      color: COLORS.gray900,
      fontWeight: '600',
    },
    creatorTitle: {
      ...TYPOGRAPHY.caption,
      color: COLORS.gray600,
    },
    participantsList: {
      marginBottom: SPACING.lg,
    },
    participantItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SPACING.sm,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.gray100,
    },
    participantAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: COLORS.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: SPACING.md,
    },
    participantName: {
      ...TYPOGRAPHY.body2,
      color: COLORS.gray900,
      fontWeight: '500',
    },
    loader: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionButtons: {
      gap: SPACING.md,
      marginTop: SPACING.lg,
      paddingBottom: SPACING.lg,
    },
  });

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loader]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!sideQuest) {
    return (
      <View style={[styles.container, styles.loader]}>
        <Text style={styles.headerTitle}>SideQuest not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Text style={styles.heroText}>{sideQuest.category}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{sideQuest.title}</Text>

          <View style={styles.statusBadge}>
            <Ionicons
              name={sideQuest.status === 'open' ? 'checkmark-circle' : 'close-circle'}
              size={14}
              color={sideQuest.status === 'open' ? COLORS.success : COLORS.gray500}
            />
            <Text style={styles.statusText}>{sideQuest.status.toUpperCase()}</Text>
          </View>

          <Text style={styles.description}>{sideQuest.description}</Text>

          <View style={styles.section}>
            <View style={styles.infoRow}>
              <Ionicons
                name="calendar"
                size={20}
                color={COLORS.gray400}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>{formatDate(sideQuest.dateTime)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons
                name="location"
                size={20}
                color={COLORS.gray400}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>{sideQuest.location}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons
                name="people"
                size={20}
                color={COLORS.gray400}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>
                {sideQuest.participants.length} / {sideQuest.maxParticipants} participants
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Organized By</Text>
            <View style={styles.creatorCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {sideQuest.creatorId.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={styles.creatorName}>{sideQuest.creatorId.name}</Text>
                <Text style={styles.creatorTitle}>Creator</Text>
              </View>
            </View>
          </View>

          {sideQuest.participants.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Participants</Text>
              <View style={styles.participantsList}>
                {sideQuest.participants.map((participant: any) => (
                  <View key={participant._id} style={styles.participantItem}>
                    <View style={styles.participantAvatar}>
                      <Text style={{ color: COLORS.white, fontWeight: '700' }}>
                        {participant.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.participantName}>{participant.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.actionButtons}>
            {!isCreator && !isParticipant && !isFull && (
              <Button
                label="Request to Join"
                onPress={() => joinMutation.mutate()}
                isLoading={joinMutation.isPending}
              />
            )}
            {isParticipant && (
              <Button label="You've Joined" disabled variant="secondary" />
            )}
            {isFull && !isParticipant && (
              <Button label="This Quest is Full" disabled variant="outline" />
            )}
            {isCreator && (
              <Button
                label="Manage Requests"
                onPress={() => Alert.alert('Feature', 'Coming soon!')}
                variant="secondary"
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
