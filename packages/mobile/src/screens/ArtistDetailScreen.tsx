import React from "react";
import { View, Text, ScrollView, StyleSheet, Linking, TouchableOpacity, ActivityIndicator } from "react-native";
import FastImage from "react-native-fast-image";
import { useQuery } from "@tanstack/react-query";
import { artistsApi, artworksApi } from "../api";
import { Colors, Spacing, Radius, Shadow } from "../theme";

export default function ArtistDetailScreen({ route, navigation }: any) {
  const { artistId } = route.params;
  const { data: artistRes, isLoading } = useQuery({ queryKey:["artist", artistId], queryFn:() => artistsApi.getById(artistId) });
  const { data: artworksRes } = useQuery({ queryKey:["artworks", "artist", artistId], queryFn:() => artworksApi.getAll({ artistId }) });

  const artist = (artistRes?.data as any)?.data;
  const artworks: any[] = (artworksRes?.data as any)?.data ?? [];

  if (isLoading || !artist) return <ActivityIndicator color={Colors.gold} style={{ flex:1 }} />;
  navigation.setOptions({ title: artist.name });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <FastImage source={{ uri: artist.profileImage || "" }} style={styles.heroImg} resizeMode={FastImage.resizeMode.cover} />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroName}>{artist.name}</Text>
          <Text style={styles.heroLocation}>{artist.location}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.tagRow}>
          <View style={styles.tag}><Text style={styles.tagTxt}>{artist.specialization}</Text></View>
          {artist.verified && <View style={[styles.tag, { borderColor:"#BFDBFE", backgroundColor:"#EFF6FF" }]}>
            <Text style={[styles.tagTxt, { color:"#2563EB" }]}>✓ Verified</Text>
          </View>}
        </View>
        <Text style={styles.bio}>{artist.bio}</Text>

        <TouchableOpacity style={styles.waBtn} onPress={() => Linking.openURL(`https://wa.me/${artist.whatsapp.replace(/\D/g,"")}`)}>
          <Text style={styles.waBtnTxt}>💬 Contact on WhatsApp</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Works by {artist.name.split(" ")[0]}</Text>
        <View style={styles.grid}>
          {artworks.map(art => (
            <TouchableOpacity key={art.id} style={styles.thumbCard} onPress={() => navigation.navigate("ArtworkDetail", { artworkId: art.id })} activeOpacity={0.85}>
              <FastImage source={{ uri: art.thumbnailImage }} style={styles.thumb} resizeMode={FastImage.resizeMode.cover} />
              <Text style={styles.thumbTitle} numberOfLines={2}>{art.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:   { flex:1, backgroundColor:Colors.cream },
  hero:        { height:240, position:"relative" },
  heroImg:     { ...StyleSheet.absoluteFillObject },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor:"rgba(0,0,0,0.45)", justifyContent:"flex-end", padding:Spacing.md },
  heroName:    { fontFamily:"Georgia", fontSize:24, color:Colors.white },
  heroLocation:{ fontSize:13, color:"rgba(255,255,255,0.75)", marginTop:2 },
  body:        { padding:Spacing.md },
  tagRow:      { flexDirection:"row", gap:8, marginBottom:Spacing.md },
  tag:         { backgroundColor:Colors.cream, borderWidth:1, borderColor:Colors.border, borderRadius:Radius.round, paddingHorizontal:10, paddingVertical:3 },
  tagTxt:      { fontSize:11, color:Colors.muted, fontWeight:"600" },
  bio:         { fontSize:14, color:Colors.ink, lineHeight:22 },
  waBtn:       { backgroundColor:Colors.whatsapp, borderRadius:Radius.md, padding:14, alignItems:"center", marginTop:Spacing.md },
  waBtnTxt:    { color:Colors.white, fontWeight:"700", fontSize:15 },
  sectionTitle:{ fontFamily:"Georgia", fontSize:18, color:Colors.ink, marginTop:24, marginBottom:14 },
  grid:        { flexDirection:"row", flexWrap:"wrap", gap:10 },
  thumbCard:   { width:"47%", backgroundColor:Colors.white, borderRadius:Radius.sm, overflow:"hidden", ...Shadow.card },
  thumb:       { width:"100%", height:120 },
  thumbTitle:  { padding:8, fontSize:12, fontFamily:"Georgia", color:Colors.ink },
});

