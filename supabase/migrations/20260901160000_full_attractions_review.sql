-- Auditoria geral dos atrativos: localização, nomes, categorias e imagens.
-- Idempotente: pode ser aplicada sem duplicar registros.

-- Identidade legal
UPDATE public.site_settings SET value = 'Matias Nascimento' WHERE key = 'legal_name';
UPDATE public.site_settings SET value = '57.785.626/0001-78' WHERE key = 'cnpj';
UPDATE public.site_settings SET value = '' WHERE key = 'address';

-- Ipioca pertence a Maceió. Sonho Verde pertence a Paripueira.
UPDATE public.services
SET location = 'Ipioca, Maceió, AL', image_url = '/images/ipioca.jpg'
WHERE slug IN ('ipioca-maceio','piscinas-naturais-ipioca');

UPDATE public.services
SET location = 'Paripueira, AL',
    region = 'Litoral Norte',
    short_description = 'Praia de Sonho Verde, em Paripueira, com águas tranquilas, coqueirais e natureza preservada.'
WHERE lower(name) LIKE '%sonho verde%';

-- Litoral Norte: cada atrativo fica associado ao município correto.
UPDATE public.services SET location='Paripueira, AL', image_url='/images/paripueira.jpg'
WHERE slug IN ('paripueira','piscinas-naturais-paripueira');
UPDATE public.services SET location='Paripueira, AL', image_url='https://www.paripueira.com/wp-content/uploads/2025/09/mar-verde-pirapueira.png'
WHERE slug IN ('sonho-verde-paripueira','piscina-do-davi-sonho-verde');

UPDATE public.services SET location='Barra de Santo Antônio, AL', image_url='/images/barra-santo-antonio.jpg'
WHERE slug IN ('barra-de-santo-antonio','ilha-da-croa','carro-quebrado','tabuba');

UPDATE public.services SET location='Passo de Camaragibe, AL', image_url='/images/sao-miguel-dos-milagres.jpg'
WHERE slug IN ('passo-de-camaragibe','praia-do-marceneiro');

UPDATE public.services SET location='São Miguel dos Milagres, AL', image_url='/images/sao-miguel-dos-milagres.jpg'
WHERE slug IN ('sao-miguel-dos-milagres','praia-do-toque','porto-da-rua','piscinas-naturais-sao-miguel');

UPDATE public.services SET location='Porto de Pedras, AL', image_url='/images/sao-miguel.jpg'
WHERE slug IN ('porto-de-pedras','tatuamunha');

UPDATE public.services SET location='Japaratinga, AL', image_url='/images/japaratinga.jpg'
WHERE slug='japaratinga';

-- Maragogi: praias e experiências náuticas separadas e explicitamente disponíveis.
UPDATE public.services SET location='Maragogi, AL', image_url='/images/maragogi.jpg'
WHERE slug IN ('maragogi','antunes','barra-grande-al','xareu','sao-bento','piscinas-naturais-maragogi','passeio-de-lancha-maragogi','jet-ski-maragogi');

UPDATE public.services
SET name='Passeio de lancha em Maragogi',
    category='Náutico', kind='experience',
    short_description='Passeio de lancha em Maragogi para conhecer praias, recifes e bancos de areia, conforme maré, condições de navegação e áreas autorizadas.',
    tags='{lancha,nautico,natureza}'
WHERE slug='passeio-de-lancha-maragogi';

UPDATE public.services
SET name='Jet ski em Maragogi',
    category='Náutico', kind='experience',
    short_description='Experiência de jet ski em Maragogi, realizada em áreas permitidas e conforme as condições do mar e as regras do operador.',
    tags='{jet-ski,nautico,natureza}'
WHERE slug='jet-ski-maragogi';

-- Litoral Sul: corrigir municípios e evitar atribuições erradas.
UPDATE public.services SET location='Marechal Deodoro, AL', image_url='/images/praia-do-frances.jpg'
WHERE slug='praia-do-frances';

UPDATE public.services SET location='Barra de São Miguel, AL', image_url='/images/litoral-sul.jpg'
WHERE slug='barra-de-sao-miguel';

UPDATE public.services SET location='Roteiro, AL', image_url='/images/gunga.jpg'
WHERE slug='praia-do-gunga';

UPDATE public.services
SET location='Jequiá da Praia, AL',
    name='Dunas de Marapé',
    short_description='Complexo de Dunas de Marapé, em Jequiá da Praia, onde rio, mar e lagoa se encontram, com travessia de barco, dunas, manguezais e praias.'
WHERE slug='dunas-de-marape';

UPDATE public.services SET location='Jequiá da Praia, AL', image_url='/images/jequia.jpg'
WHERE slug IN ('jequia-da-praia','lagoa-de-jequia','trilha-dos-caetes','praia-jacarecica-do-sul','lagoa-azeda-jequia','passeio-barco-rio-jequia');

UPDATE public.services SET location='Coruripe, AL', image_url='/images/coruripe.jpg'
WHERE slug IN ('coruripe','pontal-do-coruripe');

UPDATE public.services SET location='Piaçabuçu, AL', image_url='/images/piacabucu.jpg'
WHERE slug IN ('piacabucu','foz-do-rio-sao-francisco-sul','passeio-barco-foz','passeio-lancha-foz','encontro-rio-mar-foz','dunas-foz','restinga-foz','coqueirais-foz','comunidades-tradicionais-foz','piacabucu-foz','roteiro-foz-piacabucu');

-- História e cultura: cada cidade com sua própria identidade visual.
UPDATE public.services SET location='Penedo, AL', image_url='/images/penedo.jpg'
WHERE slug IN ('penedo','centro-historico-penedo','rio-sao-francisco-penedo','passeio-lancha-penedo');
UPDATE public.services SET location='União dos Palmares, AL', image_url='/images/serra-da-barriga.jpg'
WHERE slug IN ('serra-da-barriga','uniao-dos-palmares','quilombo-dos-palmares');
UPDATE public.services SET location='Pão de Açúcar, AL', image_url='/images/ilha-do-ferro.jpg'
WHERE slug='ilha-do-ferro';

-- Sertão: imagens e municípios coerentes.
UPDATE public.services SET location='Piranhas, AL', image_url='/images/piranhas.jpg'
WHERE slug IN ('piranhas','rota-do-cangaco','centro-historico-piranhas','mirantes-sertao');
UPDATE public.services SET location='Canindé de São Francisco, SE', image_url='/images/canions-xingo.jpg'
WHERE slug IN ('canions-do-xingo','passeio-catamara-xingo','lancha-privativa-xingo','usina-de-xingo');
UPDATE public.services SET location='Olho d''Água do Casado, AL', image_url='/images/talhado.jpg'
WHERE slug IN ('gruta-do-talhado','paraiso-do-talhado','olho-dagua-do-casado');
UPDATE public.services SET location='Poço Redondo, SE', image_url='/images/sertao-canions.jpg'
WHERE slug='grota-do-angico';

-- Pernambuco: municípios e atrativos essenciais.
UPDATE public.services SET location='Ipojuca, PE', image_url='/images/porto-de-galinhas.jpg'
WHERE slug IN ('porto-de-galinhas','piscinas-naturais-porto-de-galinhas','jangada-porto-de-galinhas','buggy-porto-de-galinhas','barco-porto-de-galinhas','praias-porto-de-galinhas','privativos-porto-de-galinhas');
UPDATE public.services SET location='Tamandaré, PE', image_url='/images/carneiros.jpg'
WHERE slug IN ('praia-dos-carneiros','catamara-carneiros','barco-carneiros','igrejinha-carneiros','piscinas-naturais-carneiros','privativas-carneiros');
UPDATE public.services SET location='Recife, PE', image_url='/images/recife.jpg'
WHERE region='Recife';
UPDATE public.services SET location='Olinda, PE', image_url='/images/olinda.jpg'
WHERE region='Olinda';

-- City tours: descrições deixam claro o que realmente é visitado.
UPDATE public.services SET short_description='City tour por Maceió com orla de Pajuçara, Ponta Verde e Jatiúca, bairros históricos, artesanato e principais pontos culturais, conforme o roteiro contratado.' WHERE slug='city-tour-maceio';
UPDATE public.services SET short_description='Roteiro histórico e cultural pelo centro de Maceió, com igrejas, Teatro Deodoro, praças, casarões e equipamentos culturais, conforme horários de visita.' WHERE slug='tour-historico-cultural-maceio';
UPDATE public.services SET short_description='City tour pelo Recife Antigo, Marco Zero, pontes, mercados e principais referências históricas e culturais da capital pernambucana.' WHERE slug='city-tour-recife';
UPDATE public.services SET short_description='City tour pelo Centro Histórico de Olinda, com ladeiras, igrejas, mirantes, ateliês e patrimônio histórico.' WHERE slug='city-tour-olinda';

-- Corrige o nome antigo, caso tenha sido gravado em alguma versão anterior.
UPDATE public.services SET name='Dunas de Marapé' WHERE lower(name) LIKE '%joaquim%praia%';
