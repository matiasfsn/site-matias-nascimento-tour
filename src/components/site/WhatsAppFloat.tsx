import { MessageCircle } from "lucide-react";

import { useSettings, whatsappLink } from "@/lib/settings";

export function WhatsAppFloat() {
  const settings = useSettings();
  const href = whatsappLink(settings.whatsapp_number, settings.whatsapp_default_message);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed right-4 bottom-4 z-50 inline-flex items-center gap-2 rounded-full bg-aqua px-4 py-3 font-medium text-aqua-foreground shadow-glow transition-transform hover:scale-105 sm:right-6 sm:bottom-6"
    >
      <MessageCircle className="size-5" />
      <span className="hidden text-sm sm:inline">Falar no WhatsApp</span>
    </a>
  );
}
