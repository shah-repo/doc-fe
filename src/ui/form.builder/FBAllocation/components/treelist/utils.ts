import { isNil, isNumber } from 'lodash';
import { AllocationItem, EditableAllocationItem } from '../../interface';
import { ADD_FIELD, CELL_EMPTY_VALUE, MODE_FIELD, SUB_ITEMS_FIELD } from './constants';

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

export const processAllocationData = (data?: AllocationItem[]) => {
  data?.forEach(part => {
    if (part) {
      part.revision = part.displayRevision;
      part.usedUnit = part.unit;
    part[SUB_ITEMS_FIELD]?.forEach(lot => {
      lot.expiryDate = '18/02/2024';
      lot.hasLotExpired = Math.random() > 0.5; // remove once lot expired data coming from BE
      lot.revision = part.displayRevision;
      lot.usedUnit = lot.lotUsedUnit;
    });
    }
    return part;
  });

  return data ?? [];
};
