import { MODE_FIELD } from '../../../../components/KendoDataGrid/constants';

export const EMPTY_VALUE_PLACEHOLDER = '-';
export const EMPTY_DROPDOWN_PLACEHOLDER = 'N/A';
export const EXCEL_FILE_NAME = 'materialDisposition.xlsx';
export const OPTIONS = ['Must conform', 'Rework', 'Use as-is', 'Re-inspect', 'Return to vendor', 'Scrap', 'N/A'];
export const DROPDOWN_FIELDS = ['onOrderPOAction', 'inInspectionAction', 'inInventoryAction', 'inWipAction', 'asFinishedGoodsAction'];

export const FIELDS_TO_OMIT = [MODE_FIELD, 'arId', 'id', 'createdAt', 'revisionsFromTo', 'updatedAt', 'partDocId', 'lotDocId', 'partDocRevId', 'lotDocRevId'];
