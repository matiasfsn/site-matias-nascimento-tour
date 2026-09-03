import { createFileRoute } from "@tanstack/react-router";
import { Instagram, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSettings, whatsappLink } from "@/lib/settings";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato | Fale com a MATIAS.NASCIMENTO.TOUR_AL" },
      {
        name: "description",
        content:
          "Fale com a nossa equipe pelo WhatsApp e receba um roteiro personalizado de passeios e transfers em Alagoas e Pernambuco.",
      },
      { property: "og:title", content: "Contato | MATIAS.NASCIMENTO.TOUR_AL" },
      {
        property: "og:description",
        content: "Atendimento personalizado pelo WhatsApp para passeios e transfers no Nordeste.",
      },
    ],
  }),
  component: ContatoPage,
});

const schema = z.object({
  name: z.string().trim().min(3, "Informe seu nome").max(120),
  whatsapp: z
    .string()
    .trim()
    .min(10, "Informe um WhatsApp válido com DDD")
    .max(20)
    .regex(/^[\d\s()+-]+$/, "Use apenas números e símbolos de telefone"),
  message: z.string().trim().min(5, "Escreva sua mensagem").max(800),
});

function ContatoPage() {
  const settings = useSettings();
  const [form, setForm] = useState({ name: "", whatsapp: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const flat: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!flat[key]) flat[key] = issue.message;
      }
      setErrors(flat);
      return;
    }
    setErrors({});
    const message = `Olá! Vim pelo site da *${settings.company_name}*.\n\n*Nome:* ${parsed.data.name}\n*WhatsApp:* ${parsed.data.whatsapp}\n\n${parsed.data.message}`;
    window.open(whatsappLink(settings.whatsapp_number, message), "_blank", "noopener,noreferrer");
    toast.success("Abrindo o WhatsApp com sua mensagem...");
  };

  return (
    <>
      <PageHero
        image="/images/litoral-sul.jpg"
        eyebrow="Contato"
        title="Solicitar atendimento"
        description="Conte o que você quer conhecer e a nossa equipe monta um roteiro sob medida para a sua viagem."
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-card"
          noValidate
        >
          <h2 className="font-display text-xl text-primary">Fale com a gente</h2>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contato-name">Nome</Label>
            <Input
              id="contato-name"
              maxLength={120}
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Seu nome"
            />
            {errors["name"] && <span className="text-xs text-destructive">{errors["name"]}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contato-whatsapp">WhatsApp</Label>
            <Input
              id="contato-whatsapp"
              inputMode="tel"
              maxLength={20}
              value={form.whatsapp}
              onChange={(event) => setForm({ ...form, whatsapp: event.target.value })}
              placeholder="(82) 90000-0000"
            />
            {errors["whatsapp"] && (
              <span className="text-xs text-destructive">{errors["whatsapp"]}</span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contato-message">Mensagem</Label>
            <Textarea
              id="contato-message"
              rows={5}
              maxLength={800}
              value={form.message}
              onChange={(event) => setForm({ ...form, message: event.target.value })}
              placeholder="Datas da viagem, destinos de interesse, quantidade de pessoas..."
            />
            {errors["message"] && (
              <span className="text-xs text-destructive">{errors["message"]}</span>
            )}
          </div>
          <Button type="submit" variant="hero" size="lg">
            <MessageCircle className="size-4" /> Enviar pelo WhatsApp
          </Button>
        </form>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-xl text-primary">Atendimento direto</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Respondemos pelo WhatsApp e pelo Instagram. Envie sua solicitação e receba o orçamento
              personalizado.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button variant="whatsapp" asChild>
                <a
                  href={whatsappLink(settings.whatsapp_number, settings.whatsapp_default_message)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="size-4" /> WhatsApp
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer">
                  <Instagram className="size-4" /> {settings.instagram_handle}
                </a>
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl">
            <img
              src="/images/foz-sao-francisco.jpg"
              alt="Foz do Rio São Francisco em Alagoas"
              loading="lazy"
              width={1280}
              height={853}
              className="aspect-[4/3] size-full object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
}
