import React, { useEffect, useRef, useState } from 'react';
import Map from '@arcgis/core/Map';
import SceneView from '@arcgis/core/views/SceneView';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import Circle from '@arcgis/core/geometry/Circle';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import '@arcgis/core/assets/esri/themes/light/main.css'; // Import ArcGIS CSS

interface RealtimeMapProps {
    tsunamiData?: {
        epicenter: { latitude: number; longitude: number };
    };
    onEarthquakeSelect?: (quake: any) => void;
}

const RealtimeMap: React.FC<RealtimeMapProps> = ({ tsunamiData, onEarthquakeSelect }) => {
    const mapDiv = useRef<HTMLDivElement>(null);
    const [view, setView] = useState<SceneView | null>(null);
    const realtimeLayerRef = useRef<GraphicsLayer | null>(null);

    useEffect(() => {
        if (!mapDiv.current) return;

        // Layer for Real-time Earthquakes
        const realtimeLayer = new GraphicsLayer({ title: "Real-time Earthquakes" });
        realtimeLayerRef.current = realtimeLayer;

        // Initialize Map
        const map = new Map({
            basemap: 'satellite',
            ground: 'world-elevation',
            layers: [realtimeLayer],
        });

        // Initialize SceneView
        const sceneView = new SceneView({
            container: mapDiv.current,
            map: map,
            camera: {
                position: {
                    longitude: 118.0,
                    latitude: -2.0,
                    z: 4000000,
                },
                tilt: 0,
                heading: 0,
            },
            environment: {
                lighting: {
                    date: new Date(),
                    directShadowsEnabled: true,
                },
            },
            ui: {
                components: [], // Hide default UI
                padding: { bottom: 0 } // Ensure full height
            },
        });

        setView(sceneView);

        // Add global styles for popup
        const style = document.createElement("style");
        style.innerHTML = `
            .esri-popup__main-container {
                background-color: rgba(255, 255, 255, 0.8) !important;
                backdrop-filter: blur(8px) !important;
                -webkit-backdrop-filter: blur(8px) !important;
                border: 1px solid rgba(255, 255, 255, 0.5) !important;
                border-radius: 20px !important;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
                overflow: hidden !important;
                color: #334155 !important;
            }
            .esri-popup__header {
                background: transparent !important;
                border: none !important;
            }
            .esri-popup__header-buttons {
                color: #64748b !important;
            }
            .esri-popup__footer {
                display: none !important;
            }
            .esri-popup__content {
                padding: 0 16px 16px 16px !important;
            }
            .esri-popup__pointer-direction {
                background-color: rgba(255, 255, 255, 0.8) !important;
            }
            .esri-view-width-xlarge .esri-popup__main-container {
                width: 380px !important;
            }
        `;
        document.head.appendChild(style);

        // Click Event Handler
        sceneView.on("click", async (event) => {
            const response = await sceneView.hitTest(event);
            if (response.results.length > 0) {
                // Find the first graphic from the realtime layer
                const graphicHit = response.results.find((result) => result.type === "graphic" && (result as any).graphic.layer === realtimeLayerRef.current);

                if (graphicHit) {
                    const attr = (graphicHit as any).graphic.attributes;
                    // Ensure it's not the static monitoring point (optional check, or just pass everything)
                    // The monitoring point has title "Titik Pantau...", earthquakes have "location", "magnitude" etc.
                    if (onEarthquakeSelect && attr) {
                        onEarthquakeSelect(attr);
                    }
                }
            }
        });

        return () => {
            sceneView.destroy();
        };
    }, []);

    // Fetch Real-time Earthquakes
    useEffect(() => {
        if (!realtimeLayerRef.current) return;

        const fetchEarthquakes = async () => {
            try {
                const { default: apiService } = await import('../services/api');
                const response = await apiService.getRealTimeEarthquakes();

                if (response.status === 'success' && realtimeLayerRef.current) {
                    realtimeLayerRef.current.removeAll();

                    // 1. Calculate Geofencing (Radius Check) - Dynamic Status
                    const monitoringLat = -6.102;
                    const monitoringLon = 105.423;
                    const monitoringRadiusKm = 200; // Zoning Radius

                    let monitoringStatus = "Aman";
                    let monitoringColor = [0, 255, 0, 0.9]; // Green
                    let closestQuakeDist = Infinity;
                    let alertMessage = "Tidak ada aktivitas gempa signifikan di area pantauan.";

                    // Haversine Formula for Distance
                    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
                        const R = 6371; // km
                        const dLat = (lat2 - lat1) * Math.PI / 180;
                        const dLon = (lon2 - lon1) * Math.PI / 180;
                        const a =
                            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                            Math.sin(dLon / 2) * Math.sin(dLon / 2);
                        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                        return R * c;
                    };

                    // Check all quakes
                    if (response.earthquakes) {
                        response.earthquakes.forEach((eq: any) => {
                            const dist = calculateDistance(monitoringLat, monitoringLon, eq.latitude, eq.longitude);

                            // High Risk (Tsunami Potential): M >= 7.0 within 200km
                            if (dist < 200 && eq.magnitude >= 7.0) {
                                // Promote to highest alert if not already set
                                if (monitoringStatus !== "AWAS TSUNAMI") {
                                    monitoringStatus = "AWAS TSUNAMI";
                                    monitoringColor = [255, 0, 0, 0.9]; // Red
                                    alertMessage = `Gempa Besar M ${eq.magnitude} jarak ${dist.toFixed(0)}km! Potensi Tsunami.`;
                                }
                            }
                            // Medium Risk (Strong Shake): M >= 5.0 within 100km
                            else if (dist < 100 && eq.magnitude >= 5.0) {
                                // Only set if current status is lower (Aman)
                                if (monitoringStatus === "Aman") {
                                    monitoringStatus = "WASPADA GEMPA";
                                    monitoringColor = [255, 140, 0, 0.9]; // Orange
                                    alertMessage = `Gempa M ${eq.magnitude} jarak ${dist.toFixed(0)}km. Waspada guncangan.`;
                                }
                            }
                        });
                    }

                    // 2. Add Monitoring Point / Epicenter
                    const monitoringPoint = new Point({
                        latitude: monitoringLat,
                        longitude: monitoringLon
                    });

                    const monitoringSymbol = new SimpleMarkerSymbol({
                        style: 'circle',
                        color: monitoringColor, // DYNAMIC COLOR
                        size: "24px",
                        outline: {
                            color: [255, 255, 255],
                            width: 2
                        }
                    });

                    // Add Radius Circle (Geofence Visual)
                    const radiusCircle = new Circle({
                        center: monitoringPoint,
                        radius: monitoringRadiusKm,
                        radiusUnit: "kilometers"
                    });

                    const radiusSymbol = new SimpleFillSymbol({
                        color: [0, 255, 255, 0.1], // Transparent Cyan
                        outline: {
                            color: [0, 255, 255, 0.5],
                            width: 1,
                            style: "dash"
                        }
                    });

                    const radiusGraphic = new Graphic({
                        geometry: radiusCircle,
                        symbol: radiusSymbol
                    });
                    realtimeLayerRef.current.add(radiusGraphic);

                    const monitoringGraphic = new Graphic({
                        geometry: monitoringPoint,
                        symbol: monitoringSymbol,
                        attributes: {
                            title: "Titik Pantau Selat Sunda",
                            status: monitoringStatus,
                            alert: alertMessage
                        }
                    });
                    realtimeLayerRef.current.add(monitoringGraphic);

                    // 3. Add Earthquake Points (Standard Colors)
                    response.earthquakes.forEach((eq: any) => {
                        // Standard Colors: Yellow < 5, Orange 5-7, Red > 7
                        let color = [255, 255, 0, 0.8]; // Yellow < 5
                        let size = "12px";

                        if (eq.magnitude >= 7.0) {
                            color = [255, 0, 0, 0.9]; // Red >= 7
                            size = "20px";
                        } else if (eq.magnitude >= 5.0) {
                            color = [255, 140, 0, 0.9]; // Orange 5-7
                            size = "16px";
                        }

                        const point = new Point({
                            longitude: eq.longitude,
                            latitude: eq.latitude
                        });

                        const markerSymbol = new SimpleMarkerSymbol({
                            style: 'circle',
                            color: color,
                            size: size,
                            outline: {
                                color: [255, 255, 255],
                                width: 1.5
                            }
                        });

                        const graphic = new Graphic({
                            geometry: point,
                            symbol: markerSymbol,
                            attributes: {
                                ...eq,
                                depthMeters: eq.depth.toLocaleString('id-ID'),
                                formattedTime: new Date(eq.timestamp).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
                                riskColor: eq.magnitude >= 7 ? '#dc2626' : eq.magnitude >= 5 ? '#f97316' : '#eab308'
                            },
                            popupTemplate: {
                                title: "<div style='font-family: Inter, sans-serif; font-weight: bold; font-size: 14px; color: #1e293b; display: flex; align-items: center; justify-content: space-between;'><span>{source}</span> <span style='background-color: {riskColor}; color: white; padding: 2px 8px; border-radius: 99px; font-size: 10px; font-weight: 600; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>M {magnitude}</span></div>",
                                content: `
                                    <style>
                                      /* Override ArcGIS Default Popup Styles */
                                      .esri-popup__main-container {
                                        background-color: rgba(255, 255, 255, 0.85) !important;
                                        backdrop-filter: blur(12px) !important;
                                        -webkit-backdrop-filter: blur(12px) !important;
                                        border: 1px solid rgba(255, 255, 255, 0.5) !important;
                                        border-radius: 16px !important;
                                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
                                        overflow: hidden !important;
                                      }
                                      .esri-popup__header {
                                        background: transparent !important;
                                        border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
                                      }
                                      .esri-popup__footer {
                                        display: none !important; /* Hide footer actions for cleaner look */
                                      }
                                      .esri-popup__content {
                                        margin: 0 !important;
                                        padding: 12px 16px !important;
                                      }
                                      .esri-popup__pointer-direction {
                                        background-color: rgba(255, 255, 255, 0.85) !important;
                                      }
                                      
                                      /* Animation */
                                      @keyframes popupSlideUp {
                                        0% { transform: translateY(10px); opacity: 0; }
                                        100% { transform: translateY(0); opacity: 1; }
                                      }
                                    </style>
                                    <div style="font-family: 'Inter', sans-serif; color: #334155; animation: popupSlideUp 0.4s ease-out forwards;">
                                        <div style="margin-bottom: 12px;">
                                            <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; font-weight: 700; margin-bottom: 4px;">Lokasi</div>
                                            <div style="font-size: 14px; font-weight: 600; color: #0f172a; line-height: 1.4;">{location}</div>
                                        </div>
                                        
                                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 12px; padding: 10px; background: rgba(255,255,255,0.5); border-radius: 12px;">
                                            <div>
                                                <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; font-weight: 700; margin-bottom: 2px;">Waktu</div>
                                                <div style="font-size: 12px; font-weight: 600; color: #334155;">{formattedTime}</div>
                                            </div>
                                            <div>
                                                <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; font-weight: 700; margin-bottom: 2px;">Kedalaman</div>
                                                <div style="font-size: 12px; font-weight: 600; color: #334155;">{depthMeters} Meter</div>
                                            </div>
                                        </div>

                                        <div style="background: rgba(241, 245, 249, 0.6); padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.6); display: flex; align-items: center; justify-content: space-between;">
                                            <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; font-weight: 700;">Koordinat</div>
                                            <div style="font-size: 11px; font-family: 'Monaco', monospace; color: #475569; letter-spacing: -0.02em;">{latitude}, {longitude}</div>
                                        </div>
                                    </div>
                                `
                            }
                        });

                        realtimeLayerRef.current?.add(graphic);
                    });

                }
            } catch (error) {
                console.error("Failed to fetch earthquakes:", error);
            }
        };

        fetchEarthquakes();
        const interval = setInterval(fetchEarthquakes, 60000);
        return () => clearInterval(interval);
    }, [view]);

    // Zoom to Selected Earthquake
    useEffect(() => {
        if (view && tsunamiData?.epicenter) {
            view.goTo({
                center: [tsunamiData.epicenter.longitude, tsunamiData.epicenter.latitude],
                zoom: 9
            }, { duration: 800 });
        }
    }, [tsunamiData, view]);

    return (
        <div className="relative w-full h-full bg-slate-100">
            <div ref={mapDiv} className="absolute inset-0 w-full h-full" />

            {/* Zoom Controls */}
            <div className="absolute bottom-40 right-4 bg-white rounded-2xl shadow-md p-2 flex flex-row items-center gap-3 border border-gray-100" style={{ zIndex: 50 }}>
                <button onClick={() => view?.goTo({ zoom: (view.zoom || 8) + 1 })} className="bg-white hover:bg-gray-50 text-slate-700 p-2 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md active:scale-95 flex items-center justify-center w-10 h-10" title="Zoom In">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </button>
                <button onClick={() => view?.goTo({ zoom: (view.zoom || 8) - 1 })} className="bg-white hover:bg-gray-50 text-slate-700 p-2 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md active:scale-95 flex items-center justify-center w-10 h-10" title="Zoom Out">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" /></svg>
                </button>
                <button onClick={() => view?.goTo({ center: [105.8, -6.0], zoom: 8, tilt: 60, heading: 0 })} className="bg-white hover:bg-gray-50 text-slate-700 p-2 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md active:scale-95 flex items-center justify-center w-10 h-10" title="Reset View">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                </button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-0 left-0 right-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]" style={{ zIndex: 50 }}>
                {/* Header Bar */}
                <div className="bg-[#ea580c] w-full py-2">
                    <h3 className="font-bold text-white text-sm flex items-center justify-center gap-2 tracking-wide uppercase">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        Tingkat Bahaya Gempa
                    </h3>
                </div>

                {/* Content Bar */}
                <div className="bg-white px-4 py-4 md:px-8 md:py-6">
                    <div className="max-w-4xl mx-auto flex items-center justify-between text-sm md:text-base">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-6 bg-yellow-400 rounded-sm border border-yellow-500 shadow-sm"></div>
                            <span className="text-slate-700 font-semibold whitespace-nowrap">&lt; 5 SR (Rendah)</span>
                        </div>
                        <div className="w-px h-8 bg-slate-200 mx-2"></div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-6 bg-orange-400 rounded-sm border border-orange-500 shadow-sm"></div>
                            <span className="text-slate-700 font-semibold whitespace-nowrap">5-7 SR (Sedang)</span>
                        </div>
                        <div className="w-px h-8 bg-slate-200 mx-2"></div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-6 bg-red-600 rounded-sm border border-red-700 shadow-sm"></div>
                            <span className="text-slate-700 font-semibold whitespace-nowrap">&gt; 7 SR (Tinggi)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RealtimeMap;
