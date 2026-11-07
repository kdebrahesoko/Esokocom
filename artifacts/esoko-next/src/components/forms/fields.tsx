'use client';

import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export const inputClass =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:border-brand disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-red-400 aria-[invalid=true]:bg-red-50/40';

export function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium leading-none text-foreground">
        {label} <span className="text-red-500" aria-hidden="true">*</span>
        <span className="sr-only"> (required)</span>
      </label>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            key={error}
            id={`${id}-error`}
            data-testid={`error-${id}`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1 text-xs text-red-600"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/** aria props wiring an input to its error message. */
export function errorProps(id: string, error?: string) {
  return { id, 'aria-invalid': !!error, 'aria-describedby': error ? `${id}-error` : undefined, 'aria-required': true };
}

export function ServerError({ message, testId }: { message: string | null; testId: string }) {
  return (
    <div aria-live="assertive">
      {message && (
        <motion.div
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: [0, -4, 4, -2, 0] }}
          transition={{ duration: 0.35 }}
          data-testid={testId}
          role="alert"
          className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
        >
          {message} Your entries have been kept.
        </motion.div>
      )}
    </div>
  );
}

export function SubmitLabel({ pending, idle, busy }: { pending: boolean; idle: string; busy: string }) {
  return pending ? (
    <>
      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
      {busy}
    </>
  ) : (
    <>{idle}</>
  );
}

export function SuccessPanel({
  title, message, id, onReset, resetLabel, testId,
}: { title: string; message: string; id: number; onReset: () => void; resetLabel: string; testId: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center py-12 text-center"
      role="status"
      data-testid={testId}
    >
      <motion.div
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.05 }}
        className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mb-4"
      >
        <CheckCircle2 className="w-9 h-9 text-brand" aria-hidden="true" />
      </motion.div>
      <h3 className="text-2xl font-bold text-foreground mb-2" tabIndex={-1} data-autofocus>{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-sm">{message}</p>
      <p className="text-xs text-muted-foreground mb-8">
        Reference number{' '}
        <span className="font-mono font-semibold text-foreground bg-white border border-gray-200 rounded px-2 py-0.5" data-testid={`${testId}-reference`}>
          #{id}
        </span>
      </p>
      <button
        type="button"
        onClick={onReset}
        data-testid={`${testId}-reset`}
        className="inline-flex items-center justify-center min-h-9 px-6 rounded-full border border-gray-300 text-sm font-medium hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      >
        {resetLabel}
      </button>
    </motion.div>
  );
}

export function NoScriptNote() {
  return (
    <noscript>
      <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        This form needs JavaScript to send. Please enable JavaScript, or email info@esoko.com.
      </p>
    </noscript>
  );
}
