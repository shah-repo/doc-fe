import { useObserver } from 'mobx-react';
import { useEffect, useState } from 'react';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import FBAutocompleteAsyncState from '../FBAutocompleteAsync/FBAutocompleteAsync.state';
import FBAutocompleteAsyncStore from '../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { FBAutocompleteAsyncOption } from '../FBAutocompleteAsync/FBAutocompleteAsync.types';
import { FB } from '../helpers';
import { VendorData, VendorDataProps, VendorOption } from './types';
import { getVendorData } from './utils';

export const withFBVendorData = <T extends VendorDataProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    name = '',
    disabled,
    ...props
  }: T) => {
    const { workspaceState } = FB.useStores();

    const [items, setItems] = useState<VendorData[]>(getVendorData());

    const deleteLotTransfer = (item: VendorData) => {
      console.log('item-delete', item);
    };

    const autocompleteAsyncState = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {
      optionId: FBAutocompleteAsyncOption.suppliers,
    });

    useEffect(() => {
      autocompleteAsyncState.load();
    }, [autocompleteAsyncState]);

    const vendors = useObserver(
      () => {
        const asyncData = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.suppliers) as Map<string, VendorOption[]>;
        return asyncData ? Array.from(asyncData.values()) : [];
      },
    );

    const isFirstDraft = !disabled && workspaceState?.document?.version === 1;
    const userCanEditReleased = workspaceState?.document?.status === DocumentRevisionStatus.Released;
    const userCanEditNextDraft = (
      !disabled || (
        workspaceState?.document?.status === DocumentRevisionStatus.Draft
        && workspaceState?.document?.version > 1
      )
    );

    const isEditable = isFirstDraft || userCanEditReleased || userCanEditNextDraft;

    const addVendorData = (item: VendorData) => {
      setItems([...items, item]);
    };

    return Component({
      ...props as T,
      name,
      items,
      disabled: !isEditable,
      addVendorData,
      vendors,
      deleteLotTransfer,
    });
  };

  return (props: T) => Comp(props);
};
