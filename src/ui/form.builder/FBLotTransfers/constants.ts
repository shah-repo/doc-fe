import { translate } from '../../../common/intl';
import { LotTransferType } from './types';

export const INITIAL_QUANTITY_FIELD = 'lot_usable_quantity';
export const TRANSFERS_FIELD = 'lot_transfers';

export const EMPTY_VALUE_PLACEHOLDER = '-';

export const DEDUCTABLE_TRANSFER_TYPES = [LotTransferType.Allocate, LotTransferType.Transfer];

export const TRANSFER_TYPE_OPTIONS = Object.values(LotTransferType).map((value) => ({
  value,
  label: translate(`form.builder.lot.transfers.type.${value}`),
}));
