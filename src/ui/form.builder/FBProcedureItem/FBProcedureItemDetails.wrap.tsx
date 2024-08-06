import { reaction } from 'mobx';
import { useObserver } from 'mobx-react';
import React from 'react';
import { FB, FBAutocompleteAsyncState, FBProcedureItemProps, FBProcedureItemState } from '..';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import FBAutocompleteAsyncStore from '../FBAutocompleteAsync/FBAutocompleteAsync.store';

export const withFBProcedureItemDetails = <T extends FBProcedureItemProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onClick,
    handleRemove,
    getItem,
    getLot,
    lotId,
    lotDocId,
    name,
    ...props
  }: T) => {
    // MARK: @config
    const { procedureState } = FB.useStores();
    const autocompleteAsyncState = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, { });
    const procedureItemState = FB.useRef<FBProcedureItemState>(FBProcedureItemState, lotId);
    React.useEffect(() => {
      if (FB.isUUID(getLot?.(lotId) ?? '') && !FBAutocompleteAsyncStore.getValue<DocumentRevision>(procedureState?.lotsId, lotId)) {
        autocompleteAsyncState.fetchAutocompleteOption(lotId as string, procedureState?.lotsId);
      } else {
        procedureItemState.setLotDocId(getLot?.(lotId));
      }
    }, [lotId]);
    // MARK: @methods
    React.useEffect(() => reaction(
      () => autocompleteAsyncState?.autocompleteValueApi.data,
      (data) => {
        console.log({ data, docid: data?.document.docId });
        procedureItemState.setLotDocId(data?.document.docId);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);
    // MARK: @observer
    useObserver(() => {
      lotDocId = procedureItemState.lotDocId;
    });
    return Component({
      ...(props as T),
      onClick,
      handleRemove,
      getItem,
      getLot,
      lotDocId,
      name,
    });
  };
  Comp.displayName = 'withFBProcedureItemDetails';
  return Comp;
};
