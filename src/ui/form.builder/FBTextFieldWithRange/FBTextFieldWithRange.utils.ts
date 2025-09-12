import { useObserver } from 'mobx-react';
import { useEffect } from 'react';
import { UnitOption, UseOptionsHook } from '..';
import FBAutocompleteAsyncState from '../FBAutocompleteAsync/FBAutocompleteAsync.state';
import FBAutocompleteAsyncStore from '../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { FBAutocompleteAsyncOption } from '../FBAutocompleteAsync/FBAutocompleteAsync.types';
import { FB } from '../helpers';

export const useOptions: UseOptionsHook = () => {
  const unitsAsync = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {
    optionId: FBAutocompleteAsyncOption.unitMeasures,
  });

  useEffect(() => {
    unitsAsync.load();
  }, [unitsAsync]);

  const units = useObserver(
    () => {
      const asyncData = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.unitMeasures) as Map<string, UnitOption>;
      return asyncData ? Array.from(asyncData.values()).map(item => item.text) : [];
    },
  );

  return {
    units,
    isLoading: unitsAsync.loading,
  };
};
