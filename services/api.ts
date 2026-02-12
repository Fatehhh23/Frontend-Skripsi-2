import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Interface untuk parameter gempa
export interface EarthquakeParams {
  magnitude: number;
  depth: number;
  latitude: number;
  longitude: number;
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

class TsunamiAPIService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    // Ganti dengan URL backend kamu (FastAPI)
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
    
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
}

// Export single instance (Singleton pattern)
const apiService = new TsunamiAPIService();
export default apiService;

// Export class untuk testing atau multiple instances
export { TsunamiAPIService };
