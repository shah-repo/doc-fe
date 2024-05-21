import { isNil, isNumber } from 'lodash';
import { EditableAllocationItem } from '../../interface';
import { ADD_FIELD, CELL_EMPTY_VALUE, MODE_FIELD } from './constants';

export const isAddAllocationItem = (dataItem: EditableAllocationItem): boolean => {
  return dataItem[ADD_FIELD] ?? false;
};

export const isEditAllocItem = (dataItem: EditableAllocationItem): boolean => {
  return (dataItem[MODE_FIELD] || dataItem[ADD_FIELD]) ?? false;
};

export const getCellValue = (dataItem: EditableAllocationItem, field?: string): string => {
  return ((field && dataItem[field]) ?? CELL_EMPTY_VALUE) as string;
};

export const getParsedFieldValue = (field) => {
  if (field === '' || isNil(field)) {
    return 0;
  }
  return isNumber(field) ? field ?? 0 : parseInt(field) ?? 0;
};
