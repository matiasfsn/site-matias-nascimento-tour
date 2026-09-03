-- Final idempotent fixes for records that may already exist in the connected Supabase database.
UPDATE public.services
SET location = 'Paripueira, AL', region = 'Litoral Norte', image_url = '/images/paripueira.jpg'
WHERE lower(name) LIKE '%sonho verde%';

UPDATE public.services
SET location = 'Jequiá da Praia, AL', image_url = '/images/jequia.jpg', name = 'Dunas de Marapé'
WHERE slug = 'dunas-de-marape' OR lower(name) LIKE '%joaquim%praia%';

UPDATE public.services
SET location = 'Jequiá da Praia, AL', image_url = '/images/jequia.jpg'
WHERE slug IN ('jequia-da-praia','lagoa-de-jequia','trilha-dos-caetes','praia-jacarecica-do-sul','lagoa-azeda-jequia','passeio-barco-rio-jequia');

UPDATE public.services
SET location = 'Maragogi, AL', image_url = '/images/maragogi.jpg'
WHERE slug IN ('passeio-de-lancha-maragogi','jet-ski-maragogi');
