import { RefObject } from 'react';
import useElementSize from './useElementSize';

type UseOverflowType<T> = [RefObject<T>, boolean, { x: boolean, y: boolean }];

function useOverflow<T extends HTMLElement> (): UseOverflowType<T> {
  const [ref, { width, height }] = useElementSize<T>();
  const isOverflowing = ref.current ? {
    x: width < ref.current.scrollWidth + 1,
    y: height < ref.current.scrollHeight + 1,
  } : { x: false, y: false };

  return [ref, isOverflowing.x || isOverflowing.y, isOverflowing];
}

export default useOverflow;
