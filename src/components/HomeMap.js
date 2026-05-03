"use client";
import dynamic from "next/dynamic";

const DhakaHeatMap = dynamic(() => import("@/components/DhakaHeatMap"), { ssr: false });

export default function HomeMap() {
  return <DhakaHeatMap />;
}
