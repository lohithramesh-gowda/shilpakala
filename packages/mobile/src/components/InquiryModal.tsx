import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as Linking from 'expo-linking';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, Shadow, Typography } from '../theme';
import { inquiriesApi } from '../api';

interface Props {
  visible:    boolean;
  onClose:    () => void;
  artworkId:  string;
  productId:  string;
  title:      string;
  artistPhone: string;
  price?:     number;
  currency:   string;
}

export default function InquiryModal({
  visible, onClose, artworkId, productId, title, artistPhone, price, currency,
}: Props) {
  const insets    = useSafeAreaInsets();
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [phone,   setPhone]   = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const priceText = price
    ? `${currency} ${price.toLocaleString('en-IN')}`
    : 'Price on request';

  const whatsappMessage =
    `🪨 *Inquiry for Artwork*\n\n` +
    `*Artwork:* ${title}\n` +
    `*Product ID:* ${productId}\n` +
    `*Price:* ${priceText}\n\n` +
    `*Buyer Name:* ${name || '(not provided)'}\n` +
    `*Contact:* ${phone || email || '(not provided)'}\n\n` +
    `${message || 'I am interested in this artwork. Please share more details.'}\n\n` +
    `_Sent via Shilpa-Kala Showcase App_`;

  const handleWhatsApp = async () => {
    const cleanPhone = artistPhone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('WhatsApp not installed', 'Please install WhatsApp to send inquiries.');
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Required', 'Please enter your name and email.');
      return;
    }
    try {
      setLoading(true);
      await inquiriesApi.create({
        artworkId, productId,
        buyerName:  name.trim(),
        buyerEmail: email.trim(),
        buyerPhone: phone.trim() || undefined,
        message:    message.trim() || `Inquiry for ${title} (${productId})`,
      });
      Alert.alert(
        '✅ Inquiry Sent!',
        'Your inquiry has been recorded. The artist will contact you shortly.',
        [{ text: 'OK', onPress: onClose }],
      );
    } catch {
      Alert.alert('Error', 'Could not send inquiry. Please try WhatsApp instead.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={[styles.container, { paddingBottom: insets.bottom + Spacing.md }]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Send Inquiry</Text>
              <Text style={styles.headerSub}>{title}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeTxt}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Product ID pill */}
          <View style={styles.skuRow}>
            <Text style={styles.skuLabel}>Product ID</Text>
            <Text style={styles.skuValue}>{productId}</Text>
            <Text style={styles.priceValue}>{priceText}</Text>
          </View>

          <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
            <Text style={styles.sectionLabel}>Your Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name *"
              placeholderTextColor={Colors.subtle}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address *"
              placeholderTextColor={Colors.subtle}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number (optional)"
              placeholderTextColor={Colors.subtle}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <Text style={styles.sectionLabel}>Message</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder={`I am interested in "${title}" (${productId}). Please share details about shipping, customization or pricing.`}
              placeholderTextColor={Colors.subtle}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsApp} activeOpacity={0.85}>
              <Text style={styles.whatsappTxt}>💬  Inquire via WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading} activeOpacity={0.85}>
              {loading
                ? <ActivityIndicator color={Colors.white} />
                : <Text style={styles.submitTxt}>Submit Inquiry</Text>
              }
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  headerTitle: { ...Typography.serif22, fontSize: 20 },
  headerSub:   { ...Typography.caption, marginTop: 2, maxWidth: 260 },
  closeBtn: {
    width: 32, height: 32,
    borderRadius: Radius.round,
    backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  closeTxt:    { fontSize: 14, color: Colors.muted, fontWeight: '700' },
  skuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.goldPale,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.lg,
    gap: 6,
  },
  skuLabel:  { ...Typography.label, color: Colors.muted, fontSize: 9 },
  skuValue:  { ...Typography.label, color: Colors.gold, fontSize: 11, flex: 1 },
  priceValue:{ ...Typography.sans14, fontWeight: '700', color: Colors.gold },
  sectionLabel: {
    ...Typography.label,
    color: Colors.muted,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.ink,
    marginBottom: Spacing.sm,
  },
  textarea: { height: 110, paddingTop: 12 },
  actions:  { gap: Spacing.sm, paddingTop: Spacing.md },
  whatsappBtn: {
    backgroundColor: '#25D366',
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    ...Shadow.card,
  },
  whatsappTxt: { color: Colors.white, fontSize: 15, fontWeight: '700' },
  submitBtn: {
    backgroundColor: Colors.gold,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    ...Shadow.card,
  },
  submitTxt:   { color: Colors.white, fontSize: 15, fontWeight: '700' },
});

