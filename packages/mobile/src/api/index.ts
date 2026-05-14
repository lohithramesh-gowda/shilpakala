import axios from 'axios';
import { Platform } from 'react-native';

// Android emulator → 10.0.2.2, iOS simulator / physical → your LAN IP or localhost
const BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:5001'
    : 'http://localhost:5001';

export const API_BASE = BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Artists ──────────────────────────────────────────────────────────────────
export const artistsApi = {
  getAll:  ()           => api.get('/api/artists'),
  getOne:  (id: string) => api.get(`/api/artists/${id}`),
};

// ─── Artworks ─────────────────────────────────────────────────────────────────
export const artworksApi = {
  getAll: (params?: {
    artistId?: string;
    style?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => api.get('/api/artworks', { params }),
  getOne: (id: string) => api.get(`/api/artworks/${id}`),
};

// ─── WIP ──────────────────────────────────────────────────────────────────────
export const wipApi = {
  getAll:         ()               => api.get('/api/wip'),
  getByArtwork:   (artworkId: string) => api.get(`/api/wip/artwork/${artworkId}`),
};

// ─── Heritage ─────────────────────────────────────────────────────────────────
export const heritageApi = {
  getAll:  ()           => api.get('/api/heritage'),
  getOne:  (id: string) => api.get(`/api/heritage/${id}`),
};

// ─── Inquiries ────────────────────────────────────────────────────────────────
export const inquiriesApi = {
  create: (data: {
    artworkId: string;
    productId: string;
    buyerName: string;
    buyerEmail: string;
    buyerPhone?: string;
    message: string;
  }) => api.post('/api/inquiries', data),
};

export default api;

