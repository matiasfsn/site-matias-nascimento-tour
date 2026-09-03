import { Link } from "@tanstack/react-router";
import { Instagram, MessageCircle } from "lucide-react";

import { Logo } from "@/components/site/Logo";
import { useSettings, whatsappLink } from "@/lib/settings";
import { COMPANY_TAGLINE, NAV_LINKS } from "@/lib/site";

export function Footer() {
  const settings = useSettings();
  const whatsapp = whatsappLink(settings.whatsapp_number, settings.whatsapp_default_message);

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="w-fit rounded-2xl bg-white/5 p-3">
            <Logo variant="light" />
          </div>
          <p className="max-w-md text-sm text-white/70">
            {settings.company_name} — {COMPANY_TAGLINE}. Passeios, experiências e transfers em
            Alagoas e Pernambuco com atendimento personalizado.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={settings.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm transition-colors hover:bg-white/10"
            >
              <Instagram className="size-4" /> {settings.instagram_handle}
            </a>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-aqua px-4 py-2 text-sm font-medium text-aqua-foreground transition-opacity hover:opacity-90"
            >
              <MessageCircle className="size-4" /> WhatsApp
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-xs tracking-[0.2em] text-sky uppercase">Navegação</h2>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-white/75 transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-xs tracking-[0.2em] text-sky uppercase">Área de atuação</h2>
            <p className="mt-4 text-sm text-white/75">Alagoas • Pernambuco</p>
          </div>
          <div>
            <h2 className="text-xs tracking-[0.2em] text-sky uppercase">Informações legais</h2>
            <ul className="mt-4 flex flex-col gap-1 text-sm text-white/55">
              <li>{settings.legal_name || "Matias Nascimento"}</li>
              <li>CNPJ: {settings.cnpj || "57.785.626/0001-78"}</li>
            </ul>
            <div className="mt-5 border-t border-white/10 pt-5">
              <img src="/images/cadastur-logo.png" alt="Cadastur" className="h-10 w-auto object-contain" />
              <p className="mt-2 text-sm text-white/75">Certificado pelo Cadastur</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-6 text-center text-xs text-white/50 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} {settings.company_name}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
