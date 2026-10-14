'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  BlockedDate,
  Booking,
  BookingStatus,
  DatePriceOverride,
  Guest,
  PaymentStatus,
  PromoCode,
  SeasonalRule,
  SelectedExtra,
  SiteSettings,
  Villa,
} from '@/types';
import { INITIAL_VILLAS } from '@/data/villas';
import { INITIAL_BOOKINGS } from '@/data/bookings';
import { INITIAL_GUESTS } from '@/data/guests';
import {
  INITIAL_BLOCKED_DATES,
  INITIAL_DATE_OVERRIDES,
  INITIAL_PROMO_CODES,
  INITIAL_SEASONAL_RULES,
} from '@/data/pricing';
import { INITIAL_SITE_SETTINGS } from '@/data/settings';
import { clearDemoStorage, loadFromStorage, saveToStorage } from '@/lib/storage';
import { generateBookingReference } from '@/lib/booking-reference';
import { getTodayIso } from '@/lib/date-utils';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface DraftBookingState {
  villaId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  selectedExtras: SelectedExtra[];
  promoCode: string;
  paymentChoice: 'full' | 'deposit';
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCountry: string;
  arrivalTime: string;
  specialRequests: string;
}

interface AppContextType {
  isHydrated: boolean;
  villas: Villa[];
  bookings: Booking[];
  guests: Guest[];
  seasonalRules: SeasonalRule[];
  dateOverrides: DatePriceOverride[];
  promoCodes: PromoCode[];
  blockedDates: BlockedDate[];
  settings: SiteSettings;
  isAdminAuthenticated: boolean;
  draftBooking: DraftBookingState;
  lastConfirmedBooking: Booking | null;
  toasts: ToastMessage[];

  // Toast helpers
  showToast: (title: string, description?: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;

  // Draft booking actions
  updateDraftBooking: (patch: Partial<DraftBookingState>) => void;
  resetDraftBooking: () => void;

  // Booking actions
  createBooking: (newBookingData: Omit<Booking, 'id' | 'reference' | 'createdAt'>) => Booking;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  updateBookingPaymentStatus: (bookingId: string, paymentStatus: PaymentStatus) => void;
  updateBookingNotes: (bookingId: string, notes: string) => void;
  cancelBooking: (bookingId: string, reasonNote?: string) => void;

  // Villa CRUD
  addVilla: (villaData: Omit<Villa, 'id'>) => Villa;
  updateVilla: (id: string, villaData: Partial<Villa>) => void;
  deleteVilla: (id: string) => void;
  toggleVillaPublished: (id: string) => void;

  // Calendar Blocked Dates
  toggleBlockDate: (villaId: string, dateStr: string, reason?: string) => void;
  addBlockedDateRange: (villaId: string, dates: string[], reason: string) => void;
  removeBlockedDate: (id: string) => void;

  // Pricing & Promotions
  addSeasonalRule: (rule: Omit<SeasonalRule, 'id'>) => { ok: boolean; error?: string };
  toggleSeasonalRule: (id: string) => void;
  deleteSeasonalRule: (id: string) => void;
  addDateOverride: (override: Omit<DatePriceOverride, 'id'>) => void;
  deleteDateOverride: (id: string) => void;
  addPromoCode: (promo: Omit<PromoCode, 'id'>) => { ok: boolean; error?: string };
  togglePromoCode: (id: string) => void;
  deletePromoCode: (id: string) => void;

  // Site Settings & Demo Reset
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  loginAdminDemo: () => void;
  logoutAdminDemo: () => void;
  resetDemoData: () => void;
}

const DEFAULT_DRAFT: DraftBookingState = {
  villaId: INITIAL_VILLAS[0].id,
  checkIn: '',
  checkOut: '',
  guests: 2,
  selectedExtras: [],
  promoCode: '',
  paymentChoice: 'full',
  guestName: '',
  guestEmail: '',
  guestPhone: '',
  guestCountry: '',
  arrivalTime: '15:00',
  specialRequests: '',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [villas, setVillas] = useState<Villa[]>(INITIAL_VILLAS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [guests, setGuests] = useState<Guest[]>(INITIAL_GUESTS);
  const [seasonalRules, setSeasonalRules] = useState<SeasonalRule[]>(INITIAL_SEASONAL_RULES);
  const [dateOverrides, setDateOverrides] = useState<DatePriceOverride[]>(INITIAL_DATE_OVERRIDES);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(INITIAL_PROMO_CODES);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>(INITIAL_BLOCKED_DATES);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [draftBooking, setDraftBooking] = useState<DraftBookingState>(DEFAULT_DRAFT);
  const [lastConfirmedBooking, setLastConfirmedBooking] = useState<Booking | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load persisted state on client mount
  useEffect(() => {
    setVillas(loadFromStorage('villas', INITIAL_VILLAS));
    setBookings(loadFromStorage('bookings', INITIAL_BOOKINGS));
    setGuests(loadFromStorage('guests', INITIAL_GUESTS));
    setSeasonalRules(loadFromStorage('seasonal_rules', INITIAL_SEASONAL_RULES));
    setDateOverrides(loadFromStorage('date_overrides', INITIAL_DATE_OVERRIDES));
    setPromoCodes(loadFromStorage('promo_codes', INITIAL_PROMO_CODES));
    setBlockedDates(loadFromStorage('blocked_dates', INITIAL_BLOCKED_DATES));
    setSettings(loadFromStorage('settings', INITIAL_SITE_SETTINGS));
    setIsAdminAuthenticated(loadFromStorage('admin_auth', false));
    setDraftBooking(loadFromStorage('draft_booking', DEFAULT_DRAFT));
    setLastConfirmedBooking(loadFromStorage('last_confirmed', null));
    setIsHydrated(true);
  }, []);

  // Persist changes once hydrated
  useEffect(() => {
    if (!isHydrated) return;
    saveToStorage('villas', villas);
  }, [villas, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveToStorage('bookings', bookings);
  }, [bookings, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveToStorage('guests', guests);
  }, [guests, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveToStorage('seasonal_rules', seasonalRules);
  }, [seasonalRules, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveToStorage('date_overrides', dateOverrides);
  }, [dateOverrides, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveToStorage('promo_codes', promoCodes);
  }, [promoCodes, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveToStorage('blocked_dates', blockedDates);
  }, [blockedDates, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveToStorage('settings', settings);
  }, [settings, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveToStorage('admin_auth', isAdminAuthenticated);
  }, [isAdminAuthenticated, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveToStorage('draft_booking', draftBooking);
  }, [draftBooking, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveToStorage('last_confirmed', lastConfirmedBooking);
  }, [lastConfirmedBooking, isHydrated]);

  const showToast = useCallback(
    (title: string, description?: string, type: ToastMessage['type'] = 'success') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { id, title, description, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateDraftBooking = useCallback((patch: Partial<DraftBookingState>) => {
    setDraftBooking((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetDraftBooking = useCallback(() => {
    setDraftBooking(DEFAULT_DRAFT);
  }, []);

  // Create Booking & Sync Guest Directory
  const createBooking = useCallback(
    (newBookingData: Omit<Booking, 'id' | 'reference' | 'createdAt'>): Booking => {
      const reference = generateBookingReference(bookings);
      const created: Booking = {
        ...newBookingData,
        id: `bk-${Date.now()}`,
        reference,
        createdAt: getTodayIso(),
      };

      setBookings((prev) => [created, ...prev]);
      setLastConfirmedBooking(created);

      // Update or create Guest profile
      setGuests((prevGuests) => {
        const existingIndex = prevGuests.findIndex(
          (g) => g.email.toLowerCase() === created.guestEmail.toLowerCase()
        );
        if (existingIndex >= 0) {
          const updated = [...prevGuests];
          const g = updated[existingIndex];
          updated[existingIndex] = {
            ...g,
            name: created.guestName,
            phone: created.guestPhone || g.phone,
            bookingsCount: g.bookingsCount + 1,
            lastStayDate: created.checkIn,
            totalSimulatedValue: g.totalSimulatedValue + created.totalAmount,
            vipStatus: g.bookingsCount + 1 >= 2 || g.totalSimulatedValue + created.totalAmount > 30000000,
          };
          return updated;
        }
        const newGuest: Guest = {
          id: `guest-${Date.now()}`,
          name: created.guestName,
          email: created.guestEmail,
          phone: created.guestPhone,
          country: created.guestCountry || 'International Guest (Demo)',
          bookingsCount: 1,
          lastStayDate: created.checkIn,
          totalSimulatedValue: created.totalAmount,
          notes: created.specialRequests || 'Created via online prototype booking journey.',
          vipStatus: created.totalAmount >= 30000000,
        };
        return [newGuest, ...prevGuests];
      });

      showToast(
        `Reservation ${reference} Confirmed`,
        `Simulated reservation for ${created.villaName} saved to browser state.`,
        'success'
      );
      return created;
    },
    [bookings, showToast]
  );

  const updateBookingStatus = useCallback(
    (bookingId: string, status: BookingStatus) => {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
      );
      showToast('Booking Status Updated', `Reservation status set to "${status}".`, 'info');
    },
    [showToast]
  );

  const updateBookingPaymentStatus = useCallback(
    (bookingId: string, paymentStatus: PaymentStatus) => {
      setBookings((prev) =>
        prev.map((b) => {
          if (b.id !== bookingId) return b;
          const amountSimulatedPaid =
            paymentStatus === 'paid_simulated'
              ? b.totalAmount
              : paymentStatus === 'deposit_simulated'
              ? b.depositAmount
              : 0;
          return { ...b, paymentStatus, amountSimulatedPaid };
        })
      );
      showToast('Simulated Payment Updated', `Payment state updated to "${paymentStatus}".`, 'info');
    },
    [showToast]
  );

  const updateBookingNotes = useCallback(
    (bookingId: string, internalNotes: string) => {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, internalNotes } : b))
      );
      showToast('Concierge Notes Saved', 'Internal reservation notes updated.', 'success');
    },
    [showToast]
  );

  const cancelBooking = useCallback(
    (bookingId: string, reasonNote?: string) => {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? {
                ...b,
                status: 'cancelled',
                paymentStatus: b.amountSimulatedPaid > 0 ? 'refunded_simulated' : 'failed_simulated',
                internalNotes: reasonNote
                  ? `${b.internalNotes ? b.internalNotes + ' | ' : ''}Cancelled: ${reasonNote}`
                  : b.internalNotes,
              }
            : b
        )
      );
      showToast('Reservation Cancelled', 'Villa availability has been released for these dates.', 'warning');
    },
    [showToast]
  );

  // Villa CRUD
  const addVilla = useCallback(
    (villaData: Omit<Villa, 'id'>): Villa => {
      const created: Villa = {
        ...villaData,
        id: `villa-${Date.now()}`,
      };
      setVillas((prev) => [...prev, created]);
      showToast('Villa Created', `${created.name} added to portfolio inventory.`, 'success');
      return created;
    },
    [showToast]
  );

  const updateVilla = useCallback(
    (id: string, villaData: Partial<Villa>) => {
      setVillas((prev) => prev.map((v) => (v.id === id ? { ...v, ...villaData } : v)));
      showToast('Villa Updated', 'Changes are now live across public and admin views.', 'success');
    },
    [showToast]
  );

  const deleteVilla = useCallback(
    (id: string) => {
      const target = villas.find((v) => v.id === id);
      setVillas((prev) => prev.filter((v) => v.id !== id));
      showToast('Villa Removed', `${target?.name || 'Property'} removed from demo inventory.`, 'warning');
    },
    [villas, showToast]
  );

  const toggleVillaPublished = useCallback(
    (id: string) => {
      setVillas((prev) =>
        prev.map((v) => {
          if (v.id !== id) return v;
          const nextState = !v.published;
          showToast(
            nextState ? 'Villa Published' : 'Villa Unpublished',
            `${v.name} is now ${nextState ? 'visible' : 'hidden'} on public discovery pages.`,
            'info'
          );
          return { ...v, published: nextState };
        })
      );
    },
    [showToast]
  );

  // Calendar Blocked Dates
  const toggleBlockDate = useCallback(
    (villaId: string, dateStr: string, reason = 'Manual Admin Hold') => {
      setBlockedDates((prev) => {
        const existing = prev.find((b) => b.villaId === villaId && b.date === dateStr);
        if (existing) {
          showToast('Date Unblocked', `${dateStr} is now open for guest bookings.`, 'info');
          return prev.filter((b) => b.id !== existing.id);
        }
        const created: BlockedDate = {
          id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
          villaId,
          date: dateStr,
          reason,
          createdBy: 'Admin Demo User',
        };
        showToast('Date Blocked', `${dateStr} marked as unavailable (${reason}).`, 'warning');
        return [...prev, created];
      });
    },
    [showToast]
  );

  const addBlockedDateRange = useCallback(
    (villaId: string, dates: string[], reason: string) => {
      setBlockedDates((prev) => {
        const existingSet = new Set(prev.filter((b) => b.villaId === villaId).map((b) => b.date));
        const newBlocks: BlockedDate[] = dates
          .filter((d) => !existingSet.has(d))
          .map((d, idx) => ({
            id: `block-${Date.now()}-${idx}`,
            villaId,
            date: d,
            reason: reason || 'Scheduled Maintenance Hold',
            createdBy: 'Admin Demo User',
          }));
        return [...prev, ...newBlocks];
      });
      showToast('Dates Blocked', `${dates.length} date(s) blocked on availability calendar.`, 'warning');
    },
    [showToast]
  );

  const removeBlockedDate = useCallback(
    (id: string) => {
      setBlockedDates((prev) => prev.filter((b) => b.id !== id));
      showToast('Hold Removed', 'Date is now available for booking.', 'info');
    },
    [showToast]
  );

  // Pricing & Promotions
  const addSeasonalRule = useCallback(
    (rule: Omit<SeasonalRule, 'id'>): { ok: boolean; error?: string } => {
      if (!rule.name || !rule.startDate || !rule.endDate) {
        return { ok: false, error: 'Name, start date, and end date are required.' };
      }
      if (rule.endDate < rule.startDate) {
        return { ok: false, error: 'End date must be on or after start date.' };
      }
      // Check overlapping seasonal period
      const overlap = seasonalRules.find(
        (existing) =>
          existing.active &&
          !(rule.endDate < existing.startDate || rule.startDate > existing.endDate)
      );
      if (overlap) {
        return {
          ok: false,
          error: `Dates overlap with existing active seasonal rule "${overlap.name}" (${overlap.startDate} to ${overlap.endDate}).`,
        };
      }
      const created: SeasonalRule = { ...rule, id: `season-${Date.now()}` };
      setSeasonalRules((prev) => [...prev, created]);
      showToast('Seasonal Rule Added', `${created.name} (${created.multiplier}x) is now active.`, 'success');
      return { ok: true };
    },
    [seasonalRules, showToast]
  );

  const toggleSeasonalRule = useCallback((id: string) => {
    setSeasonalRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  }, []);

  const deleteSeasonalRule = useCallback(
    (id: string) => {
      setSeasonalRules((prev) => prev.filter((r) => r.id !== id));
      showToast('Seasonal Rule Deleted', 'Pricing rule removed.', 'info');
    },
    [showToast]
  );

  const addDateOverride = useCallback(
    (override: Omit<DatePriceOverride, 'id'>) => {
      setDateOverrides((prev) => {
        const filtered = prev.filter(
          (o) => !(o.villaId === override.villaId && o.date === override.date)
        );
        return [...filtered, { ...override, id: `override-${Date.now()}` }];
      });
      showToast('Date Override Saved', `Custom rate set for ${override.date}.`, 'success');
    },
    [showToast]
  );

  const deleteDateOverride = useCallback(
    (id: string) => {
      setDateOverrides((prev) => prev.filter((o) => o.id !== id));
      showToast('Override Removed', 'Reverted to standard/seasonal nightly rate.', 'info');
    },
    [showToast]
  );

  const addPromoCode = useCallback(
    (promo: Omit<PromoCode, 'id'>): { ok: boolean; error?: string } => {
      const normalized = promo.code.trim().toUpperCase();
      if (!normalized) return { ok: false, error: 'Promo code is required.' };
      if (promoCodes.some((p) => p.code.toUpperCase() === normalized)) {
        return { ok: false, error: `Promo code "${normalized}" already exists.` };
      }
      const created: PromoCode = { ...promo, code: normalized, id: `promo-${Date.now()}` };
      setPromoCodes((prev) => [...prev, created]);
      showToast('Promotion Created', `Code ${normalized} is now available for checkout.`, 'success');
      return { ok: true };
    },
    [promoCodes, showToast]
  );

  const togglePromoCode = useCallback((id: string) => {
    setPromoCodes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  }, []);

  const deletePromoCode = useCallback(
    (id: string) => {
      setPromoCodes((prev) => prev.filter((p) => p.id !== id));
      showToast('Promotion Removed', 'Promo code deleted.', 'info');
    },
    [showToast]
  );

  const updateSettings = useCallback(
    (newSettings: Partial<SiteSettings>) => {
      setSettings((prev) => ({ ...prev, ...newSettings }));
      showToast('Site Settings Updated', 'Brand and policy changes applied across the prototype.', 'success');
    },
    [showToast]
  );

  const loginAdminDemo = useCallback(() => {
    setIsAdminAuthenticated(true);
    showToast('Entered Demo Admin Dashboard', 'Simulated executive hospitality session active.', 'info');
  }, [showToast]);

  const logoutAdminDemo = useCallback(() => {
    setIsAdminAuthenticated(false);
    showToast('Signed Out of Demo Admin', 'Returned to public preview mode.', 'info');
  }, [showToast]);

  const resetDemoData = useCallback(() => {
    clearDemoStorage();
    setVillas(INITIAL_VILLAS);
    setBookings(INITIAL_BOOKINGS);
    setGuests(INITIAL_GUESTS);
    setSeasonalRules(INITIAL_SEASONAL_RULES);
    setDateOverrides(INITIAL_DATE_OVERRIDES);
    setPromoCodes(INITIAL_PROMO_CODES);
    setBlockedDates(INITIAL_BLOCKED_DATES);
    setSettings(INITIAL_SITE_SETTINGS);
    setDraftBooking(DEFAULT_DRAFT);
    setLastConfirmedBooking(null);
    showToast(
      'Demo Data Restored',
      'All villas, reservations, pricing rules, and site settings have been reset to their original seed state.',
      'success'
    );
  }, [showToast]);

  return (
    <AppContext.Provider
      value={{
        isHydrated,
        villas,
        bookings,
        guests,
        seasonalRules,
        dateOverrides,
        promoCodes,
        blockedDates,
        settings,
        isAdminAuthenticated,
        draftBooking,
        lastConfirmedBooking,
        toasts,
        showToast,
        dismissToast,
        updateDraftBooking,
        resetDraftBooking,
        createBooking,
        updateBookingStatus,
        updateBookingPaymentStatus,
        updateBookingNotes,
        cancelBooking,
        addVilla,
        updateVilla,
        deleteVilla,
        toggleVillaPublished,
        toggleBlockDate,
        addBlockedDateRange,
        removeBlockedDate,
        addSeasonalRule,
        toggleSeasonalRule,
        deleteSeasonalRule,
        addDateOverride,
        deleteDateOverride,
        addPromoCode,
        togglePromoCode,
        deletePromoCode,
        updateSettings,
        loginAdminDemo,
        logoutAdminDemo,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
