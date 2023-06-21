import { differenceBy, orderBy, unionBy } from 'lodash';
import { useObserver } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FB, FBAutocompleteAsyncOption, FBAutocompleteAsyncState } from '..';
import { SM } from '../../../App';
import { getHasPermission } from '../../../common/utils/selectors';
import { authSelectors } from '../../../state/ducks/auth';
import { Permission } from '../../../state/ducks/auth/types';
import { companySelectors } from '../../../state/ducks/company';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import FBAutocompleteAsyncStore from '../FBAutocompleteAsync/FBAutocompleteAsync.store';
import FBStore from '../FBStore/FBStore';
import { BuildOption, FBLotTransactionsProps, LotTransfer } from './types';

const prepareTransfers = (transfers: LotTransfer[]) => orderBy(transfers ?? [], 'date', 'desc');

export const withFBLotTransactions = <T extends FBLotTransactionsProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    name = '',
    disabled,
    ...props
  }: T) => {
    const dispatch = useDispatch();
    const { formState, workspaceState } = FB.useStores();
    const locations = useSelector(companySelectors.getAllLocations);
    const employees = useSelector(companySelectors.getAllEmployees) ?? [];
    const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);
    const [transfers, setTransfers] = useState<LotTransfer[]>(prepareTransfers(workspaceState?.formInputSync.get(name)));
    const canEditLotTransfers = useSelector(getHasPermission(Permission.EDIT_LOT_TRANSFERS));

    const updateLocalTransfers = (updatedTransfers: LotTransfer[]) => {
      setTransfers(prepareTransfers(updatedTransfers));
    };

    workspaceState?.setLoading(true);

    const isFirstDraft = !disabled && workspaceState?.document?.version === 1;
    const userCanEditReleased = workspaceState?.document?.status === DocumentRevisionStatus.Released && canEditLotTransfers;
    const userCanEditNextDraft = (
      !disabled || (
        workspaceState?.document?.status === DocumentRevisionStatus.Draft
        && workspaceState?.document?.version > 1
        && canEditLotTransfers
      )
    );
    const isEditable = isFirstDraft || userCanEditReleased || userCanEditNextDraft;

    SM.reaction(
      () => workspaceState?.formInputSync.get(name) as LotTransfer[],
      (data) => updateLocalTransfers(data),
    );

    const updateState = (updatedTransfers: LotTransfer[]) => {
      updateLocalTransfers(updatedTransfers);
      formState?.setFieldValue(name, updatedTransfers);
      formState?.setFieldAutosave(name);

      if (disabled && isEditable) {
        workspaceState?.setLoading(true);
        Promise.resolve(
          workspaceState?.updateDocRevById({
            formInput: {
              ...workspaceState?.document?.formInput,
              [name]: updatedTransfers,
            },
          }, workspaceState?.id),
        ).then(() => {
          console.log('then');
          workspaceState?.setFormInputSync(name, updatedTransfers);
          if (workspaceState?.id && FBStore?.isHistoryTabSelected) {
            dispatch(documentRevisionsActions.loadAudit(workspaceState?.id));
          }
        }).finally(() => {
          console.log('finally');
          workspaceState?.setLoading(false);
        });
      }
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
      disabled: !isEditable,
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
