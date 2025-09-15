import { RefObject, useEffect, useRef, useState } from 'react';

type UseHoverType<T> = [RefObject<T>, boolean];

const useHoverOnce = <T extends HTMLElement>(): UseHoverType<T> => {
  const [value, setValue] = useState(false);
  const elementRef = useRef<T>(null);
  const handleMouseOver = () => setValue(true);

  useEffect(
    () => {
      const element = elementRef.current;

      if (!element) {
        return;
      }
      element.addEventListener('mouseover', handleMouseOver);

      return () => {
        element.removeEventListener('mouseover', handleMouseOver);
      };
    },
    [elementRef.current],
  );

  return [elementRef, value];
};

export default useHoverOnce;
