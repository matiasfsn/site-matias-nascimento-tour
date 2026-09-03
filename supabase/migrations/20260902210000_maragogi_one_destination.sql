-- Maragogi is presented as one destination.
-- Its beaches remain described as attractions inside Maragogi instead of separate cards.
UPDATE public.services
SET is_active = false
WHERE slug IN ('antunes', 'barra-grande-al', 'xareu', 'sao-bento');

UPDATE public.services
SET
  name = 'Maragogi',
  location = 'Maragogi, AL',
  image_url = '/images/maragogi.jpg',
  short_description = 'Maragogi reúne praias como Antunes, Barra Grande, Xaréu e São Bento, além das famosas piscinas naturais.',
  description = 'Maragogi, no litoral norte de Alagoas, reúne diversas praias e experiências. Entre as principais atrações estão Praia de Antunes, Barra Grande, Praia de Xaréu, São Bento e as Piscinas Naturais de Maragogi.',
  highlights = ARRAY['Praia de Antunes', 'Barra Grande', 'Praia de Xaréu', 'São Bento', 'Piscinas Naturais de Maragogi'],
  tags = ARRAY['natureza','piscinas-naturais','snorkeling','nautico']
WHERE slug = 'maragogi';
