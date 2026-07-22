import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useBookDemo } from '@/context/BookDemoContext';

const COUNTRIES = [
  'Ghana', 'Nigeria', 'Kenya', 'Ethiopia', 'Tanzania', 'Uganda', 'Rwanda',
  'Côte d\'Ivoire', 'Senegal', 'Cameroon', 'Mozambique', 'Zambia', 'Zimbabwe',
  'Mali', 'Burkina Faso', 'Niger', 'Sudan', 'South Sudan', 'Somalia',
  'Madagascar', 'Malawi', 'Angola', 'Other',
];

const USE_CASES = [
  'Farmer registration & profiling',
  'Field data collection & surveys',
  'Agricultural extension & advisory',
  'Supply chain traceability',
  'Market linkages',
  'Financial inclusion (credit/insurance)',
  'Government programme management',
  'NGO/development project M&E',
  'Sustainability & carbon tracking',
  'Other',
];

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  organization: z.string().min(2, 'Organization is required'),
  country: z.string().min(2, 'Please select a country'),
  useCase: z.string().min(2, 'Please select a use case'),
});

type FormData = z.infer<typeof schema>;

export function BookDemoModal() {
  const { isOpen, close } = useBookDemo();
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/demo-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? 'Submission failed. Please try again.');
      }
      setSubmitted(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  const handleClose = () => {
    close();
    setTimeout(() => {
      setSubmitted(false);
      setServerError(null);
      reset();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-modal-title"
          >
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="bg-brand px-8 py-6 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                      <img src="/esoko-logo.png" alt="Esoko" style={{ height: '18px', width: 'auto', filter: 'brightness(0) invert(1)' }} />
                    </div>
                    <div>
                      <h2 id="demo-modal-title" className="text-xl font-bold text-white">
                        Book a Demo
                      </h2>
                      <p className="text-white/70 text-sm">See Esoko in action — takes 30 min</p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="overflow-y-auto flex-1">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-9 h-9 text-brand" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">You're on the list!</h3>
                    <p className="text-muted-foreground mb-8">
                      Thanks for your interest. Our team will reach out within 1 business day to schedule your demo.
                    </p>
                    <Button
                      onClick={handleClose}
                      className="rounded-full px-8 bg-brand hover:bg-brand/80 text-white"
                    >
                      Close
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-8 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label htmlFor="demo-name">Full name <span className="text-red-500">*</span></Label>
                        <Input
                          id="demo-name"
                          placeholder="Ama Owusu"
                          autoComplete="name"
                          aria-invalid={!!errors.name}
                          {...register('name')}
                        />
                        {errors.name && (
                          <p className="text-xs text-red-500" role="alert">{errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="demo-email">Work email <span className="text-red-500">*</span></Label>
                        <Input
                          id="demo-email"
                          type="email"
                          placeholder="ama@organization.org"
                          autoComplete="email"
                          aria-invalid={!!errors.email}
                          {...register('email')}
                        />
                        {errors.email && (
                          <p className="text-xs text-red-500" role="alert">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="demo-org">Organization <span className="text-red-500">*</span></Label>
                      <Input
                        id="demo-org"
                        placeholder="Ministry of Agriculture / USAID / Cargill…"
                        autoComplete="organization"
                        aria-invalid={!!errors.organization}
                        {...register('organization')}
                      />
                      {errors.organization && (
                        <p className="text-xs text-red-500" role="alert">{errors.organization.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label htmlFor="demo-country">Country <span className="text-red-500">*</span></Label>
                        <select
                          id="demo-country"
                          aria-invalid={!!errors.country}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...register('country')}
                        >
                          <option value="">Select country…</option>
                          {COUNTRIES.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        {errors.country && (
                          <p className="text-xs text-red-500" role="alert">{errors.country.message}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="demo-usecase">Primary use case <span className="text-red-500">*</span></Label>
                        <select
                          id="demo-usecase"
                          aria-invalid={!!errors.useCase}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...register('useCase')}
                        >
                          <option value="">Select use case…</option>
                          {USE_CASES.map(u => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </select>
                        {errors.useCase && (
                          <p className="text-xs text-red-500" role="alert">{errors.useCase.message}</p>
                        )}
                      </div>
                    </div>

                    {serverError && (
                      <div
                        className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
                        role="alert"
                      >
                        {serverError}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-full bg-brand hover:bg-brand/80 text-white h-11 text-base font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        'Request Demo'
                      )}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground">
                      No spam. Our team typically responds within 1 business day.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
