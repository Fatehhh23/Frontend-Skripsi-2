import React, { useState } from 'react';
import SimulationMap from '../components/SimulationMap';
import SimulationForm from '../components/SimulationForm';
import PredictionPanel from '../components/PredictionPanel';
import ChartComponent from '../components/ChartComponent';
import apiService, { EarthquakeParams, TsunamiPredictionResponse } from '../services/api';

const SimulationPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [predictionData, setPredictionData] = useState<TsunamiPredictionResponse['data'] | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulation = async (params: EarthquakeParams) => {
    setIsLoading(true);
    setError(null);
    setShowPanel(false);

    try {
      // Panggil API backend
      const response = await apiService.runSimulation(params);

      if (response.status === 'success') {
        setPredictionData(response.data);
        setShowPanel(true);

        // Scroll ke hasil
        setTimeout(() => {
          document.getElementById('results-section')?.scrollIntoView({
            behavior: 'smooth'
          });
        }, 100);
      } else {
        setError(response.message || 'Terjadi kesalahan saat simulasi');
      }
    } catch (err: any) {
      console.error('Simulation error:', err);
      setError(err.message || 'Gagal terhubung ke server. Pastikan backend berjalan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Simulasi Prediksi Tsunami Selat Sunda</h1>
          <p className="text-blue-100">
            WebGIS dengan Integrasi SSL-ViT-CNN untuk Prediksi Real-Time
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-md animate-shake">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-1 text-sm text-red-700">{error}</div>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <SimulationForm onSubmit={handleSimulation} isLoading={isLoading} />
          </div>

          {/* Map Section */}
          <div className="lg:col-span-2 relative">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-[600px] relative">
                <SimulationMap
                  tsunamiData={predictionData ? {
                    epicenter: predictionData.epicenter,
                    inundationZones: predictionData.inundationZones,
                  } : undefined}
                />

                {/* Loading Overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 text-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-lg font-semibold text-gray-800">Memproses Simulasi...</p>
                      <p className="text-sm text-gray-600 mt-2">Model AI sedang memprediksi tsunami</p>
                    </div>
                  </div>
                )}

                {/* Prediction Panel Overlay */}
                {predictionData && (
                  <PredictionPanel
                    data={{
                      eta: predictionData.prediction.eta,
                      maxWaveHeight: predictionData.prediction.maxWaveHeight,
                      affectedArea: predictionData.prediction.affectedArea,
                      tsunamiCategory: predictionData.prediction.tsunamiCategory,
                      estimatedCasualties: predictionData.prediction.estimatedCasualties,
                      impactZones: predictionData.impactZones,
                    }}
                    isVisible={showPanel}
                    onClose={() => setShowPanel(false)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {predictionData && (
          <div id="results-section" className="space-y-6 animate-fade-in">
            {/* Charts */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analisis Data Tsunami
              </h2>
              <ChartComponent
                data={predictionData.waveData}
                eta={predictionData.prediction.eta}
                maxHeight={predictionData.prediction.maxWaveHeight}
              />
            </div>

            {/* Additional Info */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-3">🚨 Rekomendasi Mitigasi</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-300">✓</span>
                  <span>Segera evakuasi penduduk di zona merah ke area aman minimal 5km dari pantai</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-300">✓</span>
                  <span>Aktifkan sirene peringatan dini dan sistem komunikasi darurat</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-300">✓</span>
                  <span>Koordinasikan dengan BNPB dan BPBD untuk mobilisasi tim SAR</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-300">✓</span>
                  <span>Siapkan tempat evakuasi dan logistik bantuan kemanusiaan</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Info Footer */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-sm text-gray-600">
            <strong>Disclaimer:</strong> Hasil simulasi ini menggunakan model AI (SSL-ViT-CNN) dan bersifat estimasi.
            Untuk keputusan operasional, selalu merujuk pada data resmi dari BMKG dan BNPB.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimulationPage;
