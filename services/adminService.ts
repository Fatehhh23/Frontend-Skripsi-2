import axios, { AxiosInstance } from 'axios';

// ============================================
// INTERFACES
// ============================================

export interface UserListItem {
    id: string;
    email: string;
    username: string;
    full_name: string | null;
    role: string;
    is_active: boolean;
    is_verified: boolean;
    created_at: string;
    last_login: string | null;
}

export interface UserListResponse {
    users: UserListItem[];
    total: number;
    page: number;
    page_size: number;
}

export interface SystemStats {
    total_users: number;
    active_users: number;
    admin_users: number;
    total_simulations: number;
    recent_registrations_24h: number;
    recent_simulations_24h: number;
}

export interface SimulationListItem {
    id: string;
    magnitude: number;
    depth: number;
    latitude: number;
    longitude: number;
    created_at: string;
    user_session_id: string | null;
    processing_time_ms: number | null;
}

export interface SimulationListResponse {
    simulations: SimulationListItem[];
    total: number;
    page: number;
    page_size: number;
}

export interface UpdateRoleRequest {
    role: 'user' | 'admin';
}

export interface UpdateStatusRequest {
    is_active: boolean;
}

// ============================================
// ADMIN SERVICE
// ============================================

class AdminService {
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
                    window.location.href = '/#/login';
                } else if (error.response?.status === 403) {
                    // Forbidden - not admin
                    window.location.href = '/#/dashboard';
                }
                return Promise.reject(error);
            }
        );
    }

    private getToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    /**
     * Get all users with pagination and filtering
     */
    async getUsers(
        page: number = 1,
        pageSize: number = 20,
        search?: string,
        roleFilter?: string
    ): Promise<UserListResponse> {
        try {
            const params: any = { page, page_size: pageSize };
            if (search) params.search = search;
            if (roleFilter) params.role_filter = roleFilter;

            const response = await this.api.get<UserListResponse>('/v1/admin/users', { params });
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.detail || 'Failed to fetch users';
            throw new Error(message);
        }
    }

    /**
     * Delete a user
     */
    async deleteUser(userId: string): Promise<void> {
        try {
            await this.api.delete(`/v1/admin/users/${userId}`);
        } catch (error: any) {
            const message = error.response?.data?.detail || 'Failed to delete user';
            throw new Error(message);
        }
    }

    /**
     * Update user role
     */
    async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<UserListItem> {
        try {
            const response = await this.api.put(`/v1/admin/users/${userId}/role`, { role });
            return response.data.user;
        } catch (error: any) {
            const message = error.response?.data?.detail || 'Failed to update user role';
            throw new Error(message);
        }
    }

    /**
     * Update user status (activate/deactivate)
     */
    async updateUserStatus(userId: string, isActive: boolean): Promise<UserListItem> {
        try {
            const response = await this.api.put(`/v1/admin/users/${userId}/status`, {
                is_active: isActive
            });
            return response.data.user;
        } catch (error: any) {
            const message = error.response?.data?.detail || 'Failed to update user status';
            throw new Error(message);
        }
    }

    /**
     * Get system statistics
     */
    async getStats(): Promise<SystemStats> {
        try {
            const response = await this.api.get<SystemStats>('/v1/admin/stats');
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.detail || 'Failed to fetch statistics';
            throw new Error(message);
        }
    }

    /**
     * Get all simulations (from all users)
     */
    async getAllSimulations(
        page: number = 1,
        pageSize: number = 20
    ): Promise<SimulationListResponse> {
        try {
            const response = await this.api.get<SimulationListResponse>('/v1/admin/simulations', {
                params: { page, page_size: pageSize }
            });
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.detail || 'Failed to fetch simulations';
            throw new Error(message);
        }
    }
}

// Export singleton instance
const adminService = new AdminService();
export default adminService;
