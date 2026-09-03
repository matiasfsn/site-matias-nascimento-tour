-- Sonho Verde belongs to Paripueira, never Ipioca.
-- Remove legacy database rows that incorrectly associate Sonho Verde with Ipioca.
DELETE FROM public.services
WHERE lower(name) LIKE '%sonho verde%'
  AND lower(location) LIKE '%ipioca%';

UPDATE public.services
SET location = 'Paripueira, AL',
    region = 'Litoral Norte',
    image_url = '/images/paripueira.jpg'
WHERE lower(name) LIKE '%sonho verde%';
