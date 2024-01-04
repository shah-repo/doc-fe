import { isNil } from 'lodash';
import { EditableAllocationItem } from '../../interface';
import { ADD_FIELD, CELL_EMPTY_VALUE, MODE_FIELD } from './constants';

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
