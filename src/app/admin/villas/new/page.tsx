'use client';

import React from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import { VillaForm } from '@/components/admin/VillaForm';
import { useApp } from '@/context/AppContext';

export default function AdminNewVillaPage() {
  const { addVilla } = useApp();

  return (
    <AdminShell
      title="Create New Sanctuary Villa"
      subtitle="Add a new Balinese property to the live demonstration portfolio."
      breadcrumbs={[
        { label: 'Villas', href: '/admin/villas' },
        { label: 'Create Villa' },
      ]}
    >
      <VillaForm
        onSubmit={(data) => addVilla(data)}
        submitLabel="Create & Publish Villa"
      />
    </AdminShell>
  );
}
