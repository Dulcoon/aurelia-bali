'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Menu, X, Compass, ShieldCheck, Calendar } from 'lucide-react';

interface NavbarProps {
  transparentOnTop?: boolean;
}

export function Navbar({ transparentOnTop = false }: NavbarProps) {
  const pathname = usePathname();
  const { settings } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 36);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isSolid = !transparentOnTop || scrolled || mobileMenuOpen;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/villas', label: 'Our Villas' },
    { href: '/experiences', label: 'Experiences' },
    { href: '/about', label: 'Our Story' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 no-print ${
        isSolid
          ? 'bg-ivory/95 backdrop-blur-md border-b border-stone/60 py-4 text-charcoal shadow-subtle'
          : 'bg-gradient-to-b from-charcoal/70 via-charcoal/35 to-transparent py-6 text-ivory'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="group flex flex-col">
          <span className="font-serif text-2xl sm:text-[26px] tracking-[0.22em] font-normal uppercase">
            {settings.brandName}
          </span>
          <span
            className={`text-[9px] tracking-[0.28em] uppercase transition-colors ${
              isSolid ? 'text-bronze' : 'text-sand/90'
            }`}
          >
            Private Island Sanctuaries
          </span>
        </Link>

        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const active =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs uppercase tracking-[0.16em] py-1 transition-colors border-b ${
                  active
                    ? isSolid
                      ? 'border-deepGreen text-deepGreen font-medium'
                      : 'border-sand text-white font-medium'
                    : isSolid
                    ? 'border-transparent text-charcoal/80 hover:text-deepGreen'
                    : 'border-transparent text-ivory/85 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/booking/lookup"
            className={`text-xs tracking-[0.12em] uppercase px-3 py-2 transition-colors ${
              isSolid
                ? 'text-charcoal/75 hover:text-deepGreen'
                : 'text-ivory/85 hover:text-white'
            }`}
          >
            Manage Stay
          </Link>
          <Link
            href="/admin"
            className={`inline-flex items-center gap-1.5 text-xs tracking-[0.12em] uppercase px-3 py-2 border transition-colors ${
              isSolid
                ? 'border-stone text-charcoal/80 hover:border-bronze hover:text-charcoal'
                : 'border-ivory/35 text-ivory/90 hover:bg-ivory/10'
            }`}
            title="Open Interactive Hospitality Admin Demo"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-bronze" />
            Admin Demo
          </Link>
          <Link
            href="/booking"
            className={`text-xs uppercase tracking-[0.18em] px-5 py-3 font-medium transition-all ${
              isSolid
                ? 'bg-deepGreen text-ivory hover:bg-forestGreen'
                : 'bg-ivory text-charcoal hover:bg-sand'
            }`}
          >
            Reserve Your Stay
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
          className="lg:hidden p-2 focus:outline-none focus:ring-2 focus:ring-bronze"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-ivory border-b border-stone text-charcoal px-6 pt-4 pb-8 space-y-5 shadow-editorial">
          <nav className="flex flex-col space-y-3" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm uppercase tracking-[0.16em] py-2 border-b border-stone/40 hover:text-deepGreen"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/booking/lookup"
              className="text-sm uppercase tracking-[0.16em] py-2 border-b border-stone/40 flex items-center gap-2 text-charcoal/80"
            >
              <Compass className="w-4 h-4 text-bronze" />
              Lookup Existing Reservation
            </Link>
            <Link
              href="/admin"
              className="text-sm uppercase tracking-[0.16em] py-2 border-b border-stone/40 flex items-center gap-2 text-deepGreen font-medium"
            >
              <ShieldCheck className="w-4 h-4 text-bronze" />
              Interactive Admin Dashboard Demo
            </Link>
          </nav>
          <div className="pt-2">
            <Link
              href="/booking"
              className="w-full inline-flex items-center justify-center gap-2 bg-deepGreen text-ivory text-xs uppercase tracking-[0.18em] py-3.5 px-6 font-medium hover:bg-forestGreen"
            >
              <Calendar className="w-4 h-4" />
              Reserve Your Stay
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
