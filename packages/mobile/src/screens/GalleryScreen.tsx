import React, { useState } from "react";
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, TextInput, ActivityIndicator, RefreshControl,
} from "react-native";
import FastImage from "react-native-fast-image";
import { useQuery } from "@tanstack/react-query";
import { artworksApi } from "../api";
import { Colors, Spacing, Radius, Shadow } from "../theme";
import type { Artwork } from "@shilpakala/shared";

const FILTERS = ["all","available","wip","sold"] as const;

export default function GalleryScreen({ navigation }: any) {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["artworks", filter],
    queryFn: () => artworksApi.getAll(filter !== "all" ? { status: filter } : {}),
  });

  const artworks: Artwork[] = (data?.data as any)?.data ?? [];
  const filtered = search
    ? artworks.filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.style.toLowerCase().includes(search.toLowerCase()))
    : artworks;

  const renderItem = ({ item }: { item: Artwork }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("ArtworkDetail", { artworkId: item.id })} activeOpacity={0.85}>
      <FastImage
        source={{ uri: item.thumbnailImage, priority: FastImage.priority.normal }}
        style={styles.cardImage}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.cardSub}>{item.style} · {item.material}</Text>
        <View style={styles.cardFooter}>
          <View style={[styles.badge, styles[`badge_${item.status}` as "badge_available"]]}>
            <Text style={[styles.badgeText, styles[`badgeText_${item.status}` as "badgeText_available"]]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
          {item.price && (
            <Text style={styles.price}>₹{item.price.toLocaleString("en-IN")}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search artworks…"
          placeholderTextColor={Colors.muted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity key={f} style={[styles.filterBtn, filter===f && styles.filterBtnActive]} onPress={() => setFilter(f)}>
            <Text style={[styles.filterText, filter===f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading && <ActivityIndicator color={Colors.gold} style={{ marginTop: 40 }} size="large" />}

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={Colors.gold} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!isLoading ? <Text style={styles.empty}>No artworks found.</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex:1, backgroundColor: Colors.cream },
  searchRow:   { paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  searchInput: { backgroundColor: Colors.white, borderWidth:1, borderColor: Colors.border, borderRadius: Radius.md, padding: Spacing.sm+2, paddingHorizontal: Spacing.md, fontSize: 14, color: Colors.ink },
  filterRow:   { flexDirection:"row", paddingHorizontal:Spacing.md, gap:8, marginBottom:Spacing.sm },
  filterBtn:   { paddingHorizontal:Spacing.md, paddingVertical:6, borderRadius:Radius.round, borderWidth:1, borderColor:Colors.border, backgroundColor:Colors.white },
  filterBtnActive:  { backgroundColor:Colors.ink, borderColor:Colors.ink },
  filterText:       { fontSize:12, color:Colors.muted, fontWeight:"500" },
  filterTextActive: { color:Colors.cream },
  list:        { paddingHorizontal: Spacing.sm, paddingBottom: Spacing.xl },
  row:         { gap: Spacing.sm, paddingHorizontal: Spacing.sm/2 },
  card:        { flex:1, backgroundColor:Colors.white, borderRadius:Radius.md, marginBottom:Spacing.sm, overflow:"hidden", ...Shadow.card },
  cardImage:   { width:"100%", height:170 },
  cardBody:    { padding:Spacing.sm+2 },
  cardTitle:   { fontFamily:"Georgia", fontSize:13, color:Colors.ink, lineHeight:18 },
  cardSub:     { fontSize:11, color:Colors.muted, marginTop:3 },
  cardFooter:  { flexDirection:"row", alignItems:"center", justifyContent:"space-between", marginTop:8 },
  badge:             { borderRadius:Radius.round, paddingHorizontal:8, paddingVertical:2 },
  badge_available:   { backgroundColor:"#ECFDF5" },
  badge_sold:        { backgroundColor:"#FEF2F2" },
  badge_wip:         { backgroundColor:"#FFFBEB" },
  badgeText:         { fontSize:9, fontWeight:"700", textTransform:"uppercase", letterSpacing:0.5 },
  badgeText_available: { color:"#059669" },
  badgeText_sold:      { color:"#DC2626" },
  badgeText_wip:       { color:"#D97706" },
  price:       { fontSize:12, color:Colors.gold, fontWeight:"700" },
  empty:       { textAlign:"center", paddingTop:60, color:Colors.muted, fontSize:14 },
});

