export const EMPTY_VALUE_PLACEHOLDER = '-';
export const LIMIT = 25;
export const MIN_SEARCH_TERM_LENGTH = 3;
export const FIELDS_TO_PICK = ['id', 'revId', 'supplierPartNumber', 'aslStatus', 'comment', 'title', 'aslStatusId'];

enum SUPPLIER_OFFERING_ASL_STATUS {
  PENDING_EVALUATION = 'PENDING EVALUATION',
  CONDITIONALLY_APPROVED = 'CONDITIONALLY APPROVED',
  APPROVED = 'APPROVED',
  DISQUALIFY= 'DISQUALIFY',
}

export enum ASL_STATUS_CLASS_MAPPING {
  'Pending Evaluation' ='PENDING_STATUS',
  'Approved' ='GREEN_STATUS',
  'Disqualify' = 'RED_STATUS',
  'Inactive'='RED_STATUS',
}

export const ASL_STATUS_OPTIONS = Object.entries(SUPPLIER_OFFERING_ASL_STATUS).map(([key, value]) => ({
  label: value,
  value,
}));
