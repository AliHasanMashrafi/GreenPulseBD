
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "হোম" },
    { href: "/heatmap", label: "হিটম্যাপ" },
    { href: "/green-space", label: "সবুজায়নের সম্ভাবনা" },
    { href: "/green-planner", label: "এআই প্ল্যানার" },
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[5000] flex justify-between items-center px-6 md:px-12 h-[72px] transition-all duration-500 ${scrolled || mobileMenuOpen ? "bg-background/95 backdrop-blur-2xl border-b border-outline-variant/10 shadow-2xl" : "bg-transparent"}`}>
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-lg group-hover:rotate-12 transition-transform">
            <span className="material-symbols-outlined text-2xl font-bold">energy_savings_leaf</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black text-on-surface tracking-tighter leading-none">GreenPulse</span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] leading-none mt-1">Bangladesh</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-10 items-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-black font-bengali tracking-wide transition-all relative py-2 ${
                  isActive
                    ? "text-primary"
                    : "text-on-surface/60 hover:text-on-surface"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full animate-in fade-in zoom-in duration-300"></span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/green-planner" className="hidden sm:block">
            <button className="px-6 py-2.5 bg-on-surface text-surface rounded-full text-sm font-black font-bengali hover:bg-primary hover:text-on-primary transition-all shadow-xl active:scale-95 cursor-pointer">
              এআই প্ল্যানার
            </button>
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface border border-outline-variant/10"
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div className={`fixed inset-0 z-[4999] bg-background/95 backdrop-blur-xl md:hidden transition-all duration-500 ease-in-out ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="pt-24 px-6 flex flex-col gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-2xl font-black font-bengali py-4 border-b border-outline-variant/10 flex items-center justify-between ${
                  isActive ? "text-primary" : "text-on-surface/70"
                }`}
              >
                {link.label}
                {isActive && <span className="w-2 h-2 rounded-full bg-primary"></span>}
              </Link>
            );
          })}
          <Link 
            href="/green-planner" 
            onClick={() => setMobileMenuOpen(false)}
            className="mt-4 w-full py-5 bg-primary text-on-primary rounded-3xl font-black font-bengali text-center text-lg shadow-xl"
          >
            এআই প্ল্যান শুরু করুন
          </Link>
        </div>
      </div>
    </>
  );
}
