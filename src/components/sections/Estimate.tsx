"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";
import { LineReveal } from "@/components/motion/Reveal";
import { company, photos } from "@/lib/content";
import { duration, ease } from "@/lib/motion";

type Errors = Partial<Record<"name" | "phone" | "email", string>>;

const field =
  "mt-2 block min-h-[48px] w-full rounded-lg border border-fg/20 bg-white/5 px-4 text-base text-fg placeholder:text-fg/40 transition-colors duration-200 hover:border-fg/40 focus:border-accent focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-[invalid=true]:border-[rgb(255,140,120)]";

export function Estimate() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [file, setFile] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const reduce = useReducedMotionSafe();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Errors = {};
    if (!String(data.get("name") || "").trim()) next.name = "Enter your name so we know who to call.";
    const phone = String(data.get("phone") || "").replace(/\D/g, "");
    if (phone.length < 10) next.phone = "Enter a 10-digit phone number, e.g. 404 914 6959.";
    const email = String(data.get("email") || "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Check the email address — it looks incomplete.";
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setSent(true);
  };

  return (
    <section id="estimate" aria-labelledby="estimate-title" className="theme-abyss relative isolate overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image
          src={photos.eveningLounge.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
          style={{ objectPosition: "40% 30%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgb(11_30_51)] via-[rgb(11_30_51/0.92)] to-[rgb(11_30_51/0.7)]" />
      </div>

      <div className="container-page grid gap-16 py-24 md:py-40 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-5">
          <LineReveal
            id="estimate-title"
            lines={["Let’s redefine", "your living", "space together."]}
            className="type-campaign text-3xl"
          />
          <p className="mt-8 max-w-[40ch] text-base text-fg/80">
            Tell us about your deck and we’ll get back to you with a quick, accurate quote — and
            some inspiration for the space below it.
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <p className="text-sm text-muted">Call us today</p>
              <a href={company.phoneHref} className="type-wide tabular mt-2 inline-block text-xl hover:text-accent">
                {company.phone}
              </a>
              <p className="mt-2 text-sm text-muted">{company.location}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Business hours</p>
              <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
                {company.hours.map((h) => (
                  <div key={h.days} className="contents">
                    <dt className="text-fg/70">{h.days}</dt>
                    <dd className="tabular">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <AnimatePresence mode="wait" initial={false}>
            {sent ? (
              <motion.div
                key="sent"
                role="status"
                initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: duration.slow, ease: ease.out }}
                className="rounded-[16px] border border-fg/15 bg-surface/60 p-8 backdrop-blur-sm md:p-12"
              >
                <p className="type-wide text-xl">Thanks — your details are ready.</p>
                <p className="mt-4 max-w-[48ch] text-base text-fg/80">
                  This page is a design preview, so the form isn’t connected yet. To request your
                  estimate today, call{" "}
                  <a href={company.phoneHref} className="underline underline-offset-4">
                    {company.phone}
                  </a>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-8 min-h-[44px] text-sm underline decoration-fg/30 underline-offset-[6px] hover:decoration-fg"
                >
                  Edit my details
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                ref={formRef}
                noValidate
                onSubmit={onSubmit}
                initial={false}
                exit={{ opacity: 0, transition: { duration: duration.fast } }}
                className="grid gap-6 rounded-[16px] border border-fg/15 bg-surface/60 p-6 backdrop-blur-sm sm:grid-cols-2 md:p-12"
                aria-describedby="form-note"
              >
                <p id="form-note" className="text-sm text-muted sm:col-span-2">
                  Get a quick and easy quote. Fields marked * are required.
                </p>
                {(
                  [
                    { name: "name", label: "Name *", type: "text", auto: "name" },
                    { name: "phone", label: "Phone *", type: "tel", auto: "tel" },
                    { name: "email", label: "Email", type: "email", auto: "email" },
                    { name: "city", label: "City", type: "text", auto: "address-level2" },
                  ] as const
                ).map((f) => {
                  const err = errors[f.name as keyof Errors];
                  return (
                    <div key={f.name}>
                      <label htmlFor={`f-${f.name}`} className="text-sm">
                        {f.label}
                      </label>
                      <input
                        id={`f-${f.name}`}
                        name={f.name}
                        type={f.type}
                        autoComplete={f.auto}
                        aria-invalid={!!err}
                        aria-describedby={err ? `f-${f.name}-err` : undefined}
                        className={field}
                      />
                      {err && (
                        <p id={`f-${f.name}-err`} className="mt-2 text-sm text-[rgb(255,170,155)]" role="alert">
                          {err}
                        </p>
                      )}
                    </div>
                  );
                })}
                <div>
                  <label htmlFor="f-size" className="text-sm">
                    Deck size
                  </label>
                  <input id="f-size" name="size" type="text" placeholder="e.g. 12 × 16 ft" className={field} />
                </div>
                <div>
                  <span className="text-sm">Picture of deck</span>
                  <label
                    htmlFor="f-photo"
                    className="mt-2 flex min-h-[48px] cursor-pointer items-center justify-between gap-4 rounded-lg border border-dashed border-fg/30 px-4 text-sm text-fg/70 transition-colors hover:border-fg/60 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent"
                  >
                    <span className="truncate">{file ?? "Add a photo"}</span>
                    <span aria-hidden>+</span>
                    <input
                      id="f-photo"
                      name="photo"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)}
                    />
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="f-message" className="text-sm">
                    Message
                  </label>
                  <textarea
                    id="f-message"
                    name="message"
                    rows={4}
                    className={`${field} py-3`}
                    placeholder="What would you like to do with the space?"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="type-wide inline-flex min-h-[52px] w-full items-center justify-center rounded-lg bg-[rgb(241,243,242)] px-6 text-sm font-medium uppercase tracking-[0.06em] text-[rgb(11,30,51)] transition-[transform,background-color] duration-200 ease-out hover:bg-white active:scale-[0.98] sm:w-auto"
                  >
                    Get a free estimate
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
