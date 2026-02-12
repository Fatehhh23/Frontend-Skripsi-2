import React, { useState } from 'react';
import { AlertCircle, MapPin, Activity, Layers } from 'lucide-react';

interface EarthquakeParams {
  magnitude: number;
  depth: number;
  latitude: number;
  longitude: number;
}

interface SimulationFormProps {
  onSubmit: (params: EarthquakeParams) => void;
  isLoading?: boolean;
}

const SimulationForm: React.FC<SimulationFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState<EarthquakeParams>({
    magnitude: 7.0,
    depth: 10,
    latitude: -6.102,
    longitude: 105.423,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EarthquakeParams, string>>>({});

  // Validasi input
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EarthquakeParams, string>> = {};

    // Validasi magnitude (3.0 - 9.5)
    if (formData.magnitude < 3.0 || formData.magnitude > 9.5) {
      newErrors.magnitude = 'Magnitudo harus antara 3.0 - 9.5';
    }

    // Validasi depth (1 - 700 km)
    if (formData.depth < 1 || formData.depth > 700) {
      newErrors.depth = 'Kedalaman harus antara 1 - 700';
    }

    // Validasi latitude (-90 to 90)
    if (formData.latitude < -90 || formData.latitude > 90) {
      newErrors.latitude = 'Latitude harus antara -90 hingga 90';
    }

    // Validasi longitude (-180 to 180)
    if (formData.longitude < -180 || formData.longitude > 180) {
      newErrors.longitude = 'Longitude harus antara -180 hingga 180';
    }

    // Validasi wilayah Selat Sunda (opsional untuk fokus area)
    if (
      formData.latitude < -7.0 || formData.latitude > -5.0 ||
      formData.longitude < 104.5 || formData.longitude > 106.5
    ) {
      // Warning saja, tidak blocking
      console.warn('Koordinat di luar area Selat Sunda yang direkomendasikan');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
  const presetLocations = [
    { name: 'Krakatau', lat: -6.102, lon: 105.423 },
    { name: 'Selat Sunda Tengah', lat: -6.0, lon: 105.8 },
    { name: 'Pantai Banten', lat: -6.3, lon: 105.9 },
  ];

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
          Masukkan parameter gempa untuk memprediksi dampak tsunami
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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
            Kedalaman (Meter)
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
          <p className="text-xs text-gray-500 mt-1">Kedalaman pusat gempa dari permukaan laut</p>
        </div>

        {/* Coordinates */}
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

        {/* Preset Locations */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Lokasi Preset
          </label>
          <div className="flex flex-wrap gap-2">
            {presetLocations.map((preset) => (
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
    </div>
  );
};

export default SimulationForm;
