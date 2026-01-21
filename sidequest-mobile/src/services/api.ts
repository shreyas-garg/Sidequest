import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

console.log('API URL configured:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.log('Error retrieving token:', error);
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status);
    return response;
  },
  async (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      await SecureStore.deleteItemAsync('authToken');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (name: string, email: string, password: string) => {
    return api.post('/auth/register', { name, email, password });
  },
  login: async (email: string, password: string) => {
    return api.post('/auth/login', { email, password });
  },
  getProfile: async () => {
    return api.get('/auth/profile');
  },
  updateProfile: async (name: string, bio: string, interests: string[]) => {
    return api.put('/auth/profile', { name, bio, interests });
  },
};

export const sideQuestService = {
  getSideQuests: async (filters?: { category?: string; location?: string; search?: string }) => {
    return api.get('/sidequests', { params: filters });
  },
  getSideQuestById: async (id: string) => {
    return api.get(`/sidequests/${id}`);
  },
  getMySideQuests: async () => {
    return api.get('/sidequests/my-sidequests');
  },
  createSideQuest: async (data: any) => {
    return api.post('/sidequests', data);
  },
  updateSideQuest: async (id: string, data: any) => {
    return api.put(`/sidequests/${id}`, data);
  },
  deleteSideQuest: async (id: string) => {
    return api.delete(`/sidequests/${id}`);
  },
};

export const joinRequestService = {
  requestToJoin: async (sideQuestId: string) => {
    return api.post('/joinrequests/request-join', { sideQuestId });
  },
  getJoinRequests: async (sideQuestId: string) => {
    return api.get(`/joinrequests/${sideQuestId}/requests`);
  },
  acceptRequest: async (requestId: string) => {
    return api.put(`/joinrequests/${requestId}/accept`);
  },
  rejectRequest: async (requestId: string) => {
    return api.put(`/joinrequests/${requestId}/reject`);
  },
  removeParticipant: async (sideQuestId: string, userId: string) => {
    return api.delete(`/joinrequests/${sideQuestId}/participant/${userId}`);
  },
};

export default api;
