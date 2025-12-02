import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

type RouteParams = {
  answers: Record<string, string | string[]>;
  questions: { id: string; question: string; options: { id: string; label: string }[] }[];
};

const PreferencesSummaryScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { answers = {}, questions = [] } = (route.params || {}) as RouteParams;

  const renderAnswer = (qId: string) => {
    const val = answers[qId];
    if (Array.isArray(val)) return val.join(', ');
    return val as string;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Preferences</Text>
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.question}>{item.question}</Text>
            <Text style={styles.answer}>{renderAnswer(item.id) || 'Not selected'}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Main')}>
        <Text style={styles.buttonText}>Continue to App</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 48 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  row: { backgroundColor: '#fff', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#eee' },
  question: { fontSize: 16, fontWeight: '600' },
  answer: { fontSize: 14, color: '#333', marginTop: 6 },
  button: { backgroundColor: '#2b8a3e', paddingVertical: 12, paddingHorizontal: 18, borderRadius: 8, marginTop: 24 },
  buttonText: { color: '#fff', fontWeight: '600', textAlign: 'center' },
});

export default PreferencesSummaryScreen;
