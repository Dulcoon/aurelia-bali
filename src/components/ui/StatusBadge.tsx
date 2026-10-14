import React from 'react';
import { BookingStatus, PaymentStatus } from '@/types';

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const styles: Record<BookingStatus, string> = {
    confirmed: 'bg-deepGreen/10 text-deepGreen border-deepGreen/25',
    pending: 'bg-bronze/15 text-[#7A623E] border-bronze/30',
    completed: 'bg-stone/40 text-charcoal border-stone',
    cancelled: 'bg-red-900/10 text-red-800 border-red-800/20',
  };

  const labels: Record<BookingStatus, string> = {
    confirmed: 'Confirmed',
    pending: 'Pending Review',
    completed: 'Stay Completed',
    cancelled: 'Cancelled',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const styles: Record<PaymentStatus, string> = {
    paid_simulated: 'bg-emerald-950/10 text-emerald-900 border-emerald-800/25',
    deposit_simulated: 'bg-amber-900/10 text-amber-900 border-amber-800/25',
    pending_simulated: 'bg-stone/40 text-charcoal/80 border-stone',
    refunded_simulated: 'bg-slate-200 text-slate-700 border-slate-300',
    failed_simulated: 'bg-red-900/10 text-red-800 border-red-800/20',
  };

  const labels: Record<PaymentStatus, string> = {
    paid_simulated: 'Simulated Paid (Full)',
    deposit_simulated: 'Simulated Deposit (50%)',
    pending_simulated: 'Awaiting Simulated Payment',
    refunded_simulated: 'Simulated Refunded',
    failed_simulated: 'Simulated Declined',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
