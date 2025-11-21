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
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  toggleLicense: (id, active) => api.post(`/users/${id}/toggle-license`, { license_active: active }),
  setPassword: (id, password) => api.post(`/users/${id}/set-password`, { password }),
};

// Bookings API
export const bookingAPI = {
  getAll: (status = null, userId = null) => {
    const params = {};
    if (status) params.status = status;
    if (userId) params.user_id = userId;
    return api.get('/bookings', { params });
  },
  getPending: () => api.get('/bookings/pending'),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  delete: (id) => api.delete(`/bookings/${id}`),
  confirm: (id, data) => api.post(`/bookings/${id}/confirm`, data),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentActivity: (limit = 10) => api.get('/dashboard/recent-activity', { 
    params: { limit } 
  }),
};

// Calendar API
export const calendarAPI = {
  getUpcoming: (days = 7) => api.get('/calendar/upcoming', { params: { days } }),
  getToday: () => api.get('/calendar/today'),
  getPendingNotifications: () => api.get('/calendar/notifications/pending'),
};

// Documents API
export const documentsAPI = {
  // Get all documents for a specific user
  getUserDocuments: (userId) => api.get(`/documents/user/${userId}`),
  
  // Upload a document for a user
  uploadDocument: (userId, file, category = null, description = null) => {
    const formData = new FormData();
    formData.append('file', file);
    if (category) formData.append('category', category);
    if (description) formData.append('description', description);
    
    return axios.post(`${API_BASE_URL}/documents/upload/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Download a document (returns blob)
  downloadDocument: (docId) => {
    return axios.get(`${API_BASE_URL}/documents/download/${docId}`, {
      responseType: 'blob',
    });
  },
  
  // View a document (for preview in browser)
  viewDocument: (docId) => {
    return `${API_BASE_URL}/documents/view/${docId}`;
  },
  
  // Delete a document
  deleteDocument: (docId) => api.delete(`/documents/${docId}`),
};

// Gallery API
export const galleryAPI = {
  getAll: () => api.get('/gallery'),
  upload: (file, title = null, description = null) => {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    if (description) formData.append('description', description);
    
    return axios.post(`${API_BASE_URL}/gallery/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  delete: (id) => api.delete(`/gallery/${id}`),
};

// Settings API
export const settingsAPI = {
  getHomepage: () => api.get('/settings/homepage'),
  updateHomepage: (data) => api.put('/settings/homepage', { value: data }),
  getTimeSlots: () => api.get('/settings/time-slots'),
  updateTimeSlots: (data) => api.put('/settings/time-slots', { value: data }),
};

export default api;