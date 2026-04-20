import { useObserver } from 'mobx-react';
import { FB } from '../form.builder';

export function useFormValue<T>(name: string, defaultValue?: T): T | undefined {
  const { formState } = FB.useStores();
  return useObserver(() => formState?.newValues.get(name) ?? formState?.getFieldValue(name) ?? defaultValue);
}
