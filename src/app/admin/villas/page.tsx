'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/admin/AdminShell';
import { SafeImage } from '@/components/ui/SafeImage';
import { useApp } from '@/context/AppContext';
import { formatIdr } from '@/lib/format-currency';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  BedDouble,
  Users,
  MapPin,
} from 'lucide-react';

export default function AdminVillasPage() {
  const { villas, toggleVillaPublished, deleteVilla } = useApp();
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const filtered = villas.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.location.toLowerCase().includes(search.toLowerCase()) ||
      v.concept.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (locationFilter !== 'All' && v.location !== locationFilter) return false;
    if (statusFilter === 'published' && !v.published) return false;
    if (statusFilter === 'draft' && v.published) return false;
    return true;
  });

  const targetVilla = villas.find((v) => v.id === deleteTargetId);

  return (
    <AdminShell
      title="Villa Portfolio Management"
      subtitle="Create, edit, publish, or remove sanctuaries in real time."
      breadcrumbs={[{ label: 'Villas' }]}
      actions={
        <Link
          href="/admin/villas/new"
          className="bg-deepGreen hover:bg-forestGreen text-ivory text-xs uppercase tracking-wider px-5 py-2.5 inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Villa
        </Link>
      }
    >
      {/* Filters Bar */}
      <div className="bg-white border border-stone p-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center text-xs">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-charcoal/50 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by villa name, location, or architectural concept..."
            className="w-full bg-ivory border border-stone pl-10 pr-4 py-2.5 focus:outline-none focus:border-deepGreen"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full bg-ivory border border-stone px-3.5 py-2.5"
          >
            <option value="All">All Regions</option>
            <option value="Ubud">Ubud</option>
            <option value="Uluwatu">Uluwatu</option>
            <option value="Canggu">Canggu</option>
            <option value="Gianyar">Gianyar</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="w-full bg-ivory border border-stone px-3.5 py-2.5"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Unpublished / Hidden</option>
          </select>
        </div>
      </div>

      {/* Villa Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((villa) => (
          <div
            key={villa.id}
            className="bg-white border border-stone overflow-hidden flex flex-col justify-between shadow-subtle"
          >
            <div>
              <div className="relative h-56 border-b border-stone">
                <SafeImage
                  src={villa.images[0]?.url}
                  fallbackSrc={villa.images[0]?.fallbackUrl}
                  alt={villa.name}
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-ivory/95 text-charcoal px-2.5 py-1 text-[10px] uppercase tracking-widest font-medium">
                    {villa.location}
                  </span>
                  <span
                    className={`px-2.5 py-1 text-[10px] uppercase tracking-widest font-medium ${
                      villa.published
                        ? 'bg-deepGreen text-ivory'
                        : 'bg-charcoal/85 text-sand'
                    }`}
                  >
                    {villa.published ? 'Published' : 'Unpublished'}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-serif text-2xl text-charcoal">{villa.name}</h2>
                    <p className="text-xs text-charcoal/65 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-bronze" />
                      {villa.specificArea}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-charcoal/60 block">Base Rate</span>
                    <span className="font-serif text-xl font-medium text-deepGreen">
                      {formatIdr(villa.basePricePerNight)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-charcoal/75 line-clamp-2">{villa.concept}</p>

                <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-stone/60 text-xs text-charcoal/80">
                  <span className="inline-flex items-center gap-1">
                    <BedDouble className="w-3.5 h-3.5 text-bronze" /> {villa.bedrooms} Bedrooms
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-bronze" /> Max {villa.maxGuests} Guests
                  </span>
                  <span>Min {villa.minStayNights} Nights</span>
                  <span>{villa.amenities.length} Amenities</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-ivory/70 border-t border-stone flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/villas/${villa.id}/edit`}
                  className="inline-flex items-center gap-1.5 bg-deepGreen text-ivory px-3.5 py-2 hover:bg-forestGreen transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </Link>
                <button
                  type="button"
                  onClick={() => toggleVillaPublished(villa.id)}
                  className="inline-flex items-center gap-1.5 border border-stone bg-white px-3 py-2 hover:border-bronze"
                >
                  {villa.published ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-charcoal/70" /> Unpublish
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-deepGreen" /> Publish
                    </>
                  )}
                </button>
                <Link
                  href={`/villas/${villa.slug}`}
                  className="inline-flex items-center gap-1 border border-stone bg-white px-3 py-2 hover:border-bronze"
                  title="View Public Villa Page"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Public View
                </Link>
              </div>

              <button
                type="button"
                onClick={() => setDeleteTargetId(villa.id)}
                className="p-2 text-red-800 hover:bg-red-900/10"
                aria-label={`Delete ${villa.name}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {targetVilla && (
        <div
          className="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-ivory border border-stone max-w-md w-full p-6 shadow-editorial space-y-4">
            <h3 className="font-serif text-2xl text-charcoal">
              Remove {targetVilla.name}?
            </h3>
            <p className="text-xs text-charcoal/75 leading-relaxed">
              This will remove <strong>{targetVilla.name}</strong> from the current prototype inventory. You can restore all default properties at any time using &ldquo;Reset Demo Data&rdquo;.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 text-xs uppercase tracking-wider border border-stone"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteVilla(targetVilla.id);
                  setDeleteTargetId(null);
                }}
                className="px-4 py-2 text-xs uppercase tracking-wider bg-red-800 text-white"
              >
                Delete Villa
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
