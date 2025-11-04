import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

interface DashboardScreenProps {
  navigation: any;
}

export const DashboardScreen = ({ navigation }: DashboardScreenProps) => {
  const { selectedLanguage, userProgress, lessons } = useApp();

  const todayLessons = lessons.filter(l => !l.completed).slice(0, 3);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Card */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={styles.headerCard}
      >
        <Text style={styles.greeting}>Hello, Learner! 👋</Text>
        <Text style={styles.learningLanguage}>
          Learning {selectedLanguage?.name || 'a new language'}
        </Text>
        
        <View style={styles.streakContainer}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <View>
            <Text style={styles.streakNumber}>{userProgress.dailyStreak} Days</Text>
            <Text style={styles.streakText}>Current Streak</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>📚</Text>
          <Text style={styles.statNumber}>{userProgress.completedLessons}</Text>
          <Text style={styles.statLabel}>Lessons</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>💬</Text>
          <Text style={styles.statNumber}>{userProgress.wordsLearned}</Text>
          <Text style={styles.statLabel}>Words</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🎯</Text>
          <Text style={styles.statNumber}>{userProgress.accuracy}%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>⏱️</Text>
          <Text style={styles.statNumber}>{userProgress.studyTime}m</Text>
          <Text style={styles.statLabel}>Time</Text>
        </View>
      </View>

      {/* Today's Lessons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Lessons</Text>
        {todayLessons.map((lesson) => (
          <TouchableOpacity
            key={lesson.id}
            style={styles.lessonCard}
            onPress={() => navigation.navigate('Lessons')}
          >
            <View style={styles.lessonIcon}>
              <Text style={styles.lessonIconText}>
                {lesson.difficulty === 'beginner' ? '🌱' : lesson.difficulty === 'intermediate' ? '🌿' : '🌳'}
              </Text>
            </View>
            <View style={styles.lessonInfo}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <Text style={styles.lessonDescription}>{lesson.description}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${lesson.progress}%` }]} />
              </View>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#EEF2FF' }]}
            onPress={() => navigation.navigate('Lessons')}
          >
            <Text style={styles.actionIcon}>📖</Text>
            <Text style={styles.actionText}>Practice Vocabulary</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#FEF3C7' }]}
            onPress={() => navigation.navigate('Practice')}
          >
            <Text style={styles.actionIcon}>✍️</Text>
            <Text style={styles.actionText}>Take Quiz</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerCard: {
    margin: SPACING.md,
    padding: SPACING.lg,
    borderRadius: 20,
    marginTop: SPACING.xs,
  },
  greeting: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: SPACING.xs,
  },
  learningLanguage: {
    fontSize: SIZES.md,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: SPACING.lg,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: SPACING.md,
    borderRadius: 12,
  },
  streakEmoji: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  streakNumber: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  streakText: {
    fontSize: SIZES.sm,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.sm,
    gap: SPACING.sm,
  },
  statCard: {
    width: (width - SPACING.md * 3) / 2,
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: 16,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  statNumber: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  section: {
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: 16,
    marginBottom: SPACING.sm,
  },
  lessonIcon: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.background,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  lessonIconText: {
    fontSize: 24,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  lessonDescription: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.background,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  arrow: {
    fontSize: 20,
    color: COLORS.textLight,
    marginLeft: SPACING.sm,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionCard: {
    flex: 1,
    padding: SPACING.lg,
    borderRadius: 16,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  actionText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
});
