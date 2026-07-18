const DESKTOP_SIDEBAR_OFFSET = 64;

export function getSectionOffset(viewportWidth: number): number {
  return viewportWidth >= 768 ? DESKTOP_SIDEBAR_OFFSET : 0;
}

export function scrollToSection(
  targetId: string,
  lenisScrollTo?: (target: string | number | HTMLElement, options?: { offset?: number; duration?: number }) => void
): void {
  const el = document.getElementById(targetId);
  if (!el) return;

  const offset = -getSectionOffset(window.innerWidth);

  if (lenisScrollTo) {
    lenisScrollTo(el, { offset, duration: 1.4 });
    return;
  }

  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: "smooth" });
}
