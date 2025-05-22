import { State } from '@progress/kendo-data-query';
import { translate } from '../../../../../common/intl';
import { CustomTreeListColumnProps } from '../../../../components/common/treelist/types';

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

export const getExcelColumns = (columns: CustomTreeListColumnProps[]): CustomTreeListColumnProps[] => {
  return [...columns].filter(col => !col.isHidden).map(col => {
    switch (col.field || col.id) {
      case 'docType.acronym':
      case 'docType.group':
      case 'docType.name':
      case 'docType.defaultTraining':
      case 'docType.needsSignature':
      case 'docType.updatedCategory':
      case 'docType.active':
      case 'form-builder-approvals-numeric-alpha':
      case 'form-builder-approvals-numeric':
      case 'form-builder-approvals-alpha':
      case 'form-builder-approvals-admin':
      case 'name':
      case 'groupsList':
        return { ...col, title: translate(col.title) };
      default:
        return col;
    }
  });
};
