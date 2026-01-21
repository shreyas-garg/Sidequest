import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../theme';

interface SideQuestCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  dateTime: string;
  location: string;
  participants: number;
  maxParticipants: number;
  creatorName: string;
  creatorImage?: string;
  image?: string;
  onPress: () => void;
  onJoin?: () => void;
  isJoined?: boolean;
}

export const SideQuestCard: React.FC<SideQuestCardProps> = ({
  id,
  title,
  description,
  category,
  dateTime,
  location,
  participants,
  maxParticipants,
  creatorName,
  creatorImage,
  image,
  onPress,
  onJoin,
  isJoined = false,
}) => {
  const getCategoryIcon = (cat: string) => {
    const icons: Record<string, string> = {
      concert: 'music',
      travel: 'plane',
      café: 'coffee',
      idea: 'lightbulb',
      sports: 'basketball',
      gaming: 'controller',
      food: 'pizza',
      learning: 'book',
    };
    return icons[cat] || 'circle';
  };

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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: COLORS.white,
      borderRadius: BORDER_RADIUS.lg,
      marginBottom: SPACING.md,
      overflow: 'hidden',
      ...SHADOWS.md,
    },
    imageContainer: {
      height: 180,
      backgroundColor: getCategoryColor(category),
      overflow: 'hidden',
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    placeholder: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoryBadge: {
      position: 'absolute',
      top: SPACING.md,
      right: SPACING.md,
      backgroundColor: COLORS.white,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.md,
      borderRadius: BORDER_RADIUS.full,
      ...SHADOWS.sm,
    },
    categoryText: {
      ...TYPOGRAPHY.caption,
      color: getCategoryColor(category),
      marginLeft: SPACING.xs,
      fontWeight: '600',
      textTransform: 'capitalize',
    },
    content: {
      padding: SPACING.md,
    },
    title: {
      ...TYPOGRAPHY.h3,
      color: COLORS.gray900,
      marginBottom: SPACING.xs,
    },
    description: {
      ...TYPOGRAPHY.body2,
      color: COLORS.gray600,
      marginBottom: SPACING.md,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACING.sm,
    },
    metaText: {
      ...TYPOGRAPHY.body2,
      color: COLORS.gray700,
      marginLeft: SPACING.sm,
      flex: 1,
    },
    creator: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: SPACING.md,
      borderTopWidth: 1,
      borderTopColor: COLORS.gray100,
      marginTop: SPACING.md,
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: BORDER_RADIUS.full,
      backgroundColor: COLORS.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      color: COLORS.white,
      ...TYPOGRAPHY.caption,
      fontWeight: '700',
    },
    creatorName: {
      ...TYPOGRAPHY.body2,
      color: COLORS.gray700,
      marginLeft: SPACING.sm,
      flex: 1,
    },
    participants: {
      backgroundColor: COLORS.accent,
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.xs,
      borderRadius: BORDER_RADIUS.full,
    },
    participantText: {
      ...TYPOGRAPHY.caption,
      color: COLORS.white,
      fontWeight: '600',
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: SPACING.md,
      borderTopWidth: 1,
      borderTopColor: COLORS.gray100,
      gap: SPACING.sm,
    },
    joinButton: {
      flex: 1,
    },
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={[styles.placeholder, { backgroundColor: getCategoryColor(category) }]}>
            <MaterialCommunityIcons name={getCategoryIcon(category) as any} size={60} color={COLORS.white} />
          </View>
        )}
        <View style={styles.categoryBadge}>
          <MaterialCommunityIcons name={getCategoryIcon(category) as any} size={14} color={getCategoryColor(category)} />
          <Text style={styles.categoryText}>{category}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>{description}</Text>

        <View style={styles.metaRow}>
          <Ionicons name="calendar" size={16} color={COLORS.gray400} />
          <Text style={styles.metaText}>{formatDate(dateTime)}</Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="location" size={16} color={COLORS.gray400} />
          <Text style={styles.metaText} numberOfLines={1}>{location}</Text>
        </View>

        <View style={styles.creator}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {creatorName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.creatorName}>{creatorName}</Text>
          <View style={styles.participants}>
            <Text style={styles.participantText}>
              {participants}/{maxParticipants}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
