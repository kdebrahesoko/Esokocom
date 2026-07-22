import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Phone, PhoneCall, Mail, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useBookDemo } from '@/context/BookDemoContext';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(2, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

export function ContactSection() {
  const { open } = useBookDemo();
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
      const res = await fetch(`${import.meta.env.BASE_URL}api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? 'Submission failed. Please try again.');
      }
      setSubmitted(true);
      reset();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  return (
    <section id="contact" className="py-24 bg-white relative">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Left column — info + CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              Get In Touch
            </h2>
            <p className="text-muted-foreground mb-10 max-w-md">
              Whether you want a product demo, have a partnership idea, or simply want to learn more — we'd love to hear from you.
            </p>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Address</h4>
                  <p className="text-muted-foreground text-sm">11 Potato Avenue, East Legon<br />Accra, Ghana</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Phone</h4>
                  <p className="text-muted-foreground text-sm">+233 30 221 1611</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Call Centre</h4>
                  <p className="text-muted-foreground text-sm">1900</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Email</h4>
                  <p className="text-muted-foreground text-sm">info@esoko.com</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-brand text-white hover:bg-brand/80 rounded-full px-8"
                onClick={open}
              >
                Book a Meeting
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8"
                onClick={open}
              >
                Request Demo
              </Button>
            </div>
          </motion.div>

          {/* Right column — contact form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-3xl border border-gray-100 p-8"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-9 h-9 text-brand" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Message received!</h3>
                <p className="text-muted-foreground mb-8">
                  Thanks for reaching out. We'll get back to you within 1 business day.
                </p>
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setSubmitted(false)}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-foreground mb-6">Send us a message</h3>
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-name">Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="contact-name"
                        placeholder="Your name"
                        autoComplete="name"
                        aria-invalid={!!errors.name}
                        {...register('name')}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500" role="alert">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="contact-email">Email <span className="text-red-500">*</span></Label>
                      <Input
                        id="contact-email"
                        type="email"
                        placeholder="you@example.com"
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
                    <Label htmlFor="contact-subject">Subject <span className="text-red-500">*</span></Label>
                    <Input
                      id="contact-subject"
                      placeholder="How can we help?"
                      aria-invalid={!!errors.subject}
                      {...register('subject')}
                    />
                    {errors.subject && (
                      <p className="text-xs text-red-500" role="alert">{errors.subject.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-message">Message <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="contact-message"
                      placeholder="Tell us about your project, team size, or any questions you have…"
                      rows={5}
                      aria-invalid={!!errors.message}
                      {...register('message')}
                      className="resize-none"
                    />
                    {errors.message && (
                      <p className="text-xs text-red-500" role="alert">{errors.message.message}</p>
                    )}
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
                        Sending…
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </form>
              </>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
