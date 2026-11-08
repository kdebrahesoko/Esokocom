import { SITE_SOCIAL_LINKS } from "@/lib/site-config";
import { SocialBrandIcon } from "./SocialBrandIcon";
import "./social-links.css";

/** Ordinary outbound anchors: no SDK, tracking, feeds or client-side handlers. */
export function SocialLinks({ compact = false }: { compact?: boolean }) {
  return (
    <nav
      className={compact ? "esoko-social-footer-icons" : "esoko-social-platforms"}
      aria-label={compact ? "Follow Esoko on social media" : "Esoko social channels"}
    >
      {SITE_SOCIAL_LINKS.map(platform => (
        <a
          key={platform.name}
          className={compact ? "esoko-social-footer-link" : "esoko-social-platform-link"}
          href={platform.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Esoko on ${platform.name} (opens in a new tab)`}
        >
          <span className="esoko-social-icon"><SocialBrandIcon platform={platform.name} /></span>
          {!compact && (
            <>
              <span className="esoko-social-platform-name">{platform.name}</span>
              <span className="esoko-social-context">{platform.context}</span>
              <span className="esoko-social-visit">Visit {platform.name}</span>
            </>
          )}
        </a>
      ))}
    </nav>
  );
}
