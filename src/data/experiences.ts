import { SignatureExperience, Testimonial } from '@/types';

export const SIGNATURE_EXPERIENCES: SignatureExperience[] = [
  {
    id: 'exp-floating-breakfast',
    title: 'Artisanal Floating Breakfast',
    category: 'Culinary',
    shortDescription:
      'Seasonal tropical fruits, warm sourdough pastries, Kintamani single-origin pour-over, and organic eggs served on a woven rattan tray in your private pool.',
    fullDescription:
      'Begin your morning unhurried as your villa host prepares a vibrant breakfast harvested from upland Bedugul farms. Served on a handcrafted rattan tray in the stillness of your private pool or garden bale.',
    duration: 'Morning • Prepared at your preferred hour (07:30 – 10:30)',
    priceIdr: 650000,
    priceUnit: 'per couple',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=80',
    fallbackImage: '/images/fallback-villa-ubud.jpg',
    highlights: [
      'Freshly pressed cold-pressed juices & young coconut water',
      'Artisanal pastries, local wildflower honey & house-made coconut yogurt',
      'Choice of Balinese or contemporary warm breakfast mains',
    ],
    optionalNote: 'Optional fictional demonstration enhancement — selectable during booking review.',
  },
  {
    id: 'exp-poolside-dining',
    title: 'Candlelit Private Poolside Dining',
    category: 'Culinary',
    shortDescription:
      'An intimate five-course tasting menu illuminated by beeswax lanterns beside your pool, celebrating line-caught Jimbaran seafood and heritage spices.',
    fullDescription:
      'As dusk settles over the courtyard, our culinary team transforms your poolside deck with hand-loomed table linens, frangipani blossoms, and warm lantern light for an unforgettable private evening.',
    duration: 'Evening • 3 Hours',
    priceIdr: 1850000,
    priceUnit: 'per couple',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    fallbackImage: '/images/fallback-villa-uluwatu.jpg',
    highlights: [
      'Five-course seasonal menu tailored to dietary preferences',
      'Beeswax candle & tropical botanical table styling',
      'Dedicated table service by your private villa butler',
    ],
    optionalNote: 'Optional fictional demonstration enhancement — selectable during booking review.',
  },
  {
    id: 'exp-wellness-ritual',
    title: 'In-Villa Botanical Wellness Ritual',
    category: 'Wellness',
    shortDescription:
      'Restorative 90-minute traditional Balinese massage and warm volcanic stone therapy using wild sandalwood, frangipani, and cold-pressed virgin coconut oil.',
    fullDescription:
      'Performed in the privacy of your open-air pavilion or garden bale, two certified holistic therapists guide you through a deeply calming ritual of acupressure, meridian stretching, and aromatic flower bath immersion.',
    duration: '90 Minutes',
    priceIdr: 1400000,
    priceUnit: 'per couple',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1000&q=80',
    fallbackImage: '/images/fallback-villa-gianyar.jpg',
    highlights: [
      '90-minute synchronized Balinese & warm stone therapy',
      'Hand-blended organic essential oils & herbal Boreh scrub',
      'Post-treatment warm ginger & lemongrass infusion',
    ],
    optionalNote: 'Optional fictional demonstration enhancement — selectable during booking review.',
  },
  {
    id: 'exp-cultural-immersion',
    title: 'Sacred Water Blessing & Temple Walk',
    category: 'Culture',
    shortDescription:
      'A respectful morning walk through quiet village subak rice terraces followed by a traditional Melukat water purification guided by a local cultural host.',
    fullDescription:
      'Experience the spiritual heartbeat of Bali away from crowds. Your private cultural host shares the philosophy of Tri Hita Karana, handcrafted Canang Sari offerings, and ancient spring temples.',
    duration: 'Half Day • 4 Hours (07:00 – 11:00)',
    priceIdr: 1200000,
    priceUnit: 'per stay',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80',
    fallbackImage: '/images/fallback-villa-ubud.jpg',
    highlights: [
      'Guided morning walk along UNESCO-heritage Subak irrigation paths',
      'Custom temple attire (sarong & sash) prepared for each guest',
      'Traditional offering preparation with local village artisans',
    ],
    optionalNote: 'Optional fictional demonstration enhancement — selectable during booking review.',
  },
  {
    id: 'exp-sunset-aperitivo',
    title: 'Cliff & Terrace Sunset Aperitivo',
    category: 'Leisure',
    shortDescription:
      'Golden-hour botanical cocktails, zero-proof tropical elixirs, and Balinese artisanal canapés served on your terrace as the sun dips below the horizon.',
    fullDescription:
      'Celebrate Bali’s golden hour in complete privacy. Our mixologist prepares infusions using torch ginger flower, kaffir lime leaf, and calamansi alongside warm satay lilit and crispy cassava bites.',
    duration: 'Golden Hour • 17:00 – 19:00',
    priceIdr: 950000,
    priceUnit: 'per stay',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80',
    fallbackImage: '/images/fallback-villa-uluwatu.jpg',
    highlights: [
      'Three bespoke botanical cocktails or mocktails per guest',
      'Chef’s selection of six Balinese heritage canapés',
      'Curated ambient acoustic playlist for sunset lounging',
    ],
    optionalNote: 'Optional fictional demonstration enhancement — selectable during booking review.',
  },
  {
    id: 'exp-private-chef',
    title: 'Full-Day Private Estate Chef Table',
    category: 'Culinary',
    shortDescription:
      'A dedicated private chef for the day—from morning market foraging to a leisurely family-style Nusantara lunch and wood-fired evening feast.',
    fullDescription:
      'Enjoy effortless culinary hospitality without leaving your sanctuary. Your private chef designs a custom full-day menu around the morning catch and organic highland produce.',
    duration: 'Full Day • Lunch & Dinner Service',
    priceIdr: 2600000,
    priceUnit: 'per stay',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
    fallbackImage: '/images/fallback-villa-canggu.jpg',
    highlights: [
      'Custom menu consultation with your private estate chef',
      'All premium local ingredients, seafood & spices included',
      'Full kitchen preparation, table styling & seamless cleanup',
    ],
    optionalNote: 'Optional fictional demonstration enhancement — selectable during booking review.',
  },
];

export const DEMO_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    guestName: 'Clara & Henrik Lindqvist',
    origin: 'Stockholm, Sweden (Demo Sample)',
    villaStayed: 'The Ubud Sanctuary',
    stayMonth: 'September 2026',
    quote:
      'Waking up to mist drifting through the Sayan ravine while sipping Kintamani coffee by the stone pool felt restorative in a way no large resort could ever replicate. Every timber joint and linen fold felt deeply considered.',
  },
  {
    id: 'test-2',
    guestName: 'Marcus Vance & Family',
    origin: 'Melbourne, Australia (Demo Sample)',
    villaStayed: 'Tirtha Garden Estate',
    stayMonth: 'August 2026',
    quote:
      'Three generations of our family stayed at Tirtha Garden Estate and each had our own quiet garden pavilion while coming together every evening in the main bale. The private chef’s Balinese feast was unforgettable.',
  },
  {
    id: 'test-3',
    guestName: 'Amélie Laurent',
    origin: 'Paris, France (Demo Sample)',
    villaStayed: 'Solara Cliff House',
    stayMonth: 'October 2026',
    quote:
      'The way the afternoon light moves through the teak louvers onto the limestone terrace at Solara is pure architectural poetry. Quiet, unhurried, and completely private.',
  },
];
