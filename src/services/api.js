import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/admin';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Users API
export const userAPI = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  toggleLicense: (id, active) => api.post(`/users/${id}/toggle-license`, { active }),
};

// Bookings API
export const bookingAPI = {
  getAll: () => api.get('/bookings'),
  getPending: () => api.get('/bookings/pending'),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  delete: (id) => api.delete(`/bookings/${id}`),
  confirm: (id, data) => api.post(`/bookings/${id}/confirm`, data),
  updateStatus: (id, status, response) => api.patch(`/bookings/${id}/status`, { 
    status, 
    admin_response: response 
  }),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
    getRecentActivity: (limit) =>
      api.get("/dashboard/recent-activity", { params: { limit: limit || 10 } }),
};

// Calendar API
export const calendarAPI = {
  getUpcoming: () => api.get('/calendar/upcoming'),
  getToday: () => api.get('/calendar/today'),
};

export default api;
