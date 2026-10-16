// Lockup redrawn from the company's logo: the five rays above the wordmark,
// set in the site's expanded Archivo.
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 40 28" aria-hidden className="h-6 w-auto shrink-0" fill="none">
        <path d="M2 2h6l5 12H8z" fill="rgb(10 155 224)" />
        <path d="M11 2h6l2 12h-5z" fill="rgb(10 155 224)" opacity="0.85" />
        <path d="M23 2h6l-3 12h-5z" fill="rgb(10 155 224)" opacity="0.85" />
        <path d="M32 2h6l-6 12h-5z" fill="rgb(10 155 224)" />
        <rect x="2" y="19" width="36" height="3" rx="1.5" fill="currentColor" />
        <rect x="8" y="24.5" width="24" height="2" rx="1" fill="currentColor" opacity="0.55" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="type-campaign-strong text-[15px] tracking-[0.02em]">American</span>
        <span className="type-wide mt-1 text-[9.5px] font-medium uppercase tracking-[0.32em] opacity-80">
          Underdeck Systems
        </span>
      </span>
    </span>
  );
}
