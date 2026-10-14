'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { BookingStatusBadge, PaymentStatusBadge } from '@/components/ui/StatusBadge';
import { useApp } from '@/context/AppContext';
import { formatIdr } from '@/lib/format-currency';
import { formatDisplayDate } from '@/lib/date-utils';
import { BookingStatus, PaymentStatus } from '@/types';
import {
  ArrowLeft,
  Save,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldAlert,
} from 'lucide-react';

export default function AdminBookingDetailPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const {
    bookings,
    updateBookingStatus,
    updateBookingPaymentStatus,
    updateBookingNotes,
    cancelBooking,
  } = useApp();

  const booking = bookings.find((b) => b.id === id || b.reference === id);
  const [notes, setNotes] = useState(booking?.internalNotes || '');
  const [confirmCancel, setConfirmCancel] = useState(false);

  useEffect(() => {
    if (booking) setNotes(booking.internalNotes || '');
  }, [booking]);

  if (!booking) {
    return (
      <AdminShell
        title="Booking Not Found"
        breadcrumbs={[{ label: 'Bookings', href: '/admin/bookings' }, { label: 'Not Found' }]}
      >
        <div className="bg-white border border-stone p-8 text-center space-y-4">
          <p className="text-sm text-charcoal/75">No reservation record matches ID &ldquo;{id}&rdquo;.</p>
          <Link
            href="/admin/bookings"
            className="inline-block bg-deepGreen text-ivory text-xs uppercase tracking-widest px-5 py-2.5"
          >
            Back to Bookings
          </Link>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title={`Reservation ${booking.reference}`}
      subtitle={`Created on ${formatDisplayDate(booking.createdAt)} • ${booking.villaName}`}
      breadcrumbs={[
        { label: 'Bookings', href: '/admin/bookings' },
        { label: booking.reference },
      ]}
      actions={
        <Link
          href="/admin/bookings"
          className="border border-stone bg-white px-4 py-2 text-xs uppercase tracking-wider inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> All Bookings
        </Link>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Stay, Guest & Financial Folio */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-stone p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-bronze">
                  Sanctuary Stay Summary
                </span>
                <h2 className="font-serif text-3xl text-charcoal">{booking.villaName}</h2>
              </div>
              <div className="flex items-center gap-2">
                <BookingStatusBadge status={booking.status} />
                <PaymentStatusBadge status={booking.paymentStatus} />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
              <div className="bg-ivory p-3.5 border border-stone">
                <span className="text-[10px] uppercase text-charcoal/60 block">Check-In</span>
                <span className="font-medium text-charcoal">
                  {formatDisplayDate(booking.checkIn)}
                </span>
              </div>
              <div className="bg-ivory p-3.5 border border-stone">
                <span className="text-[10px] uppercase text-charcoal/60 block">Check-Out</span>
                <span className="font-medium text-charcoal">
                  {formatDisplayDate(booking.checkOut)}
                </span>
              </div>
              <div className="bg-ivory p-3.5 border border-stone">
                <span className="text-[10px] uppercase text-charcoal/60 block">Duration</span>
                <span className="font-medium text-charcoal">{booking.nights} Nights</span>
              </div>
              <div className="bg-ivory p-3.5 border border-stone">
                <span className="text-[10px] uppercase text-charcoal/60 block">Party Size</span>
                <span className="font-medium text-charcoal">{booking.guests} Guests</span>
              </div>
            </div>
          </div>

          {/* Guest Information */}
          <div className="bg-white border border-stone p-6 space-y-4 text-xs">
            <h3 className="font-serif text-2xl text-charcoal border-b border-stone pb-3">
              Guest Profile & Special Requests
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase text-charcoal/60">Primary Guest</p>
                <p className="font-serif text-xl text-charcoal mt-0.5">{booking.guestName}</p>
                <p className="text-charcoal/70 mt-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-bronze" /> {booking.guestEmail}
                </p>
                <p className="text-charcoal/70 mt-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-bronze" /> {booking.guestPhone}
                </p>
              </div>
              <div className="bg-ivory p-4 border border-stone space-y-2">
                <p>
                  <strong>Country:</strong> {booking.guestCountry || 'International'}
                </p>
                <p>
                  <strong>Estimated Arrival:</strong> {booking.arrivalTime || '15:00'} WITA
                </p>
                <p>
                  <strong>Special Requests:</strong>{' '}
                  {booking.specialRequests || 'None specified.'}
                </p>
              </div>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="bg-white border border-stone p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone pb-3">
              <h3 className="font-serif text-2xl text-charcoal">
                Simulated Financial Folio
              </h3>
              <span className="inline-flex items-center gap-1 text-[11px] text-bronze">
                <ShieldAlert className="w-3.5 h-3.5" /> Simulated Prototype Ledger
              </span>
            </div>

            <div className="space-y-2 bg-ivory p-5 border border-stone">
              <div className="flex justify-between">
                <span>Accommodation ({booking.nights} nights)</span>
                <span>{formatIdr(booking.nightlySubtotal)}</span>
              </div>
              {booking.selectedExtras.map((ex) => (
                <div key={ex.experienceId} className="flex justify-between text-charcoal/80">
                  <span>
                    {ex.title} × {ex.quantity}
                  </span>
                  <span>{formatIdr(ex.priceIdr * ex.quantity)}</span>
                </div>
              ))}
              {booking.discountAmount > 0 && (
                <div className="flex justify-between text-deepGreen font-medium">
                  <span>Promo Code ({booking.promoCodeUsed})</span>
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
                <span>Total Contracted Booking Value</span>
                <span className="font-serif text-2xl">{formatIdr(booking.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-deepGreen font-medium pt-1">
                <span>Simulated Payment Recorded ({booking.paymentMethod.toUpperCase()})</span>
                <span>{formatIdr(booking.amountSimulatedPaid)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Operational Controls & Notes */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-stone p-6 space-y-5 text-xs">
            <h3 className="font-serif text-2xl text-charcoal border-b border-stone pb-3">
              Operational Controls
            </h3>

            <div>
              <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
                Reservation Status
              </label>
              <select
                value={booking.status}
                onChange={(e) =>
                  updateBookingStatus(booking.id, e.target.value as BookingStatus)
                }
                className="w-full bg-ivory border border-stone px-3.5 py-2.5 text-sm"
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending Review</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
                Simulated Payment Status
              </label>
              <select
                value={booking.paymentStatus}
                onChange={(e) =>
                  updateBookingPaymentStatus(booking.id, e.target.value as PaymentStatus)
                }
                className="w-full bg-ivory border border-stone px-3.5 py-2.5 text-sm"
              >
                <option value="paid_simulated">Simulated Paid (Full)</option>
                <option value="deposit_simulated">Simulated Deposit (50%)</option>
                <option value="pending_simulated">Awaiting Simulated Payment</option>
                <option value="refunded_simulated">Simulated Refunded</option>
                <option value="failed_simulated">Simulated Declined</option>
              </select>
            </div>

            <div className="space-y-2 pt-2 border-t border-stone">
              <label className="block uppercase tracking-wider text-charcoal/75">
                Internal Concierge & Host Notes
              </label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-ivory border border-stone p-3 text-xs"
              />
              <button
                type="button"
                onClick={() => updateBookingNotes(booking.id, notes)}
                className="w-full bg-deepGreen hover:bg-forestGreen text-ivory py-2.5 px-4 uppercase tracking-wider inline-flex items-center justify-center gap-2"
              >
                <Save className="w-3.5 h-3.5" /> Save Internal Notes
              </button>
            </div>

            {booking.status !== 'cancelled' && (
              <div className="pt-4 border-t border-stone">
                {confirmCancel ? (
                  <div className="bg-red-900/10 border border-red-800/30 p-4 space-y-3">
                    <p className="text-red-900 font-medium">
                      Confirm cancellation of {booking.reference}?
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          cancelBooking(booking.id, 'Cancelled via Admin Detail View');
                          setConfirmCancel(false);
                        }}
                        className="bg-red-800 text-white px-3 py-2 uppercase tracking-wider"
                      >
                        Yes, Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmCancel(false)}
                        className="border border-stone bg-white px-3 py-2 uppercase tracking-wider"
                      >
                        Keep
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmCancel(true)}
                    className="w-full border border-red-800/30 text-red-800 hover:bg-red-900/10 py-2.5 px-4 uppercase tracking-wider inline-flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" /> Cancel Reservation
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
