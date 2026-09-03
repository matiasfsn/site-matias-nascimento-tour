import { createFileRoute } from "@tanstack/react-router";

import { PageHero } from "@/components/site/PageHero";
import { ServiceExplorer } from "@/components/site/ServiceExplorer";

export const Route = createFileRoute("/experiencias")({
  head: () => ({
    meta: [
      { title: "Experiências | Jangada, Lancha, Catamarã, Caiaque e Snorkeling" },
      {
        name: "description",
        content:
          "Experiências náuticas e culturais em Alagoas e Pernambuco: jangada, lancha, catamarã, caiaque transparente, snorkeling, piscinas naturais e Rota do Cangaço.",
      },
      { property: "og:title", content: "Experiências em Alagoas e Pernambuco" },
      {
        property: "og:description",
        content: "Filtre por tipo de experiência e monte um roteiro único com a nossa equipe.",
      },
    ],
  }),
  component: ExperienciasPage,
});

function ExperienciasPage() {
  return (
    <>
      <PageHero
        image="/images/experiencias.jpg"
        eyebrow="Experiências"
        title="Experiências"
        description="Jangada, lancha, catamarã, caiaque transparente, snorkeling, piscinas naturais, city tours e roteiros culturais."
      />
      <section className="mx-auto max-w-7xl px-4 py-14 pb-20 sm:px-6 lg:px-8">
        <ServiceExplorer
          locked={{ kind: "experience" }}
          showTags
          title="Escolha sua experiência"
          description="Filtre por tipo: náutica, piscinas naturais, cultura, sertão, natureza e mais."
        />
      </section>
    </>
  );
}
