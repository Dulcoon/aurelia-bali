import { Booking } from '@/types';

export function generateBookingReference(existingBookings: Booking[]): string {
  const year = new Date().getFullYear() >= 2026 ? new Date().getFullYear() : 2026;
  let maxNumber = 8;

  for (const b of existingBookings) {
    const match = b.reference.match(/AUR-\d{4}-(\d+)/);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (!Number.isNaN(num) && num > maxNumber) {
        maxNumber = num;
      }
    }
  }

  const nextNum = String(maxNumber + 1).padStart(4, '0');
  return `AUR-${year}-${nextNum}`;
}
