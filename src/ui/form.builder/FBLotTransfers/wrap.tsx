import { differenceBy, orderBy, unionBy } from 'lodash';
import { useObserver } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FB, FBAutocompleteAsyncOption, FBAutocompleteAsyncState } from '..';
import { SM } from '../../../App';
import { authSelectors } from '../../../state/ducks/auth';
import { companySelectors } from '../../../state/ducks/company';
import FBAutocompleteAsyncStore from '../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { BuildOption, FBLotTransactionsProps, LotTransfer } from './types';

const prepareTransfers = (transfers: LotTransfer[]) => orderBy(transfers ?? [], 'date', 'desc');

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
    const [transfers, setTransfers] = useState<LotTransfer[]>(prepareTransfers(workspaceState?.formInputSync.get(name)));

    const updateLocalTransfers = (updatedTransfers: LotTransfer[]) => {
      setTransfers(prepareTransfers(updatedTransfers));
    };

    SM.reaction(
      () => workspaceState?.formInputSync.get(name) as LotTransfer[],
      (data) => updateLocalTransfers(data),
    );

    const updateState = (updatedTransfers: LotTransfer[]) => {
      updateLocalTransfers(updatedTransfers);
      formState?.setFieldValue(name, updatedTransfers);
      formState?.setFieldAutosave(name);
    };

    const prepareLotTransfer = (transfer: LotTransfer) => ({
      ...transfer,
      by: currentEmployeeId,
    });

    const deleteLotTransfer = (transfer: LotTransfer) => {
      const updatedTransfers = differenceBy(transfers, [transfer], 'id');
      updateState(updatedTransfers);
    };

    const updateLotTransfer = (transfer: LotTransfer) => {
      const updatedTransfers = unionBy([prepareLotTransfer(transfer)], transfers, 'id');
      updateState(updatedTransfers);
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
      updateLotTransfer,
      deleteLotTransfer,
    });
  };

  return (props: T) => Comp(props);
};
