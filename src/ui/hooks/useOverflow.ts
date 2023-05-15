import { RefObject, useEffect, useRef, useState } from 'react';

type UseOverfowType<T> = [RefObject<T>, boolean, { x: boolean, y: boolean }];

const useOverflow = <T extends HTMLElement>(): UseOverfowType<T> => {
  const elementRef = useRef<T>(null);
  const [isOverflowing, setIsOverflowing] = useState({ x: false, y: false });

  useEffect(() => {
    if (!elementRef.current) {
      return;
    }
    // TODO check typing
    const resizeObserver = new ResizeObserver((elements) => {
      const element = elements.at(0);
      if (!element) {
        return;
      }
      setIsOverflowing({
        x: element.contentRect.width < element.target.scrollWidth,
        y: element.contentRect.height < element.target.scrollHeight,
      });
    });
    resizeObserver.observe(elementRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return [elementRef, isOverflowing.x || isOverflowing.y, isOverflowing];
};

export default useOverflow;
