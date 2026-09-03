import { queryOptions, useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/site";

async function fetchSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase.from("site_settings").select("key, value");
  if (error) throw error;

  const merged: SiteSettings = { ...DEFAULT_SETTINGS };
  for (const row of data ?? []) {
    if (row.key in merged && row.value) {
      merged[row.key as keyof SiteSettings] = row.value;
    }
  }
  return merged;
}

export const settingsQuery = queryOptions({
  queryKey: ["site-settings"],
  queryFn: fetchSettings,
  staleTime: 10 * 60 * 1000,
});

export function useSettings(): SiteSettings {
  const { data } = useQuery(settingsQuery);
  return data ?? { ...DEFAULT_SETTINGS };
}

const sanitizeNumber = (value: string) => value.replace(/\D/g, "");

export function whatsappLink(number: string, message: string) {
  const digits = sanitizeNumber(number) || sanitizeNumber(DEFAULT_SETTINGS.whatsapp_number);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message.slice(0, 3500))}`;
}
