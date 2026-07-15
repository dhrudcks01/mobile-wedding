"use client";

import { useEffect } from "react";

const REVEAL_SELECTOR = "[data-reveal]";

function getDuration(value: string | undefined, fallback: number) {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) && parsedValue >= 0
    ? parsedValue
    : fallback;
}

function getThreshold(value: string | undefined, fallback: number) {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) && parsedValue >= 0 && parsedValue <= 1
    ? parsedValue
    : fallback;
}

export function ScrollRevealController() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR),
    );
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (elements.length === 0 || reduceMotion) {
      return;
    }

    const thresholds = Array.from(
      new Set([
        0.12,
        ...elements.map((element) =>
          getThreshold(element.dataset.revealThreshold, 0.12),
        ),
      ]),
    ).sort((first, second) => first - second);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          const revealThreshold = getThreshold(
            element.dataset.revealThreshold,
            0.12,
          );

          if (!entry.isIntersecting || entry.intersectionRatio < revealThreshold) {
            return;
          }

          element.classList.add("is-revealed");
          observer.unobserve(element);
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: thresholds,
      },
    );

    elements.forEach((element) => {
      const delay = getDuration(element.dataset.revealDelay, 0);
      const duration = getDuration(element.dataset.revealDuration, 1050);

      element.style.setProperty("--reveal-delay", `${delay}ms`);
      element.style.setProperty("--reveal-duration", `${duration}ms`);
      element.classList.add("reveal-ready");
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
