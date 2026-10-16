// Discreet but always-visible label: this is an unofficial concept, not the
// company's website.
export function PreviewBadge() {
  return (
    <p
      className="pointer-events-none fixed bottom-[max(12px,env(safe-area-inset-bottom))] left-3 z-30 select-none rounded-full bg-[rgb(11_30_51/0.72)] px-3 py-1 text-[11px] tracking-[0.02em] text-white/80 backdrop-blur-sm md:bottom-4 md:left-4"
    >
      Unofficial website concept — demo
    </p>
  );
}
