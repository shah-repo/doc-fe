export const EMPTY_VALUE_PLACEHOLDER = '-';
export const SELECTED_FIELD = 'selected';
export const DATA_ITEM_KEY = 'id';
export const STEP_FIELD = 'step';
export const EXCEL_FILE_NAME = 'lhrSummary.xlsx';
export const TYPE_OPTIONS = [
  { label: 'Equipment', value: 'equipment' },
  { label: 'Material', value: 'material' },
];
export const MIN_SEARCH_TERM_LENGTH = 3;
export const LIMIT = 25;
export const EMPTY_PLACEHOLDER = '-';
export const LHR_SUMARY_FIELDS = {
  plannedId: 'plannedId',
  actualId: 'actualId',
  startQuantity: 'startQuantity',
  endQuantity: 'endQuantity',
  status: 'status',
  expiryDate: 'expiryDate',
  issue: 'issue',
  calDueDate: 'calDueDate',
  pmDueDate: 'pmDueDate',
  comments: 'comments',
  type: 'type',
  enteredBy: 'enteredBy',
  lotOrEquipment: 'lotOrEquipment',
};
export const FIELDS_TO_PICK = ['plannedId', 'actualId', 'startQuantity', 'endQuantity', 'status', 'expiryDate', 'issue', 'calDueDate', 'pmDueDate', 'comments', 'type', 'enteredBy', 'lotOrEquipment'];
export const COLUMN_LOCK_FIELDS = ['locked', 'reorderable', 'orderIndex'];

export enum DocType {
  equipment = 'equipment',
  material = 'material',
}
