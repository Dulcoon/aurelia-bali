'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { VillaForm } from '@/components/admin/VillaForm';
import { useApp } from '@/context/AppContext';

export default function AdminEditVillaPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const { villas, updateVilla } = useApp();

  const villa = villas.find((v) => v.id === id || v.slug === id);

  if (!villa) {
    return (
      <AdminShell
        title="Villa Not Found"
        breadcrumbs={[{ label: 'Villas', href: '/admin/villas' }, { label: 'Not Found' }]}
      >
        <div className="bg-white border border-stone p-8 text-center space-y-4">
          <p className="text-sm text-charcoal/75">Could not find villa with ID &ldquo;{id}&rdquo;.</p>
          <Link
            href="/admin/villas"
            className="inline-block bg-deepGreen text-ivory text-xs uppercase tracking-widest px-5 py-2.5"
          >
            Back to Villas
          </Link>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title={`Edit ${villa.name}`}
      subtitle="Changes immediately update public villa pages, filters, and booking calculators."
      breadcrumbs={[
        { label: 'Villas', href: '/admin/villas' },
        { label: villa.name },
      ]}
    >
      <VillaForm
        initialVilla={villa}
        onSubmit={(data) => updateVilla(villa.id, data)}
        submitLabel="Save Villa Changes"
      />
    </AdminShell>
  );
}
