import { Link } from "@tanstack/react-router";
import { Menu, MessageCircle, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

import { CartSheet } from "@/components/site/CartSheet";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { useSettings, whatsappLink } from "@/lib/settings";
import { NAV_LINKS } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const { count, lastAddedAt } = useCart();
  const settings = useSettings();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!lastAddedAt) return;
    setPulse(true);
    const timeout = window.setTimeout(() => setPulse(false), 600);
    return () => window.clearTimeout(timeout);
  }, [lastAddedAt]);

  const whatsapp = whatsappLink(settings.whatsapp_number, settings.whatsapp_default_message);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-border bg-background/90 backdrop-blur-lg shadow-soft"
            : "bg-background/70 backdrop-blur-md",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6 lg:px-8">
          <Logo />

          <nav className="hidden items-center gap-1 xl:flex" aria-label="Navegação principal">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
                activeOptions={{ exact: link.to === "/" }}
                activeProps={{ className: "bg-secondary text-primary" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className={cn("relative", pulse && "animate-cart-pop")}
              onClick={() => setCartOpen(true)}
              aria-label={`Carrinho com ${count} ${count === 1 ? "serviço" : "serviços"}`}
            >
              <ShoppingCart className="size-4" />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-sun text-[0.65rem] font-bold text-sun-foreground">
                  {count}
                </span>
              )}
            </Button>

            <Button variant="whatsapp" size="sm" asChild className="hidden sm:inline-flex">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" />
                Falar no WhatsApp
              </a>
            </Button>

            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="xl:hidden" aria-label="Abrir menu">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[86vw] max-w-xs">
                <SheetHeader className="text-left">
                  <SheetTitle className="font-display text-primary">Navegar</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-1" aria-label="Navegação mobile">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMenuOpen(false)}
                      className="rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary hover:text-primary"
                      activeOptions={{ exact: link.to === "/" }}
                      activeProps={{ className: "bg-secondary text-primary" }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-6 flex flex-col gap-2">
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={() => {
                      setMenuOpen(false);
                      setCartOpen(true);
                    }}
                  >
                    <ShoppingCart className="size-4" /> Meu roteiro ({count})
                  </Button>
                  <Button variant="whatsapp" size="lg" asChild>
                    <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="size-4" /> Falar no WhatsApp
                    </a>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
