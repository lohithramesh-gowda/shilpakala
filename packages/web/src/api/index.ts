import axios from "axios";

const api = axios.create({ baseURL: "/api" });

export const artistsApi = {
  getAll:    ()         => api.get("/artists"),
  getById:   (id: string) => api.get(`/artists/${id}`),
  create:    (data: any) => api.post("/artists", data),
  update:    (id: string, data: any) => api.put(`/artists/${id}`, data),
  remove:    (id: string) => api.delete(`/artists/${id}`),
};

export const artworksApi = {
  getAll:    (params?: any) => api.get("/artworks", { params }),
  getById:   (id: string)   => api.get(`/artworks/${id}`),
  create:    (data: any)    => api.post("/artworks", data),
  update:    (id: string, data: any) => api.put(`/artworks/${id}`, data),
  remove:    (id: string)   => api.delete(`/artworks/${id}`),
};

export const wipApi = {
  getAll:    (artworkId?: string) => api.get("/wip", { params: artworkId ? { artworkId } : {} }),
  create:    (data: any)          => api.post("/wip", data),
  remove:    (id: string)         => api.delete(`/wip/${id}`),
};

export const heritageApi = {
  getAll:    ()         => api.get("/heritage"),
  getById:   (id: string) => api.get(`/heritage/${id}`),
  create:    (data: any)  => api.post("/heritage", data),
};

export const inquiriesApi = {
  getAll:          (status?: string) => api.get("/inquiries", { params: status ? { status } : {} }),
  updateStatus:    (id: string, status: string) => api.patch(`/inquiries/${id}`, { status }),
};

export default api;

