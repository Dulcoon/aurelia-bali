'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SafeImage } from '@/components/ui/SafeImage';
import { useApp } from '@/context/AppContext';
import { SIGNATURE_EXPERIENCES, DEMO_TESTIMONIALS } from '@/data/experiences';
import { formatIdr } from '@/lib/format-currency';
import { getFutureIso, getTodayIso } from '@/lib/date-utils';
import {
  ArrowRight,
  BedDouble,
  Users,
  MapPin,
  Sparkles,
  Compass,
  Shield,
  Sun,
  Trees,
  Quote,
  Calendar,
  Check,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { villas, settings, updateDraftBooking, showToast } = useApp();

  const publishedVillas = villas.filter((v) => v.published);
  const [checkIn, setCheckIn] = useState<string>(getFutureIso(7));
  const [checkOut, setCheckOut] = useState<string>(getFutureIso(10));
  const [guests, setGuests] = useState<number>(2);
  const [selectedMapVillaId, setSelectedMapVillaId] = useState<string>(
    publishedVillas[0]?.id || 'villa-ubud-sanctuary'
  );

  const activeMapVilla =
    publishedVillas.find((v) => v.id === selectedMapVillaId) || publishedVillas[0];

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut || checkOut <= checkIn) {
      showToast(
        'Invalid Stay Dates',
        'Please select a check-out date after your check-in date.',
        'warning'
      );
      return;
    }
    updateDraftBooking({ checkIn, checkOut, guests });
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests: String(guests),
    });
    router.push(`/villas?${params.toString()}`);
  };

  return (
    <>
      <Navbar transparentOnTop />

      <main className="flex-1">
        {/* B. CINEMATIC HERO */}
        <section className="relative min-h-[92vh] flex flex-col justify-end pt-32 pb-14 lg:pb-20 overflow-hidden bg-charcoal text-ivory">
          <div className="absolute inset-0 z-0">
            <SafeImage
              src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2000&q=85"
              fallbackSrc="/images/fallback-hero.jpg"
              alt="AURELIA BALI luxury infinity pool and tropical pavilion in Bali"
              priority
              sizes="100vw"
              className="scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/45 to-charcoal/35" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2.5 border border-sand/30 bg-charcoal/40 backdrop-blur-sm px-4 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-bronze" />
                <span className="text-[11px] uppercase tracking-[0.25em] text-sand">
                  {settings.tagline}
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-[1.08] font-normal tracking-tight text-ivory">
                Your Private Escape, Beyond the Ordinary.
              </h1>

              <p className="text-base sm:text-lg text-sand/90 leading-relaxed max-w-2xl font-light">
                Discover thoughtfully designed island sanctuaries where Balinese craftsmanship, tropical nature, and contemporary comfort come together.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/villas"
                  className="bg-deepGreen text-ivory hover:bg-forestGreen transition-colors text-xs uppercase tracking-[0.2em] px-7 py-4 font-medium inline-flex items-center gap-2.5"
                >
                  Explore Our Villas
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/experiences"
                  className="bg-ivory/10 hover:bg-ivory/20 border border-ivory/35 text-ivory transition-colors text-xs uppercase tracking-[0.2em] px-7 py-4 font-medium"
                >
                  Discover the Experience
                </Link>
              </div>
            </div>

            {/* Compact Booking Search Panel */}
            <form
              onSubmit={handleHeroSearch}
              aria-label="Search villa availability"
              className="bg-ivory text-charcoal p-5 sm:p-6 lg:p-7 border border-stone shadow-editorial grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end"
            >
              <div className="lg:col-span-4">
                <label
                  htmlFor="hero-checkin"
                  className="block text-[11px] uppercase tracking-[0.18em] text-charcoal/70 mb-2 font-medium"
                >
                  Check-In Date
                </label>
                <div className="relative">
                  <input
                    id="hero-checkin"
                    type="date"
                    min={getTodayIso()}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-white border border-stone px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:border-deepGreen"
                    required
                  />
                </div>
              </div>

              <div className="lg:col-span-4">
                <label
                  htmlFor="hero-checkout"
                  className="block text-[11px] uppercase tracking-[0.18em] text-charcoal/70 mb-2 font-medium"
                >
                  Check-Out Date
                </label>
                <div className="relative">
                  <input
                    id="hero-checkout"
                    type="date"
                    min={checkIn || getTodayIso()}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-white border border-stone px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:border-deepGreen"
                    required
                  />
                </div>
              </div>

              <div className="lg:col-span-2">
                <label
                  htmlFor="hero-guests"
                  className="block text-[11px] uppercase tracking-[0.18em] text-charcoal/70 mb-2 font-medium"
                >
                  Guests
                </label>
                <select
                  id="hero-guests"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full bg-white border border-stone px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:border-deepGreen"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-deepGreen hover:bg-forestGreen text-ivory text-xs uppercase tracking-[0.18em] py-3 px-4 font-medium transition-colors flex items-center justify-center gap-2 h-[42px]"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Search</span>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* C. BRAND INTRODUCTION (Asymmetric Editorial Split) */}
        <section className="py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Editorial Copy */}
            <div className="lg:col-span-5 space-y-6">
              <p className="text-xs uppercase tracking-[0.24em] text-bronze font-medium">
                01 • The Aurelia Ethos
              </p>
              <h2 className="font-serif text-3xl sm:text-5xl text-charcoal leading-[1.15]">
                Rooted in Bali. Designed for the Way You Want to Feel.
              </h2>
              <p className="text-charcoal/80 text-base leading-relaxed">
                True luxury on the island is not found in grand lobbies or crowded poolsides, but in the quiet interplay of morning light across hand-carved paras stone, the scent of frangipani after tropical rain, and spaces that belong entirely to you.
              </p>
              <p className="text-charcoal/75 text-sm leading-relaxed">
                Each Aurelia residence is conceived in collaboration with Balinese master artisans and contemporary tropical architects—honoring natural topography, reclaimed Javanese teak, and unhurried indoor-outdoor living.
              </p>

              <div className="pt-4 grid grid-cols-2 gap-6 border-t border-stone">
                <div>
                  <p className="font-serif text-3xl text-deepGreen">4</p>
                  <p className="text-xs uppercase tracking-widest text-charcoal/70 mt-1">
                    Private Island Estates
                  </p>
                </div>
                <div>
                  <p className="font-serif text-3xl text-deepGreen">100%</p>
                  <p className="text-xs uppercase tracking-widest text-charcoal/70 mt-1">
                    Dedicated Villa Hosts
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-deepGreen font-medium border-b border-deepGreen pb-1 hover:text-bronze hover:border-bronze transition-colors"
                >
                  Read Our Architectural Story
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Column: Asymmetric Dual Photography */}
            <div className="lg:col-span-7 grid grid-cols-12 gap-4 sm:gap-6 items-end">
              <div className="col-span-7 relative h-[380px] sm:h-[480px] border border-stone/60 overflow-hidden">
                <SafeImage
                  src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=85"
                  fallbackSrc="/images/fallback-villa-ubud.jpg"
                  alt="Reclaimed teak pavilion and tropical courtyard in Bali"
                  className="hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="col-span-5 space-y-4">
                <div className="relative h-[240px] sm:h-[310px] border border-stone/60 overflow-hidden">
                  <SafeImage
                    src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=900&q=85"
                    fallbackSrc="/images/fallback-villa-canggu.jpg"
                    alt="Architectural stone and water garden detail"
                    className="hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="bg-sand/55 p-4 sm:p-5 border border-stone/80">
                  <p className="font-serif italic text-lg text-charcoal leading-snug">
                    “A Slower Rhythm. A Deeper Kind of Luxury.”
                  </p>
                  <p className="text-[11px] uppercase tracking-widest text-charcoal/65 mt-2">
                    Ubud • Uluwatu • Canggu • Gianyar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* D. FEATURED VILLAS (Varied Proportions & Editorial Staggered Layout) */}
        <section className="py-24 bg-sand/35 border-y border-stone/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <p className="text-xs uppercase tracking-[0.24em] text-bronze font-medium">
                  02 • Private Residences
                </p>
                <h2 className="font-serif text-3xl sm:text-5xl text-charcoal">
                  Find Your Own Piece of Bali.
                </h2>
                <p className="text-sm sm:text-base text-charcoal/75">
                  From river-gorge sanctuaries in Ubud to limestone cliff horizons in Uluwatu, each villa is a one-of-a-kind architectural statement.
                </p>
              </div>
              <Link
                href="/villas"
                className="self-start md:self-auto inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] bg-charcoal text-ivory px-6 py-3.5 hover:bg-deepGreen transition-colors"
              >
                Compare All Villas
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Asymmetric Editorial Grid */}
            <div className="space-y-20">
              {publishedVillas.slice(0, 4).map((villa, idx) => {
                const isEven = idx % 2 === 0;
                const primaryImage = villa.images[0];
                const secondaryImage = villa.images[1] || villa.images[0];

                return (
                  <article
                    key={villa.id}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
                  >
                    {/* Image Column with Varied Proportions */}
                    <div
                      className={`lg:col-span-7 ${
                        isEven ? 'lg:order-1' : 'lg:order-2'
                      }`}
                    >
                      <div className="grid grid-cols-12 gap-4 items-stretch">
                        <Link
                          href={`/villas/${villa.slug}`}
                          className={`${
                            isEven ? 'col-span-12 sm:col-span-8' : 'col-span-12 sm:col-span-7'
                          } relative ${
                            isEven ? 'h-[340px] sm:h-[440px]' : 'h-[360px] sm:h-[480px]'
                          } overflow-hidden border border-stone group block`}
                        >
                          <SafeImage
                            src={primaryImage?.url}
                            fallbackSrc={primaryImage?.fallbackUrl}
                            alt={primaryImage?.alt || villa.name}
                            className="group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute top-4 left-4 bg-ivory/95 text-charcoal px-3 py-1 text-[11px] uppercase tracking-[0.18em] font-medium">
                            {villa.location}, Bali
                          </div>
                        </Link>

                        <div
                          className={`hidden sm:flex flex-col justify-between ${
                            isEven ? 'sm:col-span-4' : 'sm:col-span-5'
                          } gap-4`}
                        >
                          <Link
                            href={`/villas/${villa.slug}`}
                            className="relative flex-1 overflow-hidden border border-stone group block"
                          >
                            <SafeImage
                              src={secondaryImage?.url}
                              fallbackSrc={secondaryImage?.fallbackUrl}
                              alt={secondaryImage?.alt || villa.name}
                              className="group-hover:scale-105 transition-transform duration-700"
                            />
                          </Link>
                          <div className="bg-ivory p-4 border border-stone">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-bronze">
                              Pool & Grounds
                            </p>
                            <p className="text-xs text-charcoal mt-1 font-medium">
                              {villa.poolDimensions}
                            </p>
                            <p className="text-[11px] text-charcoal/65 mt-0.5">
                              {villa.areaSqm} m² Total Private Estate
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Details Column */}
                    <div
                      className={`lg:col-span-5 space-y-5 ${
                        isEven ? 'lg:order-2' : 'lg:order-1'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-bronze">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{villa.specificArea}</span>
                      </div>

                      <h3 className="font-serif text-3xl sm:text-4xl text-charcoal">
                        <Link
                          href={`/villas/${villa.slug}`}
                          className="hover:text-deepGreen transition-colors"
                        >
                          {villa.name}
                        </Link>
                      </h3>

                      <p className="text-sm text-charcoal/80 leading-relaxed">
                        {villa.concept} {villa.tagline}
                      </p>

                      {/* Specs Bar */}
                      <div className="flex flex-wrap items-center gap-5 py-3.5 border-y border-stone text-xs text-charcoal/85">
                        <span className="inline-flex items-center gap-1.5">
                          <BedDouble className="w-4 h-4 text-deepGreen" />
                          {villa.bedrooms} Bedrooms
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-deepGreen" />
                          Up to {villa.maxGuests} Guests
                        </span>
                        <span className="text-charcoal/65">{villa.areaSqm} m²</span>
                      </div>

                      {/* Key Amenities Pills */}
                      <div className="flex flex-wrap gap-2">
                        {villa.amenities.slice(0, 5).map((amenity) => (
                          <span
                            key={amenity}
                            className="text-[11px] bg-ivory border border-stone px-2.5 py-1 text-charcoal/80"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>

                      {/* Price & CTA */}
                      <div className="pt-3 flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <span className="block text-[10px] uppercase tracking-[0.18em] text-charcoal/60">
                            Starting From
                          </span>
                          <span className="font-serif text-2xl text-charcoal font-medium">
                            {formatIdr(villa.basePricePerNight)}
                          </span>
                          <span className="text-xs text-charcoal/65"> / night</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <Link
                            href={`/villas/${villa.slug}`}
                            className="bg-deepGreen text-ivory hover:bg-forestGreen text-xs uppercase tracking-[0.16em] px-5 py-3 transition-colors"
                          >
                            Explore Villa
                          </Link>
                          <Link
                            href={`/booking?villaId=${villa.id}`}
                            className="border border-charcoal/30 hover:border-deepGreen text-charcoal text-xs uppercase tracking-[0.16em] px-4 py-3 transition-colors"
                          >
                            Reserve
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* E. SIGNATURE EXPERIENCES */}
        <section className="py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-bronze font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>03 • Curated Island Rituals (Optional Demo Offerings)</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl text-charcoal">
                Where Island Living Becomes an Art.
              </h2>
              <p className="text-sm sm:text-base text-charcoal/75">
                Every stay can be tailored with optional in-villa culinary, wellness, and cultural experiences arranged privately by your villa host.
              </p>
            </div>
            <Link
              href="/experiences"
              className="self-start md:self-auto text-xs uppercase tracking-[0.18em] text-deepGreen border-b border-deepGreen pb-1 hover:text-bronze hover:border-bronze"
            >
              View All 6 Experiences →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SIGNATURE_EXPERIENCES.map((exp) => (
              <div
                key={exp.id}
                className="bg-white/75 border border-stone flex flex-col justify-between group hover:border-bronze transition-colors"
              >
                <div>
                  <div className="relative h-60 overflow-hidden border-b border-stone">
                    <SafeImage
                      src={exp.image}
                      fallbackSrc={exp.fallbackImage}
                      alt={exp.title}
                      className="group-hover:scale-105 transition-transform duration-700"
                    />
                    <span className="absolute top-3 left-3 bg-ivory/95 text-charcoal px-2.5 py-1 text-[10px] uppercase tracking-[0.2em]">
                      {exp.category}
                    </span>
                    <span className="absolute bottom-3 right-3 bg-charcoal/85 text-sand px-2.5 py-1 text-[10px] uppercase tracking-wider">
                      Optional Add-On
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-serif text-2xl text-charcoal">{exp.title}</h3>
                    <p className="text-xs text-charcoal/75 leading-relaxed">
                      {exp.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-stone/50 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-medium text-charcoal">{formatIdr(exp.priceIdr)}</span>
                    <span className="text-charcoal/60"> / {exp.priceUnit}</span>
                  </div>
                  <Link
                    href="/booking"
                    className="uppercase tracking-[0.16em] text-deepGreen hover:text-bronze font-medium"
                  >
                    Add to Stay →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* F. ARCHITECTURE & DESIGN PHILOSOPHY */}
        <section className="py-24 bg-deepGreen text-ivory">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
              <div className="lg:col-span-7 space-y-4">
                <p className="text-xs uppercase tracking-[0.24em] text-bronze">
                  04 • Architectural Craftsmanship
                </p>
                <h2 className="font-serif text-3xl sm:text-5xl leading-tight">
                  Tactile Stone, Aged Teak, and Open-Air Serenity.
                </h2>
              </div>
              <div className="lg:col-span-5">
                <p className="text-sm text-sand/85 leading-relaxed">
                  Our sanctuaries reject ostentatious excess in favor of honest materials that weather gracefully in the tropics—allowing trade winds, birdsong, and dappled sunlight to animate every room.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                {
                  icon: <Trees className="w-5 h-5 text-bronze" />,
                  title: 'Natural Materials',
                  body: 'Volcanic paras stone, reclaimed Javanese teak, hand-troweled lime plaster, and unbleached organic linens.',
                },
                {
                  icon: <Sun className="w-5 h-5 text-bronze" />,
                  title: 'Indoor-Outdoor Living',
                  body: 'Retractable timber louvers and sunken garden bales dissolve the threshold between suite and landscape.',
                },
                {
                  icon: <Shield className="w-5 h-5 text-bronze" />,
                  title: 'Thoughtful Privacy',
                  body: 'Walled botanical courtyards and acoustic water features ensure total seclusion for couples and families.',
                },
                {
                  icon: <Sparkles className="w-5 h-5 text-bronze" />,
                  title: 'Local Craftsmanship',
                  body: 'Created alongside Gianyar stone carvers, Tegalalang woodworkers, and traditional textile weavers.',
                },
                {
                  icon: <Compass className="w-5 h-5 text-bronze" />,
                  title: 'Tropical Integration',
                  body: 'Foundations step gently around mature banyan, frangipani, and sacred river contours.',
                },
              ].map((pillar) => (
                <div
                  key={pillar.title}
                  className="bg-forestGreen/50 border border-ivory/15 p-6 space-y-3"
                >
                  {pillar.icon}
                  <h3 className="font-serif text-xl text-ivory">{pillar.title}</h3>
                  <p className="text-xs text-sand/80 leading-relaxed">{pillar.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* G. GUEST TESTIMONIALS (Labeled as Fictional Demo Content) */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-bronze font-medium">
              05 • Guest Reflections (Fictional Demonstration Samples)
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl text-charcoal">
              Quiet Memories From the Island.
            </h2>
            <p className="text-xs text-charcoal/65">
              Sample editorial reflections illustrating how guest testimonials appear within the Aurelia Bali portfolio prototype.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DEMO_TESTIMONIALS.map((item) => (
              <blockquote
                key={item.id}
                className="bg-white/80 border border-stone p-8 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <Quote className="w-6 h-6 text-bronze/70" />
                  <p className="font-serif italic text-lg text-charcoal leading-relaxed">
                    “{item.quote}”
                  </p>
                </div>
                <footer className="pt-4 border-t border-stone/60 text-xs space-y-1">
                  <p className="font-medium text-charcoal">{item.guestName}</p>
                  <p className="text-charcoal/65">{item.origin}</p>
                  <p className="text-bronze uppercase tracking-wider text-[10px]">
                    Stayed at {item.villaStayed} • {item.stayMonth}
                  </p>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        {/* H. ILLUSTRATIVE BALI LOCATION MAP SECTION */}
        <section className="py-24 bg-sand/40 border-t border-stone">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 space-y-6">
                <p className="text-xs uppercase tracking-[0.24em] text-bronze font-medium">
                  06 • Island Geography (Illustrative Demo Map)
                </p>
                <h2 className="font-serif text-3xl sm:text-5xl text-charcoal leading-tight">
                  Four Distinct Landscapes Across Bali.
                </h2>
                <p className="text-sm text-charcoal/80 leading-relaxed">
                  Select a sanctuary marker on our illustrative island map to explore its surrounding landscape, approximate demonstration travel times, and architectural character.
                </p>

                {/* Location Selector Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  {publishedVillas.map((v) => {
                    const active = activeMapVilla?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedMapVillaId(v.id)}
                        className={`text-left p-3.5 border transition-all ${
                          active
                            ? 'bg-deepGreen text-ivory border-deepGreen'
                            : 'bg-ivory text-charcoal border-stone hover:border-bronze'
                        }`}
                      >
                        <p className="text-[10px] uppercase tracking-[0.2em] opacity-75">
                          {v.location}
                        </p>
                        <p className="font-serif text-lg mt-0.5 truncate">{v.name}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Sanctuary Card */}
                {activeMapVilla && (
                  <div className="bg-ivory border border-stone p-6 space-y-3 shadow-subtle">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.2em] text-bronze font-medium">
                        {activeMapVilla.specificArea}
                      </span>
                      <span className="text-xs font-medium text-deepGreen">
                        {formatIdr(activeMapVilla.basePricePerNight)} / night
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl text-charcoal">{activeMapVilla.name}</h3>
                    <p className="text-xs text-charcoal/75">{activeMapVilla.distanceNote}</p>
                    <div className="pt-2 flex items-center gap-4">
                      <Link
                        href={`/villas/${activeMapVilla.slug}`}
                        className="text-xs uppercase tracking-[0.16em] text-deepGreen font-medium hover:text-bronze"
                      >
                        View Residence Details →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Illustrative Bali SVG Map */}
              <div className="lg:col-span-7 bg-ivory border border-stone p-6 sm:p-10 relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-charcoal/60">
                    Bali Island Sanctuary Coordinates • Illustrative Overview
                  </span>
                  <span className="text-[11px] text-bronze">8°24′S 115°11′E</span>
                </div>

                <div className="relative aspect-[16/11] w-full bg-[#ECE7DC] border border-stone/70 overflow-hidden flex items-center justify-center">
                  {/* Stylized Bali Island SVG Contour */}
                  <svg
                    viewBox="0 0 800 550"
                    className="w-full h-full"
                    role="img"
                    aria-label="Illustrative map of Bali showing Ubud, Gianyar, Canggu, and Uluwatu villa locations"
                  >
                    {/* Subtle Compass Lines */}
                    <line x1="0" y1="275" x2="800" y2="275" stroke="#D4CEC2" strokeDasharray="4 6" />
                    <line x1="400" y1="0" x2="400" y2="550" stroke="#D4CEC2" strokeDasharray="4 6" />

                    {/* Bali Main Island Stylized Polygon */}
                    <path
                      d="M 70,210 Q 170,155 290,175 Q 410,140 535,155 Q 665,175 730,245 Q 690,325 585,345 Q 500,365 440,395 Q 395,425 365,445 Q 345,485 375,510 Q 335,525 305,495 Q 315,455 335,430 Q 285,380 215,340 Q 130,295 70,210 Z"
                      fill="#E0D6C3"
                      stroke="#A88C62"
                      strokeWidth="2"
                    />
                    {/* Topographic Inner Contour */}
                    <path
                      d="M 180,220 Q 310,195 450,195 Q 570,205 635,250 Q 560,310 445,335 Q 345,345 250,295 Z"
                      fill="#D5C9B4"
                      stroke="#A88C62"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />

                    {/* Labels for Ocean & Highlands */}
                    <text x="90" y="450" fill="#7D7568" fontSize="11" letterSpacing="4">
                      INDIAN OCEAN
                    </text>
                    <text x="430" y="115" fill="#7D7568" fontSize="11" letterSpacing="4">
                      BALI SEA • CENTRAL HIGHLANDS
                    </text>
                    <text x="415" y="435" fill="#7D7568" fontSize="10" letterSpacing="2">
                      NGURAH RAI AIRPORT (DPS)
                    </text>
                    <circle cx="395" cy="431" r="4" fill="#A88C62" />
                  </svg>

                  {/* Interactive Villa Pins */}
                  {publishedVillas.map((v) => {
                    const isSelected = activeMapVilla?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedMapVillaId(v.id)}
                        style={{
                          left: `${v.coordinates.x}%`,
                          top: `${v.coordinates.y}%`,
                        }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-10`}
                        aria-label={`Select ${v.name} in ${v.location}`}
                      >
                        <span
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium shadow-editorial border transition-all ${
                            isSelected
                              ? 'bg-deepGreen text-ivory border-deepGreen scale-110'
                              : 'bg-ivory/95 text-charcoal border-stone hover:border-deepGreen'
                          }`}
                        >
                          <MapPin className="w-3.5 h-3.5 text-bronze shrink-0" />
                          <span>{v.location}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* I. CLOSING CTA */}
        <section className="py-24 lg:py-28 bg-ivory border-t border-stone text-center px-4">
          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-xs uppercase tracking-[0.25em] text-bronze font-medium">
              AURELIA BALI • PRIVATE RESERVATIONS
            </p>
            <h2 className="font-serif text-4xl sm:text-6xl text-charcoal">
              Your Island Story Starts Here.
            </h2>
            <p className="text-base text-charcoal/75 max-w-xl mx-auto leading-relaxed">
              Explore live availability across our four Balinese sanctuaries or test the complete interactive booking and administrative suite.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/villas"
                className="w-full sm:w-auto bg-deepGreen hover:bg-forestGreen text-ivory text-xs uppercase tracking-[0.2em] px-8 py-4 font-medium transition-colors"
              >
                Explore All Sanctuaries
              </Link>
              <Link
                href="/booking"
                className="w-full sm:w-auto border border-charcoal/35 hover:border-deepGreen text-charcoal text-xs uppercase tracking-[0.2em] px-8 py-4 font-medium transition-colors"
              >
                Begin Mock Booking Flow
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
