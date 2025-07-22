import { useObserver } from 'mobx-react';
import FBAutocompleteAsyncStore from '../../../../../../form.builder/FBAutocompleteAsync/FBAutocompleteAsync.store';
import { FBAutocompleteAsyncOption } from '../../../../../../form.builder/FBAutocompleteAsync/FBAutocompleteAsync.types';
import { UnitOption } from './types';

export const useOptions = () => {
  const units = useObserver(() => {
    const asyncData = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.unitMeasures) as Map<
    string,
    UnitOption
    >;
    return asyncData ? Array.from(asyncData.values()).map((item) => item.text) : [];
  });

  return {
    units,
  };
};
