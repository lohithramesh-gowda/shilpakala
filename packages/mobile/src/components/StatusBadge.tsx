import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius, Typography } from '../theme';
import { StatusColor, StatusLabel } from '../theme';

interface Props {
  status: string;
  small?: boolean;
}

export default function StatusBadge({ status, small }: Props) {
  const color = StatusColor[status] ?? Colors.muted;
  return (
    <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color }, small && styles.small]}>
      <Text style={[styles.text, { color }, small && styles.smallText]}>
        {StatusLabel[status] ?? status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf:      'flex-start',
    borderRadius:   Radius.round,
    borderWidth:    1,
    paddingHorizontal: 10,
    paddingVertical:   4,
  },
  text: {
    ...Typography.label,
    fontSize: 10,
  },
  small: {
    paddingHorizontal: 7,
    paddingVertical:   2,
  },
  smallText: {
    fontSize: 9,
  },
});

