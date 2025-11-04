import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { QuizQuestion } from '../types';

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: '1',
    question: 'What does "Hola" mean in English?',
    options: ['Goodbye', 'Hello', 'Please', 'Thank you'],
    correctAnswer: 1,
    type: 'multiple-choice',
  },
  {
    id: '2',
    question: 'How do you say "Thank you" in Spanish?',
    options: ['Por favor', 'Gracias', 'Hola', 'Adiós'],
    correctAnswer: 1,
    type: 'multiple-choice',
  },
  {
    id: '3',
    question: 'Translate: "Good morning"',
    options: ['Buenas noches', 'Buenas tardes', 'Buenos días', 'Hasta luego'],
    correctAnswer: 2,
    type: 'translation',
  },
];

export const PracticeScreen = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const question = QUIZ_QUESTIONS[currentQuestion];

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    if (selectedAnswer === question.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    return (
      <View style={styles.container}>
        <View style={styles.completedContainer}>
          <Text style={styles.completedEmoji}>
            {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪'}
          </Text>
          <Text style={styles.completedTitle}>Quiz Completed!</Text>
          <Text style={styles.completedScore}>
            {score} / {QUIZ_QUESTIONS.length}
          </Text>
          <Text style={styles.completedPercentage}>{percentage}% Correct</Text>
          
          <View style={styles.completedStats}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>✅</Text>
              <Text style={styles.statValue}>{score}</Text>
              <Text style={styles.statLabel}>Correct</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>❌</Text>
              <Text style={styles.statValue}>{QUIZ_QUESTIONS.length - score}</Text>
              <Text style={styles.statLabel}>Incorrect</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
            <Text style={styles.restartButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Progress Header */}
      <View style={styles.header}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.questionCount}>
          Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
        </Text>
      </View>

      {/* Question */}
      <ScrollView style={styles.content}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionType}>
            {question.type === 'multiple-choice' ? '📝 Multiple Choice' : '🔤 Translation'}
          </Text>
          <Text style={styles.questionText}>{question.question}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correctAnswer;
            const showCorrectAnswer = showResult && isCorrect;
            const showWrongAnswer = showResult && isSelected && !isCorrect;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonSelected,
                  showCorrectAnswer && styles.optionButtonCorrect,
                  showWrongAnswer && styles.optionButtonWrong,
                ]}
                onPress={() => handleAnswerSelect(index)}
                disabled={showResult}
              >
                <View style={styles.optionContent}>
                  <View
                    style={[
                      styles.optionCircle,
                      isSelected && styles.optionCircleSelected,
                      showCorrectAnswer && styles.optionCircleCorrect,
                      showWrongAnswer && styles.optionCircleWrong,
                    ]}
                  >
                    {showResult && isCorrect && (
                      <Text style={styles.optionIcon}>✓</Text>
                    )}
                    {showResult && showWrongAnswer && (
                      <Text style={styles.optionIcon}>✗</Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.optionText,
                      (showCorrectAnswer || showWrongAnswer) && styles.optionTextBold,
                    ]}
                  >
                    {option}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Feedback */}
        {showResult && (
          <View
            style={[
              styles.feedback,
              selectedAnswer === question.correctAnswer
                ? styles.feedbackCorrect
                : styles.feedbackWrong,
            ]}
          >
            <Text style={styles.feedbackIcon}>
              {selectedAnswer === question.correctAnswer ? '✓' : '✗'}
            </Text>
            <Text style={styles.feedbackText}>
              {selectedAnswer === question.correctAnswer
                ? 'Correct! Well done!'
                : `Incorrect. The correct answer is "${question.options[question.correctAnswer]}"`}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Action Button */}
      <View style={styles.footer}>
        {!showResult ? (
          <TouchableOpacity
            style={[styles.submitButton, selectedAnswer === null && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={selectedAnswer === null}
          >
            <Text style={styles.submitButtonText}>Check Answer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'Complete Quiz'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.success,
  },
  questionCount: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  questionContainer: {
    padding: SPACING.lg,
  },
  questionType: {
    fontSize: SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  questionText: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    lineHeight: 32,
  },
  optionsContainer: {
    padding: SPACING.md,
  },
  optionButton: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  optionButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#EEF2FF',
  },
  optionButtonCorrect: {
    borderColor: COLORS.success,
    backgroundColor: '#D1FAE5',
  },
  optionButtonWrong: {
    borderColor: COLORS.danger,
    backgroundColor: '#FEE2E2',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionCircleSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  optionCircleCorrect: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.success,
  },
  optionCircleWrong: {
    borderColor: COLORS.danger,
    backgroundColor: COLORS.danger,
  },
  optionIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: SIZES.md,
    color: COLORS.text,
    flex: 1,
  },
  optionTextBold: {
    fontWeight: '600',
  },
  feedback: {
    margin: SPACING.md,
    padding: SPACING.md,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedbackCorrect: {
    backgroundColor: '#D1FAE5',
  },
  feedbackWrong: {
    backgroundColor: '#FEE2E2',
  },
  feedbackIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  feedbackText: {
    flex: 1,
    fontSize: SIZES.md,
    color: COLORS.text,
    fontWeight: '600',
  },
  footer: {
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: 12,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  submitButtonText: {
    fontSize: SIZES.md,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: COLORS.success,
    paddingVertical: SPACING.md,
    borderRadius: 12,
  },
  nextButtonText: {
    fontSize: SIZES.md,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  completedEmoji: {
    fontSize: 80,
    marginBottom: SPACING.lg,
  },
  completedTitle: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  completedScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  completedPercentage: {
    fontSize: SIZES.lg,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  completedStats: {
    flexDirection: 'row',
    gap: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  restartButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    width: '100%',
  },
  restartButtonText: {
    fontSize: SIZES.md,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
