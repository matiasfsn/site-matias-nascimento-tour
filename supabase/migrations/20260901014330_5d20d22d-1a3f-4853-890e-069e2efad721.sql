-- Remove the security-definer view
DROP VIEW IF EXISTS public.public_services;

-- Move internal price into an admin-only table
ALTER TABLE public.services DROP COLUMN internal_price;

CREATE TABLE public.service_prices (
  service_id uuid PRIMARY KEY REFERENCES public.services(id) ON DELETE CASCADE,
  price numeric,
  notes text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_prices TO authenticated;
GRANT ALL ON public.service_prices TO service_role;
ALTER TABLE public.service_prices ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER service_prices_updated_at
BEFORE UPDATE ON public.service_prices
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- has_role as SECURITY INVOKER (users can read their own roles via RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

CREATE POLICY "Admins manage service prices"
ON public.service_prices FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Public read of active services (price no longer lives on this table)
CREATE POLICY "Anyone can view active services"
ON public.services FOR SELECT TO anon, authenticated
USING (is_active = true);

GRANT SELECT ON public.services TO anon;