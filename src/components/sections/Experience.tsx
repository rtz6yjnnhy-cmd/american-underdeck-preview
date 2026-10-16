import { Fade, LineReveal } from "@/components/motion/Reveal";
import { company, warranty } from "@/lib/content";

const ledger = [
  {
    figure: "3,000+",
    title: "Under deck projects",
    body: "Constructed for homeowners, gardens and offices.",
  },
  {
    figure: "50 years",
    title: warranty.installation.title,
    body: warranty.installation.body,
  },
  {
    figure: "As long as you own your home",
    long: true,
    title: warranty.material.title,
    body: warranty.material.body,
  },
  {
    figure: "100%",
    title: "Satisfaction guaranteed",
    body: "Quality materials from start to finish, installed by trained installers.",
  },
];

export function Experience() {
  return (
    <section id="warranty" aria-labelledby="experience-title" className="py-24 md:py-40">
      <div className="container-page">
        <LineReveal
          id="experience-title"
          lines={["Built on", "experience."]}
          className="type-campaign text-display"
        />

        <dl className="mt-16 border-t border-line/15 md:mt-24">
          {ledger.map((row) => (
            <Fade key={row.title}>
              <div className="grid gap-4 border-b border-line/15 py-8 md:grid-cols-12 md:gap-6 md:py-12">
                <dt className="md:col-span-5">
                  <span
                    className={`type-campaign-strong tabular block leading-none ${
                      "long" in row ? "max-w-[16ch] text-xl leading-tight" : "text-2xl"
                    }`}
                  >
                    {row.figure}
                  </span>
                </dt>
                <dd className="md:col-span-6 md:col-start-7">
                  <p className="type-wide text-lg text-fg">{row.title}</p>
                  <p className="mt-2 max-w-[56ch] text-base text-muted">{row.body}</p>
                </dd>
              </div>
            </Fade>
          ))}
        </dl>

        <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-5">
            <h3 className="type-wide text-xl">How a warranty claim works</h3>
            <ol className="mt-8 flex flex-col gap-6">
              {warranty.claimSteps.map((s, i) => (
                <li key={s} className="grid grid-cols-[40px_1fr] gap-2 text-base">
                  <span className="tabular text-sm text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <details className="group border-y border-line/15">
              <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-6 text-base">
                What the installation warranty doesn’t cover
                <span aria-hidden className="text-xl text-muted transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="pb-8">
                <p className="max-w-[56ch] text-sm text-muted">
                  Some deck structures have areas where adequate flashing is impossible or
                  insufficient. Unless otherwise stated, small leaks or drips in these areas are
                  not covered:
                </p>
                <ul className="mt-6 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                  {warranty.exclusions.map((e) => (
                    <li key={e} className="border-b border-line/10 py-2">
                      {e}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 max-w-[56ch] text-sm text-muted">{warranty.notCovered}</p>
                <a
                  href={`${company.website}warranty-information/`}
                  className="mt-6 inline-flex min-h-[44px] items-center text-sm underline decoration-fg/30 underline-offset-[6px] hover:decoration-fg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read the full warranty terms
                </a>
              </div>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}
