import Image from "next/image";
import { Fade, LineReveal } from "@/components/motion/Reveal";
import { benefits, photos } from "@/lib/content";

export function Intro() {
  return (
    <section id="about" aria-labelledby="intro-title" className="relative py-24 md:py-40">
      <div className="container-page grid gap-12 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-7">
          <LineReveal
            id="intro-title"
            lines={["Top-tier", "under deck", "solutions."]}
            className="type-campaign text-3xl"
          />
          <Fade delay={0.15} className="mt-12 max-w-[56ch] md:mt-16">
            <p className="text-xl leading-snug text-fg">
              American Underdeck provides complete design and installation of under deck systems,
              with 100% satisfaction guaranteed — through quality of product, personal integrity
              and lasting relationships with our customers and employees.
            </p>
            <p className="mt-6 text-base text-muted">
              Over 3,000 under deck projects for homeowners, gardens and offices. Quality materials
              from start to finish, and every installation carried out by a trained installer.
            </p>
          </Fade>
        </div>

        <Fade className="relative md:col-span-5 md:-mr-16 md:mt-24" delay={0.1}>
          <div className="relative aspect-[4/5] overflow-hidden md:rounded-l-[24px]">
            <Image
              src={photos.brickVeranda.src}
              alt={photos.brickVeranda.alt}
              fill
              sizes="(min-width: 768px) 42vw, 100vw"
              className="object-cover"
              style={{ objectPosition: "35% 50%" }}
            />
          </div>
          <p className="mt-4 text-xs text-muted">{photos.brickVeranda.caption}</p>
        </Fade>
      </div>

      {/* Benefits — three published reasons, set as a quiet ledger */}
      <div className="container-page mt-24 md:mt-40">
        <h2 className="sr-only">Benefits of an under deck system</h2>
        <ul className="border-t border-line/15">
          {benefits.map((b) => (
            <li key={b.title} className="border-b border-line/15">
              <Fade className="grid gap-4 py-8 md:grid-cols-12 md:gap-6 md:py-12">
                <h3 className="type-wide text-xl font-normal md:col-span-5">{b.title}</h3>
                <p className="max-w-[60ch] text-base text-muted md:col-span-6 md:col-start-7">
                  {b.body}
                </p>
              </Fade>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
