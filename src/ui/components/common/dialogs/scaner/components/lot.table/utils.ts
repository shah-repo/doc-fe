import { useObserver } from 'mobx-react';
import { useEffect, useState } from 'react';
import { DocumentRevision } from '../../../../../../../state/ducks/documentRevisions/types';
import { lhrSummaryActions } from '../../../../../../../state/ducks/LHRSummary';
import FBAutocompleteAsyncStore from '../../../../../../form.builder/FBAutocompleteAsync/FBAutocompleteAsync.store';
import { FBAutocompleteAsyncOption } from '../../../../../../form.builder/FBAutocompleteAsync/FBAutocompleteAsync.types';
import useActionCreator from '../../../../../../hooks/useActionCreator';
import useAsync from '../../../../../../hooks/useAsync';
import { UnitOption } from './types';

export const useOptions = (partId) => {
  const [lots, setLots] = useState<DocumentRevision[]>([]);
  const fetchLotsByPartId = useActionCreator(lhrSummaryActions.fetchLotsByPartId);

  const fetchPartLotsAsync = useAsync({
    onSuccess: (data: DocumentRevision[] = []) => {
      setLots(data);
    },
  });

  useEffect(() => {
    partId && fetchPartLotsAsync.start(fetchLotsByPartId, partId, fetchPartLotsAsync);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const units = useObserver(() => {
    const asyncData = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.unitMeasures) as Map<
    string,
    UnitOption
    >;
    return asyncData ? Array.from(asyncData.values()).map((item) => item.text) : [];
  });

  return {
    units,
    lots,
  };
};
