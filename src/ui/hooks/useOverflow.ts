import { RefObject, useEffect, useState } from 'react';
import useElementSize from './useElementSize';

type UseOverflowType<T> = [RefObject<T>, boolean, { x: boolean, y: boolean }];

function useOverflow<T extends HTMLElement> (): UseOverflowType<T> {
  const [ref, { width, height }] = useElementSize<T>();
  const [overflow, setOverflow] = useState({ x: false, y: false });

  useEffect(() => {
    const el = ref.current;

    // Guard: element not ready or not measured yet
    if (!el || width === 0 || height === 0) {
      setOverflow({ x: false, y: false });
      return;
    }

    // Add tolerance to avoid float precision issues
    const tolerance = 1;

    const isOverflowingX = el.scrollWidth - width > tolerance;
    const isOverflowingY = el.scrollHeight - height > tolerance;

    setOverflow({
      x: isOverflowingX,
      y: isOverflowingY,
    });
  }, [width, height, ref]);

  return [ref, overflow.x || overflow.y, overflow];
}

export default useOverflow;
