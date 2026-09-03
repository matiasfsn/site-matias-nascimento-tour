-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ============ UPDATED_AT HELPER ============
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============ SERVICES ============
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  state text NOT NULL CHECK (state IN ('AL','PE')),
  region text NOT NULL,
  category text NOT NULL,
  kind text NOT NULL DEFAULT 'tour' CHECK (kind IN ('tour','transfer','experience')),
  location text NOT NULL DEFAULT '',
  short_description text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '/images/hero-alagoas.jpg',
  gallery text[] NOT NULL DEFAULT '{}',
  highlights text[] NOT NULL DEFAULT '{}',
  tags text[] NOT NULL DEFAULT '{}',
  internal_price numeric,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage services"
ON public.services FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX services_state_idx ON public.services (state);
CREATE INDEX services_region_idx ON public.services (region);
CREATE INDEX services_kind_idx ON public.services (kind);

-- Public view WITHOUT internal_price, only active rows
CREATE VIEW public.public_services
WITH (security_invoker = off) AS
SELECT id, slug, name, state, region, category, kind, location,
       short_description, description, image_url, gallery, highlights,
       tags, sort_order
FROM public.services
WHERE is_active = true;

GRANT SELECT ON public.public_services TO anon, authenticated;

-- ============ SITE SETTINGS ============
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings"
ON public.site_settings FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Admins manage site settings"
ON public.site_settings FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_settings (key, value) VALUES
  ('whatsapp_number', '5582982007100'),
  ('instagram_url', 'https://instagram.com/matias.nascimento.tour_al'),
  ('instagram_handle', '@matias.nascimento.tour_al'),
  ('whatsapp_default_message', 'Olá! Gostaria de saber mais sobre os passeios e transfers.'),
  ('company_name', 'MATIAS.NASCIMENTO.TOUR_AL'),
  ('company_tagline', 'Turismo • Experiências • Memórias'),
  ('about_text', 'A MATIAS.NASCIMENTO.TOUR_AL nasceu com o propósito de proporcionar experiências inesquecíveis aos viajantes que desejam conhecer as belezas de Alagoas e Pernambuco com conforto, segurança e atendimento personalizado.'),
  ('cnpj', ''),
  ('legal_name', ''),
  ('address', ''),
  ('legal_info', '');

-- ============ SEED SERVICES ============
INSERT INTO public.services (slug, name, state, region, category, kind, location, short_description, image_url, tags, sort_order) VALUES
-- MACEIÓ
('piscinas-naturais-pajucara','Piscinas Naturais de Pajuçara','AL','Maceió','Passeio','tour','Pajuçara, Maceió','Travessia de jangada até as piscinas naturais em frente à orla de Pajuçara.','/images/maceio.jpg','{piscinas-naturais,jangada,rio-mar,nautico}',10),
('ponta-verde','Ponta Verde','AL','Maceió','Passeio','tour','Ponta Verde, Maceió','A praia mais badalada da orla de Maceió, com águas calmas e estrutura completa.','/images/maceio.jpg','{natureza}',20),
('jatiuca','Jatiúca','AL','Maceió','Passeio','tour','Jatiúca, Maceió','Praia urbana com coqueiros, quiosques e piscinas naturais na maré baixa.','/images/maceio.jpg','{natureza}',30),
('ipioca-maceio','Ipioca','AL','Maceió','Passeio','tour','Ipioca, Maceió','Praia tranquila no extremo norte de Maceió, cercada por falésias e coqueirais.','/images/litoral-norte.jpg','{natureza}',40),
('piscinas-naturais-ipioca','Piscinas Naturais de Ipioca','AL','Maceió','Experiência','experience','Ipioca, Maceió','Piscinas naturais de águas cristalinas formadas pelos recifes de Ipioca.','/images/litoral-norte.jpg','{piscinas-naturais,nautico,snorkeling}',50),
('passeio-jangada-maceio','Passeio de jangada','AL','Maceió','Náutico','experience','Maceió','Passeio clássico de jangada pelas águas transparentes de Maceió.','/images/maceio.jpg','{jangada,nautico,rio-mar}',60),
('passeios-barco-maceio','Passeios de barco','AL','Maceió','Náutico','experience','Maceió','Navegue pela orla e pelas lagoas de Maceió em um passeio de barco.','/images/maceio.jpg','{nautico,rio-mar}',70),
('caiaque-maceio','Caiaque','AL','Maceió','Náutico','experience','Maceió','Rememo pelas águas calmas da orla, ideal para todas as idades.','/images/experiencias.jpg','{caiaque,nautico}',80),
('caiaque-transparente-maceio','Caiaque transparente','AL','Maceió','Náutico','experience','Maceió','Caiaque de fundo transparente para ver os corais e peixes sem mergulhar.','/images/experiencias.jpg','{caiaque,nautico,snorkeling}',90),
('experiencias-nauticas-maceio','Experiências náuticas','AL','Maceió','Náutico','experience','Maceió','Combinações de jangada, caiaque, stand up e mergulho livre.','/images/experiencias.jpg','{nautico,snorkeling,caiaque}',100),
('city-tour-maceio','City Tour Maceió','AL','Maceió','City Tour','tour','Maceió','Roteiro guiado pelos principais pontos turísticos da capital alagoana.','/images/maceio.jpg','{city-tour,cultural}',110),
('tour-historico-cultural-maceio','Tour histórico e cultural','AL','Maceió','Cultural','tour','Centro, Maceió','Igrejas, teatros, praças e casarões do centro histórico de Maceió.','/images/historia-cultura.jpg','{cultural,city-tour,historia}',120),
('artesanato-mercados-maceio','Artesanato e mercados','AL','Maceió','Cultural','tour','Maceió','Mercado do artesanato, feirinha da Pajuçara e o melhor do filé alagoano.','/images/maceio.jpg','{cultural,city-tour}',130),
('passeios-gastronomicos-maceio','Passeios gastronômicos','AL','Maceió','Cultural','tour','Maceió','Sabores alagoanos: sururu, peixes, frutos do mar e doces regionais.','/images/maceio.jpg','{cultural,city-tour}',140),
('vila-palateia-manguezais','Vila Palatéia e manguezais','AL','Maceió','Natureza','tour','Maceió','Passeio pelos manguezais e pela comunidade ribeirinha da Vila Palatéia.','/images/maceio.jpg','{natureza,rio-mar,nautico}',150),
-- LITORAL NORTE
('paripueira','Paripueira','AL','Litoral Norte','Passeio','tour','Paripueira, AL','Praia de águas mornas e recifes, lar dos peixes-boi marinhos.','/images/litoral-norte.jpg','{natureza,piscinas-naturais}',200),
('barra-de-santo-antonio','Barra de Santo Antônio','AL','Litoral Norte','Passeio','tour','Barra de Santo Antônio, AL','Encontro do rio com o mar, jangadas e a famosa Ilha da Crôa.','/images/litoral-norte.jpg','{natureza,rio-mar}',210),
('ilha-da-croa','Ilha da Crôa','AL','Litoral Norte','Passeio','tour','Barra de Santo Antônio, AL','Banco de areia entre o rio e o mar, com águas mornas e transparentes.','/images/litoral-norte.jpg','{natureza,rio-mar,nautico}',220),
('carro-quebrado','Carro Quebrado','AL','Litoral Norte','Passeio','tour','Paripueira / Barra de Santo Antônio, AL','Falésias coloridas à beira-mar, um dos cenários mais fotografados de Alagoas.','/images/litoral-norte.jpg','{natureza}',230),
('tabuba','Tabuba','AL','Litoral Norte','Passeio','tour','Barra de Santo Antônio, AL','Praia calma com coqueirais e piscinas naturais na maré baixa.','/images/litoral-norte.jpg','{natureza,piscinas-naturais}',240),
('passo-de-camaragibe','Passo de Camaragibe','AL','Litoral Norte','Passeio','tour','Passo de Camaragibe, AL','Praias desertas e vilarejos na Rota Ecológica de Alagoas.','/images/sao-miguel.jpg','{natureza}',250),
('sao-miguel-dos-milagres','São Miguel dos Milagres','AL','Litoral Norte','Passeio','tour','São Miguel dos Milagres, AL','O coração da Rota Ecológica: coqueirais, piscinas naturais e paz.','/images/sao-miguel.jpg','{natureza,piscinas-naturais}',260),
('praia-do-toque','Praia do Toque','AL','Litoral Norte','Passeio','tour','São Miguel dos Milagres, AL','Praia rústica e sofisticada, cercada por pousadas charmosas.','/images/sao-miguel.jpg','{natureza}',270),
('porto-da-rua','Porto da Rua','AL','Litoral Norte','Passeio','tour','São Miguel dos Milagres, AL','Vila de pescadores com jangadas e piscinas naturais logo em frente.','/images/sao-miguel.jpg','{natureza,jangada,piscinas-naturais}',280),
('praia-do-marceneiro','Praia do Marceneiro','AL','Litoral Norte','Passeio','tour','Passo de Camaragibe, AL','Praia tranquila com recifes próximos à areia e coqueiros.','/images/sao-miguel.jpg','{natureza,piscinas-naturais}',290),
('porto-de-pedras','Porto de Pedras','AL','Litoral Norte','Passeio','tour','Porto de Pedras, AL','Farol, mirante e o rio Manguaba encontrando o mar.','/images/sao-miguel.jpg','{natureza,rio-mar}',300),
('tatuamunha','Tatuamunha','AL','Litoral Norte','Natureza','tour','Porto de Pedras, AL','Passeio de barco pelo rio Tatuamunha, no santuário dos peixes-boi.','/images/sao-miguel.jpg','{natureza,rio-mar,nautico}',310),
('japaratinga','Japaratinga','AL','Litoral Norte','Passeio','tour','Japaratinga, AL','Longas faixas de areia branca e piscinas naturais rasas e mornas.','/images/litoral-norte.jpg','{natureza,piscinas-naturais}',320),
('maragogi','Maragogi','AL','Litoral Norte','Passeio','tour','Maragogi, AL','O Caribe brasileiro: galés, corais e água azul-turquesa.','/images/litoral-norte.jpg','{piscinas-naturais,nautico,snorkeling}',330),
('antunes','Antunes','AL','Litoral Norte','Passeio','tour','Maragogi, AL','Praia de águas claras e rasas, perfeita para famílias.','/images/litoral-norte.jpg','{natureza,piscinas-naturais}',340),
('barra-grande-al','Barra Grande','AL','Litoral Norte','Passeio','tour','Maragogi, AL','Praia tranquila com coqueiros e recifes próximos à costa.','/images/litoral-norte.jpg','{natureza}',350),
('xareu','Xaréu','AL','Litoral Norte','Passeio','tour','Maragogi, AL','Piscinas naturais menos movimentadas, ótimas para snorkeling.','/images/litoral-norte.jpg','{piscinas-naturais,snorkeling}',360),
('sao-bento','São Bento','AL','Litoral Norte','Passeio','tour','Maragogi, AL','Praia de coqueirais e águas calmas no extremo norte alagoano.','/images/litoral-norte.jpg','{natureza}',370),
('piscinas-naturais-paripueira','Piscinas Naturais de Paripueira','AL','Litoral Norte','Experiência','experience','Paripueira, AL','Passeio de catamarã ou barco até as piscinas naturais de Paripueira.','/images/litoral-norte.jpg','{piscinas-naturais,catamara,nautico,snorkeling}',380),
('piscinas-naturais-sao-miguel','Piscinas Naturais de São Miguel dos Milagres','AL','Litoral Norte','Experiência','experience','São Miguel dos Milagres, AL','Passeio de jangada até as piscinas naturais da Rota Ecológica.','/images/sao-miguel.jpg','{piscinas-naturais,jangada,nautico,snorkeling}',390),
('piscinas-naturais-maragogi','Piscinas Naturais de Maragogi','AL','Litoral Norte','Experiência','experience','Maragogi, AL','As galés de Maragogi: mergulho livre em piscinas a 6 km da costa.','/images/litoral-norte.jpg','{piscinas-naturais,catamara,snorkeling,nautico}',400),
('passeios-jangada-litoral-norte','Passeios de jangada','AL','Litoral Norte','Náutico','experience','Litoral Norte, AL','Jangadas tradicionais rumo às piscinas naturais do litoral norte.','/images/sao-miguel.jpg','{jangada,nautico}',410),
('passeios-barco-litoral-norte','Passeios de barco','AL','Litoral Norte','Náutico','experience','Litoral Norte, AL','Navegue pelos rios e recifes do litoral norte alagoano.','/images/litoral-norte.jpg','{nautico,rio-mar}',420),
('passeios-lancha-litoral-norte','Passeios de lancha','AL','Litoral Norte','Náutico','experience','Litoral Norte, AL','Lancha privativa para conhecer as melhores praias sem pressa.','/images/litoral-norte.jpg','{lancha,nautico}',430),
('snorkeling-litoral-norte','Snorkeling','AL','Litoral Norte','Náutico','experience','Litoral Norte, AL','Mergulho livre entre corais e peixes coloridos.','/images/experiencias.jpg','{snorkeling,nautico}',440),
('experiencias-nauticas-litoral-norte','Experiências náuticas','AL','Litoral Norte','Náutico','experience','Litoral Norte, AL','Combinações de barco, jangada, caiaque e mergulho livre.','/images/experiencias.jpg','{nautico,caiaque,snorkeling}',450),
-- LITORAL SUL
('praia-do-frances','Praia do Francês','AL','Litoral Sul','Passeio','tour','Marechal Deodoro, AL','Praia badalada com lado calmo e lado de ondas, ótima estrutura.','/images/litoral-sul.jpg','{natureza}',500),
('marechal-deodoro','Marechal Deodoro','AL','Litoral Sul','Cultural','tour','Marechal Deodoro, AL','Primeira capital de Alagoas: igrejas coloniais e a lagoa Manguaba.','/images/historia-cultura.jpg','{cultural,historia,city-tour}',510),
('barra-de-sao-miguel','Barra de São Miguel','AL','Litoral Sul','Passeio','tour','Barra de São Miguel, AL','Baía protegida por recifes, com águas calmas e transparentes.','/images/litoral-sul.jpg','{natureza,piscinas-naturais}',520),
('praia-do-gunga','Praia do Gunga','AL','Litoral Sul','Passeio','tour','Roteiro do Mar, AL','Encontro da lagoa com o mar entre um imenso coqueiral. Cartão-postal de Alagoas.','/images/litoral-sul.jpg','{natureza,rio-mar,nautico}',530),
('dunas-de-marape','Dunas de Marapé','AL','Litoral Sul','Natureza','tour','Barra de São Miguel, AL','Dunas e mirantes com vista panorâmica para o Gunga e o rio São Miguel.','/images/litoral-sul.jpg','{natureza}',540),
('jequia-da-praia','Jequiá da Praia','AL','Litoral Sul','Passeio','tour','Jequiá da Praia, AL','Praias desertas, lagoa e coqueirais no sul de Alagoas.','/images/litoral-sul.jpg','{natureza}',550),
('coruripe','Coruripe','AL','Litoral Sul','Passeio','tour','Coruripe, AL','Praias amplas, falésias e vilarejos de pescadores.','/images/litoral-sul.jpg','{natureza}',560),
('pontal-do-coruripe','Pontal do Coruripe','AL','Litoral Sul','Passeio','tour','Coruripe, AL','Farol histórico, jangadas e piscinas naturais na maré baixa.','/images/litoral-sul.jpg','{natureza,jangada,piscinas-naturais}',570),
('lagoa-de-jequia','Lagoa de Jequiá','AL','Litoral Sul','Natureza','tour','Jequiá da Praia, AL','Passeio de barco pela lagoa cercada de manguezais e ilhas.','/images/litoral-sul.jpg','{natureza,rio-mar,nautico}',580),
('piacabucu','Piaçabuçu','AL','Litoral Sul','Natureza','tour','Piaçabuçu, AL','Portal de entrada da Foz do São Francisco, entre dunas e restinga.','/images/foz-sao-francisco.jpg','{natureza,rio-mar}',590),
('foz-do-rio-sao-francisco-sul','Foz do Rio São Francisco','AL','Litoral Sul','Natureza','tour','Piaçabuçu, AL','O Velho Chico encontrando o oceano — passeio imperdível do litoral sul.','/images/foz-sao-francisco.jpg','{natureza,rio-mar,nautico}',600),
('passeio-lancha-litoral-sul','Passeio de lancha','AL','Litoral Sul','Náutico','experience','Litoral Sul, AL','Lancha privativa pelo rio São Miguel e pela praia do Gunga.','/images/litoral-sul.jpg','{lancha,nautico}',610),
('passeio-barco-litoral-sul','Passeio de barco','AL','Litoral Sul','Náutico','experience','Litoral Sul, AL','Navegação pelas lagoas, rios e praias do litoral sul.','/images/litoral-sul.jpg','{nautico,rio-mar}',620),
('piscinas-naturais-litoral-sul','Passeios pelas piscinas naturais','AL','Litoral Sul','Experiência','experience','Barra de São Miguel, AL','Piscinas naturais protegidas pelos recifes do litoral sul.','/images/litoral-sul.jpg','{piscinas-naturais,snorkeling,nautico}',630),
('dunas-litoral-sul','Dunas','AL','Litoral Sul','Natureza','tour','Litoral Sul, AL','Passeio pelas dunas e mirantes do litoral sul alagoano.','/images/foz-sao-francisco.jpg','{natureza}',640),
('experiencias-natureza-litoral-sul','Experiências de natureza','AL','Litoral Sul','Natureza','tour','Litoral Sul, AL','Manguezais, lagoas, coqueirais e trilhas leves à beira-mar.','/images/litoral-sul.jpg','{natureza}',650),
('roteiros-privativos-litoral-sul','Roteiros privativos','AL','Litoral Sul','Passeio privativo','tour','Litoral Sul, AL','Roteiro exclusivo montado para o seu grupo, no seu ritmo.','/images/litoral-sul.jpg','{natureza}',660),
-- FOZ DO SÃO FRANCISCO
('passeio-barco-foz','Passeio de barco na Foz','AL','Foz do São Francisco','Náutico','experience','Piaçabuçu, AL','Navegação pelo Velho Chico até o encontro com o oceano.','/images/foz-sao-francisco.jpg','{nautico,rio-mar,natureza}',700),
('passeio-lancha-foz','Passeio de lancha','AL','Foz do São Francisco','Náutico','experience','Piaçabuçu, AL','Lancha privativa pela foz, com paradas nas dunas e bancos de areia.','/images/foz-sao-francisco.jpg','{lancha,nautico,rio-mar}',710),
('encontro-rio-mar-foz','Encontro do Rio São Francisco com o mar','AL','Foz do São Francisco','Natureza','tour','Piaçabuçu, AL','O ponto exato onde o rio se encontra com o Atlântico.','/images/foz-sao-francisco.jpg','{natureza,rio-mar}',720),
('dunas-foz','Dunas','AL','Foz do São Francisco','Natureza','tour','Piaçabuçu, AL','Dunas brancas com vista para o rio e o mar.','/images/foz-sao-francisco.jpg','{natureza}',730),
('restinga-foz','Restinga','AL','Foz do São Francisco','Natureza','tour','Piaçabuçu, AL','Caminhada pela restinga preservada da APA do São Francisco.','/images/foz-sao-francisco.jpg','{natureza}',740),
('coqueirais-foz','Coqueirais','AL','Foz do São Francisco','Natureza','tour','Piaçabuçu, AL','Extensos coqueirais que emolduram a foz do Velho Chico.','/images/foz-sao-francisco.jpg','{natureza}',750),
('comunidades-tradicionais-foz','Comunidades tradicionais','AL','Foz do São Francisco','Cultural','tour','Piaçabuçu, AL','Visita às comunidades ribeirinhas e pescadores da região.','/images/foz-sao-francisco.jpg','{cultural,natureza}',760),
('piacabucu-foz','Piaçabuçu','AL','Foz do São Francisco','Passeio','tour','Piaçabuçu, AL','Cidade-porta da foz, com artesanato, gastronomia e o cais do rio.','/images/foz-sao-francisco.jpg','{cultural,natureza}',770),
('roteiro-foz-piacabucu','Roteiro Foz + Piaçabuçu','AL','Foz do São Francisco','Passeio','tour','Piaçabuçu, AL','Dia completo: cidade, barco pela foz, dunas e encontro com o mar.','/images/foz-sao-francisco.jpg','{natureza,rio-mar,nautico}',780),
-- HISTÓRIA & CULTURA
('penedo','Penedo','AL','História & Cultura','Cultural','tour','Penedo, AL','Cidade histórica às margens do São Francisco, com igrejas barrocas.','/images/historia-cultura.jpg','{historia,cultural,city-tour}',800),
('centro-historico-penedo','Centro Histórico de Penedo','AL','História & Cultura','Cultural','tour','Penedo, AL','Casarões coloniais, igrejas e o casario colorido à beira-rio.','/images/historia-cultura.jpg','{historia,cultural,city-tour}',810),
('rio-sao-francisco-penedo','Rio São Francisco em Penedo','AL','História & Cultura','Náutico','experience','Penedo, AL','Travessia e passeio de barco pelo Velho Chico em Penedo.','/images/historia-cultura.jpg','{rio-mar,nautico,historia}',820),
('passeio-lancha-penedo','Passeio de lancha em Penedo','AL','História & Cultura','Náutico','experience','Penedo, AL','Lancha privativa pelo São Francisco, com ilhas e praias fluviais.','/images/historia-cultura.jpg','{lancha,nautico,rio-mar}',830),
('serra-da-barriga','Serra da Barriga','AL','História & Cultura','Cultural','tour','União dos Palmares, AL','Sítio histórico do Quilombo dos Palmares, com vista para a mata.','/images/historia-cultura.jpg','{historia,cultural,natureza}',840),
('uniao-dos-palmares','União dos Palmares','AL','História & Cultura','Cultural','tour','União dos Palmares, AL','Cidade histórica no coração da Zona da Mata alagoana.','/images/historia-cultura.jpg','{historia,cultural}',850),
('quilombo-dos-palmares','Quilombo dos Palmares','AL','História & Cultura','Cultural','tour','União dos Palmares, AL','Parque Memorial Quilombo dos Palmares e a história de Zumbi.','/images/historia-cultura.jpg','{historia,cultural}',860),
('ilha-do-ferro','Ilha do Ferro','AL','História & Cultura','Cultural','tour','Pão de Açúcar, AL','Vila ribeirinha famosa pelo artesanato em bordado e pelo rio.','/images/historia-cultura.jpg','{cultural,rio-mar,historia}',870),
('entremontes','Entremontes','AL','História & Cultura','Cultural','tour','Piranhas, AL','Povoado histórico entre serras às margens do São Francisco.','/images/sertao-canions.jpg','{historia,cultural,sertao}',880),
('roteiros-historicos','Roteiros históricos','AL','História & Cultura','Cultural','tour','Alagoas','Roteiros completos pelas cidades históricas alagoanas.','/images/historia-cultura.jpg','{historia,cultural}',890),
('roteiros-culturais','Roteiros culturais','AL','História & Cultura','Cultural','tour','Alagoas','Música, artesanato, gastronomia e tradições de Alagoas.','/images/historia-cultura.jpg','{cultural}',900),
-- SERTÃO & CÂNIONS
('piranhas','Piranhas','AL','Sertão & Cânions','Cultural','tour','Piranhas, AL','Cidade histórica do sertão, cenário da Rota do Cangaço.','/images/sertao-canions.jpg','{sertao,historia,cultural}',1000),
('canions-do-sao-francisco','Cânions do São Francisco','AL','Sertão & Cânions','Natureza','tour','Piranhas / Canindé, AL','Paredões de até 50 m emoldurando as águas verdes do Velho Chico.','/images/sertao-canions.jpg','{sertao,natureza,rio-mar,catamara}',1010),
('canions-do-xingo','Cânions do Xingó','AL','Sertão & Cânions','Natureza','tour','Xingó, AL','Passeio pelo lago de Xingó entre falésias avermelhadas.','/images/sertao-canions.jpg','{sertao,natureza,catamara,nautico}',1020),
('passeio-catamara-xingo','Passeio de catamarã','AL','Sertão & Cânions','Náutico','experience','Xingó, AL','Catamarã pelos cânions com parada para banho no rio.','/images/sertao-canions.jpg','{catamara,nautico,sertao}',1030),
('lancha-privativa-xingo','Passeio de lancha privativa','AL','Sertão & Cânions','Passeio privativo','experience','Xingó, AL','Lancha exclusiva para explorar os cânions no seu ritmo.','/images/sertao-canions.jpg','{lancha,nautico,sertao}',1040),
('gruta-do-talhado','Gruta do Talhado','AL','Sertão & Cânions','Natureza','tour','Olho d''Água do Casado, AL','Formações rochosas esculpidas pelo rio, dentro dos cânions.','/images/sertao-canions.jpg','{sertao,natureza}',1050),
('paraiso-do-talhado','Paraíso do Talhado','AL','Sertão & Cânions','Natureza','tour','Olho d''Água do Casado, AL','Mirante e prainha de águas verdes entre os paredões.','/images/sertao-canions.jpg','{sertao,natureza}',1060),
('grota-do-angico','Grota do Angico','AL','Sertão & Cânions','Cultural','tour','Poço Redondo / Piranhas','Monumento natural onde terminou a história de Lampião.','/images/sertao-canions.jpg','{sertao,historia,cultural}',1070),
('rota-do-cangaco','Rota do Cangaço','AL','Sertão & Cânions','Cultural','tour','Piranhas, AL','Trilha e navegação pelos caminhos do cangaço no sertão.','/images/sertao-canions.jpg','{sertao,historia,cultural,natureza}',1080),
('centro-historico-piranhas','Centro Histórico de Piranhas','AL','Sertão & Cânions','Cultural','tour','Piranhas, AL','Casario colonial, estação ferroviária e museu do cangaço.','/images/sertao-canions.jpg','{sertao,historia,cultural,city-tour}',1090),
('mirantes-sertao','Mirantes','AL','Sertão & Cânions','Natureza','tour','Piranhas, AL','Mirantes com vista panorâmica do rio e das serras do sertão.','/images/sertao-canions.jpg','{sertao,natureza}',1100),
('usina-de-xingo','Usina de Xingó','AL','Sertão & Cânions','Cultural','tour','Canindé / Piranhas','Visita à imponente usina hidrelétrica de Xingó.','/images/sertao-canions.jpg','{sertao,cultural}',1110),
('olho-dagua-do-casado','Olho d''Água do Casado','AL','Sertão & Cânions','Passeio','tour','Olho d''Água do Casado, AL','Porta de entrada para o Talhado e os cânions alagoanos.','/images/sertao-canions.jpg','{sertao,natureza}',1120),
('delmiro-gouveia','Delmiro Gouveia','AL','Sertão & Cânions','Cultural','tour','Delmiro Gouveia, AL','Cidade do sertão com história industrial e acesso à Xingó.','/images/sertao-canions.jpg','{sertao,cultural,historia}',1130),
-- PERNAMBUCO — PORTO DE GALINHAS
('porto-de-galinhas','Porto de Galinhas','PE','Porto de Galinhas','Passeio','tour','Ipojuca, PE','Um dos destinos mais amados do Brasil, com piscinas naturais e jangadas.','/images/porto-de-galinhas.jpg','{piscinas-naturais,jangada,natureza}',1200),
('piscinas-naturais-porto-de-galinhas','Piscinas naturais','PE','Porto de Galinhas','Experiência','experience','Ipojuca, PE','Travessia de jangada até as piscinas naturais de Porto de Galinhas.','/images/porto-de-galinhas.jpg','{piscinas-naturais,jangada,snorkeling,nautico}',1210),
('jangada-porto-de-galinhas','Passeios de jangada','PE','Porto de Galinhas','Náutico','experience','Ipojuca, PE','Jangadas coloridas rumo aos corais e peixes de Porto de Galinhas.','/images/porto-de-galinhas.jpg','{jangada,nautico}',1220),
('buggy-porto-de-galinhas','Passeios de buggy','PE','Porto de Galinhas','Experiência','experience','Ipojuca, PE','Buggy pelas praias do litoral sul de Pernambuco.','/images/porto-de-galinhas.jpg','{natureza}',1230),
('barco-porto-de-galinhas','Passeios de barco','PE','Porto de Galinhas','Náutico','experience','Ipojuca, PE','Navegação pelos rios e praias de Ipojuca.','/images/porto-de-galinhas.jpg','{nautico,rio-mar}',1240),
('praias-porto-de-galinhas','Praias','PE','Porto de Galinhas','Passeio','tour','Ipojuca, PE','Muro Alto, Cupe, Maracaípe e Pontal de Maracaípe.','/images/porto-de-galinhas.jpg','{natureza}',1250),
('privativos-porto-de-galinhas','Passeios privativos','PE','Porto de Galinhas','Passeio privativo','tour','Ipojuca, PE','Roteiro exclusivo por Porto de Galinhas e arredores.','/images/porto-de-galinhas.jpg','{natureza}',1260),
-- PERNAMBUCO — CARNEIROS
('praia-dos-carneiros','Praia dos Carneiros','PE','Praia dos Carneiros','Passeio','tour','Tamandaré, PE','Coqueirais, águas calmas e a icônica igrejinha à beira-mar.','/images/carneiros.jpg','{natureza,piscinas-naturais}',1300),
('catamara-carneiros','Passeio de catamarã','PE','Praia dos Carneiros','Náutico','experience','Tamandaré, PE','Catamarã pelo rio Formoso até a praia dos Carneiros.','/images/carneiros.jpg','{catamara,nautico,rio-mar}',1310),
('barco-carneiros','Passeio de barco','PE','Praia dos Carneiros','Náutico','experience','Tamandaré, PE','Navegação pelo rio Formoso, manguezais e foz.','/images/carneiros.jpg','{nautico,rio-mar}',1320),
('igrejinha-carneiros','Igrejinha','PE','Praia dos Carneiros','Cultural','tour','Tamandaré, PE','A capela de São Benedito, cartão-postal dos Carneiros.','/images/carneiros.jpg','{cultural,natureza}',1330),
('piscinas-naturais-carneiros','Piscinas naturais','PE','Praia dos Carneiros','Experiência','experience','Tamandaré, PE','Piscinas naturais rasas e mornas formadas pelos recifes.','/images/carneiros.jpg','{piscinas-naturais,snorkeling}',1340),
('privativas-carneiros','Experiências privativas','PE','Praia dos Carneiros','Passeio privativo','tour','Tamandaré, PE','Barco ou catamarã exclusivo para o seu grupo.','/images/carneiros.jpg','{nautico,natureza}',1350),
-- PERNAMBUCO — RECIFE
('city-tour-recife','City Tour Recife','PE','Recife','City Tour','tour','Recife, PE','Roteiro guiado pelos principais pontos da capital pernambucana.','/images/recife.jpg','{city-tour,cultural}',1400),
('recife-antigo','Recife Antigo','PE','Recife','Cultural','tour','Recife, PE','O bairro histórico com casarios coloridos, pontes e cultura.','/images/recife.jpg','{cultural,historia,city-tour}',1410),
('marco-zero','Marco Zero','PE','Recife','Cultural','tour','Recife, PE','A praça símbolo do Recife, com o Parque das Esculturas.','/images/recife.jpg','{cultural,city-tour}',1420),
('centro-historico-recife','Centro histórico','PE','Recife','Cultural','tour','Recife, PE','Igrejas, mercados e a arquitetura colonial do Recife.','/images/recife.jpg','{cultural,historia,city-tour}',1430),
('experiencias-culturais-recife','Experiências culturais','PE','Recife','Cultural','experience','Recife, PE','Frevo, maracatu, museus e a cena cultural pernambucana.','/images/recife.jpg','{cultural}',1440),
('gastronomicos-recife','Passeios gastronômicos','PE','Recife','Cultural','experience','Recife, PE','Sabores do Recife: mercados, bolos e frutos do mar.','/images/recife.jpg','{cultural}',1450),
-- PERNAMBUCO — OLINDA
('city-tour-olinda','City Tour Olinda','PE','Olinda','City Tour','tour','Olinda, PE','Passeio guiado pelo centro histórico patrimônio da humanidade.','/images/olinda.jpg','{city-tour,cultural,historia}',1500),
('centro-historico-olinda','Centro Histórico','PE','Olinda','Cultural','tour','Olinda, PE','Ladeiras, casarios coloridos e ateliês de arte.','/images/olinda.jpg','{cultural,historia,city-tour}',1510),
('igrejas-olinda','Igrejas','PE','Olinda','Cultural','tour','Olinda, PE','Igrejas barrocas e conventos seculares de Olinda.','/images/olinda.jpg','{cultural,historia}',1520),
('mirantes-olinda','Mirantes','PE','Olinda','Cultural','tour','Olinda, PE','Alto da Sé e mirantes com vista para o Recife e o mar.','/images/olinda.jpg','{cultural,city-tour}',1530),
('experiencias-culturais-olinda','Experiências culturais','PE','Olinda','Cultural','experience','Olinda, PE','Frevo, bonecos gigantes, arte e artesanato olindense.','/images/olinda.jpg','{cultural}',1540),
-- TRANSFERS ALAGOAS
('transfer-aeroporto-maceio-hoteis','Aeroporto de Maceió → Hotéis/Orla','AL','Maceió','Transfer','transfer','Maceió, AL','Recepção no aeroporto Zumbi dos Palmares e traslado até sua hospedagem.','/images/transfers.jpg','{transfer}',2000),
('transfer-hoteis-aeroporto-maceio','Hotéis/Orla → Aeroporto de Maceió','AL','Maceió','Transfer','transfer','Maceió, AL','Traslado da sua hospedagem até o aeroporto, com horário garantido.','/images/transfers.jpg','{transfer}',2010),
('transfer-aeroporto-praia-do-frances','Aeroporto → Praia do Francês','AL','Litoral Sul','Transfer','transfer','Marechal Deodoro, AL','Traslado direto do aeroporto até a Praia do Francês.','/images/transfers.jpg','{transfer}',2020),
('transfer-aeroporto-ipioca','Aeroporto → Ipioca','AL','Maceió','Transfer','transfer','Ipioca, Maceió','Traslado do aeroporto até as pousadas e resorts de Ipioca.','/images/transfers.jpg','{transfer}',2030),
('transfer-maceio-maragogi','Maceió → Maragogi','AL','Litoral Norte','Transfer','transfer','Maragogi, AL','Traslado confortável de Maceió até Maragogi.','/images/transfers.jpg','{transfer}',2040),
('transfer-aeroporto-maragogi','Aeroporto → Maragogi','AL','Litoral Norte','Transfer','transfer','Maragogi, AL','Do aeroporto de Maceió direto para Maragogi.','/images/transfers.jpg','{transfer}',2050),
('transfer-resorts-al','Transfers para resorts','AL','Litoral Norte','Transfer','transfer','Alagoas','Traslados para os resorts do litoral alagoano.','/images/transfers.jpg','{transfer}',2060),
('transfer-privativos-al','Transfers privativos','AL','Maceió','Transfer','transfer','Alagoas','Veículo exclusivo para você e seu grupo, sem paradas.','/images/transfers.jpg','{transfer}',2070),
('transfer-personalizados-al','Transfers personalizados','AL','Maceió','Transfer','transfer','Alagoas','Monte o trajeto que precisar dentro de Alagoas.','/images/transfers.jpg','{transfer}',2080),
-- TRANSFERS PERNAMBUCO
('transfer-recife-porto-de-galinhas','Aeroporto do Recife → Porto de Galinhas','PE','Porto de Galinhas','Transfer','transfer','Ipojuca, PE','Recepção no aeroporto do Recife e traslado até Porto de Galinhas.','/images/transfers.jpg','{transfer}',2100),
('transfer-porto-de-galinhas-recife','Porto de Galinhas → Aeroporto do Recife','PE','Porto de Galinhas','Transfer','transfer','Ipojuca, PE','Traslado de Porto de Galinhas até o aeroporto do Recife.','/images/transfers.jpg','{transfer}',2110),
('transfer-recife-carneiros','Aeroporto do Recife → Praia dos Carneiros','PE','Praia dos Carneiros','Transfer','transfer','Tamandaré, PE','Traslado direto do aeroporto até a Praia dos Carneiros.','/images/transfers.jpg','{transfer}',2120),
('transfer-carneiros-recife','Praia dos Carneiros → Aeroporto do Recife','PE','Praia dos Carneiros','Transfer','transfer','Tamandaré, PE','Traslado dos Carneiros até o aeroporto do Recife.','/images/transfers.jpg','{transfer}',2130),
('transfer-aeroporto-recife','Aeroporto → Recife','PE','Recife','Transfer','transfer','Recife, PE','Traslado do aeroporto para hotéis em Boa Viagem e no Recife.','/images/transfers.jpg','{transfer}',2140),
('transfer-aeroporto-olinda','Aeroporto → Olinda','PE','Olinda','Transfer','transfer','Olinda, PE','Traslado do aeroporto do Recife até Olinda.','/images/transfers.jpg','{transfer}',2150),
('transfer-hoteis-pe','Transfers para hotéis','PE','Recife','Transfer','transfer','Pernambuco','Traslados para hotéis e pousadas em Pernambuco.','/images/transfers.jpg','{transfer}',2160),
('transfer-resorts-pe','Transfers para resorts','PE','Porto de Galinhas','Transfer','transfer','Pernambuco','Traslados para os resorts do litoral pernambucano.','/images/transfers.jpg','{transfer}',2170),
('transfer-privativos-pe','Transfers privativos','PE','Recife','Transfer','transfer','Pernambuco','Veículo exclusivo para você e seu grupo em Pernambuco.','/images/transfers.jpg','{transfer}',2180),
('transfer-personalizados-pe','Transfers personalizados','PE','Recife','Transfer','transfer','Pernambuco','Monte o trajeto que precisar dentro de Pernambuco.','/images/transfers.jpg','{transfer}',2190);