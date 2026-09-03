import { createFileRoute } from "@tanstack/react-router";

import { PageHero } from "@/components/site/PageHero";
import { ServiceExplorer } from "@/components/site/ServiceExplorer";
import { AL_REGIONS, REGION_DESCRIPTIONS, REGION_IMAGES } from "@/lib/site";

export const Route = createFileRoute("/alagoas")({
  head: () => ({
    meta: [
      { title: "Passeios em Alagoas | Maceió, Maragogi, Gunga e Cânions" },
      {
        name: "description",
        content:
          "Passeios em Alagoas por região: Maceió, Litoral Norte, Litoral Sul, Foz do São Francisco, Penedo e Cânions do São Francisco. Monte seu roteiro e solicite orçamento.",
      },
      { property: "og:title", content: "Conheça Alagoas | MATIAS.NASCIMENTO.TOUR_AL" },
      {
        property: "og:description",
        content:
          "Piscinas naturais, praias, dunas, rio e sertão: passeios e experiências em todas as regiões de Alagoas.",
      },
    ],
  }),
  component: AlagoasPage,
});

function AlagoasPage() {
  return (
    <>
      <PageHero
        image="/images/maceio.jpg"
        eyebrow="Alagoas"
        title="Conheça Alagoas"
        description="Do mar cristalino de Maragogi ao sertão dos Cânions do São Francisco. Escolha a região e monte seu roteiro."
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AL_REGIONS.map((region) => (
            <article
              key={region}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
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
                <h2 className="font-display text-lg text-primary">{region}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{REGION_DESCRIPTIONS[region]}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <ServiceExplorer
          locked={{ state: "AL" }}
          regions={AL_REGIONS}
          showStates={false}
          showTags
          title="Passeios, experiências e transfers em Alagoas"
          description="Filtre por região, categoria ou tipo de experiência e adicione ao seu roteiro."
        />
      </section>
    </>
  );
}
