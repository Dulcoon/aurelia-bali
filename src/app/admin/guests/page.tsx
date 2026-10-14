'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/admin/AdminShell';
import { BookingStatusBadge } from '@/components/ui/StatusBadge';
import { useApp } from '@/context/AppContext';
import { formatIdr } from '@/lib/format-currency';
import { formatDisplayDate } from '@/lib/date-utils';
import { Guest } from '@/types';
import { Search, Star, Mail, Phone, Globe, X } from 'lucide-react';

export default function AdminGuestsPage() {
  const { guests, bookings } = useApp();
  const [search, setSearch] = useState('');
  const [vipOnly, setVipOnly] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  const filtered = guests.filter((g) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      g.name.toLowerCase().includes(q) ||
      g.email.toLowerCase().includes(q) ||
      g.country.toLowerCase().includes(q);
    if (!matchesSearch) return false;
    if (vipOnly && !g.vipStatus) return false;
    return true;
  });

  const guestBookings = selectedGuest
    ? bookings.filter(
        (b) => b.guestEmail.toLowerCase() === selectedGuest.email.toLowerCase()
      )
    : [];

  return (
    <AdminShell
      title="Fictional Guest Directory"
      subtitle="Demonstration guest profiles and stay histories synchronized with prototype bookings."
      breadcrumbs={[{ label: 'Guests' }]}
    >
      {/* Search Bar */}
      <div className="bg-white border border-stone p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-charcoal/50 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guest name, email, or country..."
            className="w-full bg-ivory border border-stone pl-10 pr-4 py-2.5 focus:outline-none focus:border-deepGreen"
          />
        </div>

        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={vipOnly}
            onChange={(e) => setVipOnly(e.target.checked)}
            className="accent-deepGreen w-4 h-4"
          />
          <span className="font-medium text-charcoal">VIP / Repeat Sanctuary Guests Only</span>
        </label>
      </div>

      {/* Guest Table */}
      <div className="bg-white border border-stone overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-ivory border-b border-stone text-[11px] uppercase tracking-wider text-charcoal/70">
                <th className="py-3.5 px-4">Guest Name</th>
                <th className="py-3.5 px-4">Contact Details</th>
                <th className="py-3.5 px-4">Origin</th>
                <th className="py-3.5 px-4">Bookings</th>
                <th className="py-3.5 px-4">Last Stay Date</th>
                <th className="py-3.5 px-4">Total Simulated Booking Value</th>
                <th className="py-3.5 px-4 text-right">History</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone/60">
              {filtered.map((g) => (
                <tr key={g.id} className="hover:bg-ivory/40">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2 font-medium text-charcoal">
                      <span>{g.name}</span>
                      {g.vipStatus && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase bg-bronze/20 text-[#7A623E] border border-bronze/30">
                          <Star className="w-3 h-3 fill-current" /> VIP
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-charcoal/60 mt-0.5 line-clamp-1">{g.notes}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-charcoal">
                      <Mail className="w-3 h-3 text-bronze" /> {g.email}
                    </div>
                    <div className="flex items-center gap-1.5 text-charcoal/65 mt-0.5">
                      <Phone className="w-3 h-3 text-bronze" /> {g.phone}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-charcoal/80">
                      <Globe className="w-3.5 h-3.5 text-bronze" /> {g.country}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium">{g.bookingsCount}</td>
                  <td className="py-3.5 px-4">{formatDisplayDate(g.lastStayDate)}</td>
                  <td className="py-3.5 px-4 font-serif text-base font-medium text-deepGreen">
                    {formatIdr(g.totalSimulatedValue)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedGuest(g)}
                      className="px-3 py-1.5 bg-deepGreen text-ivory hover:bg-forestGreen text-xs uppercase tracking-wider"
                    >
                      Stay History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guest Booking History Modal */}
      {selectedGuest && (
        <div
          className="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-ivory border border-stone max-w-2xl w-full p-6 sm:p-8 shadow-editorial space-y-6">
            <div className="flex items-center justify-between border-b border-stone pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-bronze">
                  Fictional Guest Profile & History
                </span>
                <h3 className="font-serif text-3xl text-charcoal">{selectedGuest.name}</h3>
                <p className="text-xs text-charcoal/70">{selectedGuest.email} • {selectedGuest.phone}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGuest(null)}
                className="p-2 text-charcoal/60 hover:text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white border border-stone p-4 text-xs space-y-1">
              <p className="uppercase tracking-wider text-[10px] text-bronze">Concierge Preference Notes</p>
              <p className="text-charcoal/85">{selectedGuest.notes}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-charcoal/75 font-medium">
                Recorded Reservations ({guestBookings.length})
              </h4>
              {guestBookings.length === 0 ? (
                <p className="text-xs text-charcoal/60">No reservations linked in current session.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {guestBookings.map((b) => (
                    <div
                      key={b.id}
                      className="bg-white border border-stone p-3.5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-medium text-charcoal">
                          {b.reference} — {b.villaName}
                        </p>
                        <p className="text-charcoal/65">
                          {formatDisplayDate(b.checkIn)} to {formatDisplayDate(b.checkOut)} ({b.nights} nights)
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{formatIdr(b.totalAmount)}</span>
                        <BookingStatusBadge status={b.status} />
                        <Link
                          href={`/admin/bookings/${b.id}`}
                          className="text-deepGreen underline"
                        >
                          Open
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
