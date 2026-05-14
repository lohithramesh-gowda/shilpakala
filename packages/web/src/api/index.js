import axios from "axios";
const api = axios.create({ baseURL: "/api" });
export const artistsApi = {
    getAll: () => api.get("/artists"),
    getById: (id) => api.get(`/artists/${id}`),
    create: (data) => api.post("/artists", data),
    update: (id, data) => api.put(`/artists/${id}`, data),
    remove: (id) => api.delete(`/artists/${id}`),
};
export const artworksApi = {
    getAll: (params) => api.get("/artworks", { params }),
    getById: (id) => api.get(`/artworks/${id}`),
    create: (data) => api.post("/artworks", data),
    update: (id, data) => api.put(`/artworks/${id}`, data),
    remove: (id) => api.delete(`/artworks/${id}`),
};
export const wipApi = {
    getAll: (artworkId) => api.get("/wip", { params: artworkId ? { artworkId } : {} }),
    create: (data) => api.post("/wip", data),
    remove: (id) => api.delete(`/wip/${id}`),
};
export const heritageApi = {
    getAll: () => api.get("/heritage"),
    getById: (id) => api.get(`/heritage/${id}`),
    create: (data) => api.post("/heritage", data),
};
export const inquiriesApi = {
    getAll: (status) => api.get("/inquiries", { params: status ? { status } : {} }),
    updateStatus: (id, status) => api.patch(`/inquiries/${id}`, { status }),
};
export default api;
