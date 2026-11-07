'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, PhoneCall, Mail, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/home/ui/button';
import { EXISTING_CONTACT_HREF } from '@/lib/site-links';

/*
 * Replaces the source ContactSection during migration. Same heading, intro and
 * contact details; the form and demo booking stay on the existing site, so all
 * actions hand off to /#contact there. No form is rendered here.
 */
export function ContactHandoffSection() {
  return (
    <section id="contact" className="py-24 bg-white relative">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

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
              <ContactRow icon={MapPin} title="Address">11 Potato Avenue, East Legon<br />Accra, Ghana</ContactRow>
              <ContactRow icon={Phone} title="Phone"><a href="tel:+233302211611" className="hover:text-brand">+233 30 221 1611</a></ContactRow>
              <ContactRow icon={PhoneCall} title="Call Centre">1900</ContactRow>
              <ContactRow icon={Mail} title="Email"><a href="mailto:info@esoko.com" className="hover:text-brand">info@esoko.com</a></ContactRow>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-brand text-white hover:bg-brand/80 rounded-full px-8">
                <a href={EXISTING_CONTACT_HREF}>Book a Meeting</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8">
                <a href={EXISTING_CONTACT_HREF}>Request Demo</a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-3xl border border-gray-100 p-8"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-3">Send us a message</p>
            <h3 className="text-2xl font-heading font-bold text-foreground mb-3">
              Messages and demo requests are handled on the Esoko website
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-8">
              This page is part of a preview of the new Esoko site. To send a message, book a meeting or request a
              demo, continue to the contact form on the current Esoko website — your request goes straight to our team.
            </p>
            <Button asChild size="lg" className="bg-brand text-white hover:bg-brand/80 rounded-full px-8 group">
              <a href={EXISTING_CONTACT_HREF}>
                Continue to contact form
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              Prefer email? Write to <a href="mailto:info@esoko.com" className="font-medium text-foreground hover:text-brand">info@esoko.com</a>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactRow({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-brand" />
      </div>
      <div>
        <h4 className="font-semibold text-foreground">{title}</h4>
        <p className="text-muted-foreground text-sm">{children}</p>
      </div>
    </div>
  );
}
