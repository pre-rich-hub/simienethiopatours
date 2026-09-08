"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Content stays visible without JavaScript; only incoming editorial blocks animate.
const targets = [
  ".intro-grid > *", ".editorial-grid > *", ".discover-section__heading > *",
  ".time-section__intro", ".featured-journeys__header > *", ".trail-proof__copy",
  ".tevan-section__copy", ".proof-section__heading > *", ".proof-grid > div",
  ".gondar-home__copy", ".final-call__content", ".journey-card",
  ".notes-grid article", ".gondar-experiences article", ".inline-cta .shell", ".gallery-tile",
].map((selector) => `main ${selector}`).join(", ");

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches || !("IntersectionObserver" in window)) return;

    const animations = new Set<Animation>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (motion.matches || entry.target.contains(document.activeElement)) continue;

        const animation = entry.target.animate([
          { opacity: 0, transform: "translateY(18px)" },
          { opacity: 1, transform: "translateY(0)" },
        ], { duration: 700, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }
    }, { rootMargin: "0px 0px -32px 0px", threshold: 0 });

    document.querySelectorAll(targets).forEach((element) => {
      if (element.getBoundingClientRect().top >= window.innerHeight) observer.observe(element);
    });

    const stopAnimations = () => {
      if (!motion.matches) return;
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    };
    motion.addEventListener("change", stopAnimations);

    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      motion.removeEventListener("change", stopAnimations);
    };
  }, [pathname]);

  return null;
}
