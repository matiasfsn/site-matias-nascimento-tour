import { Check, MapPin, Plus } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import type { Service } from "@/lib/services";

export function ServiceCard({
  service,
  onDetails,
}: {
  service: Service;
  onDetails: (service: Service) => void;
}) {
  const { addItem, has } = useCart();
  const inCart = has(service.id);

  const handleAdd = () => {
    const added = addItem(service);
    toast.success(added ? "Adicionado ao seu roteiro" : "Já está no seu roteiro", {
      description: service.name,
    });
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      <button
        type="button"
        onClick={() => onDetails(service)}
        className="relative block aspect-[4/3] w-full overflow-hidden"
        aria-label={`Ver detalhes de ${service.name}`}
      >
        <img
          src={service.image_url}
          alt={service.name}
          loading="lazy"
          width={1280}
          height={853}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy/70 to-transparent" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge className="border-0 bg-white/90 text-[0.65rem] tracking-wide text-primary uppercase">
            {service.category}
          </Badge>
        </div>
        <span className="absolute bottom-3 left-3 flex items-center gap-1 text-xs font-medium text-white">
          <MapPin className="size-3.5" />
          {service.location || service.region}
        </span>
      </button>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-col gap-1">
          <span className="text-[0.65rem] tracking-[0.18em] text-aqua uppercase">
            {service.state === "AL" ? "Alagoas" : "Pernambuco"} • {service.region}
          </span>
          <h3 className="font-display text-lg leading-snug text-primary">{service.name}</h3>
        </div>
        <p className="line-clamp-3 flex-1 text-sm text-muted-foreground">{service.short_description}</p>

        <div className="mt-1 flex flex-wrap gap-2">
          <Button variant={inCart ? "secondary" : "aqua"} size="sm" onClick={handleAdd} className="flex-1">
            {inCart ? <Check className="size-4" /> : <Plus className="size-4" />}
            {inCart ? "No roteiro" : "Adicionar ao carrinho"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDetails(service)}>
            Ver detalhes
          </Button>
        </div>
      </div>
    </article>
  );
}
