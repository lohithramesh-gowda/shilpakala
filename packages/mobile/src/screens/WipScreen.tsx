import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import FastImage from "react-native-fast-image";
import { useQuery } from "@tanstack/react-query";
import { artworksApi, wipApi } from "../api";
import { Colors, Spacing, Radius } from "../theme";

const STAGE_COLORS = ["","#92400E","#B45309","#D97706","#65A30D","#059669"];

export default function WipScreen({ navigation }: any) {
  const [selectedId, setSelectedId] = useState<string>("");

  const { data: artRes } = useQuery({ queryKey:["artworks"], queryFn:() => artworksApi.getAll() });
  const artworks: any[] = (artRes?.data as any)?.data ?? [];
  const wipArtworks = artworks.filter(a => a.status === "wip");

  const activeId = selectedId || wipArtworks[0]?.id || "";

  const { data: wipRes, isLoading } = useQuery({
    queryKey: ["wip", activeId],
    queryFn:  () => wipApi.getAll(activeId),
    enabled:  !!activeId,
  });
  const stages: any[] = ((wipRes?.data as any)?.data ?? []).sort((a: any,b: any) => a.stage - b.stage);

  const activeArtwork = artworks.find(a => a.id === activeId);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorRow}>
        {wipArtworks.map(a => (
          <TouchableOpacity key={a.id} style={[styles.selectorBtn, activeId === a.id && styles.selectorBtnActive]} onPress={() => setSelectedId(a.id)}>
            <Text style={[styles.selectorTxt, activeId === a.id && styles.selectorTxtActive]} numberOfLines={2}>{a.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {activeArtwork && (
        <View style={styles.artworkBanner}>
          <FastImage source={{ uri: activeArtwork.thumbnailImage }} style={styles.bannerImg} resizeMode={FastImage.resizeMode.cover} />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>{activeArtwork.title}</Text>
            <Text style={styles.bannerMeta}>{activeArtwork.style} · {activeArtwork.material}</Text>
          </View>
        </View>
      )}

      {isLoading && <ActivityIndicator color={Colors.gold} style={{ marginTop:40 }} />}

      <View style={styles.body}>
        {stages.length === 0 && !isLoading && (
          <Text style={styles.empty}>No WIP stages recorded yet.</Text>
        )}
        {stages.map((stage, idx) => (
          <View key={stage.id} style={styles.timelineItem}>
            <View style={styles.dotCol}>
              <View style={[styles.dot, { backgroundColor: STAGE_COLORS[stage.stage] || Colors.gold }]} />
              {idx < stages.length - 1 && <View style={styles.line} />}
            </View>
            <View style={styles.content}>
              <View style={[styles.stagePill, { backgroundColor: (STAGE_COLORS[stage.stage]||Colors.gold)+"22" }]}>
                <Text style={[styles.stagePillTxt, { color: STAGE_COLORS[stage.stage] || Colors.gold }]}>Stage {stage.stage} · {stage.stageLabel}</Text>
              </View>
              <Text style={styles.stageTitle}>{stage.title}</Text>
              <Text style={styles.stageDesc}>{stage.description}</Text>
              <TouchableOpacity onPress={() => navigation.navigate("GalleryTab", { screen:"ArtworkDetail", params:{ artworkId: stage.artworkId } })}>
                <FastImage source={{ uri: stage.image }} style={styles.stageImg} resizeMode={FastImage.resizeMode.cover} />
              </TouchableOpacity>
              <Text style={styles.stageDate}>{new Date(stage.createdAt).toLocaleDateString("en-IN",{ day:"2-digit",month:"short",year:"numeric" })}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:        { flex:1, backgroundColor:Colors.cream },
  selectorRow:      { padding:Spacing.md, gap:8 },
  selectorBtn:      { paddingHorizontal:Spacing.md, paddingVertical:8, borderRadius:Radius.md, borderWidth:1, borderColor:Colors.border, backgroundColor:Colors.white, maxWidth:160 },
  selectorBtnActive:{ backgroundColor:Colors.ink, borderColor:Colors.ink },
  selectorTxt:      { fontSize:12, color:Colors.muted, textAlign:"center" },
  selectorTxtActive:{ color:Colors.cream },
  artworkBanner:    { height:180, marginHorizontal:Spacing.md, borderRadius:Radius.md, overflow:"hidden", marginBottom:Spacing.md },
  bannerImg:        { ...StyleSheet.absoluteFillObject },
  bannerOverlay:    { ...StyleSheet.absoluteFillObject, backgroundColor:"rgba(0,0,0,0.4)", padding:Spacing.md, justifyContent:"flex-end" },
  bannerTitle:      { fontFamily:"Georgia", fontSize:18, color:Colors.white },
  bannerMeta:       { fontSize:12, color:"rgba(255,255,255,0.75)", marginTop:3 },
  body:             { paddingHorizontal:Spacing.md, paddingBottom:Spacing.xl },
  timelineItem:     { flexDirection:"row", gap:Spacing.sm, marginBottom:Spacing.lg },
  dotCol:           { alignItems:"center", width:20 },
  dot:              { width:14, height:14, borderRadius:7, marginTop:3 },
  line:             { flex:1, width:2, backgroundColor:Colors.border, marginTop:4 },
  content:          { flex:1, paddingBottom:Spacing.sm },
  stagePill:        { alignSelf:"flex-start", borderRadius:Radius.round, paddingHorizontal:10, paddingVertical:3, marginBottom:6 },
  stagePillTxt:     { fontSize:10, fontWeight:"700", textTransform:"uppercase", letterSpacing:0.5 },
  stageTitle:       { fontFamily:"Georgia", fontSize:15, color:Colors.ink },
  stageDesc:        { fontSize:13, color:Colors.muted, lineHeight:19, marginTop:4 },
  stageImg:         { width:"100%", height:180, borderRadius:Radius.sm, marginTop:Spacing.sm },
  stageDate:        { fontSize:11, color:Colors.muted, marginTop:6 },
  empty:            { textAlign:"center", color:Colors.muted, paddingTop:40, fontSize:14 },
});

