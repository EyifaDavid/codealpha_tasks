import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { useFitness } from '../context/FitnessContext';
import { Workout } from '../types';

interface ActivitiesScreenProps {
  navigation: any;
}

export const ActivitiesScreen = ({ navigation }: ActivitiesScreenProps) => {
  const { workouts, deleteWorkout } = useFitness();

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteWorkout(id)
        },
      ]
    );
  };

  const groupedWorkouts = workouts.reduce((acc, workout) => {
    if (!acc[workout.date]) {
      acc[workout.date] = [];
    }
    acc[workout.date].push(workout);
    return acc;
  }, {} as Record<string, Workout[]>);

  const sortedDates = Object.keys(groupedWorkouts).sort((a, b) => b.localeCompare(a));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>All Activities</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddWorkout')}
        >
          <Text style={styles.addButtonText}>+ Add Workout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {sortedDates.map(date => {
          const dateObj = new Date(date);
          const isToday = date === new Date().toISOString().split('T')[0];
          const dayWorkouts = groupedWorkouts[date];
          const totalCalories = dayWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
          const totalDuration = dayWorkouts.reduce((sum, w) => sum + w.duration, 0);

          return (
            <View key={date} style={styles.dateSection}>
              <View style={styles.dateHeader}>
                <Text style={styles.dateTitle}>
                  {isToday ? 'Today' : dateObj.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </Text>
                <Text style={styles.dateSummary}>
                  {dayWorkouts.length} workout{dayWorkouts.length > 1 ? 's' : ''} • {totalCalories} cal • {totalDuration} min
                </Text>
              </View>

              {dayWorkouts.map(workout => (
                <View key={workout.id} style={styles.workoutCard}>
                  <View style={styles.workoutHeader}>
                    <View style={styles.workoutTitleRow}>
                      <Text style={styles.workoutIcon}>
                        {workout.type === 'Running' ? '🏃' :
                         workout.type === 'Cycling' ? '🚴' :
                         workout.type === 'Swimming' ? '🏊' :
                         workout.type === 'Gym' ? '🏋️' :
                         workout.type === 'Yoga' ? '🧘' :
                         workout.type === 'Walking' ? '🚶' : '💪'}
                      </Text>
                      <View style={styles.workoutInfo}>
                        <Text style={styles.workoutType}>{workout.type}</Text>
                        {workout.notes && (
                          <Text style={styles.workoutNotes}>{workout.notes}</Text>
                        )}
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDelete(workout.id)}
                      style={styles.deleteButton}
                    >
                      <Text style={styles.deleteIcon}>🗑️</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.workoutStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{workout.duration}</Text>
                      <Text style={styles.statLabel}>minutes</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{workout.caloriesBurned}</Text>
                      <Text style={styles.statLabel}>calories</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          );
        })}

        {workouts.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyTitle}>No workouts yet</Text>
            <Text style={styles.emptyText}>Start tracking your fitness journey</Text>
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
  title: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: SIZES.sm,
  },
  content: {
    flex: 1,
  },
  dateSection: {
    marginBottom: SPACING.lg,
  },
  dateHeader: {
    padding: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  dateTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  dateSummary: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  workoutCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: 12,
    padding: SPACING.md,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  workoutTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  workoutIcon: {
    fontSize: 32,
    marginRight: SPACING.sm,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutType: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  workoutNotes: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  deleteButton: {
    padding: SPACING.xs,
  },
  deleteIcon: {
    fontSize: 20,
  },
  workoutStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
  statValue: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    marginTop: SPACING.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  emptyText: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
});
