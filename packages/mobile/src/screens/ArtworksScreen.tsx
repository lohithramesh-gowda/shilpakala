import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Dimensions, TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import { artworksApi } from '../api';
import { Colors, Spacing, Radius, Shadow, Typography } from '../theme';
import StatusBadge from '../components/StatusBadge';

const { width: W } = Dimensions.get('window');
const COL  = 2;
const TILE = (W - Spacing.md * 2 - Spacing.sm * (COL - 1)) / COL;

const FILTERS = [
  { label: 'All',       value: '',          },
  { label: 'Available', value: 'available', },
  { label: 'WIP',       value: 'wip',       },
  { label: 'Sold',      value: 'sold',      },
];

export default function ArtworksScreen({ navigation }: any) {
  const [filter, setFilter] = useState('');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['artworks', filter],
    queryFn:  () => artworksApi.getAll({ status: filter || undefined, limit: 50 }),
  });

  const artworks: any[] = (data?.data as any)?.data ?? [];

  return (
    <View style={styles.root}>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.value}
            style={[styles.filterChip, filter === f.value && styles.filterChipActive]}
            onPress={() => setFilter(f.value)}
          >
            <Text style={[styles.filterTxt, filter === f.value && styles.filterTxtActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.gold} />
          <Text style={styles.loadingTxt}>Loading Gallery…</Text>
        </View>
      )}

      {isError && (
        <View style={styles.center}>
          <Text style={styles.errorTxt}>Could not load artworks</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryTxt}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isLoading && !isError && (
        <FlatList
          data={artworks}
          numColumns={COL}
          keyExtractor={a => a.id}
          contentContainerStyle={styles.list}
          columnWrapperStyle={{ gap: Spacing.sm }}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={{ fontSize: 36 }}>🏺</Text>
              <Text style={styles.emptyTxt}>No artworks found</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.tile}
              activeOpacity={0.88}
              onPress={() => navigation.navigate('ArtworkDetail', { artworkId: item.id })}
            >
              <Image
                source={{ uri: item.thumbnailImage }}
                style={styles.tileImg}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={350}
                placeholder={{ blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj' }}
              />
              {/* Overlay info */}
              <View style={styles.tileOverlay}>
                <StatusBadge status={item.status} small />
              </View>
              <View style={styles.tileBody}>
                <Text style={styles.tileStyle}>{item.style}</Text>
                <Text style={styles.tileTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.tileMaterial}>{item.material}</Text>
                {item.price ? (
                  <Text style={styles.tilePrice}>
                    ₹{item.price.toLocaleString('en-IN')}
                  </Text>
                ) : (
                  <Text style={styles.tilePoa}>Price on request</Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1, backgroundColor: Colors.cream },
  center:     { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  filterRow:  {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: 8,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterChip: {
    borderRadius: Radius.round,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: Colors.white,
  },
  filterChipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  filterTxt:        { ...Typography.label, fontSize: 11, color: Colors.muted },
  filterTxtActive:  { color: Colors.white },
  list:       { padding: Spacing.md },
  tile: {
    width:          TILE,
    backgroundColor: Colors.white,
    borderRadius:   Radius.lg,
    overflow:       'hidden',
    ...Shadow.card,
  },
  tileImg:     { width: TILE, height: TILE * 1.15 },
  tileOverlay: {
    position: 'absolute',
    top: 8, right: 8,
  },
  tileBody:    { padding: Spacing.sm },
  tileStyle:   { ...Typography.label, color: Colors.gold, fontSize: 9 },
  tileTitle:   { ...Typography.sans14, fontSize: 13, marginTop: 3 },
  tileMaterial:{ ...Typography.caption, marginTop: 2 },
  tilePrice:   { ...Typography.caption, color: Colors.gold, fontWeight: '700', marginTop: 4, fontSize: 13 },
  tilePoa:     { ...Typography.caption, color: Colors.subtle, marginTop: 4 },
  loadingTxt:  { ...Typography.caption, marginTop: Spacing.sm },
  errorTxt:    { ...Typography.sans14, color: Colors.error },
  emptyTxt:    { ...Typography.caption, marginTop: 8 },
  retryBtn:    { marginTop: Spacing.md, backgroundColor: Colors.gold, borderRadius: Radius.md, paddingHorizontal: 24, paddingVertical: 10 },
  retryTxt:    { color: Colors.white, fontWeight: '700' },
});

