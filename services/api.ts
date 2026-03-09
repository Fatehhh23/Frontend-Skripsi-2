import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Interface untuk parameter gempa
export interface EarthquakeParams {
  magnitude: number;
  depth: number;
  latitude: number;
  longitude: number;
  mode?: 'AI' | 'HEURISTIC';
}

// Interface untuk response prediksi tsunami
export interface TsunamiPredictionResponse {
  status: 'success' | 'error';
  data: {
    prediction: {
      eta: number; // menit
      maxWaveHeight: number; // meter
      affectedArea: number; // km²
      tsunamiCategory: 'Low' | 'Medium' | 'High' | 'Extreme';
      estimatedCasualties?: number;
    };
    epicenter: {
      latitude: number;
      longitude: number;
    };
    inundationZones: Array<{
      coordinates: number[][][];
      height: number;
    }>;
    impactZones: Array<{
      name: string;
      distance: number;
      eta: number;
      waveHeight: number;
    }>;
    waveData: Array<{
      time: number;
      waveHeight: number;
    }>;
  };
  message?: string;
  timestamp: string;
}

// Interface untuk response real-time monitoring
export interface RealTimeDataResponse {
  status: 'success' | 'error';
  earthquakes: Array<{
    id: string;
    magnitude: number;
    depth: number;
    latitude: number;
    longitude: number;
    timestamp: string;
    location: string;
  }>;
}

// Interface untuk pesan kontak
export interface ContactMessagePayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessageResponse {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'resolved';
  created_at: string;
}

class TsunamiAPIService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    // Ganti dengan URL backend kamu (FastAPI)
    // @ts-ignore
    this.baseURL = process.env.REACT_APP_API_URL || import.meta.env?.VITE_API_URL || `http://${window.location.hostname}:8000/api`;

    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000, // 30 detik timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor untuk request
    this.api.interceptors.request.use(
      (config) => {
        // Tambahkan authentication token jika ada
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Always include Anonymous Session ID for tracking
        let sessionId = localStorage.getItem('avatar_session_id');
        if (!sessionId) {
          sessionId = 'user_' + Math.random().toString(36).substring(2, 15);
          localStorage.setItem('avatar_session_id', sessionId);
        }
        config.headers['X-Session-ID'] = sessionId;

        console.log('API Request:', config.method?.toUpperCase(), config.url);
        return config;
      },
      (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Interceptor untuk response
    this.api.interceptors.response.use(
      (response) => {
        console.log('API Response:', response.status, response.config.url);
        return response;
      },
      (error) => {
        console.error('Response Error:', error.response?.status, error.message);

        // Handle specific error codes
        if (error.response?.status === 401) {
          // Unauthorized - redirect to login atau refresh token
          console.error('Unauthorized access');
        } else if (error.response?.status === 500) {
          console.error('Server error');
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Menjalankan simulasi tsunami berdasarkan parameter gempa
   */
  async runSimulation(params: EarthquakeParams): Promise<TsunamiPredictionResponse> {
    try {
      const response: AxiosResponse<TsunamiPredictionResponse> = await this.api.post(
        '/v1/simulation/simulation/run',
        params
      );
      return response.data;
    } catch (error: any) {
      console.error('Simulation Error:', error);
      throw new Error(
        error.response?.data?.message || 'Gagal menjalankan simulasi'
      );
    }
  }

  /**
   * Mendapatkan data gempa real-time dari BMKG atau sumber lain
   */
  async getRealTimeEarthquakes(): Promise<RealTimeDataResponse> {
    try {
      const response: AxiosResponse<RealTimeDataResponse> = await this.api.get(
        '/v1/earthquakes/realtime'
      );
      return response.data;
    } catch (error: any) {
      console.error('Real-time Data Error:', error);
      throw new Error(
        error.response?.data?.message || 'Gagal mengambil data real-time'
      );
    }
  }

  /**
   * Mendapatkan riwayat simulasi yang pernah dijalankan
   */
  async getSimulationHistory(limit: number = 10): Promise<any> {
    try {
      const response = await this.api.get('/simulation/history', {
        params: { limit },
      });
      return response.data;
    } catch (error: any) {
      console.error('History Error:', error);
      throw new Error(
        error.response?.data?.message || 'Gagal mengambil riwayat'
      );
    }
  }

  /**
   * Mendapatkan detail simulasi berdasarkan ID
   */
  async getSimulationById(id: string): Promise<TsunamiPredictionResponse> {
    try {
      const response: AxiosResponse<TsunamiPredictionResponse> = await this.api.get(
        `/simulation/${id}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Get Simulation Error:', error);
      throw new Error(
        error.response?.data?.message || 'Gagal mengambil detail simulasi'
      );
    }
  }

  /**
   * Health check untuk memastikan backend berjalan
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await this.api.get('/health');
      return response.data;
    } catch (error: any) {
      console.error('Health Check Error:', error);
      throw new Error('Backend tidak dapat diakses');
    }
  }

  /**
   * Upload data geospasial tambahan (opsional)
   */
  async uploadGeospatialData(formData: FormData): Promise<any> {
    try {
      const response = await this.api.post('/data/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Upload Error:', error);
      throw new Error(
        error.response?.data?.message || 'Gagal upload data'
      );
    }
  }
  /**
   * Mengirim form kontak ke backend
   */
  async submitContactMessage(payload: ContactMessagePayload): Promise<ContactMessageResponse> {
    try {
      const response = await this.api.post('/v1/contacts', payload);
      return response.data;
    } catch (error: any) {
      console.error('Contact submit error:', error);
      let message = 'Gagal mengirim pesan';
      if (error.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          message = error.response.data.detail.map((err: any) => err.msg).join(', ');
        } else {
          message = error.response.data.detail;
        }
      }
      throw new Error(message);
    }
  }

  /**
   * Mengambil daftar kontak untuk admin dashboard
   */
  async getAdminContactMessages(statusFilter?: 'unread' | 'resolved'): Promise<ContactMessageResponse[]> {
    try {
      const params = statusFilter ? { status_filter: statusFilter } : {};
      const response = await this.api.get('/v1/contacts/admin', { params });
      return response.data;
    } catch (error: any) {
      console.error('Fetch contacts admin error:', error);
      throw new Error(error.response?.data?.detail || 'Gagal mengambil data pesan kontak');
    }
  }

  /**
   * Memperbarui status kontak untuk admin dashboard
   */
  async updateContactMessageStatus(id: string, newStatus: 'unread' | 'resolved'): Promise<ContactMessageResponse> {
    try {
      const response = await this.api.put(`/v1/contacts/admin/${id}/status`, { status: newStatus });
      return response.data;
    } catch (error: any) {
      console.error('Update contact status error:', error);
      throw new Error(error.response?.data?.detail || 'Gagal memperbarui status pesan');
    }
  }

  /**
   * Menghapus pesan kontak (khusus admin)
   */
  async deleteContactMessage(id: string): Promise<void> {
    try {
      await this.api.delete(`/v1/contacts/admin/${id}`);
    } catch (error: any) {
      console.error('Delete contact error:', error);
      throw new Error(error.response?.data?.detail || 'Gagal menghapus pesan');
    }
  }
}

// Export single instance (Singleton pattern)
const apiService = new TsunamiAPIService();
export default apiService;

// Export class untuk testing atau multiple instances
export { TsunamiAPIService };
