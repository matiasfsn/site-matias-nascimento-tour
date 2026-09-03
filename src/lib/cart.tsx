import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Service } from "@/lib/services";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  region: string;
  state: "AL" | "PE";
  category: string;
  kind: string;
  location: string;
  image_url: string;
  date: string;
  people: number;
  notes: string;
};

export type CustomerData = {
  name: string;
  whatsapp: string;
  email: string;
  date: string;
  adults: number;
  children: number;
  hotel: string;
  city: string;
  notes: string;
};

export const EMPTY_CUSTOMER: CustomerData = {
  name: "",
  whatsapp: "",
  email: "",
  date: "",
  adults: 2,
  children: 0,
  hotel: "",
  city: "",
  notes: "",
};

const STORAGE_KEY = "mn-tour-cart-v1";

type CartContextValue = {
  items: CartItem[];
  count: number;
  lastAddedAt: number;
  addItem: (service: Service) => boolean;
  updateItem: (id: string, patch: Partial<Pick<CartItem, "date" | "people" | "notes">>) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [lastAddedAt, setLastAddedAt] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      /* carrinho inválido é simplesmente ignorado */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* armazenamento indisponível */
    }
  }, [items, hydrated]);

  const addItem = useCallback((service: Service) => {
    let added = false;
    setItems((current) => {
      if (current.some((item) => item.id === service.id)) return current;
      added = true;
      return [
        ...current,
        {
          id: service.id,
          slug: service.slug,
          name: service.name,
          region: service.region,
          state: service.state,
          category: service.category,
          kind: service.kind,
          location: service.location,
          image_url: service.image_url,
          date: "",
          people: 2,
          notes: "",
        },
      ];
    });
    setLastAddedAt(Date.now());
    return added;
  }, []);

  const updateItem = useCallback<CartContextValue["updateItem"]>((id, patch) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.length,
      lastAddedAt,
      addItem,
      updateItem,
      removeItem,
      clear,
      has: (id: string) => items.some((item) => item.id === id),
    }),
    [items, lastAddedAt, addItem, updateItem, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart precisa estar dentro de CartProvider");
  return context;
}

function formatDate(value: string) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

export function buildQuoteMessage(
  items: CartItem[],
  customer: CustomerData,
  companyName: string,
): string {
  const people = customer.adults + customer.children;
  const peopleLabel =
    customer.children > 0
      ? `${people} (${customer.adults} adultos e ${customer.children} crianças)`
      : `${people} adultos`;

  const lines: string[] = [
    `Olá! Vim pelo site da *${companyName}* e gostaria de solicitar um orçamento.`,
    "",
    `*Nome:* ${customer.name || "-"}`,
    `*WhatsApp:* ${customer.whatsapp || "-"}`,
  ];

  if (customer.email) lines.push(`*E-mail:* ${customer.email}`);
  lines.push(`*Data desejada:* ${formatDate(customer.date) || "a definir"}`);
  lines.push(`*Quantidade de pessoas:* ${peopleLabel}`);
  lines.push(`*Hospedagem:* ${customer.hotel || "-"}`);
  if (customer.city) lines.push(`*Cidade:* ${customer.city}`);

  lines.push("", "*Serviços selecionados:*");
  for (const item of items) {
    const details = [
      formatDate(item.date) ? `data ${formatDate(item.date)}` : null,
      `${item.people} pessoa${item.people > 1 ? "s" : ""}`,
      item.notes ? `obs: ${item.notes}` : null,
    ].filter(Boolean);
    lines.push(`• ${item.name} — ${item.region} (${details.join(" • ")})`);
  }

  if (customer.notes) {
    lines.push("", "*Observações:*", customer.notes);
  }

  lines.push("", "Gostaria de verificar disponibilidade e receber o orçamento.");
  return lines.join("\n");
}
