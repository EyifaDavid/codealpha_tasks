import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, SIZES, SPACING } from '../constants/themes';

interface MathSymbolKeyboardProps {
  onSymbolSelect: (symbol: string) => void;
  onClose: () => void;
}

export const MathSymbolKeyboard = ({ onSymbolSelect, onClose }: MathSymbolKeyboardProps) => {
  const symbolCategories = [
    {
      title: 'Operations',
      symbols: [
        { label: '×', value: '×' },
        { label: '÷', value: '÷' },
        { label: '±', value: '±' },
        { label: '√', value: '√' },
      ]
    },
    {
      title: 'Powers',
      symbols: [
        { label: 'x²', value: '²' },
        { label: 'x³', value: '³' },
        { label: 'xⁿ', value: 'ⁿ' },
      ]
    },
    {
      title: 'Comparisons',
      symbols: [
        { label: '≤', value: '≤' },
        { label: '≥', value: '≥' },
        { label: '≠', value: '≠' },
        { label: '≈', value: '≈' },
      ]
    },
    {
      title: 'Greek Letters',
      symbols: [
        { label: 'α', value: 'α' },
        { label: 'β', value: 'β' },
        { label: 'γ', value: 'γ' },
        { label: 'π', value: 'π' },
        { label: 'θ', value: 'θ' },
        { label: 'Σ', value: 'Σ' },
        { label: 'Δ', value: 'Δ' },
        { label: 'Ω', value: 'Ω' },
      ]
    },
    {
      title: 'Calculus',
      symbols: [
        { label: '∫', value: '∫' },
        { label: '∂', value: '∂' },
        { label: '∞', value: '∞' },
        { label: '∑', value: '∑' },
      ]
    },
    {
      title: 'Misc',
      symbols: [
        { label: '°', value: '°' },
        { label: '⁄', value: '/' },
        { label: '()', value: '()' },
        { label: '[]', value: '[]' },
      ]
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Math Symbols</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {symbolCategories.map((category, index) => (
          <View key={index} style={styles.category}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <View style={styles.symbolGrid}>
              {category.symbols.map((symbol, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.symbolButton}
                  onPress={() => onSymbolSelect(symbol.value)}
                >
                  <Text style={styles.symbolText}>{symbol.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    padding: SPACING.sm,
  },
  closeButtonText: {
    fontSize: SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
  content: {
    padding: SPACING.md,
  },
  category: {
    marginBottom: SPACING.lg,
  },
  categoryTitle: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  symbolGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  symbolButton: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  symbolText: {
    fontSize: SIZES.lg,
    color: COLORS.text,
    fontWeight: '500',
  },
});

