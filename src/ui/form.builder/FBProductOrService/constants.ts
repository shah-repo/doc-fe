import { MODE_FIELD } from '../../components/KendoDataGrid/constants';

export const EMPTY_VALUE_PLACEHOLDER = '-';

export const FIELDS_TO_OMIT = [MODE_FIELD];

export enum SUPPLIER_OFFERING_ASL_STATUS {
  PENDING_EVALUATION = 'PENDING EVALUATION',
  CONDITIONALLY_APPROVED = 'CONDITIONALLY APPROVED',
}

export const ASL_STATUS_OPTIONS = Object.entries(SUPPLIER_OFFERING_ASL_STATUS).map(([key, value]) => ({
  label: value,
  value,
}));
