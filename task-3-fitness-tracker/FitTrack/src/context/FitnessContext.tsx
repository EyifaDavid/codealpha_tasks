import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Workout, DailyStats, Goal } from "../types";
import * as Pedometer from "expo-sensors/build/Pedometer";

interface FitnessContextType {
  workouts: Workout[];
  dailyStats: DailyStats;
  goals: Goal[];
  weeklyData: DailyStats[];
  monthlyData: DailyStats[];
  activeTab: 'today' | 'week';

  addWorkout: (workout: Omit<Workout, "id">) => void;
  deleteWorkout: (id: string) => void;
  updateDailyStats: (stats: Partial<DailyStats>) => void;
  updateGoal: (goalId: string, current: number) => void;
  addGoal: (goal: Omit<Goal, "id">) => void;
  deleteGoal: (id: string) => void;
  addWater: () => void;
  removeWater: () => void;
  updateSteps: (steps: number) => void;
  resetProgress: () => void;
  setActiveTab: (tab: 'today' | 'week') => void;

  getTodaysWorkouts: () => Workout[];
  getWeeklyProgress: () => { steps: number; calories: number; workouts: number };
  getMonthlyProgress: () => { steps: number; calories: number; workouts: number };
  getCurrentStats: () => DailyStats | { steps: number; calories: number; workouts: number };
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

const STORAGE_KEYS = {
  WORKOUTS: "@fitness_workouts",
  GOALS: "@fitness_goals",
  STATS: "@fitness_stats",
  WEEKLY_DATA: "@fitness_weekly_data",
  ACTIVE_TAB: "@fitness_active_tab",
};

const generateUniqueId = (): string => `fit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const getTodayDate = (): string => new Date().toISOString().split("T")[0];

// Generate random weekly data for mockup
const generateWeeklyData = (): DailyStats[] => {
  const week: DailyStats[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split("T")[0];
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const baseSteps = isWeekend ? 4000 : 6000;
    const baseWorkouts = isWeekend ? 1 : 2;
    week.push({
      date: dateString,
      steps: Math.floor(Math.random() * 3000) + baseSteps,
      calories: Math.floor(Math.random() * 400) + 200,
      workouts: Math.floor(Math.random() * 2) + baseWorkouts,
      waterIntake: Math.floor(Math.random() * 1500) + 1500,
      sleep: Math.floor(Math.random() * 2) + 6,
    });
  }
  return week;
};

export const FitnessProvider = ({ children }: { children: ReactNode }) => {
  const today = getTodayDate();

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats>({
    date: today,
    steps: 0,
    calories: 0,
    workouts: 0,
    waterIntake: 0,
    sleep: 0,
  });
  const [goals, setGoals] = useState<Goal[]>([]);
  const [weeklyData, setWeeklyData] = useState<DailyStats[]>([]);
  const [monthlyData, setMonthlyData] = useState<DailyStats[]>([]);
  const [activeTab, setActiveTab] = useState<'today' | 'week'>('today');
  const [isLoaded, setIsLoaded] = useState(false);

  // ===== Load initial data =====
  useEffect(() => { loadInitialData(); }, []);

  const loadInitialData = async () => {
    try {
      const [workoutsRaw, statsRaw, goalsRaw, weeklyRaw, tabRaw] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.WORKOUTS),
        AsyncStorage.getItem(STORAGE_KEYS.STATS),
        AsyncStorage.getItem(STORAGE_KEYS.GOALS),
        AsyncStorage.getItem(STORAGE_KEYS.WEEKLY_DATA),
        AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_TAB),
      ]);

      if (workoutsRaw) setWorkouts(JSON.parse(workoutsRaw));
      if (statsRaw) setDailyStats(JSON.parse(statsRaw));
      if (goalsRaw) setGoals(JSON.parse(goalsRaw)); else setDefaultGoals();
      if (weeklyRaw) setWeeklyData(JSON.parse(weeklyRaw)); else setWeeklyData(generateWeeklyData());
      if (tabRaw) setActiveTab(tabRaw as 'today' | 'week');

      setIsLoaded(true);
    } catch (e) { console.warn("Load fitness data failed", e); setIsLoaded(true); }
  };

  // ===== Persist data =====
  useEffect(() => { if (isLoaded) AsyncStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts)); }, [workouts, isLoaded]);
  useEffect(() => { if (isLoaded) AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(dailyStats)); }, [dailyStats, isLoaded]);
  useEffect(() => { if (isLoaded) AsyncStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals)); }, [goals, isLoaded]);
  useEffect(() => { if (isLoaded) AsyncStorage.setItem(STORAGE_KEYS.WEEKLY_DATA, JSON.stringify(weeklyData)); }, [weeklyData, isLoaded]);
  useEffect(() => { if (isLoaded) AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, activeTab); }, [activeTab, isLoaded]);

  // ===== Pedometer integration & daily reset =====
  useEffect(() => {
    let subscription: any;
    const initPedometer = async () => {
      const available = await Pedometer.isAvailableAsync();
      if (!available) return console.warn("Pedometer not available");

      const { status } = await Pedometer.requestPermissionsAsync();
      if (status !== "granted") return console.warn("Pedometer permission denied");

      // fetch today's initial steps
      const startOfDay = new Date();
      startOfDay.setHours(0,0,0,0);
      const pastSteps = await Pedometer.getStepCountAsync(startOfDay, new Date());
      const initialSteps = pastSteps.steps || 0;

      setDailyStats(prev => ({ ...prev, steps: initialSteps }));
      setGoals(prev => prev.map(g => g.type === "steps" ? { ...g, current: initialSteps, completed: initialSteps >= g.target } : g));

      subscription = Pedometer.watchStepCount(result => {
        const steps = initialSteps + result.steps;
        setDailyStats(prev => ({ ...prev, steps }));
        setGoals(prev => prev.map(g => g.type === "steps" ? { ...g, current: steps, completed: steps >= g.target } : g));
      });
    };

    initPedometer();

    // Daily reset at midnight
    const midnightReset = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setDailyStats({ date: getTodayDate(), steps:0, calories:0, workouts:0, waterIntake:0, sleep:0 });
        setGoals(prev => prev.map(g => ({ ...g, current: 0, completed: false })));
      }
    }, 60 * 1000);

    return () => { subscription?.remove(); clearInterval(midnightReset); };
  }, []);

  const setDefaultGoals = () => {
    setGoals([
      { id: generateUniqueId(), title: "Daily Steps", target: 10000, current: 0, unit: "steps", type: "steps", completed: false },
      { id: generateUniqueId(), title: "Weekly Workouts", target: 5, current: 0, unit: "workouts", type: "workouts", completed: false },
      { id: generateUniqueId(), title: "Daily Calories Burned", target: 500, current: 0, unit: "calories", type: "calories", completed: false },
      { id: generateUniqueId(), title: "Water Intake", target: 2000, current: 0, unit: "ml", type: "water", completed: false },
    ]);
  };

  // ===== Actions =====
  const addWorkout = (workout: Omit<Workout, "id">) => {
    const newWorkout: Workout = { ...workout, id: generateUniqueId(), date: workout.date || today };
    setWorkouts(prev => [newWorkout, ...prev]);
    setDailyStats(prev => ({ ...prev, workouts: prev.workouts + 1, calories: prev.calories + (workout.caloriesBurned || 0) }));
    setGoals(prev => prev.map(g => {
      if (g.type === "workouts") return { ...g, current: g.current + 1, completed: g.current + 1 >= g.target };
      if (g.type === "calories") return { ...g, current: g.current + (workout.caloriesBurned || 0), completed: g.current + (workout.caloriesBurned || 0) >= g.target };
      return g;
    }));
    setWeeklyData(prev => prev.map(day => day.date === today ? { ...day, workouts: day.workouts + 1, calories: day.calories + (workout.caloriesBurned || 0) } : day));
  };

  const deleteWorkout = (id: string) => {
    const w = workouts.find(w => w.id === id);
    if (!w) return;
    setWorkouts(prev => prev.filter(wk => wk.id !== id));
    setDailyStats(prev => ({ ...prev, workouts: Math.max(0, prev.workouts - 1), calories: Math.max(0, prev.calories - (w.caloriesBurned || 0)) }));
    setGoals(prev => prev.map(g => {
      if (g.type === "workouts") return { ...g, current: Math.max(0, g.current - 1), completed: Math.max(0, g.current - 1) >= g.target };
      if (g.type === "calories") return { ...g, current: Math.max(0, g.current - (w.caloriesBurned || 0)), completed: Math.max(0, g.current - (w.caloriesBurned || 0)) >= g.target };
      return g;
    }));
  };

  const updateDailyStats = (stats: Partial<DailyStats>) => {
    setDailyStats(prev => ({ ...prev, ...stats }));
    setGoals(prev => prev.map(g => {
      if (stats.steps !== undefined && g.type === "steps") return { ...g, current: stats.steps, completed: stats.steps >= g.target };
      if (stats.waterIntake !== undefined && g.type === "water") return { ...g, current: stats.waterIntake, completed: stats.waterIntake >= g.target };
      if (stats.sleep !== undefined && g.type === "sleep") return { ...g, current: stats.sleep, completed: stats.sleep >= g.target };
      return g;
    }));
  };

  const updateGoal = (goalId: string, current: number) => setGoals(prev => prev.map(g => g.id === goalId ? { ...g, current, completed: current >= g.target } : g));
  const addGoal = (goal: Omit<Goal, "id">) => setGoals(prev => [...prev, { ...goal, id: generateUniqueId(), completed: false }]);
  const deleteGoal = (id: string) => setGoals(prev => prev.filter(g => g.id !== id));
  const addWater = () => setDailyStats(prev => ({ ...prev, waterIntake: prev.waterIntake + 1 }));
  const removeWater = () => setDailyStats(prev => ({ ...prev, waterIntake: Math.max(0, prev.waterIntake - 1) }));
  const updateSteps = (steps: number) => setDailyStats(prev => ({ ...prev, steps: Math.max(0, steps) }));

  const resetProgress = async () => {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    setWorkouts([]);
    setDailyStats({ date: today, steps:0, calories:0, workouts:0, waterIntake:0, sleep:0 });
    setGoals([]);
    setWeeklyData(generateWeeklyData());
    setActiveTab('today');
  };

  // ===== Utilities =====
  const getTodaysWorkouts = () => workouts.filter(w => w.date === today);
  const getWeeklyProgress = () => weeklyData.reduce((acc, day) => ({
    steps: acc.steps + day.steps,
    calories: acc.calories + day.calories,
    workouts: acc.workouts + day.workouts
  }), { steps:0, calories:0, workouts:0 });

  const getMonthlyProgress = () => getWeeklyProgress();
  const getCurrentStats = () => activeTab === 'today' ? dailyStats : getWeeklyProgress();

  return (
    <FitnessContext.Provider value={{
      workouts, dailyStats, goals, weeklyData, monthlyData, activeTab,
      addWorkout, deleteWorkout, updateDailyStats, updateGoal, addGoal, deleteGoal,
      addWater, removeWater, updateSteps, resetProgress, setActiveTab,
      getTodaysWorkouts, getWeeklyProgress, getMonthlyProgress, getCurrentStats
    }}>
      {children}
    </FitnessContext.Provider>
  );
};

export const useFitness = () => {
  const ctx = useContext(FitnessContext);
  if (!ctx) throw new Error("useFitness must be used inside FitnessProvider");
  return ctx;
};
