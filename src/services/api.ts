import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Add interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getNews = async (category?: string) => {
  const { data } = await api.get('/news', { params: { category } });
  return data;
};

export const getPlayers = async (sport?: string) => {
  const { data } = await api.get('/players', { params: { sport } });
  return data;
};

export const getPlayer = async (id: string) => {
  const { data } = await api.get(`/players/${id}`);
  return data;
};

export const addPlayer = async (player: any) => {
  const { data } = await api.post('/players', player);
  return data;
};

export const getFixtures = async (sport?: string) => {
  const { data } = await api.get('/fixtures', { params: { sport } });
  return data;
};

export const getStadiums = async () => {
  const { data } = await api.get('/stadiums');
  return data;
};

export const getStadium = async (id: string) => {
  const { data } = await api.get(`/stadiums/${id}`);
  return data;
};

export const submitContact = async (contactData: { name: string, email: string, message: string }) => {
  const { data } = await api.post('/contact', contactData);
  return data;
};

export const adminLogin = async (credentials: any) => {
  const { data } = await api.post('/admin/login', credentials);
  return data;
};

export const getAdminMessages = async () => {
  const { data } = await api.get('/admin/messages');
  return data;
};

export const deleteAdminMessage = async (id: string) => {
  const { data } = await api.delete(`/admin/messages/${id}`);
  return data;
};

export const searchGlobal = async (q: string) => {
  const { data } = await api.get('/search', { params: { q } });
  return data;
};

export const uploadSmart = async (base64Image: string) => {
  const { data } = await api.post('/upload-smart', { base64Image });
  return data;
};

export const getAdminStats = async () => {
  const { data } = await api.get('/admin/stats');
  return data;
};

export const apiCall = async (endpoint: string, method: string = 'GET', body: any = null) => {
  const config: any = { method, url: endpoint };
  if (body) config.data = body;
  const { data } = await api(config);
  return data;
};

export const getAdminLogs = async () => {
  const { data } = await api.get('/admin/logs');
  return data;
};
