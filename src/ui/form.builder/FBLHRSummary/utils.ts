import { translate } from '../../../common/intl';
import { getFormattedDateString, MomentFormats } from '../../../common/utils/date';
import { OptionType } from '../../components/forms/fields/Autocomplete/types';
import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { FB } from '../helpers';
import { EMPTY_PLACEHOLDER } from './constants';
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
      stepOrMPI: `${item.step}/${getDisplayDocumentByDetailsObj(item?.stepOrMpiDetails)}`,
      plannedDocId: getDisplayDocumentByDetailsObj(item?.plannedDetails),
      actualDocId: getDisplayDocumentByDetailsObj(item?.actualDetails),
      lotOrEqDocId: getDisplayDocumentByDetailsObj(item?.lotOrEquipmentDetails),
      ...(item.expiryDate && { expiryDate: getFormattedDateString(item.expiryDate ?? '', MomentFormats.MonthDateYearTwoDigit) }),
      issue: getDisplayDocumentByDetailsObj(item?.issueDetails),
      ...(item.calDueDate && { calDueDate: getFormattedDateString(item.calDueDate ?? '', MomentFormats.MonthDateYearTwoDigit) }),
      ...(item.pmDueDate && { pmDueDate: getFormattedDateString(item.pmDueDate ?? '', MomentFormats.MonthDateYearTwoDigit) }),
      ...(item.date && { date: getFormattedDateString(item.date ?? '', MomentFormats.MonthDateYearTwoDigit) }),
      enteredBy: FB.isUUID(item.enteredBy)
        ? availableUsers.find(user => user.value === item.enteredBy)?.label ?? item.enteredBy
        : item.enteredBy,
    };

    return modifiedItem;
  });

const getDisplayDocumentByDetailsObj = (object?: DetailsObj): string => {
  const { docId, displayRevision, documentId, value } = object ?? {};
  return documentId && value
    ? `${docId ?? ''} - ${displayRevision ?? ''}`
    : value ?? EMPTY_PLACEHOLDER;
};

export const getDisplayDocument = (docId?: string, displayRevision?: string): string => {
  return `${docId ?? ''} - ${displayRevision ?? ''}`;
};
