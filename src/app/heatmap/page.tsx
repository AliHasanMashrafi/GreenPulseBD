"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { setMode, setViewMode, fetchMapData } from "@/store/mapSlice";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect } from "react";
import { motion } from "framer-motion";

const DhakaHeatMap = dynamic(() => import("@/components/DhakaHeatMap"), { ssr: false });

export default function Heatmap() {
  const dispatch = useDispatch<AppDispatch>();
  const { mode, selectedThana, viewMode,  summaryData, thanas } = useSelector((state: RootState) => state.map);

  // Set mode to heat and force a data refresh when landing on this page
  useEffect(() => {
    dispatch(setMode("heat"));
    dispatch(fetchMapData(false)); // Force refresh from API
  }, [dispatch]);

  const currentData = (selectedThana || {
    name_bn: "পুরো ঢাকা",
    name_en: "Whole Dhaka",
    lat: 23.8103,
    lon: 90.4125,
    nasa_data: { lst_celsius: summaryData.avgTemp || 33.5, ndvi: 0.18, data_source: "NASA MODIS" },
    green_analysis: { percentage: summaryData.avgGreen || 18.2, label_bn: "মাঝারি", level: "moderate" },
    heat_analysis: { label_bn: "सहনীয়", weather_message: "পুরো ঢাকার গড় তাপমাত্রা প্রদর্শিত হচ্ছে।" },
    opportunity: { score: 75, label_bn: "মাঝারি সুযোগ", is_zone: true },
    rooftop_impact: { temp_reduction_celsius: 2.5, carbon_offset_kg_year: 450 }
  }) as any;

  const tempPercentage = Math.min(100, Math.max(0, (((currentData.nasa_data.lst_celsius || 30) - 25) / (45 - 25)) * 100));
  const heatRingOffset = 439.8 * (1 - tempPercentage / 100);
  const greenRingOffset = 439.8 * (1 - (currentData.green_analysis.percentage || 0) / 100);

  const getDynamicColor = (temp) => {
    if (mode !== 'heat') return "#16a34a"; // Green for greenery mode
    const t = Number(temp);
    if (t >= 38) return "#dc2626"; // Extreme: Red
    if (t >= 35) return "#f97316"; // High: Orange
    if (t >= 32) return "#eab308"; // Moderate: Yellow
    return "#22c55e"; // Normal: Green
  };

  return (
    <main className="pt-[64px] min-h-screen flex flex-col md:flex-row overflow-hidden bg-background">
      {/* Left: Interactive Map */}
      <section className="w-full md:w-[50%] flex flex-col h-[60vh] md:h-[calc(100vh-64px)] p-4 md:p-6 bg-surface-container-lowest">
        
        {/* Data Source Info */}
        <div className="mb-4 flex items-start gap-3 bg-primary/5 p-3 rounded-xl border border-primary/10">
          <span className="material-symbols-outlined text-primary text-xl">info</span>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-primary font-label mb-0.5">Data Source & Methodology</h4>
            <p className="text-xs text-on-surface-variant font-bengali leading-relaxed">
              এই তথ্যগুলো সরাসরি নাসা (NASA) ল্যান্ডস্যাট ৮ এবং ৯ স্যাটেলাইট থেকে সংগৃহীত। গুগল আর্থ ইঞ্জিন (Google Earth Engine) ব্যবহার করে ঢাকার ভূমির তাপমাত্রা (LST) এবং সবুজ বনায়ন বিশ্লেষণ করে এই ডেটা সেটটি তৈরি করা হয়েছে।
            </p>
            <div className="mt-2 pt-2 border-t border-primary/10">
              <p className="text-[11px] text-primary/60 font-medium italic leading-relaxed">
                * বর্তমানে প্রদর্শিত ডেটা মার্চ–এপ্রিল ২০২৬ সময়কালের Landsat 8/9 স্যাটেলাইট থেকে প্রাপ্ত গড় তথ্য।
              </p>
            </div>
            {summaryData?.last_updated && (
              <p className="text-[10px] text-primary/60 font-bold mt-1 uppercase tracking-tighter">সিস্টেম সিঙ্ক: {summaryData.last_updated}</p>
            )}
            {summaryData?.observation_date && (
              <p className="text-[10px] text-primary/60 font-bold mt-0.5 uppercase tracking-tighter italic opacity-80">স্যাটেলাইট রেকর্ড: {summaryData.observation_date}</p>
            )}
          </div>
        </div>

        <div className="flex-grow relative rounded-2xl overflow-hidden border border-outline-variant/20 shadow-2xl bg-surface-container">
          {/* Mode Toggle - floating over map */}
          <div className="absolute top-4 left-4 z-[1000] flex gap-2">

            {viewMode === 'area' && (
              <button 
                onClick={() => dispatch(setViewMode('whole'))}
                className="px-4 py-2 rounded-xl font-bold font-bengali bg-secondary text-on-secondary border border-secondary shadow-lg text-sm"
              >
                পুরো ঢাকা দেখুন
              </button>
            )}
          </div>

          <DhakaHeatMap key="heatmap-map" pageMode="heat" />
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-between px-2">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Temperature (°C)</span>
            <div className="h-2 w-48 rounded-full heat-gradient" />
            <div className="flex gap-4 text-[10px] font-medium text-on-surface-variant">
              <span>25° → 45°+</span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span className="text-[10px] font-medium text-on-surface-variant font-bengali">সহনীয়</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span className="text-[10px] font-medium text-on-surface-variant font-bengali">উচ্চ</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-600"></div>
              <span className="text-[10px] font-medium text-on-surface-variant font-bengali">বিপজ্জনক</span>
            </div>
          </div>
        </div>
      </section>

      {/* Right: Info Sidebar */}
      <motion.aside 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full md:w-[50%] h-[calc(100vh-64px)] overflow-y-auto p-4 md:p-6 bg-surface-container-lowest border-l border-outline-variant/10"
      >
        <motion.div 
          key={currentData.name_en} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          
          {/* Area Header */}
          <header className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-xl">location_on</span>
                <span className="text-xs font-bold uppercase tracking-widest font-label">Selected Area</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-on-surface font-bengali tracking-tight">
                {currentData.name_bn}
              </h1>
              <p className="text-on-surface-variant font-label opacity-80">
                {currentData.name_en} এলাকার বিস্তারিত বিশ্লেষণ
              </p>
            </div>
            <div className="text-right">
              {viewMode === 'area' && selectedThana && (
                <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
                  Rank #{(function() {
                    const allThanasList = Object.values(thanas || {});
                    const sorted = [...allThanasList].sort((a: any, b: any) => b.nasa_data.lst_celsius - a.nasa_data.lst_celsius);
                    return sorted.findIndex((t: any) => t.name_en === selectedThana.name_en) + 1;
                  })()}
                </div>
              )}
              <div className="text-[10px] text-on-surface-variant font-medium opacity-60">
                {selectedThana ? `${selectedThana.lat}°N, ${selectedThana.lon}°E` : 'Dhaka, Bangladesh'}
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Primary Metric: Temperature */}
            <div className="glass-panel rounded-3xl p-6 border border-outline-variant/10 flex flex-col items-center justify-center text-center space-y-4 group transition-all hover:border-primary/30">
              <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest font-label">{mode === 'heat' ? 'তাপমাত্রা বিশ্লেষণ' : 'সবুজায়ন বিশ্লেষণ'}</h3>
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80" cy="80" r="70"
                    fill="transparent" stroke="currentColor" strokeWidth="12"
                    className="text-surface-container-high"
                  />
                  <circle
                    cx="80" cy="80" r="70"
                    fill="transparent" 
                    stroke={getDynamicColor(currentData.nasa_data.lst_celsius)} 
                    strokeWidth="12"
                    strokeDasharray="439.8"
                    strokeDashoffset={mode === 'heat' ? heatRingOffset : greenRingOffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-on-surface">
                    {mode === 'heat' ? `${Number(currentData.nasa_data.lst_celsius).toFixed(1)}°C` : `${currentData.green_analysis.percentage}%`}
                  </span>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                    {mode === 'heat' ? 'Surface Temp' : 'Green Coverage'}
                  </span>
                </div>
              </div>
              <div 
                style={{ 
                  backgroundColor: `${getDynamicColor(currentData.nasa_data.lst_celsius)}1A`,
                  color: getDynamicColor(currentData.nasa_data.lst_celsius)
                }}
                className="px-4 py-1.5 rounded-full text-[10px] font-bold font-bengali border border-current/10"
              >
                {mode === 'heat' ? currentData.heat_analysis?.label_bn || 'মাঝারি' : currentData.green_analysis?.label_bn || 'মাঝারি'}
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-rows-2 gap-4 flex-1">

              <div className="bg-primary/5 rounded-2xl p-4 flex items-center gap-4 border border-primary/10">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">nature_people</span>
                </div>
                <div>
                  <div className="flex flex-col">
                    <div className="text-[14px] font-bold text-primary uppercase tracking-wider font-label mb-0.5">গাছপালার পরিমাণ</div>
                    <div className="text-base font-black text-on-surface font-bengali flex items-baseline gap-2">
                      {Number(currentData.green_analysis.percentage).toFixed(1)}% 
                      {currentData.green_analysis.percentage < 25 ? (
                        <span className="text-[10px] font-bold text-error">({(25 - currentData.green_analysis.percentage).toFixed(1)}% কম)</span>
                      ) : (
                        <span className="text-[10px] font-bold text-green-600">({(currentData.green_analysis.percentage - 25).toFixed(1)}% বেশি)</span>
                      )}
                    </div>
                    <p className="text-[12px] font-bold text-on-surface-variant font-bengali opacity-60">আদর্শ শহরের জন্য ২৫% সবুজায়ন প্রয়োজন।</p>
                  </div>
                </div>
              </div>

              <div className={`${currentData.nasa_data.lst_celsius >= 34 ? 'bg-error/5 border-error/10 text-error' : 'bg-primary/5 border-primary/10 text-primary'} rounded-2xl p-4 flex items-center gap-4 border`}>
                <div className={`w-10 h-10 rounded-xl ${currentData.nasa_data.lst_celsius >= 34 ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'} flex items-center justify-center`}>
                  <span className="material-symbols-outlined">
                    {currentData.nasa_data.lst_celsius >= 34 ? 'warning' : 'info'}
                  </span>
                </div>
                <div>
                  <div className={`text-[13px] mb-1 font-bold uppercase tracking-wider font-label ${currentData.nasa_data.lst_celsius >= 34 ? 'text-error' : 'text-primary'}`}>
                    {currentData.nasa_data.lst_celsius >= 34 ? 'সতর্কবার্তা' : 'আবহাওয়ার বার্তা'}
                  </div>
                  <div className="text-xs font-bold text-on-surface font-bengali leading-tight">
                    {currentData.heat_analysis?.weather_message || 'ডেটা লোড হচ্ছে...'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Analysis Section */}
          <section className="pt-6 space-y-4">
            <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-[0.2em] font-label border-b border-outline-variant/10 pb-2">তাপমাত্রার পরিবর্তন (৫ বছর)</h3>
            <div key={currentData.name_en} className="h-56 w-full bg-surface-container/50 rounded-3xl p-6 flex items-end gap-3 border border-outline-variant/10 shadow-inner">
              {(currentData.trend?.lst_values || [32.1, 33.5, 32.8, 34.2, 35.1]).map((val, i) => {
                const heightPercent = Math.min((val / 50) * 100, 100);
                // Get solid color based on temperature
                const barColor = val >= 38 ? "#7f1d1d" : val >= 36 ? "#dc2626" : val >= 34 ? "#ea580c" : val >= 32 ? "#d97706" : "#16a34a";
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative h-full justify-end pt-4">
                    {/* The Bar - Solid Color */}
                    <div 
                      className="w-full rounded-t-xl transition-all duration-700 ease-out relative origin-bottom shadow-lg group-hover:brightness-110"
                      style={{ 
                        height: `${heightPercent}%`,
                        backgroundColor: barColor,
                        boxShadow: `0 4px 15px ${barColor}33`
                      }}
                    >
                      {/* Permanent Label on Top */}
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-on-surface-variant whitespace-nowrap">
                        {val.toFixed(1)}°C
                      </div>
                      
                      {/* Tooltip on Hover */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-on-surface text-surface text-[10px] font-black rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-1 shadow-xl z-20 whitespace-nowrap border border-white/10">
                        {val.toFixed(1)}°C
                      </div>
                    </div>
                    
                    {/* Year Label */}
                    <span className="text-[10px] font-black text-on-surface-variant font-label opacity-40 group-hover:opacity-100 transition-opacity">
                      {currentData.trend?.years?.[i] || (2021 + i)}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Action CTA */}
          <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-between shadow-xl shadow-primary/20 group">
            <div className="space-y-1">
              <h4 className="text-lg font-black font-bengali leading-none">আপনার এলাকাকে সবুজ করুন</h4>
              <p className="text-xs opacity-80 font-medium">AI ব্যবহার করে পার্সোনালাইজড সবুজায়ন পরিকল্পনা নিন</p>
            </div>
            <Link href="/green-planner" className="w-12 h-12 rounded-2xl bg-on-primary text-primary flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </motion.div>
      </motion.aside>
    </main>
  );
}
