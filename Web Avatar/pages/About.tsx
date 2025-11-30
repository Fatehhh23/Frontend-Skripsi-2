import React from 'react';
import { Sliders, Radio, Map, PieChart, History, CheckCircle, ArrowRight } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-6">Tentang AVATAR</h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            AVATAR (Analisis Visual Akurat Tsunami & Analisis Risiko) adalah prototipe sistem informasi kebencanaan berbasis WebGIS yang fokus pada wilayah Selat Sunda. Sistem ini menggabungkan peta interaktif, model prediksi tsunami berbasis CNN, serta data real-time dari API eksternal untuk menyajikan informasi risiko tsunami secara cepat dan komprehensif.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-24">
          <h2 className="text-2xl font-bold text-slate-900 mb-10 text-center">Fitur Utama AVATAR</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <FeatureCard 
              icon={<Sliders className="h-6 w-6 text-white" />}
              color="bg-blue-500"
              title="Simulasi Manual Tsunami"
              description="Pengguna dapat memasukkan parameter gempa seperti magnitudo, kedalaman, dan koordinat episenter untuk menjalankan skenario simulasi tsunami secara mandiri dan melihat dampaknya pada peta."
            />

            <FeatureCard 
              icon={<Radio className="h-6 w-6 text-white" />}
              color="bg-red-500"
              title="Analisis Real-Time"
              description="Sistem mengambil data gempa terkini dari API lembaga resmi (misalnya BMKG/NOAA) dan secara otomatis menjalankan prediksi tsunami, menampilkan peta risiko dan status peringatan di dashboard."
            />

            <FeatureCard 
              icon={<Map className="h-6 w-6 text-white" />}
              color="bg-emerald-500"
              title="WebGIS Peta Risiko Interaktif"
              description="AVATAR menampilkan zona risiko tsunami dalam bentuk poligon berwarna, marker episenter, dan informasi detail melalui pop-up, sehingga pengguna dapat membaca tingkat bahaya di lokasi tertentu dengan cepat."
            />

            <FeatureCard 
              icon={<PieChart className="h-6 w-6 text-white" />}
              color="bg-purple-500"
              title="Grafik dan Statistik Prediksi"
              description="Output model CNN ditampilkan dalam bentuk grafik tren, kartu statistik tinggi gelombang maksimum, estimasi waktu tiba tsunami (ETA), dan luas area terdampak untuk mendukung analisis kuantitatif."
            />

            <FeatureCard 
              icon={<History className="h-6 w-6 text-white" />}
              color="bg-orange-500"
              title="Riwayat Simulasi dan Analisis"
              description="Setiap simulasi dan hasil analisis tersimpan dalam basis data sehingga dapat ditinjau kembali untuk keperluan pembelajaran, evaluasi, maupun penelitian lanjutan."
            />
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 md:p-12 lg:p-16 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Manfaatkan Platform AVATAR</h2>
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <p className="text-slate-600 leading-relaxed mb-6 text-lg">
                  Manfaatkan platform AVATAR untuk menjalankan simulasi akurat dan mempersiapkan mitigasi bencana. Dengan visualisasi peta yang intuitif dan data prediksi yang terstruktur, AVATAR dapat digunakan sebagai media edukasi bagi masyarakat, alat bantu analisis bagi mahasiswa dan peneliti, serta referensi awal bagi pemangku kepentingan dalam merencanakan strategi pengurangan risiko bencana tsunami.
                </p>
                <button className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  Mulai Eksplorasi <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                {[
                  "Meningkatkan pemahaman visual terhadap zona bahaya tsunami di wilayah Selat Sunda.",
                  "Menyediakan sarana eksperimen skenario gempa untuk pembelajaran dan penelitian.",
                  "Mendukung pengambilan keputusan cepat dengan informasi spasial dan statistik yang terintegrasi."
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start group">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-blue-500 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <span className="ml-3 text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Decoration */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
        </div>

      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; color: string; title: string; description: string }> = ({ icon, color, title, description }) => (
  <div className="group bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-500 leading-relaxed text-sm">{description}</p>
  </div>
);

export default About;