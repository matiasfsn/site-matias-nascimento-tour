import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { adminServicesQuery, type Service } from "@/lib/services";
import { settingsQuery } from "@/lib/settings";
import { ALL_REGIONS, CATEGORIES, DEFAULT_SETTINGS, EXPERIENCE_TAGS } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel administrativo | MATIAS.NASCIMENTO.TOUR_AL" },
      {
        name: "description",
        content: "Gerencie passeios, transfers, experiências e configurações do site da agência.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Painel administrativo" },
      { property: "og:description", content: "Gestão de serviços e configurações." },
    ],
  }),
  component: AdminPage,
});

type Draft = {
  id?: string;
  slug: string;
  name: string;
  state: "AL" | "PE";
  region: string;
  category: string;
  kind: "tour" | "transfer" | "experience";
  location: string;
  short_description: string;
  description: string;
  image_url: string;
  gallery: string;
  highlights: string;
  tags: string[];
  sort_order: number;
  is_active: boolean;
};

const EMPTY_DRAFT: Draft = {
  slug: "",
  name: "",
  state: "AL",
  region: "Maceió",
  category: "Passeio",
  kind: "tour",
  location: "",
  short_description: "",
  description: "",
  image_url: "/images/maceio.jpg",
  gallery: "",
  highlights: "",
  tags: [],
  sort_order: 500,
  is_active: true,
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        setIsAdmin(false);
        return;
      }
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(Boolean(role));
    });
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    queryClient.clear();
    navigate({ to: "/" });
  };

  if (isAdmin === null) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <Skeleton className="h-40 rounded-2xl" />
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl text-primary">Acesso restrito</h1>
        <p className="text-sm text-muted-foreground">
          Sua conta não possui permissão de administrador. Solicite a liberação do acesso.
        </p>
        <Button variant="outline" onClick={signOut}>
          <LogOut className="size-4" /> Sair
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl text-primary">Painel administrativo</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie serviços, destinos e configurações do site.
          </p>
        </div>
        <Button variant="outline" onClick={signOut}>
          <LogOut className="size-4" /> Sair
        </Button>
      </div>

      <Tabs defaultValue="services" className="mt-8">
        <TabsList>
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>
        <TabsContent value="services" className="mt-6">
          <ServicesManager />
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <SettingsManager />
        </TabsContent>
      </Tabs>
    </section>
  );
}

function ServicesManager() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(adminServicesQuery);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [search, setSearch] = useState("");

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["services"] });
  };

  const save = useMutation({
    mutationFn: async (value: Draft) => {
      const payload = {
        slug: value.slug || slugify(value.name),
        name: value.name,
        state: value.state,
        region: value.region,
        category: value.category,
        kind: value.kind,
        location: value.location,
        short_description: value.short_description,
        description: value.description,
        image_url: value.image_url,
        gallery: value.gallery
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        highlights: value.highlights
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        tags: value.tags,
        sort_order: value.sort_order,
        is_active: value.is_active,
      };
      if (value.id) {
        const { error } = await supabase.from("services").update(payload).eq("id", value.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("services").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      invalidate();
      setDraft(null);
      toast.success("Serviço salvo");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Serviço excluído");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const toggle = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("services").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (error: Error) => toast.error(error.message),
  });

  const toDraft = (service: Service): Draft => ({
    id: service.id,
    slug: service.slug,
    name: service.name,
    state: service.state,
    region: service.region,
    category: service.category,
    kind: service.kind,
    location: service.location ?? "",
    short_description: service.short_description ?? "",
    description: service.description ?? "",
    image_url: service.image_url ?? "",
    gallery: (service.gallery ?? []).join("\n"),
    highlights: (service.highlights ?? []).join("\n"),
    tags: service.tags ?? [],
    sort_order: service.sort_order ?? 500,
    is_active: service.is_active ?? true,
  });

  const filtered = (data ?? []).filter((service) =>
    service.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar serviço"
          className="max-w-xs"
        />
        <Button variant="hero" onClick={() => setDraft({ ...EMPTY_DRAFT })}>
          <Plus className="size-4" /> Novo serviço
        </Button>
        <span className="text-sm text-muted-foreground">{filtered.length} serviços</span>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 rounded-2xl" />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/70 text-left">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="hidden px-4 py-3 sm:table-cell">Região</th>
                <th className="hidden px-4 py-3 md:table-cell">Categoria</th>
                <th className="px-4 py-3">Ativo</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((service) => (
                <tr key={service.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-primary">{service.name}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    {service.region}
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                    {service.category}
                  </td>
                  <td className="px-4 py-3">
                    <Switch
                      checked={service.is_active ?? true}
                      onCheckedChange={(checked) =>
                        toggle.mutate({ id: service.id, is_active: checked })
                      }
                      aria-label={`Ativar ${service.name}`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Editar"
                        onClick={() => setDraft(toDraft(service))}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Excluir"
                        onClick={() => {
                          if (window.confirm(`Excluir "${service.name}"?`)) {
                            remove.mutate(service.id);
                          }
                        }}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={Boolean(draft)} onOpenChange={(open) => !open && setDraft(null)}>
        <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-primary">
              {draft?.id ? "Editar serviço" : "Novo serviço"}
            </DialogTitle>
          </DialogHeader>
          {draft && (
            <form
              className="flex flex-col gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                if (!draft.name.trim()) {
                  toast.error("Informe o nome do serviço");
                  return;
                }
                save.mutate(draft);
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="a-name">Nome</Label>
                  <Input
                    id="a-name"
                    value={draft.name}
                    maxLength={160}
                    onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="a-location">Localização</Label>
                  <Input
                    id="a-location"
                    value={draft.location}
                    maxLength={160}
                    onChange={(event) => setDraft({ ...draft, location: event.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="a-state">Estado</Label>
                  <select
                    id="a-state"
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={draft.state}
                    onChange={(event) =>
                      setDraft({ ...draft, state: event.target.value as Draft["state"] })
                    }
                  >
                    <option value="AL">Alagoas</option>
                    <option value="PE">Pernambuco</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="a-region">Região</Label>
                  <select
                    id="a-region"
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={draft.region}
                    onChange={(event) => setDraft({ ...draft, region: event.target.value })}
                  >
                    {ALL_REGIONS.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="a-kind">Tipo</Label>
                  <select
                    id="a-kind"
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={draft.kind}
                    onChange={(event) =>
                      setDraft({ ...draft, kind: event.target.value as Draft["kind"] })
                    }
                  >
                    <option value="tour">Passeio</option>
                    <option value="experience">Experiência</option>
                    <option value="transfer">Transfer</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="a-category">Categoria</Label>
                  <select
                    id="a-category"
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={draft.category}
                    onChange={(event) => setDraft({ ...draft, category: event.target.value })}
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="a-order">Ordem</Label>
                  <Input
                    id="a-order"
                    type="number"
                    value={draft.sort_order}
                    onChange={(event) =>
                      setDraft({ ...draft, sort_order: Number(event.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="a-image">Imagem principal (URL)</Label>
                <Input
                  id="a-image"
                  value={draft.image_url}
                  onChange={(event) => setDraft({ ...draft, image_url: event.target.value })}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="a-gallery">Galeria (uma URL por linha)</Label>
                <Textarea
                  id="a-gallery"
                  rows={3}
                  value={draft.gallery}
                  onChange={(event) => setDraft({ ...draft, gallery: event.target.value })}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="a-short">Descrição curta</Label>
                <Textarea
                  id="a-short"
                  rows={2}
                  maxLength={280}
                  value={draft.short_description}
                  onChange={(event) => setDraft({ ...draft, short_description: event.target.value })}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="a-desc">Descrição completa</Label>
                <Textarea
                  id="a-desc"
                  rows={4}
                  value={draft.description}
                  onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="a-highlights">Informações / destaques (um por linha)</Label>
                <Textarea
                  id="a-highlights"
                  rows={3}
                  value={draft.highlights}
                  onChange={(event) => setDraft({ ...draft, highlights: event.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Tipos de experiência</Label>
                <div className="flex flex-wrap gap-2">
                  {EXPERIENCE_TAGS.map((tag) => {
                    const active = draft.tags.includes(tag.value);
                    return (
                      <button
                        key={tag.value}
                        type="button"
                        onClick={() =>
                          setDraft({
                            ...draft,
                            tags: active
                              ? draft.tags.filter((item) => item !== tag.value)
                              : [...draft.tags, tag.value],
                          })
                        }
                        className={
                          active
                            ? "cursor-pointer rounded-full bg-navy px-3 py-1 text-xs text-white"
                            : "cursor-pointer rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                        }
                      >
                        {tag.emoji} {tag.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  id="a-active"
                  checked={draft.is_active}
                  onCheckedChange={(checked) => setDraft({ ...draft, is_active: checked })}
                />
                <Label htmlFor="a-active">Serviço ativo no site</Label>
              </div>

              <Button type="submit" variant="hero" size="lg" disabled={save.isPending}>
                Salvar serviço
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

const SETTING_LABELS: Record<string, string> = {
  whatsapp_number: "WhatsApp (somente números, com 55)",
  whatsapp_default_message: "Mensagem inicial do WhatsApp",
  instagram_url: "Link do Instagram",
  instagram_handle: "@ do Instagram",
  company_name: "Nome da agência",
  company_tagline: "Slogan",
  about_text: "Texto sobre a agência",
  cnpj: "CNPJ",
  legal_name: "Razão social",
  address: "Endereço",
  legal_info: "Informações legais",
};

function SettingsManager() {
  const queryClient = useQueryClient();
  const { data } = useQuery(settingsQuery);
  const [values, setValues] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    if (data && !values) setValues({ ...data });
  }, [data, values]);

  const save = useMutation({
    mutationFn: async (payload: Record<string, string>) => {
      const rows = Object.entries(payload).map(([key, value]) => ({ key, value }));
      const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast.success("Configurações salvas");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (!values) return <Skeleton className="h-64 rounded-2xl" />;

  return (
    <form
      className="flex max-w-2xl flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        save.mutate(values);
      }}
    >
      {Object.keys(DEFAULT_SETTINGS).map((key) => {
        const isLong = key === "about_text" || key === "legal_info";
        return (
          <div key={key} className="flex flex-col gap-1.5">
            <Label htmlFor={`s-${key}`}>{SETTING_LABELS[key] ?? key}</Label>
            {isLong ? (
              <Textarea
                id={`s-${key}`}
                rows={4}
                value={values[key] ?? ""}
                onChange={(event) => setValues({ ...values, [key]: event.target.value })}
              />
            ) : (
              <Input
                id={`s-${key}`}
                value={values[key] ?? ""}
                onChange={(event) => setValues({ ...values, [key]: event.target.value })}
              />
            )}
          </div>
        );
      })}
      <Button type="submit" variant="hero" size="lg" disabled={save.isPending}>
        Salvar configurações
      </Button>
    </form>
  );
}
