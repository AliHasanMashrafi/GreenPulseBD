"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import dhakaData from "@/data/dhaka_heat_data.json";

export default function RoofPlanning() {
  const thanas = useMemo(() => Object.values(dhakaData.thanas), []);
  const [selectedThana, setSelectedThana] = useState(thanas[0]);

  return (
    <main className="pt-[100px] pb-24 bg-background">
      <div className="max-w-5xl mx-auto px-6">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold font-bengali mb-6">
            আপনার জায়গার জন্য <span className="text-primary">সবুজায়ন পরিকল্পনা</span>
          </h1>
          <p className="text-xl text-on-surface-variant font-bengali max-w-2xl mx-auto">
            আপনার বাড়ির ছাদ এবং খোলা জায়গাকে একটি শীতল এবং পরিবেশবান্ধব উদ্যানে পরিণত করার স্মার্ট সমাধান।
          </p>
        </section>

        {/* Selection Area */}
        <section className="bg-surface-container-low p-8 rounded-3xl mb-12 border border-outline-variant/10">
          <label className="block font-bengali text-xl font-bold mb-4">আপনার এলাকা নির্বাচন করুন</label>
          <select
            className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl py-4 px-6 text-on-surface font-bengali"
            value={selectedThana.name_en}
            onChange={(e) => {
              const thana = thanas.find(t => t.name_en === e.target.value);
              if (thana) setSelectedThana(thana);
            }}
          >
            {thanas.map(thana => (
              <option key={thana.name_en} value={thana.name_en}>
                {thana.name_bn} ({thana.name_en})
              </option>
            ))}
          </select>
        </section>

        {/* Impact Overview */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-primary/10 p-8 rounded-3xl border border-primary/20">
            <h3 className="text-2xl font-bold font-bengali mb-4 text-primary">সম্ভাব্য প্রভাব</h3>
            <div className="text-6xl font-bold text-primary mb-2">{selectedThana.rooftop_impact.temp_reduction_celsius}°C</div>
            <p className="font-bengali text-on-surface-variant">সঠিক পরিকল্পনায় আপনার চারপাশ শীতল থাকবে।</p>
          </div>
          <div className="bg-secondary/10 p-8 rounded-3xl border border-secondary/20">
            <h3 className="text-2xl font-bold font-bengali mb-4 text-secondary">কার্বন অফসেট</h3>
            <div className="text-6xl font-bold text-secondary mb-2">{selectedThana.rooftop_impact.carbon_offset_kg_year}kg</div>
            <p className="font-bengali text-on-surface-variant">প্রতি বছর বায়ুমণ্ডল থেকে শোষিত কার্বন।</p>
          </div>
        </section>

        {/* Suggestions */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold font-bengali mb-8">প্রস্তাবিত সমাধান</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "সবুজ ছাউনি (ছাদ)", desc: "ছাদে প্রাকৃতিকভাবে তাপমাত্রা কমাতে এবং অক্সিজেন বাড়াতে সহায়ক।" },
              { title: "ব্যালকনি বাগান", desc: "অল্প জায়গায় ভার্টিক্যাল ফার্মিং বা টবে গাছ লাগিয়ে ঘরের পরিবেশ উন্নত করুন।" },
              { title: "খোলা জায়গায় বনায়ন", desc: "বাড়ির সামনের বা পেছনের খালি জায়গায় দেশি ফলের গাছ রোপণ করুন।" },
              { title: "সবজি চাষ", desc: "পরিবারের জন্য বিষমুক্ত তাজা সবজি এবং পরিবেশের সুরক্ষা।" },
              { title: "রাস্তার ধারের সবুজ", desc: "আপনার সীমানার বাইরের রাস্তার ধারের অংশে ঘাস বা ছোট গুল্ম রোপণ করুন।" },
              { title: "স্মার্ট কুলিং", desc: "রিফ্লেক্টিভ পেইন্ট এবং সঠিক ড্রেনেজ সিস্টেমের মাধ্যমে শীতল পরিবেশ তৈরি।" }
            ].map((item, i) => (
              <div key={i} className="bg-surface-container-high p-8 rounded-3xl border border-outline-variant/10">
                <h4 className="text-xl font-bold font-bengali mb-4">{item.title}</h4>
                <p className="text-on-surface-variant font-bengali text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
