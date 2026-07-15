import { useObserver } from 'mobx-react';
import { useEffect } from 'react';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import FBAutocompleteAsyncState from '../FBAutocompleteAsync/FBAutocompleteAsync.state';
import FBAutocompleteAsyncStore from '../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { FBAutocompleteAsyncOption } from '../FBAutocompleteAsync/FBAutocompleteAsync.types';
import { FB } from '../helpers';
import { UseOptionsHook } from './types';

export const useOptions: UseOptionsHook = () => {
  const lotsAsync = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {
    optionId: FBAutocompleteAsyncOption.lots,
  });

  useEffect(() => {
    lotsAsync.load();
  }, [lotsAsync]);

  const lots = useObserver(
    () => {
      const asyncData = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.lots) as Map<string, DocumentRevision>;
      return asyncData ? Array.from(asyncData.values()) : [];
    },
  );

  const isLotsloading = useObserver(() => lotsAsync.loading);

  return {
    lots,
    isLotsloading,
  };
};
