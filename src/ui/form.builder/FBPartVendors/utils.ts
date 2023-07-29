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

export const useOptions: UseOptionsHook = () => {
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

  return {
    suppliers,
    units,
    statuses,
  };
};
