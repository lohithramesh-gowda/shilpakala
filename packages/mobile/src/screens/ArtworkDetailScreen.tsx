import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Linking, Modal, TextInput, Alert, ActivityIndicator,
} from "react-native";
import FastImage from "react-native-fast-image";
import ImageViewer from "react-native-image-zoom-viewer";
import { useQuery, useMutation } from "@tanstack/react-query";
import { artworksApi, artistsApi, wipApi, inquiriesApi } from "../api";
import { Colors, Spacing, Radius, Shadow } from "../theme";

export default function ArtworkDetailScreen({ route, navigation }: any) {
  const { artworkId } = route.params;
  const [zoomIdx, setZoomIdx]     = useState<number | null>(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [form, setForm] = useState({ buyerName:"", buyerEmail:"", message:"" });

  const { data: artRes, isLoading } = useQuery({ queryKey:["artwork", artworkId], queryFn:() => artworksApi.getById(artworkId) });
  const artwork = (artRes?.data as any)?.data;

  const { data: artistRes } = useQuery({
    queryKey: ["artist", artwork?.artistId],
    queryFn: () => artistsApi.getById(artwork.artistId),
    enabled: !!artwork?.artistId,
  });
  const artist = (artistRes?.data as any)?.data;

  const { data: wipRes } = useQuery({
    queryKey: ["wip", artworkId],
    queryFn: () => wipApi.getAll(artworkId),
    enabled: !!artworkId,
  });
  const wipStages: any[] = (wipRes?.data as any)?.data ?? [];

  const inquiryMutation = useMutation({
    mutationFn: (payload: any) => inquiriesApi.create(payload),
    onSuccess: (res) => {
      const { whatsappUrl } = (res.data as any).data;
      setEnquiryOpen(false);
      Alert.alert("Inquiry Sent!", "Open WhatsApp to contact the artist?", [
        { text: "Open WhatsApp", onPress: () => Linking.openURL(whatsappUrl) },
        { text: "Later", style: "cancel" },
      ]);
    },
    onError: () => Alert.alert("Error", "Could not submit inquiry. Please try again."),
  });

  const handleEnquire = () => {
    if (!form.buyerName || !form.buyerEmail) { Alert.alert("Please fill in your name and email."); return; }
    inquiryMutation.mutate({ artworkId, ...form });
  };

  const openWhatsApp = () => {
    if (!artist) return;
    const msg = encodeURIComponent(`🙏 Hello ${artist.name},\n\nI am interested in:\n*${artwork.title}*\nProduct ID: ${artwork.productId}\n\nPlease share more details.`);
    Linking.openURL(`https://wa.me/${artist.whatsapp.replace(/\D/g,"")}?text=${msg}`);
  };

  if (isLoading || !artwork) return <ActivityIndicator color={Colors.gold} style={{ flex:1 }} />;

  navigation.setOptions({ title: artwork.title });

  const imageUrls = artwork.images.map((uri: string) => ({ url: uri }));

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <TouchableOpacity activeOpacity={0.9} onPress={() => setZoomIdx(0)}>
          <FastImage source={{ uri: artwork.thumbnailImage, priority: FastImage.priority.high }} style={styles.hero} resizeMode={FastImage.resizeMode.cover} />
          <View style={styles.zoomHint}><Text style={styles.zoomHintText}>🔍 Tap to zoom</Text></View>
        </TouchableOpacity>

        {/* Image strip */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageStrip} contentContainerStyle={{ gap:8, paddingHorizontal:Spacing.md }}>
          {artwork.images.map((img: string, i: number) => (
            <TouchableOpacity key={i} onPress={() => setZoomIdx(i)}>
              <FastImage source={{ uri: img, priority: FastImage.priority.low }} style={styles.stripThumb} resizeMode={FastImage.resizeMode.cover} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.body}>
          {/* Title & badges */}
          <View style={styles.titleRow}>
            <View style={[styles.badge, styles[`badge_${artwork.status}` as "badge_available"]]}>
              <Text style={[styles.badgeTxt, styles[`badgeTxt_${artwork.status}` as "badgeTxt_available"]]}>{artwork.status.toUpperCase()}</Text>
            </View>
            <Text style={styles.productId}>#{artwork.productId}</Text>
          </View>
          <Text style={styles.title}>{artwork.title}</Text>
          <Text style={styles.meta}>{artwork.style} · {artwork.material}{artwork.dimensions ? ` · ${artwork.dimensions}` : ""}</Text>
          {artwork.price && <Text style={styles.price}>₹{artwork.price.toLocaleString("en-IN")}</Text>}

          <Text style={styles.description}>{artwork.description}</Text>

          {/* Artist card */}
          {artist && (
            <View style={styles.artistCard}>
              <FastImage source={{ uri: artist.profileImage || "" }} style={styles.artistAvatar} resizeMode={FastImage.resizeMode.cover} />
              <View style={{ flex:1 }}>
                <Text style={styles.artistName}>{artist.name}</Text>
                <Text style={styles.artistLocation}>{artist.location}</Text>
                {artist.verified && <Text style={styles.verifiedTag}>✓ Verified Artist</Text>}
              </View>
            </View>
          )}

          {/* Action buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.whatsappBtn} onPress={openWhatsApp}>
              <Text style={styles.whatsappBtnText}>💬 Enquire on WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.enquireBtn} onPress={() => setEnquiryOpen(true)}>
              <Text style={styles.enquireBtnText}>📩 Send Inquiry</Text>
            </TouchableOpacity>
          </View>

          {/* WIP Timeline */}
          {wipStages.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>⚒️ Making-of Timeline</Text>
              {wipStages.map((w, idx) => (
                <View key={w.id} style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  {idx < wipStages.length - 1 && <View style={styles.timelineLine} />}
                  <View style={styles.timelineContent}>
                    <Text style={styles.stageLabel}>Stage {w.stage} — {w.stageLabel}</Text>
                    <Text style={styles.stageTitle}>{w.title}</Text>
                    <Text style={styles.stageDesc}>{w.description}</Text>
                    <FastImage source={{ uri: w.image }} style={styles.stageImg} resizeMode={FastImage.resizeMode.cover} />
                  </View>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      {/* Zoom Viewer */}
      {zoomIdx !== null && (
        <Modal visible animationType="fade" transparent>
          <ImageViewer
            imageUrls={imageUrls}
            index={zoomIdx}
            enableSwipeDown
            onSwipeDown={() => setZoomIdx(null)}
            renderHeader={() => (
              <TouchableOpacity style={styles.closeBtn} onPress={() => setZoomIdx(null)}>
                <Text style={{ color:"#fff", fontSize:14 }}>✕ Close</Text>
              </TouchableOpacity>
            )}
          />
        </Modal>
      )}

      {/* Enquiry Modal */}
      <Modal visible={enquiryOpen} animationType="slide" transparent>
        <View style={styles.enquiryOverlay}>
          <View style={styles.enquiryBox}>
            <Text style={styles.enquiryTitle}>Send Inquiry</Text>
            <Text style={styles.enquiryProduct}>For: {artwork.title} (#{artwork.productId})</Text>
            {(["buyerName","buyerEmail","message"] as const).map(field => (
              <View key={field} style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{field === "buyerName" ? "Your Name" : field === "buyerEmail" ? "Email" : "Message"}</Text>
                <TextInput
                  style={[styles.input, field === "message" && { height:80, textAlignVertical:"top" }]}
                  value={form[field]}
                  onChangeText={v => setForm(f => ({ ...f, [field]: v }))}
                  multiline={field === "message"}
                  keyboardType={field === "buyerEmail" ? "email-address" : "default"}
                  placeholder={field === "message" ? "I'm interested in this artwork…" : ""}
                  placeholderTextColor={Colors.muted}
                />
              </View>
            ))}
            <View style={styles.enquiryActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEnquiryOpen(false)}>
                <Text style={{ color: Colors.muted }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleEnquire} disabled={inquiryMutation.isPending}>
                <Text style={{ color: Colors.white, fontWeight:"600" }}>
                  {inquiryMutation.isPending ? "Sending…" : "Send & Open WhatsApp"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container:      { flex:1, backgroundColor:Colors.cream },
  hero:           { width:"100%", height:340 },
  zoomHint:       { position:"absolute", bottom:10, right:10, backgroundColor:"rgba(0,0,0,0.5)", borderRadius:Radius.sm, padding:6 },
  zoomHintText:   { color:Colors.white, fontSize:11 },
  imageStrip:     { marginVertical:Spacing.sm },
  stripThumb:     { width:80, height:60, borderRadius:Radius.sm },
  body:           { padding:Spacing.md },
  titleRow:       { flexDirection:"row", alignItems:"center", gap:10, marginBottom:8 },
  title:          { fontFamily:"Georgia", fontSize:22, color:Colors.ink, lineHeight:30 },
  meta:           { fontSize:13, color:Colors.muted, marginTop:4 },
  price:          { fontSize:20, color:Colors.gold, fontWeight:"700", marginTop:8 },
  description:    { fontSize:14, color:Colors.ink, lineHeight:22, marginTop:16 },
  productId:      { fontSize:11, color:Colors.muted },
  badge:          { borderRadius:Radius.round, paddingHorizontal:10, paddingVertical:3 },
  badge_available:{ backgroundColor:"#ECFDF5" },
  badge_sold:     { backgroundColor:"#FEF2F2" },
  badge_wip:      { backgroundColor:"#FFFBEB" },
  badgeTxt:       { fontSize:9, fontWeight:"700", textTransform:"uppercase" },
  badgeTxt_available:{ color:"#059669" },
  badgeTxt_sold:     { color:"#DC2626" },
  badgeTxt_wip:      { color:"#D97706" },
  artistCard:     { flexDirection:"row", gap:Spacing.md, padding:Spacing.md, backgroundColor:Colors.white, borderRadius:Radius.md, marginTop:20, ...Shadow.card },
  artistAvatar:   { width:52, height:52, borderRadius:26 },
  artistName:     { fontFamily:"Georgia", fontSize:14, color:Colors.ink },
  artistLocation: { fontSize:12, color:Colors.muted, marginTop:2 },
  verifiedTag:    { fontSize:10, color:"#2563EB", marginTop:4 },
  actions:        { gap:10, marginTop:20 },
  whatsappBtn:    { backgroundColor:Colors.whatsapp, borderRadius:Radius.md, padding:14, alignItems:"center" },
  whatsappBtnText:{ color:Colors.white, fontWeight:"700", fontSize:15 },
  enquireBtn:     { backgroundColor:Colors.ink, borderRadius:Radius.md, padding:14, alignItems:"center" },
  enquireBtnText: { color:Colors.cream, fontWeight:"600", fontSize:15 },
  sectionTitle:   { fontFamily:"Georgia", fontSize:18, color:Colors.ink, marginTop:28, marginBottom:16 },
  timelineItem:   { flexDirection:"row", gap:12, marginBottom:24 },
  timelineDot:    { width:14, height:14, borderRadius:7, backgroundColor:Colors.gold, marginTop:4 },
  timelineLine:   { position:"absolute", left:6, top:18, bottom:-24, width:2, backgroundColor:Colors.border },
  timelineContent:{ flex:1 },
  stageLabel:     { fontSize:11, color:Colors.gold, fontWeight:"700", textTransform:"uppercase", letterSpacing:0.5 },
  stageTitle:     { fontFamily:"Georgia", fontSize:14, color:Colors.ink, marginTop:4 },
  stageDesc:      { fontSize:13, color:Colors.muted, marginTop:4 },
  stageImg:       { width:"100%", height:180, borderRadius:Radius.sm, marginTop:10 },
  closeBtn:       { position:"absolute", top:40, right:20, zIndex:10, backgroundColor:"rgba(0,0,0,0.5)", borderRadius:Radius.sm, padding:8 },
  enquiryOverlay: { flex:1, backgroundColor:"rgba(0,0,0,0.5)", justifyContent:"flex-end" },
  enquiryBox:     { backgroundColor:Colors.white, borderTopLeftRadius:Radius.lg, borderTopRightRadius:Radius.lg, padding:Spacing.lg },
  enquiryTitle:   { fontFamily:"Georgia", fontSize:20, color:Colors.ink, marginBottom:4 },
  enquiryProduct: { fontSize:12, color:Colors.muted, marginBottom:Spacing.md },
  inputGroup:     { marginBottom:12 },
  inputLabel:     { fontSize:11, color:Colors.muted, textTransform:"uppercase", letterSpacing:0.5, marginBottom:5 },
  input:          { borderWidth:1, borderColor:Colors.border, borderRadius:Radius.sm, padding:10, fontSize:14, color:Colors.ink },
  enquiryActions: { flexDirection:"row", gap:12, marginTop:16 },
  cancelBtn:      { flex:1, padding:13, borderWidth:1, borderColor:Colors.border, borderRadius:Radius.sm, alignItems:"center" },
  submitBtn:      { flex:2, padding:13, backgroundColor:Colors.ink, borderRadius:Radius.sm, alignItems:"center" },
});

