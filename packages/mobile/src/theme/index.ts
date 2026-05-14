// ─── Colors ───────────────────────────────────────────────────────────────────
export const Colors = {
  cream:     '#FAF7F2',
  gold:      '#B8860B',
  goldLight: '#D4A017',
  goldPale:  '#FDF3DC',
  ink:       '#1C1C1E',
  dark:      '#2C2C2E',
  muted:     '#6B6B6B',
  subtle:    '#9A9A9A',
  white:     '#FFFFFF',
  border:    '#E8E0D5',
  surface:   '#F5F0EA',
  error:     '#C0392B',
  success:   '#1E8449',
  wip:       '#D35400',
  sold:      '#7F8C8D',
  overlay:   'rgba(0,0,0,0.55)',
};

// ─── Spacing ──────────────────────────────────────────────────────────────────
export const Spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

// ─── Border Radius ────────────────────────────────────────────────────────────
export const Radius = {
  sm:    6,
  md:    12,
  lg:    18,
  xl:    24,
  round: 999,
};

// ─── Shadows ──────────────────────────────────────────────────────────────────
export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  strong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
};

// ─── Typography ───────────────────────────────────────────────────────────────
export const Typography = {
  serif28:  { fontSize: 28, fontWeight: '700' as const, fontStyle: 'italic' as const, color: Colors.ink },
  serif22:  { fontSize: 22, fontWeight: '700' as const, fontStyle: 'italic' as const, color: Colors.ink },
  serif18:  { fontSize: 18, fontWeight: '600' as const, fontStyle: 'italic' as const, color: Colors.ink },
  sans16:   { fontSize: 16, fontWeight: '600' as const, color: Colors.ink },
  sans14:   { fontSize: 14, color: Colors.ink, lineHeight: 20 },
  body:     { fontSize: 15, color: Colors.dark, lineHeight: 24 },
  caption:  { fontSize: 12, color: Colors.muted },
  price:    { fontSize: 20, fontWeight: '700' as const, color: Colors.gold },
  label:    { fontSize: 10, fontWeight: '700' as const, letterSpacing: 1.2, textTransform: 'uppercase' as const },
};

// ─── Status Colors ────────────────────────────────────────────────────────────
export const StatusColor: Record<string, string> = {
  available: Colors.success,
  wip:       Colors.wip,
  sold:      Colors.sold,
};

export const StatusLabel: Record<string, string> = {
  available: 'Available',
  wip:       'Work in Progress',
  sold:      'Sold',
};

