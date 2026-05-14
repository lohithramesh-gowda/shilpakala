import React from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  ActivityIndicator, Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import { wipApi } from '../api';
import { Colors, Spacing, Radius, Shadow, Typography } from '../theme';

const { width: W } = Dimensions.get('window');

const STAGE_LABELS: Record<number, { emoji: string; color: string }> = {
  1: { emoji: '🪨', color: '#7D6E5B' },
  2: { emoji: '⛏',  color: '#96703A' },
  3: { emoji: '🔨', color: '#C47A27' },
  4: { emoji: '✨', color: '#B8860B' },
  5: { emoji: '🏆', color: '#1E8449' },
};

export default function WipTimelineScreen({ route, navigation }: any) {
  const { artworkId, artworkTitle } = route.params;

  const { data, isLoading } = useQuery({
    queryKey: ['wip', artworkId],
    queryFn:  () => wipApi.getByArtwork(artworkId),
  });

  const stages: any[] = (data?.data as any)?.data ?? [];

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: artworkTitle ?? 'Work in Progress' });
  }, [artworkTitle]);

  if (isLoading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={Colors.gold} /></View>;
  }

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Creation Journey</Text>
        <Text style={styles.headerSub}>
          Watch how raw stone transforms into timeless art — {stages.length} stages
        </Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressRow}>
        {[1, 2, 3, 4, 5].map(step => {
          const filled = stages.some(s => s.stage === step);
          const current = !filled && stages.some(s => s.stage === step - 1);
          const cfg = STAGE_LABELS[step];
          return (
            <View key={step} style={styles.progressStep}>
              <View style={[
                styles.progressDot,
                filled && styles.progressDotFilled,
                current && styles.progressDotCurrent,
              ]}>
                <Text style={{ fontSize: 12 }}>{cfg.emoji}</Text>
              </View>
              {step < 5 && <View style={[styles.progressLine, filled && stages.some(s => s.stage === step + 1) && styles.progressLineFilled]} />}
            </View>
          );
        })}
      </View>

      {/* Timeline items */}
      {stages.map((stage: any, index: number) => {
        const cfg = STAGE_LABELS[stage.stage] ?? { emoji: '🔨', color: Colors.gold };
        const isLast = index === stages.length - 1;
        return (
          <View key={stage.id} style={styles.timelineItem}>
            {/* Connector */}
            <View style={styles.timelineLeft}>
              <View style={[styles.stageCircle, { backgroundColor: cfg.color }]}>
                <Text style={styles.stageEmoji}>{cfg.emoji}</Text>
              </View>
              {!isLast && <View style={[styles.connector, { backgroundColor: cfg.color + '44' }]} />}
            </View>

            {/* Card */}
            <View style={styles.timelineCard}>
              <View style={styles.stageHeader}>
                <View style={[styles.stagePill, { backgroundColor: cfg.color + '22', borderColor: cfg.color }]}>
                  <Text style={[styles.stagePillTxt, { color: cfg.color }]}>
                    Stage {stage.stage} — {stage.stageLabel}
                  </Text>
                </View>
                <Text style={styles.stageDate}>
                  {new Date(stage.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </Text>
              </View>

              <Image
                source={{ uri: stage.image }}
                style={styles.stageImg}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={350}
                placeholder={{ blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj' }}
              />

              <Text style={styles.stageTitle}>{stage.title}</Text>
              <Text style={styles.stageDesc}>{stage.description}</Text>
            </View>
          </View>
        );
      })}

      {stages.length === 0 && (
        <View style={styles.empty}>
          <Text style={{ fontSize: 48 }}>🪨</Text>
          <Text style={styles.emptyTxt}>No timeline stages yet</Text>
          <Text style={styles.emptySub}>Check back as the artwork progresses</Text>
        </View>
      )}

      <View style={{ height: Spacing.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: Colors.cream },
  center:  { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: Spacing.md },
  header:  {
    backgroundColor: Colors.ink,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  headerTitle: { ...Typography.serif22, color: Colors.white },
  headerSub:   { ...Typography.caption, color: 'rgba(255,255,255,0.65)', marginTop: 4 },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadow.card,
  },
  progressStep:          { flexDirection: 'row', alignItems: 'center' },
  progressDot: {
    width: 38, height: 38,
    borderRadius: 19,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  progressDotFilled:  { backgroundColor: Colors.goldPale, borderColor: Colors.gold },
  progressDotCurrent: { backgroundColor: Colors.gold + '33', borderColor: Colors.gold, borderStyle: 'dashed' },
  progressLine:       { width: 20, height: 2, backgroundColor: Colors.border },
  progressLineFilled: { backgroundColor: Colors.gold },
  timelineItem:       { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  timelineLeft:       { alignItems: 'center', width: 44 },
  stageCircle: {
    width: 44, height: 44,
    borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.card,
  },
  stageEmoji:   { fontSize: 20 },
  connector:    { flex: 1, width: 2, marginVertical: 4 },
  timelineCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.card,
  },
  stageHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  stagePill: {
    borderRadius: Radius.round,
    borderWidth: 1,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  stagePillTxt: { ...Typography.label, fontSize: 9 },
  stageDate:    { ...Typography.caption, fontSize: 11 },
  stageImg:     { width: '100%', height: (W - 44 - Spacing.md * 3 - Spacing.sm) * 0.65, borderRadius: Radius.md, marginBottom: Spacing.sm },
  stageTitle:   { ...Typography.sans16, fontSize: 15, marginBottom: 4 },
  stageDesc:    { ...Typography.body, fontSize: 14 },
  empty:        { alignItems: 'center', paddingTop: 60 },
  emptyTxt:     { ...Typography.sans16, marginTop: Spacing.sm },
  emptySub:     { ...Typography.caption, marginTop: 4 },
});

