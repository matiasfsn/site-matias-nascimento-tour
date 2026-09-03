import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { servicesQuery } from "@/lib/services";
import { AL_REGIONS, PE_REGIONS, REGION_DESCRIPTIONS, REGION_IMAGES } from "@/lib/site";
import { cn } from "@/lib/utils";

const POINTS: Array<{ region: string; x: number; y: number; state: "AL" | "PE" }> = [
  { region: "Recife", x: 74, y: 12, state: "PE" },
  { region: "Olinda", x: 78, y: 7, state: "PE" },
  { region: "Porto de Galinhas", x: 68, y: 22, state: "PE" },
  { region: "Praia dos Carneiros", x: 63, y: 30, state: "PE" },
  { region: "Litoral Norte", x: 55, y: 43, state: "AL" },
  { region: "Maceió", x: 47, y: 57, state: "AL" },
  { region: "Litoral Sul", x: 38, y: 68, state: "AL" },
  { region: "Foz do São Francisco", x: 27, y: 79, state: "AL" },
  { region: "História & Cultura", x: 18, y: 68, state: "AL" },
  { region: "Sertão & Cânions", x: 8, y: 54, state: "AL" },
];

export function DestinationsMap() {
  const { data } = useQuery(servicesQuery);
  const [active, setActive] = useState("Maceió");

  const services = (data ?? []).filter((service) => service.region === active).slice(0, 6);
  const isAl = AL_REGIONS.includes(active as (typeof AL_REGIONS)[number]);
  const total = (data ?? []).filter((service) => service.region === active).length;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-stretch">
      <div className="relative overflow-hidden rounded-3xl bg-[image:var(--gradient-deep)] p-6 shadow-card sm:p-8">
        <div className="flex flex-wrap gap-4 text-xs text-white/70">
          <span className="inline-flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-sun" /> Alagoas
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-sky" /> Pernambuco
          </span>
        </div>

        <div className="relative mt-6 aspect-[4/3] w-full">
          <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden>
            <path
              d="M96,2 C82,16 70,26 58,38 C46,50 34,62 22,72 C14,79 8,86 2,96"
              fill="none"
              stroke="var(--sky)"
              strokeOpacity="0.45"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
          </svg>
          {POINTS.map((point) => (
            <button
              key={point.region}
              type="button"
              onClick={() => setActive(point.region)}
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full px-2.5 py-1 text-[0.62rem] font-medium whitespace-nowrap transition-all duration-300",
                active === point.region
                  ? "z-10 scale-110 bg-white text-navy shadow-glow"
                  : point.state === "AL"
                    ? "bg-sun/85 text-sun-foreground hover:scale-105"
                    : "bg-sky/85 text-navy hover:scale-105",
              )}
              aria-pressed={active === point.region}
            >
              <MapPin className="mr-1 inline size-3" />
              {point.region}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
        <div className="overflow-hidden rounded-2xl">
          <img
            src={REGION_IMAGES[active] ?? "/images/maceio.jpg"}
            alt={active}
            loading="lazy"
            width={1280}
            height={720}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
        <div>
          <span className="text-[0.65rem] tracking-[0.2em] text-aqua uppercase">
            {isAl ? "Alagoas" : "Pernambuco"}
          </span>
          <h3 className="font-display mt-1 text-2xl text-primary">{active}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{REGION_DESCRIPTIONS[active]}</p>
        </div>
        {services.length > 0 && (
          <ul className="flex flex-col gap-1.5 text-sm text-foreground/85">
            {services.map((service) => (
              <li key={service.id} className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-sun" />
                {service.name}
              </li>
            ))}
          </ul>
        )}
        <Button variant="aqua" asChild className="mt-auto w-fit">
          <Link to={isAl ? "/alagoas" : "/pernambuco"}>
            Ver {total > 0 ? `${total} opções` : "opções"} em {active}
          </Link>
        </Button>
      </div>
    </div>
  );
}

export const MAP_REGIONS = [...AL_REGIONS, ...PE_REGIONS];
