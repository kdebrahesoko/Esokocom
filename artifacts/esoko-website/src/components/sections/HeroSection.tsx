import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Leaf, CloudRain, MessageSquare, Satellite, BrainCircuit } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] pt-24 pb-16 flex items-center overflow-hidden bg-gradient-to-br from-[#0B6B3A] to-[#1F2937]">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNHYtNGgtMnY0aC00djJoNHY0aDJ2LTRoNHYtMmgtNHptMC0zMFYwaC0ydjRoLTR2Mmg0djRoMnYtNGg0VjRoLTR6bS0yMCAxMnYtNGgtMnY0SC0ydjJoNHY0aDJ2LTRoNHYtMmgtNHptMCAzMHYtNGgtMnY0SC0ydjJoNHY0aDJ2LTRoNHYtMmgtNHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvZz48L3N2Zz4=')] opacity-20 mix-blend-overlay"></div>
      
      {/* Animated glowing orbs behind cards */}
      <div className="absolute right-[20%] top-[30%] w-96 h-96 bg-accent rounded-full blur-[128px] opacity-20"></div>
      <div className="absolute right-[10%] bottom-[20%] w-64 h-64 bg-secondary rounded-full blur-[96px] opacity-20"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Content (60%) */}
          <div className="w-full lg:w-[60%] flex flex-col gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 w-fit"
            >
              <Leaf className="w-4 h-4 text-secondary" />
              <span className="text-white/90 text-sm font-medium">Africa's #1 Agritech Platform</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-[72px] leading-[1.1] font-heading font-bold text-white tracking-tight"
            >
              Digital Agriculture for a <br />
              <span className="text-gradient-gold">Smarter, Sustainable</span><br />
              Africa
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-white/80 max-w-2xl font-light leading-relaxed"
            >
              Esoko empowers governments, NGOs, agribusinesses and millions of farmers with AI-powered data collection, agricultural intelligence, digital advisory services, market access, and climate-smart solutions.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 mt-4"
            >
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white rounded-full px-8 h-14 text-base font-semibold border-0">
                Explore Solutions
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 h-14 text-base font-semibold bg-transparent">
                Book a Demo
              </Button>
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 rounded-full px-6 h-14 text-base font-semibold group">
                <Play className="w-5 h-5 mr-2 text-secondary group-hover:scale-110 transition-transform" />
                Watch Video
              </Button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-6 mt-8 pt-8 border-t border-white/10"
            >
              <div className="flex flex-col">
                <span className="text-white font-bold text-xl">18+</span>
                <span className="text-white/60 text-sm">Years Experience</span>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-xl">40+</span>
                <span className="text-white/60 text-sm">Countries Active</span>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-xl">Millions</span>
                <span className="text-white/60 text-sm">Farmers Reached</span>
              </div>
            </motion.div>
          </div>

          {/* Right Content (40%) - Floating Dashboard */}
          <div className="w-full lg:w-[40%] relative h-[600px] hidden md:block">
            {/* Main Card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-[#114d2e]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl z-20"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-semibold">Live Farm Analytics</h3>
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
              </div>
              <div className="flex items-end gap-3 h-32 mb-2">
                {[40, 70, 45, 90, 65, 80, 55].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="flex-1 bg-gradient-to-t from-accent/20 to-accent rounded-t-sm"
                  ></motion.div>
                ))}
              </div>
              <div className="flex justify-between text-white/50 text-xs">
                <span>Mon</span>
                <span>Sun</span>
              </div>
            </motion.div>

            {/* Weather Widget */}
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-10 right-4 w-48 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-xl z-30"
            >
              <div className="flex items-center gap-3">
                <CloudRain className="w-8 h-8 text-sky-400" />
                <div>
                  <div className="text-2xl font-bold text-white">28°C</div>
                  <div className="text-xs text-white/70">Accra, Ghana</div>
                </div>
              </div>
            </motion.div>

            {/* SMS Counter */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-20 left-0 w-56 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-xl z-30"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">2.4M Messages</div>
                  <div className="text-xs text-white/70">Sent today</div>
                </div>
              </div>
            </motion.div>

            {/* Satellite Widget */}
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute top-20 left-0 w-48 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-xl z-10"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Satellite className="w-4 h-4 text-white/70" />
                  <span className="text-xs text-white/70 uppercase tracking-wider font-semibold">Satellites Active</span>
                </div>
                <div className="h-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-[#0B6B3A] rounded-lg border border-white/10 overflow-hidden relative">
                  <div className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent to-white/20 animate-[pulse_3s_ease-in-out_infinite] left-0 right-0"></div>
                </div>
              </div>
            </motion.div>

            {/* AI Insight */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute bottom-10 right-4 w-56 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-xl z-30"
            >
              <div className="flex items-start gap-3">
                <BrainCircuit className="w-5 h-5 text-secondary mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-secondary mb-1">AI INSIGHT</div>
                  <div className="text-sm text-white leading-tight">Pest risk: Low in Northern Region. Recommend planting next week.</div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
