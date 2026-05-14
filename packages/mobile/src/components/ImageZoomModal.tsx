import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Platform,
} from 'react-native';
import { Colors, Spacing } from '../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: W, height: H } = Dimensions.get('window');

interface Props {
  images:  string[];
  initial: number;
  visible: boolean;
  onClose: () => void;
}

export default function ImageZoomModal({ images, initial, visible, onClose }: Props) {
  const [current, setCurrent] = useState(initial);
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        {/* Close */}
        <TouchableOpacity
          style={[styles.closeBtn, { top: insets.top + 12 }]}
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.closeTxt}>✕</Text>
        </TouchableOpacity>

        {/* Counter */}
        <View style={[styles.counter, { top: insets.top + 14 }]}>
          <Text style={styles.counterTxt}>{current + 1} / {images.length}</Text>
        </View>

        {/* Zoomable image */}
        <ScrollView
          key={current}
          contentContainerStyle={styles.scrollContent}
          maximumZoomScale={4}
          minimumZoomScale={1}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          centerContent
          style={{ flex: 1 }}
        >
          <Image
            source={{ uri: images[current] }}
            style={styles.mainImg}
            resizeMode="contain"
          />
        </ScrollView>

        {/* Thumbnails */}
        {images.length > 1 && (
          <FlatList
            data={images}
            horizontal
            keyExtractor={(_, i) => String(i)}
            style={[styles.thumbList, { paddingBottom: insets.bottom + 8 }]}
            contentContainerStyle={{ paddingHorizontal: Spacing.md, gap: 8 }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => setCurrent(index)} activeOpacity={0.8}>
                <Image
                  source={{ uri: item }}
                  style={[styles.thumb, current === index && styles.thumbActive]}
                />
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop:     { flex: 1, backgroundColor: '#000' },
  scrollContent:{ minHeight: H * 0.7, justifyContent: 'center', alignItems: 'center' },
  mainImg:      { width: W, height: H * 0.72 },
  closeBtn: {
    position:        'absolute',
    left:            Spacing.md,
    zIndex:          10,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius:    20,
    width:           36,
    height:          36,
    alignItems:      'center',
    justifyContent:  'center',
  },
  closeTxt:  { color: Colors.white, fontSize: 16, fontWeight: '700' },
  counter: {
    position:  'absolute',
    right:     Spacing.md,
    zIndex:    10,
  },
  counterTxt:{ color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  thumbList: { height: 80, backgroundColor: 'rgba(0,0,0,0.6)' },
  thumb: {
    width:        60,
    height:       60,
    borderRadius: 6,
    opacity:      0.55,
    borderWidth:  2,
    borderColor:  'transparent',
  },
  thumbActive:{ opacity: 1, borderColor: Colors.gold },
});

