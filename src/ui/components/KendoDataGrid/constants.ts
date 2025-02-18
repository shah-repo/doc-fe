export const MODE_FIELD = '_mode';

export const EMPTY_VALUE_PLACEHOLDER = '-';

export enum Mode {
  show = 'show',
  add = 'add',
  edit = 'edit',
}

export const VALUE_OPERATORS = [
  'contains',
  'doesnotcontain',
  'eq',
  'neq',
  'startswith',
  'endswith',
];

export const SOLO_OPERATORS = [
  'isnull',
  'isnotnull',
  'isempty',
  'isnotempty',
];
