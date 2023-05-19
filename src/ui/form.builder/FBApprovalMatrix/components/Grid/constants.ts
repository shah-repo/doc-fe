import { State } from '@progress/kendo-data-query';

export const MODE_FIELD = '_mode';

export enum Mode {
  show = 'show',
  add = 'add',
  edit = 'edit',
}

export const TEXT_FIELD = 'text';
export const DATA_ITEM_KEY = 'value';

export const DEFAULT_DATA_STATE: State = {
  filter: {
    logic: 'and',
    filters: [
      {
        field: 'docType.active',
        operator: 'eq',
        value: true,
      },
    ],
  },
};
