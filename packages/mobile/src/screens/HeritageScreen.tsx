import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import { heritageApi } from '../api';
import { Colors, Spacing, Radius, Shadow, Typography } from '../theme';

const { width: W } = Dimensions.get('window');

export default function HeritageScreen({ navigation }: any) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['heritage'],
    queryFn:  () => heritageApi.getAll(),
  });

  const stories: any[] = (data?.data as any)?.data ?? [];

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.gold} />
        <Text style={styles.loadingTxt}>Loading Heritage…</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTxt}>Could not load heritage stories</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryTxt}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={stories}
      keyExtractor={s => s.id}
      contentContainerStyle={styles.list}
      style={styles.root}
      ListHeaderComponent={() => (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🏛 Heritage Stories</Text>
          <Text style={styles.headerSub}>
            Discover the ancient art traditions kept alive by master craftsmen
          </Text>
        </View>
      )}
      ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.88}
          onPress={() => navigation.navigate('HeritageDetail', { storyId: item.id })}
        >
          {/* Cover image */}
          <Image
            source={{ uri: item.coverImage }}
            style={styles.cover}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={400}
            placeholder={{ blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj' }}
          />

          {/* Overlay */}
          <View style={styles.overlay}>
            <View style={styles.styleBadge}>
              <Text style={styles.styleTxt}>{item.style}</Text>
            </View>
            <Text style={styles.coverTitle}>{item.title}</Text>
            <Text style={styles.period}>{item.period}</Text>
          </View>

          {/* Body */}
          <View style={styles.body}>
            <Text style={styles.subtitle} numberOfLines={2}>{item.subtitle}</Text>
            <View style={styles.regionRow}>
              <Text style={styles.region}>📍 {item.region}</Text>
            </View>

            {/* Key features preview */}
            <View style={styles.features}>
              {item.keyFeatures.slice(0, 3).map((f: string, i: number) => (
                <View key={i} style={styles.featureTag}>
                  <Text style={styles.featureTxt}>✦ {f}</Text>
                </View>
              ))}
              {item.keyFeatures.length > 3 && (
                <View style={styles.featureTag}>
                  <Text style={[styles.featureTxt, { color: Colors.gold }]}>
                    +{item.keyFeatures.length - 3} more
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.readMore}>
              <Text style={styles.readMoreTxt}>Read Full Story →</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  root:        { flex: 1, backgroundColor: Colors.cream },
  center:      { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.cream },
  list:        { padding: Spacing.md, paddingTop: 0 },
  header: {
    backgroundColor: Colors.ink,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    marginHorizontal: -Spacing.md,
    paddingTop: Spacing.xl,
  },
  headerTitle:   { ...Typography.serif28, color: Colors.white },
  headerSub:     { ...Typography.body, color: 'rgba(255,255,255,0.65)', marginTop: 6, fontSize: 14, lineHeight: 20 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadow.card,
  },
  cover:         { width: '100%', height: 210 },
  overlay: {
    position:          'absolute',
    top:               0,
    left:              0,
    right:             0,
    height:            210,
    backgroundColor:   'rgba(0,0,0,0.40)',
    padding:           Spacing.md,
    justifyContent:    'flex-end',
  },
  styleBadge: {
    alignSelf:         'flex-start',
    backgroundColor:   'rgba(184,134,11,0.9)',
    borderRadius:      Radius.round,
    paddingHorizontal: 10,
    paddingVertical:   3,
    marginBottom:      8,
  },
  styleTxt:      { ...Typography.label, color: Colors.white, fontSize: 10 },
  coverTitle:    { ...Typography.serif22, color: Colors.white, fontSize: 22 },
  period:        { ...Typography.caption, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  body:          { padding: Spacing.md },
  subtitle:      { ...Typography.body, fontStyle: 'italic', color: Colors.muted, fontSize: 14 },
  regionRow:     { marginTop: 6 },
  region:        { ...Typography.caption },
  features: {
    flexDirection:  'row',
    flexWrap:       'wrap',
    gap:            6,
    marginTop:      Spacing.sm,
  },
  featureTag: {
    backgroundColor:   Colors.surface,
    borderRadius:      Radius.round,
    borderWidth:       1,
    borderColor:       Colors.border,
    paddingHorizontal: 8,
    paddingVertical:   3,
  },
  featureTxt:    { ...Typography.caption, fontSize: 11 },
  readMore:      { marginTop: Spacing.sm, alignItems: 'flex-end' },
  readMoreTxt:   { ...Typography.label, color: Colors.gold, fontSize: 11 },
  loadingTxt:    { ...Typography.caption, marginTop: Spacing.sm },
  errorTxt:      { ...Typography.sans14, color: Colors.error },
  retryBtn:      { marginTop: Spacing.md, backgroundColor: Colors.gold, borderRadius: Radius.md, paddingHorizontal: 24, paddingVertical: 10 },
  retryTxt:      { color: Colors.white, fontWeight: '700' },
});

