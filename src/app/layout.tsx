import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { ToastContainer } from '@/components/ui/ToastContainer';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'AURELIA BALI — An Island Sanctuary, Thoughtfully Yours',
    template: '%s | AURELIA BALI',
  },
  description:
    'Discover thoughtfully designed Balinese luxury villas in Ubud, Uluwatu, Canggu, and Gianyar. Interactive hospitality booking prototype and admin suite.',
  openGraph: {
    title: 'AURELIA BALI — Private Island Sanctuaries',
    description:
      'Contemporary Balinese luxury villas where architectural craftsmanship, tropical nature, and quiet exclusivity come together.',
    type: 'website',
    locale: 'en_US',
    siteName: 'AURELIA BALI (Demo Prototype)',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable}`}>
      <body className="font-sans bg-ivory text-charcoal antialiased selection:bg-deepGreen selection:text-ivory min-h-screen flex flex-col">
        <AppProvider>
          <div className="flex-1 flex flex-col">{children}</div>
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}
