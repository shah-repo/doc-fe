import { RefObject, useEffect, useRef, useState } from 'react';

interface Overflow {
  x: boolean
  y: boolean
}

type UseOverflowType<T> = [RefObject<T>, boolean, Overflow];

function useOverflow<T extends HTMLElement> (): UseOverflowType<T> {
  const ref = useRef<T>(null);
  const [overflow, setOverflow] = useState<Overflow>({ x: false, y: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId: number | null = null;

    const check = () => {
      // run in next frame to ensure layout is stable
      rafId = requestAnimationFrame(() => {
        const x = Math.ceil(el.scrollWidth) > Math.ceil(el.clientWidth);
        const y = Math.ceil(el.scrollHeight) > Math.ceil(el.clientHeight);

        setOverflow((prev) => {
          if (prev.x === x && prev.y === y) return prev;
          return { x, y };
        });
      });
    };

    // Initial check
    check();

    // ResizeObserver handles size/layout changes
    const resizeObserver = new ResizeObserver(check);
    resizeObserver.observe(el);

    // MutationObserver handles content changes (edit case fix)
    const mutationObserver = new MutationObserver(check);
    mutationObserver.observe(el, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return [ref, overflow.x || overflow.y, overflow];
}

export default useOverflow;
