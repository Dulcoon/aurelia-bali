'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/admin/AdminShell';
import { BookingStatusBadge, PaymentStatusBadge } from '@/components/ui/StatusBadge';
import { useApp } from '@/context/AppContext';
import { formatIdr } from '@/lib/format-currency';
import { formatDisplayDate } from '@/lib/date-utils';
import { downloadCsv } from '@/lib/csv-export';
import { Booking, BookingStatus, PaymentStatus } from '@/types';
import {
  Search,
  Download,
  ArrowUpDown,
  Eye,
  XCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
} from 'lucide-react';

export default function AdminBookingsPage() {
  const {
    bookings,
    villas,
    updateBookingStatus,
    updateBookingPaymentStatus,
    updateBookingNotes,
    cancelBooking,
  } = useApp();

  // Filter & Sort state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [villaFilter, setVillaFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [sortField, setSortField] = useState<'checkIn' | 'totalAmount' | 'createdAt' | 'reference'>('checkIn');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // Quick Drawer state
  const [drawerBookingId, setDrawerBookingId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<string>('');
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);

  const drawerBooking = useMemo(
    () => bookings.find((b) => b.id === drawerBookingId) || null,
    [bookings, drawerBookingId]
  );

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings
      .filter((b) => {
        const q = search.toLowerCase();
        const matchesQuery =
          !q ||
          b.reference.toLowerCase().includes(q) ||
          b.guestName.toLowerCase().includes(q) ||
          b.guestEmail.toLowerCase().includes(q) ||
          b.villaName.toLowerCase().includes(q);
        if (!matchesQuery) return false;
        if (statusFilter !== 'all' && b.status !== statusFilter) return false;
        if (paymentFilter !== 'all' && b.paymentStatus !== paymentFilter) return false;
        if (villaFilter !== 'all' && b.villaId !== villaFilter) return false;
        if (dateFrom && b.checkIn < dateFrom) return false;
        if (dateTo && b.checkIn > dateTo) return false;
        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === 'totalAmount') {
          cmp = a.totalAmount - b.totalAmount;
        } else if (sortField === 'checkIn') {
          cmp = a.checkIn.localeCompare(b.checkIn);
        } else if (sortField === 'createdAt') {
          cmp = a.createdAt.localeCompare(b.createdAt);
        } else {
          cmp = a.reference.localeCompare(b.reference);
        }
        return sortDir === 'asc' ? cmp : -cmp;
      });
  }, [
    bookings,
    search,
    statusFilter,
    paymentFilter,
    villaFilter,
    dateFrom,
    dateTo,
    sortField,
    sortDir,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / pageSize));
  const paginated = filteredBookings.slice((page - 1) * pageSize, page * pageSize);

  const handleExportCsv = () => {
    const headers = [
      'Reference',
      'Guest Name',
      'Guest Email',
      'Guest Phone',
      'Villa',
      'Check-In',
      'Check-Out',
      'Nights',
      'Guests',
      'Total Amount (IDR)',
      'Simulated Paid (IDR)',
      'Booking Status',
      'Simulated Payment Status',
      'Created Date',
    ];
    const rows = filteredBookings.map((b) => [
      b.reference,
      b.guestName,
      b.guestEmail,
      b.guestPhone,
      b.villaName,
      b.checkIn,
      b.checkOut,
      b.nights,
      b.guests,
      b.totalAmount,
      b.amountSimulatedPaid,
      b.status,
      b.paymentStatus,
      b.createdAt,
    ]);
    downloadCsv('aurelia-bali-bookings-export.csv', headers, rows);
  };

  const openDrawer = (b: Booking) => {
    setDrawerBookingId(b.id);
    setNotesDraft(b.internalNotes || '');
  };

  return (
    <AdminShell
      title="Reservation & Folio Management"
      subtitle="Search, filter, update booking states, record concierge notes, or export CSV."
      breadcrumbs={[{ label: 'Bookings' }]}
      actions={
        <button
          type="button"
          onClick={handleExportCsv}
          className="bg-deepGreen hover:bg-forestGreen text-ivory text-xs uppercase tracking-wider px-4 py-2.5 inline-flex items-center gap-2"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV ({filteredBookings.length})
        </button>
      }
    >
      {/* Filters Panel */}
      <div className="bg-white border border-stone p-5 space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-charcoal/50 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search reference, guest name, or email..."
              className="w-full bg-ivory border border-stone pl-10 pr-4 py-2.5 focus:outline-none focus:border-deepGreen"
            />
          </div>

          <div className="lg:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-ivory border border-stone px-3 py-2.5"
            >
              <option value="all">All Booking Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="lg:col-span-3">
            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-ivory border border-stone px-3 py-2.5"
            >
              <option value="all">All Simulated Payments</option>
              <option value="paid_simulated">Simulated Paid (Full)</option>
              <option value="deposit_simulated">Simulated Deposit (50%)</option>
              <option value="pending_simulated">Awaiting Simulated Payment</option>
              <option value="refunded_simulated">Simulated Refunded</option>
            </select>
          </div>

          <div className="lg:col-span-3">
            <select
              value={villaFilter}
              onChange={(e) => {
                setVillaFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-ivory border border-stone px-3 py-2.5"
            >
              <option value="all">All Villas</option>
              {villas.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-3 border-t border-stone/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-charcoal/70 uppercase tracking-wider text-[11px]">
              Check-In Date Range:
            </span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-ivory border border-stone px-2.5 py-1.5"
            />
            <span>to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-ivory border border-stone px-2.5 py-1.5"
            />
            {(dateFrom || dateTo || statusFilter !== 'all' || paymentFilter !== 'all' || villaFilter !== 'all' || search) && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('all');
                  setPaymentFilter('all');
                  setVillaFilter('all');
                  setDateFrom('');
                  setDateTo('');
                  setPage(1);
                }}
                className="text-bronze underline hover:text-charcoal ml-2"
              >
                Reset Filters
              </button>
            )}
          </div>

          <span className="text-charcoal/65">
            Showing {paginated.length} of {filteredBookings.length} matching reservations
          </span>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white border border-stone overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-ivory border-b border-stone text-[11px] uppercase tracking-wider text-charcoal/75">
                <th className="py-3.5 px-4">
                  <button
                    type="button"
                    onClick={() => handleSort('reference')}
                    className="inline-flex items-center gap-1 hover:text-charcoal"
                  >
                    Reference <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3.5 px-4">Guest</th>
                <th className="py-3.5 px-4">Villa</th>
                <th className="py-3.5 px-4">
                  <button
                    type="button"
                    onClick={() => handleSort('checkIn')}
                    className="inline-flex items-center gap-1 hover:text-charcoal"
                  >
                    Stay Dates <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3.5 px-4">Party / Nights</th>
                <th className="py-3.5 px-4">
                  <button
                    type="button"
                    onClick={() => handleSort('totalAmount')}
                    className="inline-flex items-center gap-1 hover:text-charcoal"
                  >
                    Total Value <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3.5 px-4">Booking Status</th>
                <th className="py-3.5 px-4">Simulated Payment</th>
                <th className="py-3.5 px-4">
                  <button
                    type="button"
                    onClick={() => handleSort('createdAt')}
                    className="inline-flex items-center gap-1 hover:text-charcoal"
                  >
                    Created <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone/60">
              {paginated.map((b) => (
                <tr key={b.id} className="hover:bg-ivory/40">
                  <td className="py-3.5 px-4 font-medium text-charcoal">
                    <Link href={`/admin/bookings/${b.id}`} className="hover:underline">
                      {b.reference}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-charcoal">{b.guestName}</div>
                    <div className="text-[11px] text-charcoal/60">{b.guestEmail}</div>
                  </td>
                  <td className="py-3.5 px-4">{b.villaName}</td>
                  <td className="py-3.5 px-4">
                    <div>
                      {formatDisplayDate(b.checkIn, 'dd MMM')} –{' '}
                      {formatDisplayDate(b.checkOut, 'dd MMM yyyy')}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {b.guests} Guests • {b.nights} Nights
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-charcoal">{formatIdr(b.totalAmount)}</div>
                    <div className="text-[10px] text-charcoal/60">
                      Sim. Paid: {formatIdr(b.amountSimulatedPaid)}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <BookingStatusBadge status={b.status} />
                  </td>
                  <td className="py-3.5 px-4">
                    <PaymentStatusBadge status={b.paymentStatus} />
                  </td>
                  <td className="py-3.5 px-4 text-charcoal/65">
                    {formatDisplayDate(b.createdAt, 'dd MMM yyyy')}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openDrawer(b)}
                        className="px-2.5 py-1 border border-stone bg-ivory hover:border-bronze text-charcoal"
                      >
                        Quick Drawer
                      </button>
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="px-2.5 py-1 bg-deepGreen text-ivory hover:bg-forestGreen inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> Detail
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-ivory/60 border-t border-stone flex items-center justify-between text-xs">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 border border-stone bg-white disabled:opacity-40 inline-flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 border border-stone bg-white disabled:opacity-40 inline-flex items-center gap-1"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Booking Quick Detail Drawer */}
      {drawerBooking && (
        <div
          className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex justify-end"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-ivory w-full max-w-lg h-full overflow-y-auto p-6 sm:p-8 border-l border-stone shadow-editorial flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-stone pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-bronze">
                    Reservation Drawer
                  </span>
                  <h3 className="font-serif text-2xl text-charcoal">
                    {drawerBooking.reference}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerBookingId(null)}
                  className="p-2 text-charcoal/60 hover:text-charcoal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-white border border-stone p-4 space-y-2 text-xs">
                <p className="font-serif text-xl text-charcoal">{drawerBooking.villaName}</p>
                <p>
                  <strong>Dates:</strong> {formatDisplayDate(drawerBooking.checkIn)} –{' '}
                  {formatDisplayDate(drawerBooking.checkOut)} ({drawerBooking.nights} nights)
                </p>
                <p>
                  <strong>Guest:</strong> {drawerBooking.guestName} ({drawerBooking.guestEmail} •{' '}
                  {drawerBooking.guestPhone})
                </p>
                <p>
                  <strong>Total Value:</strong> {formatIdr(drawerBooking.totalAmount)} (Simulated Paid:{' '}
                  {formatIdr(drawerBooking.amountSimulatedPaid)})
                </p>
              </div>

              {/* Status Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block uppercase tracking-wider text-charcoal/70 mb-1.5">
                    Booking Status
                  </label>
                  <select
                    value={drawerBooking.status}
                    onChange={(e) =>
                      updateBookingStatus(drawerBooking.id, e.target.value as BookingStatus)
                    }
                    className="w-full bg-white border border-stone px-3 py-2"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-charcoal/70 mb-1.5">
                    Simulated Payment State
                  </label>
                  <select
                    value={drawerBooking.paymentStatus}
                    onChange={(e) =>
                      updateBookingPaymentStatus(drawerBooking.id, e.target.value as PaymentStatus)
                    }
                    className="w-full bg-white border border-stone px-3 py-2"
                  >
                    <option value="paid_simulated">Simulated Paid (Full)</option>
                    <option value="deposit_simulated">Simulated Deposit (50%)</option>
                    <option value="pending_simulated">Awaiting Simulated Payment</option>
                    <option value="refunded_simulated">Simulated Refunded</option>
                  </select>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="space-y-2 text-xs">
                <label className="block uppercase tracking-wider text-charcoal/70">
                  Internal Concierge Notes
                </label>
                <textarea
                  rows={3}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  className="w-full bg-white border border-stone p-3"
                />
                <button
                  type="button"
                  onClick={() => updateBookingNotes(drawerBooking.id, notesDraft)}
                  className="inline-flex items-center gap-1.5 bg-deepGreen text-ivory px-4 py-2 text-xs uppercase tracking-wider"
                >
                  <Save className="w-3.5 h-3.5" /> Save Notes
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-stone flex items-center justify-between">
              {drawerBooking.status !== 'cancelled' && (
                <button
                  type="button"
                  onClick={() => setCancelConfirmId(drawerBooking.id)}
                  className="text-xs uppercase tracking-wider text-red-800 hover:underline inline-flex items-center gap-1"
                >
                  <XCircle className="w-4 h-4" /> Cancel Booking
                </button>
              )}
              <Link
                href={`/admin/bookings/${drawerBooking.id}`}
                className="bg-charcoal text-ivory text-xs uppercase tracking-wider px-5 py-2.5"
              >
                Open Full Folio Page →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelConfirmId && (
        <div
          className="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-ivory border border-stone max-w-md w-full p-6 space-y-4">
            <h3 className="font-serif text-2xl text-charcoal">Cancel This Reservation?</h3>
            <p className="text-xs text-charcoal/75 leading-relaxed">
              Cancelling this reservation will immediately release the occupied nights on the public availability calendar.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCancelConfirmId(null)}
                className="px-4 py-2 text-xs uppercase border border-stone"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={() => {
                  cancelBooking(cancelConfirmId, 'Cancelled by Admin Operator');
                  setCancelConfirmId(null);
                }}
                className="px-4 py-2 text-xs uppercase bg-red-800 text-white"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
