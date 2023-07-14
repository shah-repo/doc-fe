import { isNil } from 'lodash';
import { ADD_FIELD, MODE_FIELD } from '../../constants';
import { EditableBOM } from '../../interface';
import { CELL_EMPTY_VALUE } from './constants';

export const isAddOnly = (dataItem: EditableBOM): boolean => {
  return Boolean(dataItem[ADD_FIELD]);
};

export const isEditOnly = (dataItem: EditableBOM): boolean => {
  return Boolean(dataItem[MODE_FIELD]);
};

export const isEditBOM = (dataItem: EditableBOM): boolean => {
  return Boolean(dataItem[MODE_FIELD] || dataItem[ADD_FIELD]);
};

export const enableFieldAfterPartSelection = (dataItem: EditableBOM, docId: string): boolean => {
  return isAddOnly(dataItem) ? Boolean(dataItem[ADD_FIELD] && !isNil(docId)) : true;
};

export const getCellValue = (dataItem: EditableBOM, field?: string): string => {
  return ((field && dataItem[field]) ?? CELL_EMPTY_VALUE) as string;
};
