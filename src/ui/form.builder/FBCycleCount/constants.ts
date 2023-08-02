import { MODE_FIELD } from '../../components/KendoDataGrid/constants';
import { ActionNeededType } from './types';

export const EMPTY_VALUE_PLACEHOLDER = '-';

export const EMPLOYEE_FIELD = 'employeeName';
export const DATE_FIELD = 'dateFormatted';

export const FIELDS_TO_OMIT = [MODE_FIELD, EMPLOYEE_FIELD, DATE_FIELD];

export const ACTION_NEEDED_OPTIONS = Object.values(ActionNeededType).map((value) => ({
  value,
  label: value,
}));
