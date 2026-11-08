import { MessageCircle } from "lucide-react";
import { WHATSAPP_CHAT_URL } from "@/lib/whatsapp";
import "./whatsapp-contact.css";

/** A plain outbound link: no widget script, automatic messages or client state. */
export function WhatsAppContact() {
  return (
    <aside className="site-chrome site-whatsapp" aria-label="WhatsApp contact">
      <a
        className="site-whatsapp-link"
        href={WHATSAPP_CHAT_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle aria-hidden="true" width={20} height={20} />
        <span>Chat on WhatsApp</span>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </aside>
  );
}
