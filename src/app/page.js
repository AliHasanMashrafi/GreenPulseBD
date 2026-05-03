import Link from "next/link";
import Image from "next/image";
import HomeMap from "@/components/HomeMap";
import dhakaData from "@/data/dhaka_heat_data.json";

export const metadata = {
  title: "GreenPulse BD - Urban Greening AI",
  description: "AI-powered urban climate solution for Dhaka City",
};

// Helper function for dynamic temperature color
function getHeatTextColor(celsius) {
  if (celsius >= 38) return "text-red-800 dark:text-red-500";
  if (celsius >= 36) return "text-red-600 dark:text-red-400";
  if (celsius >= 34) return "text-orange-500";
  if (celsius >= 32) return "text-amber-500";
  return "text-green-500";
}

export default function Home() {
  // Get top 5 hottest thanas
  const topHottest = Object.values(dhakaData.thanas)
    .sort((a, b) => b.nasa_data.lst_celsius - a.nasa_data.lst_celsius)
    .slice(0, 5);

  return (
    <main className="pt-[64px]">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] md:h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 z-0">
          <Image
            alt="Dhaka Skyline with Trees"
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
            src="/images/hero_bg.png"
            fill
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/60"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl text-center space-y-8">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl animate-bounce-slow">
            <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.8)]"></span>
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Live NASA Satellite Data</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black font-bengali text-on-background leading-[1.2] tracking-normal">
            আপনার এলাকা কতটা উত্তপ্ত? <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-secondary animate-gradient-x text-2xl md:text-4xl lg:text-5xl block mt-4">জানুন এবং এআই-এর সাহায্যে সবুজায়ন শুরু করুন</span>
          </h1>
          
          <p className="text-lg md:text-xl text-on-surface-variant font-bengali max-w-3xl mx-auto leading-relaxed opacity-90 font-medium">
            স্যাটেলাইট ডেটা এবং থার্মাল অ্যানালাইসিসের মাধ্যমে আপনার এলাকার <br className="hidden md:block"/> পরিবেশগত ঝুঁকি সম্পর্কে জানুন এবং এআই-এর মাধ্যমে সঠিক সমাধান গ্রহণ করুন।
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link href="/heatmap" className="group px-10 py-5 bg-primary text-on-primary rounded-[2rem] font-black font-bengali text-lg hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)] transition-all flex items-center gap-3">
              হিট ম্যাপ দেখুন
              <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
            </Link>
            <Link href="/green-planner" className="px-10 py-5 bg-surface-container-highest/50 backdrop-blur-md text-on-surface rounded-[2rem] font-black font-bengali text-lg hover:bg-surface-container-high transition-all border border-outline-variant/10">
              সবুজায়ন পরিকল্পনা শুরু করুন
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 md:px-24 py-32 bg-surface-container-lowest relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] -ml-48 -mb-48"></div>
        <div className="max-w-4xl mx-auto text-center mb-20 space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
            <span className="material-symbols-outlined text-sm">rocket_launch</span>
            <span className="text-xs font-black uppercase tracking-widest font-label">Core Solutions</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black font-bengali text-on-surface tracking-tight">
            জলবায়ু বুদ্ধিমত্তায় আমাদের সেবা
          </h2>
          <p className="text-lg text-on-surface-variant font-bengali opacity-80 font-medium">
            আমরা আধুনিক স্যাটেলাইট প্রযুক্তি এবং কৃত্রিম বুদ্ধিমত্তাকে কাজে লাগিয়ে আপনার এলাকার পরিবেশগত উন্নয়নে কাজ করি।
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
          <div className="p-10 rounded-[3rem] bg-surface-container-low border border-outline-variant/10 hover:border-primary/30 transition-all group">
            <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-4xl">thermostat</span>
            </div>
            <h3 className="text-xl font-black font-bengali mb-4 text-on-surface">থার্মাল অ্যানালাইসিস</h3>
            <p className="text-base text-on-surface-variant font-bengali leading-relaxed font-medium">স্যাটেলাইট ডেটার সাহায্যে ঢাকার রিয়েল-টাইম ভূমির তাপমাত্রা এবং তাপপ্রবাহ পর্যবেক্ষণ করুন।</p>
          </div>
          
          <div className="p-10 rounded-[3rem] bg-surface-container-low border border-outline-variant/10 hover:border-secondary/30 transition-all group">
            <div className="w-16 h-16 rounded-[1.5rem] bg-secondary/10 flex items-center justify-center text-secondary mb-8 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-4xl">eco</span>
            </div>
            <h3 className="text-xl font-black font-bengali mb-4 text-on-surface">সবুজায়নের সুযোগ</h3>
            <p className="text-base text-on-surface-variant font-bengali leading-relaxed font-medium">আপনার এলাকায় বর্তমানে কী পরিমাণ গাছপালা রয়েছে এবং কোথায় নতুন করে সবুজায়ন করা সম্ভব, তা বিশ্লেষণ করুন।</p>
          </div>
          
          <div className="p-10 rounded-[3rem] bg-surface-container-low border border-outline-variant/10 hover:border-tertiary/30 transition-all group">
            <div className="w-16 h-16 rounded-[1.5rem] bg-tertiary/10 flex items-center justify-center text-tertiary mb-8 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-4xl">smart_toy</span>
            </div>
            <h3 className="text-xl font-black font-bengali mb-4 text-on-surface">এআই প্ল্যানার</h3>
            <p className="text-base text-on-surface-variant font-bengali leading-relaxed font-medium">আপনার নির্দিষ্ট বাজেট এবং জায়গার পরিমাপ অনুযায়ী আমাদের জেনারেটিভ এআই থেকে পার্সোনালাইজড বাগান করার প্ল্যান নিন।</p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="px-6 md:px-24 py-32 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
              <span className="material-symbols-outlined text-sm">psychology</span>
              <span className="text-xs font-black uppercase tracking-widest font-label">Work Flow</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black font-bengali text-on-surface tracking-tight">কীভাবে এটি কাজ করে?</h2>
            <p className="text-lg text-on-surface-variant font-bengali opacity-80 max-w-2xl mx-auto font-medium">৩টি সহজ ধাপে ঢাকার ক্রমবর্ধমান তাপমাত্রা কমানোর উদ্যোগে যুক্ত হোন এবং আপনার চারপাশকে আরও বাসযোগ্য করে তুলুন।</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-24 right-24 h-[2px] bg-gradient-to-r from-primary/10 via-secondary/30 to-tertiary/10 z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-8 group">
              <div className="w-24 h-24 rounded-3xl bg-surface-container border border-outline-variant/10 flex flex-col items-center justify-center shadow-2xl shadow-primary/10 group-hover:scale-110 transition-transform duration-500 group-hover:border-primary/50 group-hover:rotate-3">
                <span className="material-symbols-outlined text-3xl text-primary mb-1">satellite_alt</span>
                <span className="text-xs font-black font-bengali text-primary">ধাপ ০১</span>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-black font-bengali text-on-surface">স্যাটেলাইট ডেটা সংগ্রহ</h3>
                <p className="text-on-surface-variant font-bengali leading-relaxed max-w-xs mx-auto">
                  NASA-এর MODIS এবং Landsat স্যাটেলাইট থেকে সরাসরি ঢাকার ভূমির তাপমাত্রা এবং ভৌগোলিক ছবি সংগ্রহ করা হয়।
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-8 group">
              <div className="w-24 h-24 rounded-3xl bg-surface-container border border-outline-variant/10 flex flex-col items-center justify-center shadow-2xl shadow-secondary/10 group-hover:scale-110 transition-transform duration-500 group-hover:border-secondary/50 group-hover:-rotate-3">
                <span className="material-symbols-outlined text-3xl text-secondary mb-1">memory</span>
                <span className="text-xs font-black font-bengali text-secondary">ধাপ ০২</span>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-black font-bengali text-on-surface">ডেটা প্রসেসিং (GEE)</h3>
                <p className="text-on-surface-variant font-bengali leading-relaxed max-w-xs mx-auto">
                  Google Earth Engine ব্যবহার করে LST (তাপমাত্রা) এবং NDVI (সবুজায়ন) ইনডেক্স ক্যালকুলেট করে ঢাকার বিভিন্ন এলাকার ডেটাবেস তৈরি করা হয়।
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-8 group">
              <div className="w-24 h-24 rounded-3xl bg-surface-container border border-outline-variant/10 flex flex-col items-center justify-center shadow-2xl shadow-tertiary/10 group-hover:scale-110 transition-transform duration-500 group-hover:border-tertiary/50 group-hover:rotate-3">
                <span className="material-symbols-outlined text-3xl text-tertiary mb-1">psychology</span>
                <span className="text-xs font-black font-bengali text-tertiary">ধাপ ০৩</span>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-black font-bengali text-on-surface">এআই অ্যানালাইসিস</h3>
                <p className="text-on-surface-variant font-bengali leading-relaxed max-w-xs mx-auto">
                  সংগৃহীত রিয়েল ডেটার ওপর ভিত্তি করে জেনারেটিভ এআই (Gemini) প্রতিটি এলাকার জন্য কাস্টমাইজড এবং লাভজনক সবুজায়ন প্ল্যান তৈরি করে।
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hottest Areas Overview */}
      <section className="px-6 md:px-24 py-32 bg-surface-container-low relative">
        <div className="flex flex-col lg:flex-row gap-20 items-center max-w-7xl mx-auto">
          <div className="lg:w-1/2 space-y-12">
            <div>
              <div className="flex items-center gap-3 text-error mb-4">
                <span className="material-symbols-outlined animate-pulse">local_fire_department</span>
                <h4 className="text-xs font-black uppercase tracking-[0.3em] font-label">Extreme Heat Watch</h4>
              </div>
              <h2 className="text-3xl md:text-5xl font-black font-bengali text-on-surface leading-tight">
                ঢাকার সবচেয়ে <br className="hidden lg:block"/> উত্তপ্ত ৫টি এলাকা
              </h2>
            </div>
            
            <div className="space-y-4">
              {topHottest.map((thana, idx) => (
                <div key={thana.name_en} className="flex items-center justify-between p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/10 shadow-lg hover:scale-102 transition-all group">
                  <div className="flex items-center gap-6">
                    <span className="text-2xl font-black text-primary/20 group-hover:text-primary/100 transition-colors">0{idx + 1}</span>
                    <div className="text-xl font-black font-bengali text-on-surface">{thana.name_bn}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`text-2xl font-black ${getHeatTextColor(thana.nasa_data.lst_celsius)}`}>{Number(thana.nasa_data.lst_celsius).toFixed(1)}°C</div>
                    <span className={`material-symbols-outlined ${getHeatTextColor(thana.nasa_data.lst_celsius)} text-xl`}>trending_up</span>
                  </div>
                </div>
              ))}
            </div>
            
            <Link href="/heatmap" className="inline-flex items-center gap-2 px-8 py-4 bg-on-surface text-surface rounded-2xl font-black font-bengali hover:bg-primary transition-all shadow-xl no-underline cursor-pointer">
              সব এলাকার তথ্য দেখুন
              <span className="material-symbols-outlined">chevron_right</span>
            </Link>
          </div>
          
          <div className="lg:w-1/2 relative group hidden md:block">
          
            <div className="relative h-[400px] md:h-[600px] w-full rounded-[3rem] md:rounded-[4rem] overflow-hidden border-0 md:border-8 border-surface-container-high shadow-2xl md:shadow-[0_50px_100px_rgba(0,0,0,0.4)] pointer-events-none">
              <HomeMap />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none z-[2000]"></div>
              <div className="absolute bottom-10 left-10 p-8 backdrop-blur-2xl bg-surface-container/80 border border-white/10 rounded-[2.5rem] max-w-sm z-[2000]">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-primary">satellite_alt</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">NASA MODIS Active</span>
                </div>
                <p className="text-sm font-bengali text-on-surface-variant opacity-80 leading-relaxed mb-4 font-medium">
                  NASA স্যাটেলাইট থেকে প্রাপ্ত ডেটার সাহায্যে প্রতি ২৪ ঘণ্টা অন্তর আমাদের ম্যাপ আপডেট করা হয়।
                </p>
                <div className="text-[10px] font-black text-on-surface uppercase tracking-widest">
                  Last Processed: {dhakaData.metadata.processed_date}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-24 py-40">
        <div className="max-w-6xl mx-auto rounded-[4rem] bg-gradient-to-br from-[#061708] to-[#0A2E10] p-16 md:p-24 text-center space-y-10 relative overflow-hidden border border-white/5">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
          <div className="relative z-10 space-y-8">
            <h2 className="text-3xl md:text-6xl font-black font-bengali text-white leading-tight">
              আপনার এলাকাকে সবুজে সাজিয়ে <br className="hidden md:block"/> আরও বাসযোগ্য করে তুলুন
            </h2>
            <p className="text-lg md:text-xl text-white/70 font-bengali max-w-3xl mx-auto font-medium">
              আমাদের এআই আপনাকে এমন একটি কাস্টমাইজড প্ল্যান দেবে, যা একইসাথে পরিবেশবান্ধব এবং সাশ্রয়ী।
            </p>
            <div className="flex justify-center pt-8">
              <Link href="/green-planner" className="md:px-12 md:py-6 px-10 py-4 bg-primary text-on-primary rounded-[2.5rem] font-black font-bengali text-lg md:text-xl hover:scale-105 hover:shadow-[0_20px_60px_rgba(var(--primary-rgb),0.4)] transition-all flex items-center gap-4 cursor-pointer">
                আপনার প্ল্যান তৈরি করুন
                <span className="material-symbols-outlined text-3xl">magic_button</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

