import {
  DatePriceOverride,
  NightlyRateDetail,
  PriceBreakdown,
  PromoCode,
  SeasonalRule,
  SelectedExtra,
  SiteSettings,
  Villa,
} from '@/types';
import { getStayNightDates, isDateInRangeInclusive, isWeekendNight } from './date-utils';

/**
 * Centralized pricing calculation utility used across:
 * - Villa Detail Widget
 * - Booking Review Step
 * - Checkout Order Summary
 * - Admin Booking & Pricing Simulation
 *
 * Priority Order for Nightly Rate:
 * 1. Date-Specific Override for that Villa & Date
 * 2. Active Seasonal Rule Multiplier (applied to Base Rate)
 * 3. Weekend Rate (Friday & Saturday nights)
 * 4. Base Nightly Rate
 */
export function calculateStayPrice(params: {
  villa: Villa;
  checkIn: string;
  checkOut: string;
  guests: number;
  selectedExtras?: SelectedExtra[];
  promoCodeInput?: string;
  seasonalRules: SeasonalRule[];
  dateOverrides: DatePriceOverride[];
  promoCodes: PromoCode[];
  settings: SiteSettings;
}): PriceBreakdown {
  const {
    villa,
    checkIn,
    checkOut,
    guests,
    selectedExtras = [],
    promoCodeInput = '',
    seasonalRules,
    dateOverrides,
    promoCodes,
    settings,
  } = params;

  const nightDates = getStayNightDates(checkIn, checkOut);
  const nights = nightDates.length;

  const nightlyRates: NightlyRateDetail[] = nightDates.map((dateStr) => {
    const weekend = isWeekendNight(dateStr);

    // 1. Check Date Override
    const override = dateOverrides.find((o) => o.villaId === villa.id && o.date === dateStr);
    if (override) {
      return {
        date: dateStr,
        rate: override.priceIdr,
        isWeekend: weekend,
        seasonalLabel: override.note || 'Custom Date Rate',
        isOverride: true,
      };
    }

    // 2. Check Active Seasonal Rule
    const activeSeason = seasonalRules.find(
      (s) => s.active && isDateInRangeInclusive(dateStr, s.startDate, s.endDate)
    );
    if (activeSeason) {
      const base = weekend ? villa.weekendPricePerNight : villa.basePricePerNight;
      return {
        date: dateStr,
        rate: Math.round(base * activeSeason.multiplier),
        isWeekend: weekend,
        seasonalLabel: activeSeason.name,
      };
    }

    // 3. Weekend vs Base Rate
    return {
      date: dateStr,
      rate: weekend ? villa.weekendPricePerNight : villa.basePricePerNight,
      isWeekend: weekend,
    };
  });

  const accommodationSubtotal = nightlyRates.reduce((acc, item) => acc + item.rate, 0);
  const averageNightlyRate = nights > 0 ? Math.round(accommodationSubtotal / nights) : villa.basePricePerNight;

  // Extra guest fee if guest count exceeds includedGuests (or if configured)
  const extraGuestsCount = Math.max(0, guests - villa.includedGuests);
  const extraGuestTotal = extraGuestsCount * villa.extraGuestFee * Math.max(1, nights);

  // Optional signature experiences / extras
  const extrasSubtotal = selectedExtras.reduce((sum, extra) => sum + extra.priceIdr * extra.quantity, 0);

  // Promo code calculation
  let promoDiscount = 0;
  let promoCodeApplied: string | undefined;

  const normalizedPromo = promoCodeInput.trim().toUpperCase();
  if (normalizedPromo && nights > 0) {
    const matchedPromo = promoCodes.find((p) => p.active && p.code.toUpperCase() === normalizedPromo);
    if (matchedPromo && nights >= matchedPromo.minNights) {
      promoCodeApplied = matchedPromo.code;
      if (matchedPromo.discountType === 'percentage') {
        promoDiscount = Math.round((accommodationSubtotal * matchedPromo.discountValue) / 100);
      } else {
        promoDiscount = Math.min(accommodationSubtotal, matchedPromo.discountValue);
      }
    }
  }

  const taxableSubtotal = Math.max(0, accommodationSubtotal + extraGuestTotal + extrasSubtotal - promoDiscount);
  const serviceFeeAmount = Math.round((taxableSubtotal * settings.serviceFeePercentage) / 100);
  const taxAmount = Math.round(((taxableSubtotal + serviceFeeAmount) * settings.taxPercentage) / 100);
  const grandTotal = taxableSubtotal + serviceFeeAmount + taxAmount;
  const depositRequired = Math.round((grandTotal * settings.depositPercentage) / 100);

  return {
    nights,
    nightlyRates,
    averageNightlyRate,
    accommodationSubtotal,
    extraGuestTotal,
    extrasSubtotal,
    promoDiscount,
    promoCodeApplied,
    taxableSubtotal,
    serviceFeeAmount,
    taxAmount,
    grandTotal,
    depositRequired,
  };
}
