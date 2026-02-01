import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sideQuestService } from '@/src/services/api';
import { Input } from '@/src/components/Input';
import { Button } from '@/src/components/Button';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@/src/theme';

const CATEGORIES = ['concert', 'travel', 'café', 'idea', 'sports', 'gaming', 'food', 'learning'];

export const CreateSideQuestScreen = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('concert');
  const [location, setLocation] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('5');
  const [dateTime, setDateTime] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: async (data: any) => sideQuestService.createSideQuest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sidequests'] });
      Alert.alert('Success', 'SideQuest created successfully!');
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create sidequest');
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    if (!dateTime.trim()) newErrors.dateTime = 'Date & Time is required';
    if (!maxParticipants || parseInt(maxParticipants) < 1) {
      newErrors.maxParticipants = 'Must allow at least 1 participant';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    // Try to parse the date, if it fails, use current date + 1 day
    let parsedDate;
    try {
      parsedDate = new Date(dateTime);
      if (isNaN(parsedDate.getTime())) {
        // Invalid date, use tomorrow
        parsedDate = new Date();
        parsedDate.setDate(parsedDate.getDate() + 1);
      }
    } catch {
      parsedDate = new Date();
      parsedDate.setDate(parsedDate.getDate() + 1);
    }

    mutation.mutate({
      title,
      description,
      category,
      location,
      maxParticipants: parseInt(maxParticipants),
      dateTime: parsedDate.toISOString(),
    });
  };



  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    scrollContent: {
      padding: SPACING.lg,
    },
    header: {
      marginBottom: SPACING.lg,
      paddingBottom: SPACING.lg,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.gray100,
    },
    title: {
      ...TYPOGRAPHY.h2,
      color: COLORS.gray900,
    },
    section: {
      marginBottom: SPACING.xl,
    },
    sectionLabel: {
      ...TYPOGRAPHY.body2,
      color: COLORS.gray700,
      fontWeight: '600',
      marginBottom: SPACING.md,
    },
    categoryScroll: {
      flexDirection: 'row',
      marginBottom: SPACING.md,
    },
    categoryChip: {
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      borderRadius: BORDER_RADIUS.full,
      marginRight: SPACING.sm,
      backgroundColor: COLORS.gray100,
    },
    categoryChipActive: {
      backgroundColor: COLORS.primary,
    },
    categoryText: {
      ...TYPOGRAPHY.body2,
      color: COLORS.gray700,
    },
    categoryTextActive: {
      color: COLORS.white,
      fontWeight: '600',
    },
    dateButton: {
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.md,
      borderRadius: BORDER_RADIUS.lg,
      borderWidth: 2,
      borderColor: COLORS.gray200,
      backgroundColor: COLORS.gray50,
      marginBottom: SPACING.md,
    },
    dateButtonText: {
      ...TYPOGRAPHY.body1,
      color: COLORS.gray700,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: SPACING.md,
      marginTop: SPACING.xl,
    },
    button: {
      flex: 1,
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create SideQuest</Text>
        </View>

        <Input
          label="Title"
          placeholder="Concert Night"
          value={title}
          onChangeText={setTitle}
          error={errors.title}
        />

        <Input
          label="Description"
          placeholder="Describe your sidequest..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          error={errors.description}
        />

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Category</Text>
          <View style={styles.categoryScroll}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  category === cat && styles.categoryChipActive,
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === cat && styles.categoryTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Input
          label="Date & Time"
          placeholder="2026-01-31 18:00 or Jan 31 2026 6:00 PM"
          value={dateTime}
          onChangeText={setDateTime}
          icon="time"
          error={errors.dateTime}
        />

        <Input
          label="Location"
          placeholder="Downtown, City Name"
          value={location}
          onChangeText={setLocation}
          icon="location"
          error={errors.location}
        />

        <Input
          label="Max Participants"
          placeholder="5"
          value={maxParticipants}
          onChangeText={setMaxParticipants}
          keyboardType="numeric"
          error={errors.maxParticipants}
        />

        <View style={styles.buttonContainer}>
          <Button
            label="Cancel"
            onPress={() => router.back()}
            variant="outline"
            style={styles.button}
          />
          <Button
            label="Create"
            onPress={handleCreate}
            isLoading={mutation.isPending}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
