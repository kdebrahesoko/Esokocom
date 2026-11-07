'use client';

import { Button } from '@/components/home/ui/button';
import { DEMO_COUNTRIES, DEMO_USE_CASES, type DemoRequestInput } from '@/lib/public-forms';
import { usePublicForm } from './usePublicForm';
import { Field, errorProps, inputClass, NoScriptNote, ServerError, SubmitLabel, SuccessPanel } from './fields';

const EMPTY: DemoRequestInput = { name: '', email: '', organization: '', country: '', useCase: '' };

/** Migrated demo request form (formerly the global BookDemoModal): posts to /api/demo-requests. */
export function DemoRequestForm() {
  const f = usePublicForm('demo', EMPTY);

  if (f.receipt) {
    return (
      <div className="p-8">
        <SuccessPanel
          testId="demo-success"
          title="Demo request received"
          message={f.receipt.message}
          id={f.receipt.id}
          onReset={f.reset}
          resetLabel="Submit another request"
        />
      </div>
    );
  }

  return (
    <div className="p-8">
      <NoScriptNote />
      <form ref={f.formRef} onSubmit={f.onSubmit} noValidate className="space-y-5" data-testid="form-demo" aria-busy={f.pending}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field id="demo-name" label="Full name" error={f.errors.name}>
            <input {...errorProps('demo-name', f.errors.name)} name="name" data-testid="input-demo-name"
              className={inputClass} placeholder="Ama Owusu" autoComplete="name" maxLength={100}
              value={f.values.name} onChange={f.set('name')} />
          </Field>
          <Field id="demo-email" label="Work email" error={f.errors.email}>
            <input {...errorProps('demo-email', f.errors.email)} name="email" type="email" data-testid="input-demo-email"
              className={inputClass} placeholder="ama@organization.org" autoComplete="email"
              value={f.values.email} onChange={f.set('email')} />
          </Field>
        </div>
        <Field id="demo-org" label="Organization" error={f.errors.organization}>
          <input {...errorProps('demo-org', f.errors.organization)} name="organization" data-testid="input-demo-organization"
            className={inputClass} placeholder="Ministry of Agriculture / USAID / Cargill…" autoComplete="organization" maxLength={200}
            value={f.values.organization} onChange={f.set('organization')} />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field id="demo-country" label="Country" error={f.errors.country}>
            <select {...errorProps('demo-country', f.errors.country)} name="country" data-testid="select-demo-country"
              className={inputClass} value={f.values.country} onChange={f.set('country')}>
              <option value="">Select country…</option>
              {DEMO_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field id="demo-usecase" label="Primary use case" error={f.errors.useCase}>
            <select {...errorProps('demo-usecase', f.errors.useCase)} name="useCase" data-testid="select-demo-usecase"
              className={inputClass} value={f.values.useCase} onChange={f.set('useCase')}>
              <option value="">Select use case…</option>
              {DEMO_USE_CASES.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </Field>
        </div>

        <ServerError message={f.serverError} testId="demo-server-error" />

        <Button type="submit" disabled={!f.hydrated || f.pending} data-testid="button-demo-submit"
          className="w-full rounded-full bg-brand hover:bg-brand/80 text-white h-11 text-base font-semibold">
          <SubmitLabel pending={f.pending} idle="Request Demo" busy="Submitting…" />
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Send your programme details to request a demonstration.
        </p>
      </form>
    </div>
  );
}
