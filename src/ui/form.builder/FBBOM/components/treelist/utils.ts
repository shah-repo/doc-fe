import { isNil } from 'lodash';
import { ADD_FIELD, MODE_FIELD } from '../../constants';
import { EditableBOM } from '../../interface';
import { CELL_EMPTY_VALUE } from './constants';

export const isAddOnly = (dataItem: EditableBOM): boolean => {
  return dataItem[ADD_FIELD] ?? false;
};

export const isEditOnly = (dataItem: EditableBOM): boolean => {
  return dataItem[MODE_FIELD] ?? false;
};

export const isEditBOM = (dataItem: EditableBOM): boolean => {
  return (dataItem[MODE_FIELD] || dataItem[ADD_FIELD]) ?? false;
};

export const enableFieldAfterPartSelection = (dataItem: EditableBOM, docId: string): boolean => {
  return isAddOnly(dataItem) ? !isNil(docId) : true;
};

export const getCellValue = (dataItem: EditableBOM, field?: string): string => {
  return ((field && dataItem[field]) ?? CELL_EMPTY_VALUE) as string;
};
