import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { company, nav } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="theme-abyss border-t border-fg/10">
      <div className="container-page grid gap-12 py-16 md:grid-cols-12 md:gap-6 md:py-24">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-6 max-w-[36ch] text-sm text-muted">
            Under deck drainage and ceiling systems, designed and installed from {company.location}.
          </p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <ul className="flex flex-col gap-2 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="inline-flex min-h-[32px] items-center text-fg/80 hover:text-fg">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm md:col-span-4">
          <a href={company.phoneHref} className="type-wide tabular text-lg hover:text-accent">
            {company.phone}
          </a>
          <ul className="mt-6 flex gap-6">
            <li>
              <a href={company.social.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center text-fg/80 hover:text-fg">
                Facebook
              </a>
            </li>
            <li>
              <a href={company.social.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center text-fg/80 hover:text-fg">
                Instagram
              </a>
            </li>
            <li>
              <a href={company.social.youtube} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center text-fg/80 hover:text-fg">
                YouTube
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Oversized wordmark — the last thing seen */}
      <div className="container-page overflow-hidden" aria-hidden>
        <p className="type-campaign whitespace-nowrap text-[clamp(2.75rem,10.6vw,10rem)] leading-[0.8] text-fg/[0.07]">
          Underdeck
        </p>
      </div>

      <div className="container-page">
        <div className="flex flex-col gap-2 border-t border-fg/10 py-6 text-xs text-muted sm:flex-row sm:justify-between">
          <p>© {year} {company.name}. All rights reserved.</p>
          <p className="max-w-[60ch] sm:text-right">
            Unofficial website concept for portfolio purposes — not affiliated with or endorsed by{" "}
            {company.name}. Photography and videos © {company.name}.
          </p>
        </div>
      </div>
    </footer>
  );
}
