import { isNil } from 'lodash';
import { DocumentRevisionStatus } from '../../../../../state/ducks/documentRevisions/types';
import { BOM, EditableBOM } from '../../interface';
import { ADD_FIELD, CELL_EMPTY_VALUE, MODE_FIELD, SELECTED_PART_KEY_SEPARATOR, SUB_ITEMS_FIELD } from './constants';
import { CustomTreeListColumnProps } from './interface';

export const isAddOnly = (dataItem: EditableBOM): boolean => {
  return dataItem[ADD_FIELD] ?? false;
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

export const hasSameParent = (arr1: number[], arr2: number[]): boolean => {
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

const getARID = (dataItem: BOM) => {
  const changeReqDetails = dataItem?.changeRequestDetails;
  const arID = changeReqDetails?.crId;
  if (
    [
      DocumentRevisionStatus.Approved,
      DocumentRevisionStatus.PendingChange,
      DocumentRevisionStatus.InReview,
    ].includes(dataItem?.status)
  ) {
    return arID;
  }
};

const getHasChanges = (dataItem: BOM) => {
  const changeReqDetails = dataItem.availableRevisions?.changeRequestDetails;
  const arID = changeReqDetails?.crId;
  const isReleased = dataItem.availableRevisions?.isReleased;

  if (!dataItem.availableRevisions || isReleased) {
    return CELL_EMPTY_VALUE;
  }
  if (!changeReqDetails) {
    return dataItem.availableRevisions?.displayRevision;
  }
  return arID;
};

export const processBOMData = (bomTreeRelations: BOM[], parentRevDetails: BOM): EditableBOM[] => {
  bomTreeRelations.unshift(parentRevDetails);
  const dataTree: EditableBOM[] = [];

  bomTreeRelations = bomTreeRelations.map(relation => ({
    ...relation,
    arId: getARID(relation),
    hasChanges: getHasChanges(relation),
    childNodes: [],
  }));

  bomTreeRelations.reverse();
  bomTreeRelations.forEach((aData: BOM) => {
    if (aData.parentNodeRevId) {
      const parentPartRelations = bomTreeRelations.filter(relation => relation.id === aData.parentNodeRevId);
      parentPartRelations.forEach(parentPartRelation => {
        parentPartRelation.childNodes?.unshift(
          Object.assign({
            ...aData,
            id: `${aData.id}${SELECTED_PART_KEY_SEPARATOR}${aData.parentNodeRevId}${SELECTED_PART_KEY_SEPARATOR}${aData.depth}${SELECTED_PART_KEY_SEPARATOR}${aData.uniqid}`,
            parentNodeDocumentId: parentPartRelation.documentId,
            isParentOwner: parentPartRelation.isOwner,
            parentDocId: parentPartRelation.docId,
            isEditEnabled: [DocumentRevisionStatus.Draft, DocumentRevisionStatus.PendingChange].includes(parentPartRelation.status),
            hasChanges: getHasChanges(aData),
            arId: getARID(aData),
          }),
        );
      });
    } else {
      dataTree.push({ ...aData, [MODE_FIELD]: false });
    }
  });
  return dataTree;
};

export const updateDataAtLevels = (data?: BOM[], levels?: number[], newValue?: EditableBOM, isUpdate?: boolean): BOM[] | undefined => {
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

export const getExcelColumns = (columns: CustomTreeListColumnProps[]): CustomTreeListColumnProps[] => {
  return [...columns].map(col => {
    switch (col.field) {
      case 'arId':
        return { ...col, field: 'changeRequestDetails.crId' };
      case 'customDocId':
        return { ...col, field: 'docId' };
      case 'hasPrimaryAttachment':
        return { ...col, field: 'primaryAttachmentDetails.name', width: '240px' };
      case 'hasAttachments':
        return { ...col, field: 'attachmentsCount', width: '100px' };
      case 'vendors':
        return { ...col, field: 'vendorsCount' };
      case 'alternatePartsList':
        return { ...col, field: 'alternatePartsCount', width: '130px' };
      default:
        return col;
    }
  });
};

export const getChildPartId = (part: EditableBOM): string => {
  return part?.id?.split(SELECTED_PART_KEY_SEPARATOR)[0];
};
