import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Activity, BarChart3, TrendingUp } from 'lucide-react';
import adminService, { SystemStats } from '../services/adminService';

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<SystemStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await adminService.getStats();
            setStats(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading statistics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                    <h3 className="text-red-800 font-semibold mb-2">Error Loading Dashboard</h3>
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={loadStats}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="mt-2 text-gray-600">System overview and management</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Total Users */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Users</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.total_users || 0}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Users className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="text-green-600 font-medium">{stats?.active_users || 0} active</span>
                            <span className="text-gray-500 ml-2">• {stats?.admin_users || 0} admins</span>
                        </div>
                    </div>

                    {/* Total Simulations */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Simulations</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.total_simulations || 0}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Activity className="h-8 w-8 text-green-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="text-green-600 font-medium">
                                +{stats?.recent_simulations_24h || 0}
                            </span>
                            <span className="text-gray-500 ml-2">in last 24h</span>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">New Users (24h)</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {stats?.recent_registrations_24h || 0}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <TrendingUp className="h-8 w-8 text-purple-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="text-gray-500">New registrations</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow mb-8">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link
                                to="/admin/users"
                                className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                            >
                                <Users className="h-6 w-6 text-blue-600 mr-3" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Manage Users</h3>
                                    <p className="text-sm text-gray-600">View and manage all user accounts</p>
                                </div>
                            </Link>

                            <button
                                onClick={loadStats}
                                className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
                            >
                                <BarChart3 className="h-6 w-6 text-green-600 mr-3" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Refresh Stats</h3>
                                    <p className="text-sm text-gray-600">Update dashboard statistics</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* System Info */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">System Information</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-600 mb-2">User Statistics</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Total Users:</span>
                                        <span className="font-semibold">{stats?.total_users || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Active Users:</span>
                                        <span className="font-semibold text-green-600">{stats?.active_users || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Administrators:</span>
                                        <span className="font-semibold text-blue-600">{stats?.admin_users || 0}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-600 mb-2">Activity Statistics</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Total Simulations:</span>
                                        <span className="font-semibold">{stats?.total_simulations || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Recent Simulations:</span>
                                        <span className="font-semibold text-green-600">
                                            {stats?.recent_simulations_24h || 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Recent Registrations:</span>
                                        <span className="font-semibold text-purple-600">
                                            {stats?.recent_registrations_24h || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
