"use client";

import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";

// Fix for default marker icons in Leaflet
const fixLeafletIcon = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
};

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom, {
        animate: true,
        duration: 0.5
      });
    }
  }, [center, zoom, map]);
  return null;
}

export default function DhakaMap({ data, selectedThana, onThanaSelect, mode = "heat" }) {
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  const thanas = Object.values(data.thanas);
  const isHeat = mode === "heat" || mode === "green";

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-inner bg-slate-900">
      <MapContainer
        center={[23.777176, 90.399452]}
        zoom={13}
        minZoom={7}
        maxZoom={18}
        maxBounds={[[20.3, 88.0], [26.6, 92.7]]}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ background: "#1a1c1e" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {selectedThana && (
          <ChangeView 
            center={[selectedThana.lat, selectedThana.lon]} 
            zoom={14} 
          />
        )}

        {thanas.map((thana) => {
          let color;
          let fillOpacity = 0.75;
          let radius = 15;

          if (mode === "heat") {
            color = thana.heat_analysis.color;
            fillOpacity = 0.6;
            radius = thana.nasa_data.lst_celsius > 37 ? 20 : 15;
          } else if (mode === "green") {
            const ndvi = thana.nasa_data.ndvi;
            if (ndvi > 0.4) color = "#166534";
            else if (ndvi > 0.3) color = "#16A34A";
            else if (ndvi > 0.2) color = "#22C55E";
            else if (ndvi > 0.1) color = "#86EFAC";
            else color = "#FEF9C3";
            radius = ndvi > 0.3 ? 20 : 15;
          } else if (mode === "opportunity") {
            const score = thana.opportunity.score;
            if (score > 80) color = "#7C3AED";
            else if (score > 65) color = "#A855F7";
            else if (score > 50) color = "#C084FC";
            else if (score > 35) color = "#E9D5FF";
            else color = "#F5F3FF";
            radius = score > 80 ? 22 : 18;
          }

          return (
            <CircleMarker
              key={thana.name_en}
              center={[thana.lat, thana.lon]}
              radius={radius}
              pathOptions={{
                fillColor: color,
                color: color,
                weight: 2,
                opacity: 0.8,
                fillOpacity: fillOpacity,
              }}
              eventHandlers={{
                click: () => onThanaSelect(thana),
              }}
            >
              <Popup className="custom-popup">
                <div className="p-2 font-['Hind_Siliguri']">
                  <h3 className="font-bold text-lg">{thana.name_bn}</h3>
                  {isHeat ? (
                    <>
                      <p className="text-sm">তাপমাত্রা: <span className="font-bold text-red-500">{thana.nasa_data.lst_celsius}°C</span></p>
                      <p className="text-sm">সবুজায়ন: {thana.green_analysis.percentage}%</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm">সবুজায়নের সুযোগ: <span className="font-bold text-purple-400">{thana.opportunity.score}%</span></p>
                      <p className="text-sm">অবস্থা: {thana.opportunity.label_bn}</p>
                    </>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      
      <style jsx global>{`
        .leaflet-container {
          width: 100%;
          height: 100%;
          background: #021204 !important;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          background: rgba(13, 31, 15, 0.9) !important;
          backdrop-filter: blur(10px);
          color: #d2e9ce !important;
          border-radius: 16px !important;
          border: 1px solid rgba(98, 223, 125, 0.2);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
          padding: 4px;
        }
        .custom-popup .leaflet-popup-tip {
          background: rgba(13, 31, 15, 0.9) !important;
        }
        .leaflet-popup-close-button {
          color: #bdcaba !important;
          padding: 8px !important;
        }
      `}</style>
    </div>
  );
}

