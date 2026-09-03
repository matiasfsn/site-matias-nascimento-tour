import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";

import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/lib/settings";
import { GALLERY } from "@/lib/site";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre nós | Agência de turismo em Alagoas e Pernambuco" },
      {
        name: "description",
        content:
          "Conheça a MATIAS.NASCIMENTO.TOUR_AL: turismo, experiências e memórias em Alagoas e Pernambuco com atendimento personalizado, conforto e segurança.",
      },
      { property: "og:title", content: "Sobre a MATIAS.NASCIMENTO.TOUR_AL" },
      {
        property: "og:description",
        content: "Turismo, experiências e memórias em Alagoas e Pernambuco.",
      },
    ],
  }),
  component: SobrePage,
});

const DIFFERENTIALS = [
  {
    icon: HeartHandshake,
    title: "Atendimento personalizado",
    text: "Atendimento próximo e pensado para cada cliente.",
  },
  { icon: Sparkles, title: "Conforto", text: "Experiências planejadas para você aproveitar sua viagem." },
  { icon: ShieldCheck, title: "Segurança", text: "Atendimento profissional durante sua experiência." },
  {
    icon: Compass,
    title: "Experiências inesquecíveis",
    text: "Descubra praias, rios, piscinas naturais, história e cultura.",
  },
];

function SobrePage() {
  const settings = useSettings();

  return (
    <>
      <PageHero
        image="/images/sao-miguel.jpg"
        eyebrow="Sobre nós"
        title="Turismo, experiências e memórias."
        description={settings.about_text}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl text-primary sm:text-4xl">Nossos diferenciais</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {DIFFERENTIALS.map((item) => (
                <li
                  key={item.title}
                  className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 shadow-soft"
                >
                  <item.icon className="size-6 text-aqua" />
                  <h3 className="font-display text-lg text-primary">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="hero" size="lg" asChild>
                <Link to="/passeios">Explorar passeios</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contato">Falar com a agência</Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {GALLERY.slice(2, 8).map((item, index) => (
              <div key={`sobre-${index}`} className="overflow-hidden rounded-2xl">
                <img
                  src={item.image}
                  alt={item.label}
                  loading="lazy"
                  width={800}
                  height={800}
                  className="aspect-square size-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-sand">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl text-primary sm:text-3xl">Onde atuamos</h2>
          <p className="mt-3 text-muted-foreground">
            Alagoas • Pernambuco — de Maceió e Maragogi aos Cânions do São Francisco, Porto de
            Galinhas, Praia dos Carneiros, Recife e Olinda.
          </p>
        </div>
      </section>
    </>
  );
}
