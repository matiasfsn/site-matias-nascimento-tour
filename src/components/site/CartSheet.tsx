import { Link } from "@tanstack/react-router";
import { ShoppingCart, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/lib/cart";

export function CartSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { items, updateItem, removeItem, clear } = useCart();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 py-4 text-left">
          <SheetTitle className="font-display flex items-center gap-2 text-xl text-primary">
            <ShoppingCart className="size-5 text-aqua" /> Meu roteiro
          </SheetTitle>
          <SheetDescription>
            Monte quantos serviços quiser. O orçamento é enviado pelo WhatsApp.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
              <ShoppingCart className="size-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Seu roteiro está vazio. Escolha passeios, experiências e transfers para começar.
              </p>
              <Button variant="aqua" asChild onClick={() => onOpenChange(false)}>
                <Link to="/passeios">Explorar passeios</Link>
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li key={item.id} className="rounded-xl border border-border bg-card p-3 shadow-soft">
                  <div className="flex gap-3">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      loading="lazy"
                      width={160}
                      height={160}
                      className="size-16 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-primary">{item.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {item.region} • {item.category}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Remover ${item.name}`}
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <Label htmlFor={`date-${item.id}`} className="text-xs">
                        Data
                      </Label>
                      <Input
                        id={`date-${item.id}`}
                        type="date"
                        value={item.date}
                        onChange={(event) => updateItem(item.id, { date: event.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label htmlFor={`people-${item.id}`} className="text-xs">
                        Pessoas
                      </Label>
                      <Input
                        id={`people-${item.id}`}
                        type="number"
                        min={1}
                        max={60}
                        value={item.people}
                        onChange={(event) =>
                          updateItem(item.id, { people: Math.max(1, Number(event.target.value) || 1) })
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-2 flex flex-col gap-1">
                    <Label htmlFor={`notes-${item.id}`} className="text-xs">
                      Observações
                    </Label>
                    <Textarea
                      id={`notes-${item.id}`}
                      rows={2}
                      maxLength={300}
                      placeholder="Ex.: saída pela manhã, buscar no hotel..."
                      value={item.notes}
                      onChange={(event) => updateItem(item.id, { notes: event.target.value })}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="flex flex-col gap-2 border-t border-border px-5 py-4">
            <Button variant="hero" size="lg" asChild onClick={() => onOpenChange(false)}>
              <Link to="/carrinho">Revisar e solicitar orçamento</Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={clear}>
              Limpar roteiro
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
