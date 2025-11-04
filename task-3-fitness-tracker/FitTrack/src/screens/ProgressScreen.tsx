import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { useFitness } from '../context/FitnessContext';

const { width } = Dimensions.get('window');

export const ProgressScreen = () => {
  const { weeklyData } = useFitness();

  const chartConfig = {
    backgroundColor: COLORS.card,
    backgroundGradientFrom: COLORS.card,
    backgroundGradientTo: COLORS.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(108, 117, 125, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: COLORS.primary,
    },
  };

  // Prepare data for charts
  const labels = weeklyData.map(d => {
    const date = new Date(d.date);
    return date.toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 3);
  });

  const stepsData = {
    labels,
    datasets: [{
      data: weeklyData.map(d => d.steps),
      color: (opacity = 1) => `rgba(79, 171, 247, ${opacity})`,
      strokeWidth: 3,
    }],
  };

  const caloriesData = {
    labels,
    datasets: [{
      data: weeklyData.map(d => d.calories),
      color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
      strokeWidth: 3,
    }],
  };

  const workoutsData = {
    labels,
    datasets: [{
      data: weeklyData.map(d => d.workouts),
    }],
  };

  const totalSteps = weeklyData.reduce((sum, d) => sum + d.steps, 0);
  const avgSteps = Math.round(totalSteps / weeklyData.length);
  const totalCalories = weeklyData.reduce((sum, d) => sum + d.calories, 0);
  const avgCalories = Math.round(totalCalories / weeklyData.length);
  const totalWorkouts = weeklyData.reduce((sum, d) => sum + d.workouts, 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryIcon}>📊</Text>
          <Text style={styles.summaryValue}>{avgSteps.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>Avg Daily Steps</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryIcon}>🔥</Text>
          <Text style={styles.summaryValue}>{avgCalories}</Text>
          <Text style={styles.summaryLabel}>Avg Calories</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryIcon}>💪</Text>
          <Text style={styles.summaryValue}>{totalWorkouts}</Text>
          <Text style={styles.summaryLabel}>Total Workouts</Text>
        </View>
      </View>

      {/* Steps Chart */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>Steps This Week</Text>
        <LineChart
          data={stepsData}
          width={width - 32}
          height={220}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(79, 171, 247, ${opacity})`,
          }}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Calories Chart */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>Calories Burned</Text>
        <LineChart
          data={caloriesData}
          width={width - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Workouts Bar Chart */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>Workouts Per Day</Text>
        <BarChart
          data={workoutsData}
          width={width - 32}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(81, 207, 102, ${opacity})`,
          }}
          style={styles.chart}
        />
      </View>

      {/* Weekly Insights */}
      <View style={styles.insightsSection}>
        <Text style={styles.sectionTitle}>Weekly Insights</Text>
        <View style={styles.insightCard}>
          <Text style={styles.insightIcon}>🎯</Text>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Great Progress!</Text>
            <Text style={styles.insightText}>
              You've walked {totalSteps.toLocaleString()} steps this week
            </Text>
          </View>
        </View>
        <View style={styles.insightCard}>
          <Text style={styles.insightIcon}>🔥</Text>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Calories Burned</Text>
            <Text style={styles.insightText}>
              Total of {totalCalories.toLocaleString()} calories burned
            </Text>
          </View>
        </View>
        <View style={styles.insightCard}>
          <Text style={styles.insightIcon}>⭐</Text>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Keep It Up!</Text>
            <Text style={styles.insightText}>
              You completed {totalWorkouts} workouts this week
            </Text>
          </View>
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
  summaryContainer: {
    flexDirection: 'row',
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
  },
  summaryIcon: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  summaryValue: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  summaryLabel: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  chartSection: {
    padding: SPACING.md,
  },
  chartTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  chart: {
    borderRadius: 16,
  },
  insightsSection: {
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  insightIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  insightText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
});
