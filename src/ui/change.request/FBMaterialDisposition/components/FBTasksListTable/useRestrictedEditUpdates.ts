import { isEmpty, pick } from 'lodash';
import { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { materialDispositionActions } from '../../../../../state/ducks/materialDisposition';
import { taskActions } from '../../../../../state/ducks/tasks';
import { toastError } from '../../../../components/notifications';
import FBDataStore from '../../../../form.builder/FBStore/FBDataStore';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import { changeRequestPreviewPath } from '../../../utils/paths';
import { FIELDS_TO_PICK } from '../FBMaterialDispositionTable/constants';
import { EditableTLItem } from './types';

export const useRestrictedEditUpdates = (changeRequestId: string) => {
  const history = useHistory();
  const isLoadingRef = useRef(false);
  const updateTask = useActionCreator(taskActions.updateTask);
  const updateItem = useActionCreator(materialDispositionActions.updateMDItem);

  const updateTaskAsync = useAsync({ onError: toastError });
  const partAsync = useAsync({ onError: toastError });

  const updateTaskItem = (item: Partial<EditableTLItem>) => {
    const payload = {
      instruction: item.instruction,
      employeeIds: item.employeeResponse?.map((e) => e.employeeId),
      partOfId: FBDataStore.partOfIdToUse,
      employeeUpdates: item.employeeResponse?.map((e) => ({ employeeId: e.employeeId })),
    };

    return updateTaskAsync.start(() => updateTask(FBDataStore.partOfIdToUse, item.taskId, payload, partAsync));
  };

  const triggerTaskListUpdates = async () => {
    const data = FBDataStore.getTLTableData ?? [];
    const updatedIds = FBDataStore.getTLUpdatedDataIds ?? [];
    const updatedItems = data.filter((item) => updatedIds.includes(item.taskId));

    if (updatedItems.length === 0) return;

    const promises = updatedItems.map(updateTaskItem);
    FBDataStore.setTLTableData([]);
    await Promise.all(promises);
  };

  const triggerMDTableUpdates = async () => {
    const data = FBDataStore.getMDTableData ?? [];
    const updatedIds = FBDataStore.getMDUpdatedDataIds ?? [];
    const updatedItems = data.filter((item) => updatedIds.includes(item.id));

    if (isEmpty(updatedItems)) return;

    const partToSave = {
      materialDispositionEntryUpdates: updatedItems.map((item) => ({
        materialDispositionId: item.id,
        ...pick(item, FIELDS_TO_PICK),
      })),
    };

    FBDataStore.setMDTableData([]);
    await partAsync.start(() => updateItem(changeRequestId, partToSave, partAsync));
  };

  const triggerRestrictEditUpdates = async () => {
    isLoadingRef.current = true;
    try {
      await Promise.all([triggerTaskListUpdates(), triggerMDTableUpdates()]);
    } finally {
      isLoadingRef.current = false;
      changeRequestId && history.push(changeRequestPreviewPath(changeRequestId));
    }
  };

  return {
    triggerRestrictEditUpdates,
    isLoading: isLoadingRef.current,
  };
};
