"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mb-8 animate-bounce">
        <span className="material-symbols-outlined text-6xl text-error">warning</span>
      </div>
      
      <h2 className="text-4xl font-bold font-bengali text-on-surface mb-4">
        দুঃখিত, কোনো একটি সমস্যা হয়েছে!
      </h2>
      
      <p className="text-on-surface-variant font-bengali text-lg max-w-md mb-10 leading-relaxed">
        আমাদের সিস্টেমে সাময়িক সমস্যা দেখা দিয়েছে। দয়া করে পেজটি রিফ্রেশ করুন অথবা কিছুক্ষণ পর আবার চেষ্টা করুন।
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="px-8 py-4 bg-primary text-on-primary rounded-2xl font-bold font-bengali hover:shadow-lg transition-all active:scale-95"
        >
          আবার চেষ্টা করুন
        </button>
        
        <Link
          href="/"
          className="px-8 py-4 bg-surface-container-high text-on-surface rounded-2xl font-bold font-bengali hover:bg-surface-container-highest transition-all"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>

      <div className="mt-12 p-4 bg-surface-container-low rounded-xl border border-outline-variant/10 max-w-lg">
        <p className="text-[10px] font-mono text-on-surface-variant break-all">
          Error Log: {error?.message || "Unknown Error"}
        </p>
      </div>
    </div>
  );
}
