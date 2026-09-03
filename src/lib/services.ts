import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

export type Service = {
  id: string;
  slug: string;
  name: string;
  state: "AL" | "PE";
  region: string;
  category: string;
  kind: "tour" | "transfer" | "experience";
  location: string;
  short_description: string;
  description: string;
  image_url: string;
  gallery: string[];
  highlights: string[];
  tags: string[];
  sort_order: number;
  is_active?: boolean;
};

const PUBLIC_COLUMNS =
  "id, slug, name, state, region, category, kind, location, short_description, description, image_url, gallery, highlights, tags, sort_order";

const REMOTE_PHOTOS: Record<string, string> = {
  // Fotos específicas do próprio destino; priorizamos fontes de referência local e Wikimedia quando disponível.
  "ipioca-maceio": "https://upload.wikimedia.org/wikipedia/commons/9/99/Marco_Ankosqui_Praia_Ipioca_Maceio-AL_%2841609477621%29.jpg",
  "piscinas-naturais-ipioca": "https://upload.wikimedia.org/wikipedia/commons/9/99/Marco_Ankosqui_Praia_Ipioca_Maceio-AL_%2841609477621%29.jpg",
  "barra-de-santo-antonio": "https://www.touristmaker.com/wp-content/uploads/2020/06/barra-de-santo-antonio-and-praia-da-ilha-da-croa-768x512.jpg",
  "ilha-da-croa": "https://www.touristmaker.com/wp-content/uploads/2020/06/barra-de-santo-antonio-and-praia-da-ilha-da-croa-768x512.jpg",
  "tabuba": "https://www.viagensecaminhos.com/wp-content/uploads/2024/07/praia-tabuba-barra-de-santo-antonio-alagoas.jpg",
  "japaratinga": "https://catracalivre.com.br/i/cBFvJXDqraJkqT-43nXYe8wyqpCMnW7r_bk2MxRSDFw/rs%3Afill%3A1200%3A630%3A1/g%3Asm/q%3A80/bG9jYWw6Ly8vMjAyNC8xMS9pc3RvY2stMTY5MzU4NTEyNS5qcGc",
  "sao-miguel-dos-milagres": "https://www.canal26.com/resizer/v2/6U6UOMSWUFGFRNNX4ZLAWXUYRI.jpg?auth=3342a8220c352ff6e465d63c7db872030ec74adf2ea2573968d7afddb4ed0705",
  "praia-do-toque": "https://www.recifepasseios.com.br/wp-content/uploads/2023/08/praia-do-toque-milagres-1024x1024.jpg",
  "porto-da-rua": "https://www.viagensecaminhos.com/wp-content/uploads/2023/12/praia-porto-da-rua-sao-miguel-dos-milagres.jpg",
  "praia-do-marceneiro": "https://infonet.com.br/wp-infonet/img/colunistas/grande-168726.JPG",
  "piscinas-naturais-pajucara": "https://i0.wp.com/www.destinosimperdiveis.com.br/wp-content/uploads/2022/09/piscinas_pajucara01.jpg?ssl=1&w=1500",
  "ponta-verde": "https://consencoedificacoes.com.br/wp-content/uploads/2023/04/Downloader.la-642dbf8b5a391.jpg",
  "praia-do-frances": "https://upload.wikimedia.org/wikipedia/commons/e/e6/Praia_do_Franc%C3%AAs%2C_Franc%C3%AAs_Beach%2C_Marechal_Deodoro%2C_Brazil_%2851378952952%29.jpg",
  "coruripe": "https://www.temporadalivre.com/blog-media/Praia-de-Coruripe-AL.jpg",
  "piranhas": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Centro_Hist%C3%B3rico_de_Piranhas_-_Alagoas_(16989399876).jpg",
  "penedo": "https://jornaldealagoas.nyc3.digitaloceanspaces.com/uploads/imagens/penedo-centro-historico-alagoas.jpg",
  "carro-quebrado": "https://static.wixstatic.com/media/673c8f_42ee451bb8b04600b2e9c0512dfe573f~mv2.jpg/v1/fill/w_1000%2Ch_667%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01/673c8f_42ee451bb8b04600b2e9c0512dfe573f~mv2.jpg",
  "porto-de-pedras": "https://cdn.diariodolitoral.com.br/upload/dn_arquivo/2025/12/bandeira-azul-praia-patacho-alagoas.jpg",
  "tatuamunha": "https://www.viagensecaminhos.com/wp-content/uploads/2023/12/praia-tatuamunha-sao-miguel-dos-milagres-560x420.jpg",
  "ilha-do-ferro": "https://i0.statig.com.br/bancodeimagens/8o/8r/ro/8o8rro7v40tpysoz73ofpv9jo.jpg",
};

const LOCAL_CORRECTIONS: Record<string, Partial<Service>> = {
  // Ipioca é Maceió. Sonho Verde pertence a Paripueira.
  "ipioca-maceio": { location: "Ipioca, Maceió, AL", image_url: "/images/ipioca.jpg", gallery: [], highlights: [] },
  "piscinas-naturais-ipioca": { location: "Ipioca, Maceió, AL", image_url: "/images/ipioca.jpg", gallery: [], highlights: [] },
  "sonho-verde-paripueira": {
    name: "Praia de Sonho Verde",
    region: "Litoral Norte",
    location: "Paripueira, AL",
    image_url: "/images/paripueira.jpg",
    short_description: "Praia de Sonho Verde, em Paripueira, com águas tranquilas, coqueirais e natureza preservada.",
    tags: ["natureza", "piscinas-naturais"],
  },
  "piscina-do-davi-sonho-verde": {
    name: "Piscina do Davi — Sonho Verde",
    region: "Litoral Norte",
    location: "Paripueira, AL",
    image_url: "/images/paripueira.jpg",
  },
  "carro-quebrado": { location: "Barra de Santo Antônio, AL", image_url: "/images/barra-santo-antonio.jpg" },
  "dunas-de-marape": {
    name: "Dunas de Marapé",
    location: "Jequiá da Praia, AL",
    image_url: "/images/jequia.jpg",
    short_description: "Complexo de Dunas de Marapé, em Jequiá da Praia, onde rio, mar e lagoa se encontram, com travessia de barco, dunas, manguezais e praias.",
  },
  "jequia-da-praia": { location: "Jequiá da Praia, AL", image_url: "/images/jequia.jpg" },
  // Maragogi is shown as ONE destination. Its beaches are listed as attractions inside Maragogi.
  "maragogi": {
    name: "Maragogi",
    location: "Maragogi, AL",
    image_url: "/images/maragogi.jpg",
    short_description: "Maragogi reúne praias como Antunes, Barra Grande, Xaréu e São Bento, além das famosas piscinas naturais.",
    description: "Maragogi, no litoral norte de Alagoas, reúne diversas praias e experiências. Entre as principais atrações estão Praia de Antunes, Barra Grande, Praia de Xaréu, São Bento e as Piscinas Naturais de Maragogi.",
    highlights: ["Praia de Antunes", "Barra Grande", "Praia de Xaréu", "São Bento", "Piscinas Naturais de Maragogi"],
    tags: ["natureza", "piscinas-naturais", "snorkeling", "nautico"],
  },
  "lagoa-de-jequia": { location: "Jequiá da Praia, AL", image_url: "/images/jequia.jpg" },
  "trilha-dos-caetes": { location: "Jequiá da Praia, AL", image_url: "/images/jequia.jpg" },
  "praia-jacarecica-do-sul": { location: "Jequiá da Praia, AL", image_url: "/images/jequia.jpg" },
  "lagoa-azeda-jequia": { location: "Jequiá da Praia, AL", image_url: "/images/jequia.jpg" },
  "passeio-barco-rio-jequia": { location: "Jequiá da Praia, AL", image_url: "/images/jequia.jpg" },
  "praia-do-gunga": { location: "Roteiro, AL", image_url: "/images/gunga.jpg" },
  "praia-do-frances": { location: "Marechal Deodoro, AL", image_url: "/images/praia-do-frances.jpg" },
  "passeio-de-lancha-maragogi": {
    name: "Passeio de lancha em Maragogi",
    state: "AL",
    region: "Litoral Norte",
    category: "Náutico",
    kind: "experience",
    location: "Maragogi, AL",
    image_url: "/images/maragogi.jpg",
    short_description: "Passeio de lancha em Maragogi para conhecer praias, recifes e bancos de areia, conforme a maré e as condições de navegação.",
    tags: ["lancha", "nautico", "natureza"],
  },
  "jet-ski-maragogi": {
    name: "Jet ski em Maragogi",
    state: "AL",
    region: "Litoral Norte",
    category: "Náutico",
    kind: "experience",
    location: "Maragogi, AL",
    image_url: "/images/maragogi.jpg",
    short_description: "Experiência de jet ski em Maragogi, realizada em áreas permitidas e conforme as condições do mar e as regras do operador.",
    tags: ["jet-ski", "nautico", "natureza"],
  },
};

const LOCAL_ADDITIONS: Service[] = [
  {
    id: "local-sonho-verde-paripueira", slug: "sonho-verde-paripueira", name: "Praia de Sonho Verde", state: "AL", region: "Litoral Norte", category: "Passeio", kind: "tour", location: "Paripueira, AL",
    short_description: "Praia de Sonho Verde, em Paripueira, com águas tranquilas, coqueirais e natureza preservada.", description: "Praia de Sonho Verde, em Paripueira.", image_url: "/images/paripueira.jpg", gallery: [], highlights: [], tags: ["natureza", "piscinas-naturais"], sort_order: 205, is_active: true,
  },
  {
    id: "local-passeio-de-lancha-maragogi", slug: "passeio-de-lancha-maragogi", name: "Passeio de lancha em Maragogi", state: "AL", region: "Litoral Norte", category: "Náutico", kind: "experience", location: "Maragogi, AL",
    short_description: "Passeio de lancha em Maragogi para conhecer praias, recifes e bancos de areia, conforme a maré e as condições de navegação.", description: "Passeio de lancha em Maragogi.", image_url: "/images/maragogi.jpg", gallery: [], highlights: [], tags: ["lancha", "nautico", "natureza"], sort_order: 401, is_active: true,
  },
  {
    id: "local-jet-ski-maragogi", slug: "jet-ski-maragogi", name: "Jet ski em Maragogi", state: "AL", region: "Litoral Norte", category: "Náutico", kind: "experience", location: "Maragogi, AL",
    short_description: "Experiência de jet ski em Maragogi, realizada em áreas permitidas e conforme as condições do mar e as regras do operador.", description: "Experiência de jet ski em Maragogi.", image_url: "/images/maragogi.jpg", gallery: [], highlights: [], tags: ["jet-ski", "nautico", "natureza"], sort_order: 402, is_active: true,
  },
  {
    id: "local-dunas-de-marape", slug: "dunas-de-marape", name: "Dunas de Marapé", state: "AL", region: "Litoral Sul", category: "Natureza", kind: "tour", location: "Jequiá da Praia, AL",
    short_description: "Complexo de Dunas de Marapé, em Jequiá da Praia, onde rio, mar e lagoa se encontram.", description: "Dunas de Marapé, em Jequiá da Praia.", image_url: "/images/jequia.jpg", gallery: [], highlights: [], tags: ["natureza", "rio-mar"], sort_order: 540, is_active: true,
  },
  {
    id: "local-trilha-dos-caetes", slug: "trilha-dos-caetes", name: "Trilha dos Caetés", state: "AL", region: "Litoral Sul", category: "Natureza", kind: "tour", location: "Jequiá da Praia, AL",
    short_description: "Trilha ecológica com manguezais, fauna e flora, com acesso ao complexo Dunas de Marapé.", description: "Trilha dos Caetés, em Jequiá da Praia.", image_url: "/images/jequia.jpg", gallery: [], highlights: [], tags: ["natureza"], sort_order: 551, is_active: true,
  },
  {
    id: "local-praia-jacarecica-do-sul", slug: "praia-jacarecica-do-sul", name: "Praia de Jacarecica do Sul", state: "AL", region: "Litoral Sul", category: "Passeio", kind: "tour", location: "Jequiá da Praia, AL",
    short_description: "Praia preservada e tranquila de Jequiá da Praia, com mar e natureza em cenário pouco urbanizado.", description: "Praia de Jacarecica do Sul, em Jequiá da Praia.", image_url: "/images/jequia.jpg", gallery: [], highlights: [], tags: ["natureza"], sort_order: 552, is_active: true,
  },
  {
    id: "local-lagoa-azeda-jequia", slug: "lagoa-azeda-jequia", name: "Praia da Lagoa Azeda", state: "AL", region: "Litoral Sul", category: "Passeio", kind: "tour", location: "Jequiá da Praia, AL",
    short_description: "Praia de mar calmo e extensa faixa de areia na região de Jequiá da Praia.", description: "Praia da Lagoa Azeda, em Jequiá da Praia.", image_url: "/images/jequia.jpg", gallery: [], highlights: [], tags: ["natureza"], sort_order: 553, is_active: true,
  },
  {
    id: "local-passeio-barco-rio-jequia", slug: "passeio-barco-rio-jequia", name: "Passeio de barco pelo Rio Jequiá", state: "AL", region: "Litoral Sul", category: "Náutico", kind: "experience", location: "Jequiá da Praia, AL",
    short_description: "Navegação pelo Rio Jequiá entre manguezais, bancos de areia e ilhotas, com paradas conforme o roteiro.", description: "Passeio de barco pelo Rio Jequiá.", image_url: "/images/jequia.jpg", gallery: [], highlights: [], tags: ["nautico", "rio-mar", "natureza"], sort_order: 554, is_active: true,
  },
];

function applyLocalCorrections(raw: Service[]): Service[] {
  const corrected = raw.map((service) => {
    const key = service.slug;
    const bySlug = LOCAL_CORRECTIONS[key];
    const remoteImage = REMOTE_PHOTOS[key];
    const byName = service.name.toLowerCase().includes("sonho verde") ? LOCAL_CORRECTIONS["sonho-verde-paripueira"] : undefined;
    const isIpioca = [service.slug, service.name, service.location]
      .join(" ")
      .toLowerCase()
      .includes("ipioca");

    // Ipioca must never display Sonho Verde as an attraction/highlight.
    // Older Supabase rows may still contain this value in the highlights array,
    // so sanitize it by content as well as by slug.
    const sanitizedHighlights = isIpioca
      ? (service.highlights ?? []).filter((highlight) => !highlight.toLowerCase().includes("sonho verde"))
      : service.highlights;

    return { ...service, ...(bySlug ?? {}), ...(byName ?? {}), ...(remoteImage ? { image_url: remoteImage } : {}), ...(isIpioca ? { highlights: sanitizedHighlights } : {}) };
  });

  // Sonho Verde is EXCLUSIVELY a Paripueira destination. Never allow a legacy
  // Ipioca record (or a duplicate slug) to leak into the public catalog.
  const deduped = new Map<string, Service>();
  for (const service of corrected) {
    const isSonho = service.name.toLowerCase().includes("sonho verde");
    if (isSonho) {
      if (service.slug !== "sonho-verde-paripueira" && service.slug !== "piscina-do-davi-sonho-verde") continue;
      if (!service.location.toLowerCase().includes("paripueira")) continue;
    }
    const key = isSonho ? service.slug : service.slug;
    if (!deduped.has(key)) deduped.set(key, service);
  }

  // Keep only one Maragogi destination card. The beaches below are attractions
  // of Maragogi and must not appear as separate destination cards.
  const maragogiBeachSlugs = new Set(["antunes", "barra-grande-al", "xareu", "sao-bento"]);
  for (const slug of maragogiBeachSlugs) deduped.delete(slug);

  const present = new Set([...deduped.values()].map((service) => service.slug));
  for (const addition of LOCAL_ADDITIONS) {
    if (!present.has(addition.slug)) deduped.set(addition.slug, addition);
  }

  return [...deduped.values()].sort((a, b) => a.sort_order - b.sort_order);
}

export async function fetchServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select(PUBLIC_COLUMNS)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return applyLocalCorrections((data ?? []) as Service[]);
}

export const servicesQuery = queryOptions({
  queryKey: ["services", "public"],
  queryFn: fetchServices,
  staleTime: 5 * 60 * 1000,
});

export async function fetchAllServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select(`${PUBLIC_COLUMNS}, is_active`)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Service[];
}

export const adminServicesQuery = queryOptions({
  queryKey: ["services", "admin"],
  queryFn: fetchAllServices,
  staleTime: 0,
});

export type ServiceFilters = {
  search?: string | undefined;
  state?: string | undefined;
  region?: string | undefined;
  category?: string | undefined;
  kind?: string | undefined;
  tags?: string[] | undefined;
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export function filterServices(services: Service[], filters: ServiceFilters): Service[] {
  const search = filters.search ? normalize(filters.search.trim()) : "";

  return services.filter((service) => {
    if (filters.state && service.state !== filters.state) return false;
    if (filters.region && service.region !== filters.region) return false;
    if (filters.category && service.category !== filters.category) return false;
    if (filters.kind && service.kind !== filters.kind) return false;
    if (filters.tags?.length && !filters.tags.some((tag) => service.tags.includes(tag))) {
      return false;
    }
    if (search) {
      const haystack = normalize(
        [service.name, service.region, service.location, service.category, service.short_description].join(" "),
      );
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
}

export function groupByRegion(services: Service[]): Array<[string, Service[]]> {
  const map = new Map<string, Service[]>();
  for (const service of services) {
    const list = map.get(service.region) ?? [];
    list.push(service);
    map.set(service.region, list);
  }
  return [...map.entries()];
}
