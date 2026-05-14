import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Dimensions, FlatList,
} from 'react-native';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import { heritageApi } from '../api';
import { Colors, Spacing, Radius, Shadow, Typography } from '../theme';
import ImageZoomModal from '../components/ImageZoomModal';

const { width: W } = Dimensions.get('window');
const GALLERY_W = (W - Spacing.md * 2 - Spacing.sm * 2) / 3;

export default function HeritageDetailScreen({ route, navigation }: any) {
  const { storyId } = route.params;
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomIndex,   setZoomIndex]   = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['heritage', storyId],
    queryFn:  () => heritageApi.getOne(storyId),
  });

  const story: any = (data?.data as any)?.data;

  React.useLayoutEffect(() => {
    if (story) navigation.setOptions({ title: story.style + ' Heritage' });
  }, [story]);

  if (isLoading || !story) {
    return <View style={styles.center}><ActivityIndicator size="large" color={Colors.gold} /></View>;
  }

  const gallery: string[] = story.gallery ?? [];

  return (
    <>
      <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Image
            source={{ uri: story.coverImage }}
            style={styles.heroImg}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={500}
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={styles.styleBadge}>
              <Text style={styles.styleTxt}>{story.style}</Text>
            </View>
            <Text style={styles.heroTitle}>{story.title}</Text>
            <Text style={styles.heroSub}>{story.subtitle}</Text>
            <View style={styles.metaRow}>
              <View style={styles.metaChip}>
                <Text style={styles.metaLabel}>Period</Text>
                <Text style={styles.metaValue}>{story.period}</Text>
              </View>
              <View style={styles.metaChip}>
                <Text style={styles.metaLabel}>Region</Text>
                <Text style={styles.metaValue} numberOfLines={2}>{story.region}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Key Features */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Defining Features</Text>
          <View style={styles.featureGrid}>
            {story.keyFeatures.map((f: string, i: number) => (
              <View key={i} style={styles.featureItem}>
                <View style={styles.featureDot} />
                <Text style={styles.featureTxt}>{f}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Full story content */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>The Heritage Story</Text>
          {story.content.split('\n\n').map((para: string, i: number) => (
            <Text key={i} style={[styles.para, i > 0 && { marginTop: Spacing.md }]}>
              {para.trim()}
            </Text>
          ))}
        </View>

        {/* Gallery */}
        {gallery.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Gallery</Text>
            <Text style={styles.gallerySub}>Tap any image to zoom</Text>
            <View style={styles.galleryGrid}>
              {gallery.map((img: string, i: number) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => { setZoomIndex(i); setZoomVisible(true); }}
                  activeOpacity={0.85}
                >
                  <Image
                    source={{ uri: img }}
                    style={styles.galleryImg}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    transition={300}
                    placeholder={{ blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj' }}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      <ImageZoomModal
        images={gallery}
        initial={zoomIndex}
        visible={zoomVisible}
        onClose={() => setZoomVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: Colors.cream },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.cream },
  hero:   { height: 380, position: 'relative' },
  heroImg:{ ...StyleSheet.absoluteFillObject },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  heroContent: {
    position: 'absolute', bottom: Spacing.lg, left: Spacing.md, right: Spacing.md,
  },
  styleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(184,134,11,0.9)',
    borderRadius: Radius.round,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: Spacing.sm,
  },
  styleTxt:   { ...Typography.label, color: Colors.white },
  heroTitle:  { ...Typography.serif28, color: Colors.white, fontSize: 28 },
  heroSub:    { ...Typography.body, color: 'rgba(255,255,255,0.75)', fontStyle: 'italic', fontSize: 14, marginTop: 6, lineHeight: 20 },
  metaRow:    { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  metaChip: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  metaLabel:   { ...Typography.label, color: 'rgba(255,255,255,0.6)', fontSize: 9 },
  metaValue:   { ...Typography.caption, color: Colors.white, marginTop: 2, fontSize: 12 },
  card: {
    backgroundColor: Colors.white,
    margin: Spacing.md,
    marginBottom: 0,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.card,
  },
  cardTitle:   { ...Typography.serif18, marginBottom: Spacing.sm },
  featureGrid: { gap: Spacing.sm },
  featureItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  featureDot: {
    width: 8, height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gold,
    marginTop: 6,
  },
  featureTxt:  { ...Typography.body, flex: 1, fontSize: 14 },
  para:        { ...Typography.body, lineHeight: 26 },
  gallerySub:  { ...Typography.caption, marginBottom: Spacing.sm },
  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  galleryImg: {
    width: GALLERY_W, height: GALLERY_W,
    borderRadius: Radius.md,
  },
});

