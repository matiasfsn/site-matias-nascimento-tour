import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

export function Logo({
  className,
  variant = "default",
  showTagline = true,
}: {
  className?: string;
  variant?: "default" | "light";
  showTagline?: boolean;
}) {
  return (
    <Link to="/" className={cn("group flex items-center gap-3", className)} aria-label="Página inicial">
      <span
        className={cn(
          "relative flex h-12 w-40 shrink-0 items-center justify-start overflow-hidden rounded-xl sm:h-14 sm:w-48",
          variant === "light" ? "bg-white px-2 py-1.5" : "bg-transparent",
        )}
      >
        <img
          src="/images/logo-mn-custom.png"
          alt="Logo MATIAS.NASCIMENTO.TOUR_AL"
          width={3840}
          height={2177}
          className="h-full w-full object-contain object-center"
        />
      </span>
    </Link>
  );
}
