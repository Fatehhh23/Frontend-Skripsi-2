import React, { useState, useEffect } from 'react';
import { AlertCircle, MapPin, Activity, Layers, Lock, LogIn, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface EarthquakeParams {
  magnitude: number;
  depth: number;
  latitude: number;
  longitude: number;
  mode?: 'AI' | 'HEURISTIC';
}

interface SimulationFormProps {
  onSubmit: (params: EarthquakeParams) => void;
  isLoading?: boolean;
  selectedLocation?: { lat: number; lon: number } | null;
}

const SimulationForm: React.FC<SimulationFormProps> = ({ onSubmit, isLoading = false, selectedLocation }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [formData, setFormData] = useState<EarthquakeParams>({
    magnitude: 7.0,
    depth: 10,
    latitude: -6.102,
    longitude: 105.423,
    mode: isAuthenticated ? 'AI' : 'HEURISTIC' // Default: AI untuk login, Umum untuk publik
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EarthquakeParams, string>>>({});

  useEffect(() => {
    if (selectedLocation) {
      setFormData(prev => ({
        ...prev,
        mode: 'HEURISTIC', // Switch ke mode manual/umum agar input koordinat bisa dipakai bebas
        latitude: parseFloat(selectedLocation.lat.toFixed(4)),
        longitude: parseFloat(selectedLocation.lon.toFixed(4))
      }));
    }
  }, [selectedLocation]);

  // Validasi input
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EarthquakeParams, string>> = {};

    // Validasi magnitude (3.0 - 9.5)
    if (formData.magnitude < 3.0 || formData.magnitude > 9.5) {
      newErrors.magnitude = 'Magnitudo harus antara 3.0 - 9.5';
    }

    // Validasi depth (1 - 700 km)
    if (formData.depth < 1 || formData.depth > 700) {
      newErrors.depth = 'Kedalaman harus antara 1 - 700 KM';
    }

    // Validasi latitude (-90 to 90)
    if (formData.latitude < -90 || formData.latitude > 90) {
      newErrors.latitude = 'Latitude harus antara -90 hingga 90';
    }

    // Validasi longitude (-180 to 180)
    if (formData.longitude < -180 || formData.longitude > 180) {
      newErrors.longitude = 'Longitude harus antara -180 hingga 180';
    }

    // Validasi Khusus Mode AI (Selat Sunda Only)
    // Jika mode HEURISTIC, validasi ini dilewati (bebas lokasi)
    if (formData.mode === 'AI') {
      if (
        formData.latitude < -7.0 || formData.latitude > -5.0 ||
        formData.longitude < 104.5 || formData.longitude > 106.5
      ) {
        newErrors.latitude = 'Mode AI hanya akurat di Selat Sunda (-7.0 s/d -5.0)';
        newErrors.longitude = 'Mode AI hanya akurat di Selat Sunda (104.5 s/d 106.5)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleModeAIClick = () => {
    if (!isAuthenticated) {
      // User belum login → tampilkan modal
      setShowLoginModal(true);
    } else {
      setFormData(prev => ({ ...prev, mode: 'AI' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Guard: cegah user publik submit dengan mode AI
    if (formData.mode === 'AI' && !isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    if (validateForm()) {
      onSubmit(formData);
    }

  };

  const handleChange = (field: keyof EarthquakeParams, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));

    // Clear error saat user mulai mengetik
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Preset lokasi untuk quick access
  // Preset lokasi untuk quick access
  const presetLocations = [
    { name: 'Gunung Anak Krakatau', lat: -6.102, lon: 105.423 },
    { name: 'Selat Sunda Tengah', lat: -5.950, lon: 105.750 },
    { name: 'Pesisir Banten (Anyer)', lat: -6.050, lon: 105.900 },
    { name: 'Pesisir Lampung (Kalianda)', lat: -5.750, lon: 105.580 },
    { name: 'Pulau Sebesi', lat: -5.955, lon: 105.489 },
    { name: 'Pulau Panaitan', lat: -6.550, lon: 105.200 },
    { name: 'Teluk Lampung', lat: -5.600, lon: 105.100 },
  ];

  /* 
   * Handle Preset Selection from Dropdown (AI Mode)
   */
  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    const preset = presetLocations.find(p => p.name === selectedName);
    if (preset) {
      setFormData(prev => ({
        ...prev,
        latitude: preset.lat,
        longitude: preset.lon
      }));
    }
  };

  const applyPreset = (preset: { lat: number; lon: number }) => {
    setFormData(prev => ({
      ...prev,
      latitude: preset.lat,
      longitude: preset.lon,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Activity className="w-6 h-6 text-blue-600" />
          Simulasi Tsunami Interaktif
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Pilih mode dan masukkan parameter gempa
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Mode Selection */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <label className="text-sm font-bold text-slate-700 mb-3 block">Pilih Mode Simulasi</label>

          {/* Badge akses user */}
          {!isAuthenticated && (
            <div className="mb-3 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <Lock className="w-4 h-4 text-amber-500 shrink-0" />
              <p className="text-xs text-amber-700">
                Anda masuk sebagai <strong>Tamu</strong>. Mode AI memerlukan login.
              </p>
            </div>
          )}
          {isAuthenticated && (
            <div className="mb-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <Activity className="w-4 h-4 text-green-500 shrink-0" />
              <p className="text-xs text-green-700">
                Anda sudah login. Semua mode simulasi tersedia.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {/* Tombol Mode AI — terkunci untuk user publik */}
            <button
              type="button"
              onClick={handleModeAIClick}
              className={`relative flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${!isAuthenticated
                ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-pointer hover:border-amber-300 hover:bg-amber-50'
                : formData.mode === 'AI'
                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                }`}
            >
              {/* Badge kunci untuk user publik */}
              {!isAuthenticated && (
                <span className="absolute top-1.5 right-1.5 bg-amber-400 rounded-full p-0.5">
                  <Lock className="w-2.5 h-2.5 text-white" />
                </span>
              )}
              <Layers className="w-6 h-6 mb-2" />
              <span className="font-bold text-sm">Mode AI</span>
              {!isAuthenticated ? (
                <span className="text-xs opacity-75 text-amber-600">Login Diperlukan</span>
              ) : (
                <span className="text-xs opacity-75">Presisi (Selat Sunda)</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, mode: 'HEURISTIC' }))}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${formData.mode === 'HEURISTIC'
                ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                }`}
            >
              <Activity className="w-6 h-6 mb-2" />
              <span className="font-bold text-sm">Mode Umum</span>
              <span className="text-xs opacity-75">Estimasi (Bebas)</span>
            </button>
          </div>

          <div className="mt-3 text-xs text-slate-500 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            {formData.mode === 'AI'
              ? 'Mode AI menggunakan model Deep Learning. Hanya akurat untuk koordinat di dalam area training (Selat Sunda).'
              : !isAuthenticated
                ? 'Mode Umum tersedia untuk semua pengguna. Login untuk mengakses Mode AI yang lebih presisi.'
                : 'Mode Umum menggunakan rumus estimasi standar. Bisa digunakan untuk simulasi di lokasi manapun namun kurang akurat.'}
          </div>
        </div>

        {/* Magnitude Input */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Activity className="w-4 h-4" />
            Magnitudo (Mw)
          </label>
          <input
            type="number"
            step="0.1"
            min="3.0"
            max="9.5"
            value={formData.magnitude}
            onChange={(e) => handleChange('magnitude', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.magnitude ? 'border-red-500' : 'border-gray-300'
              }`}
            disabled={isLoading}
          />
          {errors.magnitude && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.magnitude}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">Skala: 3.0 (lemah) - 9.5 (sangat kuat)</p>
        </div>

        {/* Depth Input */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Layers className="w-4 h-4" />
            Kedalaman (KM)
          </label>
          <input
            type="number"
            step="1"
            min="1"
            max="700"
            value={formData.depth}
            onChange={(e) => handleChange('depth', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.depth ? 'border-red-500' : 'border-gray-300'
              }`}
            disabled={isLoading}
          />
          {errors.depth && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.depth}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">Kedalaman pusat gempa (Kilometer)</p>
        </div>

        {/* Coordinates - CONDITIONAL RENDER */}
        {formData.mode === 'AI' ? (
          /* AI MODE: Dropdown Selection Only */
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              Lokasi (Area Selat Sunda)
            </label>
            <select
              onChange={handlePresetChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
              disabled={isLoading}
              defaultValue=""
            >
              <option value="" disabled>-- Pilih Lokasi Simulasi --</option>
              {presetLocations.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name} (Lot: {loc.lat}, Lon: {loc.lon})
                </option>
              ))}
            </select>
            <div className="mt-2 text-xs text-blue-600 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>Koordinat terpilih: {formData.latitude}, {formData.longitude}</span>
            </div>
          </div>
        ) : (
          /* HEURISTIC MODE: Free Input + Presets */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4" />
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="-90"
                  max="90"
                  value={formData.latitude}
                  onChange={(e) => handleChange('latitude', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.latitude ? 'border-red-500' : 'border-gray-300'
                    }`}
                  disabled={isLoading}
                />
                {errors.latitude && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.latitude}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4" />
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="-180"
                  max="180"
                  value={formData.longitude}
                  onChange={(e) => handleChange('longitude', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.longitude ? 'border-red-500' : 'border-gray-300'
                    }`}
                  disabled={isLoading}
                />
                {errors.longitude && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.longitude}
                  </p>
                )}
              </div>
            </div>

            {/* Manual Preset Buttons (Only for Heuristic/Free Mode) */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Lokasi Preset
              </label>
              <div className="flex flex-wrap gap-2">
                {presetLocations.slice(0, 3).map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-md transition border border-gray-300 hover:border-blue-400"
                    disabled={isLoading}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={
            `w-full py-4 rounded-lg font-bold text-white text-lg transition-all duration-200 ${isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }`
          }
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Memproses Simulasi...
            </span>
          ) : (
            'Jalankan Simulasi'
          )}
        </button>
      </form>

      {/* Info Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs text-blue-800">
          <strong>Catatan:</strong> Simulasi ini menggunakan model SSL-ViT-CNN untuk prediksi cepat.
          Hasil simulasi bersifat estimasi dan untuk keperluan penelitian.
        </p>
      </div>

      {/* ===== MODAL: Login Diperlukan untuk Mode AI ===== */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLoginModal(false)}
          />

          {/* Modal Card */}
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-fade-in">
            {/* Tombol Tutup */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mx-auto mb-5">
              <Lock className="w-8 h-8 text-amber-500" />
            </div>

            {/* Judul */}
            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
              Fitur Khusus Member
            </h3>

            {/* Deskripsi */}
            <p className="text-sm text-gray-600 text-center mb-3">
              <strong className="text-blue-700">Mode AI (SSL-ViT-CNN)</strong> menggunakan model
              Deep Learning terlatih yang presisi dan hanya tersedia untuk pengguna yang telah login.
            </p>

            {/* Perbandingan Akses */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6 text-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-20 font-semibold text-slate-500">Tamu</span>
                <span className="flex-1 text-slate-600">Mode Umum (Heuristik, estimasi)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-20 font-semibold text-blue-600">Member</span>
                <span className="flex-1 text-blue-700">Mode AI + Mode Umum (tanpa batas)</span>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition shadow-md hover:shadow-lg"
              >
                <LogIn className="w-4 h-4" />
                Login Sekarang
              </button>
              <button
                onClick={() => navigate('/register')}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-green-700 transition shadow-md hover:shadow-lg"
              >
                Daftar Akun Baru
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full py-3 text-gray-600 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition text-sm"
              >
                Lanjut sebagai Tamu (Mode Umum)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationForm;
