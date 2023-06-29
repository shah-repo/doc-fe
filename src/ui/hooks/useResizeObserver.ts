import { RefObject, useEffect, useMemo, useRef, useState } from 'react';

export type ObserverRect = Omit<DOMRectReadOnly, 'toJSON'>;

const DEFAULT_STATE: ObserverRect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
};

type UseResizeObserverType<T> = [RefObject<T>, ObserverRect];

export function useResizeObserver<T extends HTMLElement> (): UseResizeObserverType<T> {
  const frameID = useRef(0);
  const ref = useRef<T>(null);

  const [rect, setRect] = useState<ObserverRect>(DEFAULT_STATE);

  const handleResize: ResizeObserverCallback = (entries) => {
    const entry = entries[0];

    if (entry) {
      cancelAnimationFrame(frameID.current);

      frameID.current = requestAnimationFrame(() => {
        if (ref.current) {
          setRect(entry.contentRect as ObserverRect);
        }
      });
    }
  };

  const observer = useMemo(() => new ResizeObserver(handleResize), []);

  useEffect(() => {
    if (ref.current) {
      observer?.observe(ref.current);
    }

    return () => {
      observer?.disconnect();

      if (frameID.current) {
        cancelAnimationFrame(frameID.current);
      }
    };
  }, [ref.current, observer]);

  return [ref, rect];
}
