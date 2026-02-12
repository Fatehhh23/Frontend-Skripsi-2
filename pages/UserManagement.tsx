import React, { useEffect, useState } from 'react';
import { Search, Trash2, Shield, ShieldOff, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import adminService, { UserListItem } from '../services/adminService';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<UserListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [pageSize] = useState(20);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        loadUsers();
    }, [page, search, roleFilter]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await adminService.getUsers(
                page,
                pageSize,
                search || undefined,
                roleFilter || undefined
            );
            setUsers(data.users);
            setTotalUsers(data.total);
        } catch (err: any) {
            setError(err.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId: string, email: string) => {
        if (!confirm(`Are you sure you want to delete user "${email}"? This action cannot be undone.`)) {
            return;
        }

        try {
            setActionLoading(userId);
            await adminService.deleteUser(userId);
            await loadUsers(); // Reload list
        } catch (err: any) {
            alert(`Failed to delete user: ${err.message}`);
        } finally {
            setActionLoading(null);
        }
    };

    const handleToggleRole = async (userId: string, currentRole: string, username: string) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        if (!confirm(`Change role of "${username}" to ${newRole.toUpperCase()}?`)) {
            return;
        }

        try {
            setActionLoading(userId);
            await adminService.updateUserRole(userId, newRole as 'user' | 'admin');
            await loadUsers();
        } catch (err: any) {
            alert(`Failed to update role: ${err.message}`);
        } finally {
            setActionLoading(null);
        }
    };

    const handleToggleStatus = async (userId: string, currentStatus: boolean, username: string) => {
        const newStatus = !currentStatus;
        const action = newStatus ? 'activate' : 'deactivate';
        if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} user "${username}"?`)) {
            return;
        }

        try {
            setActionLoading(userId);
            await adminService.updateUserStatus(userId, newStatus);
            await loadUsers();
        } catch (err: any) {
            alert(`Failed to update status: ${err.message}`);
        } finally {
            setActionLoading(null);
        }
    };

    const totalPages = Math.ceil(totalUsers / pageSize);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="mt-2 text-gray-600">Manage user accounts and permissions</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow mb-6 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by email or username..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Role Filter */}
                        <select
                            value={roleFilter}
                            onChange={(e) => {
                                setRoleFilter(e.target.value);
                                setPage(1);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Roles</option>
                            <option value="user">Users</option>
                            <option value="admin">Admins</option>
                        </select>

                        {/* Refresh Button */}
                        <button
                            onClick={loadUsers}
                            disabled={loading}
                            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading && users.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                            </div>
                                            <p className="mt-2 text-gray-500">Loading users...</p>
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                    {user.full_name && (
                                                        <div className="text-xs text-gray-400">{user.full_name}</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin'
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    {user.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${user.is_active
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}
                                                >
                                                    {user.is_active ? (
                                                        <>
                                                            <CheckCircle className="h-3 w-3 mr-1" /> Active
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="h-3 w-3 mr-1" /> Inactive
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-2">
                                                    {/* Toggle Role Button */}
                                                    <button
                                                        onClick={() => handleToggleRole(user.id, user.role, user.username)}
                                                        disabled={actionLoading === user.id}
                                                        className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title={`Change to ${user.role === 'admin' ? 'user' : 'admin'}`}
                                                    >
                                                        {user.role === 'admin' ? (
                                                            <ShieldOff className="h-4 w-4" />
                                                        ) : (
                                                            <Shield className="h-4 w-4" />
                                                        )}
                                                    </button>

                                                    {/* Toggle Status Button */}
                                                    <button
                                                        onClick={() => handleToggleStatus(user.id, user.is_active, user.username)}
                                                        disabled={actionLoading === user.id}
                                                        className={`p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${user.is_active
                                                                ? 'text-orange-600 hover:bg-orange-100'
                                                                : 'text-green-600 hover:bg-green-100'
                                                            }`}
                                                        title={user.is_active ? 'Deactivate' : 'Activate'}
                                                    >
                                                        {user.is_active ? (
                                                            <XCircle className="h-4 w-4" />
                                                        ) : (
                                                            <CheckCircle className="h-4 w-4" />
                                                        )}
                                                    </button>

                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => handleDelete(user.id, user.email)}
                                                        disabled={actionLoading === user.id}
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Delete user"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalUsers)} of{' '}
                                    {totalUsers} users
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setPage(page - 1)}
                                        disabled={page === 1}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <div className="flex items-center px-4 py-2 text-sm text-gray-700">
                                        Page {page} of {totalPages}
                                    </div>
                                    <button
                                        onClick={() => setPage(page + 1)}
                                        disabled={page === totalPages}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
