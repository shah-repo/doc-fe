import { useObserver } from 'mobx-react';
import { useCallback } from 'react';
import { FB } from '../form.builder';
import FBDataStore from '../form.builder/FBStore/FBDataStore';

export function useCurrentFormValue<T> (name: string): T | undefined;
export function useCurrentFormValue<T> (name: string, defaultValue: T): T;
export function useCurrentFormValue<T> (name: string, defaultValue?: T): T | undefined {
  const { formState } = FB.useStores();
  const getLHRSStepSerialNumbersValue = useCallback((): T | undefined => {
    if (formState?.newValues.has(name)) {
      return (formState.newValues.get(name) as T | undefined) ?? defaultValue;
    }

    return ((
      FBDataStore.refreshData?.formInput?.[name]
      ?? formState?.getFieldValue(name)
    ) as T | undefined) ?? defaultValue;
  }, [formState, name, defaultValue]);

  return useObserver(getLHRSStepSerialNumbersValue);
}
