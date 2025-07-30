import { isEmpty, pick } from 'lodash';
import { materialDispositionActions } from '../../../../../state/ducks/materialDisposition';
import { taskActions } from '../../../../../state/ducks/tasks';
import { toastError } from '../../../../components/notifications';
import FBDataStore from '../../../../form.builder/FBStore/FBDataStore';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import { FIELDS_TO_PICK } from '../FBMaterialDispositionTable/constants';
import { EditableMDItem } from '../FBMaterialDispositionTable/types';
import { EditableTLItem } from './types';

export const useRestrictedEditUpdates = () => {
  const updateTask = useActionCreator(taskActions.updateTask);
  const updateItem = useActionCreator(materialDispositionActions.updateMDItem);

  const updateTaskAsync = useAsync({
    onError: toastError,
  });
  const partAsync = useAsync({
    onError: toastError,
  });

  const updateTaskItem = (values: Partial<EditableTLItem>) => {
    const payload = {
      instruction: values?.instruction,
      employeeIds: values?.employeeResponse?.map((data) => data.employeeId),
      partOfId: FBDataStore?.partOfIdToUse,
      employeeUpdates: values?.employeeResponse?.map((data) => ({
        employeeId: data.employeeId,
      })),
    };

    updateTaskAsync.start(updateTask, FBDataStore?.partOfIdToUse, values.taskId, payload, updateTaskAsync);
  };

  const triggerTaskListUpdates = () => {
    const data = FBDataStore?.getTLTableData ?? [];
    const updatedDataItemIds = FBDataStore?.getTLUpdatedDataIds ?? [];
    const updatedData = data.filter((dataItem) => updatedDataItemIds.includes(dataItem.taskId));

    if (updatedData.length > 0) {
      updatedData.forEach(updateTaskItem);
      FBDataStore?.setTLTableData([]);
    }
  };

  const updateMaterialDispositionTableData = (data: EditableMDItem[]) => {
    const partToSave = {
      materialDispositionEntryUpdates: data.map((dataItem) => ({
        materialDispositionId: dataItem.id,
        ...pick(dataItem, FIELDS_TO_PICK),
      })),
    };
    partAsync.start(updateItem, FBDataStore.changeRequestId, partToSave, partAsync);
  };

  const triggerMDTableUpdates = () => {
    const data = FBDataStore?.getMDTableData ?? [];
    const updatedDataItemIds = FBDataStore?.getMDUpdatedDataIds ?? [];
    const updatedData = data.filter((dataItem) => updatedDataItemIds.includes(dataItem.id));
    if (!isEmpty(updatedData)) {
      updateMaterialDispositionTableData(updatedData);
      FBDataStore?.setMDTableData([]);
    }
  };

  const triggerRestrictEditUpdates = () => {
    triggerTaskListUpdates();
    triggerMDTableUpdates();
  };

  return {
    triggerRestrictEditUpdates,
  };
};
