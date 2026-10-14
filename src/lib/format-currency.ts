export function formatIdr(amount: number, compact = false): string {
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    return 'IDR 0';
  }
  const rounded = Math.round(amount);
  if (compact) {
    if (Math.abs(rounded) >= 1_000_000_000) {
      return `IDR ${(rounded / 1_000_000_000).toFixed(2)}B`;
    }
    if (Math.abs(rounded) >= 1_000_000) {
      const m = rounded / 1_000_000;
      return `IDR ${Number.isInteger(m) ? m.toFixed(0) : m.toFixed(1)}M`;
    }
  }
  return `IDR ${rounded.toLocaleString('en-US')}`;
}
