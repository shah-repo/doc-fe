import { MutableRefObject, useEffect, useRef, useState } from 'react';

type UseHoverHook = () => [MutableRefObject<HTMLUnknownElement | null>, boolean];

const useHover: UseHoverHook = () => {
  const [value, setValue] = useState(false);
  const ref = useRef<HTMLUnknownElement>(null);
  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);

  useEffect(
    () => {
      const element = ref.current;
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
    [ref.current]
  );
  return [ref, value];
};

export default useHover;
