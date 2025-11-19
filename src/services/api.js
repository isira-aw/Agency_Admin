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

export default api;
