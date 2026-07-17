import { Leaf, Linkedin, Twitter, Facebook, Youtube, Instagram } from 'lucide-react';
import { Link } from 'wouter';

const FOOTER_LINKS = {
  Products: ['Insyt', 'Survey', 'Messaging', 'Marketplace', 'Deployments', 'Content', 'AI'],
  Company: ['About', 'Leadership', 'Careers', 'Investors', 'News', 'Events'],
  Resources: ['Developer Hub', 'Documentation', 'Blog', 'Customer Stories', 'Reports', 'Webinars'],
  Support: ['Help Center', 'Status', 'Contact'],
  Legal: ['Privacy Policy', 'Terms', 'Cookies', 'Accessibility', 'Security', 'Compliance']
};

export function Footer() {
  return (
    <footer className="bg-[#1F2937] pt-20 pb-10 text-white/80">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-16 border-b border-white/10 pb-12">
          <div className="max-w-sm text-center md:text-left">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-2xl tracking-tight text-white">
                Esoko
              </span>
            </Link>
            <p className="text-white/60 font-medium">
              Empowering Farmers. Transforming Agriculture. Restoring Earth.
            </p>
          </div>

          <div className="flex gap-4">
            <SocialIcon icon={Linkedin} />
            <SocialIcon icon={Twitter} />
            <SocialIcon icon={Facebook} />
            <SocialIcon icon={Youtube} />
            <SocialIcon icon={Instagram} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-16">
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-heading font-bold text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link}>
                    <Link href={`/${category.toLowerCase()}/${link.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-white/60 hover:text-white transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-white/10 text-sm text-white/40">
          <p>© 2025 Esoko. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Accra, Ghana</p>
        </div>

      </div>
    </footer>
  );
}

function SocialIcon({ icon: Icon }: { icon: any }) {
  return (
    <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
      <Icon className="w-5 h-5" />
    </a>
  );
}
