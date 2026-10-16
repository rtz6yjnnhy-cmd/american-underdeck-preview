import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "ghost" | "quiet";

const base =
  "group relative inline-flex min-h-[48px] items-center justify-center gap-4 rounded-lg px-6 text-sm font-medium transition-[transform,background-color,color,border-color] duration-200 ease-out active:scale-[0.98] select-none";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-brand-fg hover:bg-brand/90",
  ghost: "border border-fg/30 text-fg hover:border-fg hover:bg-fg/5",
  quiet: "px-0 text-fg underline decoration-fg/30 underline-offset-[6px] hover:decoration-fg",
};

export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  ...props
}: { variant?: Variant; children: ReactNode } & ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={`${base} type-wide tracking-[0.04em] uppercase ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
