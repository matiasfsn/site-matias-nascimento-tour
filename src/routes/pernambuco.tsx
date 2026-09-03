import { createFileRoute } from "@tanstack/react-router";

import { PageHero } from "@/components/site/PageHero";
import { ServiceExplorer } from "@/components/site/ServiceExplorer";
import { PE_REGIONS, REGION_DESCRIPTIONS, REGION_IMAGES } from "@/lib/site";

export const Route = createFileRoute("/pernambuco")({
  head: () => ({
    meta: [
      { title: "Passeios em Pernambuco | Porto de Galinhas, Carneiros, Recife e Olinda" },
      {
        name: "description",
        content:
          "Passeios e transfers em Pernambuco: piscinas naturais de Porto de Galinhas, Praia dos Carneiros, city tour em Recife e Olinda. Solicite seu orçamento.",
      },
      { property: "og:title", content: "Descubra Pernambuco | MATIAS.NASCIMENTO.TOUR_AL" },
      {
        property: "og:description",
        content:
          "Porto de Galinhas, Praia dos Carneiros, Recife Antigo e Olinda com atendimento personalizado.",
      },
    ],
  }),
  component: PernambucoPage,
});

function PernambucoPage() {
  return (
    <>
      <PageHero
        image="/images/porto-de-galinhas.jpg"
        eyebrow="Pernambuco"
        title="Descubra Pernambuco"
        description="Piscinas naturais, jangadas, catamarã pelo rio Formoso e o casario histórico de Recife e Olinda."
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PE_REGIONS.map((region) => (
            <article
              key={region}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={REGION_IMAGES[region] ?? "/images/recife.jpg"}
                  alt={region}
                  loading="lazy"
                  width={1280}
                  height={960}
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
          locked={{ state: "PE" }}
          regions={PE_REGIONS}
          showStates={false}
          showTags
          title="Passeios, experiências e transfers em Pernambuco"
          description="Filtre por destino, categoria ou tipo de experiência e adicione ao seu roteiro."
        />
      </section>
    </>
  );
}
