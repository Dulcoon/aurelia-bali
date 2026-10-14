'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SafeImage } from '@/components/ui/SafeImage';
import { useApp } from '@/context/AppContext';
import { calculateStayPrice } from '@/lib/pricing';
import { checkVillaAvailability } from '@/lib/availability';
import { formatIdr } from '@/lib/format-currency';
import { formatDisplayDate, getFutureIso } from '@/lib/date-utils';
import { PaymentMethod } from '@/types';
import {
  CreditCard,
  Building2,
  Smartphone,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Lock,
  Sparkles,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
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
    createBooking,
    showToast,
  } = useApp();

  const villa =
    villas.find((v) => v.id === draftBooking.villaId) || villas[0];
  const checkIn = draftBooking.checkIn || getFutureIso(8);
  const checkOut = draftBooking.checkOut || getFutureIso(11);
  const guests = draftBooking.guests || 2;

  // Guest Form State
  const [guestName, setGuestName] = useState(draftBooking.guestName || '');
  const [guestEmail, setGuestEmail] = useState(draftBooking.guestEmail || '');
  const [guestPhone, setGuestPhone] = useState(draftBooking.guestPhone || '');
  const [guestCountry, setGuestCountry] = useState(draftBooking.guestCountry || 'Singapore');
  const [arrivalTime, setArrivalTime] = useState(draftBooking.arrivalTime || '15:00');
  const [specialRequests, setSpecialRequests] = useState(draftBooking.specialRequests || '');

  // Validation errors
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulatedErrorBanner, setSimulatedErrorBanner] = useState<string | null>(null);

  const priceBreakdown = calculateStayPrice({
    villa,
    checkIn,
    checkOut,
    guests,
    selectedExtras: draftBooking.selectedExtras,
    promoCodeInput: draftBooking.promoCode,
    seasonalRules,
    dateOverrides,
    promoCodes,
    settings,
  });

  const availability = checkVillaAvailability({
    villa,
    checkIn,
    checkOut,
    guests,
    bookings,
    blockedDates,
  });

  const validateGuestForm = (): boolean => {
    const nextErrors: { name?: string; email?: string; phone?: string } = {};
    if (!guestName.trim() || guestName.trim().length < 2) {
      nextErrors.name = 'Please enter the primary guest’s full name.';
    }
    if (!guestEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail.trim())) {
      nextErrors.email = 'Please enter a valid email address for reservation confirmation.';
    }
    if (!guestPhone.trim() || guestPhone.trim().length < 6) {
      nextErrors.phone = 'Please provide a contact telephone or WhatsApp number.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const fillDemoGuestProfile = () => {
    setGuestName('Alistair & Camille Beaumont');
    setGuestEmail('camille.beaumont@example.com');
    setGuestPhone('+33 6 42 88 19 04');
    setGuestCountry('France');
    setArrivalTime('15:30');
    setSpecialRequests('Chilled young coconuts on arrival; organic cotton crib not required.');
    setErrors({});
    showToast('Demo Guest Profile Filled', 'Sample guest details populated for fast checkout testing.', 'info');
  };

  const handleSimulateSuccessfulPayment = () => {
    setSimulatedErrorBanner(null);
    if (!validateGuestForm()) {
      showToast('Guest Details Required', 'Please complete the highlighted guest fields.', 'warning');
      return;
    }

    if (!availability.available) {
      setSimulatedErrorBanner(
        availability.reason || 'Selected dates are no longer available.'
      );
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const amountDueNow =
        draftBooking.paymentChoice === 'deposit'
          ? priceBreakdown.depositRequired
          : priceBreakdown.grandTotal;

      const created = createBooking({
        villaId: villa.id,
        villaName: villa.name,
        villaSlug: villa.slug,
        villaLocation: villa.location,
        checkIn,
        checkOut,
        nights: priceBreakdown.nights,
        guests,
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim(),
        guestCountry: guestCountry.trim(),
        arrivalTime,
        specialRequests: specialRequests.trim(),
        nightlySubtotal: priceBreakdown.accommodationSubtotal + priceBreakdown.extraGuestTotal,
        extrasTotal: priceBreakdown.extrasSubtotal,
        selectedExtras: draftBooking.selectedExtras,
        discountAmount: priceBreakdown.promoDiscount,
        promoCodeUsed: priceBreakdown.promoCodeApplied,
        serviceFeeAmount: priceBreakdown.serviceFeeAmount,
        taxAmount: priceBreakdown.taxAmount,
        totalAmount: priceBreakdown.grandTotal,
        depositAmount: priceBreakdown.depositRequired,
        paymentChoice: draftBooking.paymentChoice,
        amountSimulatedPaid: amountDueNow,
        status: 'confirmed',
        paymentStatus:
          draftBooking.paymentChoice === 'deposit' ? 'deposit_simulated' : 'paid_simulated',
        paymentMethod,
        internalNotes: 'Created via public website simulated checkout.',
      });

      updateDraftBooking({
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim(),
        guestCountry: guestCountry.trim(),
        arrivalTime,
        specialRequests: specialRequests.trim(),
      });

      setIsProcessing(false);
      router.push(`/booking/confirmation?ref=${created.reference}`);
    }, 650);
  };

  const handleSimulateFailedPayment = () => {
    setSimulatedErrorBanner(
      'Simulated Payment Declined: The demonstration gateway simulated an issuer authorization decline. No reservation was created—click "Simulate Successful Payment" to complete your mock booking.'
    );
    showToast('Simulated Payment Declined', 'Demonstration failure state triggered.', 'error');
  };

  const amountDueNow =
    draftBooking.paymentChoice === 'deposit'
      ? priceBreakdown.depositRequired
      : priceBreakdown.grandTotal;

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10 border-b border-stone pb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <Link
                href="/booking"
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-bronze hover:text-charcoal mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Stay Review
              </Link>
              <h1 className="font-serif text-3xl sm:text-5xl text-charcoal">
                Guest Details & Simulated Checkout
              </h1>
            </div>

            <button
              type="button"
              onClick={fillDemoGuestProfile}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider px-4 py-2.5 bg-sand/60 border border-stone text-charcoal hover:border-bronze"
            >
              <Sparkles className="w-3.5 h-3.5 text-bronze" />
              Auto-Fill Sample Guest Details
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left 7 Columns: Guest Form & Simulated Payment Method */}
            <div className="lg:col-span-7 space-y-10">
              {/* Step 3: Guest Details */}
              <section className="bg-white/85 border border-stone p-6 sm:p-8 space-y-6">
                <h2 className="font-serif text-2xl text-charcoal border-b border-stone pb-3">
                  1. Primary Guest Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="guest-name"
                      className="block text-xs uppercase tracking-wider text-charcoal/80 mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      id="guest-name"
                      type="text"
                      value={guestName}
                      onChange={(e) => {
                        setGuestName(e.target.value);
                        if (errors.name) setErrors({ ...errors, name: undefined });
                      }}
                      placeholder="e.g., Alistair Beaumont"
                      className={`w-full bg-ivory border px-4 py-3 text-sm focus:outline-none ${
                        errors.name ? 'border-red-700' : 'border-stone focus:border-deepGreen'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-700 mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="guest-email"
                      className="block text-xs uppercase tracking-wider text-charcoal/80 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      id="guest-email"
                      type="email"
                      value={guestEmail}
                      onChange={(e) => {
                        setGuestEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: undefined });
                      }}
                      placeholder="guest@example.com"
                      className={`w-full bg-ivory border px-4 py-3 text-sm focus:outline-none ${
                        errors.email ? 'border-red-700' : 'border-stone focus:border-deepGreen'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-700 mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="guest-phone"
                      className="block text-xs uppercase tracking-wider text-charcoal/80 mb-2"
                    >
                      Telephone / WhatsApp *
                    </label>
                    <input
                      id="guest-phone"
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => {
                        setGuestPhone(e.target.value);
                        if (errors.phone) setErrors({ ...errors, phone: undefined });
                      }}
                      placeholder="+62 811 3900 ..."
                      className={`w-full bg-ivory border px-4 py-3 text-sm focus:outline-none ${
                        errors.phone ? 'border-red-700' : 'border-stone focus:border-deepGreen'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-700 mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="guest-country"
                      className="block text-xs uppercase tracking-wider text-charcoal/80 mb-2"
                    >
                      Country / Region of Residence
                    </label>
                    <input
                      id="guest-country"
                      type="text"
                      value={guestCountry}
                      onChange={(e) => setGuestCountry(e.target.value)}
                      className="w-full bg-ivory border border-stone px-4 py-3 text-sm focus:outline-none focus:border-deepGreen"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="guest-arrival"
                      className="block text-xs uppercase tracking-wider text-charcoal/80 mb-2"
                    >
                      Estimated Arrival Time (WITA)
                    </label>
                    <select
                      id="guest-arrival"
                      value={arrivalTime}
                      onChange={(e) => setArrivalTime(e.target.value)}
                      className="w-full bg-ivory border border-stone px-4 py-3 text-sm focus:outline-none focus:border-deepGreen"
                    >
                      <option value="14:00">14:00 – 15:00</option>
                      <option value="15:30">15:00 – 17:00</option>
                      <option value="18:00">17:00 – 19:00</option>
                      <option value="20:00">After 19:00 (Evening Check-in)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="guest-requests"
                      className="block text-xs uppercase tracking-wider text-charcoal/80 mb-2"
                    >
                      Special Requests & Dietary Notes
                    </label>
                    <textarea
                      id="guest-requests"
                      rows={3}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Airport chauffeur pickup details, dietary preferences, or celebration notes..."
                      className="w-full bg-ivory border border-stone px-4 py-3 text-sm focus:outline-none focus:border-deepGreen"
                    />
                  </div>
                </div>
              </section>

              {/* Step 4: Simulated Payment Experience */}
              <section className="bg-white/85 border border-stone p-6 sm:p-8 space-y-6">
                <div className="border-b border-stone pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-2xl text-charcoal">
                      2. Simulated Payment Method
                    </h2>
                    <p className="text-xs text-charcoal/65 mt-0.5">
                      Frontend-only prototype — no real card numbers, CVVs, or banking credentials are collected.
                    </p>
                  </div>
                  <Lock className="w-5 h-5 text-deepGreen shrink-0" />
                </div>

                {/* Method Tabs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border text-left flex items-center gap-3 transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-deepGreen text-ivory border-deepGreen'
                        : 'bg-ivory text-charcoal border-stone hover:border-bronze'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider">
                        Credit / Debit Card
                      </p>
                      <p className="text-[10px] opacity-75">Visa • Mastercard • Amex</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-4 border text-left flex items-center gap-3 transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'bg-deepGreen text-ivory border-deepGreen'
                        : 'bg-ivory text-charcoal border-stone hover:border-bronze'
                    }`}
                  >
                    <Building2 className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider">
                        Bank Transfer
                      </p>
                      <p className="text-[10px] opacity-75">BCA • Mandiri Virtual Account</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ewallet')}
                    className={`p-4 border text-left flex items-center gap-3 transition-all ${
                      paymentMethod === 'ewallet'
                        ? 'bg-deepGreen text-ivory border-deepGreen'
                        : 'bg-ivory text-charcoal border-stone hover:border-bronze'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider">
                        E-Wallet / QRIS
                      </p>
                      <p className="text-[10px] opacity-75">QRIS • GoPay • OVO</p>
                    </div>
                  </button>
                </div>

                {/* Simulated Method Preview Box */}
                <div className="bg-sand/40 border border-stone p-5 space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-bronze font-medium uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>Sandbox Payment Simulation Notice</span>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-2 text-charcoal/80">
                      <p>
                        <strong>Simulated Card Token:</strong> •••• •••• •••• 4242 (Demo Visa Infinite)
                      </p>
                      <p>
                        For security and privacy, this prototype does not accept real card numbers or CVV inputs. Use the simulation controls below to test successful or declined payment outcomes.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'bank_transfer' && (
                    <div className="space-y-2 text-charcoal/80">
                      <p>
                        <strong>Simulated BCA Virtual Account:</strong> 88012 • 0361 • 2026 (Demo Estate Escrow)
                      </p>
                      <p>
                        Clicking &ldquo;Simulate Successful Payment&rdquo; immediately verifies the simulated bank transfer and issues your reservation reference.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'ewallet' && (
                    <div className="space-y-2 text-charcoal/80">
                      <p>
                        <strong>Simulated QRIS / GoPay Merchant ID:</strong> AURELIA-BALI-SANCTUARY-DEMO
                      </p>
                      <p>
                        Clicking &ldquo;Simulate Successful Payment&rdquo; emulates an instant mobile wallet callback.
                      </p>
                    </div>
                  )}
                </div>

                {/* Simulated Error Banner if triggered */}
                {simulatedErrorBanner && (
                  <div className="bg-red-900/10 border border-red-800/30 p-4 text-xs text-red-900 flex items-start gap-3">
                    <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Simulated Payment Error</p>
                      <p className="mt-1 leading-relaxed">{simulatedErrorBanner}</p>
                    </div>
                  </div>
                )}

                {/* Simulation Action Buttons */}
                <div className="pt-2 space-y-3">
                  <button
                    type="button"
                    onClick={handleSimulateSuccessfulPayment}
                    disabled={isProcessing}
                    className="w-full bg-deepGreen hover:bg-forestGreen text-ivory py-4 px-6 text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {isProcessing
                        ? 'Confirming Simulated Reservation...'
                        : `Simulate Successful Payment (${formatIdr(amountDueNow)})`}
                    </span>
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleSimulateFailedPayment}
                      className="w-full border border-red-800/30 bg-red-900/5 hover:bg-red-900/10 text-red-900 py-3 px-4 text-xs uppercase tracking-wider transition-colors"
                    >
                      Simulate Declined Payment
                    </button>
                    <Link
                      href="/booking"
                      className="w-full border border-stone hover:border-charcoal text-charcoal py-3 px-4 text-xs uppercase tracking-wider text-center transition-colors"
                    >
                      Cancel & Return to Review
                    </Link>
                  </div>
                </div>
              </section>
            </div>

            {/* Right 5 Columns: Order Summary */}
            <aside className="lg:col-span-5 lg:sticky lg:top-28 bg-white border border-stone p-6 sm:p-8 shadow-editorial space-y-6">
              <h3 className="font-serif text-2xl text-charcoal border-b border-stone pb-3">
                Reservation Summary
              </h3>

              <div className="flex gap-4 items-center">
                <div className="relative w-24 h-20 border border-stone shrink-0 overflow-hidden">
                  <SafeImage
                    src={villa.images[0]?.url}
                    fallbackSrc={villa.images[0]?.fallbackUrl}
                    alt={villa.name}
                  />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-bronze">
                    {villa.location}, Bali
                  </p>
                  <h4 className="font-serif text-xl text-charcoal">{villa.name}</h4>
                  <p className="text-xs text-charcoal/70">
                    {priceBreakdown.nights} Nights • {guests} Guests
                  </p>
                </div>
              </div>

              <div className="bg-ivory p-4 border border-stone text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-charcoal/65">Check-In:</span>
                  <span className="font-medium">{formatDisplayDate(checkIn)} ({villa.checkInTime})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/65">Check-Out:</span>
                  <span className="font-medium">{formatDisplayDate(checkOut)} ({villa.checkOutTime})</span>
                </div>
              </div>

              <div className="space-y-2 text-xs border-t border-stone pt-4">
                <div className="flex justify-between">
                  <span className="text-charcoal/75">Accommodation ({priceBreakdown.nights} nights)</span>
                  <span>{formatIdr(priceBreakdown.accommodationSubtotal)}</span>
                </div>
                {priceBreakdown.extraGuestTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-charcoal/75">Extra Guest Fee</span>
                    <span>{formatIdr(priceBreakdown.extraGuestTotal)}</span>
                  </div>
                )}
                {draftBooking.selectedExtras.map((ex) => (
                  <div key={ex.experienceId} className="flex justify-between">
                    <span className="text-charcoal/75">
                      {ex.title} × {ex.quantity}
                    </span>
                    <span>{formatIdr(ex.priceIdr * ex.quantity)}</span>
                  </div>
                ))}
                {priceBreakdown.promoDiscount > 0 && (
                  <div className="flex justify-between text-deepGreen font-medium">
                    <span>Promo ({priceBreakdown.promoCodeApplied})</span>
                    <span>- {formatIdr(priceBreakdown.promoDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-charcoal/70">
                  <span>Service Charge ({settings.serviceFeePercentage}%)</span>
                  <span>{formatIdr(priceBreakdown.serviceFeeAmount)}</span>
                </div>
                <div className="flex justify-between text-charcoal/70">
                  <span>Government Tax ({settings.taxPercentage}%)</span>
                  <span>{formatIdr(priceBreakdown.taxAmount)}</span>
                </div>

                <div className="pt-3 border-t border-stone flex justify-between items-baseline text-sm font-medium">
                  <span>Total Stay Value</span>
                  <span className="font-serif text-2xl">{formatIdr(priceBreakdown.grandTotal)}</span>
                </div>

                <div className="flex justify-between items-center bg-deepGreen/10 border border-deepGreen/30 p-3 text-deepGreen font-medium">
                  <span>Simulated Settlement Now</span>
                  <span>{formatIdr(amountDueNow)}</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
