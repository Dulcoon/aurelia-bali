'use client';

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BookingStatusBadge, PaymentStatusBadge } from '@/components/ui/StatusBadge';
import { useApp } from '@/context/AppContext';
import { formatIdr } from '@/lib/format-currency';
import { formatDisplayDate } from '@/lib/date-utils';
import { Booking } from '@/types';
import {
  Search,
  ShieldAlert,
  Calendar,
  MapPin,
  Printer,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

function BookingLookupContent() {
  const searchParams = useSearchParams();
  const { bookings, cancelBooking } = useApp();

  const [referenceInput, setReferenceInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [lookupStatus, setLookupStatus] = useState<
    'idle' | 'loading' | 'found' | 'not-found' | 'invalid'
  >('idle');
  const [matchedBooking, setMatchedBooking] = useState<Booking | null>(null);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  useEffect(() => {
    const qRef = searchParams.get('ref');
    const qEmail = searchParams.get('email');
    if (qRef && qEmail) {
      setReferenceInput(qRef);
      setEmailInput(qEmail);
      const found = bookings.find(
        (b) =>
          b.reference.toUpperCase() === qRef.trim().toUpperCase() &&
          b.guestEmail.toLowerCase() === qEmail.trim().toLowerCase()
      );
      if (found) {
        setMatchedBooking(found);
        setLookupStatus('found');
      }
    }
  }, [searchParams, bookings]);

  // Keep matchedBooking synced if its status changes
  useEffect(() => {
    if (matchedBooking) {
      const updated = bookings.find((b) => b.id === matchedBooking.id);
      if (updated) setMatchedBooking(updated);
    }
  }, [bookings, matchedBooking]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRef = referenceInput.trim().toUpperCase();
    const cleanEmail = emailInput.trim().toLowerCase();

    if (!cleanRef || !cleanEmail || !cleanEmail.includes('@')) {
      setLookupStatus('invalid');
      setMatchedBooking(null);
      return;
    }

    setLookupStatus('loading');
    setTimeout(() => {
      const found = bookings.find(
        (b) =>
          b.reference.toUpperCase() === cleanRef &&
          b.guestEmail.toLowerCase() === cleanEmail
      );
      if (found) {
        setMatchedBooking(found);
        setLookupStatus('found');
      } else {
        setMatchedBooking(null);
        setLookupStatus('not-found');
      }
    }, 350);
  };

  const quickFillBooking = (b: Booking) => {
    setReferenceInput(b.reference);
    setEmailInput(b.guestEmail);
    setMatchedBooking(b);
    setLookupStatus('found');
  };

  return (
    <main className="flex-1 pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-bronze">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Prototype Reservation Lookup • Local Browser State</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-charcoal">
            Manage Your Sanctuary Reservation
          </h1>
          <p className="text-sm text-charcoal/75 max-w-2xl leading-relaxed">
            Enter your reservation reference (e.g., <strong>AUR-2026-0001</strong>) and registered email address to inspect your stay itinerary. Note: This is a frontend prototype lookup and not a production identity verification system.
          </p>
        </div>

        {/* Quick Demo Lookup Pills */}
        <div className="bg-sand/45 border border-stone p-4 space-y-2.5">
          <p className="text-xs uppercase tracking-wider text-charcoal/75 flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-bronze" />
            One-Click Demo Reservations (Seeded & Session Bookings):
          </p>
          <div className="flex flex-wrap gap-2">
            {bookings.slice(0, 4).map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => quickFillBooking(b)}
                className="text-xs bg-ivory hover:bg-deepGreen hover:text-ivory border border-stone px-3 py-1.5 transition-colors text-left"
              >
                <strong>{b.reference}</strong> • {b.guestEmail} ({b.villaName})
              </button>
            ))}
          </div>
        </div>

        {/* Lookup Form */}
        <form
          onSubmit={handleLookup}
          className="bg-white/85 border border-stone p-6 sm:p-8 shadow-subtle grid grid-cols-1 sm:grid-cols-12 gap-4 items-end"
        >
          <div className="sm:col-span-5">
            <label
              htmlFor="lookup-ref"
              className="block text-xs uppercase tracking-wider text-charcoal/80 mb-2"
            >
              Booking Reference *
            </label>
            <input
              id="lookup-ref"
              type="text"
              value={referenceInput}
              onChange={(e) => setReferenceInput(e.target.value.toUpperCase())}
              placeholder="AUR-2026-0001"
              className="w-full bg-ivory border border-stone px-4 py-3 text-sm uppercase focus:outline-none focus:border-deepGreen"
            />
          </div>

          <div className="sm:col-span-5">
            <label
              htmlFor="lookup-email"
              className="block text-xs uppercase tracking-wider text-charcoal/80 mb-2"
            >
              Guest Email Address *
            </label>
            <input
              id="lookup-email"
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="elena.rostova@example.com"
              className="w-full bg-ivory border border-stone px-4 py-3 text-sm focus:outline-none focus:border-deepGreen"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full bg-deepGreen hover:bg-forestGreen text-ivory text-xs uppercase tracking-[0.18em] py-3.5 px-4 font-medium flex items-center justify-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Find</span>
            </button>
          </div>
        </form>

        {/* States */}
        {lookupStatus === 'loading' && (
          <div className="bg-white/75 border border-stone p-10 text-center text-sm text-charcoal/70">
            Searching prototype reservations...
          </div>
        )}

        {lookupStatus === 'invalid' && (
          <div className="bg-amber-900/10 border border-amber-800/30 p-5 text-xs text-amber-900 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>
              Please provide both a valid booking reference (such as AUR-2026-0001) and email address.
            </span>
          </div>
        )}

        {lookupStatus === 'not-found' && (
          <div className="bg-red-900/10 border border-red-800/30 p-6 text-xs text-red-900 space-y-2">
            <p className="font-medium text-sm">No Matching Reservation Found</p>
            <p>
              We could not locate a booking matching reference <strong>{referenceInput}</strong> and email{' '}
              <strong>{emailInput}</strong> in your current browser state. Try clicking one of the demo reservation pills above.
            </p>
          </div>
        )}

        {lookupStatus === 'found' && matchedBooking && (
          <div className="bg-white border border-stone p-6 sm:p-8 shadow-editorial space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone pb-4">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-bronze">
                  Reservation Record Found
                </span>
                <h2 className="font-serif text-3xl text-charcoal mt-0.5">
                  {matchedBooking.reference} — {matchedBooking.villaName}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <BookingStatusBadge status={matchedBooking.status} />
                <PaymentStatusBadge status={matchedBooking.paymentStatus} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-ivory p-5 border border-stone text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-charcoal/60 block">
                  Stay Dates
                </span>
                <span className="font-medium text-charcoal">
                  {formatDisplayDate(matchedBooking.checkIn)} –{' '}
                  {formatDisplayDate(matchedBooking.checkOut)}
                </span>
                <span className="block text-charcoal/65">{matchedBooking.nights} Nights</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-charcoal/60 block">
                  Registered Guest
                </span>
                <span className="font-medium text-charcoal">{matchedBooking.guestName}</span>
                <span className="block text-charcoal/65">{matchedBooking.guests} Guests</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-charcoal/60 block">
                  Total Stay Value
                </span>
                <span className="font-serif text-lg font-medium text-deepGreen">
                  {formatIdr(matchedBooking.totalAmount)}
                </span>
                <span className="block text-charcoal/65">
                  Simulated Paid: {formatIdr(matchedBooking.amountSimulatedPaid)}
                </span>
              </div>
            </div>

            {matchedBooking.specialRequests && (
              <div className="text-xs text-charcoal/80 bg-sand/30 p-4 border border-stone">
                <strong>Special Requests:</strong> {matchedBooking.specialRequests}
              </div>
            )}

            <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Link
                  href={`/booking/confirmation?ref=${matchedBooking.reference}`}
                  className="bg-deepGreen text-ivory text-xs uppercase tracking-[0.16em] px-5 py-3 hover:bg-forestGreen transition-colors inline-flex items-center gap-2"
                >
                  <Printer className="w-3.5 h-3.5" />
                  View Printable Folio
                </Link>
                <Link
                  href={`/villas/${matchedBooking.villaSlug}`}
                  className="border border-stone text-charcoal text-xs uppercase tracking-[0.16em] px-4 py-3 hover:border-bronze"
                >
                  View Villa Page
                </Link>
              </div>

              {matchedBooking.status !== 'cancelled' && (
                <div>
                  {confirmCancelOpen ? (
                    <div className="flex items-center gap-2 bg-red-900/10 border border-red-800/30 p-2">
                      <span className="text-xs text-red-900 px-2">Cancel this demo booking?</span>
                      <button
                        type="button"
                        onClick={() => {
                          cancelBooking(matchedBooking.id, 'Cancelled by guest via Lookup page');
                          setConfirmCancelOpen(false);
                        }}
                        className="bg-red-800 text-white text-xs uppercase px-3 py-1.5"
                      >
                        Confirm Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmCancelOpen(false)}
                        className="text-xs px-2 py-1 text-charcoal"
                      >
                        Keep Stay
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmCancelOpen(true)}
                      className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-red-800 hover:underline"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel Reservation (Demo)
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function BookingLookupPage() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <div className="flex-1 pt-36 pb-24 max-w-4xl mx-auto px-4 text-center font-serif text-2xl">
            Loading Reservation Lookup...
          </div>
        }
      >
        <BookingLookupContent />
      </Suspense>
      <Footer />
    </>
  );
}
