'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useApp } from '@/context/AppContext';
import { Mail, Phone, MapPin, Clock, CheckCircle2, Send } from 'lucide-react';

export default function ContactPage() {
  const { settings, villas, showToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [villaInterest, setVillaInterest] = useState('All Sanctuaries');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.includes('@') || !message.trim()) {
      showToast('Incomplete Inquiry', 'Please provide your name, valid email, and message.', 'warning');
      return;
    }
    setSubmitted(true);
    showToast(
      'Concierge Inquiry Received (Demo)',
      'Your simulated inquiry has been logged in this browser session.',
      'success'
    );
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-28 pb-24">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Info */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.24em] text-bronze font-medium">
                  Private Concierge Desk
                </p>
                <h1 className="font-serif text-4xl sm:text-5xl text-charcoal leading-tight">
                  Speak With Our Island Hosts.
                </h1>
                <p className="text-sm text-charcoal/80 leading-relaxed">
                  Whether planning an extended family retreat, bespoke celebration, or private architectural tour, our demonstration concierge team is delighted to assist.
                </p>
              </div>

              <div className="bg-sand/40 border border-stone p-6 space-y-5 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-deepGreen shrink-0 mt-1" />
                  <div>
                    <p className="text-xs uppercase tracking-widest text-bronze">Bali Sanctuary Office (Demo)</p>
                    <p className="text-charcoal mt-1">{settings.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-deepGreen shrink-0 mt-1" />
                  <div>
                    <p className="text-xs uppercase tracking-widest text-bronze">Direct Telephone & WhatsApp</p>
                    <p className="text-charcoal mt-1">{settings.contactPhone}</p>
                    <p className="text-charcoal/70 text-xs mt-0.5">WhatsApp: {settings.whatsappNumber}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-deepGreen shrink-0 mt-1" />
                  <div>
                    <p className="text-xs uppercase tracking-widest text-bronze">Electronic Mail</p>
                    <p className="text-charcoal mt-1">{settings.contactEmail}</p>
                    <p className="text-charcoal/70 text-xs mt-0.5">{settings.reservationsEmail}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-deepGreen shrink-0 mt-1" />
                  <div>
                    <p className="text-xs uppercase tracking-widest text-bronze">Concierge Hours</p>
                    <p className="text-charcoal mt-1">Daily 07:00 – 22:00 WITA (Bali Time, GMT+8)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-7 bg-white/80 border border-stone p-8 sm:p-10 shadow-subtle">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-deepGreen mx-auto" />
                  <h2 className="font-serif text-3xl text-charcoal">
                    Thank You, {name}
                  </h2>
                  <p className="text-sm text-charcoal/75 max-w-md mx-auto leading-relaxed">
                    Your simulated concierge inquiry regarding <strong>{villaInterest}</strong> has been received. In a live deployment, our reservations team would respond within 2 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                    className="mt-4 bg-deepGreen text-ivory text-xs uppercase tracking-[0.18em] px-6 py-3"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="border-b border-stone pb-4">
                    <h2 className="font-serif text-2xl text-charcoal">Private Residence Inquiry</h2>
                    <p className="text-xs text-charcoal/65 mt-1">
                      Simulated contact form — no external messages are dispatched.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs uppercase tracking-wider text-charcoal/80 mb-2">
                        Full Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Elena Rostova"
                        className="w-full bg-ivory border border-stone px-4 py-3 text-sm focus:outline-none focus:border-deepGreen"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-xs uppercase tracking-wider text-charcoal/80 mb-2">
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="elena@example.com"
                        className="w-full bg-ivory border border-stone px-4 py-3 text-sm focus:outline-none focus:border-deepGreen"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="contact-phone" className="block text-xs uppercase tracking-wider text-charcoal/80 mb-2">
                        Phone / WhatsApp
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+62 811 ..."
                        className="w-full bg-ivory border border-stone px-4 py-3 text-sm focus:outline-none focus:border-deepGreen"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-villa" className="block text-xs uppercase tracking-wider text-charcoal/80 mb-2">
                        Preferred Residence
                      </label>
                      <select
                        id="contact-villa"
                        value={villaInterest}
                        onChange={(e) => setVillaInterest(e.target.value)}
                        className="w-full bg-ivory border border-stone px-4 py-3 text-sm focus:outline-none focus:border-deepGreen"
                      >
                        <option value="All Sanctuaries">All Sanctuaries</option>
                        {villas.map((v) => (
                          <option key={v.id} value={v.name}>
                            {v.name} ({v.location})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs uppercase tracking-wider text-charcoal/80 mb-2">
                      Your Inquiry or Special Requirements *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your preferred travel dates, celebration plans, or dietary preferences..."
                      className="w-full bg-ivory border border-stone px-4 py-3 text-sm focus:outline-none focus:border-deepGreen"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-deepGreen hover:bg-forestGreen text-ivory text-xs uppercase tracking-[0.2em] px-8 py-4 font-medium inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit Simulated Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
