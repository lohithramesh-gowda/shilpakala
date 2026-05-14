import React, { useState } from "react";
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, ActivityIndicator, Modal,
} from "react-native";
import FastImage from "react-native-fast-image";
import ImageViewer from "react-native-image-zoom-viewer";
import { useQuery } from "@tanstack/react-query";
import { heritageApi } from "../api";
import { Colors, Spacing, Radius } from "../theme";

export default function HeritageDetailScreen({ route, navigation }: any) {
  const { storyId } = route.params;
  const [zoomIdx, setZoomIdx] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["heritage", storyId],
    queryFn:  () => heritageApi.getById(storyId),
  });
  const story = (data?.data as any)?.data;

  if (isLoading || !story) return <ActivityIndicator color={Colors.gold} style={{ flex: 1 }} />;
  navigation.setOptions({ title: story.style });

  const imageUrls = story.gallery.map((url: string) => ({ url }));

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Cover */}
        <FastImage source={{ uri: story.coverImage }} style={styles.cover} resizeMode={FastImage.resizeMode.cover} />

        {/* Header band */}
        <View style={styles.headerBand}>
          <View style={styles.styleBadge}><Text style={styles.styleBadgeTxt}>{story.style}</Text></View>
          <Text style={styles.period}>{story.period}</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>{story.title}</Text>
          <Text style={styles.subtitle}>{story.subtitle}</Text>
          <View style={styles.regionRow}>
            <Text style={styles.region}>📍 {story.region}</Text>
          </View>

          <View style={styles.divider} />

          {/* Full content */}
          <Text style={styles.content}>{story.content}</Text>

          <View style={styles.divider} />

          {/* Key Features */}
          <Text style={styles.sectionTitle}>✦ Key Features</Text>
          {story.keyFeatures.map((f: string, i: number) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureDot} />
              <Text style={styles.featureTxt}>{f}</Text>
            </View>
          ))}

          {/* Gallery */}
          {story.gallery.length > 0 && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Gallery</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryRow}>
                {story.gallery.map((img: string, i: number) => (
                  <TouchableOpacity key={i} onPress={() => setZoomIdx(i)} activeOpacity={0.85}>
                    <FastImage source={{ uri: img }} style={styles.galleryThumb} resizeMode={FastImage.resizeMode.cover} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}
        </View>
      </ScrollView>

      {/* Zoom modal */}
      {zoomIdx !== null && (
        <Modal visible animationType="fade" transparent>
          <ImageViewer
            imageUrls={imageUrls}
            index={zoomIdx}
            enableSwipeDown
            onSwipeDown={() => setZoomIdx(null)}
            renderHeader={() => (
              <TouchableOpacity style={styles.closeBtn} onPress={() => setZoomIdx(null)}>
                <Text style={{ color: "#fff", fontSize: 13 }}>✕ Close</Text>
              </TouchableOpacity>
            )}
          />
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: Colors.cream },
  cover:         { width: "100%", height: 260 },
  headerBand:    { flexDirection: "row", alignItems: "center", gap: Spacing.sm, padding: Spacing.md, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  styleBadge:    { backgroundColor: "#FEF3C7", borderRadius: Radius.round, paddingHorizontal: 10, paddingVertical: 3 },
  styleBadgeTxt: { fontSize: 10, color: "#92400E", fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  period:        { fontSize: 12, color: Colors.muted },
  body:          { padding: Spacing.md },
  title:         { fontFamily: "Georgia", fontSize: 24, color: Colors.ink, lineHeight: 32 },
  subtitle:      { fontFamily: "Georgia", fontSize: 14, color: Colors.muted, fontStyle: "italic", marginTop: 6 },
  regionRow:     { flexDirection: "row", marginTop: 10 },
  region:        { fontSize: 12, color: Colors.muted },
  divider:       { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },
  content:       { fontSize: 14, color: Colors.ink, lineHeight: 24, whiteSpace: "pre-line" } as any,
  sectionTitle:  { fontFamily: "Georgia", fontSize: 17, color: Colors.ink, marginBottom: Spacing.sm },
  featureRow:    { flexDirection: "row", alignItems: "flex-start", gap: Spacing.sm, marginBottom: 8 },
  featureDot:    { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.gold, marginTop: 7 },
  featureTxt:    { flex: 1, fontSize: 13, color: Colors.ink, lineHeight: 20 },
  galleryRow:    { gap: Spacing.sm, paddingBottom: Spacing.sm },
  galleryThumb:  { width: 160, height: 120, borderRadius: Radius.sm },
  closeBtn:      { position: "absolute", top: 40, right: 20, zIndex: 10, backgroundColor: "rgba(0,0,0,0.5)", borderRadius: Radius.sm, padding: 8 },
});

