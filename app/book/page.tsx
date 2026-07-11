'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function BookConsultationPage() {
  const [status, setStatus] = useState<'idle' | 'saving' | 'confirmed' | 'error'>('idle');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('saving');
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    setStatus(response.ok ? 'confirmed' : 'error');
  }

  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 shadow-2xl">
        <Image src="/brand/atlas-logo-compass.webp" alt="Atlas Travel" width={56} height={56} className="mb-5 h-14 w-14 rounded-xl object-cover" />
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">Atlas Travel</p>
        <h1 className="mt-3 text-3xl font-semibold">Book your consultation</h1>
        <p className="mt-3 text-muted-foreground">Choose a demo appointment with Maria. Sofia will add the confirmed outcome to Mission Control.</p>

        {status === 'confirmed' ? (
          <div className="mt-8 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
            <h2 className="font-semibold text-emerald-300">Consultation confirmed</h2>
            <p className="mt-2 text-sm text-muted-foreground">Your demo booking is now visible to the Atlas team.</p>
            <Link href="/" className="mt-5 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Open Mission Control</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="block text-sm">Name<input required name="name" className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2" /></label>
            <label className="block text-sm">Email<input required type="email" name="email" className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2" /></label>
            <label className="block text-sm">Preferred time<input required type="datetime-local" name="date" className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2" /></label>
            <label className="block text-sm">Trip notes<textarea name="notes" rows={4} className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2" /></label>
            <button disabled={status === 'saving'} className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground disabled:opacity-60">{status === 'saving' ? 'Confirming...' : 'Confirm consultation'}</button>
            {status === 'error' && <p className="text-sm text-red-400">The booking could not be saved. Check the form and try again.</p>}
          </form>
        )}
      </div>
    </main>
  );
}
