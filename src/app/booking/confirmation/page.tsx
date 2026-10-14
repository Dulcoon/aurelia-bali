'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BookingStatusBadge, PaymentStatusBadge } from '@/components/ui/StatusBadge';
import { useApp } from '@/context/AppContext';
import { formatIdr } from '@/lib/format-currency';
import { formatDisplayDate } from '@/lib/date-utils';
import {
  CheckCircle2,
  Printer,
  Compass,
  ShieldCheck,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Sparkles,
} from 'lucide-react';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const refParam = searchParams.get('ref');
  const { bookings, lastConfirmedBooking, settings } = useApp();

  const booking =
    (refParam ? bookings.find((b) => b.reference === refParam) : null) ||
    lastConfirmedBooking ||
    bookings[0];

  if (!booking) {
    return (
      <main className="flex-1 pt-36 pb-24 max-w-xl mx-auto px-4 text-center space-y-4">
        <h1 className="font-serif text-3xl">No Recent Reservation Found</h1>
        <Link
          href="/booking"
          className="inline-block bg-deepGreen text-ivory text-xs uppercase tracking-widest px-6 py-3"
        >
          Start a New Booking
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Confirmation Banner */}
        <div className="bg-deepGreen text-ivory p-8 sm:p-10 border border-stone shadow-editorial space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-sand">
              <CheckCircle2 className="w-4 h-4 text-bronze" />
              <span>Simulated Reservation Confirmed</span>
            </div>
            <span className="text-xs bg-ivory/10 border border-ivory/20 px-3 py-1 text-sand">
              Stored in Local Browser State & Admin Dashboard
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl">
            We Awaits Your Arrival at {booking.villaName}.
          </h1>

          <p className="text-sm text-sand/85 max-w-2xl leading-relaxed">
            Thank you, <strong>{booking.guestName}</strong>. Your demonstration booking has been recorded under reference{' '}
            <strong className="text-white underline underline-offset-4">{booking.reference}</strong>. You can now inspect or manage this reservation in the Lookup tool or the Admin Dashboard.
          </p>
        </div>

        {/* Printable Folio Card */}
        <div className="bg-white border border-stone p-6 sm:p-10 shadow-subtle space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone pb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-bronze">
                {settings.brandName} • Official Reservation Folio (Demo)
              </p>
              <p className="font-serif text-3xl text-charcoal mt-1">
                Reference: {booking.reference}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <BookingStatusBadge status={booking.status} />
              <PaymentStatusBadge status={booking.paymentStatus} />
            </div>
          </div>

          {/* Stay & Guest Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
            <div className="space-y-3">
              <h2 className="uppercase tracking-[0.18em] text-bronze font-medium">
                Sanctuary & Stay Schedule
              </h2>
              <div className="bg-ivory p-4 border border-stone space-y-2">
                <p className="font-serif text-xl text-charcoal">{booking.villaName}</p>
                <p className="text-charcoal/70 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-bronze" />
                  {booking.villaLocation}, Bali
                </p>
                <div className="pt-2 border-t border-stone/60 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] uppercase text-charcoal/60 block">Check-In</span>
                    <span className="font-medium text-charcoal">
                      {formatDisplayDate(booking.checkIn)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-charcoal/60 block">Check-Out</span>
                    <span className="font-medium text-charcoal">
                      {formatDisplayDate(booking.checkOut)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-charcoal/60 block">Duration</span>
                    <span className="font-medium text-charcoal">{booking.nights} Nights</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-charcoal/60 block">Party Size</span>
                    <span className="font-medium text-charcoal">{booking.guests} Guests</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="uppercase tracking-[0.18em] text-bronze font-medium">
                Registered Guest Details
              </h2>
              <div className="bg-ivory p-4 border border-stone space-y-2">
                <p className="font-serif text-xl text-charcoal">{booking.guestName}</p>
                <p className="text-charcoal/75 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-bronze" />
                  {booking.guestEmail}
                </p>
                <p className="text-charcoal/75 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-bronze" />
                  {booking.guestPhone}
                </p>
                {booking.arrivalTime && (
                  <p className="text-charcoal/70 pt-1">
                    <strong>Estimated Arrival:</strong> {booking.arrivalTime} WITA
                  </p>
                )}
                {booking.specialRequests && (
                  <p className="text-charcoal/70 pt-1">
                    <strong>Special Notes:</strong> {booking.specialRequests}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="border-t border-stone pt-6 space-y-3 text-xs">
            <h2 className="uppercase tracking-[0.18em] text-bronze font-medium">
              Simulated Financial Breakdown
            </h2>
            <div className="bg-ivory p-5 border border-stone space-y-2">
              <div className="flex justify-between">
                <span>Accommodation ({booking.nights} nights)</span>
                <span>{formatIdr(booking.nightlySubtotal)}</span>
              </div>
              {booking.selectedExtras.map((extra) => (
                <div key={extra.experienceId} className="flex justify-between text-charcoal/80">
                  <span>
                    {extra.title} × {extra.quantity}
                  </span>
                  <span>{formatIdr(extra.priceIdr * extra.quantity)}</span>
                </div>
              ))}
              {booking.discountAmount > 0 && (
                <div className="flex justify-between text-deepGreen font-medium">
                  <span>Promotional Discount ({booking.promoCodeUsed})</span>
                  <span>- {formatIdr(booking.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-charcoal/70">
                <span>Hospitality Service Fee</span>
                <span>{formatIdr(booking.serviceFeeAmount)}</span>
              </div>
              <div className="flex justify-between text-charcoal/70">
                <span>Government Tax</span>
                <span>{formatIdr(booking.taxAmount)}</span>
              </div>
              <div className="pt-3 border-t border-stone flex justify-between items-baseline text-sm font-medium">
                <span>Total Reservation Value</span>
                <span className="font-serif text-2xl">{formatIdr(booking.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-deepGreen font-medium pt-1">
                <span>Simulated Payment Recorded ({booking.paymentMethod.toUpperCase()})</span>
                <span>{formatIdr(booking.amountSimulatedPaid)}</span>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 no-print">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 border border-charcoal/30 hover:border-deepGreen text-charcoal text-xs uppercase tracking-[0.18em] px-5 py-3 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print Confirmation Summary
            </button>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/booking/lookup?ref=${booking.reference}&email=${encodeURIComponent(
                  booking.guestEmail
                )}`}
                className="inline-flex items-center gap-2 border border-stone bg-sand/50 hover:border-bronze text-charcoal text-xs uppercase tracking-[0.16em] px-5 py-3 transition-colors"
              >
                <Compass className="w-4 h-4 text-bronze" />
                Lookup This Stay
              </Link>
              <Link
                href={`/admin/bookings/${booking.id}`}
                className="inline-flex items-center gap-2 bg-deepGreen hover:bg-forestGreen text-ivory text-xs uppercase tracking-[0.16em] px-5 py-3 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                View in Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function BookingConfirmationPage() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <div className="flex-1 pt-36 pb-24 max-w-4xl mx-auto px-4 text-center font-serif text-2xl">
            Loading Confirmation Folio...
          </div>
        }
      >
        <ConfirmationContent />
      </Suspense>
      <Footer />
    </>
  );
}
