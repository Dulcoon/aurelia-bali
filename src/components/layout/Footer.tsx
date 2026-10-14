'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { MapPin, Phone, Mail, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';

export function Footer() {
  const { settings, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | null>(null);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Invalid Email', 'Please enter a valid email address for our seasonal journal.', 'warning');
      return;
    }
    setSubscribed(true);
    setEmail('');
    showToast(
      'Subscribed to The Aurelia Journal',
      'Simulated newsletter subscription recorded in this browser session.',
      'success'
    );
  };

  return (
    <footer className="bg-charcoal text-ivory border-t border-stone/20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-5">
            <div>
              <Link href="/" className="font-serif text-2xl tracking-[0.22em] uppercase text-ivory">
                {settings.brandName}
              </Link>
              <p className="text-xs tracking-[0.2em] uppercase text-bronze mt-1">
                {settings.tagline}
              </p>
            </div>
            <p className="text-sm text-sand/80 leading-relaxed max-w-sm">
              Intimate architectural villas across Ubud, Uluwatu, Canggu, and Gianyar. Crafted with natural Balinese stone, reclaimed timber, and unhurried private hospitality.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-ivory/5 border border-ivory/15 text-[11px] text-sand/90">
              <ShieldAlert className="w-3.5 h-3.5 text-bronze shrink-0" />
              <span>Fictional Portfolio Prototype • Demo Hospitality Showcase</span>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-bronze font-medium">
              Sanctuaries
            </h3>
            <ul className="space-y-2.5 text-sm text-sand/85">
              <li>
                <Link href="/villas/the-ubud-sanctuary" className="hover:text-white transition-colors">
                  The Ubud Sanctuary
                </Link>
              </li>
              <li>
                <Link href="/villas/solara-cliff-house" className="hover:text-white transition-colors">
                  Solara Cliff House
                </Link>
              </li>
              <li>
                <Link href="/villas/casa-senja" className="hover:text-white transition-colors">
                  Casa Senja
                </Link>
              </li>
              <li>
                <Link href="/villas/tirtha-garden-estate" className="hover:text-white transition-colors">
                  Tirtha Garden Estate
                </Link>
              </li>
              <li>
                <Link href="/villas" className="text-bronze hover:text-sand transition-colors text-xs uppercase tracking-wider pt-1 inline-block">
                  View All Villas →
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-bronze font-medium">
              Explore & Manage
            </h3>
            <ul className="space-y-2.5 text-sm text-sand/85">
              <li>
                <Link href="/experiences" className="hover:text-white transition-colors">
                  Signature Experiences
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Our Story & Architecture
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-white transition-colors">
                  Reserve a Villa
                </Link>
              </li>
              <li>
                <Link href="/booking/lookup" className="hover:text-white transition-colors">
                  Reservation Lookup
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Private Concierge Desk
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-sand hover:text-white underline underline-offset-4">
                  Enter Admin Dashboard Demo
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-5">
            <h3 className="text-xs uppercase tracking-[0.2em] text-bronze font-medium">
              The Island Journal
            </h3>
            <p className="text-xs text-sand/80 leading-relaxed">
              Receive seasonal notes on Balinese architecture, slow travel, and private residence privileges.
            </p>
            {subscribed ? (
              <div className="p-3.5 bg-deepGreen/40 border border-bronze/40 flex items-center gap-2.5 text-xs text-sand">
                <CheckCircle2 className="w-4 h-4 text-bronze shrink-0" />
                <span>Thank you. You are subscribed to our demo dispatch.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
                <div className="flex">
                  <label htmlFor="footer-newsletter" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="footer-newsletter"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="w-full bg-ivory/10 border border-ivory/20 px-3.5 py-2.5 text-sm text-ivory placeholder:text-sand/50 focus:outline-none focus:border-bronze"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    className="bg-bronze text-charcoal px-4 py-2.5 hover:bg-sand transition-colors flex items-center justify-center"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[11px] text-sand/50">
                  Simulated submission — no external emails are sent.
                </span>
              </form>
            )}

            <div className="pt-3 border-t border-ivory/10 space-y-2 text-xs text-sand/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-bronze shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-bronze shrink-0" />
                <span>{settings.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-bronze shrink-0" />
                <span>{settings.contactEmail}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-ivory/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sand/60">
          <p>
            © {new Date().getFullYear()} {settings.brandName}. Fictional Luxury Hospitality Showcase Prototype.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => setLegalModal('terms')}
              className="hover:text-ivory transition-colors"
            >
              Terms of Stay (Demo)
            </button>
            <button
              type="button"
              onClick={() => setLegalModal('privacy')}
              className="hover:text-ivory transition-colors"
            >
              Privacy Notice (Demo)
            </button>
            <Link href="/admin/login" className="hover:text-ivory transition-colors">
              Staff Portal Demo
            </Link>
          </div>
        </div>
      </div>

      {legalModal && (
        <div
          className="fixed inset-0 z-50 bg-charcoal/75 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-ivory text-charcoal max-w-lg w-full p-6 sm:p-8 border border-stone shadow-editorial space-y-4">
            <div className="flex items-center justify-between border-b border-stone pb-3">
              <h4 className="font-serif text-2xl">
                {legalModal === 'terms' ? 'Demonstration Terms of Stay' : 'Demonstration Privacy Notice'}
              </h4>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="text-xs uppercase tracking-widest text-charcoal/60 hover:text-charcoal"
              >
                Close ✕
              </button>
            </div>
            <p className="text-sm text-charcoal/80 leading-relaxed">
              <strong>AURELIA BALI</strong> is a fictional luxury villa brand created as an interactive frontend web development showcase. All properties, nightly rates, availability calendars, and payment checkouts are simulated locally in your browser.
            </p>
            <p className="text-sm text-charcoal/80 leading-relaxed">
              {legalModal === 'terms'
                ? settings.defaultCancellationPolicy
                : 'No personal data or payment credentials are transmitted to any external server. Any mock bookings or admin edits you make are stored solely in your local browser storage and can be reset at any time via the Admin Settings page.'}
            </p>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="bg-deepGreen text-ivory text-xs uppercase tracking-widest px-5 py-2.5"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
