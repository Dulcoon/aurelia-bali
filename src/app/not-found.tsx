import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24 px-4 flex items-center justify-center bg-ivory">
        <div className="max-w-xl w-full text-center space-y-6 border border-stone p-10 sm:p-14 bg-white/60">
          <div className="w-12 h-12 mx-auto bg-sand/60 flex items-center justify-center text-deepGreen">
            <Compass className="w-6 h-6" />
          </div>
          <p className="text-xs uppercase tracking-[0.25em] text-bronze">404 • Path Uncharted</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-charcoal">
            A Quiet Corner Beyond Our Map
          </h1>
          <p className="text-sm text-charcoal/75 leading-relaxed">
            The sanctuary page or reservation route you are looking for could not be found. Explore our private villas across Bali or return to the main estate.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-deepGreen text-ivory text-xs uppercase tracking-[0.18em] px-6 py-3.5 hover:bg-forestGreen transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return Home
            </Link>
            <Link
              href="/villas"
              className="w-full sm:w-auto inline-flex items-center justify-center border border-charcoal/30 text-charcoal text-xs uppercase tracking-[0.18em] px-6 py-3.5 hover:border-deepGreen hover:text-deepGreen transition-colors"
            >
              Explore Our Villas
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
