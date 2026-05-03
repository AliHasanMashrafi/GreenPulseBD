
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedThana, fetchMapData } from "@/store/mapSlice";

export default function LocationAutoDetect() {
  const dispatch = useDispatch();
  const { thanas, selectedThana, status } = useSelector((state: any) => state.map);
  const [hasStarted, setHasStarted] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const detect = () => {
    if ("geolocation" in navigator) {
      setHasStarted(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          let nearest = thanas[0];
          let minDist = Infinity;
          
          thanas.forEach((t: any) => {
            const dist = Math.sqrt(Math.pow(t.lat - latitude, 2) + Math.pow(t.lon - longitude, 2));
            if (dist < minDist) {
              minDist = dist;
              nearest = t;
            }
          });

          if (minDist < 1.0) {
            dispatch(setSelectedThana(nearest));
            setShowPrompt(false);
          }
        },
        (error) => {
          if (error.code === 1) { // User Denied
            setShowPrompt(true);
          } else if (error.code === 3) { // Timeout
            console.warn("Geolocation Timeout: Switching to default view.");
          }
          setHasStarted(false); // Reset to allow manual retry if needed
          console.error("Geolocation Error:", error.code, error.message);
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
      );
    }
  };

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMapData() as any);
    }

    if (thanas.length > 0 && !selectedThana && !hasStarted) {
      detect();
    }
  }, [thanas, selectedThana, hasStarted, status, dispatch]);

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[5000] animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-sm px-4">
      <div className="bg-surface-container-highest/95 backdrop-blur-2xl border border-primary/20 p-5 rounded-[2.5rem] shadow-2xl space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 animate-pulse">
            <span className="material-symbols-outlined text-2xl">location_on</span>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-black font-bengali text-on-surface">লোকেশন পারমিশন প্রয়োজন</p>
            <p className="text-[11px] font-medium font-bengali text-on-surface-variant leading-relaxed opacity-80">
              আপনার এলাকার সঠিক তাপমাত্রা ও সবুজায়নের তথ্য পেতে ব্রাউজারের সেটিংস (Lock আইকন) থেকে লোকেশন **Allow** করুন।
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={detect}
            className="flex-grow py-3 px-4 bg-primary text-on-primary rounded-2xl font-black font-bengali text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
          >
            পুনরায় চেষ্টা করুন
          </button>
          <button 
            onClick={() => setShowPrompt(false)}
            className="px-6 py-3 bg-surface-container-high text-on-surface-variant rounded-2xl font-black font-bengali text-xs hover:bg-surface-container transition-all"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
