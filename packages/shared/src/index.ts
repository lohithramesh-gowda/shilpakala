// ─── Artist ───────────────────────────────────────────────────────────────────
export interface Artist {
  id: string;
  name: string;
  location: string;
  bio: string;
  specialization: string; // e.g. "Hoysala", "Dravidian"
  phone: string;
  whatsapp: string;
  profileImage?: string;
  verified: boolean;
  createdAt: string;
}

// ─── Artwork ──────────────────────────────────────────────────────────────────
export type ArtworkStatus = "available" | "sold" | "wip";

export interface Artwork {
  id: string;
  artistId: string;
  title: string;
  description: string;
  style: string; // e.g. "Hoysala", "Chalukya"
  material: string; // Stone | Wood | Marble …
  dimensions?: string;
  price?: number;
  currency: string;
  status: ArtworkStatus;
  images: string[];
  thumbnailImage: string;
  productId: string; // unique SKU – used in WhatsApp inquiry
  createdAt: string;
  updatedAt: string;
}

// ─── Work-in-Progress Timeline ────────────────────────────────────────────────
export interface WipStage {
  id: string;
  artworkId: string;
  artistId: string;
  title: string;
  description: string;
  /** 1=Raw block  2=Rough carving  3=Detail work  4=Finishing  5=Complete */
  stage: 1 | 2 | 3 | 4 | 5;
  stageLabel: string;
  image: string;
  createdAt: string;
}

// ─── Heritage Story ───────────────────────────────────────────────────────────
export interface HeritageStory {
  id: string;
  style: string; // "Hoysala" | "Chalukya" | "Dravidian" …
  title: string;
  subtitle: string;
  content: string;
  period: string; // "900 AD – 1300 AD"
  region: string;
  keyFeatures: string[];
  coverImage: string;
  gallery: string[];
  createdAt: string;
}

// ─── Inquiry ──────────────────────────────────────────────────────────────────
export type InquiryStatus = "new" | "contacted" | "closed";

export interface Inquiry {
  id: string;
  artworkId: string;
  productId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

// ─── API response wrappers ────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}

