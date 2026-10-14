import {
  addDays,
  differenceInCalendarDays,
  eachDayOfInterval,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isValid,
  parseISO,
  startOfDay,
} from 'date-fns';

export function safeParseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const parsed = parseISO(dateStr);
  return isValid(parsed) ? startOfDay(parsed) : null;
}

export function formatDisplayDate(dateStr: string, fmt = 'dd MMM yyyy'): string {
  const parsed = safeParseDate(dateStr);
  if (!parsed) return dateStr || '—';
  return format(parsed, fmt);
}

export function getTodayIso(): string {
  return format(startOfDay(new Date()), 'yyyy-MM-dd');
}

export function getFutureIso(daysFromNow: number): string {
  return format(addDays(startOfDay(new Date()), daysFromNow), 'yyyy-MM-dd');
}

export function getNightsCount(checkInStr: string, checkOutStr: string): number {
  const start = safeParseDate(checkInStr);
  const end = safeParseDate(checkOutStr);
  if (!start || !end) return 0;
  const diff = differenceInCalendarDays(end, start);
  return diff > 0 ? diff : 0;
}

/**
 * Returns array of YYYY-MM-DD strings for each night of stay [checkIn, checkOut - 1 day]
 */
export function getStayNightDates(checkInStr: string, checkOutStr: string): string[] {
  const start = safeParseDate(checkInStr);
  const end = safeParseDate(checkOutStr);
  if (!start || !end || !isAfter(end, start)) return [];
  const lastNight = addDays(end, -1);
  const days = eachDayOfInterval({ start, end: lastNight });
  return days.map((d) => format(d, 'yyyy-MM-dd'));
}

export function isPastDate(dateStr: string): boolean {
  const parsed = safeParseDate(dateStr);
  if (!parsed) return false;
  const today = startOfDay(new Date());
  return isBefore(parsed, today);
}

export function isWeekendNight(dateStr: string): boolean {
  const parsed = safeParseDate(dateStr);
  if (!parsed) return false;
  const day = parsed.getDay();
  // Friday (5) and Saturday (6) nights are weekend nights in hospitality
  return day === 5 || day === 6;
}

export function isDateInRangeInclusive(dateStr: string, startStr: string, endStr: string): boolean {
  const d = safeParseDate(dateStr);
  const s = safeParseDate(startStr);
  const e = safeParseDate(endStr);
  if (!d || !s || !e) return false;
  return (isAfter(d, s) || isSameDay(d, s)) && (isBefore(d, e) || isSameDay(d, e));
}
