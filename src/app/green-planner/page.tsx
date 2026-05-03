
"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { motion } from "framer-motion";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

interface Plan {
  tier: string;
  title: string;
  description: string;
  metrics: {
    co2: number;
    oxygen: number;
    profit: number;
    cooling: number;
  };
  plants: string[];
  tech: string[];
  budget: number;
}

export default function GreenPlanner() {
  const { selectedThana: reduxSelectedThana, thanas: reduxThanas } = useSelector((state: any) => state.map);
  const thanas = reduxThanas || [];

  const [formData, setFormData] = useState({
    thana: "",
    spaceType: "rooftop",
    size: 500,
    budget: 50000,
    priority: "balanced",
  });

  const [results, setResults] = useState<Plan[] | null>(null);
  const [isPlanning, setIsPlanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Sync with Redux or URL
  useEffect(() => {
    if (reduxSelectedThana) {
      setFormData(prev => ({ ...prev, thana: reduxSelectedThana.name_en }));
    } else {
      const params = new URLSearchParams(window.location.search);
      const thanaParam = params.get('thana');
      if (thanaParam) {
        const found = thanas.find((t: any) => t.name_bn === thanaParam || t.name_en === thanaParam);
        if (found) setFormData(prev => ({ ...prev, thana: found.name_en }));
      }
    }
  }, [reduxSelectedThana, thanas]);

  // Geolocation Detection
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError("আপনার ব্রাউজার লোকেশন সাপোর্ট করে না।");
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Simple nearest neighbor find
        let nearest = thanas[0];
        let minDist = Infinity;
        
        thanas.forEach((t: any) => {
          // Approximate distance (good enough for city scale)
          const dist = Math.sqrt(Math.pow(t.lat - latitude, 2) + Math.pow(t.lon - longitude, 2));
          if (dist < minDist) {
            minDist = dist;
            nearest = t;
          }
        });

        setFormData(prev => ({ ...prev, thana: nearest.name_en }));
        setIsDetectingLocation(false);
        showToast(`আপনার লোকেশন অনুযায়ী ${nearest.name_bn} সিলেক্ট করা হয়েছে।`);
      },
      () => {
        setIsDetectingLocation(false);
        setError("লোকেশন পারমিশন পাওয়া যায়নি।");
      }
    );
  };

  const generatePlans = async () => {
    if (!formData.thana) {
      setError("দয়া করে আগে আপনার এলাকা নির্বাচন করুন।");
      return;
    }

    setIsPlanning(true);
    setError(null);
    setResults(null);

    const { thana, spaceType, size, budget, priority } = formData;
    
    let localTemp = 34.5; 
    const selectedAreaData = thanas.find((t: any) => t.name_en === thana);
    if (selectedAreaData && selectedAreaData.nasa_data) {
      localTemp = selectedAreaData.nasa_data.lst_celsius;
    }

    const spaceTypeLabels: Record<string, string> = {
      rooftop:   "ছাদ বাগান (Rooftop Garden)",
      vertical:  "বারান্দা / ব্যালকনি (Balcony Garden)",
      open:      "খোলা মাঠ (Open Ground)",
      roadside:  "রাস্তার পাশে (Roadside Planting)",
      indoor:    "ইনডোর গার্ডেন (Indoor Garden)",
      community: "কমিউনিটি গার্ডেন (Community Garden)",
    };
    const priorityLabels: Record<string, string> = {
      environment: "পরিবেশ সংরক্ষণ (Environmental Focus)",
      balanced:    "ভারসাম্য (Balanced - Environment + Economy equally)",
      economic:    "অর্থনৈতিক সুবিধা (Economic / Profit Focus)",
    };

    const prompt = `You are a professional Urban Farming AI Consultant for Dhaka. 
    Location: ${thana}
    Space Type: ${spaceTypeLabels[spaceType] || spaceType}
    Size: ${size} sqft
    Budget: ${budget} BDT
    Priority: ${priorityLabels[priority] || priority}
    Current Temperature: ${localTemp}°C

    Generate 3 distinct plans (Low Cost, Standard, Premium) within the budget ${budget} BDT.
    Return ONLY a JSON array of objects with:
    {
      "tier": "Low Cost | Standard | Premium",
      "title": "Creative Title in natural Bengali",
      "description": "Professional and highly natural fluent Bengali description explaining the strategy. Do not sound like a machine translation.",
      "metrics": { "co2": kg/yr, "oxygen": L/yr, "profit": BDT/mo, "cooling": °C },
      "plants": ["Plant names in Bengali"],
      "tech": ["Tech tools"],
      "budget": cost
    }`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        let text = data.candidates[0].content.parts[0].text;
        text = text.replace(/```json|```/g, "").trim();
        setResults(JSON.parse(text));
      } else {
        throw new Error("AI response error");
      }
    } catch (err) {
      console.error(err);
      setError("এআই সলিউশন জেনারেট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsPlanning(false);
    }
  };

  const [toast, setToast] = useState<string | null>(null);
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <main className="pt-[64px] min-h-screen bg-background text-on-surface">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <section className="text-center mb-16 space-y-4">
          <h1 className="text-3xl md:text-5xl font-black font-bengali tracking-tight">
            আপনার স্মার্ট<span className="text-primary"> সবুজায়ন </span>প্ল্যান
          </h1>
          <p className="text-lg text-on-surface-variant font-bengali max-w-2xl mx-auto opacity-80 font-medium">
            আপনার জায়গার পরিমাপ এবং বাজেট অনুযায়ী এআই থেকে ৩টি ভিন্নধর্মী পার্সোনালাইজড সলিউশন জেনারেট করুন।
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar Form */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-2xl space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-bengali flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">analytics</span>
                  আপনার তথ্য দিন
                </h3>
                <button 
                  onClick={detectLocation}
                  disabled={isDetectingLocation}
                  className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary hover:opacity-80 transition-opacity"
                >
                  <span className={`material-symbols-outlined text-sm ${isDetectingLocation ? 'animate-spin' : ''}`}>my_location</span>
                  {isDetectingLocation ? 'Detecting...' : 'Detect'}
                </button>
              </div>

              <div className="space-y-6">
                {/* Area Select */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">এলাকা নির্বাচন করুন</label>
                  <select
                    value={formData.thana}
                    onChange={(e) => setFormData({ ...formData, thana: e.target.value })}
                    className="w-full bg-surface-container-high border border-outline-variant/10 rounded-2xl p-4 font-bengali text-on-surface focus:outline-none focus:border-primary transition-all appearance-none"
                  >
                    <option value="" disabled>সিলেক্ট করুন</option>
                    {thanas.map(t => (
                      <option key={t.name_en} value={t.name_en}>{t.name_bn}</option>
                    ))}
                  </select>
                </div>

                {/* Space Type */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">জায়গার ধরন</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "rooftop",  icon: "roofing",      label: "ছাদ" },
                      { id: "vertical", icon: "potted_plant", label: "বারান্দা" },
                      { id: "open",     icon: "park",         label: "খোলা মাঠ" },
                    ].map(t => (
                      <button 
                        key={t.id}
                        onClick={() => setFormData({ ...formData, spaceType: t.id })}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${formData.spaceType === t.id ? 'bg-primary text-on-primary border-primary shadow-lg scale-105' : 'bg-surface-container-high text-on-surface-variant border-outline-variant/10 hover:border-primary/40'}`}
                      >
                        <span className="material-symbols-outlined text-xl">{t.icon}</span>
                        <span className="text-[10px] font-bold font-bengali">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">অগ্রাধিকার</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "environment", icon: "eco",      label: "পরিবেশ" },
                      { id: "balanced",    icon: "balance",  label: "ভারসাম্য" },
                      { id: "economic",    icon: "payments", label: "অর্থনৈতিক" },
                    ].map(p => (
                      <button
                        key={p.id}
                        onClick={() => setFormData({ ...formData, priority: p.id })}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${formData.priority === p.id ? 'bg-secondary text-on-secondary border-secondary shadow-lg scale-105' : 'bg-surface-container-high text-on-surface-variant border-outline-variant/10 hover:border-secondary/40'}`}
                      >
                        <span className="material-symbols-outlined text-xl">{p.icon}</span>
                        <span className="text-[10px] font-bold font-bengali">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sliders */}
                <div className="space-y-6">
                  <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/5">
                    <div className="flex justify-between mb-3 text-[10px] font-bold">
                      <span className="text-on-surface-variant">বাজেট</span>
                      <span className="text-primary">৳{formData.budget.toLocaleString()}</span>
                    </div>
                    <input type="range" min="5000" max="500000" step="5000" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })} className="w-full h-1 bg-outline-variant/20 rounded-full appearance-none cursor-pointer accent-primary" />
                  </div>
                  <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/5">
                    <div className="flex justify-between mb-3 text-[10px] font-bold">
                      <span className="text-on-surface-variant">আয়তন (sqft)</span>
                      <span className="text-secondary">{formData.size} ft²</span>
                    </div>
                    <input type="range" min="50" max="5000" step="50" value={formData.size} onChange={(e) => setFormData({ ...formData, size: parseInt(e.target.value) })} className="w-full h-1 bg-outline-variant/20 rounded-full appearance-none cursor-pointer accent-secondary" />
                  </div>
                </div>

                <button 
                  onClick={generatePlans}
                  disabled={isPlanning}
                  className="w-full bg-primary text-on-primary py-5 rounded-2xl font-bold font-bengali flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isPlanning ? <span className="animate-spin material-symbols-outlined">progress_activity</span> : <><span className="material-symbols-outlined">magic_button</span>এআই প্ল্যান জেনারেট করুন</>}
                </button>

                {error && <p className="text-xs text-error font-bengali text-center mt-4">{error}</p>}
              </div>
            </div>

            {/* Expert Contact */}
            <div className="p-6 rounded-[2rem] bg-secondary/10 border border-secondary/20 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined">call</span>
              </div>
              <div>
                <h4 className="text-sm font-bold font-bengali text-on-surface">সরাসরি বিশেষজ্ঞের পরামর্শ প্রয়োজন?</h4>
                <a href="https://wa.me/8801569174735" className="text-xs font-bold text-secondary flex items-center gap-1 hover:underline mt-1">
                  WhatsApp করুন <span className="material-symbols-outlined text-xs">open_in_new</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Results Area */}
          <div className="lg:col-span-8">
            {!results && !isPlanning && (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 rounded-[3rem] bg-surface-container-lowest border-2 border-dashed border-outline-variant/20">
                <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-4xl text-primary/40">lightbulb</span>
                </div>
                <h3 className="text-xl font-bold font-bengali text-on-surface-variant">আপনার তথ্য দিয়ে শুরু করুন</h3>
                <p className="text-base text-on-surface-variant font-bengali mt-4 max-w-sm font-medium">বামে থাকা ফর্মটি পূরণ করুন এবং "এআই প্ল্যান জেনারেট করুন" বাটনে ক্লিক করে ফলাফল দেখুন।</p>
              </div>
            )}

            {isPlanning && (
              <div className="flex flex-col items-center justify-center py-24 gap-6">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping"></div>
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-primary animate-pulse">psychology</span>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-xl font-black font-bengali text-on-surface">এআই প্ল্যান তৈরি করছে...</p>
                  <p className="text-sm text-on-surface-variant font-bengali opacity-70">আপনার এলাকার ডেটা বিশ্লেষণ করে সেরা সমাধান খোঁজা হচ্ছে</p>
                </div>
              </div>
            )}

            {results && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.2 }}
                className="space-y-8"
              >
                {results.map((plan, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.15 }}
                    className="bg-surface-container-high p-10 rounded-[3rem] border border-outline-variant/10 relative group transition-all hover:border-primary/20 hover:shadow-2xl"
                  >
                    <div className="absolute top-0 right-0 px-8 py-3 rounded-bl-[2rem] bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">{plan.tier}</div>
                    
                    <div className="flex flex-col gap-8">
                      <div className="space-y-4">
                        <h4 className="text-2xl font-black font-bengali text-on-surface">{plan.title}</h4>
                        <p className="text-base text-on-surface-variant font-bengali leading-relaxed">{plan.description}</p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/5 text-center">
                          <span className="text-[10px] font-bold text-on-surface-variant uppercase mb-1 block">Carbon</span>
                          <span className="text-xl font-black text-emerald-600">~{plan.metrics.co2}kg</span>
                        </div>
                        <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/5 text-center">
                          <span className="text-[10px] font-bold text-on-surface-variant uppercase mb-1 block">Oxygen</span>
                          <span className="text-xl font-black text-blue-600">~{plan.metrics.oxygen}L</span>
                        </div>
                        <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/5 text-center">
                          <span className="text-[10px] font-bold text-on-surface-variant uppercase mb-1 block">Profit</span>
                          <span className="text-xl font-black text-amber-600">৳{plan.metrics.profit}</span>
                        </div>
                        <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/5 text-center">
                          <span className="text-[10px] font-bold text-on-surface-variant uppercase mb-1 block">Cooling</span>
                          <span className="text-xl font-black text-red-600">↓{plan.metrics.cooling}°C</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {plan.plants.map(p => (
                          <span key={p} className="px-4 py-2 bg-surface-container-lowest rounded-xl text-xs font-bold font-bengali border border-outline-variant/10">{p}</span>
                        ))}
                      </div>

                      <div className="pt-6 border-t border-outline-variant/10 flex justify-between items-center">
                        <span className="text-lg font-black text-primary font-mono">৳{plan.budget.toLocaleString()}</span>
                        <button 
                          onClick={() => showToast("⚠️ এই ফিচারটি এখন প্রোটোটাইপ পর্যায়ে আছে। শীঘ্রই সম্পূর্ণ সংস্করণ আসছে!")}
                          className="px-6 py-3 bg-on-surface text-surface rounded-2xl font-bold font-bengali hover:bg-primary transition-all"
                        >প্রজেক্ট শুরু করুন</button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-on-surface text-surface px-8 py-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-5">
          <p className="font-bengali font-bold text-sm">{toast}</p>
        </div>
      )}
    </main>
  );
}
