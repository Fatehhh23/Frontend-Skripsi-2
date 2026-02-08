import React, { useEffect, useRef, useState } from 'react';
import Map from '@arcgis/core/Map';
import SceneView from '@arcgis/core/views/SceneView';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import Polygon from '@arcgis/core/geometry/Polygon';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';

interface MapComponentProps {
  tsunamiData?: {
    epicenter?: { latitude: number; longitude: number };
    inundationZones?: Array<{
      coordinates: number[][][];
      height: number;
    }>;
  };
}

const MapComponent: React.FC<MapComponentProps> = ({ tsunamiData }) => {
  const mapDiv = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<SceneView | null>(null);
  const graphicsLayerRef = useRef<GraphicsLayer | null>(null);

  useEffect(() => {
    if (!mapDiv.current) return;

    // Inisialisasi GraphicsLayer untuk overlay tsunami
    const graphicsLayer = new GraphicsLayer();
    graphicsLayerRef.current = graphicsLayer;

    // Inisialisasi Map dengan basemap
    const map = new Map({
      basemap: 'satellite',
      ground: 'world-elevation',
      layers: [graphicsLayer],
    });

    // Inisialisasi SceneView untuk visualisasi 3D
    const sceneView = new SceneView({
      container: mapDiv.current,
      map: map,
      camera: {
        position: {
          longitude: 105.8, // Fokus ke Selat Sunda
          latitude: -6.0,
          z: 150000, // Ketinggian kamera (meter)
        },
        tilt: 60, // Sudut kemiringan untuk efek 3D
        heading: 0,
      },
      environment: {
        lighting: {
          date: new Date(),
          directShadowsEnabled: true,
        },
      },
      ui: {
        components: [] // Hide all default UI components for cleaner look
      },
    });

    setView(sceneView);

    return () => {
      sceneView.destroy();
    };
  }, []);

  // Update peta ketika data tsunami berubah
  useEffect(() => {
    if (!view || !graphicsLayerRef.current) return;

    // Hapus grafis sebelumnya
    graphicsLayerRef.current.removeAll();

    if (tsunamiData) {
      // Tampilkan epicenter gempa
      if (tsunamiData.epicenter) {
        const epicenterPoint = new Point({
          longitude: tsunamiData.epicenter.longitude,
          latitude: tsunamiData.epicenter.latitude,
        });

        const epicenterSymbol = new SimpleMarkerSymbol({
          style: 'circle',
          color: [255, 0, 0, 0.8],
          size: '16px',
          outline: {
            color: [255, 255, 255],
            width: 2,
          },
        });

        const epicenterGraphic = new Graphic({
          geometry: epicenterPoint,
          symbol: epicenterSymbol,
          attributes: {
            title: 'Epicenter Gempa',
          },
          popupTemplate: {
            title: '{title}',
            content: `Lokasi: ${tsunamiData.epicenter.latitude.toFixed(4)}, ${tsunamiData.epicenter.longitude.toFixed(4)}`,
          },
        });

        graphicsLayerRef.current.add(epicenterGraphic);
      }

      // Tampilkan zona genangan tsunami
      if (tsunamiData.inundationZones && tsunamiData.inundationZones.length > 0) {
        tsunamiData.inundationZones.forEach((zone) => {
          const polygon = new Polygon({
            rings: zone.coordinates,
          });

          // Warna berdasarkan tinggi gelombang
          let color: number[];
          if (zone.height < 2) {
            color = [255, 255, 0, 0.5]; // Kuning (rendah)
          } else if (zone.height < 5) {
            color = [255, 165, 0, 0.6]; // Oranye (sedang)
          } else {
            color = [255, 0, 0, 0.7]; // Merah (tinggi)
          }

          const fillSymbol = new SimpleFillSymbol({
            color: color,
            outline: {
              color: [255, 255, 255, 0.8],
              width: 1,
            },
          });

          const polygonGraphic = new Graphic({
            geometry: polygon,
            symbol: fillSymbol,
            attributes: {
              height: zone.height,
            },
            popupTemplate: {
              title: 'Zona Genangan Tsunami',
              content: `Tinggi gelombang: ${zone.height.toFixed(2)} meter`,
            },
          });

          graphicsLayerRef.current!.add(polygonGraphic);
        });
      }
    }
  }, [tsunamiData, view]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapDiv} className="w-full h-full" />


      {/* Zoom Controls - Bottom Right (Minimal & Compact) */}
      <div className="absolute bottom-32 right-4 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 p-2" style={{ zIndex: 50 }}>
        <div className="flex gap-1.5">
          <button
            onClick={() => view?.goTo({ zoom: (view.zoom || 8) + 1 })}
            className="bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow-md"
            title="Zoom In"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <button
            onClick={() => view?.goTo({ zoom: (view.zoom || 8) - 1 })}
            className="bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow-md"
            title="Zoom Out"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
            </svg>
          </button>
          <button
            onClick={() => view?.goTo({
              center: [105.8, -6.0],
              zoom: 8,
              tilt: 60,
              heading: 0
            })}
            className="bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow-md"
            title="Reset View"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Legend - Bottom Full Width (Rectangular Box) */}
      <div className="absolute bottom-0 left-0 right-0" style={{ zIndex: 50 }}>
        <div className="bg-white/95 backdrop-blur-md border-t-2 border-gray-300 shadow-2xl">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-2.5">
            <h3 className="font-bold text-white text-sm flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Tingkat Bahaya Tsunami
            </h3>
          </div>
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-5 bg-yellow-400 rounded shadow-sm border border-yellow-500"></div>
              <span className="text-sm text-gray-700 font-medium whitespace-nowrap">&lt; 2m (Rendah)</span>
            </div>
            <div className="w-px h-7 bg-gray-300"></div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-5 bg-orange-400 rounded shadow-sm border border-orange-500"></div>
              <span className="text-sm text-gray-700 font-medium whitespace-nowrap">2-5m (Sedang)</span>
            </div>
            <div className="w-px h-7 bg-gray-300"></div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-5 bg-red-500 rounded shadow-sm border border-red-600"></div>
              <span className="text-sm text-gray-700 font-medium whitespace-nowrap">&gt; 5m (Tinggi)</span>
            </div>
            <div className="w-px h-7 bg-gray-300"></div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 bg-red-600 rounded-full shadow-lg border-2 border-white ring-2 ring-red-300"></div>
              <span className="text-sm text-gray-700 font-medium whitespace-nowrap">Epicenter Gempa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
