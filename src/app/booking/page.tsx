'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SafeImage } from '@/components/ui/SafeImage';
import { useApp } from '@/context/AppContext';
import { SIGNATURE_EXPERIENCES } from '@/data/experiences';
import { checkVillaAvailability } from '@/lib/availability';
import { calculateStayPrice } from '@/lib/pricing';
import { formatIdr } from '@/lib/format-currency';
import { formatDisplayDate, getFutureIso, getTodayIso } from '@/lib/date-utils';
import {
  Calendar,
  Users,
  Sparkles,
  Tag,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BedDouble,
  MapPin,
  Plus,
  Minus,
  ShieldCheck,
} from 'lucide-react';

function BookingReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    villas,
    bookings,
    blockedDates,
    seasonalRules,
    dateOverrides,
    promoCodes,
    settings,
    draftBooking,
    updateDraftBooking,
    showToast,
  } = useApp();

  const publishedVillas = villas.filter((v) => v.published);

  const [villaId, setVillaId] = useState<string>(
    draftBooking.villaId || publishedVillas[0]?.id || 'villa-ubud-sanctuary'
  );
  const [checkIn, setCheckIn] = useState<string>(draftBooking.checkIn || getFutureIso(8));
  const [checkOut, setCheckOut] = useState<string>(draftBooking.checkOut || getFutureIso(11));
  const [guests, setGuests] = useState<number>(draftBooking.guests || 2);
  const [promoInput, setPromoInput] = useState<string>(draftBooking.promoCode || '');
  const [paymentChoice, setPaymentChoice] = useState<'full' | 'deposit'>(
    draftBooking.paymentChoice || 'full'
  );

  // Sync URL params if passed from Villa Detail or Homepage
  useEffect(() => {
    const qVillaId = searchParams.get('villaId');
    const qIn = searchParams.get('checkIn');
    const qOut = searchParams.get('checkOut');
    const qGuests = searchParams.get('guests');

    if (qVillaId && villas.some((v) => v.id === qVillaId)) {
      setVillaId(qVillaId);
    }
    if (qIn) setCheckIn(qIn);
    if (qOut) setCheckOut(qOut);
    if (qGuests && !Number.isNaN(Number(qGuests))) {
      setGuests(Number(qGuests));
    }
  }, [searchParams, villas]);

  const selectedVilla =
    villas.find((v) => v.id === villaId) || publishedVillas[0] || villas[0];

  const availability = checkVillaAvailability({
    villa: selectedVilla,
    checkIn,
    checkOut,
    guests,
    bookings,
    blockedDates,
  });

  const priceBreakdown = calculateStayPrice({
    villa: selectedVilla,
    checkIn,
    checkOut,
    guests,
    selectedExtras: draftBooking.selectedExtras,
    promoCodeInput: promoInput,
    seasonalRules,
    dateOverrides,
    promoCodes,
    settings,
  });

  const toggleExtra = (expId: string) => {
    const exp = SIGNATURE_EXPERIENCES.find((e) => e.id === expId);
    if (!exp) return;

    const existing = draftBooking.selectedExtras.find((item) => item.experienceId === expId);
    if (existing) {
      updateDraftBooking({
        selectedExtras: draftBooking.selectedExtras.filter((i) => i.experienceId !== expId),
      });
    } else {
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
  };

  const updateExtraQty = (expId: string, delta: number) => {
    const updated = draftBooking.selectedExtras
      .map((item) => {
        if (item.experienceId !== expId) return item;
        const nextQty = item.quantity + delta;
        return nextQty > 0 ? { ...item, quantity: nextQty } : null;
      })
      .filter(Boolean) as typeof draftBooking.selectedExtras;

    updateDraftBooking({ selectedExtras: updated });
  };

  const handleApplyPromoPill = (code: string) => {
    setPromoInput(code);
    updateDraftBooking({ promoCode: code });
    showToast('Promo Code Applied', `Testing promo code "${code}" on your stay.`, 'info');
  };

  const handleContinueToCheckout = () => {
    if (!availability.available) {
      showToast(
        'Please Resolve Stay Dates or Guest Count',
        availability.reason || 'Selected dates are unavailable.',
        'error'
      );
      return;
    }

    updateDraftBooking({
      villaId: selectedVilla.id,
      checkIn,
      checkOut,
      guests,
      promoCode: promoInput.trim().toUpperCase(),
      paymentChoice,
    });

    router.push('/booking/checkout');
  };

  return (
    <main className="flex-1 pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-10 border-b border-stone pb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-bronze font-medium">
              Step 1 & 2 of 4 • Sanctuary Selection & Stay Review
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl text-charcoal mt-1">
              Tailor Your Private Island Stay
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs uppercase tracking-widest">
            <span className="px-3 py-1.5 bg-deepGreen text-ivory font-medium">
              1. Review & Extras
            </span>
            <span className="text-charcoal/40">→</span>
            <span className="px-3 py-1.5 bg-sand/50 text-charcoal/60">
              2. Guest & Simulated Checkout
            </span>
            <span className="text-charcoal/40">→</span>
            <span className="px-3 py-1.5 bg-sand/50 text-charcoal/60">
              3. Confirmation
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left 7 Columns: Villa, Dates, Optional Experiences, Promo Code */}
          <div className="lg:col-span-7 space-y-10">
            {/* 1. Select Residence & Stay Dates */}
            <section className="bg-white/85 border border-stone p-6 sm:p-8 space-y-6">
              <h2 className="font-serif text-2xl text-charcoal border-b border-stone pb-3">
                1. Residence & Stay Dates
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="booking-villa"
                    className="block text-xs uppercase tracking-wider text-charcoal/75 mb-2"
                  >
                    Select Private Villa
                  </label>
                  <select
                    id="booking-villa"
                    value={selectedVilla.id}
                    onChange={(e) => {
                      const nextVilla = villas.find((v) => v.id === e.target.value);
                      setVillaId(e.target.value);
                      if (nextVilla && guests > nextVilla.maxGuests) {
                        setGuests(nextVilla.maxGuests);
                      }
                    }}
                    className="w-full bg-ivory border border-stone px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-deepGreen"
                  >
                    {publishedVillas.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} — {v.location} ({v.bedrooms} Bedrooms, Max {v.maxGuests} Guests •{' '}
                        {formatIdr(v.basePricePerNight)}/night)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="booking-checkin"
                    className="block text-xs uppercase tracking-wider text-charcoal/75 mb-2"
                  >
                    Check-In Date
                  </label>
                  <input
                    id="booking-checkin"
                    type="date"
                    min={getTodayIso()}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-ivory border border-stone px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-deepGreen"
                  />
                </div>

                <div>
                  <label
                    htmlFor="booking-checkout"
                    className="block text-xs uppercase tracking-wider text-charcoal/75 mb-2"
                  >
                    Check-Out Date
                  </label>
                  <input
                    id="booking-checkout"
                    type="date"
                    min={checkIn || getTodayIso()}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-ivory border border-stone px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-deepGreen"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="booking-guests"
                    className="block text-xs uppercase tracking-wider text-charcoal/75 mb-2"
                  >
                    Number of Guests (Max {selectedVilla.maxGuests} for {selectedVilla.name})
                  </label>
                  <select
                    id="booking-guests"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full bg-ivory border border-stone px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-deepGreen"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Guest' : 'Guests'}{' '}
                        {n > selectedVilla.maxGuests
                          ? `(Exceeds ${selectedVilla.name} limit of ${selectedVilla.maxGuests})`
                          : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Validation Banner */}
              <div
                className={`p-4 border text-xs flex items-start gap-3 ${
                  availability.available
                    ? 'bg-deepGreen/10 border-deepGreen/30 text-deepGreen'
                    : 'bg-red-900/10 border-red-800/30 text-red-900'
                }`}
              >
                {availability.available ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">
                        {selectedVilla.name} is available for your {priceBreakdown.nights}-night stay
                      </p>
                      <p className="text-[11px] opacity-85 mt-0.5">
                        Check-in {formatDisplayDate(checkIn)} ({selectedVilla.checkInTime}) • Check-out{' '}
                        {formatDisplayDate(checkOut)} ({selectedVilla.checkOutTime})
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Date or Capacity Validation Notice</p>
                      <p className="text-[11px] mt-0.5">{availability.reason}</p>
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* 2. Optional Signature Experiences */}
            <section className="bg-white/85 border border-stone p-6 sm:p-8 space-y-6">
              <div className="border-b border-stone pb-3 flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl text-charcoal">
                    2. Optional Signature Experiences
                  </h2>
                  <p className="text-xs text-charcoal/65 mt-0.5">
                    Enhance your stay with curated private dining, wellness, or cultural rituals (Fictional Demo Offerings).
                  </p>
                </div>
                <Sparkles className="w-5 h-5 text-bronze shrink-0" />
              </div>

              <div className="space-y-4">
                {SIGNATURE_EXPERIENCES.map((exp) => {
                  const selectedItem = draftBooking.selectedExtras.find(
                    (i) => i.experienceId === exp.id
                  );
                  const isSelected = Boolean(selectedItem);

                  return (
                    <div
                      key={exp.id}
                      className={`p-4 border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isSelected
                          ? 'bg-sand/35 border-deepGreen'
                          : 'bg-ivory/60 border-stone hover:border-bronze'
                      }`}
                    >
                      <div className="space-y-1 max-w-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-widest bg-white px-2 py-0.5 border border-stone text-bronze">
                            {exp.category}
                          </span>
                          <h3 className="font-serif text-xl text-charcoal">{exp.title}</h3>
                        </div>
                        <p className="text-xs text-charcoal/75">{exp.shortDescription}</p>
                        <p className="text-xs font-medium text-deepGreen pt-1">
                          {formatIdr(exp.priceIdr)}{' '}
                          <span className="font-normal text-charcoal/60">/ {exp.priceUnit}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {isSelected && selectedItem ? (
                          <div className="flex items-center border border-deepGreen bg-white">
                            <button
                              type="button"
                              onClick={() => updateExtraQty(exp.id, -1)}
                              aria-label="Decrease quantity"
                              className="p-2 text-charcoal hover:bg-sand/50"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 text-xs font-medium">{selectedItem.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateExtraQty(exp.id, 1)}
                              aria-label="Increase quantity"
                              className="p-2 text-charcoal hover:bg-sand/50"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleExtra(exp.id)}
                            className="text-xs uppercase tracking-[0.16em] px-4 py-2.5 border border-charcoal/30 hover:border-deepGreen hover:bg-deepGreen hover:text-ivory transition-colors"
                          >
                            + Add Experience
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 3. Promo Code & Payment Schedule Preference */}
            <section className="bg-white/85 border border-stone p-6 sm:p-8 space-y-6">
              <h2 className="font-serif text-2xl text-charcoal border-b border-stone pb-3">
                3. Promotional Privilege & Payment Preference
              </h2>

              <div className="space-y-3">
                <label
                  htmlFor="promo-code-input"
                  className="block text-xs uppercase tracking-wider text-charcoal/75"
                >
                  Promo Code (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    id="promo-code-input"
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Enter code (e.g. ISLAND10)"
                    className="flex-1 bg-ivory border border-stone px-4 py-2.5 text-sm uppercase focus:outline-none focus:border-deepGreen"
                  />
                  {promoInput && (
                    <button
                      type="button"
                      onClick={() => setPromoInput('')}
                      className="px-4 py-2.5 text-xs uppercase tracking-wider border border-stone text-charcoal/70 hover:text-charcoal"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Quick Demo Promo Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] text-charcoal/60 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-bronze" /> Demo Codes:
                  </span>
                  {promoCodes
                    .filter((p) => p.active)
                    .map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleApplyPromoPill(p.code)}
                        className={`text-[11px] px-2.5 py-1 border transition-colors ${
                          priceBreakdown.promoCodeApplied === p.code
                            ? 'bg-deepGreen text-ivory border-deepGreen'
                            : 'bg-ivory text-charcoal border-stone hover:border-bronze'
                        }`}
                      >
                        {p.code} ({p.discountType === 'percentage' ? `${p.discountValue}% Off` : formatIdr(p.discountValue, true)} • {p.minNights}+ nights)
                      </button>
                    ))}
                </div>
              </div>

              {/* Full vs Deposit Toggle */}
              <div className="pt-4 border-t border-stone/60 space-y-3">
                <p className="text-xs uppercase tracking-wider text-charcoal/75">
                  Simulated Payment Schedule
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentChoice('full')}
                    className={`p-4 border text-left transition-all ${
                      paymentChoice === 'full'
                        ? 'bg-deepGreen/10 border-deepGreen'
                        : 'bg-ivory border-stone'
                    }`}
                  >
                    <p className="text-xs uppercase tracking-wider font-medium text-charcoal">
                      Full Stay Settlement (100%)
                    </p>
                    <p className="font-serif text-xl text-deepGreen mt-1">
                      {formatIdr(priceBreakdown.grandTotal)}
                    </p>
                    <p className="text-[11px] text-charcoal/65 mt-1">
                      Complete simulated settlement at checkout.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentChoice('deposit')}
                    className={`p-4 border text-left transition-all ${
                      paymentChoice === 'deposit'
                        ? 'bg-deepGreen/10 border-deepGreen'
                        : 'bg-ivory border-stone'
                    }`}
                  >
                    <p className="text-xs uppercase tracking-wider font-medium text-charcoal">
                      {settings.depositPercentage}% Sanctuary Deposit
                    </p>
                    <p className="font-serif text-xl text-deepGreen mt-1">
                      {formatIdr(priceBreakdown.depositRequired)}
                    </p>
                    <p className="text-[11px] text-charcoal/65 mt-1">
                      Remaining balance settled upon arrival in Bali.
                    </p>
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Right 5 Columns: Live Itemized Booking Summary */}
          <aside className="lg:col-span-5 lg:sticky lg:top-28 bg-white border border-stone shadow-editorial overflow-hidden">
            <div className="relative h-52 border-b border-stone">
              <SafeImage
                src={selectedVilla.images[0]?.url}
                fallbackSrc={selectedVilla.images[0]?.fallbackUrl}
                alt={selectedVilla.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent flex flex-col justify-end p-5 text-ivory">
                <span className="text-[10px] uppercase tracking-[0.2em] text-sand">
                  {selectedVilla.location}, Bali
                </span>
                <h3 className="font-serif text-2xl">{selectedVilla.name}</h3>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Dates & Guests */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-stone text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-charcoal/60 block">
                    Check-In
                  </span>
                  <span className="font-medium text-charcoal">
                    {formatDisplayDate(checkIn)}
                  </span>
                  <span className="block text-[11px] text-charcoal/60">
                    From {selectedVilla.checkInTime}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-charcoal/60 block">
                    Check-Out
                  </span>
                  <span className="font-medium text-charcoal">
                    {formatDisplayDate(checkOut)}
                  </span>
                  <span className="block text-[11px] text-charcoal/60">
                    Until {selectedVilla.checkOutTime}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-charcoal/60 block">
                    Duration
                  </span>
                  <span className="font-medium text-charcoal">{priceBreakdown.nights} Nights</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-charcoal/60 block">
                    Registered Guests
                  </span>
                  <span className="font-medium text-charcoal">
                    {guests} {guests === 1 ? 'Guest' : 'Guests'}
                  </span>
                </div>
              </div>

              {/* Nightly Rate Breakdown */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-charcoal">
                  <span className="font-medium">
                    Accommodation ({priceBreakdown.nights} nights)
                  </span>
                  <span>{formatIdr(priceBreakdown.accommodationSubtotal)}</span>
                </div>

                {/* Expandable nightly detail list */}
                {priceBreakdown.nightlyRates.length > 0 && (
                  <div className="pl-3 border-l-2 border-stone/60 space-y-1 py-1 max-h-32 overflow-y-auto">
                    {priceBreakdown.nightlyRates.map((nr) => (
                      <div
                        key={nr.date}
                        className="flex justify-between text-[11px] text-charcoal/70"
                      >
                        <span>
                          {formatDisplayDate(nr.date, 'EEE, dd MMM')}
                          {nr.seasonalLabel
                            ? ` (${nr.seasonalLabel})`
                            : nr.isWeekend
                            ? ' (Weekend)'
                            : ''}
                        </span>
                        <span>{formatIdr(nr.rate)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {priceBreakdown.extraGuestTotal > 0 && (
                  <div className="flex justify-between text-charcoal/80">
                    <span>Extra Guest Supplement</span>
                    <span>{formatIdr(priceBreakdown.extraGuestTotal)}</span>
                  </div>
                )}

                {draftBooking.selectedExtras.map((extra) => (
                  <div key={extra.experienceId} className="flex justify-between text-charcoal/80">
                    <span>
                      {extra.title} × {extra.quantity}
                    </span>
                    <span>{formatIdr(extra.priceIdr * extra.quantity)}</span>
                  </div>
                ))}

                {priceBreakdown.promoDiscount > 0 && (
                  <div className="flex justify-between text-deepGreen font-medium">
                    <span>Promo Privilege ({priceBreakdown.promoCodeApplied})</span>
                    <span>- {formatIdr(priceBreakdown.promoDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-charcoal/70 pt-2 border-t border-stone/50">
                  <span>Hospitality Service Charge ({settings.serviceFeePercentage}%)</span>
                  <span>{formatIdr(priceBreakdown.serviceFeeAmount)}</span>
                </div>

                <div className="flex justify-between text-charcoal/70">
                  <span>Government Tax ({settings.taxPercentage}%)</span>
                  <span>{formatIdr(priceBreakdown.taxAmount)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-stone space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs uppercase tracking-widest text-charcoal/75 font-medium">
                    Total Stay Amount
                  </span>
                  <span className="font-serif text-3xl text-charcoal font-medium">
                    {formatIdr(priceBreakdown.grandTotal)}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-sand/45 px-3.5 py-2.5 border border-stone text-xs">
                  <span className="font-medium text-charcoal">
                    Due at Simulated Checkout ({paymentChoice === 'full' ? '100%' : `${settings.depositPercentage}% Deposit`})
                  </span>
                  <span className="font-serif text-lg font-medium text-deepGreen">
                    {formatIdr(
                      paymentChoice === 'full'
                        ? priceBreakdown.grandTotal
                        : priceBreakdown.depositRequired
                    )}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleContinueToCheckout}
                disabled={!availability.available}
                className={`w-full py-4 px-6 text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center gap-2 ${
                  availability.available
                    ? 'bg-deepGreen hover:bg-forestGreen text-ivory'
                    : 'bg-stone text-charcoal/50 cursor-not-allowed'
                }`}
              >
                <span>Continue to Guest Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function BookingPage() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <div className="flex-1 pt-36 pb-24 max-w-7xl mx-auto px-4 text-center font-serif text-2xl text-charcoal/70">
            Preparing Sanctuary Booking Review...
          </div>
        }
      >
        <BookingReviewContent />
      </Suspense>
      <Footer />
    </>
  );
}
