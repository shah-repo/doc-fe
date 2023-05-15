import { MutableRefObject, useEffect, useRef, useState } from "react";

type UseOverfowHook = () => [MutableRefObject<HTMLUnknownElement | null>, boolean, { x: boolean, y: boolean }];

const useOverflow: UseOverfowHook = () => {
  const elementRef = useRef<HTMLUnknownElement>(null);
  const [isOverflowing, setIsOverflowing] = useState({ x: false, y: false });

  useEffect(() => {
    if (!elementRef.current) {
      return;
    }
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
  }, [elementRef.current]);

  return [elementRef, isOverflowing.x || isOverflowing.y, isOverflowing];
};

export default useOverflow;
