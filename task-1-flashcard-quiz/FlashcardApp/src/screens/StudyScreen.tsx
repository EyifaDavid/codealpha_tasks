// screens/StudyScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { FlashCard } from '../components/Flashcard';
import { COLORS, SPACING } from '../constants/themes';
import { useFlashcards } from '../context/FlashcardContext';

export const StudyScreen = () => {
  const { 
    filteredFlashcards, 
    searchQuery, 
    setSearchQuery,
    clearSearch 
  } = useFlashcards();
  
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset to first card when search results change
  useEffect(() => {
    setCurrentIndex(0);
  }, [filteredFlashcards.length, searchQuery]);

  const handleNext = () => {
    if (currentIndex < filteredFlashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  if (filteredFlashcards.length === 0) {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery ? 'No matching flashcards' : 'No flashcards available'}
          </Text>
          <Text style={styles.emptySubtext}>
            {searchQuery ? 'Try a different search term' : 'Add some cards to start studying'}
          </Text>
          {searchQuery && (
            <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
              <Text style={styles.clearButtonText}>Clear Search</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search flashcards..."
            value={searchQuery}
            onChangeText={handleSearchChange}
            placeholderTextColor={COLORS.textLight}
          />
          {searchQuery ? (
            <TouchableOpacity style={styles.clearIcon} onPress={clearSearch}>
              <Text style={styles.clearIconText}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Progress and Search Results Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.progressText}>
            {currentIndex + 1} / {filteredFlashcards.length}
          </Text>
          {searchQuery && (
            <Text style={styles.searchResultsText}>
              Showing {filteredFlashcards.length} result{filteredFlashcards.length !== 1 ? 's' : ''}
            </Text>
          )}
        </View>

        {/* Flashcard */}
        <FlashCard card={filteredFlashcards[currentIndex]} />

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
              currentIndex === filteredFlashcards.length - 1 && styles.navButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={currentIndex === filteredFlashcards.length - 1}
          >
            <Text style={styles.navButtonText}>Next →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  searchContainer: {
    padding: SPACING.md,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    padding: SPACING.md,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
  },
  clearIcon: {
    position: 'absolute',
    right: SPACING.lg,
    top: SPACING.lg + 12,
    padding: SPACING.sm,
  },
  clearIconText: {
    fontSize: 18,
    color: COLORS.textLight,
  },
  clearButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  infoContainer: {
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  progressText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  searchResultsText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
    fontStyle: 'italic',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  navButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  navButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});