'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, ArrowRight, Lock, Sparkles, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { settings, loginAdminDemo } = useApp();
  const [email, setEmail] = useState('director@aureliabali-demo.example');
  const [role, setRole] = useState('Estate General Manager (Full Access)');

  const handleEnterDemo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    loginAdminDemo();
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-charcoal text-ivory flex flex-col justify-between p-6 sm:p-10">
      <div className="flex items-center justify-between max-w-6xl w-full mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-sand hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Public Website
        </Link>
        <span className="text-xs uppercase tracking-[0.2em] text-bronze">
          Hospitality Management Prototype
        </span>
      </div>

      <div className="max-w-md w-full mx-auto bg-ivory text-charcoal border border-stone p-8 sm:p-10 shadow-editorial space-y-6 my-12">
        <div className="space-y-2 text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-bronze font-medium">
            {settings.brandName}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">
            Executive Admin Portal
          </h1>
          <p className="text-xs text-charcoal/70 leading-relaxed">
            Simulated administrative access for portfolio demonstration. No real authentication server or password is required.
          </p>
        </div>

        {/* Prominent Instant Access CTA */}
        <div className="bg-sand/50 border border-bronze/40 p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-medium text-deepGreen">
            <Sparkles className="w-4 h-4 text-bronze shrink-0" />
            <span>Instant Client Showcase Access</span>
          </div>
          <p className="text-[11px] text-charcoal/75 leading-relaxed">
            Click below to immediately enter the interactive dashboard with full CRUD permissions over villas, bookings, calendar availability, and pricing.
          </p>
          <button
            type="button"
            onClick={() => handleEnterDemo()}
            className="w-full bg-deepGreen hover:bg-forestGreen text-ivory py-3.5 px-5 text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center gap-2 shadow-subtle"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Enter Demo Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-stone" />
          <span className="flex-shrink mx-3 text-[10px] uppercase tracking-widest text-charcoal/50">
            Or Preview Role Context
          </span>
          <div className="flex-grow border-t border-stone" />
        </div>

        {/* Simulated Role Form */}
        <form onSubmit={handleEnterDemo} className="space-y-4 text-xs">
          <div>
            <label htmlFor="demo-admin-email" className="block uppercase tracking-wider text-charcoal/70 mb-1.5">
              Demo Operator Email
            </label>
            <input
              id="demo-admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-stone px-3.5 py-2.5 text-charcoal focus:outline-none focus:border-deepGreen"
            />
          </div>

          <div>
            <label htmlFor="demo-admin-role" className="block uppercase tracking-wider text-charcoal/70 mb-1.5">
              Simulated Role Profile
            </label>
            <select
              id="demo-admin-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-white border border-stone px-3.5 py-2.5 text-charcoal focus:outline-none focus:border-deepGreen"
            >
              <option>Estate General Manager (Full Access)</option>
              <option>Reservations & Revenue Director</option>
              <option>Villa Operations & Concierge Lead</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full border border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory py-3 px-4 uppercase tracking-[0.18em] transition-colors flex items-center justify-center gap-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Continue with Selected Profile</span>
          </button>
        </form>
      </div>

      <div className="text-center text-xs text-sand/50">
        Fictional Demo Authentication • Local Browser Session Only
      </div>
    </div>
  );
}
