'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SafeImage } from '@/components/ui/SafeImage';
import { SIGNATURE_EXPERIENCES } from '@/data/experiences';
import { useApp } from '@/context/AppContext';
import { formatIdr } from '@/lib/format-currency';
import { Sparkles, Check, ArrowRight, Clock } from 'lucide-react';

export default function ExperiencesPage() {
  const router = useRouter();
  const { draftBooking, updateDraftBooking, showToast } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Culinary', 'Wellness', 'Culture', 'Leisure'];
  const filtered =
    activeCategory === 'All'
      ? SIGNATURE_EXPERIENCES
      : SIGNATURE_EXPERIENCES.filter((e) => e.category === activeCategory);

  const handlePreselectExperience = (expId: string) => {
    const exp = SIGNATURE_EXPERIENCES.find((e) => e.id === expId);
    if (!exp) return;

    const existing = draftBooking.selectedExtras.find((item) => item.experienceId === exp.id);
    if (!existing) {
      updateDraftBooking({
        selectedExtras: [
          ...draftBooking.selectedExtras,
          {
            experienceId: exp.id,
            title: exp.title,
            priceIdr: exp.priceIdr,
            quantity: 1,
          },
        ],
      });
    }
    showToast(
      `${exp.title} Selected`,
      'Added to your booking preferences. Choose your villa and dates to complete your stay.',
      'success'
    );
    router.push('/booking');
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-28 pb-24">
        {/* Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 border-b border-stone">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-bronze">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Optional Curated Enhancements • Fictional Demo Services</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl text-charcoal leading-tight">
              Unhurried Island Rituals, Brought to Your Pavilion.
            </h1>
            <p className="text-base text-charcoal/80 leading-relaxed">
              From sunrise floating breakfasts in Ubud to candlelit cliffside feasts in Uluwatu, our private hosts and culinary artisans craft bespoke experiences within the serenity of your residence.
            </p>
          </div>

          {/* Category Filter */}
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`text-xs uppercase tracking-[0.18em] px-5 py-2.5 border transition-colors ${
                  activeCategory === cat
                    ? 'bg-deepGreen text-ivory border-deepGreen'
                    : 'bg-white/70 text-charcoal border-stone hover:border-bronze'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Experiences List */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
          {filtered.map((exp, idx) => {
            const isAdded = draftBooking.selectedExtras.some((e) => e.experienceId === exp.id);
            return (
              <article
                key={exp.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white/80 border border-stone p-6 sm:p-8 items-center"
              >
                <div
                  className={`lg:col-span-5 relative h-72 sm:h-80 overflow-hidden border border-stone ${
                    idx % 2 === 1 ? 'lg:order-2' : ''
                  }`}
                >
                  <SafeImage
                    src={exp.image}
                    fallbackSrc={exp.fallbackImage}
                    alt={exp.title}
                  />
                  <span className="absolute top-3 left-3 bg-ivory/95 text-charcoal px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
                    {exp.category}
                  </span>
                </div>

                <div
                  className={`lg:col-span-7 space-y-5 ${
                    idx % 2 === 1 ? 'lg:order-1' : ''
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-bronze uppercase tracking-widest">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {exp.duration}
                    </span>
                    <span className="bg-sand/50 text-charcoal px-2.5 py-0.5 text-[11px]">
                      Optional Demo Offering
                    </span>
                  </div>

                  <h2 className="font-serif text-3xl text-charcoal">{exp.title}</h2>
                  <p className="text-sm text-charcoal/80 leading-relaxed">
                    {exp.fullDescription}
                  </p>

                  <ul className="space-y-2 pt-1">
                    {exp.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5 text-xs text-charcoal/85">
                        <Check className="w-4 h-4 text-deepGreen shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4 border-t border-stone flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="font-serif text-2xl text-charcoal font-medium">
                        {formatIdr(exp.priceIdr)}
                      </span>
                      <span className="text-xs text-charcoal/65"> / {exp.priceUnit}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePreselectExperience(exp.id)}
                      className="bg-deepGreen hover:bg-forestGreen text-ivory text-xs uppercase tracking-[0.18em] px-6 py-3.5 font-medium inline-flex items-center gap-2 transition-colors"
                    >
                      <span>{isAdded ? 'Added • Proceed to Booking' : 'Include in My Stay'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </main>
      <Footer />
    </>
  );
}
