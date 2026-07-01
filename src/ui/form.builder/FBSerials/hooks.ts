import debounce from 'lodash/debounce';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SERIAL_VALIDATION_DEBOUNCE_MS } from './consts';
import { normalizeSerial } from './helpers';

type ExistingSerialsResult =
  | { kind: 'ok' }
  | { kind: 'existing', serials: string[] }
  | { kind: 'error' };

interface ExistingSerialsCheck {
  isChecking: boolean
  hasExistingMatches: boolean
  hasError: boolean
  existingKeys: Set<string>
}

const getMatchingExistingSerials = (serials: string[], existingSerials: string[]): string[] => {
  const submittedKeys = new Set(serials.map(normalizeSerial));
  const matching = existingSerials.filter(serial => submittedKeys.has(normalizeSerial(serial)));
  const uniqueByKey = new Map<string, string>();

  matching.forEach(serial => uniqueByKey.set(normalizeSerial(serial), serial));
  return Array.from(uniqueByKey.values());
};

const getSerialsKey = (serials: string[]): string => serials.map(normalizeSerial).join('\n');

export const useExistingSerialsCheck = (
  serials: string[],
  enabled: boolean,
  onCheck: (serials: string[]) => Promise<string[]>,
): ExistingSerialsCheck => {
  const [result, setResult] = useState<ExistingSerialsResult | null>(null);
  const [validatedKey, setValidatedKey] = useState('');
  const requestIdRef = useRef(0);
  const key = useMemo(() => getSerialsKey(serials), [serials]);

  const debouncedCheck = useMemo(() => debounce((
    requestSerials: string[],
    requestKey: string,
    requestId: number,
  ) => {
    onCheck(requestSerials)
      .then((existing) => {
        if (requestId !== requestIdRef.current) {
          return;
        }
        const matched = getMatchingExistingSerials(requestSerials, existing);
        setResult(matched.length > 0
          ? { kind: 'existing', serials: matched }
          : { kind: 'ok' });
        setValidatedKey(requestKey);
      })
      .catch(() => {
        if (requestId !== requestIdRef.current) {
          return;
        }
        setResult({ kind: 'error' });
        setValidatedKey(requestKey);
      });
  }, SERIAL_VALIDATION_DEBOUNCE_MS), [onCheck]);

  useEffect(() => {
    requestIdRef.current += 1;

    if (!enabled || serials.length === 0) {
      setResult(null);
      setValidatedKey('');
      return;
    }

    debouncedCheck(serials, key, requestIdRef.current);

    return () => {
      debouncedCheck.cancel();
      requestIdRef.current += 1;
    };
    // `key` already encodes the meaningful content of `serials`, using it as a stable dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, key, debouncedCheck]);

  const isChecking = enabled && serials.length > 0 && validatedKey !== key;

  const existingKeys = useMemo(() => {
    if (result?.kind !== 'existing') {
      return new Set<string>();
    }
    const currentKeys = new Set(serials.map(normalizeSerial));
    return new Set(
      result.serials
        .map(normalizeSerial)
        .filter(k => currentKeys.has(k)),
    );
  }, [result, serials]);

  return {
    isChecking,
    hasExistingMatches: existingKeys.size > 0,
    hasError: result?.kind === 'error',
    existingKeys,
  };
};
