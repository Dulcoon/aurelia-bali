'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { AdminShell } from '@/components/admin/AdminShell';
import { useApp } from '@/context/AppContext';
import { getCalendarDayStatus } from '@/lib/availability';
import { formatIdr } from '@/lib/format-currency';
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  Calendar as CalendarIcon,
  Info,
} from 'lucide-react';

export default function AdminCalendarPage() {
  const { villas, bookings, blockedDates, toggleBlockDate } = useApp();

  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedVillaId, setSelectedVillaId] = useState<string>(
    villas[0]?.id || 'villa-ubud-sanctuary'
  );
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [blockReasonInput, setBlockReasonInput] = useState<string>(
    'Scheduled Villa Maintenance & Teak Care'
  );

  const selectedVilla =
    villas.find((v) => v.id === selectedVillaId) || villas[0];

  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const leadingEmptyDays = getDay(startOfMonth(currentMonth));

  const selectedDayStatus = useMemo(
    () =>
      getCalendarDayStatus({
        villaId: selectedVilla.id,
        dateStr: selectedDateStr,
        bookings,
        blockedDates,
      }),
    [selectedVilla.id, selectedDateStr, bookings, blockedDates]
  );

  return (
    <AdminShell
      title="Villa Availability & Hold Calendar"
      subtitle="Inspect confirmed stays, pending holds, check-in/out turnovers, or block dates for maintenance."
      breadcrumbs={[{ label: 'Availability Calendar' }]}
    >
      {/* Top Controls: Villa Selector & Month Navigation */}
      <div className="bg-white border border-stone p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <label
            htmlFor="cal-villa-select"
            className="text-xs uppercase tracking-wider text-charcoal/70"
          >
            Select Sanctuary:
          </label>
          <select
            id="cal-villa-select"
            value={selectedVilla.id}
            onChange={(e) => setSelectedVillaId(e.target.value)}
            className="bg-ivory border border-stone px-4 py-2.5 text-sm font-medium text-charcoal focus:outline-none focus:border-deepGreen"
          >
            {villas.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.location})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
            className="p-2 border border-stone bg-ivory hover:border-bronze"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-serif text-2xl text-charcoal min-w-[170px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            type="button"
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            className="p-2 border border-stone bg-ivory hover:border-bronze"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 bg-white border border-stone inline-block" /> Available
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 bg-deepGreen inline-block" /> Confirmed
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 bg-bronze inline-block" /> Pending
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 bg-charcoal/80 inline-block" /> Blocked Hold
          </span>
        </div>
      </div>

      {/* Main Calendar Grid + Inspector Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Calendar Grid */}
        <div className="lg:col-span-8 bg-white border border-stone p-5">
          <div className="grid grid-cols-7 gap-2 text-center text-[11px] uppercase tracking-wider text-charcoal/60 pb-3 border-b border-stone">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-3">
            {Array.from({ length: leadingEmptyDays }).map((_, i) => (
              <div key={`empty-${i}`} className="h-24 bg-ivory/30 border border-stone/30" />
            ))}

            {daysInMonth.map((dayObj) => {
              const dateStr = format(dayObj, 'yyyy-MM-dd');
              const status = getCalendarDayStatus({
                villaId: selectedVilla.id,
                dateStr,
                bookings,
                blockedDates,
              });
              const isSelected = selectedDateStr === dateStr;

              const cellStyles = {
                available: 'bg-ivory/60 hover:bg-sand/40 text-charcoal border-stone',
                confirmed: 'bg-deepGreen text-ivory border-deepGreen',
                pending: 'bg-bronze/25 text-charcoal border-bronze',
                blocked: 'bg-charcoal text-sand border-charcoal',
              }[status.state];

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`h-24 p-2 border text-left flex flex-col justify-between transition-all relative ${cellStyles} ${
                    isSelected ? 'ring-2 ring-bronze ring-offset-2' : ''
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-medium">{format(dayObj, 'd')}</span>
                    <div className="flex gap-1">
                      {status.isCheckIn && (
                        <span
                          title="Arrival Check-In"
                          className="text-[9px] uppercase px-1 bg-emerald-700 text-white"
                        >
                          IN
                        </span>
                      )}
                      {status.isCheckOut && (
                        <span
                          title="Departure Check-Out"
                          className="text-[9px] uppercase px-1 bg-amber-700 text-white"
                        >
                          OUT
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="w-full truncate">
                    {status.state === 'confirmed' && status.booking && (
                      <div className="text-[10px] leading-tight truncate">
                        <span className="font-medium block truncate">
                          {status.booking.guestName}
                        </span>
                        <span className="opacity-80">{status.booking.reference}</span>
                      </div>
                    )}
                    {status.state === 'pending' && status.booking && (
                      <div className="text-[10px] leading-tight truncate">
                        <span className="font-medium block truncate">
                          {status.booking.guestName}
                        </span>
                        <span className="opacity-80">Pending</span>
                      </div>
                    )}
                    {status.state === 'blocked' && (
                      <div className="text-[10px] leading-tight truncate">
                        <span className="font-medium block">Blocked Hold</span>
                        <span className="opacity-75 truncate">
                          {status.blockedRecord?.reason || 'Maintenance'}
                        </span>
                      </div>
                    )}
                    {status.state === 'available' && (
                      <span className="text-[10px] opacity-60">
                        {formatIdr(selectedVilla.basePricePerNight, true)}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side Inspector */}
        <aside className="lg:col-span-4 bg-white border border-stone p-6 space-y-6">
          <div className="border-b border-stone pb-3">
            <span className="text-[10px] uppercase tracking-widest text-bronze">
              Selected Date Inspector
            </span>
            <h2 className="font-serif text-2xl text-charcoal mt-0.5">
              {selectedDateStr}
            </h2>
            <p className="text-xs text-charcoal/65">{selectedVilla.name}</p>
          </div>

          {/* Turnover Indicators */}
          {(selectedDayStatus.isCheckIn || selectedDayStatus.isCheckOut) && (
            <div className="bg-sand/40 border border-stone p-3.5 text-xs space-y-1">
              {selectedDayStatus.isCheckIn && (
                <p className="text-deepGreen font-medium">
                  • Scheduled Guest Check-In Day ({selectedVilla.checkInTime})
                </p>
              )}
              {selectedDayStatus.isCheckOut && (
                <p className="text-amber-900 font-medium">
                  • Scheduled Guest Check-Out Day ({selectedVilla.checkOutTime})
                </p>
              )}
            </div>
          )}

          {/* If occupied by a booking */}
          {selectedDayStatus.booking ? (
            <div className="space-y-4 text-xs">
              <div className="bg-ivory p-4 border border-stone space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-bronze">
                  Occupied by Reservation
                </p>
                <p className="font-serif text-xl text-charcoal">
                  {selectedDayStatus.booking.reference}
                </p>
                <p>
                  <strong>Guest:</strong> {selectedDayStatus.booking.guestName}
                </p>
                <p>
                  <strong>Stay:</strong> {selectedDayStatus.booking.checkIn} to{' '}
                  {selectedDayStatus.booking.checkOut} ({selectedDayStatus.booking.nights} nights)
                </p>
                <p>
                  <strong>Total Value:</strong>{' '}
                  {formatIdr(selectedDayStatus.booking.totalAmount)}
                </p>
              </div>
              <Link
                href={`/admin/bookings/${selectedDayStatus.booking.id}`}
                className="w-full block text-center bg-deepGreen text-ivory py-3 px-4 uppercase tracking-wider"
              >
                Open Reservation Details →
              </Link>
            </div>
          ) : selectedDayStatus.state === 'blocked' && selectedDayStatus.blockedRecord ? (
            <div className="space-y-4 text-xs">
              <div className="bg-charcoal text-ivory p-4 space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-bronze">
                  Date Currently Blocked
                </p>
                <p className="font-medium">{selectedDayStatus.blockedRecord.reason}</p>
                <p className="text-sand/70 text-[11px]">
                  Created by: {selectedDayStatus.blockedRecord.createdBy}
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleBlockDate(selectedVilla.id, selectedDateStr)}
                className="w-full bg-deepGreen hover:bg-forestGreen text-ivory py-3 px-4 uppercase tracking-wider inline-flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" /> Unblock Date for Public Booking
              </button>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="bg-ivory p-4 border border-stone space-y-1.5">
                <p className="font-medium text-deepGreen">Available for Public Booking</p>
                <p className="text-charcoal/70">
                  Blocking this date will immediately prevent guests from booking {selectedVilla.name} over {selectedDateStr}.
                </p>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
                  Hold / Maintenance Reason
                </label>
                <input
                  type="text"
                  value={blockReasonInput}
                  onChange={(e) => setBlockReasonInput(e.target.value)}
                  className="w-full bg-ivory border border-stone px-3 py-2"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  toggleBlockDate(selectedVilla.id, selectedDateStr, blockReasonInput)
                }
                className="w-full bg-charcoal hover:bg-deepGreen text-ivory py-3 px-4 uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors"
              >
                <Lock className="w-4 h-4" /> Block Selected Date
              </button>
            </div>
          )}

          <div className="pt-4 border-t border-stone text-[11px] text-charcoal/65 flex items-start gap-2">
            <Info className="w-4 h-4 text-bronze shrink-0 mt-0.5" />
            <span>
              All blocked dates and active reservations immediately synchronize with the public villa search and checkout validators.
            </span>
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}
