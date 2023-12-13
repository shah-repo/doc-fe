import { isNil } from 'lodash';
import { DocumentRevisionStatus } from '../../../../../state/ducks/documentRevisions/types';
import { AllocationItem, EditableAllocationItem } from '../../interface';
import { ADD_FIELD, CELL_EMPTY_VALUE, MODE_FIELD, SELECTED_PART_KEY_SEPARATOR, SUB_ITEMS_FIELD } from './constants';

export const isAddOnly = (dataItem: EditableAllocationItem): boolean => {
  return dataItem[ADD_FIELD] ?? false;
};

export const isEditAllocItem = (dataItem: EditableAllocationItem): boolean => {
  return (dataItem[MODE_FIELD] || dataItem[ADD_FIELD]) ?? false;
};

export const enableFieldAfterPartSelection = (dataItem: EditableAllocationItem, docId: string): boolean => {
  return isAddOnly(dataItem) ? !isNil(docId) : true;
};

export const getCellValue = (dataItem: EditableAllocationItem, field?: string): string => {
  return ((field && dataItem[field]) ?? CELL_EMPTY_VALUE) as string;
};

export const processAllocationTableData = (allocTreeRelations: AllocationItem[], parentRevDetails: AllocationItem): EditableAllocationItem[] => {
  allocTreeRelations.unshift(parentRevDetails);
  const dataTree: EditableAllocationItem[] = [];

  allocTreeRelations = allocTreeRelations.map(relation => ({
    ...relation,
    childNodes: [],
  }));

  allocTreeRelations.reverse();
  allocTreeRelations.forEach((aData: AllocationItem) => {
    if (aData.parentNodeRevId) {
      const parentPartRelations = allocTreeRelations.filter(relation => relation.id === aData.parentNodeRevId);
      parentPartRelations.forEach(parentPartRelation => {
        parentPartRelation.childNodes?.unshift(
          Object.assign({
            ...aData,
            id: `${aData.id}${SELECTED_PART_KEY_SEPARATOR}${aData.parentNodeRevId}${SELECTED_PART_KEY_SEPARATOR}${aData.depth}${SELECTED_PART_KEY_SEPARATOR}${aData.uniqid}`,
            parentNodeDocumentId: parentPartRelation.documentId,
            isParentOwner: parentPartRelation.isOwner,
            isEditEnabled: [DocumentRevisionStatus.Draft, DocumentRevisionStatus.PendingChange].includes(parentPartRelation.status),
          }),
        );
      });
    } else {
      dataTree.push({ ...aData, [MODE_FIELD]: false });
    }
  });
  return dataTree;
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
