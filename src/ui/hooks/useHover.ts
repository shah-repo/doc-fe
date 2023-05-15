import { RefObject, useEffect, useRef, useState } from 'react';

type UseHoverType<T> = [RefObject<T>, boolean];

const useHover = <T extends HTMLElement>(): UseHoverType<T> => {
  const [value, setValue] = useState(false);
  const elementRef = useRef<T>(null);
  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);

  useEffect(
    () => {
      const element = elementRef.current;
      if (!element) {
        return;
      }
      element.addEventListener('mouseover', handleMouseOver);
      element.addEventListener('mouseout', handleMouseOut);

      return () => {
        element.removeEventListener('mouseover', handleMouseOver);
        element.removeEventListener('mouseout', handleMouseOut);
      };
    },
    [],
  );

  return [elementRef, value];
};

export default useHover;
