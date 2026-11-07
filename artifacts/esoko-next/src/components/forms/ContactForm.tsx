'use client';

import { Button } from '@/components/home/ui/button';
import type { ContactInput } from '@/lib/public-forms';
import { usePublicForm } from './usePublicForm';
import { Field, errorProps, inputClass, NoScriptNote, ServerError, SubmitLabel, SuccessPanel } from './fields';

const EMPTY: ContactInput = { name: '', email: '', subject: '', message: '' };

/** Migrated contact form: posts to the existing /api/contact via submitPublicForm. */
export function ContactForm() {
  const f = usePublicForm('contact', EMPTY);

  if (f.receipt) {
    return (
      <SuccessPanel
        testId="contact-success"
        title="Message received"
        message={f.receipt.message}
        id={f.receipt.id}
        onReset={f.reset}
        resetLabel="Send another message"
      />
    );
  }

  return (
    <>
      <h3 className="text-xl font-bold text-foreground mb-6">Send us a message</h3>
      <NoScriptNote />
      <form ref={f.formRef} onSubmit={f.onSubmit} noValidate className="space-y-5" data-testid="form-contact" aria-busy={f.pending}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field id="contact-name" label="Name" error={f.errors.name}>
            <input {...errorProps('contact-name', f.errors.name)} name="name" data-testid="input-contact-name"
              className={inputClass} placeholder="Your name" autoComplete="name" maxLength={100}
              value={f.values.name} onChange={f.set('name')} />
          </Field>
          <Field id="contact-email" label="Email" error={f.errors.email}>
            <input {...errorProps('contact-email', f.errors.email)} name="email" type="email" data-testid="input-contact-email"
              className={inputClass} placeholder="you@example.com" autoComplete="email"
              value={f.values.email} onChange={f.set('email')} />
          </Field>
        </div>
        <Field id="contact-subject" label="Subject" error={f.errors.subject}>
          <input {...errorProps('contact-subject', f.errors.subject)} name="subject" data-testid="input-contact-subject"
            className={inputClass} placeholder="How can we help?" maxLength={200}
            value={f.values.subject} onChange={f.set('subject')} />
        </Field>
        <Field id="contact-message" label="Message" error={f.errors.message}>
          <textarea {...errorProps('contact-message', f.errors.message)} name="message" data-testid="input-contact-message"
            className={`${inputClass} h-auto min-h-[120px] resize-none`} rows={5} maxLength={2000}
            placeholder="Tell us about your project, team size, or any questions you have…"
            value={f.values.message} onChange={f.set('message')} />
          <p className="text-right text-[11px] text-muted-foreground tabular-nums">{f.values.message.length}/2000</p>
        </Field>

        <ServerError message={f.serverError} testId="contact-server-error" />

        <Button type="submit" disabled={!f.hydrated || f.pending} data-testid="button-contact-submit"
          className="w-full rounded-full bg-brand hover:bg-brand/80 text-white h-11 text-base font-semibold">
          <SubmitLabel pending={f.pending} idle="Send Message" busy="Sending…" />
        </Button>
      </form>
    </>
  );
}
