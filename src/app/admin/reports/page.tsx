'use client';

import React, { useState, useMemo } from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import { useApp } from '@/context/AppContext';
import { HISTORICAL_MONTHLY_ANALYTICS } from '@/data/bookings';
import { formatIdr } from '@/lib/format-currency';
import { downloadCsv } from '@/lib/csv-export';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Download, Calendar } from 'lucide-react';

const PIE_COLORS = ['#263D32', '#A88C62', '#344F40', '#8A5A44'];

export default function AdminReportsPage() {
  const { villas, bookings } = useApp();
  const [periodFilter, setPeriodFilter] = useState<'6m' | '3m' | 'all'>('6m');

  const filteredMonthly = useMemo(() => {
    if (periodFilter === '3m') return HISTORICAL_MONTHLY_ANALYTICS.slice(-3);
    return HISTORICAL_MONTHLY_ANALYTICS;
  }, [periodFilter]);

  // Villa popularity & simulated revenue share
  const villaPerformance = useMemo(() => {
    return villas.map((v) => {
      const vBookings = bookings.filter((b) => b.villaId === v.id && b.status !== 'cancelled');
      const totalVal = vBookings.reduce((sum, b) => sum + b.totalAmount, 0);
      const nights = vBookings.reduce((sum, b) => sum + b.nights, 0);
      return {
        name: v.name,
        location: v.location,
        bookingsCount: vBookings.length,
        occupiedNights: nights,
        bookingValueMillions: Math.round(totalVal / 1_000_000),
        rawBookingValue: totalVal,
      };
    });
  }, [villas, bookings]);

  // Payment status breakdown
  const paymentBreakdown = useMemo(() => {
    const counts = {
      'Simulated Paid (Full)': bookings.filter((b) => b.paymentStatus === 'paid_simulated').length,
      'Simulated Deposit (50%)': bookings.filter((b) => b.paymentStatus === 'deposit_simulated').length,
      'Awaiting Simulated Payment': bookings.filter((b) => b.paymentStatus === 'pending_simulated').length,
      'Simulated Refunded / Cancelled': bookings.filter(
        (b) => b.paymentStatus === 'refunded_simulated' || b.paymentStatus === 'failed_simulated'
      ).length,
    };
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [bookings]);

  const cancellationRate = Math.round(
    (bookings.filter((b) => b.status === 'cancelled').length / Math.max(1, bookings.length)) * 100
  );

  const handleExportReportCsv = () => {
    const headers = [
      'Month',
      'Bookings Count',
      'Gross Booking Value (IDR)',
      'Simulated Payments Received (IDR)',
      'Occupancy Rate (%)',
      'Cancellations',
    ];
    const rows = filteredMonthly.map((m) => [
      m.month,
      m.bookings,
      m.bookingValue,
      m.simulatedReceived,
      m.occupancyRate,
      m.cancellations,
    ]);
    downloadCsv('aurelia-bali-analytics-report.csv', headers, rows);
  };

  return (
    <AdminShell
      title="Hospitality Performance & Financial Reports"
      subtitle="Deterministic seeded analytics combined with live session reservation metrics."
      breadcrumbs={[{ label: 'Reports & Analytics' }]}
      actions={
        <div className="flex items-center gap-3">
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value as typeof periodFilter)}
            className="bg-white border border-stone px-3 py-2 text-xs"
          >
            <option value="6m">Last 6 Months (May – Oct 2026)</option>
            <option value="3m">Last Quarter (Aug – Oct 2026)</option>
            <option value="all">Full Year Seeded Window</option>
          </select>
          <button
            type="button"
            onClick={handleExportReportCsv}
            className="bg-deepGreen hover:bg-forestGreen text-ivory text-xs uppercase tracking-wider px-4 py-2.5 inline-flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" /> Export Report CSV
          </button>
        </div>
      }
    >
      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-stone p-5">
          <span className="text-xs uppercase tracking-wider text-charcoal/60">
            Portfolio Cancellation Rate
          </span>
          <p className="font-serif text-3xl text-charcoal mt-1">{cancellationRate}%</p>
          <p className="text-[11px] text-charcoal/60 mt-1">
            {bookings.filter((b) => b.status === 'cancelled').length} cancelled of {bookings.length} total bookings
          </p>
        </div>
        <div className="bg-white border border-stone p-5">
          <span className="text-xs uppercase tracking-wider text-charcoal/60">
            Average Stay Length
          </span>
          <p className="font-serif text-3xl text-deepGreen mt-1">
            {(
              bookings.reduce((s, b) => s + b.nights, 0) / Math.max(1, bookings.length)
            ).toFixed(1)}{' '}
            Nights
          </p>
          <p className="text-[11px] text-charcoal/60 mt-1">Across all 4 Balinese sanctuaries</p>
        </div>
        <div className="bg-white border border-stone p-5">
          <span className="text-xs uppercase tracking-wider text-charcoal/60">
            Most Popular Residence
          </span>
          <p className="font-serif text-2xl text-charcoal mt-1">
            {[...villaPerformance].sort((a, b) => b.rawBookingValue - a.rawBookingValue)[0]?.name}
          </p>
          <p className="text-[11px] text-bronze mt-1">Highest contracted stay value</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Villa Popularity & Revenue Share */}
        <div className="lg:col-span-7 bg-white border border-stone p-6 space-y-4">
          <div>
            <h2 className="font-serif text-2xl text-charcoal">
              Villa Popularity & Simulated Booking Value (IDR Millions)
            </h2>
            <p className="text-xs text-charcoal/60">
              Live comparison across active sanctuaries
            </p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={villaPerformance} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6DCCB" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#262822' }} />
                <YAxis tick={{ fontSize: 11, fill: '#262822' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#F7F5EF', borderColor: '#D4CEC2', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar
                  dataKey="bookingValueMillions"
                  name="Simulated Booking Value (IDR M)"
                  fill="#263D32"
                />
                <Bar dataKey="occupiedNights" name="Occupied Nights" fill="#A88C62" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Simulated Payment Status Breakdown */}
        <div className="lg:col-span-5 bg-white border border-stone p-6 space-y-4">
          <div>
            <h2 className="font-serif text-2xl text-charcoal">
              Simulated Payment Status Breakdown
            </h2>
            <p className="text-xs text-charcoal/60">
              Distribution of full settlements, deposits, and pending folios
            </p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  label
                >
                  {paymentBreakdown.map((entry, index) => (
                    <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Occupancy Trend Line Chart */}
      <div className="bg-white border border-stone p-6 space-y-4">
        <div>
          <h2 className="font-serif text-2xl text-charcoal">
            Seasonal Occupancy Rate (%) & Cancellation Trend
          </h2>
          <p className="text-xs text-charcoal/60">
            Monthly occupancy trajectory across the Bali portfolio
          </p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredMonthly} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6DCCB" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#262822' }} />
              <YAxis tick={{ fontSize: 11, fill: '#262822' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#F7F5EF', borderColor: '#D4CEC2', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line
                type="monotone"
                dataKey="occupancyRate"
                name="Occupancy Rate (%)"
                stroke="#263D32"
                strokeWidth={2.5}
              />
              <Line
                type="monotone"
                dataKey="bookings"
                name="Monthly Bookings"
                stroke="#A88C62"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AdminShell>
  );
}
