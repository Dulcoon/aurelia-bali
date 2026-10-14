'use client';

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import { useApp } from '@/context/AppContext';
import { Save, RotateCcw, ShieldAlert } from 'lucide-react';

export default function AdminSettingsPage() {
  const { settings, updateSettings, resetDemoData } = useApp();

  const [brandName, setBrandName] = useState(settings.brandName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [contactEmail, setContactEmail] = useState(settings.contactEmail);
  const [reservationsEmail, setReservationsEmail] = useState(settings.reservationsEmail);
  const [contactPhone, setContactPhone] = useState(settings.contactPhone);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [address, setAddress] = useState(settings.address);
  const [instagramUrl, setInstagramUrl] = useState(settings.instagramUrl);
  const [pinterestUrl, setPinterestUrl] = useState(settings.pinterestUrl);
  const [defaultCheckInTime, setDefaultCheckInTime] = useState(settings.defaultCheckInTime);
  const [defaultCheckOutTime, setDefaultCheckOutTime] = useState(settings.defaultCheckOutTime);
  const [defaultCancellationPolicy, setDefaultCancellationPolicy] = useState(
    settings.defaultCancellationPolicy
  );
  const [taxPercentage, setTaxPercentage] = useState(settings.taxPercentage);
  const [serviceFeePercentage, setServiceFeePercentage] = useState(
    settings.serviceFeePercentage
  );
  const [confirmResetModal, setConfirmResetModal] = useState(false);

  useEffect(() => {
    setBrandName(settings.brandName);
    setTagline(settings.tagline);
    setContactEmail(settings.contactEmail);
    setReservationsEmail(settings.reservationsEmail);
    setContactPhone(settings.contactPhone);
    setWhatsappNumber(settings.whatsappNumber);
    setAddress(settings.address);
    setInstagramUrl(settings.instagramUrl);
    setPinterestUrl(settings.pinterestUrl);
    setDefaultCheckInTime(settings.defaultCheckInTime);
    setDefaultCheckOutTime(settings.defaultCheckOutTime);
    setDefaultCancellationPolicy(settings.defaultCancellationPolicy);
    setTaxPercentage(settings.taxPercentage);
    setServiceFeePercentage(settings.serviceFeePercentage);
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      brandName: brandName.trim() || 'AURELIA BALI',
      tagline: tagline.trim(),
      contactEmail: contactEmail.trim(),
      reservationsEmail: reservationsEmail.trim(),
      contactPhone: contactPhone.trim(),
      whatsappNumber: whatsappNumber.trim(),
      address: address.trim(),
      instagramUrl: instagramUrl.trim(),
      pinterestUrl: pinterestUrl.trim(),
      defaultCheckInTime: defaultCheckInTime.trim(),
      defaultCheckOutTime: defaultCheckOutTime.trim(),
      defaultCancellationPolicy: defaultCancellationPolicy.trim(),
      taxPercentage: Number(taxPercentage),
      serviceFeePercentage: Number(serviceFeePercentage),
    });
  };

  return (
    <AdminShell
      title="Brand Identity, Policies & Demo State"
      subtitle="Modify global site settings or restore the original seeded demonstration state."
      breadcrumbs={[{ label: 'Site Settings' }]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <form onSubmit={handleSave} className="lg:col-span-8 space-y-6 text-xs">
          {/* Brand Identity */}
          <section className="bg-white border border-stone p-6 space-y-4">
            <h2 className="font-serif text-2xl text-charcoal border-b border-stone pb-3">
              1. Brand Identity & Editorial Tagline
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
                  Brand Wordmark
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full bg-ivory border border-stone px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-ivory border border-stone px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>
          </section>

          {/* Contact & Social */}
          <section className="bg-white border border-stone p-6 space-y-4">
            <h2 className="font-serif text-2xl text-charcoal border-b border-stone pb-3">
              2. Concierge Contact & Social Channels (Fictional Demo Info)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
                  Concierge Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-ivory border border-stone px-3.5 py-2.5"
                />
              </div>
              <div>
                <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
                  Reservations Email
                </label>
                <input
                  type="email"
                  value={reservationsEmail}
                  onChange={(e) => setReservationsEmail(e.target.value)}
                  className="w-full bg-ivory border border-stone px-3.5 py-2.5"
                />
              </div>
              <div>
                <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
                  Direct Telephone
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-ivory border border-stone px-3.5 py-2.5"
                />
              </div>
              <div>
                <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
                  WhatsApp Concierge
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full bg-ivory border border-stone px-3.5 py-2.5"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
                  Estate Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-ivory border border-stone px-3.5 py-2.5"
                />
              </div>
              <div>
                <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
                  Instagram URL
                </label>
                <input
                  type="text"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  className="w-full bg-ivory border border-stone px-3.5 py-2.5"
                />
              </div>
              <div>
                <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
                  Pinterest URL
                </label>
                <input
                  type="text"
                  value={pinterestUrl}
                  onChange={(e) => setPinterestUrl(e.target.value)}
                  className="w-full bg-ivory border border-stone px-3.5 py-2.5"
                />
              </div>
            </div>
          </section>

          {/* Default Policies & Taxes */}
          <section className="bg-white border border-stone p-6 space-y-4">
            <h2 className="font-serif text-2xl text-charcoal border-b border-stone pb-3">
              3. Default Check-In, Cancellation Policy & Tax Configuration
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
                  Default Check-In
                </label>
                <input
                  type="text"
                  value={defaultCheckInTime}
                  onChange={(e) => setDefaultCheckInTime(e.target.value)}
                  className="w-full bg-ivory border border-stone px-3.5 py-2.5"
                />
              </div>
              <div>
                <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
                  Default Check-Out
                </label>
                <input
                  type="text"
                  value={defaultCheckOutTime}
                  onChange={(e) => setDefaultCheckOutTime(e.target.value)}
                  className="w-full bg-ivory border border-stone px-3.5 py-2.5"
                />
              </div>
              <div>
                <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
                  Service Charge (%)
                </label>
                <input
                  type="number"
                  value={serviceFeePercentage}
                  onChange={(e) => setServiceFeePercentage(Number(e.target.value))}
                  className="w-full bg-ivory border border-stone px-3.5 py-2.5"
                />
              </div>
              <div>
                <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
                  Gov. Tax (%)
                </label>
                <input
                  type="number"
                  value={taxPercentage}
                  onChange={(e) => setTaxPercentage(Number(e.target.value))}
                  className="w-full bg-ivory border border-stone px-3.5 py-2.5"
                />
              </div>
              <div className="sm:col-span-4">
                <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
                  Default Cancellation Policy
                </label>
                <textarea
                  rows={3}
                  value={defaultCancellationPolicy}
                  onChange={(e) => setDefaultCancellationPolicy(e.target.value)}
                  className="w-full bg-ivory border border-stone p-3"
                />
              </div>
            </div>
          </section>

          <button
            type="submit"
            className="bg-deepGreen hover:bg-forestGreen text-ivory text-xs uppercase tracking-[0.2em] px-8 py-4 font-medium inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Site Settings
          </button>
        </form>

        {/* Reset Demo Data Card */}
        <aside className="lg:col-span-4 bg-white border border-stone p-6 space-y-4">
          <div className="flex items-center gap-2 text-bronze uppercase tracking-wider text-xs font-medium">
            <ShieldAlert className="w-4 h-4" />
            <span>Prototype Data Persistence</span>
          </div>
          <h3 className="font-serif text-2xl text-charcoal">
            Reset Demonstration State
          </h3>
          <p className="text-xs text-charcoal/75 leading-relaxed">
            All new reservations, villa edits, blocked calendar dates, and pricing rules are persisted in your browser’s <code>localStorage</code>. Click below to wipe local modifications and restore the original deterministic AURELIA BALI seed dataset.
          </p>
          <button
            type="button"
            onClick={() => setConfirmResetModal(true)}
            className="w-full border border-red-800/40 bg-red-900/5 hover:bg-red-900/15 text-red-900 py-3.5 px-5 text-xs uppercase tracking-[0.18em] font-medium inline-flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Demo Data to Initial Seed
          </button>
        </aside>
      </div>

      {confirmResetModal && (
        <div
          className="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-ivory border border-stone max-w-md w-full p-6 space-y-4">
            <h3 className="font-serif text-2xl text-charcoal">
              Restore Original Seed Data?
            </h3>
            <p className="text-xs text-charcoal/75 leading-relaxed">
              This will clear all browser-stored bookings, custom villas, blocked dates, and settings changes and restore the original four Balinese villas and seeded bookings.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmResetModal(false)}
                className="px-4 py-2 text-xs uppercase border border-stone"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetDemoData();
                  setConfirmResetModal(false);
                }}
                className="px-4 py-2 text-xs uppercase bg-deepGreen text-ivory"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
