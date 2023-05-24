import { State } from '@progress/kendo-data-query';

export const MODE_FIELD = '_mode';

export enum Mode {
  show = 'show',
  add = 'add',
  edit = 'edit',
}

export const TEXT_FIELD = 'text' as const;
export const DATA_ITEM_KEY = 'value' as const;

export function createOption <T> (value: T): { [DATA_ITEM_KEY]: T, [TEXT_FIELD]: T };
export function createOption <T> (value: T, text: string): { [DATA_ITEM_KEY]: T, [TEXT_FIELD]: string };
export function createOption (value: unknown, text?: unknown): unknown {
  return {
    [DATA_ITEM_KEY]: value,
    [TEXT_FIELD]: text ?? value,
  };
}

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
