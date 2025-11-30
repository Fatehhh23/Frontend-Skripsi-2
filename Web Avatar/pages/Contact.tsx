import React from 'react';
import { Mail, Phone, User, School, Send, MapPin } from 'lucide-react';


const Contact: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Kontak & Informasi AVATAR</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Halaman ini disediakan untuk memudahkan komunikasi terkait pengembangan, penggunaan, dan saran perbaikan platform AVATAR.
          </p>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
{/* Branding Card - Logo dan Border Sama Ukuran */}
<div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
  <div className="relative z-10 flex flex-col items-center text-center">
   {/* Force Logo Fill Container */}
<div className="mb-6 bg-white rounded-full shadow-lg overflow-hidden flex items-center justify-center" style={{ width: '160px', height: '160px' }}>
  <img 
    src="/assets/logo-avatar.png" 
    alt="AVATAR Logo" 
    style={{ 
      width: '180%', 
      height: '180%', 
      objectFit: 'cover',
      objectPosition: 'center'
    }}
  />
</div>


    
    <h2 className="text-2xl font-bold mb-4">Identitas Visual</h2>
    <p className="text-slate-300 italic leading-relaxed">
      "Logo AVATAR menjadi identitas visual sistem, menggambarkan sinergi antara data gempa, model prediksi, dan peta risiko tsunami."
    </p>
  </div>
  <div className="absolute bottom-0 right-0 -mb-10 -mr-10 w-40 h-40 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
</div>



            {/* Institution Info */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                <School className="mr-2 h-5 w-5 text-blue-600" />
                Informasi Institusi
              </h3>
              <div className="space-y-4 text-sm text-slate-600">
                <div className="pb-3 border-b border-slate-100">
                  <span className="block font-semibold text-slate-900 mb-1">Nama Aplikasi</span>
                  AVATAR – Analisis Visual Akurat Tsunami & Analisis Risiko
                </div>
                <div className="pb-3 border-b border-slate-100">
                  <span className="block font-semibold text-slate-900 mb-1">Institusi</span>
                  Jurusan Teknik Elektro, Fakultas Teknik, Universitas Lampung
                </div>
                <div>
                  <span className="block font-semibold text-slate-900 mb-1">Wilayah Fokus</span>
                  Selat Sunda dan sekitarnya
                </div>
              </div>
            </div>


            {/* Developer Info */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
               <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                <User className="mr-2 h-5 w-5 text-green-600" />
                Kontak Pengembang
              </h3>
              <div className="space-y-4">
                <div className="flex items-center group">
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mr-4 group-hover:bg-blue-50 transition-colors">
                    <User className="h-5 w-5 text-slate-600 group-hover:text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Nama Pengembang</p>
                    <p className="text-slate-900 font-medium">Muhamad Fatih Rizqi</p>
                  </div>
                </div>


                <div className="flex items-center group">
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mr-4 group-hover:bg-blue-50 transition-colors">
                    <Mail className="h-5 w-5 text-slate-600 group-hover:text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Email</p>
                    <a href="mailto:fatih.rizqi@example.com" className="text-slate-900 font-medium hover:text-blue-600">fatih.rizqi@example.com</a>
                  </div>
                </div>


                <div className="flex items-center group">
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mr-4 group-hover:bg-blue-50 transition-colors">
                    <Phone className="h-5 w-5 text-slate-600 group-hover:text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Telepon/WhatsApp</p>
                    <p className="text-slate-900 font-medium">08xxxxxxxxxx</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-800 leading-relaxed">
                  Untuk kebutuhan akademik dan kolaborasi penelitian, silakan menghubungi melalui email resmi atau melalui dosen pembimbing yang tercantum pada dokumen skripsi.
                </div>
              </div>
            </div>
          </div>


          {/* Right Column: Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 lg:p-10 h-full">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Kirimi Kami Pesan</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Nama Lengkap</label>
                    <input type="text" className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="Masukkan nama anda" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Email</label>
                    <input type="email" className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="email@contoh.com" />
                  </div>
                </div>


                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Subjek</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="Apa yang ingin anda diskusikan?" />
                </div>


                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Pesan</label>
                  <textarea rows={6} className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none" placeholder="Tulis pesan anda disini..."></textarea>
                </div>


                <button type="button" className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/25 flex justify-center items-center">
                  <Send className="h-5 w-5 mr-2" />
                  Kirim Pesan
                </button>
                
                <p className="text-xs text-slate-400 text-center mt-4">
                  Dengan mengirim pesan ini, Anda menyetujui bahwa informasi yang Anda isi akan digunakan untuk keperluan komunikasi terkait platform AVATAR.
                </p>
              </form>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};


export default Contact;
