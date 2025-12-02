import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';
import { theme } from '../../styles/theme';
import { useNavigation } from '@react-navigation/native';
import { PreferenceQuestion } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PreferencesQuestionScreen = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<PreferenceQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [search, setSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const current = useMemo(() => questions[index], [questions, index]);

  const load = async () => {
    setLoading(true);
    try {
      // Fetch datasets in parallel
      const [prefRes, sexRes, purposeRes, interestsRes, beliefsRes] =
        await Promise.all([
          fetch('https://truffle-0ol8.onrender.com/api/admin/preferences'),
          fetch('https://truffle-0ol8.onrender.com/api/admin/sexuality'),
          fetch('https://truffle-0ol8.onrender.com/api/admin/purposes'),
          fetch('https://truffle-0ol8.onrender.com/api/admin/interests'),
          fetch('https://truffle-0ol8.onrender.com/api/admin/beliefs'),
        ]);

      if (
        !prefRes.ok ||
        !sexRes.ok ||
        !purposeRes.ok ||
        !interestsRes.ok ||
        !beliefsRes.ok
      ) {
        const codes = [
          prefRes.status,
          sexRes.status,
          purposeRes.status,
          interestsRes.status,
          beliefsRes.status,
        ].join(',');
        throw new Error(`Requests failed: ${codes}`);
      }

      const [prefData, sexData, purposeData, interestsData, beliefsData] =
        await Promise.all([
          prefRes.json(),
          sexRes.json(),
          purposeRes.json(),
          interestsRes.json(),
          beliefsRes.json(),
        ]);

      console.log('Preferences API response:', prefData);
      console.log('Sexuality API response:', sexData);
      console.log('Purposes API response:', purposeData);
      console.log('Interests API response:', interestsData);
      console.log('Beliefs API response:', beliefsData);

      const toArray = (d: any) =>
        Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : [];
      const prefRaw = toArray(prefData);
      const sexRaw = toArray(sexData);
      const purposeRaw = toArray(purposeData);
      const interestsRaw = toArray(interestsData);
      const beliefsRaw = toArray(beliefsData);

      const mapOptions = (raw: any[], labelKeyCandidates: string[]) =>
        raw
          .filter((item: any) => item && (item._id || item.id))
          .map((item: any) => {
            const labelKey =
              labelKeyCandidates.find(k => item[k] != null) ||
              labelKeyCandidates[0];
            return {
              id: String(item._id || item.id),
              label: String(item[labelKey] ?? ''),
            };
          })
          .filter(opt => opt.label.length > 0);

      const q1: PreferenceQuestion = {
        id: 'preferences',
        question: 'Select your preferences',
        type: 'multi',
        options: mapOptions(prefRaw, ['preference', 'name', 'label']),
      };

      const q2: PreferenceQuestion = {
        id: 'sexuality',
        question: "What's your sexuality?",
        type: 'single',
        options: mapOptions(sexRaw, ['sexuality', 'name', 'label']),
      };

      const q3: PreferenceQuestion = {
        id: 'purposes',
        question: 'What are you looking for right now?',
        type: 'single',
        options: mapOptions(purposeRaw, ['purpose', 'name', 'label']),
      };

      // Add occupation (free text)
      const occupationQuestion: PreferenceQuestion = {
        id: 'occupation',
        question: "What's your Occupation?",
        type: 'single',
        options: [],
      };

      // Add height choices: simple predefined list in ft/cm
      const heightOptions = [
        { id: 'cm_150', label: '150 cm' },
        { id: 'cm_160', label: '160 cm' },
        { id: 'cm_170', label: '170 cm' },
        { id: 'cm_180', label: '180 cm' },
        { id: 'cm_190', label: '190 cm' },
        { id: 'ft_5', label: '5\'0"' },
        { id: 'ft_5_6', label: '5\'6"' },
        { id: 'ft_6', label: '6\'0"' },
        { id: 'ft_6_2', label: '6\'2"' },
      ];
      const heightQuestion: PreferenceQuestion = {
        id: 'height',
        question: 'How tall are you?',
        type: 'single',
        options: heightOptions,
      };

      const interestsQuestion: PreferenceQuestion = {
        id: 'interests',
        question: 'Choose 5 things you are all about',
        type: 'multi',
        options: mapOptions(interestsRaw, ['interest', 'name', 'label']),
      };

      const beliefsQuestion: PreferenceQuestion = {
        id: 'beliefs',
        question: 'What are your religious beliefs?',
        type: 'single',
        options: mapOptions(beliefsRaw, ['belief', 'name', 'label']),
      };

      const built = [
        q1,
        q2,
        q3,
        occupationQuestion,
        heightQuestion,
        interestsQuestion,
        beliefsQuestion,
      ].filter(
        q =>
          q.id === 'occupation' ||
          (Array.isArray(q.options) && q.options.length > 0),
      );
      if (built.length === 0) {
        Alert.alert('Error', 'No questions or options found');
      } else {
        setQuestions(built);
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const selectOption = (optionId: string) => {
    if (!current) return;
    if (current.type === 'multi') {
      const prev = (answers[current.id] as string[]) || [];
      const next = prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId];
      if (current.id === 'interests' && next.length > 5) {
        Alert.alert('You can select up to 5 interests');
        return;
      }
      setAnswers({ ...answers, [current.id]: next });
    } else {
      setAnswers({ ...answers, [current.id]: optionId });
    }
  };

  const onNext = async () => {
    if (!current) return;
    const val = answers[current.id];
    // Require answer only for first three (preferences may be optional? assume optional except sexuality & purposes)
    const requiredIds = ['sexuality', 'purposes'];
    if (
      requiredIds.includes(current.id) &&
      (!val || (Array.isArray(val) && val.length === 0))
    ) {
      Alert.alert('Please choose an option');
      return;
    }
    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      try {
        // Persist locally
        await AsyncStorage.setItem('preferences_answers', JSON.stringify(answers));

        // Helpers
        const parseHeight = (h: string | string[] | undefined) => {
          if (!h || Array.isArray(h)) return undefined;
          if (h.startsWith('cm_')) {
            const num = parseInt(h.split('_')[1], 10);
            if (!isNaN(num)) return { unit: 'cm', value: num };
          }
          if (h.startsWith('ft_')) {
            const parts = h.split('_').slice(1); // ['5','6']
            const foot = parseInt(parts[0], 10) || 0;
            const inch = parseInt(parts[1] || '0', 10) || 0;
            const totalInches = foot * 12 + inch;
            const cm = Math.round(totalInches * 2.54);
            return { unit: 'cm', value: cm };
          }
          return undefined;
        };

        // Resolve sexuality to label (backend expects enum string like 'female', not option id)
        const sexualityId = typeof answers['sexuality'] === 'string' ? answers['sexuality'] : undefined;
        const sexualityQuestion = questions.find(q => q.id === 'sexuality');
        let sexualityLabel: string | undefined = undefined;
        if (sexualityId && sexualityQuestion) {
          const opt = sexualityQuestion.options.find(o => o.id === sexualityId);
          if (opt?.label) sexualityLabel = opt.label.toLowerCase();
        }
        const payload: any = {};
        if (answers['occupation']) payload.occupation = answers['occupation'];
        payload.preferences = Array.isArray(answers['preferences']) ? answers['preferences'] : [];
        payload.purpose = Array.isArray(answers['purposes'])
          ? answers['purposes']
          : answers['purposes']
          ? [answers['purposes']]
          : [];
        payload.interests = Array.isArray(answers['interests']) ? answers['interests'] : [];
        if (sexualityLabel) payload.sex = sexualityLabel;
        const heightObj = parseHeight(answers['height']);
        if (heightObj) payload.height = { unit: heightObj.unit }; // backend sample only shows unit

        const token = await AsyncStorage.getItem('auth_token');
        const storedUser = await AsyncStorage.getItem('auth_user');
        let userId: string | undefined = undefined;
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            userId = parsed?.id || parsed?._id; // handle different id field names
          } catch {}
        }
        setSubmitting(true);
        console.log('Submitting profile payload (multi-endpoint attempt):', payload);

        const base = 'https://truffle-0ol8.onrender.com';
        // Backend indicates update should use /api/profile/update; remove deprecated guesses
        const endpoints = [
          { url: `${base}/api/profile/update`, method: 'POST' },
          { url: `${base}/api/profile/update`, method: 'POST' },
        ];

        let success: any = null;
        let lastFailure: { url: string; method: string; status: number; body: string } | null = null;
        for (const ep of endpoints) {
          try {
            const r = await fetch(ep.url, {
              method: ep.method,
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify(payload),
            });
            if (r.ok) {
              const txt = await r.text();
              try { success = txt ? JSON.parse(txt) : {}; } catch { success = { raw: txt }; }
              console.log('Profile update succeeded using', ep.method, ep.url, success);
              break;
            } else {
              const txt = await r.text();
              lastFailure = { url: ep.url, method: ep.method, status: r.status, body: txt };
              console.warn('Profile update failed attempt', lastFailure);
            }
          } catch (err: any) {
            console.error('Network error calling', ep, err);
          }
        }

        if (!success) {
          setSubmitting(false);
          Alert.alert('Update failed', lastFailure ? `Last: ${lastFailure.method} ${lastFailure.url} (${lastFailure.status})` : 'All attempts failed');
          console.log('Final submission failure', lastFailure);   
          return;
        }

        if (success?.user) {
          await AsyncStorage.setItem('auth_user', JSON.stringify(success.user));
        }
        setSubmitting(false);
        navigation.navigate('LetsUnmaskYou' as never);
      } catch (e: any) {
        console.error('Final submission error', e);
        Alert.alert('Error', e?.message || 'Failed submitting profile');
        setSubmitting(false);
      }
    }
  };

  const onSkip = () => {
    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      navigation.navigate(
        'PreferencesSummary' as never,
        { answers, questions } as never,
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!current) {
    return (
      <View style={styles.center}>
        <Text>No questions available</Text>
        <View style={{ height: 12 }} />
        <TouchableOpacity style={styles.nextButton} onPress={load}>
          <Text style={styles.nextButtonText}>Retry</Text>
        <TouchableOpacity
          style={[styles.nextButton, { opacity: submitting ? 0.7 : 1 }]}
          onPress={submitting ? undefined : onNext}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.nextButtonText}>{index < questions.length - 1 ? 'Next' : 'Finish'}</Text>
          )}
        </TouchableOpacity>
          <Text style={styles.nextButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const selected = answers[current.id];

  // Progress fraction
  const progress = (index + 1) / questions.length;
  const showSearch = current.id === 'interests';
  const selectedCount = Array.isArray(selected) ? selected.length : 0;
  const maxInterests = 5;

  const filteredOptions =
    showSearch && current.options
      ? current.options.filter(o =>
          o.label.toLowerCase().includes(search.toLowerCase()),
        )
      : current.options;

  return (
    <View style={styles.container}>
      <View style={styles.progressBarWrapper}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { flex: progress }]} />
          <View style={{ flex: 1 - progress }} />
        </View>
      </View>
      <Text style={styles.title}>{current.question}</Text>
      {current.id === 'interests' && (
        <Text style={styles.subtitle}>
          Your vibe attracts your tribe - share your passions to connect with
          those who feel the same.
        </Text>
      )}
      {current.id === 'beliefs' && (
        <Text style={styles.subtitle}>
          You can share as much or as little as you want — it’s all up to you.
        </Text>
      )}
      {showSearch && (
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="What are you into?"
            placeholderTextColor={theme.colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      )}

      {current.id === 'occupation' ? (
        <TextInput
          style={styles.input}
          placeholder="Enter here"
          value={typeof selected === 'string' ? selected : ''}
          onChangeText={t => setAnswers({ ...answers, [current.id]: t })}
        />
      ) : current.id === 'height' ? (
        <View>
          <FlatList
            data={filteredOptions}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              const isSelected = Array.isArray(selected)
                ? selected.includes(item.id)
                : selected === item.id;
              return (
                <TouchableOpacity
                  style={[styles.pill, isSelected && styles.pillSelected]}
                  onPress={() => selectOption(item.id)}
                >
                  <Text
                    style={[
                      styles.pillText,
                      isSelected && styles.pillTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            contentContainerStyle={{ paddingBottom: 12 }}
          />
        </View>
      ) : (
        <FlatList
          data={filteredOptions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            const isSelected = Array.isArray(selected)
              ? selected.includes(item.id)
              : selected === item.id;
            return (
              <TouchableOpacity
                style={[styles.pill, isSelected && styles.pillSelected]}
                onPress={() => selectOption(item.id)}
              >
                <Text
                  style={[
                    styles.pillText,
                    isSelected && styles.pillTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          contentContainerStyle={{ paddingBottom: 12 }}
          ListEmptyComponent={() => (
            <View style={styles.center}>
              <Text>No options available</Text>
            </View>
          )}
        />
      )}

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          {current.id === 'interests' && (
            <Text style={styles.countText}>
              {selectedCount}/{maxInterests} selected
            </Text>
          )}
          <TouchableOpacity onPress={onSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.nextButton, { opacity: 1 }]}
          onPress={onNext}
        >
          <Text style={styles.nextButtonText}>
            {index < questions.length - 1 ? 'Next' : 'Finish'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing(6),
    paddingTop: theme.spacing(14),
    backgroundColor: theme.colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(6),
  },
  title: {
    fontSize: theme.fonts.title,
    fontWeight: '700',
    marginBottom: theme.spacing(4),
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.fonts.body,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing(5),
    lineHeight: 22,
  },
  progressBarWrapper: { marginBottom: theme.spacing(6) },
  progressTrack: {
    flexDirection: 'row',
    height: 4,
    backgroundColor: '#E4E1E7',
    borderRadius: theme.radius.pill,
    overflow: 'hidden',
  },
  progressFill: { backgroundColor: theme.colors.accent },
  pill: {
    backgroundColor: theme.colors.surfaceAlt,
    paddingVertical: theme.spacing(3),
    paddingHorizontal: theme.spacing(4),
    borderRadius: theme.radius.pill,
    marginRight: theme.spacing(2),
  },
  pillSelected: {
    backgroundColor: theme.colors.accentLight,
  },
  pillText: { fontSize: theme.fonts.body, color: theme.colors.text },
  pillTextSelected: { color: theme.colors.accent, fontWeight: '600' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(8),
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(4),
  },
  countText: {
    fontSize: theme.fonts.small,
    color: theme.colors.textMuted,
    marginRight: theme.spacing(4),
  },
  skipText: { fontSize: theme.fonts.body, color: theme.colors.textMuted },
  nextButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: theme.spacing(4),
    paddingHorizontal: theme.spacing(10),
    borderRadius: theme.radius.pill,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: theme.fonts.body,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing(4),
    backgroundColor: '#FFFFFF',
    fontSize: theme.fonts.body,
    marginBottom: theme.spacing(4),
  },
  searchWrapper: { marginBottom: theme.spacing(4) },
  searchInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing(3),
    paddingHorizontal: theme.spacing(4),
    fontSize: theme.fonts.body,
  },
});

export default PreferencesQuestionScreen;
