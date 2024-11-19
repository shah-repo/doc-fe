import { translate } from '../../../common/intl';
import { LotStatus } from '../../../state/ducks/documentRevisions/types';
import { getLotStatusLabel } from '../../components/common/header/HeaderLotStatus';
import { OptionType } from '../../components/forms/fields/Autocomplete/types';
import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { FB } from '../helpers';
import { EMPTY_PLACEHOLDER, TYPE_OPTIONS } from './constants';
import { DetailsObj, EditableLHRSummaryItem } from './types';

export const getExcelColumns = (columns: Array<ColumnDefinition<EditableLHRSummaryItem>>): Array<ColumnDefinition<EditableLHRSummaryItem>> => {
  return [...columns].filter(col => col.show).map(col => {
    switch (col.field) {
      case 'mpiId':
        return { ...col, field: 'stepOrMPI', title: translate(col.title) };
      case 'plannedId':
        return { ...col, field: 'plannedDocId', title: translate(col.title) };
      case 'actualId':
        return { ...col, field: 'actualDocId', title: translate(col.title) };
      case 'lotOrEquipment':
        return { ...col, field: 'lotOrEqDocId', title: translate(col.title) };
      default:
        return { ...col, title: translate(col.title) };
    }
  });
};

export const getExcelData = (
  LHRSummaryItemList: EditableLHRSummaryItem[],
  availableUsers: OptionType[],
): Array<ColumnDefinition<EditableLHRSummaryItem>> =>
  LHRSummaryItemList.map(item => {
    const modifiedItem = {
      ...item,
      type: getTypeOptionLabelByValue(item.type),
      customMpiId: getDisplayStepAndMpiValue(item.step, item?.stepOrMpiDetails),
      plannedDocId: getDisplayDocumentByDetailsObj(item?.plannedDetails),
      actualDocId: getDisplayDocumentByDetailsObj(item?.actualDetails),
      lotOrEqDocId: getDisplayDocumentByDetailsObj(item?.lotOrEquipmentDetails),
      ...(item.expiryDate && { expiryDate: item.expiryDate }),
      issue: getDisplayDocumentByDetailsObj(item?.issueDetails),
      lotStatus: getLotStatusLabel(item.lotStatus as LotStatus),
      ...(item.calDueDate && { calDueDate: item.calDueDate }),
      ...(item.pmDueDate && { pmDueDate: item.pmDueDate }),
      ...(item.recordCreationDate && { recordCreationDate: item.recordCreationDate }),
      enteredBy: FB.isUUID(item.enteredBy)
        ? availableUsers.find(user => user.value === item.enteredBy)?.label ?? item.enteredBy
        : item.enteredBy,
    };

    return modifiedItem;
  });

export const getDisplayDocumentByDetailsObj = (object?: DetailsObj): string => {
  const { docId, displayRevision, documentId, value } = object ?? {};
  return documentId && value
    ? getDisplayDocument(docId, displayRevision)
    : value ?? EMPTY_PLACEHOLDER;
};

export const getDisplayDocument = (docId?: string, displayRevision?: string): string => {
  return `${docId ?? ''} - ${displayRevision ?? ''}`;
};

export const processData = (
  data: EditableLHRSummaryItem[],
  availableUsers: OptionType[],
): EditableLHRSummaryItem[] => {
  return data?.map(item => {
    const modifiedItem = {
      ...item,
      customMpiId: getDisplayDocumentByDetailsObj(item?.stepOrMpiDetails),
      customPlannedId: getDisplayDocumentByDetailsObj(item?.plannedDetails),
      customActualDocId: getDisplayDocumentByDetailsObj(item?.actualDetails),
      customLotOrEquipment: getDisplayDocumentByDetailsObj(item?.lotOrEquipmentDetails),
      customIssue: getDisplayDocumentByDetailsObj(item?.issueDetails),
      customEnteredBy: FB.isUUID(item.enteredBy)
        ? availableUsers.find(user => user.value === item.enteredBy)?.label ?? item.enteredBy
        : item.enteredBy,
    };

    return modifiedItem;
  });
};

export const getTypeOptionLabelByValue = (value: string): string | undefined => {
  return TYPE_OPTIONS.find((option) => option.value === value)?.label;
};

const getDisplayStepAndMpiValue = (step?: string, stepOrMpiDetails?: DetailsObj): string => {
  const customMpiIdValue = getDisplayDocumentByDetailsObj(stepOrMpiDetails);
  return !step ? `/${customMpiIdValue}` : (customMpiIdValue === step) ? `${step}/` : `${step}/${customMpiIdValue}`;
};
