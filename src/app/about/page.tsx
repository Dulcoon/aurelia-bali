'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SafeImage } from '@/components/ui/SafeImage';
import { useApp } from '@/context/AppContext';
import { ArrowRight, Compass, Layers, Feather, Sparkles } from 'lucide-react';

export default function AboutPage() {
  const { settings } = useApp();

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-28 pb-24">
        {/* Editorial Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <p className="text-xs uppercase tracking-[0.24em] text-bronze font-medium">
                Our Story & Architectural Philosophy
              </p>
              <h1 className="font-serif text-4xl sm:text-6xl text-charcoal leading-[1.1]">
                A Slower Rhythm. A Deeper Kind of Luxury.
              </h1>
              <p className="text-base text-charcoal/80 leading-relaxed">
                {settings.brandName} was envisioned as an antidote to standardized resort hospitality. Each of our four fictional sanctuaries in Ubud, Uluwatu, Canggu, and Gianyar is designed to feel like the private residence of a discerning collector and architect.
              </p>
              <p className="text-sm text-charcoal/75 leading-relaxed">
                Rooted in the Balinese philosophy of <em>Tri Hita Karana</em>—harmony among people, nature, and the spiritual realm—our spaces celebrate open-air pavilions, hand-carved volcanic stone, reclaimed Javanese teak, and tranquil water gardens.
              </p>
            </div>
            <div className="lg:col-span-6 relative h-[420px] sm:h-[500px] border border-stone overflow-hidden">
              <SafeImage
                src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1400&q=85"
                fallbackSrc="/images/fallback-villa-gianyar.jpg"
                alt="Balinese architectural pavilion and reflection pond"
              />
            </div>
          </div>
        </section>

        {/* Three Pillars */}
        <section className="py-20 bg-sand/40 border-y border-stone">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-3 bg-ivory p-8 border border-stone">
              <Layers className="w-6 h-6 text-deepGreen" />
              <h2 className="font-serif text-2xl text-charcoal">Honest Tropical Materiality</h2>
              <p className="text-sm text-charcoal/75 leading-relaxed">
                We build with Sukabumi green stone, hand-split paras limestone, aged ironwood, and breathable lime plaster that patinas naturally with Bali’s seasons.
              </p>
            </div>
            <div className="space-y-3 bg-ivory p-8 border border-stone">
              <Feather className="w-6 h-6 text-deepGreen" />
              <h2 className="font-serif text-2xl text-charcoal">Intimate Host Hospitality</h2>
              <p className="text-sm text-charcoal/75 leading-relaxed">
                Rather than formal reception desks, every villa is cared for by a dedicated host and culinary team who anticipate your pace—whether preparing morning pour-over coffee or arranging a sacred temple walk.
              </p>
            </div>
            <div className="space-y-3 bg-ivory p-8 border border-stone">
              <Compass className="w-6 h-6 text-deepGreen" />
              <h2 className="font-serif text-2xl text-charcoal">Interactive Studio Showcase</h2>
              <p className="text-sm text-charcoal/75 leading-relaxed">
                This application demonstrates a complete Next.js hospitality platform—combining editorial storytelling, real-time date and pricing logic, and an interactive back-office admin dashboard.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 text-center space-y-6">
          <Sparkles className="w-6 h-6 text-bronze mx-auto" />
          <h2 className="font-serif text-3xl sm:text-5xl text-charcoal">
            Experience the Portfolio Firsthand
          </h2>
          <p className="text-sm text-charcoal/75 max-w-xl mx-auto">
            Browse our four villas, test the simulated reservation flow, or inspect the administrative suite to see how changes propagate in real time.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/villas"
              className="bg-deepGreen text-ivory text-xs uppercase tracking-[0.2em] px-7 py-4 hover:bg-forestGreen transition-colors inline-flex items-center gap-2"
            >
              Explore Our Villas
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/admin"
              className="border border-charcoal/30 text-charcoal text-xs uppercase tracking-[0.2em] px-7 py-4 hover:border-deepGreen transition-colors"
            >
              Launch Admin Dashboard Demo
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
