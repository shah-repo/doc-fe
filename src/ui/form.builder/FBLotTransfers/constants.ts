import { translate } from '../../../common/intl';
import { MODE_FIELD } from '../../components/KendoDataGrid/constants';
import { LotTransferType } from './types';

export const EMPLOYEE_FIELD = 'employeeName';
export const BUILD_FIELD = 'buildName';
export const REFERENCE_FIELD = 'referenceName';
export const DATE_FIELD = 'dateFormatted';

export const FIELDS_TO_OMIT = [MODE_FIELD, EMPLOYEE_FIELD, BUILD_FIELD, REFERENCE_FIELD, DATE_FIELD];

export const INITIAL_QUANTITY_FIELD = 'lot_usable_quantity';
export const TRANSFERS_FIELD = 'lot_transfers';
export const MAX_DECIMALS = 12;

export const EMPTY_VALUE_PLACEHOLDER = '-';

export const DEDUCTABLE_TRANSFER_TYPES = [LotTransferType.Allocate, LotTransferType.Transfer];
export const INCREMENTABLE_LOT_TRANSFER_TYPES = [LotTransferType.Return];

export const TRANSFER_TYPE_OPTIONS = Object.values(LotTransferType).map((value) => ({
  value,
  label: translate(`form.builder.lot.transfers.type.${value}`),
}));
