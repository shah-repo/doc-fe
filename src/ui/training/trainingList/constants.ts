import { translate } from '../../../common/intl';
import { MODE_FIELD } from '../../components/KendoDataGrid/constants';
import { Currency, TrainingType } from './types';

export const DEFAULT_CURRENCY = Currency.USD;

export const EMPLOYEE_FIELD = 'employeeName';
export const BUILD_FIELD = 'buildName';
export const REFERENCE_FIELD = 'referenceName';
export const DATE_FIELD = 'dateFormatted';

export const FIELDS_TO_OMIT = [MODE_FIELD, EMPLOYEE_FIELD, BUILD_FIELD, REFERENCE_FIELD, DATE_FIELD];

export const EMPTY_VALUE_PLACEHOLDER = '-';

export const SUPPLIER_FIELD = 'supplierName';
export const SUPPLIER_STATUS_FIELD = 'supplierStatus';

export const EMPLOYEE_RESPONSE_FIELD = 'employeeResponse';
export const COMMENTS_FIELD = 'comments';
export enum EmployeeStatus {
  Done = 'DONE',
}

export const TRAINING_TYPE_OPTIONS = Object.values(TrainingType).map((value) => ({
  value,
  label: translate(`form.builder.training.type.${value}`),
}));
