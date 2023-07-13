import { isNil } from 'lodash';
import { ADD_FIELD, MODE_FIELD } from '../../constants';
import { EditableBOM } from '../../interface';

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
