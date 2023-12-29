export const SUB_ITEMS_FIELD = 'lotEntries';
export const ID_FIELD = 'customDocId';
export const DOC_ID_FIELD = 'docId';
export const EXCEL_FILE_NAME = 'allocationTree.xlsx';
export const DATA_ITEM_KEY = 'id';
export const EXPAND_FIELD = 'expanded';
export const MODE_FIELD = 'inEdit';
export const ADD_FIELD = 'isNew';
export const DELETE_FIELD = 'isDeleted';
export const CELL_EMPTY_VALUE = '-';
export const TREELIST_CONFIG = {
  sortable: false,
  reorderable: false,
  resizable: true,
  scrollable: 'virtual',
  rowHeight: 50,
};

export const CHECKBOX_GROUP = 'allocationCheckboxGroup';
export enum AllocationCheckBoxOptions {
  AUTO_ASSIGN = 'autoAssign',
  AUTO_TRANSACT = 'autoTransact',
}
export const AllocationCheckboxOptions = [
  {
    text: 'allocation.checkbox.group.option.autoAssign.label',
    value: AllocationCheckBoxOptions.AUTO_ASSIGN,
  },
  {
    text: 'allocation.checkbox.group.option.autoTransact.label',
    value: AllocationCheckBoxOptions.AUTO_TRANSACT,
  },
];
export const ALLOCATION_TABLE_NAME = 'ALLOCATION_TABLE';
