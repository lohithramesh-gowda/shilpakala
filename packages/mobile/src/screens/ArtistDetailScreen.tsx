import React from 'react';
import {
  View, Text, ScrollView, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Dimensions, Linking,
} from 'react-native';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import { artistsApi, artworksApi } from '../api';
import { Colors, Spacing, Radius, Shadow, Typography } from '../theme';
import StatusBadge from '../components/StatusBadge';

const { width: W } = Dimensions.get('window');
const TILE = (W - Spacing.md * 2 - Spacing.sm) / 2;

export default function ArtistDetailScreen({ route, navigation }: any) {
  const { artistId } = route.params;

  const { data: artistData, isLoading: loadingArtist } = useQuery({
    queryKey: ['artist', artistId],
    queryFn:  () => artistsApi.getOne(artistId),
  });
  const { data: worksData, isLoading: loadingWorks } = useQuery({
    queryKey: ['artworks', { artistId }],
    queryFn:  () => artworksApi.getAll({ artistId }),
  });

  const artist:   any   = (artistData?.data as any)?.data;
  const artworks: any[] = (worksData?.data as any)?.data ?? [];

  if (loadingArtist || !artist) {
    return <View style={styles.center}><ActivityIndicator size="large" color={Colors.gold} /></View>;
  }

  const callArtist   = () => Linking.openURL(`tel:${artist.phone}`);
  const whatsApp     = () => {
    const msg = encodeURIComponent(`Hello ${artist.name}, I found you on Shilpa-Kala Showcase and would like to inquire about your works.`);
    Linking.openURL(`https://wa.me/${artist.whatsapp.replace(/[^0-9]/g, '')}?text=${msg}`);
  };

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={styles.hero}>
        <Image
          source={{ uri: artist.profileImage }}
          style={styles.heroImg}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={400}
        />
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          {artist.verified && (
            <View style={styles.verifiedBadge}><Text style={styles.verifiedTxt}>✓ Verified Master Shilpi</Text></View>
          )}
          <Text style={styles.artistName}>{artist.name}</Text>
          <Text style={styles.specialization}>{artist.specialization} Tradition</Text>
          <Text style={styles.location}>📍 {artist.location}</Text>
        </View>
      </View>

      {/* Bio card */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About the Artist</Text>
        <Text style={styles.bio}>{artist.bio}</Text>
      </View>

      {/* Contact row */}
      <View style={styles.contactRow}>
        <TouchableOpacity style={[styles.contactBtn, { backgroundColor: Colors.ink }]} onPress={callArtist}>
          <Text style={styles.contactTxt}>📞  Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.contactBtn, { backgroundColor: '#25D366' }]} onPress={whatsApp}>
          <Text style={styles.contactTxt}>💬  WhatsApp</Text>
        </TouchableOpacity>
      </View>

      {/* Artworks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Artworks by {artist.name}</Text>
        {loadingWorks
          ? <ActivityIndicator color={Colors.gold} style={{ marginTop: Spacing.md }} />
          : (
            <FlatList
              data={artworks}
              numColumns={2}
              scrollEnabled={false}
              keyExtractor={a => a.id}
              columnWrapperStyle={{ gap: Spacing.sm }}
              ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
              ListEmptyComponent={<Text style={styles.emptyTxt}>No artworks yet</Text>}
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
                    transition={300}
                  />
                  <StatusBadge status={item.status} small />
                  <View style={styles.tileBody}>
                    <Text style={styles.tileTitle} numberOfLines={2}>{item.title}</Text>
                    {item.price && (
                      <Text style={styles.tilePrice}>
                        {item.currency} {item.price.toLocaleString('en-IN')}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              )}
            />
          )
        }
      </View>

      <View style={{ height: Spacing.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: Colors.cream },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.cream },
  hero:   { height: 320, position: 'relative' },
  heroImg: { ...StyleSheet.absoluteFillObject },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  heroContent: {
    position: 'absolute', bottom: Spacing.lg, left: Spacing.md, right: Spacing.md,
  },
  verifiedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(30,132,73,0.9)',
    borderRadius: Radius.round,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 8,
  },
  verifiedTxt:    { fontSize: 10, color: Colors.white, fontWeight: '700' },
  artistName:     { ...Typography.serif28, color: Colors.white },
  specialization: { ...Typography.label, color: Colors.goldLight, marginTop: 2 },
  location:       { ...Typography.caption, color: 'rgba(255,255,255,0.75)', marginTop: 6 },
  section: {
    backgroundColor: Colors.white,
    margin: Spacing.md,
    marginBottom: 0,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.card,
  },
  sectionTitle: { ...Typography.serif18, marginBottom: Spacing.sm },
  bio:          { ...Typography.body, color: Colors.dark },
  contactRow:   { flexDirection: 'row', gap: Spacing.sm, marginHorizontal: Spacing.md, marginTop: Spacing.md },
  contactBtn:   { flex: 1, borderRadius: Radius.md, paddingVertical: 13, alignItems: 'center', ...Shadow.card },
  contactTxt:   { color: Colors.white, fontWeight: '700', fontSize: 14 },
  tile: {
    width: TILE,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    overflow: 'hidden',
    ...Shadow.card,
  },
  tileImg:    { width: TILE, height: TILE },
  tileBody:   { padding: Spacing.sm, paddingTop: 4 },
  tileTitle:  { ...Typography.sans14, fontSize: 12, marginTop: 4 },
  tilePrice:  { ...Typography.caption, color: Colors.gold, fontWeight: '700', marginTop: 2 },
  emptyTxt:   { ...Typography.caption, textAlign: 'center', marginTop: Spacing.md },
});

