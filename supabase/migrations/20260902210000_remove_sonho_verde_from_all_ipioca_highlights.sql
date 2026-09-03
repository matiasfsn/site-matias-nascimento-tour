-- Ipioca must never show Praia de Sonho Verde as an attraction.
-- Clean any legacy Supabase rows by slug/name/location and remove the highlight
-- even when the old row is not using the expected slug.
UPDATE public.services
SET highlights = ARRAY(
  SELECT h
  FROM unnest(COALESCE(highlights, ARRAY[]::text[])) AS h
  WHERE lower(h) NOT LIKE '%sonho verde%'
)
WHERE lower(COALESCE(slug, '')) LIKE '%ipioca%'
   OR lower(COALESCE(name, '')) LIKE '%ipioca%'
   OR lower(COALESCE(location, '')) LIKE '%ipioca%';

-- If a legacy Ipioca row was itself incorrectly named Sonho Verde, deactivate it.
UPDATE public.services
SET is_active = false
WHERE lower(COALESCE(name, '')) LIKE '%sonho verde%'
  AND (
    lower(COALESCE(slug, '')) LIKE '%ipioca%'
    OR lower(COALESCE(location, '')) LIKE '%ipioca%'
  );
