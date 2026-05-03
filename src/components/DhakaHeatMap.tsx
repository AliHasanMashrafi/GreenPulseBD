
"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedThana, fetchMapData, setMode } from "@/store/mapSlice";
import { RootState, AppDispatch } from "@/store";
import dhakaGeoJSON from "@/data/dhaka_thanas.json";

// Bangladesh Outline (Simplified)
const BANGLADESH_BOUNDS = [[20.5, 88.0], [26.7, 92.8]];
const DHAKA_CENTER = [23.8103, 90.4125];

function getHeatColor(celsius) {
  if (celsius >= 38) return "#7f1d1d"; // critical
  if (celsius >= 36) return "#dc2626"; // high
  if (celsius >= 34) return "#ea580c"; // medium
  if (celsius >= 32) return "#d97706"; // low
  return "#16a34a"; // safe
}

function getPotentialColor(score) {
  if (score >= 80) return "#166534"; // Deep Green (Very High potential)
  if (score >= 60) return "#22c55e"; // Green (High potential)
  if (score >= 40) return "#a3e635"; // Yellow-Green (Medium potential)
  return "#eab308"; // Yellow (Low potential)
}

export default function DhakaHeatMap({ pageMode }: { pageMode: 'heat' | 'green' }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapObjRef = useRef<any>(null);
  const geoLayerRef = useRef<any>(null);
  
  const dispatch = useDispatch<AppDispatch>();
  const { mode, selectedThana, thanas, viewMode, status } = useSelector((state: RootState) => state.map);

  // Sync internal mode with page prop
  useEffect(() => {
    dispatch(setMode(pageMode));
  }, [pageMode, dispatch]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMapData());
    }
  }, [status, dispatch]);

  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Initialize Map
  useEffect(() => {
    let mapInstance = null;

    if (!mapRef.current) return;

    if ((mapRef.current as any)._leaflet_id) return;

    import("leaflet").then((L) => {
      if (!mapRef.current || (mapRef.current as any)._leaflet_id) return;

      const map = L.map(mapRef.current, {
        center: DHAKA_CENTER,
        zoom: 11,
        minZoom: 7,
        maxBounds: BANGLADESH_BOUNDS,
        maxBoundsViscosity: 1.0,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true,
      });

      // Dark Theme Tiles
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png").addTo(map);

      // Handle click outside areas
      map.on('click', () => {
        showToast("আমরা বর্তমানে ঢাকার নির্দিষ্ট কিছু এলাকার তথ্য প্রদান করছি। অনুগ্রহ করে চিহ্নিত এলাকায় ক্লিক করুন।");
      });

      mapObjRef.current = { map, L };
      mapInstance = map;
      renderGeoJSON(L, map);
    });

    return () => {
      if (mapInstance) {
        mapInstance.remove();
        mapObjRef.current = null;
      }
    };
  }, []);

  // Update styles when pageMode or data changes
  useEffect(() => {
    if (mapObjRef.current && geoLayerRef.current) {
      geoLayerRef.current.setStyle((feature: any) => {
        const thanaData = thanas.find(t => t.name_en === feature.properties.name_en);
        let fillColor = "#1e293b";
        
        if (thanaData) {
          fillColor = pageMode === 'heat' 
            ? getHeatColor(thanaData.nasa_data.lst_celsius)
            : getPotentialColor(thanaData.opportunity.score);
        }

        return {
          fillColor,
          fillOpacity: 0.7,
        };
      });
    }
  }, [pageMode, thanas, status]);

  // Update styles when component mounts with specific mode
  const renderGeoJSON = (L: any, map: any) => {
    if (geoLayerRef.current) {
      map.removeLayer(geoLayerRef.current);
    }

    const layer = L.geoJSON(dhakaGeoJSON, {
      style: (feature: any) => {
        const thanaData = thanas.find(t => t.name_en === feature.properties.name_en);
        let fillColor = "#1e293b";
        
        if (thanaData) {
          fillColor = pageMode === 'heat' 
            ? getHeatColor(thanaData.nasa_data.lst_celsius)
            : getPotentialColor(thanaData.opportunity.score);
        }

        return {
          fillColor,
          weight: 1,
          opacity: 1,
          color: "rgba(255,255,255,0.2)",
          fillOpacity: 0.7,
        };
      },
      onEachFeature: (feature, layer) => {
        const thanaData = thanas.find(t => t.name_en === feature.properties.name_en);
        
        layer.on({
          mouseover: (e) => {
            const l = e.target;
            l.setStyle({ 
              weight: 3, 
              color: "#ffffff", 
              fillOpacity: 0.8 
            });
            l.bringToFront();
            
            // Scale up tooltip
            const tooltip = l.getTooltip();
            if (tooltip) {
              tooltip.getElement()?.classList.add('scale-hover');
            }
          },
          mouseout: (e) => {
            const l = e.target;
            l.setStyle({
              weight: 1,
              color: "rgba(255,255,255,0.2)",
              fillOpacity: 0.7
            });
            
            // Scale down tooltip
            const tooltip = l.getTooltip();
            if (tooltip) {
              tooltip.getElement()?.classList.remove('scale-hover');
            }
          },
          click: (e) => {
            L.DomEvent.stopPropagation(e);
            if (thanaData) {
              dispatch(setSelectedThana(thanaData));
              map.fitBounds(e.target.getBounds(), { padding: [50, 50] });
            } else {
              showToast("এই এলাকার তথ্য এখনও আপডেট করা হয়নি।");
            }
          }
        });

        // Add Permanent Label
        layer.bindTooltip(feature.properties.name_bn, {
          permanent: true,
          direction: "center",
          className: "area-label-permanent",
        }).openTooltip();
      }
    }).addTo(map);

    geoLayerRef.current = layer;
  };

  // Handle outside viewMode changes (like clicking "Whole Dhaka")
  useEffect(() => {
    if (viewMode === 'whole' && mapObjRef.current) {
      mapObjRef.current.map.setView(DHAKA_CENTER, 11);
      if (geoLayerRef.current) {
        geoLayerRef.current.eachLayer(l => geoLayerRef.current.resetStyle(l));
      }
    }
  }, [viewMode]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div ref={mapRef} className="w-full h-full bg-slate-900" />
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[2000] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-error-container text-on-error-container px-6 py-3 rounded-xl shadow-2xl border border-error/20 flex items-center gap-3">
            <span className="material-symbols-outlined text-error">info</span>
            <span className="font-bengali text-sm font-bold">{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Custom Zoom Controls */}
      <div className="absolute bottom-6 left-6 z-[1000] flex flex-col gap-2">
        <button 
          onClick={() => mapObjRef.current?.map.zoomIn()}
          className="w-10 h-10 bg-surface-container-high border border-outline-variant/30 rounded-full flex items-center justify-center shadow-lg hover:bg-primary hover:text-on-primary transition-all"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
        <button 
          onClick={() => mapObjRef.current?.map.zoomOut()}
          className="w-10 h-10 bg-surface-container-high border border-outline-variant/30 rounded-full flex items-center justify-center shadow-lg hover:bg-primary hover:text-on-primary transition-all"
        >
          <span className="material-symbols-outlined">remove</span>
        </button>
      </div>
    </div>
  );
}

