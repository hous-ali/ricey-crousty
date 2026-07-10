
-- Fix search_path on trigger fn
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Tighten order insert policy (basic sanity: non-empty items array, positive total)
DROP POLICY "anyone can place order" ON public.orders;
CREATE POLICY "anyone can place order" ON public.orders FOR INSERT
  WITH CHECK (
    jsonb_typeof(items) = 'array'
    AND jsonb_array_length(items) > 0
    AND total >= 0
    AND length(customer_name) BETWEEN 1 AND 100
    AND length(phone) BETWEEN 4 AND 30
  );

-- Restrict function execution
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.claim_admin_bootstrap() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_admin_bootstrap() TO authenticated;
