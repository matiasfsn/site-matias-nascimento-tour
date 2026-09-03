export const COMPANY_NAME = "MATIAS.NASCIMENTO.TOUR_AL";
export const COMPANY_TAGLINE = "Turismo • Experiências • Memórias";

/** Configurações padrão — podem ser alteradas no painel administrativo. */
export const DEFAULT_SETTINGS = {
  whatsapp_number: "5582982007100",
  instagram_url: "https://instagram.com/matias.nascimento.tour_al",
  instagram_handle: "@matias.nascimento.tour_al",
  whatsapp_default_message: "Olá! Gostaria de saber mais sobre os passeios e transfers.",
  company_name: COMPANY_NAME,
  company_tagline: COMPANY_TAGLINE,
  about_text:
    "A MATIAS.NASCIMENTO.TOUR_AL nasceu com o propósito de proporcionar experiências inesquecíveis aos viajantes que desejam conhecer as belezas de Alagoas e Pernambuco com conforto, segurança e atendimento personalizado.",
  cnpj: "57.785.626/0001-78",
  legal_name: "Matias Nascimento",
  address: "",
  legal_info: "",
} as const;

export type SettingsKey = keyof typeof DEFAULT_SETTINGS;
export type SiteSettings = Record<SettingsKey, string>;

export const NAV_LINKS = [
  { to: "/", label: "Início" },
  { to: "/alagoas", label: "Alagoas" },
  { to: "/pernambuco", label: "Pernambuco" },
  { to: "/passeios", label: "Passeios" },
  { to: "/transfers", label: "Transfers" },
  { to: "/experiencias", label: "Experiências" },
  { to: "/sobre", label: "Sobre nós" },
  { to: "/contato", label: "Contato" },
] as const;

export const STATES = [
  { value: "AL", label: "Alagoas" },
  { value: "PE", label: "Pernambuco" },
] as const;

export const AL_REGIONS = [
  "Maceió",
  "Litoral Norte",
  "Litoral Sul",
  "Foz do São Francisco",
  "História & Cultura",
  "Sertão & Cânions",
] as const;

export const PE_REGIONS = ["Recife", "Olinda", "Porto de Galinhas", "Praia dos Carneiros"] as const;

export const ALL_REGIONS = [...AL_REGIONS, ...PE_REGIONS];

export const CATEGORIES = [
  "Passeio",
  "Passeio privativo",
  "Transfer",
  "Experiência",
  "City Tour",
  "Náutico",
  "Cultural",
  "Natureza",
] as const;

export const EXPERIENCE_TAGS = [
  { value: "jangada", label: "Jangada", emoji: "🛶" },
  { value: "lancha", label: "Lancha", emoji: "🚤" },
  { value: "catamara", label: "Catamarã", emoji: "⛵" },
  { value: "caiaque", label: "Caiaque", emoji: "🚣" },
  { value: "snorkeling", label: "Snorkeling", emoji: "🤿" },
  { value: "piscinas-naturais", label: "Piscinas naturais", emoji: "🏝️" },
  { value: "city-tour", label: "City Tour", emoji: "🚐" },
  { value: "historia", label: "História e cultura", emoji: "🏛️" },
  { value: "sertao", label: "Sertão", emoji: "🏜️" },
  { value: "rio-mar", label: "Rio e mar", emoji: "🌊" },
  { value: "natureza", label: "Natureza", emoji: "🌴" },
] as const;

export const REGION_IMAGES: Record<string, string> = {
  Maceió: "/images/maceio.jpg",
  "Litoral Norte": "/images/litoral-norte.jpg",
  "Litoral Sul": "/images/litoral-sul.jpg",
  "Foz do São Francisco": "/images/foz-sao-francisco.jpg",
  "História & Cultura": "/images/historia-cultura.jpg",
  "Sertão & Cânions": "/images/sertao-canions.jpg",
  Recife: "/images/recife.jpg",
  Olinda: "/images/olinda.jpg",
  "Porto de Galinhas": "/images/porto-de-galinhas.jpg",
  "Praia dos Carneiros": "/images/carneiros.jpg",
};

export const REGION_DESCRIPTIONS: Record<string, string> = {
  Maceió: "Piscinas naturais, orla urbana, city tour, cultura e gastronomia na capital alagoana.",
  "Litoral Norte":
    "Rota Ecológica, São Miguel dos Milagres, Japaratinga e as galés de Maragogi.",
  "Litoral Sul": "Praia do Francês, Gunga, Barra de São Miguel, dunas e o sul de Alagoas.",
  "Foz do São Francisco": "O Velho Chico encontrando o mar, entre dunas, restinga e coqueirais.",
  "História & Cultura": "Penedo, Serra da Barriga, Quilombo dos Palmares e roteiros culturais.",
  "Sertão & Cânions": "Piranhas, Cânions do Xingó, Rota do Cangaço e o sertão alagoano.",
  Recife: "Recife Antigo, Marco Zero, centro histórico e experiências culturais.",
  Olinda: "Centro histórico, igrejas, mirantes e a arte olindense.",
  "Porto de Galinhas": "Piscinas naturais, jangadas, buggy e as praias de Ipojuca.",
  "Praia dos Carneiros": "Igrejinha, catamarã pelo rio Formoso e piscinas naturais.",
};

export const GALLERY = [
  { image: "/images/maceio.jpg", label: "Maceió" },
  { image: "https://i0.wp.com/www.destinosimperdiveis.com.br/wp-content/uploads/2022/09/piscinas_pajucara01.jpg?ssl=1&w=1500", label: "Pajuçara" },
  { image: "https://upload.wikimedia.org/wikipedia/commons/9/99/Marco_Ankosqui_Praia_Ipioca_Maceio-AL_%2841609477621%29.jpg", label: "Ipioca" },
  { image: "/images/paripueira.jpg", label: "Praia de Sonho Verde — Paripueira" },
  { image: "/images/paripueira.jpg", label: "Paripueira" },
  { image: "https://www.touristmaker.com/wp-content/uploads/2020/06/barra-de-santo-antonio-and-praia-da-ilha-da-croa-768x512.jpg", label: "Carro Quebrado — Barra de Santo Antônio" },
  { image: "https://www.canal26.com/resizer/v2/6U6UOMSWUFGFRNNX4ZLAWXUYRI.jpg?auth=3342a8220c352ff6e465d63c7db872030ec74adf2ea2573968d7afddb4ed0705", label: "São Miguel dos Milagres" },
  { image: "https://ondeir360.com.br/wp-content/uploads/2022/07/praia-de-maragogi01-820x1024.jpg", label: "Maragogi — Antunes, Barra Grande, Xaréu e São Bento" },
  { image: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Praia_do_Franc%C3%AAs%2C_Franc%C3%AAs_Beach%2C_Marechal_Deodoro%2C_Brazil_%2851378952952%29.jpg", label: "Praia do Francês" },
  { image: "/images/gunga.jpg", label: "Praia do Gunga — Roteiro" },
  { image: "/images/jequia.jpg", label: "Dunas de Marapé — Jequiá da Praia" },
  { image: "/images/piacabucu.jpg", label: "Piaçabuçu" },
  { image: "/images/foz-sao-francisco.jpg", label: "Foz do São Francisco" },
  { image: "https://jornaldealagoas.nyc3.digitaloceanspaces.com/uploads/imagens/penedo-centro-historico-alagoas.jpg", label: "Penedo" },
  { image: "/images/piranhas.jpg", label: "Piranhas" },
  { image: "/images/porto-de-galinhas.jpg", label: "Porto de Galinhas" },
  { image: "/images/carneiros.jpg", label: "Praia dos Carneiros" },
  { image: "/images/recife.jpg", label: "Recife" },
  { image: "/images/olinda.jpg", label: "Olinda" },
] as const;
