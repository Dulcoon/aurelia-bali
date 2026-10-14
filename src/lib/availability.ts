import { BlockedDate, Booking, Villa } from '@/types';
import { getNightsCount, getStayNightDates, isPastDate } from './date-utils';

export interface AvailabilityResult {
  available: boolean;
  reason?: string;
  conflictingDates: string[];
}

/**
 * Checks whether a villa is available for [checkIn, checkOut) and guest count.
 */
export function checkVillaAvailability(params: {
  villa: Villa;
  checkIn: string;
  checkOut: string;
  guests: number;
  bookings: Booking[];
  blockedDates: BlockedDate[];
  excludeBookingId?: string;
}): AvailabilityResult {
  const { villa, checkIn, checkOut, guests, bookings, blockedDates, excludeBookingId } = params;

  if (!checkIn || !checkOut) {
    return { available: false, reason: 'Please select both check-in and check-out dates.', conflictingDates: [] };
  }

  if (isPastDate(checkIn)) {
    return { available: false, reason: 'Check-in date cannot be in the past.', conflictingDates: [] };
  }

  const nights = getNightsCount(checkIn, checkOut);
  if (nights <= 0) {
    return { available: false, reason: 'Check-out date must be after check-in date.', conflictingDates: [] };
  }

  if (nights < villa.minStayNights) {
    return {
      available: false,
      reason: `${villa.name} requires a minimum stay of ${villa.minStayNights} nights.`,
      conflictingDates: [],
    };
  }

  if (guests < 1) {
    return { available: false, reason: 'Please select at least 1 guest.', conflictingDates: [] };
  }

  if (guests > villa.maxGuests) {
    return {
      available: false,
      reason: `Maximum occupancy for ${villa.name} is ${villa.maxGuests} guests.`,
      conflictingDates: [],
    };
  }

  const requestedNights = getStayNightDates(checkIn, checkOut);
  const conflictingDates: string[] = [];

  // Check blocked dates
  const villaBlocks = blockedDates.filter((b) => b.villaId === villa.id);
  for (const night of requestedNights) {
    const blocked = villaBlocks.find((b) => b.date === night);
    if (blocked) {
      conflictingDates.push(night);
    }
  }

  if (conflictingDates.length > 0) {
    return {
      available: false,
      reason: `Selected dates include maintenance or owner hold dates (${conflictingDates.join(', ')}).`,
      conflictingDates,
    };
  }

  // Check active bookings (confirmed or pending)
  const activeBookings = bookings.filter(
    (b) =>
      b.villaId === villa.id &&
      b.id !== excludeBookingId &&
      (b.status === 'confirmed' || b.status === 'pending')
  );

  for (const booking of activeBookings) {
    const bookedNights = new Set(getStayNightDates(booking.checkIn, booking.checkOut));
    for (const night of requestedNights) {
      if (bookedNights.has(night)) {
        conflictingDates.push(night);
      }
    }
  }

  if (conflictingDates.length > 0) {
    return {
      available: false,
      reason: `${villa.name} is already reserved on ${conflictingDates[0]}${
        conflictingDates.length > 1 ? ` (+${conflictingDates.length - 1} other night(s))` : ''
      }.`,
      conflictingDates,
    };
  }

  return { available: true, conflictingDates: [] };
}

export interface CalendarDayStatus {
  date: string;
  state: 'available' | 'confirmed' | 'pending' | 'blocked';
  booking?: Booking;
  blockedRecord?: BlockedDate;
  isCheckIn: boolean;
  isCheckOut: boolean;
}

export function getCalendarDayStatus(params: {
  villaId: string;
  dateStr: string;
  bookings: Booking[];
  blockedDates: BlockedDate[];
}): CalendarDayStatus {
  const { villaId, dateStr, bookings, blockedDates } = params;

  const villaBookings = bookings.filter(
    (b) => b.villaId === villaId && (b.status === 'confirmed' || b.status === 'pending')
  );

  const isCheckIn = villaBookings.some((b) => b.checkIn === dateStr);
  const isCheckOut = villaBookings.some((b) => b.checkOut === dateStr);

  // Check if blocked
  const blockedRecord = blockedDates.find((b) => b.villaId === villaId && b.date === dateStr);
  if (blockedRecord) {
    return {
      date: dateStr,
      state: 'blocked',
      blockedRecord,
      isCheckIn,
      isCheckOut,
    };
  }

  // Check if occupied on this night
  for (const b of villaBookings) {
    const nights = getStayNightDates(b.checkIn, b.checkOut);
    if (nights.includes(dateStr)) {
      return {
        date: dateStr,
        state: b.status === 'confirmed' ? 'confirmed' : 'pending',
        booking: b,
        isCheckIn,
        isCheckOut,
      };
    }
  }

  return {
    date: dateStr,
    state: 'available',
    isCheckIn,
    isCheckOut,
  };
}
