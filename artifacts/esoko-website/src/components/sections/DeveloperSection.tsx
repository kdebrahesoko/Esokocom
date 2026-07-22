import { motion } from 'framer-motion';
import { Code2, Terminal, Key, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DeveloperSection() {
  return (
    <section className="py-24 bg-[#1F2937] text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold text-white mb-4"
          >
            Build on Esoko
          </motion.h2>
          <p className="text-lg text-white/60">Integrate digital agriculture capabilities directly into your applications.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FeatureCard 
              icon={Code2} 
              title="REST APIs" 
              desc="Full-featured REST APIs with OpenAPI documentation"
            />
            <FeatureCard 
              icon={Terminal} 
              title="SDKs" 
              desc="Python, JavaScript, and PHP SDKs for rapid integration"
            />
            <FeatureCard 
              icon={Key} 
              title="Authentication" 
              desc="OAuth 2.0, API keys, and webhook authentication"
            />
            <FeatureCard 
              icon={GitBranch} 
              title="Sandbox" 
              desc="Test environment with sample data and webhooks"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#0f172a] rounded-xl border border-white/10 overflow-hidden shadow-2xl"
          >
            <div className="flex items-center px-4 py-3 bg-white/5 border-b border-white/10">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="ml-4 text-xs font-mono text-white/40">send-campaign.js</div>
            </div>
            <div className="p-6 overflow-x-auto text-sm font-mono leading-relaxed">
<pre className="text-white/80">
<span className="text-purple-400">const</span> esoko = <span className="text-purple-400">new</span> <span className="text-yellow-200">EsokoClient</span>(&#123; 
  apiKey: <span className="text-green-300">'ek_live_x89f2...'</span> 
&#125;);

<span className="text-white/40">// Send SMS to 10,000 farmers</span>
<span className="text-purple-400">const</span> campaign = <span className="text-purple-400">await</span> esoko.messaging.<span className="text-blue-300">create</span>(&#123;
  recipients: farmerList,
  message: <span className="text-green-300">'Pest alert: Apply neem solution'</span>,
  channels: [<span className="text-green-300">'sms'</span>, <span className="text-green-300">'whatsapp'</span>]
&#125;);

<span className="text-sky-300">console</span>.<span className="text-blue-300">log</span>(<span className="text-green-300">`Sent to $&#123;</span>campaign.delivered<span className="text-green-300">&#125; farmers`</span>);
</pre>
            </div>
            <div className="p-4 bg-white/5 border-t border-white/10 flex gap-4">
              <Button className="bg-[#C05C0E] hover:bg-[#A84D0A] text-white rounded-md">
                Read Documentation
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent rounded-md">
                Get API Keys
              </Button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
      <Icon className="w-8 h-8 text-secondary mb-4" />
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
    </div>
  );
}
