import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import FastImage from "react-native-fast-image";
import { useQuery } from "@tanstack/react-query";
import { artistsApi } from "../api";
import { Colors, Spacing, Radius, Shadow } from "../theme";

export default function ArtistsScreen({ navigation }: any) {
  const { data, isLoading } = useQuery({ queryKey:["artists"], queryFn:() => artistsApi.getAll() });
  const artists: any[] = (data?.data as any)?.data ?? [];

  if (isLoading) return <ActivityIndicator color={Colors.gold} style={{ flex:1 }} />;

  return (
    <FlatList
      data={artists}
      keyExtractor={a => a.id}
      contentContainerStyle={{ padding: Spacing.md, gap: Spacing.md }}
      style={{ backgroundColor: Colors.cream }}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("ArtistDetail", { artistId: item.id })} activeOpacity={0.85}>
          <FastImage source={{ uri: item.profileImage || "" }} style={styles.avatar} resizeMode={FastImage.resizeMode.cover} />
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.location}>{item.location}</Text>
            <View style={styles.tags}>
              <View style={styles.tag}><Text style={styles.tagTxt}>{item.specialization}</Text></View>
              {item.verified && <View style={[styles.tag, styles.tagVerified]}><Text style={[styles.tagTxt, { color:"#2563EB" }]}>✓ Verified</Text></View>}
            </View>
            <Text style={styles.bio} numberOfLines={2}>{item.bio}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card:     { backgroundColor:Colors.white, borderRadius:Radius.md, padding:Spacing.md, flexDirection:"row", gap:Spacing.md, ...Shadow.card },
  avatar:   { width:70, height:70, borderRadius:35 },
  info:     { flex:1 },
  name:     { fontFamily:"Georgia", fontSize:16, color:Colors.ink },
  location: { fontSize:12, color:Colors.muted, marginTop:2 },
  tags:     { flexDirection:"row", gap:6, marginTop:6 },
  tag:      { backgroundColor:Colors.cream, borderWidth:1, borderColor:Colors.border, borderRadius:Radius.round, paddingHorizontal:8, paddingVertical:2 },
  tagVerified: { borderColor:"#BFDBFE", backgroundColor:"#EFF6FF" },
  tagTxt:   { fontSize:10, color:Colors.muted, fontWeight:"600" },
  bio:      { fontSize:12, color:Colors.muted, lineHeight:17, marginTop:8 },
});

