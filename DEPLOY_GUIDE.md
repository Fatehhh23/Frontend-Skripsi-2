# 📘 Panduan Deploy Frontend AVATAR ke Netlify

Panduan lengkap untuk deploy aplikasi frontend AVATAR Tsunami Prediction System ke Netlify.

---

## 📋 Persiapan

### 1. Pastikan Code Sudah di GitHub

```powershell
# Masuk ke folder frontend
cd "c:\Skripsi_Fatihh\Fullstack WEB AVATA (AntiGravity)\Frontend-Skripsi-"

# Cek status git
git status

# Jika ada perubahan, commit dan push
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

### 2. Test Build Production Lokal

```powershell
# Install dependencies (jika belum)
npm install

# Build production
npm run build

# Preview hasil build
npm run preview
```

Buka http://localhost:4173 dan pastikan aplikasi berjalan dengan baik.

---

## 🚀 Deploy ke Netlify

### Metode 1: Deploy via Netlify Dashboard (Recommended untuk Pemula)

#### Step 1: Buat Akun Netlify
1. Buka https://www.netlify.com
2. Klik **Sign up** (gratis)
3. Pilih **GitHub** untuk sign up (lebih mudah)
4. Authorize Netlify untuk akses GitHub

#### Step 2: Import Project
1. Di Netlify Dashboard, klik **Add new site** → **Import an existing project**
2. Pilih **Deploy with GitHub**
3. Cari dan pilih repository: `Frontend-Skripsi-`
4. Klik repository tersebut

#### Step 3: Configure Build Settings
Netlify akan **otomatis mendeteksi** file `netlify.toml`, jadi Anda akan lihat:
- **Build command**: `npm run build` ✅
- **Publish directory**: `dist` ✅
- **Node version**: 20 ✅

Tidak perlu ubah apa-apa, langsung klik **Deploy**!

#### Step 4: Add Environment Variables
**PENTING**: Sebelum aplikasi berjalan dengan baik, tambahkan environment variables:

1. Setelah deploy, buka **Site settings** → **Environment variables**
2. Klik **Add a variable** untuk setiap variable berikut:

| Key | Value | Keterangan |
|-----|-------|------------|
| `REACT_APP_API_URL` | `https://your-backend-url.com/api` | URL backend yang sudah di-deploy |
| `GEMINI_API_KEY` | `your_actual_gemini_key` | API key Gemini (jika digunakan) |
| `ARCGIS_API_KEY` | `your_actual_arcgis_key` | API key ArcGIS (opsional) |

3. Klik **Save**
4. Kembali ke **Deploys** → **Trigger deploy** → **Deploy site**

---

### Metode 2: Deploy via Netlify CLI (Advanced)

```powershell
# Install Netlify CLI
npm install -g netlify-cli

# Login ke Netlify
netlify login

# Build dan deploy
netlify deploy --prod

# Ikuti prompt:
# - Publish directory: dist
# - Deploy akan upload semua file
```

---

## 🔧 Konfigurasi Lanjutan

### Custom Domain (Opsional)
1. Di Netlify Dashboard → **Domain settings**
2. Klik **Add custom domain**
3. Ikuti instruksi untuk setup DNS

### Ubah Site Name
1. Di **Site settings** → **General** → **Site details**
2. Klik **Change site name**
3. Masukkan nama yang lebih mudah diingat, contoh: `avatar-tsunami-demo`
4. URL akan jadi: `https://avatar-tsunami-demo.netlify.app`

---

## ⚠️ Catatan Penting untuk Demo ke Dosen

### 1. Backend Connectivity
Frontend yang di-deploy ke Netlify **tidak bisa akses backend di localhost**. 

**Solusi**:
- **Option A (Recommended)**: Deploy backend juga ke Railway/Render/Heroku
- **Option B (Quick Demo)**: Gunakan ngrok untuk expose backend lokal:
  ```powershell
  # Install ngrok
  choco install ngrok
  
  # Jalankan backend lokal (port 8000)
  # Di terminal lain, jalankan ngrok
  ngrok http 8000
  
  # Copy URL ngrok (contoh: https://abc123.ngrok.io)
  # Update REACT_APP_API_URL di Netlify:
  # REACT_APP_API_URL=https://abc123.ngrok.io/api
  ```

### 2. Fitur yang Bisa Ditunjukkan ke Dosen
Untuk demo frontend saja (tanpa backend):
- ✅ **UI/UX Design**: Tampilan responsive, dark mode, layout
- ✅ **Navigation**: Router antar halaman
- ✅ **Map Visualization**: Peta (ArcGIS Maps SDK)
- ✅ **Component Structure**: Form inputs, charts, cards
- ❌ **API Integration**: Simulasi tsunami (butuh backend)
- ❌ **Database Interaction**: Load/save data (butuh backend)

### 3. Testing Checklist Sebelum Demo
- [ ] Homepage muncul dengan benar
- [ ] Navigasi antar halaman berfungsi
- [ ] Responsive di mobile (test di HP)
- [ ] Map muncul (jika pakai ArcGIS)
- [ ] Dark mode toggle berfungsi
- [ ] Loading states muncul

---

## 🐛 Troubleshooting

### Build Gagal
```
Error: Build failed
```
**Solusi**:
1. Cek di Netlify **Deploy log** untuk error detail
2. Pastikan `npm run build` berhasil di lokal
3. Periksa dependencies di `package.json`

### Page Not Found (404) saat Reload
**Penyebab**: SPA routing issue

**Solusi**: Sudah diatasi dengan `netlify.toml` redirect rules

### Environment Variables Tidak Terdeteksi
**Penyebab**: Vite menggunakan `import.meta.env`, tapi kode pakai `process.env`

**Solusi**: Netlify secara otomatis inject environment variables ke `process.env` saat build. Pastikan:
1. Variable sudah ditambahkan di Netlify dashboard
2. Trigger **redeploy** setelah menambah variable

---

## 📱 Share Link ke Dosen

Setelah deploy berhasil, Anda akan dapat URL seperti:
```
https://[site-name].netlify.app
```

**Cara share yang profesional**:
1. **Copy URL** dari Netlify dashboard
2. **Test sekali lagi** di incognito mode
3. **Screenshot** homepage atau fitur utama
4. **Kirim ke dosen** via email/WhatsApp dengan format:

```
Yth. Bapak/Ibu [Nama Dosen],

Berikut adalah link demo frontend sistem AVATAR Tsunami Prediction:
https://avatar-tsunami-demo.netlify.app

Fitur yang dapat dilihat:
- Dashboard visualisasi
- Peta tsunami interaktif
- Responsive design

Terima kasih.

[Nama Anda]
```

---

## 🔄 Update Deployment

Setelah deploy pertama, setiap kali Anda push code ke GitHub:
```powershell
git add .
git commit -m "Update: description of changes"
git push origin main
```

Netlify akan **otomatis rebuild dan redeploy** dalam 1-2 menit! 🎉

---

## 📚 Resources
- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#netlify)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
