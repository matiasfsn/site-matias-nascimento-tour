import { createFileRoute } from "@tanstack/react-router";

import { PageHero } from "@/components/site/PageHero";
import { ServiceExplorer } from "@/components/site/ServiceExplorer";

export const Route = createFileRoute("/passeios")({
  head: () => ({
    meta: [
      { title: "Passeios em Alagoas e Pernambuco | Roteiros e Passeios Privativos" },
      {
        name: "description",
        content:
          "Todos os passeios em Alagoas e Pernambuco: piscinas naturais, praias, city tours, dunas, cânions e roteiros privativos. Adicione ao carrinho e receba seu orçamento.",
      },
      { property: "og:title", content: "Passeios em Alagoas e Pernambuco" },
      {
        property: "og:description",
        content: "Escolha seus passeios favoritos, monte o roteiro e solicite orçamento pelo WhatsApp.",
      },
    ],
  }),
  component: PasseiosPage,
});

function PasseiosPage() {
  return (
    <>
      <PageHero
        image="/images/litoral-norte.jpg"
        eyebrow="Passeios"
        title="Passeios em Alagoas e Pernambuco"
        description="Praias, piscinas naturais, cidades históricas, dunas e cânions. Escolha, adicione ao carrinho e solicite seu orçamento."
      />
      <section className="mx-auto max-w-7xl px-4 py-14 pb-20 sm:px-6 lg:px-8">
        <ServiceExplorer
          locked={{ kind: "tour" }}
          showTags
          title="Todos os passeios"
          description="Use os filtros por estado, região e categoria para encontrar o passeio ideal."
        />
      </section>
    </>
  );
}
