export type VillaLocation = 'Ubud' | 'Uluwatu' | 'Canggu' | 'Gianyar';

export interface Amenity {
  id: string;
  name: string;
  category: 'Outdoor & Pool' | 'Architecture & Living' | 'Bedroom & Bath' | 'Services & Tech';
  iconName: string;
}

export interface VillaImage {
  id: string;
  url: string;
  fallbackUrl: string;
  alt: string;
  caption: string;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
}

export interface Villa {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  location: VillaLocation;
  specificArea: string;
  distanceNote: string;
  concept: string;
  description: string;
  architecturalPhilosophy: string;
  architecturalHighlights: string[];
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  areaSqm: number;
  poolDimensions: string;
  basePricePerNight: number; // in IDR
  weekendPricePerNight: number; // in IDR (Fri/Sat)
  minStayNights: number;
  extraGuestFee: number; // in IDR per night above included guests
  includedGuests: number;
  amenities: string[];
  images: VillaImage[];
  checkInTime: string;
  checkOutTime: string;
  houseRules: string[];
  cancellationPolicy: string;
  published: boolean;
  featured: boolean;
  coordinates: {
    x: number; // % on illustrative Bali map
    y: number; // % on illustrative Bali map
  };
}

export interface SignatureExperience {
  id: string;
  title: string;
  category: 'Culinary' | 'Wellness' | 'Culture' | 'Leisure';
  shortDescription: string;
  fullDescription: string;
  duration: string;
  priceIdr: number;
  priceUnit: 'per stay' | 'per guest' | 'per couple';
  image: string;
  fallbackImage: string;
  highlights: string[];
  optionalNote: string;
}

export type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';
export type PaymentStatus = 'paid_simulated' | 'deposit_simulated' | 'pending_simulated' | 'refunded_simulated' | 'failed_simulated';
export type PaymentMethod = 'card' | 'bank_transfer' | 'ewallet';

export interface SelectedExtra {
  experienceId: string;
  title: string;
  priceIdr: number;
  quantity: number;
}

export interface Booking {
  id: string;
  reference: string; // e.g., AUR-2026-0001
  villaId: string;
  villaName: string;
  villaSlug: string;
  villaLocation: VillaLocation;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  nights: number;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCountry?: string;
  arrivalTime?: string;
  specialRequests?: string;
  nightlySubtotal: number;
  extrasTotal: number;
  selectedExtras: SelectedExtra[];
  discountAmount: number;
  promoCodeUsed?: string;
  serviceFeeAmount: number;
  taxAmount: number;
  totalAmount: number;
  depositAmount: number;
  paymentChoice: 'full' | 'deposit';
  amountSimulatedPaid: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  internalNotes: string;
  createdAt: string; // YYYY-MM-DD
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  bookingsCount: number;
  lastStayDate: string;
  totalSimulatedValue: number;
  notes: string;
  vipStatus: boolean;
}

export interface SeasonalRule {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  multiplier: number; // e.g., 1.25 for +25% peak season
  minStayOverride?: number;
  active: boolean;
}

export interface DatePriceOverride {
  id: string;
  villaId: string;
  date: string; // YYYY-MM-DD
  priceIdr: number;
  note: string;
}

export interface PromoCode {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 10 for 10% or 1500000 for IDR 1,500,000
  minNights: number;
  active: boolean;
  expiryDate: string;
}

export interface BlockedDate {
  id: string;
  villaId: string;
  date: string; // YYYY-MM-DD
  reason: string;
  createdBy: string;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  contactEmail: string;
  reservationsEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  address: string;
  instagramUrl: string;
  pinterestUrl: string;
  journalUrl: string;
  defaultCheckInTime: string;
  defaultCheckOutTime: string;
  defaultCancellationPolicy: string;
  taxPercentage: number; // e.g. 11% government tax
  serviceFeePercentage: number; // e.g. 10% hospitality service charge
  depositPercentage: number; // e.g. 50% deposit option
}

export interface Testimonial {
  id: string;
  guestName: string;
  origin: string;
  villaStayed: string;
  stayMonth: string;
  quote: string;
}

export interface NightlyRateDetail {
  date: string;
  rate: number;
  isWeekend: boolean;
  seasonalLabel?: string;
  isOverride?: boolean;
}

export interface PriceBreakdown {
  nights: number;
  nightlyRates: NightlyRateDetail[];
  averageNightlyRate: number;
  accommodationSubtotal: number;
  extraGuestTotal: number;
  extrasSubtotal: number;
  promoDiscount: number;
  promoCodeApplied?: string;
  taxableSubtotal: number;
  serviceFeeAmount: number;
  taxAmount: number;
  grandTotal: number;
  depositRequired: number;
}
