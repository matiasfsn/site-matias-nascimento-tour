import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { buildQuoteMessage, EMPTY_CUSTOMER, useCart, type CustomerData } from "@/lib/cart";
import { useSettings, whatsappLink } from "@/lib/settings";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title: "Meu roteiro | Solicitar orçamento — MATIAS.NASCIMENTO.TOUR_AL" },
      {
        name: "description",
        content:
          "Revise os passeios, experiências e transfers escolhidos, informe seus dados e solicite o orçamento pelo WhatsApp.",
      },
      { property: "og:title", content: "Meu roteiro | Solicitar orçamento" },
      {
        property: "og:description",
        content: "Monte seu roteiro em Alagoas e Pernambuco e receba o orçamento pelo WhatsApp.",
      },
    ],
  }),
  component: CarrinhoPage,
});

const schema = z.object({
  name: z.string().trim().min(3, "Informe seu nome completo").max(120),
  whatsapp: z
    .string()
    .trim()
    .min(10, "Informe um WhatsApp válido com DDD")
    .max(20)
    .regex(/^[\d\s()+-]+$/, "Use apenas números e símbolos de telefone"),
  email: z.union([z.string().trim().email("E-mail inválido").max(255), z.literal("")]),
  date: z.string().max(20),
  adults: z.number().min(1, "Informe ao menos 1 adulto").max(60),
  children: z.number().min(0).max(60),
  hotel: z.string().trim().max(160),
  city: z.string().trim().max(120),
  notes: z.string().trim().max(800),
});

function CarrinhoPage() {
  const { items, updateItem, removeItem, clear } = useCart();
  const settings = useSettings();
  const [customer, setCustomer] = useState<CustomerData>(EMPTY_CUSTOMER);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof CustomerData>(key: K, value: CustomerData[K]) =>
    setCustomer((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = schema.safeParse(customer);
    if (!parsed.success) {
      const flat: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!flat[key]) flat[key] = issue.message;
      }
      setErrors(flat);
      toast.error("Revise os campos destacados antes de continuar.");
      return;
    }
    setErrors({});
    const message = buildQuoteMessage(items, parsed.data as CustomerData, settings.company_name);
    window.open(whatsappLink(settings.whatsapp_number, message), "_blank", "noopener,noreferrer");
    toast.success("Abrindo o WhatsApp com seu roteiro...");
  };

  if (items.length === 0) {
    return (
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-4 py-24 text-center sm:px-6">
        <ShoppingCart className="size-12 text-muted-foreground/50" />
        <h1 className="text-3xl text-primary">Seu roteiro está vazio</h1>
        <p className="text-muted-foreground">
          Escolha passeios, experiências e transfers em Alagoas e Pernambuco para montar seu roteiro
          e solicitar o orçamento.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="hero" size="lg" asChild>
            <Link to="/passeios">Explorar passeios</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/transfers">Ver transfers</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <Link
        to="/passeios"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" /> Continuar escolhendo
      </Link>

      <h1 className="mt-4 text-3xl text-primary sm:text-4xl">Meu roteiro</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Informe a data e a quantidade de pessoas de cada serviço, preencha seus dados e envie a
        solicitação. Você recebe o orçamento personalizado pelo WhatsApp.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft sm:flex-row"
            >
              <img
                src={item.image_url}
                alt={item.name}
                loading="lazy"
                width={320}
                height={320}
                className="h-32 w-full shrink-0 rounded-xl object-cover sm:size-32"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[0.65rem] tracking-[0.18em] text-aqua uppercase">
                      {item.state === "AL" ? "Alagoas" : "Pernambuco"} • {item.region}
                    </span>
                    <h2 className="font-display text-lg text-primary">{item.name}</h2>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
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

                <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_120px]">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor={`cart-date-${item.id}`}>Data</Label>
                    <Input
                      id={`cart-date-${item.id}`}
                      type="date"
                      value={item.date}
                      onChange={(event) => updateItem(item.id, { date: event.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor={`cart-people-${item.id}`}>Pessoas</Label>
                    <Input
                      id={`cart-people-${item.id}`}
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
                <div className="mt-3 flex flex-col gap-1">
                  <Label htmlFor={`cart-notes-${item.id}`}>Observações</Label>
                  <Textarea
                    id={`cart-notes-${item.id}`}
                    rows={2}
                    maxLength={300}
                    placeholder="Ex.: preferência de horário, ponto de encontro..."
                    value={item.notes}
                    onChange={(event) => updateItem(item.id, { notes: event.target.value })}
                  />
                </div>
              </div>
            </article>
          ))}

          <Button variant="ghost" size="sm" className="w-fit" onClick={clear}>
            Limpar roteiro
          </Button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6 lg:sticky lg:top-28"
          noValidate
        >
          <h2 className="font-display text-xl text-primary">Dados do cliente</h2>

          <Field label="Nome completo" id="name" error={errors["name"]}>
            <Input
              id="name"
              value={customer.name}
              maxLength={120}
              onChange={(event) => set("name", event.target.value)}
              placeholder="Seu nome"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="WhatsApp" id="whatsapp" error={errors["whatsapp"]}>
              <Input
                id="whatsapp"
                inputMode="tel"
                maxLength={20}
                value={customer.whatsapp}
                onChange={(event) => set("whatsapp", event.target.value)}
                placeholder="(82) 90000-0000"
              />
            </Field>
            <Field label="E-mail (opcional)" id="email" error={errors["email"]}>
              <Input
                id="email"
                type="email"
                maxLength={255}
                value={customer.email}
                onChange={(event) => set("email", event.target.value)}
                placeholder="voce@email.com"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Data desejada" id="date" error={errors["date"]}>
              <Input
                id="date"
                type="date"
                value={customer.date}
                onChange={(event) => set("date", event.target.value)}
              />
            </Field>
            <Field label="Adultos" id="adults" error={errors["adults"]}>
              <Input
                id="adults"
                type="number"
                min={1}
                max={60}
                value={customer.adults}
                onChange={(event) => set("adults", Number(event.target.value) || 0)}
              />
            </Field>
            <Field label="Crianças" id="children" error={errors["children"]}>
              <Input
                id="children"
                type="number"
                min={0}
                max={60}
                value={customer.children}
                onChange={(event) => set("children", Number(event.target.value) || 0)}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Hotel ou hospedagem" id="hotel" error={errors["hotel"]}>
              <Input
                id="hotel"
                maxLength={160}
                value={customer.hotel}
                onChange={(event) => set("hotel", event.target.value)}
                placeholder="Nome do hotel / pousada"
              />
            </Field>
            <Field label="Cidade" id="city" error={errors["city"]}>
              <Input
                id="city"
                maxLength={120}
                value={customer.city}
                onChange={(event) => set("city", event.target.value)}
                placeholder="Maceió, Recife..."
              />
            </Field>
          </div>

          <Field label="Observações" id="notes" error={errors["notes"]}>
            <Textarea
              id="notes"
              rows={3}
              maxLength={800}
              value={customer.notes}
              onChange={(event) => set("notes", event.target.value)}
              placeholder="Conte detalhes que ajudem a montar seu roteiro"
            />
          </Field>

          <div className="rounded-xl bg-secondary/70 p-4">
            <h3 className="font-display text-base text-primary">Seu roteiro</h3>
            <ul className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
              {items.map((item) => (
                <li key={item.id} className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-sun" />
                  <span>
                    {item.name}
                    <span className="text-xs"> — {item.people} pessoa(s)</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Button type="submit" variant="hero" size="xl" className="w-full">
            <MessageCircle className="size-5" /> Solicitar orçamento pelo WhatsApp
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Sem valores no site: o orçamento é personalizado conforme data, roteiro e número de
            pessoas.
          </p>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
