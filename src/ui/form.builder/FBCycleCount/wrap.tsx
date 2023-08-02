import { differenceBy, get, orderBy, unionBy } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FB } from '..';
import { SM } from '../../../App';
import { getHasPermission } from '../../../common/utils/selectors';
import { authSelectors } from '../../../state/ducks/auth';
import { Permission } from '../../../state/ducks/auth/types';
import { companySelectors } from '../../../state/ducks/company';
import { documentRevisionsActions, documentRevisionsSelectors } from '../../../state/ducks/documentRevisions';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { ApplicationState } from '../../../state/reducers';
import { useOnHandQuantity } from '../FBLotTransfers/utils';
import FBStore from '../FBStore/FBStore';
import { CYCLE_COUNT_FREQUENCY_KEY, LOT_PART_SELECT_KEY } from './constants';
import { CycleCount, FBCycleCountProps } from './types';
import { getLatestRevisionId } from './utils';

const prepareCycleCounts = (cycleCounts: CycleCount[] = []) => orderBy(cycleCounts, 'date', 'desc');

export const withFBCycleCount = <T extends FBCycleCountProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    name = '',
    disabled,
    ...props
  }: T) => {
    const { formState, workspaceState } = FB.useStores();
    const { _formState } = SM.useStores();
    const employees = useSelector(companySelectors.getAllEmployees) ?? [];
    const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);
    const currentUserId = useSelector(authSelectors.currentUserId);
    const canEditCycleCount = useSelector(getHasPermission(Permission.EDIT_CYCLE_COUNT));
    const documentRevisions = useSelector((state: ApplicationState) =>
      documentRevisionsSelectors.getDocumentRevisions(state, workspaceState?.document?.document.id ?? ''),
    );
    const { onHandQuantity, onHandQuantityUnit } = useOnHandQuantity();
    const [cycleCounts, setCycleCounts] = useState<CycleCount[]>(prepareCycleCounts(workspaceState?.formInputSync.get(name) ?? []));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dispatch = useDispatch();
    const lotPartRevisionId = workspaceState?.formInputSync.get(LOT_PART_SELECT_KEY) as string;
    const docRevById = useSelector(documentRevisionsSelectors.byId);
    useEffect(() => {
      if (!lotPartRevisionId || docRevById[lotPartRevisionId]) {
        return;
      }

      dispatch(documentRevisionsActions.load(lotPartRevisionId));
    }, [lotPartRevisionId, dispatch, docRevById]);

    const cycleCountFrequency = get(docRevById, [lotPartRevisionId, 'formInput', CYCLE_COUNT_FREQUENCY_KEY]) as number;

    const { id, version, status } = workspaceState?.document ?? { version: 0 };

    const isLatestRevision = id === getLatestRevisionId(documentRevisions);
    const isReleased = status === DocumentRevisionStatus.Released;
    const isVoided = status === DocumentRevisionStatus.Voided;
    const isQuarantined = status === DocumentRevisionStatus.InReview;

    const isOwner = workspaceState?.document?.owner?.user?.id === currentUserId;
    const canEditAsOwner = !disabled || (isOwner && isQuarantined);
    const isInEditableState = (version > 1 && !isVoided) || isReleased;
    const canEditWithPermission = canEditCycleCount && isInEditableState;

    const isEditable = isLatestRevision && (canEditAsOwner || canEditWithPermission);

    const updateState = (state: CycleCount[]) => {
      setCycleCounts(prepareCycleCounts(state));
      formState?.setFieldValue(name, state);
      formState?.setFieldAutosave(name);

      if (disabled && isEditable) {
        _formState?.setLoading(true);
        Promise.resolve(
          workspaceState?.updateDocRevById({ formInput: { [name]: state } }, workspaceState?.id),
        ).then(() => {
          workspaceState?.setFormInputSync(name, state);
          if (workspaceState?.id && FBStore?.isHistoryTabSelected) {
            dispatch(documentRevisionsActions.loadAudit(workspaceState?.id));
          }
        }).finally(() => {
          _formState?.setLoading(false);
        });
      }
    };

    const prepareCycleCount = (item: CycleCount) => ({
      ...item,
      systemCount: onHandQuantity,
      by: currentEmployeeId,
    });

    const deleteCycleCount = (item: CycleCount) => {
      const updatedData = differenceBy(cycleCounts, [item], 'id');
      updateState(updatedData);
    };

    const updateCycleCount = (item: CycleCount) => {
      const updatedData = unionBy([prepareCycleCount(item)], cycleCounts, 'id');
      updateState(updatedData);
    };

    return Component({
      ...props as T,
      name,
      disabled: !isEditable,
      cycleCounts,
      employees,
      onHandQuantity,
      onHandQuantityUnit,
      cycleCountFrequency,
      updateCycleCount,
      deleteCycleCount,
    });
  };

  return (props: T) => Comp(props);
};
