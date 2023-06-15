import { LotTransferType } from './types';

export const MODE_FIELD = '_mode';

export enum Mode {
  show = 'show',
  add = 'add',
  edit = 'edit',
}

export const EMPTY_VALUE_PLACEHOLDER = '-';

export const DEDUCTABLE_TRANSFER_TYPES = [LotTransferType.Allocate, LotTransferType.Transfer];
