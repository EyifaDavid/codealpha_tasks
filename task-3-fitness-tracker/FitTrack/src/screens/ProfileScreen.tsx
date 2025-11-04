import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { useFitness } from '../context/FitnessContext';

export const ProfileScreen = () => {
  const { dailyStats, goals } = useFitness();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const completedGoals = goals.filter(g => g.current >= g.target).length;
  const goalPercentage = Math.round((completedGoals / goals.length) * 100);

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>💪</Text>
        </View>
        <Text style={styles.name}>Fitness Enthusiast</Text>
        <Text style={styles.email}>user@fittrack.com</Text>
      </LinearGradient>

      {/* Stats Overview */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{dailyStats.steps.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Steps</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{dailyStats.calories}</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{dailyStats.workouts}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{goalPercentage}%</Text>
            <Text style={styles.statLabel}>Goals Met</Text>
          </View>
        </View>
      </View>

      {/* Daily Goals Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Progress</Text>
        <View style={styles.goalProgress}>
          <View style={styles.progressItem}>
            <Text style={styles.progressEmoji}>💧</Text>
            <View style={styles.progressInfo}>
              <Text style={styles.progressLabel}>Water Intake</Text>
              <Text style={styles.progressValue}>
                {dailyStats.waterIntake} / 8 glasses
              </Text>
            </View>
          </View>
          <View style={styles.progressItem}>
            <Text style={styles.progressEmoji}>😴</Text>
            <View style={styles.progressInfo}>
              <Text style={styles.progressLabel}>Sleep</Text>
              <Text style={styles.progressValue}>
                {dailyStats.sleep} / 8 hours
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>🔔</Text>
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
          />
        </View>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>🎯</Text>
            <Text style={styles.settingText}>Edit Goals</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>📊</Text>
            <Text style={styles.settingText}>Units & Measurements</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>🔒</Text>
            <Text style={styles.settingText}>Privacy</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>ℹ️</Text>
            <Text style={styles.settingText}>About</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementsGrid}>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementIcon}>🏆</Text>
            <Text style={styles.achievementLabel}>First Workout</Text>
          </View>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementIcon}>🔥</Text>
            <Text style={styles.achievementLabel}>7 Day Streak</Text>
          </View>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementIcon}>⭐</Text>
            <Text style={styles.achievementLabel}>Goal Master</Text>
          </View>
          <View style={[styles.achievementCard, styles.achievementLocked]}>
            <Text style={styles.achievementIcon}>🎯</Text>
            <Text style={styles.achievementLabel}>10K Steps</Text>
          </View>
        </View>
      </View>

      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.xl,
    alignItems: 'center',
    paddingTop: SPACING.xxl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: 40,
  },
  name: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: SPACING.xs,
  },
  email: {
    fontSize: SIZES.sm,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  statsSection: {
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  statBox: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
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
  section: {
    padding: SPACING.md,
  },
  goalProgress: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SPACING.md,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  progressEmoji: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  progressInfo: {
    flex: 1,
  },
  progressLabel: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  progressValue: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.xs,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  settingText: {
    fontSize: SIZES.md,
    color: COLORS.text,
  },
  settingArrow: {
    fontSize: 24,
    color: COLORS.textLight,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  achievementCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.success,
  },
  achievementLocked: {
    borderColor: COLORS.border,
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  achievementLabel: {
    fontSize: SIZES.sm,
    color: COLORS.text,
    textAlign: 'center',
  },
  logoutSection: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  logoutButton: {
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  logoutText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.danger,
    textAlign: 'center',
  },
});