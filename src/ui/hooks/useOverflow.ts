import { RefObject } from 'react';
import useElementSize from './useElementSize';

type UseOverflowType<T> = [RefObject<T>, boolean, { x: boolean, y: boolean }];

function useOverflow<T extends HTMLElement> (): UseOverflowType<T> {
  const [ref, { width, height }] = useElementSize<T>();
  const isOverflowing = ref.current ? {
    x: Math.floor(width) < Math.ceil(ref.current.scrollWidth),
    y: Math.floor(height) < Math.ceil(ref.current.scrollHeight),
  } : { x: false, y: false };

  return [ref, isOverflowing.x || isOverflowing.y, isOverflowing];
}

export default useOverflow;
