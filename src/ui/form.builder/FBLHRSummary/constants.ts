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
  mpiId: 'mpiId',
  plannedId: 'plannedId',
  actualId: 'actualId',
  startQuantity: 'startQuantity',
  endQuantity: 'endQuantity',
  lotStatus: 'lotStatus',
  expiryDate: 'expiryDate',
  issue: 'issue',
  calDueDate: 'calDueDate',
  pmDueDate: 'pmDueDate',
  comments: 'comments',
  type: 'type',
  enteredBy: 'enteredBy',
  lotOrEquipment: 'lotOrEquipment',
  recordCreationDate: 'recordCreationDate',
};
export const FIELDS_TO_PICK = ['plannedId', 'actualId', 'startQuantity', 'endQuantity', 'lotStatus', 'expiryDate', 'issue', 'calDueDate', 'pmDueDate', 'comments', 'type', 'enteredBy', 'lotOrEquipment', 'recordCreationDate'];
export const COLUMN_LOCK_FIELDS = ['locked', 'reorderable', 'orderIndex', 'show'];
export const DATE_FIELDS_TO_PICK = ['calDueDate', 'pmDueDate', 'expiryDate', 'recordCreationDate'];

export enum DocType {
  equipment = 'equipment',
  material = 'material',
}
