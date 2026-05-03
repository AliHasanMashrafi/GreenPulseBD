import { Inter, Hind_Siliguri } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "@/Providers";
import LocationAutoDetect from "@/components/LocationAutoDetect";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inter",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata = {
  title: "GreenPulse BD | Urban Climate & Heat Intelligence Platform",
  description: "Dhaka's first data-driven urban climate platform using NASA satellite intelligence. Analyze urban heat islands, greenery potential, and get AI-powered greening plans.",
  keywords: ["Dhaka", "Climate Change", "Urban Heat Island", "NASA Earthdata", "Urban Greening", "Gemini AI", "Sustainability"],
  authors: [{ name: "ULAB Earth Hackathon Team" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={`${inter.variable} ${hindSiliguri.variable} dark`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased flex flex-col min-h-screen bg-background text-on-background selection:bg-primary selection:text-on-primary">
        <Providers>
          <LocationAutoDetect />
          <Navbar />
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
