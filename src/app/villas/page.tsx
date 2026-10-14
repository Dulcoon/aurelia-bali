'use client';

import React, { Suspense, useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SafeImage } from '@/components/ui/SafeImage';
import { useApp } from '@/context/AppContext';
import { formatIdr } from '@/lib/format-currency';
import { checkVillaAvailability } from '@/lib/availability';
import { getTodayIso } from '@/lib/date-utils';
import {
  BedDouble,
  Users,
  MapPin,
  SlidersHorizontal,
  LayoutGrid,
  List,
  X,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

const POPULAR_AMENITY_FILTERS = [
  'Private Pool',
  'Infinity Pool',
  'Garden Courtyard',
  'Open-Air Bathroom',
  'Ocean-View Terrace',
  'Private Chef Kitchen',
  'Outdoor Pavilion',
  'Yoga Mats & Meditation Deck',
];

function VillasDiscoveryContent() {
  const searchParams = useSearchParams();
  const { villas, bookings, blockedDates, updateDraftBooking } = useApp();

  // Filter states
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [guests, setGuests] = useState<number>(1);
  const [locationFilter, setLocationFilter] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<'all' | 'under3m' | '3mTo5m' | 'over5m'>('all');
  const [minBedrooms, setMinBedrooms] = useState<number>(0);
  const [minCapacity, setMinCapacity] = useState<number>(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'capacity-desc'>('price-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'editorial'>('editorial');
  const [onlyAvailableForDates, setOnlyAvailableForDates] = useState<boolean>(false);

  // Sync URL query params on mount
  useEffect(() => {
    const qIn = searchParams.get('checkIn');
    const qOut = searchParams.get('checkOut');
    const qGuests = searchParams.get('guests');
    const qLoc = searchParams.get('location');

    if (qIn) setCheckIn(qIn);
    if (qOut) setCheckOut(qOut);
    if (qGuests && !Number.isNaN(Number(qGuests))) {
      setGuests(Number(qGuests));
      setMinCapacity(Number(qGuests));
    }
    if (qLoc) setLocationFilter(qLoc);
    if (qIn && qOut) setOnlyAvailableForDates(true);
  }, [searchParams]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const clearAllFilters = () => {
    setCheckIn('');
    setCheckOut('');
    setGuests(1);
    setLocationFilter('All');
    setPriceRange('all');
    setMinBedrooms(0);
    setMinCapacity(0);
    setSelectedAmenities([]);
    setSortBy('price-asc');
    setOnlyAvailableForDates(false);
  };

  const publishedVillas = useMemo(() => villas.filter((v) => v.published), [villas]);

  const filteredVillas = useMemo(() => {
    return publishedVillas
      .filter((villa) => {
        if (locationFilter !== 'All' && villa.location !== locationFilter) return false;
        if (priceRange === 'under3m' && villa.basePricePerNight >= 3000000) return false;
        if (
          priceRange === '3mTo5m' &&
          (villa.basePricePerNight < 3000000 || villa.basePricePerNight > 5000000)
        )
          return false;
        if (priceRange === 'over5m' && villa.basePricePerNight <= 5000000) return false;
        if (minBedrooms > 0 && villa.bedrooms < minBedrooms) return false;
        const effectiveMinCap = Math.max(minCapacity, guests > 1 ? guests : 0);
        if (effectiveMinCap > 0 && villa.maxGuests < effectiveMinCap) return false;

        if (selectedAmenities.length > 0) {
          const hasAll = selectedAmenities.every((a) => villa.amenities.includes(a));
          if (!hasAll) return false;
        }

        if (onlyAvailableForDates && checkIn && checkOut) {
          const avail = checkVillaAvailability({
            villa,
            checkIn,
            checkOut,
            guests: Math.max(1, guests),
            bookings,
            blockedDates,
          });
          if (!avail.available) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.basePricePerNight - b.basePricePerNight;
        if (sortBy === 'price-desc') return b.basePricePerNight - a.basePricePerNight;
        if (sortBy === 'capacity-desc') return b.maxGuests - a.maxGuests;
        return 0;
      });
  }, [
    publishedVillas,
    locationFilter,
    priceRange,
    minBedrooms,
    minCapacity,
    guests,
    selectedAmenities,
    onlyAvailableForDates,
    checkIn,
    checkOut,
    bookings,
    blockedDates,
    sortBy,
  ]);

  const activeFiltersCount = [
    locationFilter !== 'All',
    priceRange !== 'all',
    minBedrooms > 0,
    minCapacity > 0 || guests > 1,
    selectedAmenities.length > 0,
    onlyAvailableForDates && Boolean(checkIn && checkOut),
  ].filter(Boolean).length;

  return (
    <main className="flex-1 pt-28 pb-24">
      {/* Editorial Heading */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 border-b border-stone">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs uppercase tracking-[0.24em] text-bronze font-medium">
            AURELIA BALI • SANCTUARY COLLECTION
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl text-charcoal leading-[1.1]">
            Private Island Residences
          </h1>
          <p className="text-base text-charcoal/80 leading-relaxed">
            Explore our collection of private architectural villas across Ubud, Uluwatu, Canggu, and Gianyar. Filter by landscape, bedroom configuration, or live stay availability.
          </p>
        </div>

        {/* Date & Availability Filter Bar */}
        <div className="mt-8 bg-white/85 border border-stone p-5 sm:p-6 shadow-subtle space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
            <div className="lg:col-span-3">
              <label
                htmlFor="filter-checkin"
                className="block text-[11px] uppercase tracking-[0.16em] text-charcoal/70 mb-1.5"
              >
                Check-In Date
              </label>
              <input
                id="filter-checkin"
                type="date"
                min={getTodayIso()}
                value={checkIn}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  if (e.target.value && checkOut) setOnlyAvailableForDates(true);
                }}
                className="w-full bg-ivory border border-stone px-3.5 py-2.5 text-sm focus:outline-none focus:border-deepGreen"
              />
            </div>

            <div className="lg:col-span-3">
              <label
                htmlFor="filter-checkout"
                className="block text-[11px] uppercase tracking-[0.16em] text-charcoal/70 mb-1.5"
              >
                Check-Out Date
              </label>
              <input
                id="filter-checkout"
                type="date"
                min={checkIn || getTodayIso()}
                value={checkOut}
                onChange={(e) => {
                  setCheckOut(e.target.value);
                  if (checkIn && e.target.value) setOnlyAvailableForDates(true);
                }}
                className="w-full bg-ivory border border-stone px-3.5 py-2.5 text-sm focus:outline-none focus:border-deepGreen"
              />
            </div>

            <div className="lg:col-span-2">
              <label
                htmlFor="filter-guests"
                className="block text-[11px] uppercase tracking-[0.16em] text-charcoal/70 mb-1.5"
              >
                Guests
              </label>
              <select
                id="filter-guests"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full bg-ivory border border-stone px-3.5 py-2.5 text-sm focus:outline-none focus:border-deepGreen"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label
                htmlFor="filter-location"
                className="block text-[11px] uppercase tracking-[0.16em] text-charcoal/70 mb-1.5"
              >
                Destination
              </label>
              <select
                id="filter-location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full bg-ivory border border-stone px-3.5 py-2.5 text-sm focus:outline-none focus:border-deepGreen"
              >
                <option value="All">All Bali Regions</option>
                <option value="Ubud">Ubud</option>
                <option value="Uluwatu">Uluwatu</option>
                <option value="Canggu">Canggu</option>
                <option value="Gianyar">Gianyar</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <label
                htmlFor="filter-price"
                className="block text-[11px] uppercase tracking-[0.16em] text-charcoal/70 mb-1.5"
              >
                Nightly Rate
              </label>
              <select
                id="filter-price"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value as typeof priceRange)}
                className="w-full bg-ivory border border-stone px-3.5 py-2.5 text-sm focus:outline-none focus:border-deepGreen"
              >
                <option value="all">Any Price</option>
                <option value="under3m">Under IDR 3,000,000</option>
                <option value="3mTo5m">IDR 3,000,000 – 5,000,000</option>
                <option value="over5m">Above IDR 5,000,000</option>
              </select>
            </div>
          </div>

          {/* Secondary Filter Row: Bedrooms, Capacity, Amenities */}
          <div className="pt-4 border-t border-stone/60 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-3 flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-charcoal/70 shrink-0">
                Bedrooms:
              </span>
              <div className="flex gap-1.5">
                {[0, 2, 3, 4].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setMinBedrooms(b)}
                    className={`px-2.5 py-1 text-xs border transition-colors ${
                      minBedrooms === b
                        ? 'bg-deepGreen text-ivory border-deepGreen'
                        : 'bg-ivory text-charcoal border-stone hover:border-bronze'
                    }`}
                  >
                    {b === 0 ? 'Any' : `${b}+`}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-charcoal/70 shrink-0">
                Capacity:
              </span>
              <div className="flex gap-1.5">
                {[0, 4, 6, 8].map((cap) => (
                  <button
                    key={cap}
                    type="button"
                    onClick={() => setMinCapacity(cap)}
                    className={`px-2.5 py-1 text-xs border transition-colors ${
                      minCapacity === cap
                        ? 'bg-deepGreen text-ivory border-deepGreen'
                        : 'bg-ivory text-charcoal border-stone hover:border-bronze'
                    }`}
                  >
                    {cap === 0 ? 'Any' : `${cap}+`}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-charcoal/70 mr-1">
                Amenities:
              </span>
              {POPULAR_AMENITY_FILTERS.map((amenity) => {
                const active = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`text-[11px] px-2.5 py-1 border transition-colors ${
                      active
                        ? 'bg-deepGreen text-ivory border-deepGreen'
                        : 'bg-ivory text-charcoal/80 border-stone hover:border-bronze'
                    }`}
                  >
                    {amenity}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Availability toggle when dates entered */}
          {checkIn && checkOut && (
            <div className="pt-3 border-t border-stone/50 flex flex-wrap items-center justify-between gap-4 text-xs">
              <label className="inline-flex items-center gap-2 cursor-pointer text-charcoal">
                <input
                  type="checkbox"
                  checked={onlyAvailableForDates}
                  onChange={(e) => setOnlyAvailableForDates(e.target.checked)}
                  className="accent-deepGreen w-4 h-4"
                />
                <span>
                  Only show villas available for <strong>{checkIn}</strong> to <strong>{checkOut}</strong>
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Active Filter Indicators & Sort Bar */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-charcoal">
              Showing {filteredVillas.length} of {publishedVillas.length} Sanctuaries
            </span>

            {locationFilter !== 'All' && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-sand/70 text-charcoal px-2.5 py-1 border border-stone">
                Location: {locationFilter}
                <button type="button" onClick={() => setLocationFilter('All')} aria-label="Remove location filter">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {priceRange !== 'all' && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-sand/70 text-charcoal px-2.5 py-1 border border-stone">
                Rate Filter Active
                <button type="button" onClick={() => setPriceRange('all')} aria-label="Remove price filter">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {minBedrooms > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-sand/70 text-charcoal px-2.5 py-1 border border-stone">
                {minBedrooms}+ Bedrooms
                <button type="button" onClick={() => setMinBedrooms(0)} aria-label="Remove bedroom filter">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedAmenities.map((a) => (
              <span
                key={a}
                className="inline-flex items-center gap-1.5 text-xs bg-sand/70 text-charcoal px-2.5 py-1 border border-stone"
              >
                {a}
                <button type="button" onClick={() => toggleAmenity(a)} aria-label={`Remove ${a} filter`}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-bronze hover:text-charcoal underline underline-offset-4 ml-2"
              >
                <RotateCcw className="w-3 h-3" />
                Clear All Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <label htmlFor="sort-select" className="text-xs uppercase tracking-wider text-charcoal/70">
              Sort By:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-white border border-stone px-3 py-2 text-xs text-charcoal focus:outline-none focus:border-deepGreen"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="capacity-desc">Capacity: Largest First</option>
            </select>

            <div className="flex border border-stone bg-white">
              <button
                type="button"
                onClick={() => setViewMode('editorial')}
                aria-label="Editorial split layout"
                className={`p-2 ${
                  viewMode === 'editorial' ? 'bg-deepGreen text-ivory' : 'text-charcoal/70'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-label="Two-column gallery grid"
                className={`p-2 ${
                  viewMode === 'grid' ? 'bg-deepGreen text-ivory' : 'text-charcoal/70'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {filteredVillas.length === 0 ? (
          <div className="bg-white/75 border border-stone p-12 text-center max-w-xl mx-auto space-y-5">
            <SlidersHorizontal className="w-8 h-8 text-bronze mx-auto" />
            <h2 className="font-serif text-3xl text-charcoal">
              No Sanctuaries Match Your Exact Filters
            </h2>
            <p className="text-sm text-charcoal/75 leading-relaxed">
              Try adjusting your guest count, price range, or selected amenities to view all available Balinese residences.
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="bg-deepGreen text-ivory text-xs uppercase tracking-[0.18em] px-6 py-3.5 hover:bg-forestGreen transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === 'editorial' ? (
          <div className="space-y-12">
            {filteredVillas.map((villa) => {
              const availabilityCheck =
                checkIn && checkOut
                  ? checkVillaAvailability({
                      villa,
                      checkIn,
                      checkOut,
                      guests: Math.max(1, guests),
                      bookings,
                      blockedDates,
                    })
                  : null;

              const detailHref =
                checkIn && checkOut
                  ? `/villas/${villa.slug}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
                  : `/villas/${villa.slug}`;

              return (
                <article
                  key={villa.id}
                  className="bg-white/80 border border-stone grid grid-cols-1 lg:grid-cols-12 overflow-hidden shadow-subtle hover:border-bronze transition-colors"
                >
                  <Link
                    href={detailHref}
                    className="lg:col-span-6 relative min-h-[320px] sm:min-h-[380px] overflow-hidden group block"
                  >
                    <SafeImage
                      src={villa.images[0]?.url}
                      fallbackSrc={villa.images[0]?.fallbackUrl}
                      alt={villa.images[0]?.alt || villa.name}
                      className="group-hover:scale-105 transition-transform duration-700"
                    />
                    <span className="absolute top-4 left-4 bg-ivory/95 text-charcoal px-3 py-1 text-[11px] uppercase tracking-[0.18em]">
                      {villa.location}, Bali
                    </span>
                  </Link>

                  <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs uppercase tracking-[0.18em] text-bronze flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {villa.specificArea}
                        </span>

                        {availabilityCheck && (
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 border ${
                              availabilityCheck.available
                                ? 'bg-deepGreen/10 text-deepGreen border-deepGreen/30'
                                : 'bg-amber-900/10 text-amber-900 border-amber-800/30'
                            }`}
                          >
                            {availabilityCheck.available ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" /> Available for Selected Dates
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-3 h-3" /> Date Conflict
                              </>
                            )}
                          </span>
                        )}
                      </div>

                      <h2 className="font-serif text-3xl sm:text-4xl text-charcoal">
                        <Link href={detailHref} className="hover:text-deepGreen transition-colors">
                          {villa.name}
                        </Link>
                      </h2>

                      <p className="text-sm text-charcoal/80 leading-relaxed">{villa.concept}</p>

                      <div className="flex flex-wrap items-center gap-5 py-3 border-y border-stone/70 text-xs text-charcoal/85">
                        <span className="inline-flex items-center gap-1.5">
                          <BedDouble className="w-4 h-4 text-deepGreen" />
                          {villa.bedrooms} Bedrooms • {villa.bathrooms} Baths
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-deepGreen" />
                          Up to {villa.maxGuests} Guests
                        </span>
                        <span>{villa.areaSqm} m²</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {villa.amenities.slice(0, 6).map((a) => (
                          <span
                            key={a}
                            className="text-[11px] bg-ivory border border-stone/80 px-2.5 py-1 text-charcoal/80"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-stone/60 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <span className="block text-[10px] uppercase tracking-[0.18em] text-charcoal/60">
                          Starting Nightly Rate
                        </span>
                        <span className="font-serif text-2xl text-charcoal font-medium">
                          {formatIdr(villa.basePricePerNight)}
                        </span>
                        <span className="text-xs text-charcoal/60"> / night</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link
                          href={detailHref}
                          className="bg-deepGreen hover:bg-forestGreen text-ivory text-xs uppercase tracking-[0.16em] px-5 py-3 font-medium inline-flex items-center gap-2 transition-colors"
                        >
                          <span>View Residence</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/booking?villaId=${villa.id}${
                            checkIn && checkOut ? `&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}` : ''
                          }`}
                          onClick={() =>
                            updateDraftBooking({
                              villaId: villa.id,
                              ...(checkIn ? { checkIn } : {}),
                              ...(checkOut ? { checkOut } : {}),
                              guests: Math.min(villa.maxGuests, Math.max(1, guests)),
                            })
                          }
                          className="border border-charcoal/30 hover:border-deepGreen text-charcoal text-xs uppercase tracking-[0.16em] px-4 py-3 transition-colors"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredVillas.map((villa) => {
              const detailHref =
                checkIn && checkOut
                  ? `/villas/${villa.slug}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
                  : `/villas/${villa.slug}`;

              return (
                <article
                  key={villa.id}
                  className="bg-white/80 border border-stone flex flex-col justify-between overflow-hidden group hover:border-bronze transition-colors"
                >
                  <div>
                    <Link href={detailHref} className="relative h-72 block overflow-hidden border-b border-stone">
                      <SafeImage
                        src={villa.images[0]?.url}
                        fallbackSrc={villa.images[0]?.fallbackUrl}
                        alt={villa.name}
                        className="group-hover:scale-105 transition-transform duration-700"
                      />
                      <span className="absolute top-3 left-3 bg-ivory/95 text-charcoal px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
                        {villa.location}, Bali
                      </span>
                    </Link>

                    <div className="p-6 space-y-3">
                      <p className="text-[11px] uppercase tracking-widest text-bronze">
                        {villa.bedrooms} Bedrooms • Up to {villa.maxGuests} Guests • {villa.areaSqm} m²
                      </p>
                      <h2 className="font-serif text-3xl text-charcoal">
                        <Link href={detailHref} className="hover:text-deepGreen">
                          {villa.name}
                        </Link>
                      </h2>
                      <p className="text-xs text-charcoal/75 leading-relaxed">{villa.concept}</p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-4 border-t border-stone/60 flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-charcoal/60">
                        From
                      </span>
                      <span className="font-serif text-xl text-charcoal font-medium">
                        {formatIdr(villa.basePricePerNight)}
                      </span>
                      <span className="text-xs text-charcoal/60"> / night</span>
                    </div>
                    <Link
                      href={detailHref}
                      className="bg-deepGreen text-ivory text-xs uppercase tracking-[0.16em] px-4 py-2.5 hover:bg-forestGreen transition-colors"
                    >
                      Explore →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default function VillasPage() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <div className="flex-1 pt-36 pb-24 max-w-7xl mx-auto px-4 text-center font-serif text-2xl text-charcoal/70">
            Loading Sanctuary Collection...
          </div>
        }
      >
        <VillasDiscoveryContent />
      </Suspense>
      <Footer />
    </>
  );
}
