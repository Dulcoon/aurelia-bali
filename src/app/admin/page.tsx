'use client';

import React from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/admin/AdminShell';
import { BookingStatusBadge, PaymentStatusBadge } from '@/components/ui/StatusBadge';
import { useApp } from '@/context/AppContext';
import { HISTORICAL_MONTHLY_ANALYTICS } from '@/data/bookings';
import { formatIdr } from '@/lib/format-currency';
import { formatDisplayDate, getTodayIso } from '@/lib/date-utils';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  CalendarCheck,
  Clock,
  PlaneLanding,
  PlaneTakeoff,
  Wallet,
  TrendingUp,
  Percent,
  Plus,
  ArrowRight,
  CalendarDays,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { villas, bookings, blockedDates } = useApp();
  const todayIso = getTodayIso();

  // Compute live KPIs
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;

  const upcomingArrivals = bookings.filter(
    (b) => b.status === 'confirmed' && b.checkIn >= todayIso
  ).length;

  const todaysDepartures = bookings.filter(
    (b) => (b.status === 'confirmed' || b.status === 'completed') && b.checkOut === todayIso
  ).length;

  const activeBookings = bookings.filter((b) => b.status !== 'cancelled');
  const totalBookingValue = activeBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const simulatedReceivedPayments = bookings.reduce(
    (sum, b) => sum + (b.status !== 'cancelled' ? b.amountSimulatedPaid : 0),
    0
  );

  // Calculate occupancy rate across active villas over a 30-day window
  const totalBookedNights = activeBookings.reduce((sum, b) => sum + b.nights, 0);
  const capacityNights = Math.max(1, villas.length * 30);
  const occupancyRate = Math.min(98, Math.round(((totalBookedNights + blockedDates.length) / capacityNights) * 100));

  const chartData = HISTORICAL_MONTHLY_ANALYTICS.map((item) => ({
    ...item,
    bookingValueMillions: Math.round(item.bookingValue / 1_000_000),
    receivedMillions: Math.round(item.simulatedReceived / 1_000_000),
  }));

  return (
    <AdminShell
      title="Executive Operations Overview"
      subtitle="Live prototype metrics calculated from seeded and session reservations."
      breadcrumbs={[{ label: 'Overview' }]}
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/admin/calendar"
            className="bg-white border border-stone hover:border-bronze text-charcoal text-xs uppercase tracking-wider px-4 py-2.5 inline-flex items-center gap-1.5"
          >
            <CalendarDays className="w-3.5 h-3.5 text-bronze" />
            Calendar
          </Link>
          <Link
            href="/admin/villas/new"
            className="bg-deepGreen hover:bg-forestGreen text-ivory text-xs uppercase tracking-wider px-4 py-2.5 inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            New Villa
          </Link>
        </div>
      }
    >
      {/* 8 KPI Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-stone p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-charcoal/65 uppercase tracking-wider">
            <span>Total Bookings</span>
            <CalendarCheck className="w-4 h-4 text-deepGreen" />
          </div>
          <p className="font-serif text-3xl text-charcoal font-medium">{totalBookings}</p>
          <p className="text-[11px] text-charcoal/60">
            {confirmedBookings} Confirmed • {pendingBookings} Pending
          </p>
        </div>

        <div className="bg-white border border-stone p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-charcoal/65 uppercase tracking-wider">
            <span>Confirmed & Pending</span>
            <Clock className="w-4 h-4 text-bronze" />
          </div>
          <p className="font-serif text-3xl text-deepGreen font-medium">
            {confirmedBookings} <span className="text-lg text-bronze">/ {pendingBookings}</span>
          </p>
          <p className="text-[11px] text-charcoal/60">Active confirmed vs pending review</p>
        </div>

        <div className="bg-white border border-stone p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-charcoal/65 uppercase tracking-wider">
            <span>Upcoming Arrivals</span>
            <PlaneLanding className="w-4 h-4 text-deepGreen" />
          </div>
          <p className="font-serif text-3xl text-charcoal font-medium">{upcomingArrivals}</p>
          <p className="text-[11px] text-charcoal/60">
            Today’s Departures: <strong>{todaysDepartures}</strong>
          </p>
        </div>

        <div className="bg-white border border-stone p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-charcoal/65 uppercase tracking-wider">
            <span>Est. Occupancy Rate</span>
            <Percent className="w-4 h-4 text-bronze" />
          </div>
          <p className="font-serif text-3xl text-charcoal font-medium">{occupancyRate}%</p>
          <p className="text-[11px] text-charcoal/60">
            Across {villas.filter((v) => v.published).length} published villas
          </p>
        </div>

        <div className="bg-white border border-stone p-5 space-y-2 sm:col-span-2">
          <div className="flex items-center justify-between text-xs text-charcoal/65 uppercase tracking-wider">
            <span>Active Portfolio Booking Value (Simulated Gross)</span>
            <TrendingUp className="w-4 h-4 text-deepGreen" />
          </div>
          <p className="font-serif text-3xl text-charcoal font-medium">
            {formatIdr(totalBookingValue)}
          </p>
          <p className="text-[11px] text-charcoal/60">
            Total contracted value of confirmed & pending reservations (distinct from cash received)
          </p>
        </div>

        <div className="bg-white border border-stone p-5 space-y-2 sm:col-span-2">
          <div className="flex items-center justify-between text-xs text-charcoal/65 uppercase tracking-wider">
            <span>Simulated Received Payments (Deposits & Full Stays)</span>
            <Wallet className="w-4 h-4 text-bronze" />
          </div>
          <p className="font-serif text-3xl text-deepGreen font-medium">
            {formatIdr(simulatedReceivedPayments)}
          </p>
          <p className="text-[11px] text-charcoal/60">
            Simulated payments recorded via demo checkout ({Math.round((simulatedReceivedPayments / Math.max(1, totalBookingValue)) * 100)}% of gross booking value)
          </p>
        </div>
      </section>

      {/* Charts Row */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-stone p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl text-charcoal">
                Simulated Booking Value vs. Received Payments (IDR Millions)
              </h2>
              <p className="text-xs text-charcoal/60">
                6-month hospitality performance trend (Deterministic Demo Dataset)
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6DCCB" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#262822' }} />
                <YAxis tick={{ fontSize: 11, fill: '#262822' }} unit="M" />
                <Tooltip
                  formatter={(value: number) => [`IDR ${value}M`, '']}
                  contentStyle={{ backgroundColor: '#F7F5EF', borderColor: '#D4CEC2', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area
                  type="monotone"
                  dataKey="bookingValueMillions"
                  name="Gross Booking Value (IDR M)"
                  stroke="#263D32"
                  fill="#263D32"
                  fillOpacity={0.18}
                />
                <Area
                  type="monotone"
                  dataKey="receivedMillions"
                  name="Simulated Payments Received (IDR M)"
                  stroke="#A88C62"
                  fill="#A88C62"
                  fillOpacity={0.25}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-stone p-6 space-y-4">
          <div>
            <h2 className="font-serif text-2xl text-charcoal">
              Monthly Occupancy & Reservation Volume
            </h2>
            <p className="text-xs text-charcoal/60">
              Occupancy rate (%) and confirmed monthly bookings
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6DCCB" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#262822' }} />
                <YAxis tick={{ fontSize: 11, fill: '#262822' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#F7F5EF', borderColor: '#D4CEC2', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="occupancyRate" name="Occupancy (%)" fill="#263D32" />
                <Bar dataKey="bookings" name="Reservations Count" fill="#A88C62" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Recent Reservations Table */}
      <section className="bg-white border border-stone p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl text-charcoal">Recent Reservations</h2>
            <p className="text-xs text-charcoal/65">
              Includes newly created bookings from the public prototype flow.
            </p>
          </div>
          <Link
            href="/admin/bookings"
            className="text-xs uppercase tracking-wider text-deepGreen hover:text-bronze font-medium inline-flex items-center gap-1"
          >
            View All Bookings <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone bg-ivory/70 text-[11px] uppercase tracking-wider text-charcoal/70">
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Guest</th>
                <th className="py-3 px-4">Villa</th>
                <th className="py-3 px-4">Stay Dates</th>
                <th className="py-3 px-4">Total Value</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Simulated Payment</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone/60">
              {bookings.slice(0, 6).map((b) => (
                <tr key={b.id} className="hover:bg-ivory/40">
                  <td className="py-3.5 px-4 font-medium text-charcoal">{b.reference}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-charcoal">{b.guestName}</div>
                    <div className="text-charcoal/60 text-[11px]">{b.guestEmail}</div>
                  </td>
                  <td className="py-3.5 px-4">{b.villaName}</td>
                  <td className="py-3.5 px-4">
                    {formatDisplayDate(b.checkIn, 'dd MMM')} – {formatDisplayDate(b.checkOut, 'dd MMM yyyy')}
                    <span className="block text-[10px] text-charcoal/60">{b.nights} nights</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium">{formatIdr(b.totalAmount)}</td>
                  <td className="py-3.5 px-4">
                    <BookingStatusBadge status={b.status} />
                  </td>
                  <td className="py-3.5 px-4">
                    <PaymentStatusBadge status={b.paymentStatus} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/admin/bookings/${b.id}`}
                      className="text-deepGreen hover:text-bronze font-medium underline underline-offset-4"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
