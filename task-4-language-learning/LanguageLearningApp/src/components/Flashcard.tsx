import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { CategoryItem } from '../types';
import * as Speech from 'expo-speech';


const Flashcard: React.FC<{ item: CategoryItem; onMarkLearned?: () => void }> = ({ item, onMarkLearned }) => {
const [flipped, setFlipped] = useState(false);


return (
<View style={styles.card}>
<Text style={styles.term}>{item.term}</Text>
{flipped ? (
<>
<Text style={styles.translation}>{item.translation}</Text>
{item.example ? <Text style={styles.example}>{item.example}</Text> : null}
<TouchableOpacity onPress={() => Speech.speak(item.term, { language: 'es-ES' })} style={styles.small}>
<Text>🔊 Hear</Text>
</TouchableOpacity>
{onMarkLearned ? (
<TouchableOpacity onPress={onMarkLearned} style={[styles.small, { marginTop: 8 }]}>
<Text>✅ Mark learned</Text>
</TouchableOpacity>
) : null}
</>
) : (
<TouchableOpacity onPress={() => setFlipped(true)} style={styles.small}>
<Text>Show translation</Text>
</TouchableOpacity>
)}
</View>
);
};


export default Flashcard;


const styles = StyleSheet.create({
card: { padding: 20, borderRadius: 12, backgroundColor: '#fff9e6', alignItems: 'center' },
term: { fontSize: 28, fontWeight: '800' },
translation: { fontSize: 18, marginTop: 8 },
example: { fontStyle: 'italic', marginTop: 6 },
small: { marginTop: 8 },
});