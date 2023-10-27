export const EMPTY_VALUE_PLACEHOLDER = '-';
export const EMPTY_DROPDOWN_PLACEHOLDER = 'N/A';
export const EXCEL_FILE_NAME = 'materialDisposition.xlsx';
export const OPTIONS = [
  { label: 'approvalRequest.material.disposition.options.mustConform', value: 'MUST_CONFORM' },
  { label: 'approvalRequest.material.disposition.options.rework', value: 'REWORK' },
  { label: 'approvalRequest.material.disposition.options.useAsIs', value: 'USE_AS_IS' },
  { label: 'approvalRequest.material.disposition.options.reInspect', value: 'RE_INSPECT' },
  { label: 'approvalRequest.material.disposition.options.returnToVendor', value: 'RETURN_TO_VENDOR' },
  { label: 'approvalRequest.material.disposition.options.scrap', value: 'SCRAP' },
  { label: 'common.not.applicable', value: 'N/A' },
];
export const DROPDOWN_FIELDS = ['onOrderPOAction', 'inInspectionAction', 'inInventoryAction', 'inWipAction', 'asFinishedGoodsAction', 'usedLocation'];
export const ON_ORDER_PO_ACTION_COLUMN = 'onOrderPOAction';
export const FIELDS_TO_PICK = [...DROPDOWN_FIELDS, 'comment'];
