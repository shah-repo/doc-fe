export const EMPTY_VALUE_PLACEHOLDER = '-';
export const EMPTY_DROPDOWN_PLACEHOLDER = 'N/A';
export const EXCEL_FILE_NAME = 'materialDisposition.xlsx';
export const OPTIONS = [
  { label: 'Must conform', value: 'MUST_CONFORM' },
  { label: 'Rework', value: 'REWORK' },
  { label: 'Use as-is', value: 'USE_AS_IS' },
  { label: 'Re-inspect', value: 'RE_INSPECT' },
  { label: 'Return to vendor', value: 'RETURN_TO_VENDOR' },
  { label: 'Scrap', value: 'SCRAP' },
  { label: 'N/A', value: 'N/A' },
];
export const DROPDOWN_FIELDS = ['onOrderPOAction', 'inInspectionAction', 'inInventoryAction', 'inWipAction', 'asFinishedGoodsAction'];
export const ON_ORDER_PO_ACTION_COLUMN = 'onOrderPOAction';
export const FIELDS_TO_PICK = [...DROPDOWN_FIELDS, 'comment', 'usedLocation'];
