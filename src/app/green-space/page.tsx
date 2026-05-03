"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { setMode, setViewMode, fetchMapData } from "@/store/mapSlice";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect } from "react";
import { motion } from "framer-motion";

// Define Thana type locally or import if available
interface Thana {
  name_bn: string;
  name_en: string;
  lat: number;
  lon: number;
  nasa_data: { lst_celsius: number; ndvi: number; data_source: string };
  green_analysis: { 
    percentage: number; 
    label_bn: string; 
    level: string;
    trend?: { values: number[]; years: number[] }
  };
  opportunity: { 
    score: number; 
    label_bn: string; 
    is_zone: boolean; 
    recommendations?: { title: string; desc: string; icon: string }[] 
  };
  rooftop_impact: { temp_reduction_celsius: number; carbon_offset_kg_year: number };
}

const DhakaHeatMap = dynamic(() => import("@/components/DhakaHeatMap"), { ssr: false });

export default function GreenSpace() {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedThana, viewMode, summaryData, thanas } = useSelector((state: RootState) => state.map);

  useEffect(() => {
    dispatch(setMode("green"));
    dispatch(fetchMapData(false));
  }, [dispatch]);

  const currentData = (selectedThana || {
    name_bn: "পুরো ঢাকা",
    name_en: "Dhaka",
    lat: 23.8103,
    lon: 90.4125,
    nasa_data: { lst_celsius: summaryData.avgTemp || 33.5, ndvi: 0.18, data_source: "NASA MODIS" },
    green_analysis: { 
      percentage: summaryData.avgGreen || 18.2, 
      label_bn: "অপ্রতুল", 
      level: "poor",
      trend: { values: [10, 12, 15, 18, 20, 22], years: [2020, 2021, 2022, 2023, 2024, 2025] }
    },
    opportunity: { score: 75, label_bn: "প্রচুর সম্ভাবনা", is_zone: true, recommendations: [] },
    rooftop_impact: { temp_reduction_celsius: 2.8, carbon_offset_kg_year: 450 }
  }) as Thana;

  const getPotentialColor = (score: number) => {
    if (score >= 80) return "#166534";
    if (score >= 60) return "#22c55e";
    if (score >= 40) return "#a3e635";
    return "#eab308";
  };

  return (
    <main className="pt-[64px] min-h-screen flex flex-col md:flex-row overflow-hidden bg-background">
      {/* Left: Interactive Map */}
      <section className="w-full md:w-[50%] flex flex-col h-[60vh] md:h-[calc(100vh-64px)] p-4 md:p-6 bg-surface-container-lowest">
        <div className="flex-grow relative rounded-2xl overflow-hidden border border-outline-variant/20 shadow-2xl bg-surface-container">
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
          <DhakaHeatMap key="greenery-map" pageMode="green" />
        </div>

        <div className="mt-4 flex items-center justify-between px-2">
          {/* Mobile Legend */}
          <div className="block md:hidden">
            <div className="flex items-center gap-x-5">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">সবুজায়নের সুযোগ</span>
              <div className="flex gap-4 text-[10px] font-medium text-on-surface-variant">
                <span>০% → ১০০%</span>
              </div>
            </div>
            <div className="h-2 w-48 rounded-full bg-gradient-to-r from-red-600 via-yellow-500 to-green-500 border border-outline-variant/20 my-2" />
            <div className="flex gap-x-5">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-600"></div>
                <span className="text-[10px] font-medium text-on-surface-variant font-bengali">অল্প</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span className="text-[10px] font-medium text-on-surface-variant font-bengali">মাঝারি</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-[10px] font-medium text-on-surface-variant font-bengali">প্রচুর</span>
              </div>
            </div>
          </div>

          {/* Desktop Legend */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">সবুজায়নের সুযোগ</span>
            <div className="h-2 w-48 rounded-full bg-gradient-to-r from-red-600 via-yellow-500 to-green-500 border border-outline-variant/20" />
            <span className="text-[10px] font-medium text-on-surface-variant font-bengali">০% → ১০০%</span>
          </div>
          <div className="hidden md:flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-600"></div>
              <span className="text-[10px] font-medium text-on-surface-variant font-bengali">অল্প</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span className="text-[10px] font-medium text-on-surface-variant font-bengali">মাঝারি</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-[10px] font-medium text-on-surface-variant font-bengali">প্রচুর</span>
            </div>
          </div>
        </div>
      </section>

      {/* Right: Info Sidebar */}
      <motion.aside 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full md:w-[50%] h-[calc(100vh-64px)] overflow-y-auto p-4 md:p-6 bg-surface-container-lowest border-l border-outline-variant/10"
      >
        <div key={currentData.name_en} className="max-w-2xl mx-auto space-y-8 pb-12">
          
          <header className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-xl">potted_plant</span>
                <span className="text-xs font-bold uppercase tracking-widest font-label">সবুজায়ন পরিকল্পনা</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-on-surface font-bengali tracking-tight">
                {currentData.name_bn}
              </h1>
              <p className="text-on-surface-variant font-label opacity-80">
                {currentData.name_en} এলাকার গাছপালার বর্তমান ও ভবিষ্যৎ চিত্র
              </p>
            </div>
            {viewMode === 'area' && selectedThana && (
              <div className="text-right">
                <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Rank #{(function() {
                    const allThanasList = Object.values(thanas || {});
                    const sorted = [...allThanasList].sort((a: any, b: any) => b.green_analysis.percentage - a.green_analysis.percentage);
                    return sorted.findIndex((t: any) => t.name_en === selectedThana.name_en) + 1;
                  })()}
                </div>
              </div>
            )}
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Primary Metric: Potential */}
            <div className="glass-panel rounded-[2rem] p-6 border border-outline-variant/10 flex flex-col items-center justify-center text-center space-y-4 group transition-all hover:border-primary/30 shadow-sm">
              <h3 className="font-bold text-on-surface-variant font-label">সবুজায়নের সুযোগ</h3>
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-primary/5" />
                  <circle 
                    cx="80" cy="80" r="70" fill="transparent" 
                    stroke={getPotentialColor(currentData.opportunity.score)} 
                    strokeWidth="12" 
                    strokeDasharray="439.8" 
                    strokeDashoffset={439.8 * (1 - currentData.opportunity.score / 100)} 
                    strokeLinecap="round" 
                    className="transition-all duration-1000" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black" style={{ color: getPotentialColor(currentData.opportunity.score) }}>
                    {Number(currentData.opportunity.score).toFixed(1)}%
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">Potential</span>
                </div>
              </div>
              <div 
                className="px-4 py-1 rounded-full text-[10px] font-bold font-bengali border"
                style={{
                  backgroundColor: `${getPotentialColor(currentData.opportunity.score)}1A`,
                  color: getPotentialColor(currentData.opportunity.score),
                  borderColor: `${getPotentialColor(currentData.opportunity.score)}33`
                }}
              >
                {currentData.opportunity.label_bn}
              </div>
            </div>

            {/* Scientific Impact Box - Small and compact next to circle */}
            <div className="bg-primary/5 rounded-[2rem] p-6 border border-primary/10 flex flex-col justify-center space-y-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-sm">analytics</span>
                <h6 className="text-xl font-bold text-primary font-label">পরিবেশগত প্রভাব ও বিশ্লেষণ</h6>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-surface-container/50 p-3 rounded-xl border border-outline-variant/10">
                  <span className="text-[11px] font-bold text-on-surface-variant font-bengali">বর্তমান সবুজায়ন</span>
                  <span className="text-base font-black text-primary font-bengali">{currentData.green_analysis.percentage}%</span>
                </div>
                <div className="flex items-center justify-between bg-surface-container/50 p-3 rounded-xl border border-outline-variant/10">
                  <span className="text-[11px] font-bold text-on-surface-variant font-bengali">বর্তমান তাপমাত্রা</span>
                  <span className="text-base font-black text-orange-600 font-bengali">{currentData.nasa_data.lst_celsius}°C</span>
                </div>
                <div className="flex items-center justify-between bg-surface-container/50 p-3 rounded-xl border border-outline-variant/10">
                  <span className="text-[11px] font-bold text-on-surface-variant font-bengali">সম্ভাব্য তাপ হ্রাস</span>
                  <span className="text-base font-black text-blue-600 font-bengali">~{((currentData.opportunity.score / 10) * 0.45).toFixed(1)}°C</span>
                </div>
                <div className="flex items-center justify-between bg-surface-container/50 p-3 rounded-xl border border-outline-variant/10">
                  <span className="text-[11px] font-bold text-on-surface-variant font-bengali">কার্বন শোষণ</span>
                  <span className="text-base font-black text-green-600 font-bengali">{Math.round(currentData.opportunity.score * 8.5)} KG/Year</span>
                </div>
              </div>
            </div>
          </div>

          
          {/* Greenery Trend Chart */}
          <section className="pt-6 space-y-4">
            <h3 className="text-sm font-bold text-on-surface-variant uppercase font-label border-b border-outline-variant/10 pb-2">সবুজায়নের পরিবর্তন (৫ বছর)</h3>
            <div key={currentData.name_en} className="h-48 w-full bg-surface-container/30 rounded-3xl p-6 flex items-end gap-3 border border-outline-variant/10">
              {(currentData.green_analysis?.trend?.values || [10, 12, 15, 18, 20, 22]).map((val, i) => {
                const heightPercent = Math.min((val / 50) * 100, 100); 
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
                    <div 
                      className="w-full rounded-t-lg transition-all duration-700 bg-primary/40 group-hover:bg-primary shadow-lg relative"
                      style={{ height: `${heightPercent}%` }}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-black text-on-surface-variant whitespace-nowrap">
                        {val.toFixed(1)}%
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-on-surface-variant opacity-40">
                      {currentData.green_analysis?.trend?.years?.[i] || (2020 + i)}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Unified Advice Section */}
          <section className="pt-6">
            <div className="bg-surface-container rounded-[2.5rem] p-8 border border-outline-variant/10 shadow-sm space-y-8 relative overflow-hidden">
              <div className="flex items-center gap-4 border-b border-outline-variant/10 pb-6 relative z-10">
          
                <div>
                  <h3 className="text-xl font-black text-on-surface font-bengali">খালি জায়গার ব্যবহার ও পরামর্শ</h3>
                  <p className="text-xs text-on-surface-variant font-label opacity-70 uppercase tracking-widest">Scientific Greening Strategy</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-primary font-bengali flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">roofing</span>
                      রুফটপ ও ভার্টিক্যাল গ্রিনিং
                    </h4>
                    <p className="text-sm text-on-surface-variant font-bengali leading-relaxed">
                      জনবহুল শহরে খোলা জমির পরিমাণ সীমিত হওয়ায় ছাদ হতে পারে আপনার ব্যক্তিগত অক্সিজেন ফ্যাক্টরি। রুফটপ গার্ডেনিংয়ের মাধ্যমে আপনি কেবল তাজা সবজিই পাবেন না, বরং ভবনের অভ্যন্তরীণ তাপমাত্রা ৩-৪ ডিগ্রি কমাতে পারবেন।
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-secondary font-bengali flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">park</span>
                      কমিউনিটি স্পেস ও রোডসাইড
                    </h4>
                    <p className="text-sm text-on-surface-variant font-bengali leading-relaxed">
                      রাস্তার পাশে এবং স্থানীয় পার্কে দেশীয় গাছ (যেমন: নিম, কদম, বকুল) লাগানোর মাধ্যমে ধুলোবালি নিয়ন্ত্রণ এবং ছায়া নিশ্চিত করা সম্ভব। এটি এলাকার বায়ুমান উন্নয়নে সরাসরি ভূমিকা রাখে।
                    </p>
                  </div>
                </div>

                <div className="bg-primary/5 rounded-[2rem] p-6 border border-primary/10 space-y-4">
                  <h4 className="text-sm font-black text-on-surface uppercase tracking-widest font-label border-b border-primary/10 pb-2">কেন দেশীয় গাছ লাগাবেন?</h4>
                  <ul className="space-y-4">
                    {[
                      { icon: 'temp_preferences_custom', text: 'স্থানীয় আবহাওয়ার সাথে খাপ খাইয়ে দ্রুত বেড়ে ওঠে।' },
                      { icon: 'nature', text: 'নিম ও কদম কার্বন শোষণে সবচেয়ে কার্যকর।' },
                      { icon: 'water_drop', text: 'পানির অপচয় কম হয়।' },
                      { icon: 'pets', text: 'পাখিদের নিরাপদ আশ্রয় নিশ্চিত করে।' }
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-primary text-sm ">{item.icon}</span>
                        <span className="text-xs font-bold text-on-surface-variant font-bengali my-auto">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>


          {/* Action CTA - Enhanced Premium Design */}
          <div className="relative mt-4 group">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-8 rounded-[2.5rem] bg-surface-container-high border border-primary/20 overflow-hidden group">
              {/* Background Decoration */}
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors"></div>
              
              <div className="relative z-10 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                    <span className="material-symbols-outlined text-sm">magic_button</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">Smart AI</span>
                  </div>
                  <span className="material-symbols-outlined text-primary/30 group-hover:text-primary transition-colors">auto_awesome</span>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-2xl font-black font-bengali text-on-surface tracking-tight leading-tight">সবুজায়ন পরিকল্পনা <br/> শুরু করুন</h4>
                  <p className="text-xs text-on-surface-variant font-bengali opacity-70 leading-relaxed">
                    আমাদের এআই আপনার এলাকার ডেটা বিশ্লেষণ করে আপনার জন্য সেরা সবুজায়ন সমাধান তৈরি করবে।
                  </p>
                </div>

                <Link href="/green-planner" className="flex items-center justify-between p-4 rounded-2xl bg-primary text-on-primary font-black font-bengali hover:shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] transition-all group/btn">
                  পরিকল্পনা শুরু করুন
                  <div className="w-8 h-8 rounded-xl bg-on-primary/20 flex items-center justify-center group-hover/btn:translate-x-1 transition-transform">
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Data Source & Methodology */}
          <div className="mt-8 pt-8 border-t border-outline-variant/10 space-y-4">
            <div className="flex items-start gap-3 bg-primary/5 p-4 rounded-2xl border border-primary/10">
              <span className="material-symbols-outlined text-primary text-xl">info</span>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-primary font-label mb-1">Data Source & Methodology</h4>
                <p className="text-xs text-on-surface-variant font-bengali leading-relaxed opacity-80">
                  এই তথ্যগুলো সরাসরি নাসা (NASA) ল্যান্ডস্যাট ৮ এবং ৯ স্যাটেলাইট থেকে সংগৃহীত। গুগল আর্থ ইঞ্জিন (Google Earth Engine) ব্যবহার করে ঢাকার ভূমির তাপমাত্রা (LST) এবং সবুজ বনায়ন বিশ্লেষণ করে এই ডেটা সেটটি তৈরি করা হয়েছে।
                </p>
                <p className="text-[10px] text-primary/60 font-medium italic mt-2 leading-relaxed">
                  * বর্তমানে প্রদর্শিত ডেটা মার্চ–এপ্রিল ২০২৬ সময়কালের Landsat 8/9 স্যাটেলাইট থেকে প্রাপ্ত গড় তথ্য।
                </p>
                <div className="mt-3 pt-3 border-t border-primary/5 flex flex-col gap-1">
                   {summaryData?.last_updated && (
                    <p className="text-[9px] text-primary/40 font-bold uppercase tracking-tighter">সিস্টেম সিঙ্ক: {summaryData.last_updated}</p>
                  )}
                  {summaryData?.observation_date && (
                    <p className="text-[9px] text-primary/40 font-bold uppercase tracking-tighter">স্যাটেলাইট রেকর্ড: {summaryData.observation_date}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </motion.aside>
    </main>
  );
}
