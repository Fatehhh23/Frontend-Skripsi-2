import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Map, BarChart3, ArrowRight, Waves, Globe, Zap } from 'lucide-react';


const Home: React.FC = () => {
  return (
    <div className="bg-white min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 lg:pt-32 lg:pb-16 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-cyan-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>


        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            
            {/* Text Content */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold tracking-wide uppercase mb-6 border border-blue-100">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
                WebGIS Tsunami Early Warning
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                AVATAR
              </h1>
              <h2 className="text-2xl lg:text-3xl font-medium text-slate-700 mb-6 leading-snug">
                Analisis Visual Akurat Tsunami & Analisis Risiko
              </h2>
              
              <p className="text-lg text-slate-500 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                AVATAR adalah platform berbasis web yang dirancang untuk menyajikan simulasi dan analisis risiko tsunami secara visual, interaktif, dan mudah dipahami. Melalui integrasi WebGIS, model Convolutional Neural Network (CNN), serta data gempa Real-Time dari lembaga resmi, AVATAR membantu pengguna memantau potensi bahaya tsunami dan memahami zona risiko secara lebih intuitif.
              </p>


              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-12">
                <Link 
                  to="/dashboard" 
                  className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-full text-white bg-slate-900 hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
                >
                  Mulai Simulasi
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/about" 
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-full text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300"
                >
                  Pelajari Selengkapnya
                </Link>
              </div>
            </div>


            {/* Visual/Logo Composition */}
            <div className="lg:col-span-5 mt-12 lg:mt-0">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-200 to-cyan-200 rounded-full blur-[60px] opacity-30"></div>
                
                {/* Logo AVATAR Baru */}
                <div className="relative w-full max-w-md flex flex-col items-center text-center">
                  
                  {/* Logo Image */}
                  <div className="mb-0 relative flex items-center justify-center" style={{ width: '500px', height: '500px' }}>
                    <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <img 
                      src="/assets/logo-avatar.png" 
                      alt="AVATAR Logo" 
                      className="relative w-full h-full object-contain drop-shadow-2xl"
                    />
                  </div>
                  
                  {/* Text positioned at button level */}
                  <div className="w-full relative z-10" style={{ marginTop: '-80px' }}>
                    <h3 className="text-3xl font-bold text-slate-900 drop-shadow-md">AVATAR</h3>
                    <p className="text-slate-700 text-base mt-2 font-medium drop-shadow-sm">Mitigasi Bencana Berbasis AI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Minimalist Features Grid - Jarak dikurangi dari mt-20 jadi mt-12 */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border border-transparent hover:border-slate-100 group">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform text-blue-600">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Simulasi Manual</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Simulasi manual berdasarkan parameter gempa (magnitudo, kedalaman, koordinat episenter).
              </p>
            </div>


            <div className="p-6 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border border-transparent hover:border-slate-100 group">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform text-red-500">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Analisis Real-Time</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Analisis Real-Time dari data gempa resmi (BMKG/NOAA) dengan pembaruan otomatis.
              </p>
            </div>


            <div className="p-6 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border border-transparent hover:border-slate-100 group">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform text-green-500">
                <Map className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Visualisasi WebGIS</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Visualisasi peta interaktif berbasis ArcGIS dengan zona risiko dan area terdampak.
              </p>
            </div>


            <div className="p-6 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border border-transparent hover:border-slate-100 group">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform text-purple-500">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Grafik & Statistik</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Grafik tren tinggi gelombang, estimasi waktu tiba tsunami, dan ringkasan statistik.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Dedicated Logo Section - Jarak dikurangi dari py-24 jadi py-16 */}
      <section className="py-16 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="mb-8 flex justify-center">
             <div className="flex items-center space-x-1 opacity-20">
                <div className="h-1 w-1 bg-slate-900 rounded-full"></div>
                <div className="h-1 w-16 bg-slate-900 rounded-full"></div>
                <div className="h-1 w-1 bg-slate-900 rounded-full"></div>
             </div>
          </div>
          
          <div className="inline-block">
            <img 
              src="/assets/logo-avatar.png" 
              alt="AVATAR Logo" 
              className="w-64 h-64 object-contain"
            />
          </div>
          
          <h2 className="text-2xl font-serif italic text-slate-800 mb-6 mt-6">
            "Logo AVATAR merepresentasikan gelombang tsunami, globe untuk pemetaan global, dan grafik analisis data yang berpadu dalam satu platform mitigasi bencana."
          </h2>
          
          <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full opacity-50"></div>
        </div>
      </section>
    </div>
  );
};


export default Home;
