import React, { useEffect, useRef,  useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { useFitness } from '@/context/FitnessContext';

const COMPLETED_KEY = '@fitness_completed_workouts';
const GLASS_ML = 250; // each glass = 250ml
const DEFAULT_TOTAL_GLASSES = 8;

export const DashboardScreen = () => {
  const {
    dailyStats,
    goals,
    weeklyData,
    activeTab,
    setActiveTab,
    getWeeklyProgress,
    getTodaysWorkouts,
    getCurrentStats,
    updateDailyStats,
    updateGoal,
  } = useFitness();

  // Derived data
  const weeklyProgress = getWeeklyProgress();
  const todaysWorkouts = getTodaysWorkouts();
  const currentStats = getCurrentStats();

  // Completed workout IDs (persisted)
  const [completedWorkouts, setCompletedWorkouts] = useState<string[]>([]);
  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(COMPLETED_KEY);
        if (raw) setCompletedWorkouts(JSON.parse(raw));
      } catch (e) {
        console.warn('Failed to load completed workouts', e);
      }
    };
    load();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(COMPLETED_KEY, JSON.stringify(completedWorkouts)).catch((e) =>
      console.warn('save completed failed', e)
    );
  }, [completedWorkouts]);

  // Water calculations
  const waterGoal = goals.find((g) => g.type === 'water');
  const waterTargetMl = waterGoal ? waterGoal.target : 2000;
  const totalGlasses = Math.max(DEFAULT_TOTAL_GLASSES, Math.ceil(waterTargetMl / GLASS_ML));
  const currentWaterMl = dailyStats?.waterIntake || 0;
  const currentGlasses = Math.floor(currentWaterMl / GLASS_ML);

  // helper to update goals by type
  const findGoalByType = (type: string) => goals.find((g) => g.type === type);

  // Toggle workout complete/incomplete
  const toggleWorkoutComplete = (workout: any) => {
    const id = workout.id;
    const isComplete = completedWorkouts.includes(id);

    Alert.alert(
      isComplete ? 'Mark workout as incomplete?' : 'Mark workout complete?',
      isComplete
        ? 'Remove completion and subtract calories/workout from goals?'
        : 'Mark this workout as done and add calories/workout to goals?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            if (isComplete) {
              // undo complete
              setCompletedWorkouts((prev) => prev.filter((i) => i !== id));

              // subtract calories and decrement workout count
              updateDailyStats({
                calories: Math.max(0, (dailyStats.calories || 0) - (workout.caloriesBurned || 0)),
                workouts: Math.max(0, (dailyStats.workouts || 0) - 1),
              });

              // update goals (workouts & calories)
              const wGoal = findGoalByType('workouts');
              if (wGoal) updateGoal(wGoal.id, Math.max(0, wGoal.current - 1));

              const cGoal = findGoalByType('calories');
              if (cGoal) updateGoal(cGoal.id, Math.max(0, cGoal.current - (workout.caloriesBurned || 0)));
            } else {
              // mark complete
              setCompletedWorkouts((prev) => [...prev, id]);

              updateDailyStats({
                calories: (dailyStats.calories || 0) + (workout.caloriesBurned || 0),
                workouts: (dailyStats.workouts || 0) + 1,
              });

              const wGoal = findGoalByType('workouts');
              if (wGoal) updateGoal(wGoal.id, wGoal.current + 1);

              const cGoal = findGoalByType('calories');
              if (cGoal) updateGoal(cGoal.id, cGoal.current + (workout.caloriesBurned || 0));
            }
          },
        },
      ]
    );
  };

  // Water controls (use updateDailyStats so context persists it)
  const addGlass = () => {
    updateDailyStats({ waterIntake: (dailyStats.waterIntake || 0) + GLASS_ML });

    // update water goal current value too (if exists)
    const wGoal = findGoalByType('water');
    if (wGoal) {
      updateGoal(wGoal.id, Math.min(wGoal.target, wGoal.current + GLASS_ML));
    }
  };

  const removeGlass = () => {
    const newMl = Math.max(0, (dailyStats.waterIntake || 0) - GLASS_ML);
    updateDailyStats({ waterIntake: newMl });

    const wGoal = findGoalByType('water');
    if (wGoal) {
      updateGoal(wGoal.id, Math.max(0, wGoal.current - GLASS_ML));
    }
  };

  // Goals used in rings
  const stepsGoal = goals.find((goal) => goal.type === 'steps');
  const caloriesGoal = goals.find((goal) => goal.type === 'calories');
  const workoutsGoal = goals.find((goal) => goal.type === 'workouts');

  // Metrics (adapts based on active tab)
  const metrics = [
    {
      id: 'steps',
      value: activeTab === 'today' ? (dailyStats.steps || 0) : (weeklyProgress.steps || 0),
      target: activeTab === 'today' ? (stepsGoal?.target || 10000) : (stepsGoal?.target || 10000) * 7,
      label: 'Steps',
      color: '#10B981',
    },
    {
      id: 'calories',
      value: activeTab === 'today' ? (dailyStats.calories || 0) : (weeklyProgress.calories || 0),
      target: activeTab === 'today' ? (caloriesGoal?.target || 500) : (caloriesGoal?.target || 500) * 7,
      label: 'Calories',
      color: '#EF4444',
    },
    {
      id: 'workouts',
      value: activeTab === 'today' ? (dailyStats.workouts || 0) : (weeklyProgress.workouts || 0),
      target: activeTab === 'today' ? (workoutsGoal?.target || 5) : (workoutsGoal?.target || 5),
      label: 'Workouts',
      color: '#3B82F6',
    },
    {
      id: 'water',
      value: dailyStats.waterIntake || 0,
      target: waterTargetMl,
      label: 'Water',
      color: '#06B6D4',
    },
  ];

  // Stats cards
  const stats = [
    {
      id: 'sleep',
      icon: '😴',
      label: 'Sleep',
      value: dailyStats.sleep || 0,
      unit: 'hrs',
      color: '#8B5CF6',
    },
    {
      id: 'workouts',
      icon: '💪',
      label: activeTab === 'today' ? "Today's Workouts" : 'Weekly Workouts',
      value: activeTab === 'today' ? (dailyStats.workouts || 0) : (weeklyProgress.workouts || 0),
      unit: '',
      color: '#F59E0B',
    },
    {
      id: 'steps',
      icon: '👣',
      label: activeTab === 'today' ? "Today's Steps" : 'Weekly Steps',
      value:
        activeTab === 'today'
          ? ((dailyStats.steps || 0) / 1000).toFixed(1)
          : ((weeklyProgress.steps || 0) / 1000).toFixed(1),
      unit: 'k',
      color: '#10B981',
    },
  ];

  // Activities mapping
  const activities = activeTab === 'today' ? todaysWorkouts.map((w) => formatWorkoutActivity(w)) : getWeeklyActivities();

  function formatWorkoutActivity(workout: any) {
    const workoutIcons: Record<string, string> = {
      cardio: '🏃',
      strength: '💪',
      flexibility: '🧘',
      sports: '⚽',
    };

    const workoutColors: Record<string, string> = {
      cardio: '#EF4444',
      strength: '#3B82F6',
      flexibility: '#10B981',
      sports: '#F59E0B',
    };

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const time = `${hours}:${minutes}`;

    return {
      id: workout.id,
      raw: workout,
      icon: workoutIcons[workout.type] || '🏃',
      label: workout.name,
      details: `${workout.duration} min • ${workout.caloriesBurned || 0} cal`,
      time,
      color: workoutColors[workout.type] || '#EF4444',
    };
  }

  function getWeeklyActivities() {
    const weeklySummary = (weeklyData || []).map((day, index) => {
      const date = new Date(day.date);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

      return {
        id: `week-${index}`,
        icon: day.workouts > 0 ? '💪' : '😴',
        label: `${dayName} - ${day.workouts} workout${day.workouts !== 1 ? 's' : ''}`,
        details: `${day.steps.toLocaleString()} steps • ${day.calories} cal`,
        time: '',
        color: day.workouts > 0 ? '#3B82F6' : '#6B7280',
      };
    });

    return weeklySummary.reverse();
  }

  // Header date
  const getCurrentDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    };
    return now.toLocaleDateString('en-US', options);
  };

  // Animate numeric step value change
  const animatedSteps = useRef(new Animated.Value(dailyStats.steps || 0)).current;
  useEffect(() => {
    Animated.timing(animatedSteps, {
      toValue: dailyStats.steps || 0,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [dailyStats.steps]);

  const animatedStepsText = animatedSteps.interpolate({
    inputRange: [0, Math.max(1, stepsGoal?.target || 10000)],
    outputRange: [0, Math.max(1, stepsGoal?.target || 10000)],
    extrapolate: 'clamp',
  });

  // Small progress animation for ring (optional)
  const ringAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(ringAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [dailyStats, goals, activeTab]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.date}>{getCurrentDate()}</Text>
        <Text style={styles.greeting}>Good Morning, David</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'today' && styles.activeTab]}
          onPress={() => setActiveTab('today')}
        >
          <Text style={[styles.tabText, activeTab === 'today' && styles.activeTabText]}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'week' && styles.activeTab]}
          onPress={() => setActiveTab('week')}
        >
          <Text style={[styles.tabText, activeTab === 'week' && styles.activeTabText]}>This Week</Text>
        </TouchableOpacity>
      </View>

      {/* Metrics (Ring Progress) */}
      <View style={styles.metricsRow}>
        {metrics.map((item) => {
          const radius = 30;
          const strokeWidth = 6;
          const circumference = 2 * Math.PI * radius;
          const progress = Math.min((item.value || 0) / (item.target || 1), 1);
          const strokeDashoffset = circumference - progress * circumference;

          return (
            <View key={item.id} style={styles.metricItem}>
              <Svg width={70} height={70}>
                <Circle cx="35" cy="35" r={radius} stroke="#E5E7EB" strokeWidth={strokeWidth} fill="none" />
                <Circle
                  cx="35"
                  cy="35"
                  r={radius}
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                  rotation="-90"
                  origin="35,35"
                />
              </Svg>

              {/* special-case animated steps display */}
              {item.id === 'steps' ? (
                <Animated.Text style={styles.metricValue}>
                  { /* show "k" format when >1000 */}
                  { (dailyStats.steps || 0) > 1000
                    ? `${((dailyStats.steps || 0) / 1000).toFixed(1)}k`
                    : (dailyStats.steps || 0).toLocaleString() }
                </Animated.Text>
              ) : (
                <Text style={styles.metricValue}>
                  {item.id === 'water' ? `${item.value || 0}ml` : item.value || 0}
                </Text>
              )}

              <Text style={styles.metricLabel}>{item.label}</Text>
            </View>
          );
        })}
      </View>

      {/* Stat cards */}
      <View style={styles.statsRow}>
        {stats.map((stat) => (
          <View key={stat.id} style={styles.statCard}>
            <Text style={[styles.statIcon, { color: stat.color }]}>{stat.icon}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statValue}>
              {stat.value} <Text style={styles.statUnit}>{stat.unit}</Text>
            </Text>
          </View>
        ))}
      </View>

      {/* Water Tracking */}
      <Text style={styles.sectionTitle}>Water Intake</Text>
      <View style={styles.waterContainer}>
        <View style={styles.waterRow}>
          {Array.from({ length: totalGlasses }).map((_, i) => {
            const filled = i < currentGlasses;
            return <View key={i} style={[styles.glass, filled ? styles.glassFilled : styles.glassEmpty]} />;
          })}
        </View>

        <View style={styles.waterControls}>
          <TouchableOpacity onPress={removeGlass} style={styles.waterButton}>
            <Ionicons name="remove" size={20} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.waterProgress}>
            {currentGlasses} / {totalGlasses} glasses
          </Text>

          <TouchableOpacity onPress={addGlass} style={styles.waterButton}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <Text style={styles.sectionTitle}>{activeTab === 'today' ? 'Recent Activity' : 'Weekly Summary'}</Text>

      {activities.length > 0 ? (
        activities.map((activity) => {
          const isComplete = completedWorkouts.includes(activity.id);
          return (
            <TouchableOpacity
              key={activity.id}
              onPress={() => toggleWorkoutComplete(activity.raw)}
              style={[
                styles.activityCard,
                isComplete && { borderColor: '#10B981', borderWidth: 2, opacity: 0.95 },
              ]}
            >
              <View style={[styles.activityIconContainer, { backgroundColor: activity.color + '20' }]}>
                <Text style={[styles.activityIcon, { color: activity.color }]}>{activity.icon}</Text>
              </View>

              <View style={styles.activityInfo}>
                <Text style={[styles.activityLabel, isComplete && { textDecorationLine: 'line-through', color: '#10B981' }]}>
                  {activity.label}
                </Text>
                <Text style={styles.activityDetails}>{activity.details}</Text>
              </View>

              {activity.time ? <Text style={styles.activityTime}>{activity.time}</Text> : null}

              {isComplete && <Text style={styles.doneBadge}>✅ Done</Text>}
            </TouchableOpacity>
          );
        })
      ) : (
        <View style={styles.emptyActivity}>
          <Text style={styles.emptyActivityText}>{activeTab === 'today' ? 'No workouts today' : 'No workouts this week'}</Text>
          <Text style={styles.emptyActivitySubtext}>
            {activeTab === 'today' ? 'Add a workout to see your activities here' : 'Add workouts to see your weekly summary'}
          </Text>
        </View>
      )}

      {/* Goals Progress */}
      <Text style={styles.sectionTitle}>Goals Progress</Text>
      {goals.map((goal) => {
        const progress = Math.min(goal.current / goal.target, 1);
        const progressPercent = Math.round(progress * 100);

        return (
          <View key={goal.id} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <Text style={styles.goalProgress}>
                {goal.current}/{goal.target} {goal.unit}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progressPercent}%`,
                    backgroundColor: progress === 1 ? '#10B981' : '#3B82F6',
                  },
                ]}
              />
            </View>
            <Text style={styles.goalPercent}>{progressPercent}%</Text>
            {goal.completed && <Text style={styles.goalCompleted}>🎉 Goal Achieved!</Text>}
          </View>
        );
      })}
    </ScrollView>
  );
}

// Styles (keeps your original styles)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  date: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  greeting: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginVertical: SPACING.md,
    alignSelf: 'center',
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    fontWeight: 'bold',
    color: COLORS.text,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SPACING.lg,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: SIZES.md,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  metricLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.md,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
  },
  statValue: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statUnit: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    fontSize: SIZES.md,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  activityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  activityIcon: {
    fontSize: 22,
  },
  activityInfo: {
    flex: 1,
  },
  activityLabel: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  activityDetails: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
  },
  activityTime: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
  },
  emptyActivity: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  emptyActivityText: {
    fontSize: SIZES.md,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  emptyActivitySubtext: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  goalCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  goalTitle: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  goalProgress: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: SPACING.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalPercent: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
  goalCompleted: {
    fontSize: SIZES.sm,
    color: '#10B981',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: SPACING.xs,
  },

  /* water & completion styles */
  waterContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  waterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  glass: {
    width: 24,
    height: 40,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#06B6D4',
  },
  glassFilled: {
    backgroundColor: '#06B6D4',
  },
  glassEmpty: {
    backgroundColor: '#E5E7EB',
  },
  waterControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterButton: {
    backgroundColor: '#06B6D4',
    borderRadius: 20,
    padding: 8,
    marginHorizontal: SPACING.md,
  },
  waterProgress: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  doneBadge: {
    backgroundColor: '#10B98120',
    color: '#10B981',
    fontSize: SIZES.sm,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
});
