import React from 'react';

const Footer: React.FC = () => {
  const LOGO_PATH = '/assets/logo-avatar.png';

  return (
    <footer className="bg-slate-900 text-white py-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* === BAGIAN KIRI: Logo & Nama === */}
          <div className="flex items-center space-x-3">
            
            {/* Container Logo */}
            <div className="w-10 h-10 relative flex items-center justify-center bg-white rounded-full shadow-lg overflow-hidden">
              <img 
                src={LOGO_PATH} 
                alt="AVATAR WebGIS Logo" 
                // PERBAIKAN:
                // 1. w-[110%] h-[110%]: Memaksa ukuran gambar lebih besar dari containernya
                // 2. object-cover: Memastikan gambar menutupi seluruh area
                // 3. -m-[5%]: Margin negatif untuk menengahkan gambar yang diperbesar
                className="w-[160%] h-[160%] max-w-none object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement?.classList.replace('bg-white', 'bg-blue-600');
                }}
              />
            </div>
            
            <span className="text-lg font-bold tracking-wide text-slate-100">
              AVATAR WebGIS
            </span>
          </div>

          {/* === BAGIAN KANAN: Copyright & Info === */}
          <div className="text-center md:text-right space-y-1">
            <p className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} Universitas Lampung. Jurusan Teknik Elektro.
            </p>
            <p className="text-xs text-slate-500">
              Dikembangkan oleh Muhamad Fatih Rizqi
            </p>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
