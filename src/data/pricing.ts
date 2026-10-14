import { SeasonalRule, DatePriceOverride, PromoCode, BlockedDate } from '@/types';
import { addDays, format } from 'date-fns';

const today = new Date();
const fmt = (offsetDays: number) => format(addDays(today, offsetDays), 'yyyy-MM-dd');

export const INITIAL_SEASONAL_RULES: SeasonalRule[] = [
  {
    id: 'season-high-dry',
    name: 'Late Dry Season & Cultural Festival Peak',
    startDate: '2026-07-01',
    endDate: '2026-09-15',
    multiplier: 1.2,
    minStayOverride: 3,
    active: true,
  },
  {
    id: 'season-festive-year-end',
    name: 'Year-End Festive Sanctuary Season',
    startDate: '2026-12-18',
    endDate: '2027-01-08',
    multiplier: 1.35,
    minStayOverride: 4,
    active: true,
  },
];

export const INITIAL_DATE_OVERRIDES: DatePriceOverride[] = [
  {
    id: 'override-1',
    villaId: 'villa-solara-cliff',
    date: fmt(10),
    priceIdr: 5800000,
    note: 'Full Moon Cliffside Acoustic Gathering Demand',
  },
  {
    id: 'override-2',
    villaId: 'villa-ubud-sanctuary',
    date: fmt(14),
    priceIdr: 2900000,
    note: 'Ubud Writers & Artisans Weekend Rate',
  },
];

export const INITIAL_PROMO_CODES: PromoCode[] = [
  {
    id: 'promo-island10',
    code: 'ISLAND10',
    description: '10% welcome privilege on accommodation for stays of 2+ nights',
    discountType: 'percentage',
    discountValue: 10,
    minNights: 2,
    active: true,
    expiryDate: '2027-12-31',
  },
  {
    id: 'promo-sanctuary15',
    code: 'SANCTUARY15',
    description: '15% extended retreat privilege for stays of 4+ nights',
    discountType: 'percentage',
    discountValue: 15,
    minNights: 4,
    active: true,
    expiryDate: '2027-12-31',
  },
  {
    id: 'promo-longerstay',
    code: 'LONGERSTAY',
    description: 'IDR 1,500,000 complimentary credit on stays of 3+ nights',
    discountType: 'fixed',
    discountValue: 1500000,
    minNights: 3,
    active: true,
    expiryDate: '2027-12-31',
  },
];

export const INITIAL_BLOCKED_DATES: BlockedDate[] = [
  {
    id: 'block-1',
    villaId: 'villa-ubud-sanctuary',
    date: fmt(18),
    reason: 'Annual Teak Oil Preservation & Stone Courtyard Care',
    createdBy: 'Estate Operations (Demo)',
  },
  {
    id: 'block-2',
    villaId: 'villa-ubud-sanctuary',
    date: fmt(19),
    reason: 'Annual Teak Oil Preservation & Stone Courtyard Care',
    createdBy: 'Estate Operations (Demo)',
  },
  {
    id: 'block-3',
    villaId: 'villa-casa-senja',
    date: fmt(11),
    reason: 'Architectural Editorial Photo Shoot Hold',
    createdBy: 'Brand Director (Demo)',
  },
  {
    id: 'block-4',
    villaId: 'villa-tirtha-estate',
    date: fmt(22),
    reason: 'Owner Private Family Residence Hold',
    createdBy: 'Estate Owner (Demo)',
  },
];
