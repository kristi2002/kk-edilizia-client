"use client";

import { useCallback, useState, type HTMLAttributes } from "react";

type FadeInProps = HTMLAttributes<HTMLDivElement> & {
  delay?: number;
  children: React.ReactNode;
};

/** Below this much of the element on screen, treat it as "not yet arrived". */
const MARGIN = 60;

/** If the observer never fires, the content still has to become readable. */
const FAILSAFE_MS = 3000;

/**
 * Scroll reveal.
 *
 * This used framer-motion's `whileInView`, which meant the server-rendered markup
 * carried an inline `opacity: 0` that only the animation library could clear — so a page
 * that hydrated but never got an animation frame showed twenty-six empty sections, and
 * the `<noscript>` override in the root layout could not help because JavaScript *was*
 * running. The hidden state is now applied by this component, and only to elements it
 * has measured as below the fold:
 *
 *   - never hydrates       → no `data-fade`, content visible (the CSS default)
 *   - already on screen    → revealed immediately, so nothing flashes
 *   - below the fold       → hidden, then revealed by the observer
 *   - observer never fires → revealed by the failsafe timer
 *
 * The measurement runs in a ref callback rather than an effect. Ref callbacks run after
 * the DOM is attached but *before* paint, so an element that should start hidden is
 * painted hidden once, instead of appearing and then being hidden a frame later.
 *
 * The transition itself lives in `globals.css` under `[data-fade]`, which also honours
 * `prefers-reduced-motion`.
 */
export function FadeIn({
  delay = 0,
  children,
  className,
  style,
  ...rest
}: FadeInProps) {
  /** "rest" is the server state: no attribute, so nothing is hidden. */
  const [phase, setPhase] = useState<"rest" | "out" | "in">("rest");

  const measure = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const alreadyVisible =
      rect.top < window.innerHeight - MARGIN && rect.bottom > 0;
    if (alreadyVisible || typeof IntersectionObserver === "undefined") {
      setPhase("in");
      return;
    }

    setPhase("out");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setPhase("in");
          observer.disconnect();
        }
      },
      { rootMargin: `-${MARGIN}px` },
    );
    observer.observe(el);

    const failsafe = window.setTimeout(() => {
      setPhase("in");
      observer.disconnect();
    }, FAILSAFE_MS);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return (
    <div
      ref={measure}
      data-fade={phase === "rest" ? undefined : phase}
      className={className}
      style={delay ? { ...style, transitionDelay: `${delay}s` } : style}
      {...rest}
    >
      {children}
    </div>
  );
}
