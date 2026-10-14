'use client';

import React, { useState } from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import { useApp } from '@/context/AppContext';
import { formatIdr } from '@/lib/format-currency';
import { Plus, Trash2, Tag, Calendar, Percent, Save } from 'lucide-react';

export default function AdminPricingPage() {
  const {
    villas,
    updateVilla,
    seasonalRules,
    addSeasonalRule,
    toggleSeasonalRule,
    deleteSeasonalRule,
    dateOverrides,
    addDateOverride,
    deleteDateOverride,
    promoCodes,
    addPromoCode,
    togglePromoCode,
    deletePromoCode,
    settings,
    updateSettings,
  } = useApp();

  // New seasonal rule state
  const [seasonName, setSeasonName] = useState('');
  const [seasonStart, setSeasonStart] = useState('2026-11-01');
  const [seasonEnd, setSeasonEnd] = useState('2026-11-15');
  const [seasonMultiplier, setSeasonMultiplier] = useState(1.15);
  const [seasonError, setSeasonError] = useState<string | null>(null);

  // New date override state
  const [overrideVillaId, setOverrideVillaId] = useState(villas[0]?.id || '');
  const [overrideDate, setOverrideDate] = useState('2026-10-31');
  const [overridePrice, setOverridePrice] = useState(3500000);
  const [overrideNote, setOverrideNote] = useState('Special Cultural Event Night');

  // New promo code state
  const [promoCodeStr, setPromoCodeStr] = useState('');
  const [promoDesc, setPromoDesc] = useState('');
  const [promoType, setPromoType] = useState<'percentage' | 'fixed'>('percentage');
  const [promoVal, setPromoVal] = useState(12);
  const [promoMinNights, setPromoMinNights] = useState(2);
  const [promoError, setPromoError] = useState<string | null>(null);

  const handleCreateSeason = (e: React.FormEvent) => {
    e.preventDefault();
    setSeasonError(null);
    const res = addSeasonalRule({
      name: seasonName.trim(),
      startDate: seasonStart,
      endDate: seasonEnd,
      multiplier: Number(seasonMultiplier),
      active: true,
    });
    if (!res.ok) {
      setSeasonError(res.error || 'Invalid seasonal rule.');
    } else {
      setSeasonName('');
    }
  };

  const handleCreateOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideVillaId || !overrideDate || overridePrice <= 0) return;
    addDateOverride({
      villaId: overrideVillaId,
      date: overrideDate,
      priceIdr: Number(overridePrice),
      note: overrideNote.trim(),
    });
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    const res = addPromoCode({
      code: promoCodeStr,
      description: promoDesc.trim() || 'Special sanctuary promotional privilege',
      discountType: promoType,
      discountValue: Number(promoVal),
      minNights: Number(promoMinNights),
      active: true,
      expiryDate: '2027-12-31',
    });
    if (!res.ok) {
      setPromoError(res.error || 'Could not add promo code.');
    } else {
      setPromoCodeStr('');
      setPromoDesc('');
    }
  };

  return (
    <AdminShell
      title="Dynamic Pricing, Taxes & Promotions"
      subtitle="Configure base and weekend rates, seasonal multipliers, date overrides, and checkout promo codes."
      breadcrumbs={[{ label: 'Pricing & Promos' }]}
    >
      {/* 1. Per-Villa Base, Weekend, Min Stay & Extra Guest Pricing */}
      <section className="bg-white border border-stone p-6 space-y-4">
        <div>
          <h2 className="font-serif text-2xl text-charcoal">
            1. Villa Base Rates, Weekend Pricing & Minimum Stay
          </h2>
          <p className="text-xs text-charcoal/65">
            Edits apply immediately to the centralized pricing engine across all public pages.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-ivory border-b border-stone text-[11px] uppercase tracking-wider text-charcoal/70">
                <th className="py-3 px-4">Sanctuary</th>
                <th className="py-3 px-4">Base Nightly (IDR)</th>
                <th className="py-3 px-4">Weekend Fri/Sat (IDR)</th>
                <th className="py-3 px-4">Min Stay (Nights)</th>
                <th className="py-3 px-4">Extra Guest Fee (IDR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone/60">
              {villas.map((v) => (
                <tr key={v.id}>
                  <td className="py-3.5 px-4 font-medium text-charcoal">
                    {v.name}
                    <span className="block text-[10px] text-charcoal/60">{v.location}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <input
                      type="number"
                      step={100000}
                      value={v.basePricePerNight}
                      onChange={(e) =>
                        updateVilla(v.id, { basePricePerNight: Math.max(100000, Number(e.target.value)) })
                      }
                      className="bg-ivory border border-stone px-3 py-1.5 w-36"
                    />
                  </td>
                  <td className="py-3.5 px-4">
                    <input
                      type="number"
                      step={100000}
                      value={v.weekendPricePerNight}
                      onChange={(e) =>
                        updateVilla(v.id, {
                          weekendPricePerNight: Math.max(100000, Number(e.target.value)),
                        })
                      }
                      className="bg-ivory border border-stone px-3 py-1.5 w-36"
                    />
                  </td>
                  <td className="py-3.5 px-4">
                    <input
                      type="number"
                      min={1}
                      max={14}
                      value={v.minStayNights}
                      onChange={(e) =>
                        updateVilla(v.id, { minStayNights: Math.max(1, Number(e.target.value)) })
                      }
                      className="bg-ivory border border-stone px-3 py-1.5 w-20"
                    />
                  </td>
                  <td className="py-3.5 px-4">
                    <input
                      type="number"
                      step={50000}
                      value={v.extraGuestFee}
                      onChange={(e) =>
                        updateVilla(v.id, { extraGuestFee: Math.max(0, Number(e.target.value)) })
                      }
                      className="bg-ivory border border-stone px-3 py-1.5 w-32"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Seasonal Rules & Date Overrides */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Seasonal Price Periods */}
        <section className="lg:col-span-6 bg-white border border-stone p-6 space-y-5 text-xs">
          <div>
            <h2 className="font-serif text-2xl text-charcoal">2. Seasonal Rate Multipliers</h2>
            <p className="text-charcoal/65">
              Prevent overlapping active seasons. Rule priority: Date Override → Seasonal Rule → Weekend → Base.
            </p>
          </div>

          <div className="space-y-2.5">
            {seasonalRules.map((rule) => (
              <div
                key={rule.id}
                className="p-3.5 bg-ivory border border-stone flex items-center justify-between gap-3"
              >
                <div>
                  <p className="font-medium text-charcoal">{rule.name}</p>
                  <p className="text-[11px] text-charcoal/65">
                    {rule.startDate} to {rule.endDate} • Multiplier: <strong>{rule.multiplier}x</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSeasonalRule(rule.id)}
                    className={`px-2.5 py-1 text-[11px] uppercase border ${
                      rule.active
                        ? 'bg-deepGreen text-ivory border-deepGreen'
                        : 'bg-white text-charcoal/60 border-stone'
                    }`}
                  >
                    {rule.active ? 'Active' : 'Paused'}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSeasonalRule(rule.id)}
                    className="p-1.5 text-red-800 hover:bg-red-900/10"
                    aria-label="Delete seasonal rule"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleCreateSeason} className="pt-4 border-t border-stone space-y-3">
            <p className="uppercase tracking-wider text-bronze font-medium">
              Add Seasonal Period
            </p>
            {seasonError && (
              <div className="p-3 bg-red-900/10 border border-red-800/30 text-red-900">
                {seasonError}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  required
                  value={seasonName}
                  onChange={(e) => setSeasonName(e.target.value)}
                  placeholder="Season Name (e.g. Easter Island Retreat Peak)"
                  className="w-full bg-ivory border border-stone px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-charcoal/60 mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={seasonStart}
                  onChange={(e) => setSeasonStart(e.target.value)}
                  className="w-full bg-ivory border border-stone px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-charcoal/60 mb-1">End Date</label>
                <input
                  type="date"
                  required
                  value={seasonEnd}
                  onChange={(e) => setSeasonEnd(e.target.value)}
                  className="w-full bg-ivory border border-stone px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-charcoal/60 mb-1">
                  Rate Multiplier (e.g. 1.25 = +25%)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0.5"
                  max="3.0"
                  value={seasonMultiplier}
                  onChange={(e) => setSeasonMultiplier(Number(e.target.value))}
                  className="w-full bg-ivory border border-stone px-3 py-2"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-deepGreen text-ivory py-2.5 px-4 uppercase tracking-wider inline-flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Season
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Date-Specific Overrides */}
        <section className="lg:col-span-6 bg-white border border-stone p-6 space-y-5 text-xs">
          <div>
            <h2 className="font-serif text-2xl text-charcoal">3. Date-Specific Rate Overrides</h2>
            <p className="text-charcoal/65">
              Set an exact nightly rate for a specific villa and date (highest priority).
            </p>
          </div>

          <div className="space-y-2.5">
            {dateOverrides.map((ov) => {
              const vName = villas.find((v) => v.id === ov.villaId)?.name || ov.villaId;
              return (
                <div
                  key={ov.id}
                  className="p-3.5 bg-ivory border border-stone flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-medium text-charcoal">
                      {vName} — <span className="text-deepGreen">{ov.date}</span>
                    </p>
                    <p className="text-[11px] text-charcoal/70">
                      Override Rate: <strong>{formatIdr(ov.priceIdr)}</strong> ({ov.note})
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteDateOverride(ov.id)}
                    className="p-1.5 text-red-800 hover:bg-red-900/10"
                    aria-label="Delete date override"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleCreateOverride} className="pt-4 border-t border-stone space-y-3">
            <p className="uppercase tracking-wider text-bronze font-medium">
              Add Date Override
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase text-charcoal/60 mb-1">Villa</label>
                <select
                  value={overrideVillaId}
                  onChange={(e) => setOverrideVillaId(e.target.value)}
                  className="w-full bg-ivory border border-stone px-3 py-2"
                >
                  {villas.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase text-charcoal/60 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={overrideDate}
                  onChange={(e) => setOverrideDate(e.target.value)}
                  className="w-full bg-ivory border border-stone px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-charcoal/60 mb-1">
                  Override Nightly Price (IDR)
                </label>
                <input
                  type="number"
                  step={100000}
                  value={overridePrice}
                  onChange={(e) => setOverridePrice(Number(e.target.value))}
                  className="w-full bg-ivory border border-stone px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-charcoal/60 mb-1">Reason / Note</label>
                <input
                  type="text"
                  value={overrideNote}
                  onChange={(e) => setOverrideNote(e.target.value)}
                  className="w-full bg-ivory border border-stone px-3 py-2"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-deepGreen text-ivory py-2.5 px-4 uppercase tracking-wider inline-flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Save Date Override
            </button>
          </form>
        </section>
      </div>

      {/* 4. Promo Codes & Taxes/Fees */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 bg-white border border-stone p-6 space-y-5 text-xs">
          <div>
            <h2 className="font-serif text-2xl text-charcoal">4. Promotional Codes</h2>
            <p className="text-charcoal/65">
              Active codes can be applied by guests on the Booking Review page.
            </p>
          </div>

          <div className="space-y-2.5">
            {promoCodes.map((promo) => (
              <div
                key={promo.id}
                className="p-3.5 bg-ivory border border-stone flex items-center justify-between gap-3"
              >
                <div>
                  <span className="font-mono font-semibold text-sm text-deepGreen">
                    {promo.code}
                  </span>
                  <span className="ml-2 text-charcoal/75">
                    —{' '}
                    {promo.discountType === 'percentage'
                      ? `${promo.discountValue}% Off`
                      : `${formatIdr(promo.discountValue)} Off`}{' '}
                    (Min {promo.minNights} nights)
                  </span>
                  <p className="text-[11px] text-charcoal/60 mt-0.5">{promo.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => togglePromoCode(promo.id)}
                    className={`px-2.5 py-1 text-[11px] uppercase border ${
                      promo.active
                        ? 'bg-deepGreen text-ivory border-deepGreen'
                        : 'bg-white text-charcoal/60 border-stone'
                    }`}
                  >
                    {promo.active ? 'Enabled' : 'Disabled'}
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePromoCode(promo.id)}
                    className="p-1.5 text-red-800 hover:bg-red-900/10"
                    aria-label="Delete promo code"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleCreatePromo} className="pt-4 border-t border-stone space-y-3">
            <p className="uppercase tracking-wider text-bronze font-medium">
              Create New Promo Code
            </p>
            {promoError && (
              <div className="p-3 bg-red-900/10 border border-red-800/30 text-red-900">
                {promoError}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] uppercase text-charcoal/60 mb-1">Code *</label>
                <input
                  type="text"
                  required
                  value={promoCodeStr}
                  onChange={(e) => setPromoCodeStr(e.target.value.toUpperCase())}
                  placeholder="BALI20"
                  className="w-full bg-ivory border border-stone px-3 py-2 uppercase"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-charcoal/60 mb-1">Type</label>
                <select
                  value={promoType}
                  onChange={(e) => setPromoType(e.target.value as 'percentage' | 'fixed')}
                  className="w-full bg-ivory border border-stone px-3 py-2"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed IDR Amount</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase text-charcoal/60 mb-1">
                  Value ({promoType === 'percentage' ? '%' : 'IDR'})
                </label>
                <input
                  type="number"
                  min={1}
                  value={promoVal}
                  onChange={(e) => setPromoVal(Number(e.target.value))}
                  className="w-full bg-ivory border border-stone px-3 py-2"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase text-charcoal/60 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={promoDesc}
                  onChange={(e) => setPromoDesc(e.target.value)}
                  placeholder="Seasonal island retreat privilege..."
                  className="w-full bg-ivory border border-stone px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-charcoal/60 mb-1">
                  Min Nights
                </label>
                <input
                  type="number"
                  min={1}
                  value={promoMinNights}
                  onChange={(e) => setPromoMinNights(Number(e.target.value))}
                  className="w-full bg-ivory border border-stone px-3 py-2"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-deepGreen text-ivory py-2.5 px-4 uppercase tracking-wider inline-flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Promo Code
            </button>
          </form>
        </section>

        {/* Taxes & Service Charges */}
        <section className="lg:col-span-5 bg-white border border-stone p-6 space-y-5 text-xs">
          <div>
            <h2 className="font-serif text-2xl text-charcoal">
              5. Global Taxes, Service Fees & Deposit
            </h2>
            <p className="text-charcoal/65">
              Applied across all villa price breakdowns and checkout summaries.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
                Hospitality Service Fee (%)
              </label>
              <input
                type="number"
                min={0}
                max={30}
                value={settings.serviceFeePercentage}
                onChange={(e) =>
                  updateSettings({ serviceFeePercentage: Math.max(0, Number(e.target.value)) })
                }
                className="w-full bg-ivory border border-stone px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
                Government Tax (%)
              </label>
              <input
                type="number"
                min={0}
                max={30}
                value={settings.taxPercentage}
                onChange={(e) =>
                  updateSettings({ taxPercentage: Math.max(0, Number(e.target.value)) })
                }
                className="w-full bg-ivory border border-stone px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
                Optional Deposit Percentage (%)
              </label>
              <input
                type="number"
                min={10}
                max={100}
                value={settings.depositPercentage}
                onChange={(e) =>
                  updateSettings({
                    depositPercentage: Math.min(100, Math.max(10, Number(e.target.value))),
                  })
                }
                className="w-full bg-ivory border border-stone px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
