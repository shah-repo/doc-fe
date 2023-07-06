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
import { documentRevisionsActions, documentRevisionsSelectors } from '../../../state/ducks/documentRevisions';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { ApplicationState } from '../../../state/reducers';
import FBAutocompleteAsyncStore from '../FBAutocompleteAsync/FBAutocompleteAsync.store';
import FBStore from '../FBStore/FBStore';
import { DocumentRevisionOption, FBLotTransactionsProps, LotTransfer } from './types';

const prepareTransfers = (transfers: LotTransfer[] = []) => orderBy(transfers, 'date', 'desc');

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
    const { _formState } = SM.useStores();
    const locations = useSelector(companySelectors.getAllLocations) ?? [];
    const employees = useSelector(companySelectors.getAllEmployees) ?? [];
    const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);
    const documentRevisions = useSelector((state: ApplicationState) =>
      documentRevisionsSelectors.getDocumentRevisions(state, workspaceState?.document?.document.id ?? ''),
    );
    const canEditLotTransfers = useSelector(getHasPermission(Permission.EDIT_LOT_TRANSFERS));
    const [transfers, setTransfers] = useState<LotTransfer[]>(prepareTransfers(workspaceState?.formInputSync.get(name) ?? []));

    const { version, status } = workspaceState?.document ?? { version: 1 };

    const isLatestRevision = version === documentRevisions.filter(
      (doc) => ![DocumentRevisionStatus.Voided, DocumentRevisionStatus.Canceled].includes(doc.status),
    ).length;

    const isFirstDraft = version === 1 && status === DocumentRevisionStatus.Draft;
    const canEditFirstDraft = !disabled;

    const isLotTransfersEditable = status !== DocumentRevisionStatus.Voided;

    const isEditable = (isFirstDraft && canEditFirstDraft) || (!isFirstDraft && isLatestRevision && isLotTransfersEditable && canEditLotTransfers);

    SM.reaction(
      () => workspaceState?.formInputSync.get(name) as LotTransfer[],
      (data) => updateLocalTransfers(data ?? []),
    );

    const updateLocalTransfers = (updatedTransfers: LotTransfer[]) => setTransfers(prepareTransfers(updatedTransfers));

    const updateState = (updatedTransfers: LotTransfer[]) => {
      updateLocalTransfers(updatedTransfers);
      formState?.setFieldValue(name, updatedTransfers);
      formState?.setFieldAutosave(name);

      if (disabled && isEditable) {
        _formState?.setLoading(true);
        Promise.resolve(
          workspaceState?.updateDocRevById({ formInput: { [name]: updatedTransfers } }, workspaceState?.id),
        ).then(() => {
          workspaceState?.setFormInputSync(name, updatedTransfers);
          if (workspaceState?.id && FBStore?.isHistoryTabSelected) {
            dispatch(documentRevisionsActions.loadAudit(workspaceState?.id));
          }
        }).finally(() => {
          _formState?.setLoading(false);
        });
      }
    };

    const prepareLotTransfer = (transfer: LotTransfer) => ({
      ...transfer,
      quantity: Math.abs(transfer.quantity),
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

    const buildsAsync = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {
      optionId: FBAutocompleteAsyncOption.lotBuilds,
    });

    const recordsAsync = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {
      optionId: FBAutocompleteAsyncOption.records,
    });

    useEffect(() => {
      buildsAsync.load();
      recordsAsync.load();
    }, [buildsAsync, recordsAsync]);

    const builds = useObserver(
      () => {
        const asyncData = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.lotBuilds) as Map<string, DocumentRevisionOption[]>;
        return asyncData ? Array.from(asyncData.values()) : [];
      },
    );

    const records = useObserver(
      () => {
        const asyncData = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.records) as Map<string, DocumentRevisionOption[]>;
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
      records,
      updateLotTransfer,
      deleteLotTransfer,
    });
  };

  return (props: T) => Comp(props);
};
