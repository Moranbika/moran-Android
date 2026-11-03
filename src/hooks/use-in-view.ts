import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useInView<T extends Element>({
  threshold = 0.16,
  rootMargin = '0px 0px -8% 0px',
  once = true,
}: UseInViewOptions = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      typeof IntersectionObserver === 'undefined'
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry?.isIntersecting) return;
      setInView(true);
      if (once) observer.disconnect();
    }, { threshold, rootMargin });

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return { ref, inView };
}
