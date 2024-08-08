import { reaction } from 'mobx';
import React from 'react';
import { FB, FBAutocompleteAsyncState, FBProcedureItemProps } from '..';
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
    name,
    ...props
  }: T) => {
    // MARK: @config
    const { procedureState } = FB.useStores();
    const autocompleteAsyncState = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, { });
    const [lotDocId, setLotDocId] = React.useState(lotId);
    React.useEffect(() => {
      if (FB.isUUID(getLot?.(lotId) ?? '') && !FBAutocompleteAsyncStore.getValue<DocumentRevision>(procedureState?.lotsId, lotId)) {
        autocompleteAsyncState.fetchAutocompleteOption(lotId as string, procedureState?.lotsId);
      } else {
        setLotDocId(getLot?.(lotId));
      }
    }, [lotId]);
    // MARK: @methods
    React.useEffect(() => reaction(
      () => autocompleteAsyncState?.autocompleteValueApi.data,
      (data) => {
        setLotDocId(data?.document.docId);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);
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
