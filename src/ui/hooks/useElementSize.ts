import { RefObject } from 'react';
import { ObserverRect, useResizeObserver } from './useResizeObserver';

type UseElementSizeType<T> = [RefObject<T>, Pick<ObserverRect, 'width' | 'height'>];

export function useElementSize<T extends HTMLElement> (): UseElementSizeType<T> {
  const [ref, { width, height }] = useResizeObserver<T>();
  return [ref, { width, height }];
}
