import { isNil } from 'lodash';
import { AllocationItem, EditableAllocationItem } from '../../interface';
import { ADD_FIELD, CELL_EMPTY_VALUE, MODE_FIELD, SUB_ITEMS_FIELD } from './constants';

export const isAddAllocationItem = (dataItem: EditableAllocationItem): boolean => {
  return dataItem[ADD_FIELD] ?? false;
};

export const isEditAllocItem = (dataItem: EditableAllocationItem): boolean => {
  return (dataItem[MODE_FIELD] || dataItem[ADD_FIELD]) ?? false;
};

export const enableFieldAfterPartSelection = (dataItem: EditableAllocationItem, docId: string): boolean => {
  return isAddAllocationItem(dataItem) ? !isNil(docId) : true;
};

export const getCellValue = (dataItem: EditableAllocationItem, field?: string): string => {
  return ((field && dataItem[field]) ?? CELL_EMPTY_VALUE) as string;
};

export const updateDataAtLevels = (data?: AllocationItem[], levels?: number[], newValue?: EditableAllocationItem, isUpdate?: boolean): AllocationItem[] | undefined => {
  if (!data) { return; }
  if (levels?.length === 0 && newValue) {
    if (isUpdate) {
      data.push(newValue);
    } else {
      const index = data.length - 1;
      if (index > -1) {
        data.splice(index, 1);
      }
    }
    return;
  }
  if (!levels) { return; }
  const currentLevel = levels[0];
  if (currentLevel >= data.length) {
    return data;
  }
  const updatedData = data.map((item, index) => {
    if (index === currentLevel) {
      updateDataAtLevels(item ? item[SUB_ITEMS_FIELD] : item, levels?.slice(1), newValue, isUpdate);
    }
    return item;
  });
  return updatedData;
};
