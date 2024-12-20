import { reaction } from 'mobx';
import { useObserver } from 'mobx-react';
import { useEffect, useState } from 'react';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { FBEndpoint } from '../defaults/FBEndpoint';
import FBRequest from '../FBApi/FBApi.request';
import FBAutocompleteAsyncState from '../FBAutocompleteAsync/FBAutocompleteAsync.state';
import FBAutocompleteAsyncStore from '../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { FBAutocompleteAsyncOption } from '../FBAutocompleteAsync/FBAutocompleteAsync.types';
import { FB } from '../helpers';
import { PartOption, UseOptionsHook } from './types';

export const useOptions: UseOptionsHook = () => {
  const [lots, setLots] = useState<DocumentRevision[]>([]);

  const partsAsync = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {
    optionId: FBAutocompleteAsyncOption.releasedParts,
  });

  const lotsAsync = FB.useRef<FBRequest<DocumentRevision[], null>>(FBRequest, new FBRequest());

  const fetchLotsByPartId = (id: string) => {
    lotsAsync.set({
      url: `${FBEndpoint.LotsToPart}/?isShipping=true`,
      urlValues: { id },
      method: 'get',
    });
  };

  useEffect(() => {
    partsAsync.load();
  }, [partsAsync]);

  const parts = useObserver(
    () => {
      const asyncData = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.releasedParts) as Map<string, PartOption>;
      return asyncData ? Array.from(asyncData.values()) : [];
    },
  );

  const isLotsloading = useObserver(() => lotsAsync.loading);
  const isPartsloading = useObserver(() => partsAsync.loading);

  useEffect(() => reaction(
    () => lotsAsync.data,
    (data) => setLots(data as DocumentRevision[]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), []);

  return {
    lots,
    parts,
    isLotsloading,
    isPartsloading,
    fetchLotsByPartId,
  };
};
