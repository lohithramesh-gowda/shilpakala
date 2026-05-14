import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import { artistsApi } from '../api';
import { Colors, Spacing, Radius, Shadow, Typography } from '../theme';

const { width: W } = Dimensions.get('window');
const CARD_W = (W - Spacing.md * 2 - Spacing.sm) / 2;

export default function ArtistsScreen({ navigation }: any) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['artists'],
    queryFn:  () => artistsApi.getAll(),
  });

  const artists: any[] = (data?.data as any)?.data ?? [];

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.gold} />
        <Text style={styles.loadingTxt}>Loading Shilpis…</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTxt}>Could not load artists</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryTxt}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* Header banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>🪨 Master Shilpis</Text>
        <Text style={styles.bannerSub}>Verified traditional stone & wood carvers</Text>
      </View>

      <FlatList
        data={artists}
        numColumns={2}
        keyExtractor={a => a.id}
        contentContainerStyle={styles.list}
        columnWrapperStyle={{ gap: Spacing.sm }}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.88}
            onPress={() => navigation.navigate('ArtistDetail', { artistId: item.id })}
          >
            <Image
              source={{ uri: item.profileImage }}
              style={styles.avatar}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={300}
              placeholder={{ blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj' }}
            />
            {item.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedTxt}>✓ Verified</Text>
              </View>
            )}
            <View style={styles.cardBody}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.specialization}>{item.specialization}</Text>
              <Text style={styles.location} numberOfLines={1}>📍 {item.location}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: Colors.cream },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.cream },
  banner: {
    backgroundColor: Colors.ink,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  bannerTitle:   { ...Typography.serif22, color: Colors.white, fontSize: 24 },
  bannerSub:     { ...Typography.caption, color: 'rgba(255,255,255,0.65)', marginTop: 4 },
  list:          { padding: Spacing.md },
  card: {
    width:         CARD_W,
    backgroundColor: Colors.white,
    borderRadius:  Radius.lg,
    overflow:      'hidden',
    ...Shadow.card,
  },
  avatar:        { width: CARD_W, height: CARD_W * 1.1 },
  verifiedBadge: {
    position:         'absolute',
    top:              8,
    right:            8,
    backgroundColor: 'rgba(30,132,73,0.88)',
    borderRadius:    Radius.round,
    paddingHorizontal: 7,
    paddingVertical:   3,
  },
  verifiedTxt:  { fontSize: 9, color: Colors.white, fontWeight: '700' },
  cardBody:     { padding: Spacing.sm },
  name:         { ...Typography.sans16, fontSize: 14 },
  specialization:{ ...Typography.label, color: Colors.gold, marginTop: 2 },
  location:     { ...Typography.caption, marginTop: 4 },
  loadingTxt:   { ...Typography.caption, marginTop: Spacing.sm },
  errorTxt:     { ...Typography.sans14, color: Colors.error },
  retryBtn:     { marginTop: Spacing.md, backgroundColor: Colors.gold, borderRadius: Radius.md, paddingHorizontal: 24, paddingVertical: 10 },
  retryTxt:     { color: Colors.white, fontWeight: '700' },
});

