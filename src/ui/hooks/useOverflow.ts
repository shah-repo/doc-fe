import { RefObject } from 'react';
import { useResizeObserver } from './useResizeObserver';

type UseOverfowType<T> = [RefObject<T>, boolean, { x: boolean, y: boolean }];

export function useOverflow<T extends HTMLElement> (): UseOverfowType<T> {
  const [ref, { width, height }] = useResizeObserver<T>();

  const isOverflowing = ref.current ? {
    x: width < ref.current.scrollWidth,
    y: height < ref.current.scrollHeight,
  } : { x: false, y: false };

  return [ref, isOverflowing.x || isOverflowing.y, isOverflowing];
}

export default useOverflow;
