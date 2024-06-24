import { translate } from '../../../common/intl';
import { getFormattedDateString, MomentFormats } from '../../../common/utils/date';
import { OptionType } from '../../components/forms/fields/Autocomplete/types';
import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { FB } from '../helpers';
import { EditableLHRSummaryItem } from './types';

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
    const { step, stepOrMpiDocId } = item;

    const modifiedItem = {
      ...item,
      stepOrMPI: `${step}/${stepOrMpiDocId}`,
      ...(item.expiryDate && { expiryDate: getFormattedDateString(item.expiryDate ?? '', MomentFormats.MonthDateYearTwoDigit) }),
      ...(item.calDueDate && { calDueDate: getFormattedDateString(item.calDueDate ?? '', MomentFormats.MonthDateYearTwoDigit) }),
      ...(item.pmDueDate && { pmDueDate: getFormattedDateString(item.pmDueDate ?? '', MomentFormats.MonthDateYearTwoDigit) }),
      ...(item.createdAt && { createdAt: getFormattedDateString(item.createdAt ?? '', MomentFormats.MonthDateYearTwoDigit) }),
      enteredBy: FB.isUUID(item.enteredBy)
        ? availableUsers.find(user => user.value === item.enteredBy)?.label ?? item.enteredBy
        : item.enteredBy,
    };

    return modifiedItem;
  });

export const getDisplayDocument = (docId?: string, displayRevision?: string): string => {
  return `${docId ?? ''} - ${displayRevision ?? ''}`;
};
