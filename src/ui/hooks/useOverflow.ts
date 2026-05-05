import { RefObject, useEffect, useState } from 'react';
import useElementSize from './useElementSize';

interface Overflow {
  x: boolean
  y: boolean
}

type UseOverflowType<T> = [RefObject<T>, boolean, Overflow];

function useOverflow<T extends HTMLElement> (): UseOverflowType<T> {
  const [ref, { width, height }] = useElementSize<T>();
  const [overflow, setOverflow] = useState<Overflow>({ x: false, y: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let retryTimeout: ReturnType<typeof setTimeout> | null = null;

    const check = () => {
      const tolerance = 1;

      const x = el.scrollWidth - el.clientWidth > tolerance;
      const y = el.scrollHeight - el.clientHeight > tolerance;

      setOverflow((prev) => {
        if (prev.x === x && prev.y === y) return prev;
        return { x, y };
      });

      // 👇 Retry only if element not ready (Cypress case)
      if (el.clientWidth === 0 || el.clientHeight === 0) {
        retryTimeout = setTimeout(check, 100);
      }
    };

    const raf = requestAnimationFrame(check);

    return () => {
      cancelAnimationFrame(raf);
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [width, height, ref]);

  return [ref, overflow.x || overflow.y, overflow];
}

export default useOverflow;
