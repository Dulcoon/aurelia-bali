'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Villa, VillaImage, VillaLocation } from '@/types';
import { ALL_AMENITIES } from '@/data/villas';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface VillaFormProps {
  initialVilla?: Villa;
  onSubmit: (data: Omit<Villa, 'id'>) => void;
  submitLabel: string;
}

export function VillaForm({ initialVilla, onSubmit, submitLabel }: VillaFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initialVilla?.name || '');
  const [slug, setSlug] = useState(initialVilla?.slug || '');
  const [tagline, setTagline] = useState(initialVilla?.tagline || '');
  const [location, setLocation] = useState<VillaLocation>(initialVilla?.location || 'Ubud');
  const [specificArea, setSpecificArea] = useState(
    initialVilla?.specificArea || 'Sayan Ridge, Ubud, Bali'
  );
  const [distanceNote, setDistanceNote] = useState(
    initialVilla?.distanceNote || '15 mins from Ubud Center • 70 mins from Airport (Demo)'
  );
  const [concept, setConcept] = useState(initialVilla?.concept || '');
  const [description, setDescription] = useState(initialVilla?.description || '');
  const [architecturalPhilosophy, setArchitecturalPhilosophy] = useState(
    initialVilla?.architecturalPhilosophy || ''
  );
  const [highlightsText, setHighlightsText] = useState(
    (initialVilla?.architecturalHighlights || [
      'Private infinity pool overlooking tropical foliage',
      'Hand-carved Balinese stone courtyard',
    ]).join('\n')
  );
  const [bedrooms, setBedrooms] = useState(initialVilla?.bedrooms || 2);
  const [bathrooms, setBathrooms] = useState(initialVilla?.bathrooms || 2);
  const [maxGuests, setMaxGuests] = useState(initialVilla?.maxGuests || 4);
  const [areaSqm, setAreaSqm] = useState(initialVilla?.areaSqm || 320);
  const [poolDimensions, setPoolDimensions] = useState(
    initialVilla?.poolDimensions || '14m × 4m Private Infinity Pool'
  );
  const [basePricePerNight, setBasePricePerNight] = useState(
    initialVilla?.basePricePerNight || 2800000
  );
  const [weekendPricePerNight, setWeekendPricePerNight] = useState(
    initialVilla?.weekendPricePerNight || 3200000
  );
  const [minStayNights, setMinStayNights] = useState(initialVilla?.minStayNights || 2);
  const [extraGuestFee, setExtraGuestFee] = useState(initialVilla?.extraGuestFee || 450000);
  const [amenities, setAmenities] = useState<string[]>(
    initialVilla?.amenities || ['Private Pool', 'Garden Courtyard', 'High-Speed Fiber Wi-Fi']
  );
  const [images, setImages] = useState<VillaImage[]>(
    initialVilla?.images || [
      {
        id: 'img-1',
        url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=85',
        fallbackUrl: '/images/fallback-villa-ubud.jpg',
        alt: 'Luxury Balinese villa pool and tropical garden',
        caption: 'Main infinity pool and tropical pavilion.',
      },
    ]
  );
  const [checkInTime, setCheckInTime] = useState(initialVilla?.checkInTime || '14:00');
  const [checkOutTime, setCheckOutTime] = useState(initialVilla?.checkOutTime || '11:00');
  const [houseRulesText, setHouseRulesText] = useState(
    (initialVilla?.houseRules || [
      'Quiet hours observed after 22:00.',
      'No commercial photography without prior approval.',
    ]).join('\n')
  );
  const [cancellationPolicy, setCancellationPolicy] = useState(
    initialVilla?.cancellationPolicy ||
      'Complimentary cancellation up to 14 days prior to arrival (Demo Policy).'
  );
  const [published, setPublished] = useState(initialVilla?.published ?? true);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!initialVilla) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      );
    }
  };

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const addImageRow = () => {
    setImages((prev) => [
      ...prev,
      {
        id: `img-${Date.now()}`,
        url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1400&q=85',
        fallbackUrl: '/images/fallback-villa-ubud.jpg',
        alt: `${name || 'Villa'} gallery view`,
        caption: 'Interior pavilion & courtyard view.',
      },
    ]);
  };

  const updateImageRow = (idx: number, patch: Partial<VillaImage>) => {
    setImages((prev) => prev.map((img, i) => (i === idx ? { ...img, ...patch } : img)));
  };

  const removeImageRow = (idx: number) => {
    if (images.length <= 1) return;
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim() || !concept.trim() || !description.trim()) {
      setError('Please complete all required fields (Name, Slug, Concept, and Description).');
      return;
    }
    if (basePricePerNight <= 0 || weekendPricePerNight <= 0) {
      setError('Nightly rates must be greater than IDR 0.');
      return;
    }

    onSubmit({
      name: name.trim(),
      slug: slug.trim(),
      tagline: tagline.trim() || concept.trim(),
      location,
      specificArea: specificArea.trim(),
      distanceNote: distanceNote.trim(),
      concept: concept.trim(),
      description: description.trim(),
      architecturalPhilosophy:
        architecturalPhilosophy.trim() ||
        'Crafted with natural Balinese stone, reclaimed timber, and indoor-outdoor proportions.',
      architecturalHighlights: highlightsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      maxGuests: Number(maxGuests),
      areaSqm: Number(areaSqm),
      poolDimensions: poolDimensions.trim(),
      basePricePerNight: Number(basePricePerNight),
      weekendPricePerNight: Number(weekendPricePerNight),
      minStayNights: Number(minStayNights),
      extraGuestFee: Number(extraGuestFee),
      includedGuests: Number(maxGuests),
      amenities,
      images,
      checkInTime,
      checkOutTime,
      houseRules: houseRulesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      cancellationPolicy: cancellationPolicy.trim(),
      published,
      featured: true,
      coordinates: initialVilla?.coordinates || { x: 52, y: 60 },
    });

    router.push('/admin/villas');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-900/10 border border-red-800/30 p-4 text-xs text-red-900">
          {error}
        </div>
      )}

      {/* Basic Identity */}
      <section className="bg-white border border-stone p-6 space-y-5">
        <h2 className="font-serif text-2xl text-charcoal border-b border-stone pb-3">
          1. Property Identity & Location
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
              Villa Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Amara River Pavilion"
              className="w-full bg-ivory border border-stone px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full bg-ivory border border-stone px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
              Bali Region *
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value as VillaLocation)}
              className="w-full bg-ivory border border-stone px-3.5 py-2.5 text-sm"
            >
              <option value="Ubud">Ubud</option>
              <option value="Uluwatu">Uluwatu</option>
              <option value="Canggu">Canggu</option>
              <option value="Gianyar">Gianyar</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
              Editorial Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Suspended above a sacred river gorge..."
              className="w-full bg-ivory border border-stone px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
              Specific Enclave
            </label>
            <input
              type="text"
              value={specificArea}
              onChange={(e) => setSpecificArea(e.target.value)}
              className="w-full bg-ivory border border-stone px-3.5 py-2.5 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Capacity & Pricing */}
      <section className="bg-white border border-stone p-6 space-y-5">
        <h2 className="font-serif text-2xl text-charcoal border-b border-stone pb-3">
          2. Specifications, Capacity & Nightly Rates (IDR)
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
              Bedrooms
            </label>
            <input
              type="number"
              min={1}
              max={12}
              value={bedrooms}
              onChange={(e) => setBedrooms(Number(e.target.value))}
              className="w-full bg-ivory border border-stone px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
              Bathrooms
            </label>
            <input
              type="number"
              min={1}
              max={12}
              value={bathrooms}
              onChange={(e) => setBathrooms(Number(e.target.value))}
              className="w-full bg-ivory border border-stone px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
              Max Guests
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={maxGuests}
              onChange={(e) => setMaxGuests(Number(e.target.value))}
              className="w-full bg-ivory border border-stone px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
              Estate Area (m²)
            </label>
            <input
              type="number"
              min={50}
              value={areaSqm}
              onChange={(e) => setAreaSqm(Number(e.target.value))}
              className="w-full bg-ivory border border-stone px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
              Base Nightly Price (IDR)
            </label>
            <input
              type="number"
              step={100000}
              value={basePricePerNight}
              onChange={(e) => setBasePricePerNight(Number(e.target.value))}
              className="w-full bg-ivory border border-stone px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
              Weekend Nightly Price (IDR)
            </label>
            <input
              type="number"
              step={100000}
              value={weekendPricePerNight}
              onChange={(e) => setWeekendPricePerNight(Number(e.target.value))}
              className="w-full bg-ivory border border-stone px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
              Minimum Stay (Nights)
            </label>
            <input
              type="number"
              min={1}
              max={14}
              value={minStayNights}
              onChange={(e) => setMinStayNights(Number(e.target.value))}
              className="w-full bg-ivory border border-stone px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
              Pool Specification
            </label>
            <input
              type="text"
              value={poolDimensions}
              onChange={(e) => setPoolDimensions(e.target.value)}
              className="w-full bg-ivory border border-stone px-3.5 py-2.5 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Editorial Copy */}
      <section className="bg-white border border-stone p-6 space-y-5 text-xs">
        <h2 className="font-serif text-2xl text-charcoal border-b border-stone pb-3">
          3. Editorial Description & Architectural Story
        </h2>

        <div>
          <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
            Short Architectural Concept *
          </label>
          <input
            type="text"
            required
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder="A secluded tropical retreat surrounded by lush greenery and natural stone."
            className="w-full bg-ivory border border-stone px-3.5 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
            Full Sanctuary Description *
          </label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-ivory border border-stone px-3.5 py-2.5 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
              Architectural Philosophy
            </label>
            <textarea
              rows={3}
              value={architecturalPhilosophy}
              onChange={(e) => setArchitecturalPhilosophy(e.target.value)}
              className="w-full bg-ivory border border-stone px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
              Architectural Highlights (One per line)
            </label>
            <textarea
              rows={3}
              value={highlightsText}
              onChange={(e) => setHighlightsText(e.target.value)}
              className="w-full bg-ivory border border-stone px-3.5 py-2.5 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="bg-white border border-stone p-6 space-y-4">
        <h2 className="font-serif text-2xl text-charcoal border-b border-stone pb-3">
          4. Amenities & Residence Privileges
        </h2>
        <div className="flex flex-wrap gap-2">
          {ALL_AMENITIES.map((amenity) => {
            const active = amenities.includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`text-xs px-3 py-1.5 border transition-colors ${
                  active
                    ? 'bg-deepGreen text-ivory border-deepGreen'
                    : 'bg-ivory text-charcoal border-stone hover:border-bronze'
                }`}
              >
                {active ? '✓ ' : '+ '}
                {amenity}
              </button>
            );
          })}
        </div>
      </section>

      {/* Gallery Image URLs */}
      <section className="bg-white border border-stone p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-stone pb-3">
          <h2 className="font-serif text-2xl text-charcoal">5. Photography Gallery URLs</h2>
          <button
            type="button"
            onClick={addImageRow}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider bg-sand/60 border border-stone px-3 py-1.5 hover:border-bronze"
          >
            <Plus className="w-3.5 h-3.5" /> Add Photo URL
          </button>
        </div>

        <div className="space-y-3">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-ivory p-3.5 border border-stone items-center text-xs"
            >
              <div className="sm:col-span-6">
                <label className="block text-[10px] uppercase text-charcoal/60 mb-1">
                  Image URL #{idx + 1}
                </label>
                <input
                  type="text"
                  value={img.url}
                  onChange={(e) => updateImageRow(idx, { url: e.target.value })}
                  className="w-full bg-white border border-stone px-3 py-2"
                />
              </div>
              <div className="sm:col-span-5">
                <label className="block text-[10px] uppercase text-charcoal/60 mb-1">
                  Caption / Alt Description
                </label>
                <input
                  type="text"
                  value={img.caption}
                  onChange={(e) =>
                    updateImageRow(idx, { caption: e.target.value, alt: e.target.value })
                  }
                  className="w-full bg-white border border-stone px-3 py-2"
                />
              </div>
              <div className="sm:col-span-1 flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => removeImageRow(idx)}
                  disabled={images.length <= 1}
                  className="p-2 text-red-800 hover:bg-red-900/10 disabled:opacity-30"
                  aria-label="Remove photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Policies & Publish State */}
      <section className="bg-white border border-stone p-6 space-y-4 text-xs">
        <h2 className="font-serif text-2xl text-charcoal border-b border-stone pb-3">
          6. House Rules, Check-In Times & Publication Status
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
              Check-In Time
            </label>
            <input
              type="text"
              value={checkInTime}
              onChange={(e) => setCheckInTime(e.target.value)}
              className="w-full bg-ivory border border-stone px-3.5 py-2.5"
            />
          </div>
          <div>
            <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
              Check-Out Time
            </label>
            <input
              type="text"
              value={checkOutTime}
              onChange={(e) => setCheckOutTime(e.target.value)}
              className="w-full bg-ivory border border-stone px-3.5 py-2.5"
            />
          </div>
          <div>
            <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
              House Rules (One per line)
            </label>
            <textarea
              rows={3}
              value={houseRulesText}
              onChange={(e) => setHouseRulesText(e.target.value)}
              className="w-full bg-ivory border border-stone px-3.5 py-2.5"
            />
          </div>
          <div>
            <label className="block uppercase tracking-wider text-charcoal/75 mb-1.5">
              Cancellation Policy
            </label>
            <textarea
              rows={3}
              value={cancellationPolicy}
              onChange={(e) => setCancellationPolicy(e.target.value)}
              className="w-full bg-ivory border border-stone px-3.5 py-2.5"
            />
          </div>
        </div>

        <label className="inline-flex items-center gap-2.5 pt-2 cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="accent-deepGreen w-4 h-4"
          />
          <span className="text-sm font-medium text-charcoal">
            Published on Public Website (/villas and Homepage)
          </span>
        </label>
      </section>

      <div className="flex items-center justify-between">
        <Link
          href="/admin/villas"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider px-5 py-3 border border-stone bg-white text-charcoal"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel
        </Link>
        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-deepGreen hover:bg-forestGreen text-ivory text-xs uppercase tracking-[0.18em] px-8 py-4 font-medium"
        >
          <Save className="w-4 h-4" />
          <span>{submitLabel}</span>
        </button>
      </div>
    </form>
  );
}
