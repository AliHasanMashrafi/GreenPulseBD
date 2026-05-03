
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full pt-24 px-6 md:px-24 bg-surface-container-lowest border-t border-outline-variant/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
        
        {/* Brand */}
        <div className="md:col-span-2 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[1.25rem] bg-primary flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-3xl font-bold">energy_savings_leaf</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-on-surface tracking-tighter leading-none">GreenPulse</span>
              <span className="text-xs font-bold text-primary uppercase tracking-[0.3em] leading-none mt-1">Bangladesh</span>
            </div>
          </div>
          <p className="text-sm md:text-base text-on-surface-variant font-bengali leading-relaxed max-w-sm opacity-80 font-medium">
            সবুজায়নের মাধ্যমে ঢাকাকে শীতল করার একটি উদ্যোগ। NASA-এর স্যাটেলাইট ডেটা বিশ্লেষণ করে শহরের জলবায়ু পরিবর্তনের টেকসই সমাধান তৈরি করছি আমরা।
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/10 shadow-sm mr-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Lead Developer: <span className="text-on-surface">Mashrafi</span></span>
            </div>
            <div className="w-full block md:hidden"></div>
            <a href="https://github.com/AliHasanMashrafi" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-surface-container border border-outline-variant/10 flex items-center justify-center text-on-surface-variant hover:bg-on-surface hover:text-surface transition-all shadow-sm hover:scale-110" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </a>
            
            <a href="https://www.linkedin.com/in/alihasanmashrafi/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-surface-container border border-outline-variant/10 flex items-center justify-center text-on-surface-variant hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-all shadow-sm hover:scale-110" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>

            <a href="https://www.facebook.com/profile.php?id=61586319869277" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-surface-container border border-outline-variant/10 flex items-center justify-center text-on-surface-variant hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all shadow-sm hover:scale-110" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-8">
          <h5 className="text-[12px] font-black text-on-surface-variant opacity-60 font-label">প্রয়োজনীয় লিংক</h5>
          <ul className="space-y-4">
            {['হোম', 'হিটম্যাপ', 'সবুজায়নের সম্ভাবনা', 'এআই প্ল্যানার'].map((label, i) => (
              <li key={i}>
                <Link href={['/', '/heatmap', '/green-space', '/green-planner'][i]} className="text-base font-bold font-bengali text-on-surface hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Badges */}
        <div className="space-y-8">
          <h5 className="text-[12px] font-black text-on-surface-variant opacity-60 font-label">টেকনোলজি ও ডেটা</h5>
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/10 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">rocket_launch</span>
              <span className="text-xs font-bold text-on-surface opacity-80">NASA Space Apps Challanges 2026</span>
            </div>
            <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/10 flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary">satellite_alt</span>
              <span className="text-xs font-bold text-on-surface opacity-80">MODIS & Landsat Data</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-24 py-8 border-t border-outline-variant/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-xs font-bold text-on-surface-variant opacity-40 uppercase tracking-widest font-label">© 2026 GreenPulse BD — Sustainable Urban Future</p>
        <div className="flex items-center gap-4 text-[10px] font-black text-primary uppercase tracking-[0.2em] font-label">
          <span>Developed by Mashrafi & Team NPCs</span>
        </div>
      </div>
    </footer>
  );
}
