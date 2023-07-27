import { differenceBy, orderBy, unionBy } from 'lodash';
import { useObserver } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { SM } from '../../../App';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import FBAutocompleteAsyncState from '../FBAutocompleteAsync/FBAutocompleteAsync.state';
import FBAutocompleteAsyncStore from '../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { FBAutocompleteAsyncOption } from '../FBAutocompleteAsync/FBAutocompleteAsync.types';
import FBStore from '../FBStore/FBStore';
import { FB } from '../helpers';
import { FBPartVendorsProps, VendorData, VendorOption } from './types';
import { getVendorData } from './utils';

const prepareVendorItems = (items: VendorData[]) => orderBy(items ?? [], 'primary', 'desc');

export const withFBPartVendors = <T extends FBPartVendorsProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    name = '',
    disabled,
    ...props
  }: T) => {
    const dispatch = useDispatch();
    const { formState, workspaceState } = FB.useStores();
    const { _formState } = SM.useStores();
    const [vendorData, setVendorData] = useState<VendorData[]>(prepareVendorItems(getVendorData()));

    const updateVendorItems = (updatedVendorItems: VendorData[]) => {
      setVendorData(prepareVendorItems(updatedVendorItems));
    };

    // TODO - partial
    const updateState = (updatedVendorData: VendorData[]) => {
      updateVendorItems(updatedVendorData);
      formState?.setFieldValue(name, updatedVendorData);
      formState?.setFieldAutosave(name);

      if (disabled && isEditable) {
        _formState?.setLoading(true);
        Promise.resolve(
          workspaceState?.updateDocRevById({ formInput: { [name]: updatedVendorData } }, workspaceState?.id),
        ).then(() => {
          workspaceState?.setFormInputSync(name, updatedVendorData);
          if (workspaceState?.id && FBStore?.isHistoryTabSelected) {
            dispatch(documentRevisionsActions.loadAudit(workspaceState?.id));
          }
        }).finally(() => {
          _formState?.setLoading(false);
        });
      }
    };

    const prepareVendorData = (item: VendorData) => ({
      ...item,
    });

    const deleteVendorData = (item: VendorData) => {
      const updatedVendorData = differenceBy(vendorData, [item], 'id');
      updateState(updatedVendorData);
    };

    const updateVendorData = (item: VendorData) => {
      const updatedVendorData = unionBy([prepareVendorData(item)], vendorData, 'id');
      updateState(updatedVendorData);
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
      setVendorData([...vendorData, item]);
    };

    return Component({
      ...props as T,
      name,
      vendorData,
      disabled: !isEditable,
      vendors,
      addVendorData,
      updateVendorData,
      deleteVendorData,
    });
  };

  return (props: T) => Comp(props);
};
