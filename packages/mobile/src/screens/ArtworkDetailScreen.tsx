import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Dimensions, FlatList,
} from 'react-native';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import { artworksApi, artistsApi, wipApi } from '../api';
import { Colors, Spacing, Radius, Shadow, Typography } from '../theme';
import StatusBadge from '../components/StatusBadge';
import ImageZoomModal from '../components/ImageZoomModal';
import InquiryModal from '../components/InquiryModal';

const { width: W } = Dimensions.get('window');

export default function ArtworkDetailScreen({ route, navigation }: any) {
  const { artworkId } = route.params;
  const [currentImg,   setCurrentImg]   = useState(0);
  const [zoomVisible,  setZoomVisible]  = useState(false);
  const [inquiryVisible, setInquiryVisible] = useState(false);

  const { data: artData, isLoading } = useQuery({
    queryKey: ['artwork', artworkId],
    queryFn:  () => artworksApi.getOne(artworkId),
  });
  const artwork: any = (artData?.data as any)?.data;

  const { data: artistData } = useQuery({
    queryKey:  ['artist', artwork?.artistId],
    queryFn:   () => artistsApi.getOne(artwork.artistId),
    enabled:   !!artwork?.artistId,
  });
  const artist: any = (artistData?.data as any)?.data;

  const { data: wipData } = useQuery({
    queryKey: ['wip', artworkId],
    queryFn:  () => wipApi.getByArtwork(artworkId),
    enabled:  !!artworkId,
  });
  const wipStages: any[] = (wipData?.data as any)?.data ?? [];

  if (isLoading || !artwork) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  const images: string[] = artwork.images?.length ? artwork.images : [artwork.thumbnailImage];

  return (
    <>
      <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>

        {/* Image carousel */}
        <View style={styles.carousel}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => String(i)}
            onMomentumScrollEnd={e => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / W);
              setCurrentImg(idx);
            }}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                activeOpacity={0.95}
                onPress={() => { setCurrentImg(index); setZoomVisible(true); }}
              >
                <Image
                  source={{ uri: item }}
                  style={styles.carouselImg}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                  transition={300}
                />
              </TouchableOpacity>
            )}
          />
          {/* Dots */}
          {images.length > 1 && (
            <View style={styles.dots}>
              {images.map((_, i) => (
                <View key={i} style={[styles.dot, i === currentImg && styles.dotActive]} />
              ))}
            </View>
          )}
          {/* Zoom hint */}
          <View style={styles.zoomHint}>
            <Text style={styles.zoomHintTxt}>🔍 Tap to zoom</Text>
          </View>
        </View>

        {/* Details card */}
        <View style={styles.card}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <StatusBadge status={artwork.status} />
              <Text style={styles.title}>{artwork.title}</Text>
              <Text style={styles.style}>{artwork.style} Tradition</Text>
            </View>
            {artwork.price && (
              <View style={styles.priceBox}>
                <Text style={styles.currency}>{artwork.currency}</Text>
                <Text style={styles.price}>
                  {artwork.price.toLocaleString('en-IN')}
                </Text>
              </View>
            )}
          </View>

          {/* Product ID */}
          <View style={styles.skuRow}>
            <Text style={styles.skuLabel}>Product ID</Text>
            <Text style={styles.skuValue}>{artwork.productId}</Text>
          </View>

          <Text style={styles.description}>{artwork.description}</Text>

          {/* Specs */}
          <View style={styles.specs}>
            <SpecRow label="Material"   value={artwork.material}   />
            {artwork.dimensions && <SpecRow label="Dimensions" value={artwork.dimensions} />}
            <SpecRow label="Style"      value={artwork.style}      />
          </View>
        </View>

        {/* WIP Timeline */}
        {wipStages.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>🔨 Creation Journey</Text>
            <Text style={styles.sectionSub}>See how this artwork was carved from stone</Text>
            <TouchableOpacity
              style={styles.wipBtn}
              onPress={() => navigation.navigate('WipTimeline', { artworkId, artworkTitle: artwork.title })}
              activeOpacity={0.85}
            >
              <Text style={styles.wipBtnTxt}>View Full Timeline ({wipStages.length} stages) →</Text>
            </TouchableOpacity>

            {/* Preview first stage */}
            <View style={styles.wipPreview}>
              <Image
                source={{ uri: wipStages[0].image }}
                style={styles.wipPreviewImg}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={300}
              />
              <View style={styles.wipPreviewBody}>
                <Text style={styles.wipStageLabel}>Stage 1 of {wipStages.length}</Text>
                <Text style={styles.wipStageTitle}>{wipStages[0].title}</Text>
                <Text style={styles.wipStageTxt} numberOfLines={2}>{wipStages[0].description}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Artist card */}
        {artist && (
          <TouchableOpacity
            style={styles.artistCard}
            activeOpacity={0.88}
            onPress={() => navigation.navigate('ArtistDetail', { artistId: artist.id })}
          >
            <Image
              source={{ uri: artist.profileImage }}
              style={styles.artistAvatar}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={300}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.artistCaption}>Crafted by</Text>
              <Text style={styles.artistName}>{artist.name}</Text>
              <Text style={styles.artistLocation}>📍 {artist.location}</Text>
            </View>
            <Text style={styles.artistArrow}>›</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Inquire button */}
      {artwork.status !== 'sold' && (
        <View style={styles.stickyBar}>
          <TouchableOpacity
            style={styles.inquireBtn}
            onPress={() => setInquiryVisible(true)}
            activeOpacity={0.88}
          >
            <Text style={styles.inquireTxt}>✉  Enquire — {artwork.productId}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modals */}
      <ImageZoomModal
        images={images}
        initial={currentImg}
        visible={zoomVisible}
        onClose={() => setZoomVisible(false)}
      />
      {artist && (
        <InquiryModal
          visible={inquiryVisible}
          onClose={() => setInquiryVisible(false)}
          artworkId={artwork.id}
          productId={artwork.productId}
          title={artwork.title}
          artistPhone={artist.whatsapp}
          price={artwork.price}
          currency={artwork.currency}
        />
      )}
    </>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.specRow}>
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={styles.specValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root:     { flex: 1, backgroundColor: Colors.cream },
  center:   { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.cream },
  carousel: { position: 'relative' },
  carouselImg: { width: W, height: W * 0.85 },
  dots: {
    position: 'absolute',
    bottom: 48,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { backgroundColor: Colors.white, width: 18 },
  zoomHint:  {
    position: 'absolute', bottom: 12, right: Spacing.md,
    backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: Radius.round,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  zoomHintTxt: { ...Typography.caption, color: Colors.white, fontSize: 11 },
  card: {
    backgroundColor: Colors.white,
    margin: Spacing.md,
    marginBottom: 0,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.card,
  },
  titleRow:     { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.sm },
  title:        { ...Typography.serif22, fontSize: 20, marginTop: 6 },
  style:        { ...Typography.label, color: Colors.gold, marginTop: 2 },
  priceBox:     { alignItems: 'flex-end' },
  currency:     { ...Typography.caption, color: Colors.muted },
  price:        { ...Typography.price },
  skuRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.goldPale,
    borderRadius: Radius.sm,
    padding: 8, marginBottom: Spacing.sm,
  },
  skuLabel:     { ...Typography.label, color: Colors.muted, fontSize: 9 },
  skuValue:     { ...Typography.label, color: Colors.gold },
  description:  { ...Typography.body, marginBottom: Spacing.md },
  specs:        { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.sm, gap: 6 },
  specRow:      { flexDirection: 'row', justifyContent: 'space-between' },
  specLabel:    { ...Typography.caption },
  specValue:    { ...Typography.sans14, fontSize: 13, fontWeight: '600' },
  sectionTitle: { ...Typography.serif18, marginBottom: 4 },
  sectionSub:   { ...Typography.caption, marginBottom: Spacing.sm },
  wipBtn: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.gold,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  wipBtnTxt:   { color: Colors.gold, fontWeight: '700', fontSize: 13 },
  wipPreview:  { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  wipPreviewImg:  { width: 80, height: 80, borderRadius: Radius.md },
  wipPreviewBody: { flex: 1 },
  wipStageLabel:  { ...Typography.label, color: Colors.muted, fontSize: 9 },
  wipStageTitle:  { ...Typography.sans14, fontWeight: '600', marginTop: 2 },
  wipStageTxt:    { ...Typography.caption, marginTop: 2 },
  artistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    margin: Spacing.md,
    marginBottom: 0,
    borderRadius: Radius.lg,
    padding: Spacing.sm,
    ...Shadow.card,
  },
  artistAvatar:   { width: 56, height: 56, borderRadius: 28 },
  artistCaption:  { ...Typography.caption },
  artistName:     { ...Typography.sans16, fontSize: 15 },
  artistLocation: { ...Typography.caption, marginTop: 2 },
  artistArrow:    { fontSize: 28, color: Colors.muted },
  stickyBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: Spacing.md,
    paddingBottom: 28,
  },
  inquireBtn: {
    backgroundColor: Colors.gold,
    borderRadius: Radius.md,
    paddingVertical: 15,
    alignItems: 'center',
    ...Shadow.strong,
  },
  inquireTxt: { color: Colors.white, fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
});

