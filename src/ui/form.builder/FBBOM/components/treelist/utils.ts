import { isNil } from 'lodash';
import { ADD_FIELD, MODE_FIELD } from '../../constants';
import { BOM, EditableBOM } from '../../interface';
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

export const isOfSameParent = (arr1: number[], arr2: number[]): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length - 1; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
};

export const processBOMData = (bomTreeRelations: BOM[], parentRevDetails: BOM): BOM[] => {
  const bomList: BOM[] = bomTreeRelations.concat(parentRevDetails);

  const hashTable = {};
  bomList.forEach((aData: BOM) => {
    hashTable[aData.id] = { ...aData, childNodes: [] };
  });

  const dataTree: any[] = [];
  bomList.forEach((aData: BOM) => {
    if (aData.parentNodeRevId) {
      hashTable[aData.parentNodeRevId].childNodes.push(
        { ...hashTable[aData.id], ...{ parentNodeRevId: aData.parentNodeRevId, parentNodeDocumentId: hashTable[aData.parentNodeRevId].documentId } },
      );
    } else {
      dataTree.push(hashTable[aData.id]);
    }
  });

  return dataTree;
};
