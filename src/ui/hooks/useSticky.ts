import { RefObject, useEffect, useRef, useState } from 'react';

type UseStickyType<T> = [RefObject<T>, boolean];

function useSticky<T extends HTMLElement, C extends HTMLElement> (containerRef?: RefObject<C>): UseStickyType<T> {
  const stickyRef = useRef<T>(null);
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const container = containerRef?.current ?? document;
    function observe () {
      if (!stickyRef.current) return;
      const containerPageOffset = containerRef?.current?.getBoundingClientRect().top ?? 0;
      const refPageOffset = stickyRef.current.getBoundingClientRect().top;
      const stickyOffset = parseInt(getComputedStyle(stickyRef.current).top);
      const stickyActive = (refPageOffset - containerPageOffset) <= stickyOffset;
      setSticky(stickyActive);
    }
    observe();

    container.addEventListener('scroll', observe);
    window.addEventListener('resize', observe);
    window.addEventListener('orientationchange', observe);

    return () => {
      container.removeEventListener('scroll', observe);
      window.removeEventListener('resize', observe);
      window.removeEventListener('orientationchange', observe);
    };
  }, [sticky, containerRef]);

  return [stickyRef, sticky] as const;
}

export default useSticky;
