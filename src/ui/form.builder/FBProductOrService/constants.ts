export const EMPTY_VALUE_PLACEHOLDER = '-';
export const LIMIT = 25;
export const MIN_SEARCH_TERM_LENGTH = 3;
export const FIELDS_TO_PICK = ['id', 'revId', 'supplierPartNumber', 'aslStatus', 'comment', 'title'];

export enum SUPPLIER_OFFERING_ASL_STATUS {
  PENDING_EVALUATION = 'PENDING EVALUATION',
  CONDITIONALLY_APPROVED = 'CONDITIONALLY APPROVED',
  APPROVED = 'APPROVED',
}

export enum ASL_STATUS_CLASS_MAPPING {
  'CONDITIONALLY APPROVED'='GREEN_STATUS',
  'PENDING EVALUATION' ='PENDING_STATUS',
  'APPROVED' ='GREEN_STATUS',
}

export const ASL_STATUS_OPTIONS = Object.entries(SUPPLIER_OFFERING_ASL_STATUS).map(([key, value]) => ({
  label: value,
  value,
}));
