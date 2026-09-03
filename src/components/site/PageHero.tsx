import { WaveDivider } from "@/components/site/WaveDivider";

export function PageHero({
  image,
  eyebrow,
  title,
  description,
  children,
}: {
  image: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <img
        src={image}
        alt={title}
        width={1920}
        height={1080}
        className="absolute inset-0 -z-10 size-full object-cover"
      />
      <div className="hero-overlay absolute inset-0 -z-10" />
      <div className="mx-auto max-w-7xl px-4 pt-20 pb-24 sm:px-6 sm:pt-28 sm:pb-32 lg:px-8">
        <div className="animate-rise-in max-w-3xl">
          {eyebrow && (
            <span className="text-xs tracking-[0.28em] text-sky uppercase">{eyebrow}</span>
          )}
          <h1 className="mt-3 text-3xl leading-tight text-white sm:text-5xl">{title}</h1>
          {description && <p className="mt-4 max-w-2xl text-white/85 sm:text-lg">{description}</p>}
          {children && <div className="mt-7 flex flex-wrap gap-3">{children}</div>}
        </div>
      </div>
      <WaveDivider className="absolute inset-x-0 bottom-0" />
    </section>
  );
}
