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

    let rafId: number;

    const check = () => {
      rafId = requestAnimationFrame(() => {
        const x = Math.ceil(el.scrollWidth) > Math.ceil(el.clientWidth);
        const y = Math.ceil(el.scrollHeight) > Math.ceil(el.clientHeight);

        setOverflow((prev) =>
          prev.x === x && prev.y === y ? prev : { x, y },
        );
      });
    };

    // initial + size change trigger
    check();

    // required for content updates
    const mutationObserver = new MutationObserver(check);

    mutationObserver.observe(el, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      cancelAnimationFrame(rafId);
      mutationObserver.disconnect();
    };
  }, [ref, width, height]);

  return [ref, overflow.x || overflow.y, overflow];
}

export default useOverflow;
