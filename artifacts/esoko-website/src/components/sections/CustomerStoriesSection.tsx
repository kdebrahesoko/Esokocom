import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const STORIES = [
  {
    title: "Ghana MoFA Farmer Registry",
    org: "Ministry of Food and Agriculture, Ghana",
    category: "Government",
    categoryColor: "bg-blue-100 text-blue-800",
    description: "Registered 1.2 million farmers across all 16 regions using Insyt's digital profiling system, replacing paper-based systems and enabling targeted subsidy delivery.",
    stat: "1.2M farmers registered"
  },
  {
    title: "USAID Feed the Future",
    org: "USAID West Africa",
    category: "Development",
    categoryColor: "bg-purple-100 text-purple-800",
    description: "Deployed Esoko's messaging platform to deliver climate-smart farming advice to 800,000 smallholder farmers across Ghana, Nigeria, and Senegal.",
    stat: "800K farmers reached"
  },
  {
    title: "Cocoa Climate Initiative",
    org: "World Cocoa Foundation",
    category: "Sustainability",
    categoryColor: "bg-green-100 text-green-800",
    description: "Used satellite monitoring and AI analytics to track deforestation risks in cocoa growing regions, enabling real-time alerts to field teams.",
    stat: "500K hectares monitored"
  },
  {
    title: "Digital Market Connect",
    org: "AGRA",
    category: "Market Access",
    categoryColor: "bg-orange-100 text-orange-800",
    description: "Connected 150,000 smallholder farmers to verified buyers through Esoko Marketplace, increasing average farm income by 34%.",
    stat: "+34% farmer income"
  }
];

export function CustomerStoriesSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
              Stories of Transformation
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={scrollPrev}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>
            <button 
              onClick={scrollNext}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-6">
            {STORIES.map((story, i) => (
              <div key={i} className="pl-6 min-w-0 flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%]">
                <div className="bg-gray-50 rounded-2xl p-8 h-full flex flex-col border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="mb-6 flex justify-between items-start">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${story.categoryColor}`}>
                      {story.category}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
                    {story.title}
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground mb-6">
                    {story.org}
                  </p>
                  
                  <p className="text-foreground/80 leading-relaxed mb-8 flex-1">
                    "{story.description}"
                  </p>
                  
                  <div className="pt-6 border-t border-gray-200 mt-auto flex items-end justify-between">
                    <div className="font-heading font-bold text-xl text-primary">
                      {story.stat}
                    </div>
                    <a href="#" className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1">
                      Read Full Story <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {STORIES.map((_, index) => (
            <button
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                index === selectedIndex ? 'bg-primary' : 'bg-gray-300'
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
