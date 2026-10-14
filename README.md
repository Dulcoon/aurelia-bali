# AURELIA BALI — Luxury Villa Booking & Hospitality Management Prototype

> **“An Island Sanctuary, Thoughtfully Yours.”**
> A complete, interactive, frontend-only Next.js (App Router + TypeScript + Tailwind CSS) hospitality showcase designed for prospective luxury villa owners and boutique resort clients.

---

## 1. Project Overview & Brand Direction

**AURELIA BALI** is a fictional boutique villa brand inspired by contemporary architectural sanctuaries across **Ubud, Uluwatu, Canggu, and Gianyar**.

### Visual & Editorial Design System
- **Color Palette**:
  - Warm Ivory (`#F7F5EF`) — Primary editorial canvas
  - Sand Beige (`#E6DCCB`) — Secondary warm surface
  - Deep Tropical Green (`#263D32`) — Primary actions & selected states
  - Forest Green (`#344F40`) — Hover & accent surfaces
  - Dark Charcoal (`#262822`) — Typography & executive sidebar
  - Muted Bronze (`#A88C62`) — Restrained architectural accents
  - Soft Stone (`#D4CEC2`) — Hairline borders & dividers
- **Typography**:
  - Editorial Headings: *Cormorant Garamond* (`next/font/google` with Georgia/serif fallbacks)
  - Body, Forms & Admin UI: *Plus Jakarta Sans* (`next/font/google` with system sans fallbacks)
- **Resilient Photography**:
  - Curated high-resolution Bali architectural photography via `<SafeImage />` with automatic offline fallback to local editorial artwork in `/public/images/fallback-*.jpg`.

---

## 2. Technical Stack & Vercel Readiness

- **Framework**: Next.js (App Router) with React 18 & TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React (`lucide-react`)
- **Analytics Charts**: Recharts (`recharts`)
- **Date Calculations**: `date-fns`
- **State & Persistence**: React Context (`src/context/AppContext.tsx`) synchronized with browser `localStorage` (`src/lib/storage.ts`), complete with one-click **Reset Demo Data** restoration.
- **Zero Backend Dependencies**: Requires no external database, no authentication server, and no private environment variables. Deploys out-of-the-box to **Vercel**.

---

## 3. Setup & Deployment Instructions

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Verification
```bash
npm run build
npm run start
```

### Deploying to Vercel
1. Push this repository to GitHub/GitLab/Bitbucket, or run `npx vercel` from the project root.
2. Select the default **Next.js** framework preset.
3. Do **not** add any environment variables or database integrations—click **Deploy**.

---

## 4. Entering the Demo Admin Dashboard

There are three convenient ways to enter the simulated back-office suite during a client presentation:
1. Click **Admin Demo** in the top navigation bar from any public page.
2. Visit `/admin/login` and click the prominent **“Enter Demo Dashboard”** button (no password or backend authentication required).
3. Navigate directly to `/admin`.

> **Note**: All administrative actions—creating/editing villas, changing nightly rates, adding promo codes, blocking calendar dates, and updating booking statuses—immediately affect the public website within the same browser session.

---

## 5. Complete Application Route Map (21 Routes)

### Public Website & Discovery
| Route | Experience |
| :--- | :--- |
| `/` | **Homepage**: Cinematic Hero with compact booking bar, Brand Story, Staggered Featured Villas, Signature Experiences, Architectural Philosophy, Demo Testimonials, Interactive Bali SVG Map, and Footer |
| `/villas` | **Villa Discovery**: Live date & capacity availability filter, location/price/bedroom/amenity filters, sorting, and Editorial List / Grid toggle |
| `/villas/[slug]` | **Villa Detail**: Multi-photo gallery + fullscreen lightbox, architectural highlights, house rules, live price breakdown widget, and related villas |
| `/experiences` | **Signature Experiences**: Curated culinary, wellness, and cultural enhancements with one-click pre-selection into the booking flow |
| `/about` | **Our Story**: Editorial brand narrative and Balinese architectural philosophy |
| `/contact` | **Concierge Desk**: Validated simulated inquiry form and fictional Bali sanctuary contact details |

### End-to-End Mock Booking Journey
| Route | Experience |
| :--- | :--- |
| `/booking` | **Steps 1 & 2 (Selection & Review)**: Villa/date/guest validation, optional experiences selector, promo code validation (`ISLAND10`, `SANCTUARY15`, `LONGERSTAY`), and 100% Full vs 50% Deposit toggle |
| `/booking/checkout` | **Steps 3 & 4 (Guest Details & Simulated Payment)**: Validated guest form + simulated Card, Bank Transfer (BCA/Mandiri VA), and E-Wallet (QRIS/GoPay/OVO) payment outcomes (Success, Declined, Cancel) |
| `/booking/confirmation` | **Step 5 (Confirmation Folio)**: Unique reference (`AUR-2026-XXXX`), printable summary (`window.print()`), and direct links to Lookup & Admin |
| `/booking/lookup` | **Step 6 (Reservation Lookup)**: Lookup by reference + email with one-click demo reservation pills and simulated cancellation |

### Hospitality Admin Suite
| Route | Experience |
| :--- | :--- |
| `/admin/login` | **Simulated Login**: One-click “Enter Demo Dashboard” access with role context preview |
| `/admin` | **Dashboard Overview**: 8 operational KPIs, Recharts Booking Value vs Simulated Payments Received & Occupancy charts, and recent reservations |
| `/admin/bookings` | **Booking Management**: Search, multi-facet filters, sorting, pagination, quick detail drawer, status toggles, and CSV export |
| `/admin/bookings/[id]` | **Booking Folio Detail**: Full guest profile, itemized financial ledger, status/payment controls, and internal concierge notes |
| `/admin/villas` | **Villa Inventory**: Search, filter, publish/unpublish toggle, delete confirmation, and public page links |
| `/admin/villas/new` | **Create Villa**: Full property creation form with gallery URL manager and amenity selector |
| `/admin/villas/[id]/edit` | **Edit Villa**: Live property editor that immediately updates public villa pages |
| `/admin/calendar` | **Availability Calendar**: Monthly occupancy grid showing Available, Confirmed, Pending, Blocked, and IN/OUT indicators with one-click date blocking |
| `/admin/pricing` | **Pricing & Promotions**: Per-villa base/weekend rates, seasonal multipliers (with overlap prevention), date overrides, taxes/fees, and promo codes |
| `/admin/guests` | **Guest Directory**: Searchable fictional guest directory with VIP tags and stay history modal |
| `/admin/reports` | **Reports & Analytics**: Recharts visualizations for villa popularity, occupancy, payment breakdown, and CSV export |
| `/admin/settings` | **Site Settings**: Edit brand wordmark, tagline, contact details, default policies, tax rates, or trigger **Reset Demo Data** |

---

## 6. Client Presentation Walkthrough (7 Workflows to Demonstrate)

1. **Editorial Discovery & Filtering**: Start on `/` to showcase the cinematic hero and interactive Bali map, then click **Explore Our Villas** (`/villas`) and filter by region, bedrooms, or amenities.
2. **Real-Time Pricing & Availability**: Open **The Ubud Sanctuary** (`/villas/the-ubud-sanctuary`), select stay dates, inspect the live itemized rate calculation, and click **Reserve Your Stay**.
3. **Customizing the Stay (`/booking`)**: Add an *Artisanal Floating Breakfast*, apply promo code **`ISLAND10`**, and toggle between **Full Stay Settlement** and **50% Sanctuary Deposit**.
4. **Simulated Checkout (`/booking/checkout`)**: Click **Auto-Fill Sample Guest Details**, test **Simulate Declined Payment** to show inline error handling, and then click **Simulate Successful Payment** to generate reference `AUR-2026-0009`.
5. **Lookup & Printable Folio (`/booking/lookup`)**: Look up the newly created booking or click one of the seeded reservation pills, and test the print-friendly layout.
6. **Live Admin Synchronization (`/admin`)**: Enter the Admin Dashboard to show `AUR-2026-0009` at the top of Recent Reservations, block a date on `/admin/calendar`, or edit a villa’s base rate on `/admin/pricing` and watch the public site reflect the change immediately.
7. **Deterministic Reset (`/admin/settings`)**: Click **Reset Demo Data** to restore all initial seeded villas, bookings, and settings cleanly for the next presentation.
# aurelia-bali
