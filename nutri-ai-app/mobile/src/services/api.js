import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        try {
          const token = await AsyncStorage.getItem('authToken');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error getting auth token:', error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, remove it
          await AsyncStorage.removeItem('authToken');
        }
        return Promise.reject(error);
      }
    );
  }

  // Nutrition endpoints
  async calculateNutrition(food, model = 'gpt-4') {
    try {
      const response = await this.client.post('/nutrition/calculate', {
        food,
        model
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async testConsistency(food, model = 'gpt-4', runs = 5) {
    try {
      const response = await this.client.post('/nutrition/test-consistency', {
        food,
        model,
        runs
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getModels() {
    try {
      const response = await this.client.get('/nutrition/models');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // History endpoints
  async getHistory(page = 1, limit = 20) {
    try {
      const response = await this.client.get('/history', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteCalculation(id) {
    try {
      const response = await this.client.delete(`/history/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.error || 'Server error',
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      // Request made but no response
      return {
        message: 'Network error - please check your connection',
        status: 0
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'Unknown error',
        status: -1
      };
    }
  }
}

export default new ApiService();
