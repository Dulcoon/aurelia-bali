'use client';

import React, { Suspense, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SafeImage } from '@/components/ui/SafeImage';
import { useApp } from '@/context/AppContext';
import { formatIdr } from '@/lib/format-currency';
import { calculateStayPrice } from '@/lib/pricing';
import { checkVillaAvailability } from '@/lib/availability';
import { getFutureIso, getTodayIso, formatDisplayDate } from '@/lib/date-utils';
import {
  BedDouble,
  Bath,
  Users,
  Maximize2,
  MapPin,
  Clock,
  ShieldCheck,
  Check,
  Sparkles,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRight,
  Info,
} from 'lucide-react';

function VillaDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = typeof params?.slug === 'string' ? params.slug : '';

  const {
    villas,
    bookings,
    blockedDates,
    seasonalRules,
    dateOverrides,
    promoCodes,
    settings,
    updateDraftBooking,
    showToast,
  } = useApp();

  const villa = useMemo(
    () => villas.find((v) => v.slug === slug || v.id === slug),
    [villas, slug]
  );

  const [checkIn, setCheckIn] = useState<string>(getFutureIso(8));
  const [checkOut, setCheckOut] = useState<string>(getFutureIso(11));
  const [guests, setGuests] = useState<number>(2);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);

  useEffect(() => {
    const qIn = searchParams.get('checkIn');
    const qOut = searchParams.get('checkOut');
    const qGuests = searchParams.get('guests');
    if (qIn) setCheckIn(qIn);
    if (qOut) setCheckOut(qOut);
    if (qGuests && !Number.isNaN(Number(qGuests))) {
      setGuests(Number(qGuests));
    }
  }, [searchParams]);

  if (!villa) {
    return (
      <main className="flex-1 pt-36 pb-24 px-4 text-center max-w-xl mx-auto space-y-6">
        <p className="text-xs uppercase tracking-[0.25em] text-bronze">Residence Not Found</p>
        <h1 className="font-serif text-4xl text-charcoal">Sanctuary Unavailable</h1>
        <p className="text-sm text-charcoal/75">
          We could not find a villa matching &ldquo;{slug}&rdquo;. Explore our active Balinese sanctuaries below.
        </p>
        <Link
          href="/villas"
          className="inline-block bg-deepGreen text-ivory text-xs uppercase tracking-[0.18em] px-6 py-3.5"
        >
          View All Villas
        </Link>
      </main>
    );
  }

  const availability = checkVillaAvailability({
    villa,
    checkIn,
    checkOut,
    guests,
    bookings,
    blockedDates,
  });

  const priceBreakdown = calculateStayPrice({
    villa,
    checkIn,
    checkOut,
    guests,
    selectedExtras: [],
    promoCodeInput: '',
    seasonalRules,
    dateOverrides,
    promoCodes,
    settings,
  });

  const relatedVillas = villas.filter((v) => v.id !== villa.id && v.published).slice(0, 3);

  const handleProceedToBooking = () => {
    if (!availability.available) {
      showToast(
        'Cannot Proceed With Selected Dates',
        availability.reason || 'Please adjust your dates or guest count.',
        'warning'
      );
      return;
    }

    updateDraftBooking({
      villaId: villa.id,
      checkIn,
      checkOut,
      guests,
    });

    const query = new URLSearchParams({
      villaId: villa.id,
      checkIn,
      checkOut,
      guests: String(guests),
    });
    router.push(`/booking?${query.toString()}`);
  };

  const gallery = villa.images.length > 0 ? villa.images : [
    {
      id: 'default-img',
      url: '/images/fallback-villa-ubud.jpg',
      fallbackUrl: '/images/fallback-villa-ubud.jpg',
      alt: villa.name,
      caption: villa.name,
    },
  ];

  return (
    <main className="flex-1 pt-24 pb-28 lg:pb-24">
      {/* Breadcrumb & Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        <nav aria-label="Breadcrumb" className="text-xs text-charcoal/60 mb-4 flex items-center gap-2">
          <Link href="/" className="hover:text-charcoal">Home</Link>
          <span>/</span>
          <Link href="/villas" className="hover:text-charcoal">Our Villas</Link>
          <span>/</span>
          <span className="text-charcoal font-medium">{villa.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-bronze font-medium">
              <MapPin className="w-3.5 h-3.5" />
              <span>{villa.specificArea}</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl text-charcoal">{villa.name}</h1>
            <p className="text-sm sm:text-base text-charcoal/75 max-w-2xl">{villa.tagline}</p>
          </div>

          <div className="flex items-baseline gap-2 border-l-2 border-bronze pl-4">
            <div>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-charcoal/60">
                Starting Nightly Rate
              </span>
              <span className="font-serif text-3xl text-charcoal font-medium">
                {formatIdr(villa.basePricePerNight)}
              </span>
              <span className="text-xs text-charcoal/65"> / night</span>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery + Thumbnail Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Primary Active Photo */}
          <div
            onClick={() => setLightboxOpen(true)}
            className="lg:col-span-8 relative h-[360px] sm:h-[480px] border border-stone overflow-hidden cursor-pointer group"
          >
            <SafeImage
              src={gallery[activeImageIndex]?.url || gallery[0].url}
              fallbackSrc={gallery[activeImageIndex]?.fallbackUrl || '/images/fallback-villa-ubud.jpg'}
              alt={gallery[activeImageIndex]?.alt || villa.name}
              priority
              className="group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-charcoal/75 backdrop-blur-sm text-ivory px-4 py-2.5 text-xs">
              <span>{gallery[activeImageIndex]?.caption || villa.name}</span>
              <span className="uppercase tracking-widest text-[10px] text-sand shrink-0 ml-4">
                Click to Enlarge ({activeImageIndex + 1}/{gallery.length})
              </span>
            </div>
          </div>

          {/* Side Thumbnails */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4">
            {gallery.slice(0, 3).map((img, idx) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative h-28 sm:h-36 lg:h-[149px] border overflow-hidden text-left transition-all ${
                  activeImageIndex === idx
                    ? 'border-deepGreen ring-2 ring-deepGreen/40'
                    : 'border-stone opacity-80 hover:opacity-100'
                }`}
              >
                <SafeImage
                  src={img.url}
                  fallbackSrc={img.fallbackUrl}
                  alt={img.alt}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Full Thumbnail Strip if > 3 images */}
        {gallery.length > 3 && (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {gallery.map((img, idx) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-28 h-20 shrink-0 border overflow-hidden ${
                  activeImageIndex === idx ? 'border-deepGreen ring-2 ring-deepGreen' : 'border-stone opacity-70'
                }`}
              >
                <SafeImage src={img.url} fallbackSrc={img.fallbackUrl} alt={img.alt} />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Main Content + Desktop Sticky Booking Widget */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left 7 Columns: Residence Details */}
          <div className="lg:col-span-7 space-y-12">
            {/* Key Specs Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-sand/40 border border-stone p-5">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-charcoal/60 flex items-center gap-1">
                  <BedDouble className="w-3.5 h-3.5 text-deepGreen" /> Bedrooms
                </span>
                <p className="font-serif text-xl text-charcoal">{villa.bedrooms} Suites</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-charcoal/60 flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5 text-deepGreen" /> Bathrooms
                </span>
                <p className="font-serif text-xl text-charcoal">{villa.bathrooms} En-Suite</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-charcoal/60 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-deepGreen" /> Capacity
                </span>
                <p className="font-serif text-xl text-charcoal">Max {villa.maxGuests} Guests</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-charcoal/60 flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5 text-deepGreen" /> Estate Size
                </span>
                <p className="font-serif text-xl text-charcoal">{villa.areaSqm} m²</p>
              </div>
            </div>

            {/* Sanctuary Narrative */}
            <div className="space-y-4">
              <h2 className="font-serif text-3xl text-charcoal">The Sanctuary</h2>
              <p className="text-sm sm:text-base text-charcoal/80 leading-relaxed">
                {villa.description}
              </p>
              <p className="text-xs text-bronze uppercase tracking-widest pt-1">
                {villa.distanceNote}
              </p>
            </div>

            {/* Architectural Concept */}
            <div className="bg-white/80 border border-stone p-6 sm:p-8 space-y-5">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-bronze">
                  Architectural Concept
                </p>
                <h3 className="font-serif text-2xl text-charcoal">
                  Crafted for Indoor-Outdoor Harmony
                </h3>
              </div>
              <p className="text-sm text-charcoal/80 leading-relaxed">
                {villa.architecturalPhilosophy}
              </p>
              <ul className="space-y-2.5 pt-2">
                {villa.architecturalHighlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2.5 text-xs text-charcoal/85">
                    <Sparkles className="w-4 h-4 text-bronze shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-3 border-t border-stone/60 text-xs text-charcoal/70">
                <strong>Swimming Pool Specification:</strong> {villa.poolDimensions}
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-5">
              <h2 className="font-serif text-3xl text-charcoal">Residence Amenities & Privileges</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {villa.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-3 p-3.5 bg-white/70 border border-stone/80 text-xs text-charcoal"
                  >
                    <Check className="w-4 h-4 text-deepGreen shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Check-in, House Rules & Cancellation Policy */}
            <div className="space-y-6 border-t border-stone pt-10">
              <h2 className="font-serif text-3xl text-charcoal">Stay Guidelines & Policies</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-sand/35 border border-stone p-5 flex items-center gap-4">
                  <Clock className="w-5 h-5 text-deepGreen shrink-0" />
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-charcoal/65">
                      Check-In Time
                    </p>
                    <p className="font-serif text-xl text-charcoal">From {villa.checkInTime} WITA</p>
                  </div>
                </div>
                <div className="bg-sand/35 border border-stone p-5 flex items-center gap-4">
                  <Clock className="w-5 h-5 text-bronze shrink-0" />
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-charcoal/65">
                      Check-Out Time
                    </p>
                    <p className="font-serif text-xl text-charcoal">Until {villa.checkOutTime} WITA</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/75 border border-stone p-6 space-y-3">
                <h3 className="text-xs uppercase tracking-[0.2em] text-bronze font-medium">
                  House Rules
                </h3>
                <ul className="space-y-2 text-xs text-charcoal/80">
                  {villa.houseRules.map((rule) => (
                    <li key={rule} className="flex items-start gap-2">
                      <span className="text-bronze">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/75 border border-stone p-6 space-y-2">
                <h3 className="text-xs uppercase tracking-[0.2em] text-bronze font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-deepGreen" />
                  Cancellation Policy (Demo)
                </h3>
                <p className="text-xs text-charcoal/80 leading-relaxed">
                  {villa.cancellationPolicy}
                </p>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Sticky Booking & Price Calculator Widget */}
          <aside className="lg:col-span-5 lg:sticky lg:top-28 bg-white border border-stone p-6 sm:p-8 shadow-editorial space-y-6">
            <div className="flex items-baseline justify-between border-b border-stone pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.18em] text-charcoal/60 block">
                  Base Rate
                </span>
                <span className="font-serif text-3xl text-charcoal font-medium">
                  {formatIdr(villa.basePricePerNight)}
                </span>
                <span className="text-xs text-charcoal/65"> / night</span>
              </div>
              <span className="text-[11px] text-bronze">
                Min. {villa.minStayNights} nights
              </span>
            </div>

            {/* Date & Guest Inputs */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="widget-checkin"
                    className="block text-[10px] uppercase tracking-[0.16em] text-charcoal/70 mb-1.5"
                  >
                    Check-In
                  </label>
                  <input
                    id="widget-checkin"
                    type="date"
                    min={getTodayIso()}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-ivory border border-stone px-3 py-2.5 text-xs text-charcoal focus:outline-none focus:border-deepGreen"
                  />
                </div>
                <div>
                  <label
                    htmlFor="widget-checkout"
                    className="block text-[10px] uppercase tracking-[0.16em] text-charcoal/70 mb-1.5"
                  >
                    Check-Out
                  </label>
                  <input
                    id="widget-checkout"
                    type="date"
                    min={checkIn || getTodayIso()}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-ivory border border-stone px-3 py-2.5 text-xs text-charcoal focus:outline-none focus:border-deepGreen"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="widget-guests"
                  className="block text-[10px] uppercase tracking-[0.16em] text-charcoal/70 mb-1.5"
                >
                  Number of Guests (Max {villa.maxGuests})
                </label>
                <select
                  id="widget-guests"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full bg-ivory border border-stone px-3 py-2.5 text-xs text-charcoal focus:outline-none focus:border-deepGreen"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}{' '}
                      {num > villa.maxGuests ? `(Exceeds max ${villa.maxGuests})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Real-Time Availability Validation Status */}
            <div
              className={`p-3.5 border text-xs flex items-start gap-2.5 ${
                availability.available
                  ? 'bg-deepGreen/10 border-deepGreen/30 text-deepGreen'
                  : 'bg-red-900/10 border-red-800/30 text-red-900'
              }`}
            >
              {availability.available ? (
                <>
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Sanctuary Available</p>
                    <p className="text-[11px] opacity-85 mt-0.5">
                      {priceBreakdown.nights} nights ({formatDisplayDate(checkIn)} –{' '}
                      {formatDisplayDate(checkOut)})
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Unavailable for Selected Parameters</p>
                    <p className="text-[11px] mt-0.5">{availability.reason}</p>
                  </div>
                </>
              )}
            </div>

            {/* Estimated Price Breakdown */}
            {priceBreakdown.nights > 0 && (
              <div className="bg-ivory/80 border border-stone p-4 space-y-2.5 text-xs">
                <div className="flex justify-between text-charcoal/80">
                  <span>
                    {formatIdr(priceBreakdown.averageNightlyRate)} × {priceBreakdown.nights} nights
                  </span>
                  <span>{formatIdr(priceBreakdown.accommodationSubtotal)}</span>
                </div>

                {priceBreakdown.extraGuestTotal > 0 && (
                  <div className="flex justify-between text-charcoal/80">
                    <span>Extra guest supplement</span>
                    <span>{formatIdr(priceBreakdown.extraGuestTotal)}</span>
                  </div>
                )}

                <div className="flex justify-between text-charcoal/70">
                  <span>Hospitality service charge ({settings.serviceFeePercentage}%)</span>
                  <span>{formatIdr(priceBreakdown.serviceFeeAmount)}</span>
                </div>

                <div className="flex justify-between text-charcoal/70">
                  <span>Government tax ({settings.taxPercentage}%)</span>
                  <span>{formatIdr(priceBreakdown.taxAmount)}</span>
                </div>

                <div className="pt-2.5 border-t border-stone flex justify-between items-baseline font-medium text-sm text-charcoal">
                  <span>Estimated Total</span>
                  <span className="font-serif text-xl">{formatIdr(priceBreakdown.grandTotal)}</span>
                </div>

                <div className="flex justify-between text-[11px] text-bronze pt-1">
                  <span>Optional {settings.depositPercentage}% Deposit at Checkout:</span>
                  <span>{formatIdr(priceBreakdown.depositRequired)}</span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleProceedToBooking}
              disabled={!availability.available}
              className={`w-full py-4 px-6 text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center gap-2 ${
                availability.available
                  ? 'bg-deepGreen hover:bg-forestGreen text-ivory'
                  : 'bg-stone text-charcoal/50 cursor-not-allowed'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve Your Stay</span>
            </button>

            <p className="text-[11px] text-center text-charcoal/60 flex items-center justify-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-bronze shrink-0" />
              <span>Simulated booking flow — add optional experiences & promo codes next.</span>
            </p>
          </aside>
        </div>
      </section>

      {/* Related Villas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pt-16 border-t border-stone">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-bronze">
              Continue Exploring
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal mt-1">
              Other Sanctuaries in Our Collection
            </h2>
          </div>
          <Link
            href="/villas"
            className="text-xs uppercase tracking-[0.16em] text-deepGreen hover:text-bronze"
          >
            All Villas →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedVillas.map((rel) => (
            <Link
              key={rel.id}
              href={`/villas/${rel.slug}`}
              className="group bg-white/80 border border-stone overflow-hidden flex flex-col justify-between hover:border-bronze transition-colors"
            >
              <div>
                <div className="relative h-56 overflow-hidden border-b border-stone">
                  <SafeImage
                    src={rel.images[0]?.url}
                    fallbackSrc={rel.images[0]?.fallbackUrl}
                    alt={rel.name}
                    className="group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute top-3 left-3 bg-ivory/95 text-charcoal px-2.5 py-1 text-[10px] uppercase tracking-widest">
                    {rel.location}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-serif text-2xl text-charcoal group-hover:text-deepGreen">
                    {rel.name}
                  </h3>
                  <p className="text-xs text-charcoal/70 line-clamp-2">{rel.concept}</p>
                </div>
              </div>
              <div className="px-5 pb-5 pt-3 border-t border-stone/50 flex items-center justify-between text-xs">
                <span className="font-medium text-charcoal">
                  {formatIdr(rel.basePricePerNight)} / night
                </span>
                <span className="text-deepGreen uppercase tracking-wider text-[11px]">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Mobile Sticky Booking Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-ivory border-t border-stone p-4 shadow-editorial flex items-center justify-between gap-4 no-print">
        <div>
          <span className="block text-[10px] uppercase tracking-wider text-charcoal/65">
            {priceBreakdown.nights > 0 ? `${priceBreakdown.nights} Nights Total` : 'Starting From'}
          </span>
          <span className="font-serif text-xl text-charcoal font-medium">
            {priceBreakdown.nights > 0
              ? formatIdr(priceBreakdown.grandTotal)
              : `${formatIdr(villa.basePricePerNight)} / night`}
          </span>
        </div>
        <button
          type="button"
          onClick={handleProceedToBooking}
          disabled={!availability.available}
          className={`px-6 py-3 text-xs uppercase tracking-[0.18em] font-medium ${
            availability.available
              ? 'bg-deepGreen text-ivory'
              : 'bg-stone text-charcoal/50'
          }`}
        >
          Reserve Stay
        </button>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-charcoal/95 flex flex-col justify-between p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between text-ivory">
            <div>
              <p className="font-serif text-2xl">{villa.name}</p>
              <p className="text-xs text-sand/75">
                Image {activeImageIndex + 1} of {gallery.length} — {gallery[activeImageIndex]?.caption}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="p-2 bg-ivory/10 hover:bg-ivory/20 text-ivory"
              aria-label="Close gallery lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative flex-1 my-6 max-w-5xl w-full mx-auto overflow-hidden border border-ivory/20">
            <SafeImage
              src={gallery[activeImageIndex]?.url}
              fallbackSrc={gallery[activeImageIndex]?.fallbackUrl}
              alt={gallery[activeImageIndex]?.alt || villa.name}
            />
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() =>
                setActiveImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))
              }
              className="px-4 py-2 bg-ivory/10 hover:bg-ivory/20 text-ivory text-xs uppercase tracking-widest inline-flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))
              }
              className="px-4 py-2 bg-ivory/10 hover:bg-ivory/20 text-ivory text-xs uppercase tracking-widest inline-flex items-center gap-1.5"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default function VillaDetailPage() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <div className="flex-1 pt-36 pb-24 max-w-7xl mx-auto px-4 text-center font-serif text-2xl text-charcoal/70">
            Loading Sanctuary Details...
          </div>
        }
      >
        <VillaDetailContent />
      </Suspense>
      <Footer />
    </>
  );
}
