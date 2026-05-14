import axios from "axios";

// Change this to your machine's IP when testing on a real device
const BASE_URL = __DEV__ ? "http://10.0.2.2:5001/api" : "https://api.shilpakala.in/api";

const api = axios.create({ baseURL: BASE_URL, timeout: 10000 });

export const artistsApi = {
  getAll:  ()           => api.get("/artists"),
  getById: (id: string) => api.get(`/artists/${id}`),
};

export const artworksApi = {
  getAll:  (params?: any)  => api.get("/artworks", { params }),
  getById: (id: string)    => api.get(`/artworks/${id}`),
};

export const wipApi = {
  getAll: (artworkId: string) => api.get("/wip", { params: { artworkId } }),
};

export const heritageApi = {
  getAll:  ()           => api.get("/heritage"),
  getById: (id: string) => api.get(`/heritage/${id}`),
};

export const inquiriesApi = {
  create: (data: any) => api.post("/inquiries", data),
};

export default api;

