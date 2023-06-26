import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useDidMount from './useDidMount';

export const useScrollIntoView = () => {
  const location = useLocation();
  const didMount = useDidMount();

  useLayoutEffect(() => {
    const hash = location.hash;
    if (!didMount || !hash) {
      return;
    }
    const selector = `[id="${hash.substring(1)}"]`;
    const element = document.querySelector(selector) as HTMLElement;
    element && element.scrollIntoView({ behavior: 'smooth' });
  }, [didMount, location.hash]);
};
