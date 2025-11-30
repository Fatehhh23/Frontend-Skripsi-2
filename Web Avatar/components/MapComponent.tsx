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
      
      {/* Legend */}
      <div className="absolute bottom-8 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
        <h3 className="font-bold text-sm mb-2">Tingkat Bahaya</h3>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-yellow-400 border border-white"></div>
            <span>&lt; 2m (Rendah)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-orange-400 border border-white"></div>
            <span>2-5m (Sedang)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-red-500 border border-white"></div>
            <span>&gt; 5m (Tinggi)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-red-600 border-2 border-white rounded-full"></div>
            <span>Epicenter</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
