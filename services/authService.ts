import axios, { AxiosInstance } from 'axios';

// ============================================
// INTERFACES
// ============================================

export interface RegisterData {
    email: string;
    username: string;
    password: string;
    full_name?: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface User {
    id: string;
    email: string;
    username: string;
    full_name: string | null;
    role: string;
    is_active: boolean;
    is_verified: boolean;
    created_at: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    user: User;
}

export interface AuthError {
    detail: string;
    status?: number;
}

// ============================================
// AUTH SERVICE
// ============================================

class AuthService {
    private api: AxiosInstance;
    private baseURL: string;

    constructor() {
        this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

        this.api = axios.create({
            baseURL: this.baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor - add auth token
        this.api.interceptors.request.use(
            (config) => {
                const token = this.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor - handle auth errors
        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // Unauthorized - clear token and redirect to login
                    this.clearToken();
                    window.location.href = '/#/login';
                }
                return Promise.reject(error);
            }
        );
    }

    /**
     * Register new user
     */
    async register(data: RegisterData): Promise<User> {
        try {
            const response = await this.api.post<User>('/v1/auth/register', data);
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.detail || 'Registration failed';
            throw new Error(message);
        }
    }

    /**
     * Login user
     */
    async login(data: LoginData): Promise<LoginResponse> {
        try {
            const response = await this.api.post<LoginResponse>('/v1/auth/login', data);
            const { access_token, user } = response.data;

            // Store token in localStorage
            this.setToken(access_token);

            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.detail || 'Login failed';
            throw new Error(message);
        }
    }

    /**
     * Get current user profile
     */
    async getProfile(): Promise<User> {
        try {
            const response = await this.api.get<User>('/v1/auth/me');
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.detail || 'Failed to fetch profile';
            throw new Error(message);
        }
    }

    /**
     * Logout user
     */
    logout(): void {
        this.clearToken();
        window.location.href = '/#/login';
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    /**
     * Get stored token
     */
    getToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    /**
     * Store token
     */
    private setToken(token: string): void {
        localStorage.setItem('auth_token', token);
    }

    /**
     * Clear stored token
     */
    private clearToken(): void {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('avatar_user'); // Legacy cleanup
    }
}

// Export singleton instance
const authService = new AuthService();
export default authService;
