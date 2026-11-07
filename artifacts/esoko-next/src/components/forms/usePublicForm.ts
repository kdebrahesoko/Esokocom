'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  PublicFormError, submitPublicForm, validatePublicForm,
  type FieldErrors, type FormKind, type SubmissionReceipt,
} from '@/lib/public-forms';

/** Shared controlled-form state: validation, in-flight guard, receipt, reset. */
export function usePublicForm<T extends Record<string, string>>(kind: FormKind, empty: T) {
  const [values, setValues] = useState<T>(empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [receipt, setReceipt] = useState<SubmissionReceipt | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const inFlight = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => { setHydrated(true); }, []);

  const set = (field: keyof T) => (e: { target: { value: string } }) => {
    const value = e.target.value;
    setValues(v => ({ ...v, [field]: value }));
    if (errors[field as string]) setErrors(({ [field as string]: _drop, ...rest }) => rest);
  };

  const focusFirstError = (errs: FieldErrors) => {
    const first = Object.keys(empty).find(k => errs[k]);
    if (!first) return;
    requestAnimationFrame(() => {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inFlight.current) return;
    setServerError(null);
    const errs = validatePublicForm(kind, values);
    setErrors(errs);
    if (Object.keys(errs).length) { focusFirstError(errs); return; }
    inFlight.current = true;
    setPending(true);
    try {
      const r = await submitPublicForm(kind, values);
      setReceipt(r);
      setValues(empty);
      setErrors({});
    } catch (err) {
      if (err instanceof PublicFormError) {
        setErrors(err.fieldErrors);
        setServerError(err.message);
        focusFirstError(err.fieldErrors);
      } else {
        setServerError('We could not reach the server. Check your connection and try again.');
      }
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  };

  const reset = () => {
    setReceipt(null); setValues(empty); setErrors({}); setServerError(null);
  };

  return { values, errors, serverError, pending, receipt, hydrated, set, onSubmit, reset, formRef };
}
