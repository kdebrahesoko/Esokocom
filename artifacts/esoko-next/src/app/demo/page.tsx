import type { Metadata } from 'next';
import { Mail } from 'lucide-react';
import { pageMetadata } from '@/lib/page-metadata';
import { CONTACT_HREF } from '@/lib/site-links';
import { DemoRequestForm } from '@/components/forms/DemoRequestForm';
import '../home.css';

const TITLE = 'Book a Demo | Esoko';
const DESC = 'See Esoko in action. Request a 30 minute demo of farmer registration, advisory, traceability and programme tools.';

export function generateMetadata(): Metadata {
  return pageMetadata(TITLE, DESC, '/demo');
}

/** Standalone /demo route replacing the original URL-less BookDemoModal. */
export default function Page() {
  return (
    <div className="esoko-home min-h-[100dvh] flex flex-col bg-white">
      <main className="flex-1">
        <section className="bg-gradient-to-br from-[#042B10] to-[#0f2318] pt-36 pb-32 px-4 md:px-6">
          <div className="container mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300 mb-4">Book a Demo</p>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white leading-tight mb-5">See Esoko in action</h1>
            <p className="text-lg text-white/70 leading-relaxed">
              Tell us about your programme and the farmers you serve. A demo takes about 30 minutes.
            </p>
          </div>
        </section>
        <section className="px-4 md:px-6 -mt-20 pb-24" aria-labelledby="demo-form-title">
          <div className="mx-auto w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-brand px-8 py-6">
              <h2 id="demo-form-title" className="text-xl font-bold text-white">Request a demo</h2>
              <p className="text-white/70 text-sm">All fields are required.</p>
            </div>
            <DemoRequestForm />
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Mail className="w-4 h-4 text-brand" aria-hidden="true" />
            Have a different question? <a href={CONTACT_HREF} data-testid="link-demo-contact" className="font-medium text-foreground hover:text-brand underline-offset-4 hover:underline">Send us a message</a>
          </p>
        </section>
      </main>
    </div>
  );
}
