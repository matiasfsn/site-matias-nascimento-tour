import { cn } from "@/lib/utils";

/** Onda decorativa inspirada na logo. */
export function WaveDivider({
  className,
  flip = false,
  tone = "background",
}: {
  className?: string;
  flip?: boolean;
  tone?: "background" | "sand" | "navy";
}) {
  const fill =
    tone === "navy" ? "var(--navy)" : tone === "sand" ? "var(--sand)" : "var(--background)";

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none w-full overflow-hidden leading-[0]", flip && "rotate-180", className)}
    >
      <svg
        viewBox="0 0 1440 110"
        preserveAspectRatio="none"
        className="h-[46px] w-full sm:h-[70px]"
        role="presentation"
      >
        <path
          d="M0,64 C240,120 420,8 720,40 C1020,72 1200,112 1440,58 L1440,110 L0,110 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

/** Ondas animadas usadas no fundo do hero. */
export function AnimatedWaves({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-x-0 bottom-0", className)}>
      <div className="relative h-24 w-full overflow-hidden sm:h-32">
        <svg
          viewBox="0 0 2880 120"
          preserveAspectRatio="none"
          className="animate-wave-drift absolute bottom-0 left-0 h-full w-[200%]"
          role="presentation"
        >
          <path
            d="M0,70 C360,10 720,110 1440,60 C2160,10 2520,110 2880,60 L2880,120 L0,120 Z"
            fill="var(--sky)"
            opacity="0.35"
          />
        </svg>
        <svg
          viewBox="0 0 2880 120"
          preserveAspectRatio="none"
          className="animate-wave-drift absolute bottom-0 left-0 h-full w-[200%] [animation-duration:26s]"
          role="presentation"
        >
          <path
            d="M0,86 C420,40 780,120 1440,80 C2100,40 2460,120 2880,84 L2880,120 L0,120 Z"
            fill="var(--background)"
          />
        </svg>
      </div>
    </div>
  );
}
