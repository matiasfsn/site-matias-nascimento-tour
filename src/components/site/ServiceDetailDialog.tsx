import { Check, MapPin, Plus, Tag } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCart } from "@/lib/cart";
import type { Service } from "@/lib/services";
import { EXPERIENCE_TAGS } from "@/lib/site";

export function ServiceDetailDialog({
  service,
  open,
  onOpenChange,
}: {
  service: Service | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { addItem, has } = useCart();
  if (!service) return null;

  const inCart = has(service.id);
  const images = [service.image_url, ...service.gallery].filter(Boolean).slice(0, 4);
  const tagLabels = service.tags
    .map((tag) => EXPERIENCE_TAGS.find((option) => option.value === tag))
    .filter(Boolean) as Array<{ label: string; emoji: string }>;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto rounded-2xl p-0">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <img
            src={service.image_url}
            alt={service.name}
            loading="lazy"
            width={1280}
            height={720}
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5">
            <span className="text-[0.65rem] tracking-[0.2em] text-sky uppercase">
              {service.state === "AL" ? "Alagoas" : "Pernambuco"} • {service.region}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-5 px-5 pb-6 sm:px-7">
          <DialogHeader className="gap-2 text-left">
            <DialogTitle className="font-display text-2xl text-primary sm:text-3xl">
              {service.name}
            </DialogTitle>
            <DialogDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4 text-aqua" />
                {service.location || service.region}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Tag className="size-4 text-aqua" />
                {service.category}
              </span>
            </DialogDescription>
          </DialogHeader>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {service.description || service.short_description}
          </p>

          {service.highlights.length > 0 && (
            <ul className="grid gap-2 sm:grid-cols-2">
              {service.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2 text-sm text-primary">
                  <Check className="mt-0.5 size-4 shrink-0 text-aqua" />
                  {highlight}
                </li>
              ))}
            </ul>
          )}

          {tagLabels.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tagLabels.map((tag) => (
                <Badge key={tag.label} variant="secondary" className="rounded-full font-normal">
                  {tag.emoji} {tag.label}
                </Badge>
              ))}
            </div>
          )}

          {images.length > 1 && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {images.map((image, index) => (
                <div key={`${image}-${index}`} className="overflow-hidden rounded-xl">
                  <img
                    src={image}
                    alt={`${service.name} — foto ${index + 1}`}
                    loading="lazy"
                    width={640}
                    height={426}
                    className="aspect-[4/3] size-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="rounded-xl border border-dashed border-border bg-secondary/60 p-4 text-sm text-muted-foreground">
            Os valores são personalizados de acordo com a data, o número de pessoas e o roteiro
            escolhido. Adicione ao carrinho e solicite seu orçamento pelo WhatsApp.
          </div>

          <Button
            variant={inCart ? "secondary" : "hero"}
            size="lg"
            onClick={() => {
              const added = addItem(service);
              toast.success(added ? "Adicionado ao seu roteiro" : "Já está no seu roteiro", {
                description: service.name,
              });
            }}
          >
            {inCart ? <Check className="size-4" /> : <Plus className="size-4" />}
            {inCart ? "Já está no seu roteiro" : "Adicionar ao carrinho"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
