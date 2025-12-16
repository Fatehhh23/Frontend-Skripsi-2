# AVATAR - WebGIS Simulasi Prediksi Tsunami Selat Sunda

## Deskripsi Proyek

WebGIS Simulasi Prediksi Tsunami Selat Sunda dengan Integrasi Model Self-Supervised Learning, Vision Transformer (ViT), dan Convolutional Neural Network (CNN) untuk prediksi real-time.

Proyek ini adalah sistem peringatan dini tsunami berbasis web yang mengintegrasikan:
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Mapping**: ArcGIS Maps SDK for JavaScript (3D SceneView)
- **Visualization**: Recharts untuk grafik temporal
- **Backend Integration**: FastAPI dengan model AI (SSL-ViT-CNN)

## Fitur Utama

### 1. Real-Time Monitoring
- Pemantauan gempa bumi secara real-time dari API BMKG
- Analisis risiko tsunami otomatis
- Visualisasi epicenter pada peta 3D
- Status monitoring dengan auto-refresh

### 2. Simulasi Manual
- Input parameter gempa (magnitudo, kedalaman, koordinat)
- Validasi input client-side
- Preset lokasi untuk quick access
- Visualisasi hasil prediksi real-time

### 3. Visualisasi 3D
- Peta interaktif dengan ArcGIS SceneView
- Zona genangan tsunami dengan color-coding
- Marker epicenter gempa
- Legend dinamis

### 4. Analisis Data
- Grafik tinggi gelombang vs waktu
- Area chart untuk zona genangan
- Panel informasi dinamis dengan countdown timer
- Statistik lengkap (ETA, tinggi gelombang, area terdampak)

## Tech Stack

### Frontend
- **React 19.2.0** - UI framework
- **TypeScript 5.8.2** - Type safety
- **Vite 6.4.1** - Build tool & dev server
- **Tailwind CSS 3.4.17** - Styling
- **ArcGIS Maps SDK 4.34.8** - Geospatial visualization
- **Recharts 3.4.1** - Data visualization
- **Axios 1.7.0** - HTTP client
- **Lucide React 0.554.0** - Icons
- **React Router DOM 7.9.6** - Routing

### Backend (Terpisah)
- FastAPI - REST API
- PyTorch - Deep Learning framework
- GeoPandas - Geospatial data processing
- PostgreSQL + PostGIS - Spatial database

## Struktur Folder

```
Web Avatar/
├── components/          # Komponen React reusable
│   ├── MapComponent.tsx       # ArcGIS 3D map
│   ├── SimulationForm.tsx     # Form input parameter
│   ├── PredictionPanel.tsx    # Panel hasil prediksi
│   ├── ChartComponent.tsx     # Grafik temporal
│   ├── Navbar.tsx             # Navigation bar
│   └── Footer.tsx             # Footer
├── pages/               # Halaman aplikasi
│   ├── Dashboard.tsx          # Halaman utama
│   ├── SimulationPage.tsx     # Halaman simulasi lengkap
│   ├── Home.tsx               # Landing page
│   └── About.tsx              # Tentang proyek
├── services/            # API services
│   └── api.ts                 # Axios service layer
├── context/             # React Context
├── styles/              # CSS files
│   └── animations.css         # Custom animations
├── public/              # Static assets
├── App.tsx              # Root component
├── index.tsx            # Entry point
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies
```

## Prerequisites

Pastikan sudah terinstall:
- **Node.js** (v18 atau lebih baru)
- **npm** atau **yarn**
- **Git**

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/Fatehhh23/Frontend-Skripsi-2.git
cd Frontend-Skripsi-2/"Web Avatar"
```

### 2. Install Dependencies

```bash
npm install
```

Jika ada error terkait peer dependencies, gunakan:

```bash
npm install --legacy-peer-deps
```

### 3. Setup Environment Variables

```bash
# Copy file .env.example ke .env
cp .env.example .env
```

Edit `.env` dan sesuaikan:

```env
# Backend API URL (sesuaikan dengan backend kamu)
REACT_APP_API_URL=http://localhost:8000/api

# Gemini API Key (opsional)
GEMINI_API_KEY=your_gemini_api_key_here

# ArcGIS API Key (opsional)
ARCGIS_API_KEY=your_arcgis_api_key_here
```

### 4. Import Custom CSS

Tambahkan di `index.tsx` atau `App.tsx`:

```typescript
import './styles/animations.css';
```

## Running the Application

### Development Mode

```bash
npm run dev
```

Aplikasi akan berjalan di:
- **Localhost**: `http://localhost:3000`
- **Network**: `http://[IP-ADDRESS]:3000`

Vite akan menampilkan kedua URL di terminal.

### Build untuk Production

```bash
npm run build
```

Hasil build akan ada di folder `dist/`.

### Preview Build

```bash
npm run preview
```

## Akses dari Perangkat Lain (Network)

### Windows

1. Cari IP address komputer:
   ```cmd
   ipconfig
   ```
   Cari **IPv4 Address** (contoh: `192.168.1.10`)

2. Pastikan firewall tidak memblokir port 3000:
   - Windows Defender Firewall
   - Allow inbound connections untuk port 3000

3. Dari perangkat lain di jaringan yang sama, akses:
   ```
   http://192.168.1.10:3000
   ```

### Linux/Mac

1. Cari IP address:
   ```bash
   ifconfig
   # atau
   ip addr show
   ```

2. Akses dari perangkat lain:
   ```
   http://[IP-ADDRESS]:3000
   ```

## Konfigurasi Backend

Untuk menghubungkan dengan backend FastAPI:

1. Pastikan backend sudah berjalan di `http://localhost:8000`

2. Update file `.env`:
   ```env
   REACT_APP_API_URL=http://localhost:8000/api
   ```

3. Endpoint yang dibutuhkan:
   - `POST /api/simulation/run` - Jalankan simulasi
   - `GET /api/earthquakes/realtime` - Data gempa real-time
   - `GET /api/simulation/history` - Riwayat simulasi
   - `GET /api/health` - Health check

## Demo Mode (Tanpa Backend)

Aplikasi memiliki **fallback demo data** yang akan aktif jika backend tidak tersedia. Fitur ini berguna untuk:
- Testing frontend tanpa backend
- Demo presentasi
- Development awal

Demo data akan otomatis muncul saat API request gagal.

## Troubleshooting

### Port 3000 sudah digunakan

Edit `vite.config.ts` dan ubah port:

```typescript
export default defineConfig({
  server: {
    port: 3001, // Ubah ke port lain
    host: "0.0.0.0",
  },
  // ...
});
```

### Module not found errors

```bash
# Hapus node_modules dan install ulang
rm -rf node_modules package-lock.json
npm install
```

### ArcGIS loading issues

Pastikan koneksi internet stabil (ArcGIS SDK membutuhkan CDN).

### CORS errors

Tambahkan CORS middleware di backend FastAPI:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Deployment

### Vercel (Recommended untuk Frontend)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Set environment variables di Vercel dashboard

### Netlify

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Set environment variables di Netlify dashboard

## Komponen Sesuai Proposal Skripsi

| Komponen Proposal | Status | File |
|------------------|--------|------|
| Visualisasi Geospasial 3D | ✅ | `MapComponent.tsx` |
| Form Input Parameter | ✅ | `SimulationForm.tsx` |
| Panel Informasi Dinamis | ✅ | `PredictionPanel.tsx` |
| Grafik Temporal | ✅ | `ChartComponent.tsx` |
| Integrasi API Backend | ✅ | `services/api.ts` |
| Real-Time Monitoring | ✅ | `Dashboard.tsx` |
| Simulasi Manual | ✅ | `Dashboard.tsx` |

## Kontribusi

Untuk kontribusi atau bug report, silakan buat issue di GitHub repository.

## Lisensi

Proyek ini adalah bagian dari Tugas Akhir/Skripsi dan tidak untuk dipublikasikan secara komersial.

## Kontak

**Muhamad Fatih Rizqi**  
Jurusan Teknik Elektro  
Fakultas Teknik  
Universitas Lampung  
2025

---

**AVATAR** - Advanced Visualization & Analysis for Tsunami Alert Response
