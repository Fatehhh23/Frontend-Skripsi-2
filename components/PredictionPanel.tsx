import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Waves, MapPin, TrendingUp, Users } from 'lucide-react';

interface PredictionData {
  eta: number; // Estimated Time of Arrival (menit)
  maxWaveHeight: number; // Tinggi gelombang maksimum (meter)
  affectedArea: number; // Luas area terdampak (km²)
  estimatedCasualties?: number; // Estimasi korban
  tsunamiCategory: 'Low' | 'Medium' | 'High' | 'Extreme';
  impactZones: {
    name: string;
    distance: number; // Jarak dari epicenter (km)
    eta: number; // ETA untuk zona ini (menit)
    waveHeight: number; // Tinggi gelombang di zona ini (meter)
  }[];
}

interface PredictionPanelProps {
  data: PredictionData | null;
  isVisible: boolean;
  onClose?: () => void;
}

const PredictionPanel: React.FC<PredictionPanelProps> = ({ data, isVisible, onClose }) => {
  const [countdown, setCountdown] = useState<number | null>(null);

  // Countdown timer untuk ETA
  useEffect(() => {
    if (data && data.eta) {
      setCountdown(data.eta * 60); // Konversi menit ke detik

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [data]);

  if (!isVisible || !data) return null;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Low':
        return 'bg-yellow-500';
      case 'Medium':
        return 'bg-orange-500';
      case 'High':
        return 'bg-red-500';
      case 'Extreme':
        return 'bg-purple-600';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'Low':
        return 'Bahaya Rendah';
      case 'Medium':
        return 'Bahaya Sedang';
      case 'High':
        return 'Bahaya Tinggi';
      case 'Extreme':
        return 'Bahaya Ekstrem';
      default:
        return 'Unknown';
    }
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed top-20 right-4 w-96 bg-white rounded-lg shadow-2xl z-50 overflow-hidden animate-slide-in-right">
      {/* Header with Alert */}
      <div className={`${getCategoryColor(data.tsunamiCategory)} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
            <h3 className="font-bold text-lg">Peringatan Tsunami</h3>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="hover:bg-white/20 rounded-full p-1 transition"
            >
              ✕
            </button>
          )}
        </div>
        <p className="text-sm mt-1 font-semibold">{getCategoryText(data.tsunamiCategory)}</p>
      </div>

      {/* Countdown Timer */}
      {countdown !== null && countdown > 0 && (
        <div className="bg-red-50 border-b-2 border-red-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-red-800">Waktu Tiba Gelombang</span>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-600 animate-pulse" />
              <span className="text-2xl font-bold text-red-600 font-mono">
                {formatCountdown(countdown)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Statistics */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {/* ETA */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-900">ETA</span>
            </div>
            <p className="text-2xl font-bold text-blue-700">{data.eta} min</p>
          </div>

          {/* Max Wave Height */}
          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-1">
              <Waves className="w-4 h-4 text-red-600" />
              <span className="text-xs font-medium text-red-900">Tinggi Max</span>
            </div>
            <p className="text-2xl font-bold text-red-700">{data.maxWaveHeight.toFixed(1)} m</p>
          </div>

          {/* Affected Area */}
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-medium text-orange-900">Area Terdampak</span>
            </div>
            <p className="text-2xl font-bold text-orange-700">{data.affectedArea.toFixed(1)} km²</p>
          </div>

          {/* Casualties */}
          {data.estimatedCasualties !== undefined && (
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-900">Est. Korban</span>
              </div>
              <p className="text-2xl font-bold text-purple-700">
                {data.estimatedCasualties.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Impact Zones */}
        <div className="border-t pt-3">
          <h4 className="font-bold text-sm text-gray-800 mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Zona Terdampak
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {data.impactZones.map((zone, index) => (
              <div
                key={index}
                className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-sm text-gray-800">{zone.name}</span>
                  <span className="text-xs text-gray-600">{zone.distance.toFixed(1)} km</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600">ETA: </span>
                    <span className="font-semibold text-blue-600">{zone.eta} min</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Tinggi: </span>
                    <span className="font-semibold text-red-600">{zone.waveHeight.toFixed(1)} m</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t p-4 bg-gray-50">
        <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Aktifkan Evakuasi
        </button>
      </div>

      {/* Timestamp */}
      <div className="px-4 pb-3 text-xs text-gray-500 text-center">
        Diperbarui: {new Date().toLocaleString('id-ID')}
      </div>
    </div>
  );
};

export default PredictionPanel;
