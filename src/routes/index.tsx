import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Compass,
  HeartHandshake,
  Instagram,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

import { DestinationsMap } from "@/components/site/DestinationsMap";
import { ServiceCard } from "@/components/site/ServiceCard";
import { ServiceDetailDialog } from "@/components/site/ServiceDetailDialog";
import { AnimatedWaves, WaveDivider } from "@/components/site/WaveDivider";
import { Button } from "@/components/ui/button";
import { servicesQuery, type Service } from "@/lib/services";
import { useSettings } from "@/lib/settings";
import {
  AL_REGIONS,
  GALLERY,
  PE_REGIONS,
  REGION_DESCRIPTIONS,
  REGION_IMAGES,
} from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "MATIAS.NASCIMENTO.TOUR_AL | Passeios e Transfers em Alagoas e Pernambuco",
      },
      {
        name: "description",
        content:
          "Agência de turismo especializada em passeios, experiências e transfers em Alagoas e Pernambuco: Maceió, Maragogi, São Miguel dos Milagres, Gunga, Porto de Galinhas e Carneiros.",
      },
      {
        property: "og:title",
        content: "MATIAS.NASCIMENTO.TOUR_AL | Turismo em Alagoas e Pernambuco",
      },
      {
        property: "og:description",
        content:
          "Monte seu roteiro com passeios, experiências náuticas e transfers privativos e solicite seu orçamento pelo WhatsApp.",
      },
    ],
  }),
  component: HomePage,
});

const SERVICE_CARDS = [
  {
    emoji: "🏝️",
    title: "Passeios",
    text: "Descubra praias, piscinas naturais, cidades históricas e paisagens incríveis.",
    to: "/passeios" as const,
  },
  {
    emoji: "🚤",
    title: "Experiências",
    text: "Passeios de barco, jangada, lancha, catamarã, snorkeling, caiaque e muito mais.",
    to: "/experiencias" as const,
  },
  {
    emoji: "🚐",
    title: "Transfers",
    text: "Transporte privativo entre aeroportos, hotéis, resorts e destinos turísticos.",
    to: "/transfers" as const,
  },
  {
    emoji: "⭐",
    title: "Passeios privativos",
    text: "Experiências personalizadas para casais, famílias e grupos.",
    to: "/passeios" as const,
  },
];

const DIFFERENTIALS = [
  {
    icon: HeartHandshake,
    title: "Atendimento personalizado",
    text: "Atendimento próximo e pensado para cada cliente.",
  },
  {
    icon: Sparkles,
    title: "Conforto",
    text: "Experiências planejadas para você aproveitar sua viagem.",
  },
  {
    icon: ShieldCheck,
    title: "Segurança",
    text: "Atendimento profissional durante sua experiência.",
  },
  {
    icon: Compass,
    title: "Experiências inesquecíveis",
    text: "Descubra praias, rios, piscinas naturais, história e cultura.",
  },
];

function HomePage() {
  const settings = useSettings();
  const { data } = useQuery(servicesQuery);
  const [detail, setDetail] = useState<Service | null>(null);

  const highlights = (data ?? [])
    .filter((service) => service.kind !== "transfer")
    .slice(0, 6);

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img
          src="/images/hero-alagoas.jpg"
          alt="Praia paradisíaca em Alagoas com águas cristalinas e coqueiros"
          width={1920}
          height={1080}
          className="absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="hero-overlay absolute inset-0 -z-10" />
        <div className="mx-auto flex max-w-7xl flex-col justify-center px-4 pt-24 pb-36 sm:px-6 sm:pt-32 sm:pb-44 lg:px-8">
          <div className="animate-rise-in max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-[0.7rem] tracking-[0.2em] text-white uppercase backdrop-blur-md">
              Alagoas • Pernambuco
            </span>
            <h1 className="mt-6 text-4xl leading-[1.08] text-white sm:text-6xl">
              Viva Alagoas. Descubra Pernambuco.{" "}
              <span className="text-sky">Crie memórias inesquecíveis.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base text-white/85 sm:text-lg">
              Passeios, experiências e transfers para você conhecer os destinos mais incríveis do
              Nordeste com conforto, segurança e atendimento personalizado.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="hero" size="xl" asChild>
                <Link to="/passeios">
                  Explorar passeios <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button variant="glass" size="xl" asChild>
                <Link to="/contato">Solicitar atendimento</Link>
              </Button>
            </div>
          </div>
        </div>
        <AnimatedWaves />
      </section>

      {/* SERVIÇOS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs tracking-[0.24em] text-aqua uppercase">Nossos serviços</span>
          <h2 className="mt-3 text-3xl text-primary sm:text-4xl">
            Tudo que você precisa para viver o Nordeste
          </h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICE_CARDS.map((card) => (
            <article
              key={card.title}
              className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-xl">
                {card.emoji}
              </span>
              <h3 className="font-display text-xl text-primary">{card.title}</h3>
              <p className="flex-1 text-sm text-muted-foreground">{card.text}</p>
              <Button variant="outline" size="sm" asChild className="w-fit">
                <Link to={card.to}>
                  Ver opções <ArrowRight className="size-4" />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </section>

      {/* ESTADOS */}
      <section className="surface-sand">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {[
              {
                to: "/alagoas" as const,
                image: "/images/maceio.jpg",
                title: "Conheça Alagoas",
                text: "Maceió, Litoral Norte, Litoral Sul, Foz do São Francisco, Penedo, Piranhas e os Cânions do São Francisco.",
                regions: AL_REGIONS,
              },
              {
                to: "/pernambuco" as const,
                image: "/images/porto-de-galinhas.jpg",
                title: "Descubra Pernambuco",
                text: "Porto de Galinhas, Praia dos Carneiros, Recife Antigo e o centro histórico de Olinda.",
                regions: PE_REGIONS,
              },
            ].map((state) => (
              <Link
                key={state.to}
                to={state.to}
                className="group relative isolate flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-3xl p-7 shadow-card"
              >
                <img
                  src={state.image}
                  alt={state.title}
                  loading="lazy"
                  width={1280}
                  height={853}
                  className="absolute inset-0 -z-10 size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy/90 via-navy/45 to-navy/10" />
                <h3 className="text-2xl text-white sm:text-3xl">{state.title}</h3>
                <p className="mt-2 max-w-md text-sm text-white/80">{state.text}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {state.regions.map((region) => (
                    <span
                      key={region}
                      className="rounded-full border border-white/30 px-3 py-1 text-xs text-white/85"
                    >
                      {region}
                    </span>
                  ))}
                </div>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-sky">
                  Ver passeios <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="text-xs tracking-[0.24em] text-aqua uppercase">Mais procurados</span>
            <h2 className="mt-3 text-3xl text-primary sm:text-4xl">Experiências em destaque</h2>
          </div>
          <Button variant="outline" asChild>
            <Link to="/passeios">Ver todos os passeios</Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((service) => (
            <ServiceCard key={service.id} service={service} onDetails={setDetail} />
          ))}
        </div>
      </section>

      {/* MAPA */}
      <section className="bg-secondary/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs tracking-[0.24em] text-aqua uppercase">Mapa interativo</span>
            <h2 className="mt-3 text-3xl text-primary sm:text-4xl">Explore nossos destinos</h2>
            <p className="mt-3 text-muted-foreground">
              Clique em um destino para conhecer as experiências disponíveis em Alagoas e Pernambuco.
            </p>
          </div>
          <div className="mt-10">
            <DestinationsMap />
          </div>
        </div>
      </section>

      {/* REGIÕES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs tracking-[0.24em] text-aqua uppercase">Regiões</span>
          <h2 className="mt-3 text-3xl text-primary sm:text-4xl">Escolha por onde começar</h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...AL_REGIONS, ...PE_REGIONS].map((region) => (
            <Link
              key={region}
              to={AL_REGIONS.includes(region as (typeof AL_REGIONS)[number]) ? "/alagoas" : "/pernambuco"}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={REGION_IMAGES[region] ?? "/images/maceio.jpg"}
                  alt={region}
                  loading="lazy"
                  width={1280}
                  height={800}
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg text-primary">{region}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {REGION_DESCRIPTIONS[region]}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SOBRE */}
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <WaveDivider flip tone="background" className="absolute inset-x-0 top-0 rotate-180" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="text-xs tracking-[0.24em] text-sky uppercase">Sobre a agência</span>
            <h2 className="mt-3 text-3xl text-white sm:text-4xl">
              Turismo, experiências e memórias.
            </h2>
            <p className="mt-5 text-white/80">{settings.about_text}</p>
            <ul className="mt-7 grid gap-2 sm:grid-cols-2">
              {[
                "Atendimento personalizado",
                "Passeios e transfers",
                "Alagoas e Pernambuco",
                "Experiências privativas",
                "Conforto",
                "Segurança",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-white/85">
                  <span className="text-sun">✓</span> {item}
                </li>
              ))}
            </ul>
            <Button variant="hero" size="lg" asChild className="mt-8">
              <Link to="/sobre">Conhecer a agência</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {DIFFERENTIALS.map((item) => (
              <article
                key={item.title}
                className="flex flex-col gap-3 rounded-2xl border border-white/12 bg-white/5 p-5 backdrop-blur-sm"
              >
                <item.icon className="size-6 text-sky" />
                <h3 className="font-display text-lg text-white">{item.title}</h3>
                <p className="text-sm text-white/70">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* GALERIA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs tracking-[0.24em] text-aqua uppercase">Galeria</span>
          <h2 className="mt-3 text-3xl text-primary sm:text-4xl">Destinos que esperam por você</h2>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {GALLERY.map((item, index) => (
            <figure
              key={`${item.label}-${index}`}
              className="group relative overflow-hidden rounded-2xl"
            >
              <img
                src={item.image}
                alt={item.label}
                loading="lazy"
                width={800}
                height={800}
                className="aspect-square size-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent opacity-70 transition-opacity group-hover:opacity-90" />
              <figcaption className="absolute bottom-3 left-3 text-xs font-medium text-white">
                {item.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="surface-sand">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <span className="text-xs tracking-[0.24em] text-aqua uppercase">Instagram</span>
          <h2 className="text-3xl text-primary sm:text-4xl">Siga nossas experiências</h2>
          <p className="max-w-2xl text-muted-foreground">
            Acompanhe nossos destinos, passeios e experiências em Alagoas e Pernambuco.
          </p>
          <Button variant="hero" size="lg" asChild>
            <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer">
              <Instagram className="size-4" /> Seguir no Instagram
            </a>
          </Button>
          <div className="mt-6 grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
            {GALLERY.slice(0, 4).map((item, index) => (
              <div
                key={`ig-${index}`}
                className="relative aspect-square overflow-hidden rounded-2xl border border-border"
              >
                <img
                  src={item.image}
                  alt={item.label}
                  loading="lazy"
                  width={600}
                  height={600}
                  className="size-full object-cover opacity-90"
                />
                <span className="absolute inset-x-0 bottom-0 bg-navy/70 py-1.5 text-[0.65rem] tracking-wide text-white uppercase">
                  {settings.instagram_handle}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServiceDetailDialog
        service={detail}
        open={Boolean(detail)}
        onOpenChange={(open) => !open && setDetail(null)}
      />
    </>
  );
}
