import { MODE_FIELD } from '../../components/KendoDataGrid/constants';

export const EMPLOYEE_FIELD = 'employeeName';
export const BUILD_FIELD = 'buildName';
export const REFERENCE_FIELD = 'referenceName';
export const DATE_FIELD = 'dateFormatted';

export const FIELDS_TO_OMIT = [MODE_FIELD, EMPLOYEE_FIELD, BUILD_FIELD, REFERENCE_FIELD, DATE_FIELD];

export const EMPTY_VALUE_PLACEHOLDER = '-';

export const EMPLOYEE_RESPONSE_FIELD = 'employeeResponse';
export enum EmployeeStatus {
  Done = 'DONE',
}
