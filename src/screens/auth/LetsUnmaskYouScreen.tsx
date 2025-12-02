import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../styles/theme';

const LetsUnmaskYouScreen = () => {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let’s unmask you</Text>
      <Text style={styles.subtitle}>Your profile basics are set. Add photos and finish setting the vibe so others can discover you.</Text>
      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Main')}> 
        <Text style={styles.primaryButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing(6), justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text, marginBottom: theme.spacing(4) },
  subtitle: { fontSize: theme.fonts.body, lineHeight: 22, color: theme.colors.textMuted, marginBottom: theme.spacing(8) },
  primaryButton: { backgroundColor: theme.colors.accent, paddingVertical: theme.spacing(4), borderRadius: theme.radius.pill, alignItems: 'center' },
  primaryButtonText: { color: '#fff', fontWeight: '600', fontSize: theme.fonts.body },
});

export default LetsUnmaskYouScreen;
