import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { COLORS, SIZES, SPACING, WORKOUT_TYPES } from '../constants/theme';
import { useFitness } from '../context/FitnessContext';

interface AddWorkoutScreenProps {
  navigation: any;
}

export const AddWorkoutScreen = ({ navigation }: AddWorkoutScreenProps) => {
  const { addWorkout } = useFitness();
  const [selectedType, setSelectedType] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [notes, setNotes] = useState('');

  const handleTypeSelect = (type: string, caloriesPerMin: number) => {
    setSelectedType(type);
    if (duration) {
      setCalories((parseInt(duration) * caloriesPerMin).toString());
    }
  };

  const handleDurationChange = (value: string) => {
    setDuration(value);
    if (value && selectedType) {
      const workoutType = WORKOUT_TYPES.find(w => w.name === selectedType);
      if (workoutType) {
        setCalories((parseInt(value) * workoutType.caloriesPerMin).toString());
      }
    }
  };

  const handleSave = () => {
    if (!selectedType) {
      Alert.alert('Error', 'Please select a workout type');
      return;
    }
    if (!duration || parseInt(duration) <= 0) {
      Alert.alert('Error', 'Please enter a valid duration');
      return;
    }
    if (!calories || parseInt(calories) <= 0) {
      Alert.alert('Error', 'Please enter valid calories');
      return;
    }

    addWorkout({
      type: selectedType,
      duration: parseInt(duration),
      caloriesBurned: parseInt(calories),
      date: new Date().toISOString().split('T')[0],
      notes,
    });

    Alert.alert('Success', 'Workout logged successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Workout</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Workout Type Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Workout Type</Text>
          <View style={styles.typeGrid}>
            {WORKOUT_TYPES.map(type => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeCard,
                  selectedType === type.name && styles.typeCardSelected,
                ]}
                onPress={() => handleTypeSelect(type.name, type.caloriesPerMin)}
              >
                <Text style={styles.typeIcon}>{type.icon}</Text>
                <Text style={styles.typeName}>{type.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Duration Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Duration (minutes)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter duration"
            keyboardType="numeric"
            value={duration}
            onChangeText={handleDurationChange}
          />
        </View>

        {/* Calories Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Calories Burned</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter calories"
            keyboardType="numeric"
            value={calories}
            onChangeText={setCalories}
          />
        </View>

        {/* Notes Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add any notes about your workout"
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* Summary Card */}
        {selectedType && duration && calories && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Workout Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Type:</Text>
              <Text style={styles.summaryValue}>{selectedType}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Duration:</Text>
              <Text style={styles.summaryValue}>{duration} minutes</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Calories:</Text>
              <Text style={styles.summaryValue}>{calories} cal</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  cancelButton: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  title: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  saveButton: {
    fontSize: SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: SPACING.md,
  },
  label: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  typeCard: {
    width: '23%',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SPACING.sm,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  typeCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  typeIcon: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  typeName: {
    fontSize: SIZES.xs,
    color: COLORS.text,
    textAlign: 'center',
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: SIZES.md,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  summaryCard: {
    backgroundColor: COLORS.primary + '10',
    borderRadius: 12,
    padding: SPACING.md,
    margin: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  summaryTitle: {
    fontSize: SIZES.md,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  summaryLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
});