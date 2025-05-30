import isEqual from 'lodash.isequal';
import { useEffect, useRef } from 'react';

/**
 * Deep compare effect hook for complex dependency arrays.
 */

function useDeepCompareEffect<T extends readonly unknown[]> (effect: () => void, deps: T): void {
  const previousDepsRef = useRef<T>();

  if (!isEqual(previousDepsRef.current, deps)) {
    previousDepsRef.current = deps;
  }

  useEffect(effect, [previousDepsRef.current]);
}

export default useDeepCompareEffect;
