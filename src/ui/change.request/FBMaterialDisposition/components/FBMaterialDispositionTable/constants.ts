import { translate } from '../../../../../common/intl';

export const EMPTY_DROPDOWN_PLACEHOLDER = 'N/A';
export const SELECTED_FIELD = 'selected';
export const DATA_ITEM_KEY = 'id';
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
export const MD_LOCATION_KEYS_MAPPING = {
  onOrderPOAction: 'approvalRequest.grid.heading.onOrder',
  inInspectionAction: 'approvalRequest.grid.heading.Inspection',
  inInventoryAction: 'approvalRequest.grid.heading.Inventory',
  inWipAction: 'approvalRequest.grid.heading.wip',
  asFinishedGoodsAction: 'approvalRequest.grid.heading.finishedGoods',
  usedLocation: 'approvalRequest.grid.heading.field',
};
export const DROPDOWN_FIELDS = ['onOrderPOAction', 'inInspectionAction', 'inInventoryAction', 'inWipAction', 'asFinishedGoodsAction', 'usedLocation'];
export const ON_ORDER_PO_ACTION_COLUMN = 'onOrderPOAction';
export const FIELDS_TO_PICK = [...DROPDOWN_FIELDS, 'comment'];
export const EXISTING_DOC_FIELDS_TO_PICK = [...FIELDS_TO_PICK, 'docId', 'docRevId', 'displayRevision'];
export const NON_EXISTING_DOC_FIELDS_TO_PICK = [...FIELDS_TO_PICK, 'text'];
export const SELECTER_MARGIN_BOTTOM = 8;
export const SELECTER_MARGIN_TOP = 5;

export const getMDOptionLabels = (key: string) => {
  const label = OPTIONS.find((data) => data.value === key)?.label;
  return label ? translate(label) : key;
};
