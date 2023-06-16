import { useObserver } from 'mobx-react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FB, FBAutocompleteAsyncOption, FBAutocompleteAsyncState } from '..';
import { authSelectors } from '../../../state/ducks/auth';
import { companySelectors } from '../../../state/ducks/company';
import FBAutocompleteAsyncStore from '../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { BuildOption, FBLotTransactionsProps, LotTransfer } from './types';

export const withFBLotTransactions = <T extends FBLotTransactionsProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    name = '',
    ...props
  }: T) => {
    const { formState, workspaceState } = FB.useStores();
    const locations = useSelector(companySelectors.getAllLocations);
    const employees = useSelector(companySelectors.getAllEmployees) ?? [];
    const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);
    const transfers = useObserver(() => (workspaceState?.formInputSync.get(name) ?? []) as LotTransfer[]);

    const prepareLotTransfer = (transfer: LotTransfer) => ({
      ...transfer,
      by: currentEmployeeId,
    });

    const addLotTransfer = (transfer: LotTransfer) => {
      formState?.setFieldValue(name, [...transfers, prepareLotTransfer(transfer)]);
      formState?.setFieldAutosave(name);
    };

    const updateLotTransfer = (editedTransfer: LotTransfer) => {
      const updatedTransfers = transfers.map(transfer => ({
        ...(transfer.id === editedTransfer.id ? prepareLotTransfer(editedTransfer) : transfer),
      }));

      formState?.setFieldValue(name, updatedTransfers);
      formState?.setFieldAutosave(name);
    };

    const autocompleteAsyncState = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {
      optionId: FBAutocompleteAsyncOption.lotBuilds,
    });

    useEffect(() => {
      autocompleteAsyncState.load();
    }, [autocompleteAsyncState]);

    const builds = useObserver(
      () => {
        const asyncData = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.lotBuilds) as Map<string, BuildOption[]>;
        return asyncData ? Array.from(asyncData.values()) : [];
      },
    );

    return Component({
      ...props as T,
      name,
      transfers,
      locations,
      employees,
      builds,
      addLotTransfer,
      updateLotTransfer,
    });
  };

  return (props: T) => Comp(props);
};
