import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Play, RefreshCw, Info, Database, Activity, Radio, Map as MapIcon, Clock, Globe, Waves, CheckCircle2, MousePointer, Target } from 'lucide-react';
import { SimulationParams, SimulationResult } from '../types';

// Import ArcGIS Modules
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import '@arcgis/core/assets/esri/themes/light/main.css';

// --- ArcGIS Map Component ---
interface ArcGISMapProps {
  epicenter?: { latitude: number; longitude: number };
  riskLevel?: string;
}

const ArcGISMapComponent: React.FC<ArcGISMapProps> = ({ epicenter, riskLevel }) => {
  const mapDiv = useRef<HTMLDivElement>(null);
  const mapView = useRef<MapView | null>(null);

  useEffect(() => {
    if (mapDiv.current) {
      const map = new Map({
        basemap: 'topo-vector'
      });
      const view = new MapView({
        container: mapDiv.current,
        map: map,
        center: [105.4, -6.1],
        zoom: 9
      });
      mapView.current = view;
      return () => { if (view) view.destroy(); }
    }
  }, []);

  useEffect(() => {
    if (mapView.current && epicenter) {
      mapView.current.graphics.removeAll();
      const point = new Point({
        longitude: epicenter.longitude,
        latitude: epicenter.latitude
      });
      let color: number[] = [34, 197, 94]; // green
      if (riskLevel === 'Bahaya') color = [220, 38, 38]; // red
      else if (riskLevel === 'Sedang') color = [234, 179, 8]; // yellow
      const markerSymbol = new SimpleMarkerSymbol({
        color,
        outline: { color: [255, 255, 255], width: 2 },
        size: 12
      });
      const pointGraphic = new Graphic({ geometry: point, symbol: markerSymbol });
      mapView.current.graphics.add(pointGraphic);
      mapView.current.goTo({ center: [epicenter.longitude, epicenter.latitude], zoom: 10 });
    }
  }, [epicenter, riskLevel]);

  return <div ref={mapDiv} style={{ width: '100%', height: '100%' }} />;
};

// --- FIXED: Interactive Map Component with Working Recenter ---
interface InteractiveMapProps {
  onCoordinateSelect: (lat: number, lon: number) => void;
  selectedCoordinate?: { latitude: number; longitude: number };
  mapViewRef?: React.MutableRefObject<MapView | null>;
}

const InteractiveMapComponent: React.FC<InteractiveMapProps> = ({ 
  onCoordinateSelect, 
  selectedCoordinate,
  mapViewRef 
}) => {
  const mapDiv = useRef<HTMLDivElement>(null);
  const internalMapView = useRef<MapView | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (mapDiv.current && !internalMapView.current) {
      const map = new Map({
        basemap: 'topo-vector'
      });
      const view = new MapView({
        container: mapDiv.current,
        map: map,
        center: [105.4, -6.1],
        zoom: 9
      });

      view.on('click', (event) => {
        const lat = event.mapPoint.latitude;
        const lon = event.mapPoint.longitude;
        onCoordinateSelect(lat, lon);
        setIsFirstLoad(false);
      });

      internalMapView.current = view;
      
      // Share mapView with parent via ref
      if (mapViewRef) {
        mapViewRef.current = view;
      }

      return () => { 
        if (view) {
          view.destroy();
          internalMapView.current = null;
          if (mapViewRef) {
            mapViewRef.current = null;
          }
        }
      }
    }
  }, [onCoordinateSelect, mapViewRef]);

  useEffect(() => {
    if (internalMapView.current && selectedCoordinate && selectedCoordinate.latitude !== 0 && selectedCoordinate.longitude !== 0) {
      internalMapView.current.graphics.removeAll();
      
      const point = new Point({
        longitude: selectedCoordinate.longitude,
        latitude: selectedCoordinate.latitude
      });

      const markerSymbol = new SimpleMarkerSymbol({
        color: [59, 130, 246],
        outline: { color: [255, 255, 255], width: 2 },
        size: 14
      });

      const pointGraphic = new Graphic({ 
        geometry: point, 
        symbol: markerSymbol 
      });

      internalMapView.current.graphics.add(pointGraphic);
      
      if (!isFirstLoad) {
        internalMapView.current.goTo({
          center: [selectedCoordinate.longitude, selectedCoordinate.latitude],
          zoom: 11
        }, {
          duration: 800,
          easing: 'ease-in-out'
        });
      }
    }
  }, [selectedCoordinate, isFirstLoad]);

  return <div ref={mapDiv} style={{ width: '100%', height: '100%', cursor: 'crosshair' }} />;
};

// --- Sub-Component: Real-Time View ---
const RealTimeView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [liveData, setLiveData] = useState<{
    params: SimulationParams;
    result: SimulationResult;
    location: string;
    time: string;
  } | null>(null);

  const fetchLiveData = () => {
    setLoading(true);
    setTimeout(() => {
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString('id-ID'));
      setLiveData({
        location: "Selat Sunda (52km Barat Daya Sumur-Banten)",
        time: now.toLocaleString('id-ID'),
        params: { magnitude: 5.2, depth: 10, latitude: -6.64, longitude: 105.11 },
        result: {
          riskLevel: 'Rendah',
          eta: 0,
          maxWaveHeight: 0.4,
          impactArea: 0,
          waveTrend: Array.from({ length: 10 }, (_, i) => ({
            time: `+${i * 5}m`,
            height: Math.sin(i) * 0.5 + 0.2
          }))
        }
      });
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 60000);
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
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Globe className="h-24 w-24 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <Radio className="mr-2 h-5 w-5 text-red-500" />
              Data Gempa Terkini
            </h3>
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                <div className="h-10 bg-slate-100 rounded w-full"></div>
              </div>
            ) : liveData ? (
              <div className="space-y-4 relative z-10">
                <div className="pb-3 border-b border-slate-100">
                  <p className="text-xs text-slate-500">Waktu Gempa</p>
                  <p className="font-mono text-slate-800">{liveData.time}</p>
                </div>
                <div className="pb-3 border-b border-slate-100">
                  <p className="text-xs text-slate-500">Lokasi</p>
                  <p className="font-medium text-slate-800">{liveData.location}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-slate-500">Magnitudo</p>
                    <p className="text-2xl font-bold text-slate-900">{liveData.params.magnitude} <span className="text-sm font-normal text-slate-500">SR</span></p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-slate-500">Kedalaman</p>
                    <p className="text-2xl font-bold text-slate-900">{liveData.params.depth} <span className="text-sm font-normal text-slate-500">km</span></p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Kartu Analisis Risiko Otomatis */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
             <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <Waves className="mr-2 h-5 w-5 text-blue-500" />
              Analisis Risiko Tsunami
            </h3>
            {loading ? (
               <div className="h-20 bg-slate-100 rounded w-full animate-pulse"></div>
            ) : liveData ? (
              <div>
                <div className={`p-4 rounded-lg border-l-4 mb-4 ${
                  liveData.result.riskLevel === 'Bahaya' ? 'bg-red-50 border-red-500' : 
                  liveData.result.riskLevel === 'Sedang' ? 'bg-yellow-50 border-yellow-500' : 
                  'bg-green-50 border-green-500'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Status Peringatan</p>
                      <p className={`text-xl font-bold ${
                         liveData.result.riskLevel === 'Bahaya' ? 'text-red-700' :
                         liveData.result.riskLevel === 'Sedang' ? 'text-yellow-700' : 'text-green-700'
                      }`}>{liveData.result.riskLevel === 'Bahaya' ? 'AWAS / SIAGA' : liveData.result.riskLevel === 'Sedang' ? 'WASPADA' : 'NORMAL / AMAN'}</p>
                    </div>
                    {liveData.result.riskLevel === 'Bahaya' ? (
                      <AlertTriangle className="h-8 w-8 text-red-500" />
                    ) : liveData.result.riskLevel === 'Sedang' ? (
                      <AlertTriangle className="h-8 w-8 text-yellow-500" />
                    ) : (
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <p className="text-xs text-slate-500">Potensi Gelombang</p>
                      <p className="font-semibold text-slate-900">{liveData.result.maxWaveHeight} Meter</p>
                   </div>
                   <div>
                      <p className="text-xs text-slate-500">Estimasi Tiba Gelombang Pertama</p>
                      <p className="font-semibold text-slate-900">
                        {liveData.result.eta > 0 ? `${liveData.result.eta} Menit` : '-'}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">(pesisir terdekat)</p>
                   </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Kolom Kanan: ArcGIS WebGIS Map */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-1 relative overflow-hidden" style={{ height: '600px' }}>
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-800 flex items-center whitespace-nowrap">
               <MapIcon className="mr-2 h-4 w-4 text-blue-600" />
               Peta Pemantauan Real-Time (ArcGIS)
             </h3>
          </div>
          <ArcGISMapComponent
            epicenter={liveData ? { latitude: liveData.params.latitude, longitude: liveData.params.longitude } : undefined}
            riskLevel={liveData?.result.riskLevel}
          />
        </div>
      </div>
    </div>
  );
};

// --- Sub-Component: Simulation View (Manual) ---
const SimulationView: React.FC = () => {
  const initialParams: SimulationParams = {
    magnitude: 0,
    depth: 0,
    latitude: 0,
    longitude: 0,
  };
  const [params, setParams] = useState<SimulationParams>(initialParams);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  
  // Create ref to access mapView directly
  const mapViewRef = useRef<MapView | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: value === '' ? 0 : parseFloat(value)
    }));
  };

  const handleCoordinateSelect = (lat: number, lon: number) => {
    setParams(prev => ({
      ...prev,
      latitude: parseFloat(lat.toFixed(4)),
      longitude: parseFloat(lon.toFixed(4))
    }));
  };

  // FIXED: Recenter function using ref
  const handleRecenterMap = () => {
    if (mapViewRef.current && params.latitude !== 0 && params.longitude !== 0) {
      mapViewRef.current.goTo({
        center: [params.longitude, params.latitude],
        zoom: 11
      }, {
        duration: 600,
        easing: 'ease-in-out'
      }).catch((error) => {
        console.log('GoTo cancelled or failed:', error);
      });
    }
  };

  const runSimulation = () => {
    setLoading(true);
    setTimeout(() => {
      const severity = params.magnitude > 7.0 ? (params.depth < 30 ? 'high' : 'medium') : 'low';
      const newResult: SimulationResult = {
        riskLevel: severity === 'high' ? 'Bahaya' : severity === 'medium' ? 'Sedang' : 'Rendah',
        eta: Math.floor(Math.random() * 30) + 15,
        maxWaveHeight: severity === 'high' ? (Math.random() * 5 + 3) : (Math.random() * 2 + 0.5),
        impactArea: severity === 'high' ? 120 : 45,
        waveTrend: Array.from({ length: 10 }, (_, i) => ({
          time: `+${i * 5}m`,
          height: severity === 'high' ? Math.sin(i) * 4 + Math.random() : Math.sin(i) * 1 + 0.2
        }))
      };
      setResult(newResult);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* Left Sidebar: Controls */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Parameter Gempa (Input Manual)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Magnitudo (M)</label>
              <input
                type="number"
                name="magnitude"
                step="0.1"
                value={params.magnitude || ''}
                onChange={handleInputChange}
                placeholder="Contoh: 7.5"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kedalaman (km)</label>
              <input
                type="number"
                name="depth"
                value={params.depth || ''}
                onChange={handleInputChange}
                placeholder="Contoh: 20"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
              <div className="flex items-start">
                <MousePointer className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">
                  <strong>Tip:</strong> Klik pada peta di samping untuk memilih lokasi episentrum secara otomatis, 
                  atau isi manual di bawah.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lintang</label>
                <input
                  type="number"
                  name="latitude"
                  step="0.01"
                  value={params.latitude || ''}
                  onChange={handleInputChange}
                  placeholder="Contoh: -6.1"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bujur</label>
                <input
                  type="number"
                  name="longitude"
                  step="0.01"
                  value={params.longitude || ''}
                  onChange={handleInputChange}
                  placeholder="Contoh: 105.4"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              onClick={runSimulation}
              disabled={loading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                  Memproses Model CNN...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Jalankan Simulasi
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Summary */}
        {result && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Hasil Analisis Risiko</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-500">Status</p>
                <p className={`text-lg font-bold ${
                  result.riskLevel === 'Bahaya' ? 'text-red-600' : 
                  result.riskLevel === 'Sedang' ? 'text-yellow-600' : 
                  'text-green-600'
                }`}>{result.riskLevel}</p>
              </div>
               <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-500">Tinggi Gelombang</p>
                <p className="text-lg font-bold text-slate-800">{result.maxWaveHeight.toFixed(2)} m</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-500">Estimasi Tiba Gelombang Pertama</p>
                <p className="text-lg font-bold text-slate-800">{result.eta} menit</p>
                <p className="text-xs text-slate-500 mt-1 italic">ke pesisir terdekat</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-500">Luas Dampak</p>
                <p className="text-lg font-bold text-slate-800">{result.impactArea} km²</p>
              </div>
            </div>

            <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-500 rounded flex items-start">
              <Info className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                <strong>Info:</strong> Waktu tiba dihitung untuk gelombang tsunami <strong>pertama</strong> 
                yang mencapai wilayah pesisir terdekat dari episentrum gempa. Gelombang berikutnya 
                dapat lebih tinggi dan datang hingga beberapa jam kemudian.
              </p>
            </div>

            {result.riskLevel === 'Bahaya' && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                <p className="text-xs text-red-700">
                  <strong>Peringatan Dini:</strong> Potensi tsunami terdeteksi. Segera lakukan evakuasi ke dataran tinggi.
                </p>
              </div>
            )}
            {result.riskLevel === 'Sedang' && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
                <p className="text-xs text-yellow-700">
                  <strong>Waspada:</strong> Potensi tsunami sedang. Ikuti perkembangan informasi resmi!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Center/Right: Interactive ArcGIS Map & Charts */}
      <div className="lg:col-span-2 space-y-6">
        {/* Interactive Map for Coordinate Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative" style={{ height: '400px' }}>
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-800 flex items-center whitespace-nowrap">
               <MousePointer className="mr-2 h-4 w-4 text-blue-600" />
               Pilih Lokasi Episentrum (Klik pada Peta)
             </h3>
          </div>

          {/* FIXED: Auto-Focus Button with working onClick */}
          {params.latitude !== 0 && params.longitude !== 0 && (
            <button
              onClick={handleRecenterMap}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 bg-white hover:bg-blue-50 p-3 rounded-full shadow-lg border border-slate-300 transition-all duration-200 hover:scale-110 hover:shadow-xl group active:scale-95"
              title="Fokus ke titik terpilih"
              type="button"
            >
              <Target className="h-5 w-5 text-blue-600 group-hover:text-blue-700" />
            </button>
          )}

          {/* Coordinate Display Overlay */}
          {params.latitude !== 0 && params.longitude !== 0 && (
            <div className="absolute bottom-6 left-6 z-10 bg-slate-900/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-2xl border border-slate-700">
              <p className="text-xs text-slate-400 mb-1">Koordinat Terpilih:</p>
              <p className="text-base font-mono font-bold text-white">
                {params.latitude.toFixed(4)}°, {params.longitude.toFixed(4)}°
              </p>
            </div>
          )}

          {/* FIXED: Pass mapViewRef to component */}
          <InteractiveMapComponent 
            onCoordinateSelect={handleCoordinateSelect}
            selectedCoordinate={params.latitude !== 0 && params.longitude !== 0 ? {
              latitude: params.latitude,
              longitude: params.longitude
            } : undefined}
            mapViewRef={mapViewRef}
          />
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Grafik Tren Tinggi Gelombang</h2>
          <div className="h-64 w-full">
            {result ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.waveTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                  <Area
                    type="monotone"
                    dataKey="height"
                    stroke={result.riskLevel === 'Bahaya' ? "#dc2626" : result.riskLevel === 'Sedang' ? "#eab308" : "#22c55e"}
                    fill={result.riskLevel === 'Bahaya' ? "#fca5a5" : result.riskLevel === 'Sedang' ? "#fde68a" : "#bbf7d0"}
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                <Activity className="h-10 w-10 mb-2" />
                <p>Data grafik akan muncul setelah simulasi dijalankan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Dashboard Container ---
const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'realtime' | 'simulation'>('realtime');
  return (
    <div className="bg-slate-100 min-h-screen pb-12">
      <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm sticky top-20 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center">
            <Database className="mr-2 h-6 w-6 text-blue-600" />
            Dashboard AVATAR
          </h1>
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab('realtime')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                activeTab === 'realtime' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Activity className="w-4 h-4 mr-2" />
              Real-Time Monitor
            </button>
            <button
              onClick={() => setActiveTab('simulation')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                activeTab === 'simulation' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
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
