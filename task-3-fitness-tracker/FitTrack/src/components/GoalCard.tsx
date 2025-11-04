import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { Goal } from '../types';

interface GoalCardProps {
  goal: Goal;
}

const GOAL_ICONS = {
  steps: '👣',
  calories: '🔥',
  workouts: '💪',
  water: '💧',
  sleep: '😴',
};

const GOAL_LABELS = {
  steps: 'Steps',
  calories: 'Calories',
  workouts: 'Workouts',
  water: 'Water',
  sleep: 'Sleep',
};

const GOAL_UNITS = {
  steps: 'steps',
  calories: 'cal',
  workouts: 'workouts',
  water: 'glasses',
  sleep: 'hours',
};

export const GoalCard = ({ goal }: GoalCardProps) => {
  const percentage = Math.min((goal.current / goal.target) * 100, 100);
  const isCompleted = goal.current >= goal.target;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>{GOAL_ICONS[goal.type]}</Text>
        <View style={styles.info}>
          <Text style={styles.label}>{GOAL_LABELS[goal.type]}</Text>
          <Text style={styles.progress}>
            {goal.current} / {goal.target} {GOAL_UNITS[goal.type]}
          </Text>
        </View>
        {isCompleted && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  icon: {
    fontSize: 32,
    marginRight: SPACING.sm,
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  progress: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  checkmark: {
    fontSize: 24,
    color: COLORS.success,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
});
