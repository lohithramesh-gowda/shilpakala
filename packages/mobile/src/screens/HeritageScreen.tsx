import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import FastImage from "react-native-fast-image";
import { useQuery } from "@tanstack/react-query";
import { heritageApi } from "../api";
import { Colors, Spacing, Radius, Shadow } from "../theme";

export default function HeritageScreen({ navigation }: any) {
  const { data, isLoading } = useQuery({ queryKey:["heritage"], queryFn:() => heritageApi.getAll() });
  const stories: any[] = (data?.data as any)?.data ?? [];

  if (isLoading) return <ActivityIndicator color={Colors.gold} style={{ flex:1 }} />;

  return (
    <FlatList
      data={stories}
      keyExtractor={s => s.id}
      contentContainerStyle={{ padding:Spacing.md, gap:Spacing.lg }}
      style={{ backgroundColor:Colors.cream }}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} activeOpacity={0.88} onPress={() => navigation.navigate("HeritageDetail", { storyId: item.id })}>
          <FastImage source={{ uri: item.coverImage }} style={styles.cover} resizeMode={FastImage.resizeMode.cover} />
          <View style={styles.overlay}>
            <View style={styles.badge}><Text style={styles.badgeTxt}>{item.style}</Text></View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.period}>{item.period}</Text>
          </View>
          <View style={styles.body}>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
            <Text style={styles.region}>📍 {item.region}</Text>
            <View style={styles.features}>
              {item.keyFeatures.slice(0,3).map((f: string, i: number) => (
                <View key={i} style={styles.featureTag}><Text style={styles.featureTxt}>✦ {f}</Text></View>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card:       { backgroundColor:Colors.white, borderRadius:Radius.lg, overflow:"hidden", ...Shadow.card },
  cover:      { width:"100%", height:200 },
  overlay:    { position:"absolute", top:0, left:0, right:0, height:200, backgroundColor:"rgba(0,0,0,0.38)", padding:Spacing.md, justifyContent:"flex-end" },
  badge:      { alignSelf:"flex-start", backgroundColor:"rgba(184,134,11,0.9)", borderRadius:Radius.round, paddingHorizontal:10, paddingVertical:3, marginBottom:6 },
  badgeTxt:   { fontSize:10, color:Colors.white, fontWeight:"700", textTransform:"uppercase", letterSpacing:0.5 },
  title:      { fontFamily:"Georgia", fontSize:20, color:Colors.white },
  period:     { fontSize:11, color:"rgba(255,255,255,0.75)", marginTop:2 },
  body:       { padding:Spacing.md },
  subtitle:   { fontFamily:"Georgia", fontSize:13, color:Colors.muted, fontStyle:"italic", marginBottom:8 },
  region:     { fontSize:12, color:Colors.muted },
  features:   { flexDirection:"row", flexWrap:"wrap", gap:6, marginTop:10 },
  featureTag: { backgroundColor:Colors.cream, borderWidth:1, borderColor:Colors.border, borderRadius:Radius.sm, paddingHorizontal:8, paddingVertical:3 },
  featureTxt: { fontSize:10, color:Colors.muted },
});

