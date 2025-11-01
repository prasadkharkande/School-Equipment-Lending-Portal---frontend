import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const normalizeData = (res) => {
  if (!res) return null;
  const d = res.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.equipment)) return d.equipment;
  if (Array.isArray(d?.requests)) return d.requests;
  if (Array.isArray(d?.data)) return d.data;
  return d;
};

export default API;
