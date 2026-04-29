import { useObserver } from 'mobx-react';
import { FB } from '../form.builder';
import FBDataStore from '../form.builder/FBStore/FBDataStore';

export function useFormValue<T> (name: string): T | undefined;
export function useFormValue<T> (name: string, defaultValue: T): T;
export function useFormValue<T> (name: string, defaultValue?: T): T | undefined {
  const { formState } = FB.useStores();
  return useObserver(
    () => (
      FBDataStore.refreshData?.formInput?.[name]
      ?? formState?.newValues.get(name)
      ?? formState?.getFieldValue(name)
      ?? defaultValue
    ) as T | undefined,
  );
}
