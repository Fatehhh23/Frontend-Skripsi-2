import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();

  // Pastikan file logo ada di folder: public/assets/logo-avatar.png
  const LOGO_PATH = '/assets/logo-avatar.png';

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Tentang', path: '/about' },
    ...(isAuthenticated ? [{ name: 'Dashboard', path: '/dashboard' }] : []),
    { name: 'Fax (Kontak)', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* === LOGO SECTION (Sesuai Request Struktur) === */}
          <Link to="/" className="flex items-center gap-3 group">

            {/* Container Logo dengan Struktur Custom Anda */}
            {/* Ukuran disesuaikan ke w-12 h-12 (48px) agar muat di navbar. 
                Jika ingin sedikit lebih besar, ubah ke w-14 h-14 atau w-16 h-16 */}
            <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 transition-transform duration-300 group-hover:scale-105">

              {/* Efek Glow / Blur di belakang (Sesuai request) */}
              <div className="absolute inset-0 bg-blue-400 rounded-full blur-lg opacity-40 animate-pulse group-hover:opacity-60 transition-opacity"></div>

              {/* Gambar Logo */}
              <img
                src={LOGO_PATH}
                alt="AVATAR Logo"
                className="relative w-full h-full object-contain drop-shadow-lg z-10"
                onError={(e) => {
                  // Fallback jika gambar tidak ditemukan
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement?.classList.add('bg-blue-100');
                }}
              />
            </div>

            {/* Teks Logo */}
            <span className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
              AVATAR
            </span>
          </Link>


          {/* === DESKTOP NAVIGATION === */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${isActive(link.path)
                    ? 'text-blue-600 font-semibold'
                    : 'text-slate-500 hover:text-blue-600'
                  }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Login / Logout Button */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                <span className="text-sm text-slate-600 hidden lg:block">Halo, {user?.name}</span>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline">Keluar</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5"
              >
                <LogIn className="w-4 h-4" />
                Masuk
              </Link>
            )}
          </div>

          {/* === MOBILE MENU BUTTON === */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* === MOBILE NAVIGATION MENU === */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 shadow-lg animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${isActive(link.path)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4 mt-4 border-t border-slate-100">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="px-4 text-sm text-slate-500">Masuk sebagai {user?.name}</div>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-base font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100"
                  >
                    <LogOut className="w-5 h-5" />
                    Keluar
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-base font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                >
                  <LogIn className="w-5 h-5" />
                  Masuk Akun
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
