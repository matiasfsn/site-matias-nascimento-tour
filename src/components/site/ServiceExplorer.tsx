import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

import { ServiceCard } from "@/components/site/ServiceCard";
import { ServiceDetailDialog } from "@/components/site/ServiceDetailDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { filterServices, servicesQuery, type Service } from "@/lib/services";
import { CATEGORIES, EXPERIENCE_TAGS, STATES } from "@/lib/site";
import { cn } from "@/lib/utils";

type Locked = {
  state?: "AL" | "PE";
  kind?: "tour" | "transfer" | "experience";
  region?: string;
};

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "cursor-pointer rounded-full border px-4 py-1.5 text-sm transition-all duration-200",
        active
          ? "border-transparent bg-navy text-white shadow-soft"
          : "border-border bg-background text-foreground/75 hover:border-aqua hover:text-primary",
      )}
    >
      {children}
    </button>
  );
}

export function ServiceExplorer({
  locked = {},
  regions,
  showTags = false,
  showCategories = true,
  showStates = true,
  title,
  description,
  emptyLabel = "Nenhum serviço encontrado com esses filtros.",
}: {
  locked?: Locked;
  regions?: readonly string[];
  showTags?: boolean;
  showCategories?: boolean;
  showStates?: boolean;
  title?: string;
  description?: string;
  emptyLabel?: string;
}) {
  const { data, isLoading } = useQuery(servicesQuery);
  const [search, setSearch] = useState("");
  const [state, setState] = useState<string>(locked.state ?? "");
  const [region, setRegion] = useState<string>(locked.region ?? "");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [detail, setDetail] = useState<Service | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const base = useMemo(() => {
    const services = data ?? [];
    return services.filter((service) => {
      if (locked.state && service.state !== locked.state) return false;
      if (locked.kind && service.kind !== locked.kind) return false;
      if (locked.region && service.region !== locked.region) return false;
      return true;
    });
  }, [data, locked.state, locked.kind, locked.region]);

  const availableRegions = useMemo(() => {
    if (regions) return regions.filter((item) => base.some((service) => service.region === item));
    return [...new Set(base.map((service) => service.region))];
  }, [regions, base]);

  const availableCategories = useMemo(
    () => CATEGORIES.filter((item) => base.some((service) => service.category === item)),
    [base],
  );

  const results = useMemo(
    () =>
      filterServices(base, {
        search,
        state: locked.state ? undefined : state || undefined,
        region: region || undefined,
        category: category || undefined,
        tags: tag ? [tag] : undefined,
      }),
    [base, search, state, region, category, tag, locked.state],
  );

  const hasFilters = Boolean(search || (!locked.state && state) || region || category || tag);

  const clearAll = () => {
    setSearch("");
    if (!locked.state) setState("");
    setRegion(locked.region ?? "");
    setCategory("");
    setTag("");
  };

  return (
    <div className="flex flex-col gap-8">
      {(title || description) && (
        <div className="flex flex-col gap-2">
          {title && <h2 className="font-display text-2xl text-primary sm:text-3xl">{title}</h2>}
          {description && <p className="max-w-2xl text-muted-foreground">{description}</p>}
        </div>
      )}

      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="O que você quer conhecer?"
              aria-label="O que você quer conhecer?"
              maxLength={80}
              className="h-11 rounded-full pl-9"
            />
          </div>
          <Button
            variant="outline"
            className="h-11 sm:w-auto"
            onClick={() => setShowFilters((current) => !current)}
          >
            <SlidersHorizontal className="size-4" />
            Filtros
          </Button>
          {hasFilters && (
            <Button variant="ghost" className="h-11" onClick={clearAll}>
              <X className="size-4" /> Limpar
            </Button>
          )}
        </div>

        <div className={cn("flex flex-col gap-4", !showFilters && "hidden sm:flex")}>
          {showStates && !locked.state && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs tracking-[0.16em] text-muted-foreground uppercase">Estado</span>
              <Chip active={!state} onClick={() => setState("")}>
                Todos
              </Chip>
              {STATES.map((item) => (
                <Chip
                  key={item.value}
                  active={state === item.value}
                  onClick={() => {
                    setState(item.value);
                    setRegion("");
                  }}
                >
                  {item.label}
                </Chip>
              ))}
            </div>
          )}

          {availableRegions.length > 1 && !locked.region && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs tracking-[0.16em] text-muted-foreground uppercase">Região</span>
              <Chip active={!region} onClick={() => setRegion("")}>
                Todas
              </Chip>
              {availableRegions.map((item) => (
                <Chip key={item} active={region === item} onClick={() => setRegion(item)}>
                  {item}
                </Chip>
              ))}
            </div>
          )}

          {showCategories && availableCategories.length > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs tracking-[0.16em] text-muted-foreground uppercase">Categoria</span>
              <Chip active={!category} onClick={() => setCategory("")}>
                Todas
              </Chip>
              {availableCategories.map((item) => (
                <Chip key={item} active={category === item} onClick={() => setCategory(item)}>
                  {item}
                </Chip>
              ))}
            </div>
          )}

          {showTags && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs tracking-[0.16em] text-muted-foreground uppercase">Tipo</span>
              <Chip active={!tag} onClick={() => setTag("")}>
                Todos
              </Chip>
              {EXPERIENCE_TAGS.map((item) => (
                <Chip key={item.value} active={tag === item.value} onClick={() => setTag(item.value)}>
                  {item.emoji} {item.label}
                </Chip>
              ))}
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-80 rounded-2xl" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
          {emptyLabel}
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {results.length} {results.length === 1 ? "opção disponível" : "opções disponíveis"}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((service) => (
              <ServiceCard key={service.id} service={service} onDetails={setDetail} />
            ))}
          </div>
        </>
      )}

      <ServiceDetailDialog
        service={detail}
        open={Boolean(detail)}
        onOpenChange={(open) => !open && setDetail(null)}
      />
    </div>
  );
}
