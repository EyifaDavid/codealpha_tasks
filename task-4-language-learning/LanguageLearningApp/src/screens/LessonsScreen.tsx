import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

export const LessonsScreen = () => {
  const { flashcards } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);

  const currentCard = flashcards[currentIndex];

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowTranslation(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowTranslation(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentIndex + 1) / flashcards.length) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {currentIndex + 1} / {flashcards.length}
        </Text>
      </View>

      {/* Flashcard */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.category}>{currentCard.category}</Text>
          
          <View style={styles.wordContainer}>
            <Text style={styles.word}>{currentCard.word}</Text>
            <Text style={styles.pronunciation}>/{currentCard.pronunciation}/</Text>
          </View>

          {showTranslation && (
            <View style={styles.translationContainer}>
              <Text style={styles.translationLabel}>Translation:</Text>
              <Text style={styles.translation}>{currentCard.translation}</Text>
              
              <Text style={styles.exampleLabel}>Example:</Text>
              <Text style={styles.example}>{currentCard.example}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.showButton}
            onPress={() => setShowTranslation(!showTranslation)}
          >
            <Text style={styles.showButtonText}>
              {showTranslation ? 'Hide Translation' : 'Show Translation'}
            </Text>
          </TouchableOpacity>

          {/* Audio Button */}
          <TouchableOpacity style={styles.audioButton}>
            <Text style={styles.audioButtonText}>🔊 Listen</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Navigation */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={currentIndex === 0}
        >
          <Text style={styles.navButtonText}>← Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            currentIndex === flashcards.length - 1 && styles.navButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={currentIndex === flashcards.length - 1}
        >
          <Text style={styles.navButtonText}>Next →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  progressContainer: {
    padding: SPACING.md,
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
    backgroundColor: COLORS.primary,
  },
  progressText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: '600',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  card: {
    width: width - 32,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  category: {
    fontSize: SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: SPACING.lg,
  },
  wordContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  word: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  pronunciation: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  translationContainer: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.md,
  },
  translationLabel: {
    fontSize: SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  translation: {
    fontSize: SIZES.xl,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  exampleLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  example: {
    fontSize: SIZES.md,
    color: COLORS.text,
    fontStyle: 'italic',
  },
  showButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  showButtonText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  audioButton: {
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.sm,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  audioButtonText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  navButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: 12,
  },
  navButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  navButtonText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});