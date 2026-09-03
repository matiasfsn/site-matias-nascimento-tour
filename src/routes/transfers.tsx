import { createFileRoute } from "@tanstack/react-router";

import { PageHero } from "@/components/site/PageHero";
import { ServiceExplorer } from "@/components/site/ServiceExplorer";

export const Route = createFileRoute("/transfers")({
  head: () => ({
    meta: [
      { title: "Transfers | Aeroporto de Maceió e Aeroporto do Recife" },
      {
        name: "description",
        content:
          "Transfers privativos em Alagoas e Pernambuco: aeroporto de Maceió, Maragogi, Praia do Francês, aeroporto do Recife, Porto de Galinhas e Praia dos Carneiros.",
      },
      { property: "og:title", content: "Transfers em Alagoas e Pernambuco" },
      {
        property: "og:description",
        content: "Transporte privativo entre aeroportos, hotéis, resorts e destinos turísticos.",
      },
    ],
  }),
  component: TransfersPage,
});

function TransfersPage() {
  return (
    <>
      <PageHero
        image="/images/transfers.jpg"
        eyebrow="Transfers"
        title="Transfers privativos"
        description="Transporte confortável e seguro entre aeroportos, hotéis, resorts e destinos turísticos de Alagoas e Pernambuco."
      />
      <section className="mx-auto max-w-7xl px-4 py-14 pb-20 sm:px-6 lg:px-8">
        <ServiceExplorer
          locked={{ kind: "transfer" }}
          showCategories={false}
          title="Escolha seu trajeto"
          description="Filtre por Alagoas ou Pernambuco e adicione os trechos de ida e volta ao seu roteiro."
          emptyLabel="Nenhum trajeto encontrado. Fale com a gente para um transfer personalizado."
        />
      </section>
    </>
  );
}
