import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, Clock, Trash2, Search, ExternalLink, AlertCircle } from 'lucide-react';
import apiService, { ContactMessageResponse } from '../services/api';

const AdminMessages: React.FC = () => {
    const [messages, setMessages] = useState<ContactMessageResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'unread' | 'resolved'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchMessages = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiService.getAdminContactMessages(filter === 'all' ? undefined : filter);
            setMessages(data);
        } catch (err: any) {
            setError(err.message || 'Gagal memuat pesan');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [filter]);

    const handleStatusChange = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'unread' ? 'resolved' : 'unread';
        try {
            await apiService.updateContactMessageStatus(id, newStatus);
            // Refresh list
            fetchMessages();
        } catch (err: any) {
            alert(err.message || 'Gagal mengubah status');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus pesan ini? Tindakan ini tidak dapat dibatalkan.')) {
            try {
                await apiService.deleteContactMessage(id);
                // Refresh list
                fetchMessages();
            } catch (err: any) {
                alert(err.message || 'Gagal menghapus pesan');
            }
        }
    };

    const filteredMessages = messages.filter(msg =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-slate-50 min-h-screen p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Pesan Masuk</h1>
                        <p className="text-slate-500 mt-1">Kelola pesan dan masukan dari pengguna platform</p>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            Semua
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'unread' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                        >
                            Belum Dibaca
                        </button>
                        <button
                            onClick={() => setFilter('resolved')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'resolved' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
                        >
                            Selesai
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari pesan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                        />
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        {error}
                    </div>
                ) : filteredMessages.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
                        <Mail className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                        <p className="text-lg font-medium text-slate-700">Tidak ada pesan ditemukan</p>
                        <p className="text-sm">Cobalah mengubah filter atau kata kunci pencarian</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredMessages.map((msg) => (
                            <div key={msg.id} className={`bg-white rounded-xl shadow-sm border-l-4 p-6 transition-all hover:shadow-md ${msg.status === 'unread' ? 'border-l-blue-500' : 'border-l-green-500'}`}>
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">

                                    {/* Message Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            {msg.status === 'unread' ?
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    <Clock className="w-3 h-3 mr-1" /> Baru
                                                </span> :
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <CheckCircle className="w-3 h-3 mr-1" /> Selesai
                                                </span>
                                            }
                                            <span className="text-sm text-slate-500">
                                                {new Date(msg.created_at).toLocaleString('id-ID', {
                                                    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-slate-900 mb-1">{msg.subject}</h3>

                                        <div className="flex items-center text-sm text-slate-600 mb-4">
                                            <span className="font-medium mr-2">{msg.name}</span>
                                            <a href={`mailto:${msg.email}`} className="text-blue-600 hover:underline flex items-center">
                                                ({msg.email}) <ExternalLink className="w-3 h-3 ml-1" />
                                            </a>
                                        </div>

                                        <div className="bg-slate-50 p-4 rounded-lg text-slate-700 text-sm whitespace-pre-wrap">
                                            {msg.message}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex md:flex-col gap-2 min-w-[140px] pt-2">
                                        <button
                                            onClick={() => handleStatusChange(msg.id, msg.status)}
                                            className={`w-full flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${msg.status === 'unread'
                                                ? 'border-green-200 text-green-700 bg-green-50 hover:bg-green-100'
                                                : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                                                }`}
                                        >
                                            {msg.status === 'unread' ? (
                                                <><CheckCircle className="w-4 h-4 mr-2" /> Tandai Selesai</>
                                            ) : (
                                                <><Clock className="w-4 h-4 mr-2" /> Tandai Belum Dibaca</>
                                            )}
                                        </button>
                                        <a
                                            href={`mailto:${msg.email}?subject=RE: ${msg.subject}`}
                                            className="w-full flex items-center justify-center px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                                        >
                                            <Mail className="w-4 h-4 mr-2" /> Balas Email
                                        </a>
                                        <button
                                            onClick={() => handleDelete(msg.id)}
                                            className="w-full flex items-center justify-center px-4 py-2 border border-red-200 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" /> Hapus
                                        </button>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminMessages;
