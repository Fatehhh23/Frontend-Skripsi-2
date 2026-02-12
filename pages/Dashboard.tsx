import React, { useState, useEffect } from 'react';
import { Activity, Play, Database, RefreshCw, Radio, Clock, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Target, MapPin } from 'lucide-react';
import RealtimeMap from '../components/RealtimeMap';
import SimulationMap from '../components/SimulationMap';
import SimulationForm from '../components/SimulationForm';
import PredictionPanel from '../components/PredictionPanel';
import ChartComponent from '../components/ChartComponent';
import apiService, { EarthquakeParams } from '../services/api';

// Sub-Component: Real-Time Monitoring View
const RealTimeView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [liveData, setLiveData] = useState<any>(null);
  const [allQuakes, setAllQuakes] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const fetchLiveData = async () => {
    setLoading(true);
    try {
      // Panggil API real-time (simulasi)
      const response = await apiService.getRealTimeEarthquakes();
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString('id-ID'));

      if (response.status === 'success' && response.earthquakes.length > 0) {
        setAllQuakes(response.earthquakes);
        // Only set liveData if we don't have a selection or if it's the first load
        // Actually, let's reset to latest on refresh? Or keep selection?
        // User might want to see latest updates. Let's reset to latest.
        setLiveData(response.earthquakes[0]);
        setSelectedIndex(0);
      }
    } catch (error) {
      console.error('Failed to fetch real-time data:', error);
      // Fallback ke dummy data untuk demo
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString('id-ID'));
      setLiveData({
        id: 'demo-1',
        magnitude: 5.2,
        depth: 10,
        latitude: -6.64,
        longitude: 105.11,
        timestamp: now.toISOString(),
        location: 'Selat Sunda (52km Barat Daya Sumur-Banten)',
        riskLevel: 'Rendah',
        maxWaveHeight: 0.4,
      });
    } finally {
      setLoading(false);
    }
  };
  const handlePrev = () => {
    if (allQuakes.length === 0) return;
    const newIndex = selectedIndex === 0 ? allQuakes.length - 1 : selectedIndex - 1;
    setSelectedIndex(newIndex);
    setLiveData(allQuakes[newIndex]);
  };

  const handleNext = () => {
    if (allQuakes.length === 0) return;
    const newIndex = selectedIndex === allQuakes.length - 1 ? 0 : selectedIndex + 1;
    setSelectedIndex(newIndex);
    setLiveData(allQuakes[newIndex]);
  };

  const handleMapSelect = (attributes: any) => {
    if (!attributes || allQuakes.length === 0) return;
    // Try to find by ID or location/timestamp match
    // API returns 'id', accessible in attributes
    const index = allQuakes.findIndex(q => q.id === attributes.id);
    if (index !== -1) {
      setSelectedIndex(index);
      setLiveData(allQuakes[index]);
    } else {
      // Fallback if ID missing, maybe match lat/lon approximately?
      // For now assume ID is consistent.
    }
  };


  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 60000); // Update setiap menit
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Status Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <div className="relative">
            <span className="absolute top-0 right-0 -mr-1 -mt-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <Activity className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">Status Monitoring: AKTIF</h2>
            <p className="text-xs text-slate-500">Terhubung ke Stream API BMKG (Simulasi)</p>
          </div>
        </div>
        <div className="flex items-center text-sm text-slate-500 bg-slate-50 px-4 py-2 rounded-lg">
          <Clock className="h-4 w-4 mr-2" />
          Update Terakhir: {loading ? 'Mengambil data...' : lastUpdated}
          <button onClick={fetchLiveData} className="ml-4 p-1 hover:bg-slate-200 rounded-full transition-colors">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-blue-600' : 'text-slate-400'}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Data Gempa & Status Warning */}
        <div className="space-y-6">
          {/* Kartu Data Gempa */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <Radio className="mr-2 h-5 w-5 text-red-500" />
                Data Gempa Terkini
              </h3>
              {allQuakes.length > 1 && (
                <div className="flex items-center space-x-2 bg-slate-100 rounded-lg p-1">
                  <button onClick={handlePrev} className="p-1 hover:bg-white rounded shadow-sm text-slate-600 transition-all" title="Sebelumnya">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono font-medium text-slate-500 w-12 text-center">
                    {selectedIndex + 1} / {allQuakes.length}
                  </span>
                  <button onClick={handleNext} className="p-1 hover:bg-white rounded shadow-sm text-slate-600 transition-all" title="Selanjutnya">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                <div className="h-10 bg-slate-100 rounded w-full"></div>
              </div>
            ) : liveData ? (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <p className="text-xs text-slate-500">Waktu Gempa</p>
                  <p className="font-mono text-slate-800">{new Date(liveData.timestamp).toLocaleString('id-ID')}</p>
                </div>
                <div className="pb-3 border-b border-slate-100">
                  <p className="text-xs text-slate-500">Lokasi</p>
                  <p className="font-medium text-slate-800">{liveData.location}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-slate-500">Magnitudo</p>
                    <p className="text-2xl font-bold text-slate-900">{liveData.magnitude} <span className="text-sm font-normal text-slate-500">SR</span></p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-slate-500">Kedalaman</p>
                    <p className="text-2xl font-bold text-slate-900">{liveData.depth} <span className="text-sm font-normal text-slate-500">Meter</span></p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Kartu Analisis Risiko */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Analisis Risiko Tsunami</h3>
            {loading ? (
              <div className="h-20 bg-slate-100 rounded w-full animate-pulse"></div>
            ) : liveData ? (
              <div>
                <div className={`p-4 rounded-lg border-l-4 mb-4 ${liveData.riskLevel === 'Bahaya' ? 'bg-red-50 border-red-500' :
                  liveData.riskLevel === 'Sedang' ? 'bg-yellow-50 border-yellow-500' :
                    'bg-green-50 border-green-500'
                  }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Status Peringatan</p>
                      <p className={`text-xl font-bold ${liveData.riskLevel === 'Bahaya' ? 'text-red-700' :
                        liveData.riskLevel === 'Sedang' ? 'text-yellow-700' : 'text-green-700'
                        }`}>{liveData.riskLevel === 'Bahaya' ? 'AWAS / SIAGA' : liveData.riskLevel === 'Sedang' ? 'WASPADA' : 'NORMAL / AMAN'}</p>
                    </div>
                    {liveData.riskLevel === 'Bahaya' ? (
                      <AlertTriangle className="h-8 w-8 text-red-500" />
                    ) : liveData.riskLevel === 'Sedang' ? (
                      <AlertTriangle className="h-8 w-8 text-yellow-500" />
                    ) : (
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-slate-500">Potensi Gelombang</p>
                    <p className="font-semibold text-slate-900">{liveData.maxWaveHeight} Meter</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Kolom Kanan: Map */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-[calc(100vh-140px)] min-h-[600px]">
          <RealtimeMap
            tsunamiData={liveData ? {
              epicenter: { latitude: liveData.latitude, longitude: liveData.longitude },
            } : undefined}
            onEarthquakeSelect={handleMapSelect}
          />
        </div>
      </div>
    </div>
  );
};

// Sub-Component: Simulation View (Manual)
const SimulationView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [predictionData, setPredictionData] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulation = async (params: EarthquakeParams) => {
    setLoading(true);
    setError(null);
    setShowPanel(false);

    try {
      const response = await apiService.runSimulation(params);

      if (response.status === 'success') {
        setPredictionData(response.data);
        setShowPanel(true);
      } else {
        setError(response.message || 'Terjadi kesalahan saat simulasi');
      }
    } catch (err: any) {
      console.error('Simulation error:', err);
      // Demo data untuk testing tanpa backend
      const demoData = {
        prediction: {
          eta: Math.floor(Math.random() * 30) + 15,
          maxWaveHeight: params.magnitude > 7 ? (Math.random() * 5 + 3) : (Math.random() * 2 + 0.5),
          affectedArea: params.magnitude > 7 ? 120 : 45,
          tsunamiCategory: params.magnitude > 7.5 ? 'High' : params.magnitude > 6.5 ? 'Medium' : 'Low',
          estimatedCasualties: params.magnitude > 7 ? Math.floor(Math.random() * 1000) : 0,
        },
        epicenter: {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        inundationZones: [],
        impactZones: [
          { name: 'Pantai Anyer', distance: 25, eta: 20, waveHeight: 3.2 },
          { name: 'Labuan', distance: 35, eta: 28, waveHeight: 2.8 },
          { name: 'Carita', distance: 30, eta: 24, waveHeight: 3.0 },
        ],
        waveData: Array.from({ length: 10 }, (_, i) => ({
          time: i * 5,
          waveHeight: Math.sin(i) * 2 + Math.random() * 0.5 + 1,
        })),
      };
      setPredictionData(demoData);
      setShowPanel(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="ml-auto text-red-500">✕</button>
          </div>
        </div>
      )}

      {/* Form Section - Above Map */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <SimulationForm onSubmit={handleSimulation} isLoading={loading} />
      </div>

      {/* Map Section - Full Width */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="h-[700px] relative">
          <SimulationMap
            tsunamiData={predictionData ? {
              epicenter: predictionData.epicenter,
              inundationZones: predictionData.inundationZones,
            } : undefined}
          />

          {loading && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                <p className="text-lg font-semibold text-gray-800">Memproses Simulasi...</p>
                <p className="text-sm text-gray-600 mt-2">Model SSL-ViT-CNN sedang memprediksi</p>
              </div>
            </div>
          )}

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

      {/* Results Section */}
      {predictionData && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Analisis Data Tsunami</h2>
            <ChartComponent
              data={predictionData.waveData}
              eta={predictionData.prediction.eta}
              maxHeight={predictionData.prediction.maxWaveHeight}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Main Dashboard Container
const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'realtime' | 'simulation'>('realtime');

  return (
    <div className="bg-slate-100 min-h-screen pb-12">
      <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center">
            <Database className="mr-2 h-6 w-6 text-blue-600" />
            Dashboard AVATAR
          </h1>
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab('realtime')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${activeTab === 'realtime' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              <Activity className="w-4 h-4 mr-2" />
              Real-Time Monitor
            </button>
            <button
              onClick={() => setActiveTab('simulation')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${activeTab === 'simulation' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              <Play className="w-4 h-4 mr-2" />
              Simulasi Manual
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {activeTab === 'realtime' ? <RealTimeView /> : <SimulationView />}
      </div>
    </div>
  );
};

export default Dashboard;
