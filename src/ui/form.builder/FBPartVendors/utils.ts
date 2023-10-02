import { reaction } from 'mobx';
import { useObserver } from 'mobx-react';
import { useEffect, useState } from 'react';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { documentRevisionQueryStatus } from '../../document.revision/utils/helpers';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import FBAutocompleteAsyncState from '../FBAutocompleteAsync/FBAutocompleteAsync.state';
import FBAutocompleteAsyncStore from '../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { FBAutocompleteAsyncOption } from '../FBAutocompleteAsync/FBAutocompleteAsync.types';
import { FB } from '../helpers';
import { SupplierOption, UnitOption, UseOptionsHook } from './types';

export const useOptions: UseOptionsHook = (vendors) => {
  const getStatusesAction = useActionCreator(documentRevisionsActions.getDocRevStatuses);
  const [statuses, saveStatuses] = useState<DocumentRevisionStatus[]>([]);
  const async = useAsync<DocumentRevisionStatus[]>({ onSuccess: response => saveStatuses(response ?? []) });

  const suppliersAsync = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {
    optionId: FBAutocompleteAsyncOption.suppliers,
  });

  const unitsAsync = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {
    optionId: FBAutocompleteAsyncOption.unitMeasures,
  });

  useEffect(() => {
    suppliersAsync.load();
    unitsAsync.load();
  }, [suppliersAsync, unitsAsync]);

  useEffect(() => {
    async.start(getStatusesAction, async, documentRevisionQueryStatus(), [], 'Supplier');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const suppliers = useObserver(
    () => {
      const asyncData = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.suppliers) as Map<string, SupplierOption>;
      return asyncData ? Array.from(asyncData.values()) : [];
    },
  );

  const units = useObserver(
    () => {
      const asyncData = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.unitMeasures) as Map<string, UnitOption>;
      return asyncData ? Array.from(asyncData.values()).map(item => item.text) : [];
    },
  );

  useEffect(() => {
    if (suppliersAsync.loading) {
      return;
    }
    const missedVendors = vendors.filter(
      vendor => !vendor.displayStatus && !suppliers.some(option => option.id === vendor.id),
    );
    missedVendors.forEach(vendor => suppliersAsync.fetchAutocompleteOption(vendor.id, FBAutocompleteAsyncOption.suppliers));
  }, [suppliers, vendors]);

  useEffect(() => reaction(
    () => suppliersAsync.autocompleteValueApi.data,
    (data) => {
      if (data) {
        FBAutocompleteAsyncStore.add(FBAutocompleteAsyncOption.suppliers, data.id, {
          ...data,
          isUnselectable: true,
        });
      }
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), []);

  return {
    suppliers,
    units,
    statuses,
  };
};
