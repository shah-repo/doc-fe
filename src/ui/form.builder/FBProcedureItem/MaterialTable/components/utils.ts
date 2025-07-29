import { ADD_FIELD, CELL_EMPTY_VALUE, MODE_FIELD } from '../constants';
import { EditableMaterial } from '../types';

export const isAddMaterial = (dataItem: EditableMaterial): boolean => {
  return dataItem[ADD_FIELD] ?? false;
};

export const isEditMaterial = (dataItem: EditableMaterial): boolean => {
  return Boolean(dataItem[MODE_FIELD] || dataItem[ADD_FIELD]) ?? false;
};

export const getCellValue = (dataItem: EditableMaterial, field?: string): string => {
  return ((field && dataItem[field]) ?? CELL_EMPTY_VALUE) as string;
};
