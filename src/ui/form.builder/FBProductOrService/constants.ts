export const EMPTY_VALUE_PLACEHOLDER = '-';
export const LIMIT = 25;
export const MIN_SEARCH_TERM_LENGTH = 3;
export const FIELDS_TO_PICK = ['id', 'revId', 'supplierPartNumber', 'aslStatus', 'comment', 'title', 'aslStatusId'];

export enum ASL_STATUS_CLASS_MAPPING {
  'Pending Evaluation' ='PENDING_STATUS',
  'Approved' ='GREEN_STATUS',
  'Disqualify' = 'RED_STATUS',
  'Inactive'='RED_STATUS',
}
