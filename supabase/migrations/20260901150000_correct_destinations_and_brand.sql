-- Correções de localização, atrativos e identidade visual solicitadas.
UPDATE public.site_settings SET value = '57.785.626/0001-78' WHERE key = 'cnpj';
UPDATE public.site_settings SET value = 'Matias Nascimento' WHERE key = 'legal_name';
UPDATE public.site_settings SET value = '' WHERE key = 'address';

-- Ipioca pertence a Maceió. Sonho Verde pertence a Paripueira e não deve aparecer em Ipioca.
UPDATE public.services
SET location = 'Ipioca, Maceió, AL',
    short_description = 'Praia de Ipioca, no litoral norte de Maceió, com coqueirais, mar tranquilo e piscinas naturais na maré baixa.',
    image_url = '/images/ipioca.jpg'
WHERE slug = 'ipioca-maceio';

UPDATE public.services
SET location = 'Ipioca, Maceió, AL',
    image_url = '/images/ipioca.jpg'
WHERE slug = 'piscinas-naturais-ipioca';

INSERT INTO public.services (slug, name, state, region, category, kind, location, short_description, image_url, tags, sort_order)
VALUES
('sonho-verde-paripueira','Praia de Sonho Verde','AL','Litoral Norte','Passeio','tour','Paripueira, AL','Praia de Sonho Verde, em Paripueira, com coqueirais, águas calmas e recifes que formam piscinas naturais na maré baixa.','https://www.paripueira.com/wp-content/uploads/2025/09/mar-verde-pirapueira.png','{natureza,piscinas-naturais}',205),
('piscina-do-davi-sonho-verde','Piscina do Davi — Sonho Verde','AL','Litoral Norte','Experiência','experience','Paripueira, AL','Piscina natural associada à Praia de Sonho Verde, acessível conforme as condições de maré.','https://www.paripueira.com/wp-content/uploads/2025/09/mar-verde-pirapueira.png','{piscinas-naturais,snorkeling,nautico}',206)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  region = EXCLUDED.region,
  location = EXCLUDED.location,
  short_description = EXCLUDED.short_description,
  image_url = EXCLUDED.image_url,
  tags = EXCLUDED.tags,
  sort_order = EXCLUDED.sort_order;

-- Carro Quebrado é tratado como atrativo de Barra de Santo Antônio.
UPDATE public.services
SET location = 'Barra de Santo Antônio, AL',
    image_url = '/images/barra-santo-antonio.jpg'
WHERE slug = 'carro-quebrado';

-- Maragogi: separar experiências náuticas que estavam ausentes.
INSERT INTO public.services (slug, name, state, region, category, kind, location, short_description, image_url, tags, sort_order)
VALUES
('passeio-de-lancha-maragogi','Passeio de lancha em Maragogi','AL','Litoral Norte','Náutico','experience','Maragogi, AL','Passeio de lancha para explorar praias, recifes e águas cristalinas de Maragogi, conforme as condições de maré e navegação.','/images/maragogi.jpg','{lancha,nautico,natureza}',401),
('jet-ski-maragogi','Jet ski em Maragogi','AL','Litoral Norte','Náutico','experience','Maragogi, AL','Experiência de jet ski em Maragogi com operação local e áreas permitidas para a atividade.','/images/maragogi.jpg','{nautico,natureza}',402)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  image_url = EXCLUDED.image_url,
  tags = EXCLUDED.tags,
  sort_order = EXCLUDED.sort_order;

-- Dunas de Marapé fica em Jequiá da Praia, não em Barra de São Miguel.
UPDATE public.services
SET region = 'Litoral Sul',
    location = 'Jequiá da Praia, AL',
    short_description = 'Complexo de Dunas de Marapé, onde rio, mar e lagoa se encontram, com travessia de barco e paisagem de dunas e manguezais.',
    image_url = 'https://app.tindo.com.br/tindo/arquivos/empresas/657/site/passeio/f7989360-20d1-4e07-b87e-48144d2faf41.jpg',
    tags = '{natureza,rio-mar,nautico}'
WHERE slug = 'dunas-de-marape';

UPDATE public.services
SET short_description = 'Praias, lagoas, rios e áreas naturais de Jequiá da Praia, incluindo o complexo Dunas de Marapé.',
    image_url = '/images/jequia.jpg'
WHERE slug = 'jequia-da-praia';

INSERT INTO public.services (slug, name, state, region, category, kind, location, short_description, image_url, tags, sort_order)
VALUES
('trilha-dos-caetes','Trilha dos Caetés','AL','Litoral Sul','Natureza','tour','Jequiá da Praia, AL','Trilha ecológica em Jequiá da Praia, com manguezais, fauna, flora e acesso ao complexo Dunas de Marapé.','/images/jequia.jpg','{natureza}',551),
('praia-jacarecica-do-sul','Praia de Jacarecica do Sul','AL','Litoral Sul','Passeio','tour','Jequiá da Praia, AL','Praia preservada e tranquila de Jequiá da Praia, com mar e natureza em um cenário pouco urbanizado.','/images/jequia.jpg','{natureza}',552),
('lagoa-azeda-jequia','Praia da Lagoa Azeda','AL','Litoral Sul','Passeio','tour','Jequiá da Praia, AL','Praia de mar calmo e extensa faixa de areia na região de Jequiá da Praia.','/images/jequia.jpg','{natureza}',553),
('passeio-barco-rio-jequia','Passeio de barco pelo Rio Jequiá','AL','Litoral Sul','Náutico','experience','Jequiá da Praia, AL','Navegação pelo Rio Jequiá entre manguezais, bancos de areia e ilhotas, com paradas conforme o roteiro.','/images/jequia.jpg','{nautico,rio-mar,natureza}',554)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  image_url = EXCLUDED.image_url,
  tags = EXCLUDED.tags,
  sort_order = EXCLUDED.sort_order;
