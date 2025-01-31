import { translate } from '../../../common/intl';
import { MODE_FIELD } from '../../components/KendoDataGrid/constants';
export const EMPTY_VALUE_PLACEHOLDER = '-';
export const EXPAND_FIELD = '_expanded';
export const FIELDS_TO_OMIT = [MODE_FIELD, EXPAND_FIELD];
export const APPROVED_TO_RECEIVE_OPTIONS = [
  { label: translate('form.builder.yes'), value: 'yes' },
  { label: translate('form.builder.no'), value: 'no' },
];
