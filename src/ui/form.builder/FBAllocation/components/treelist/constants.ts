export const SUB_ITEMS_FIELD = 'childNodes';
export const ID_FIELD = 'customDocId';
export const DOC_ID_FIELD = 'docId';
export const EXCEL_FILE_NAME = 'bomTree.xlsx';
export const DATA_ITEM_KEY = 'id';
export const EXPAND_FIELD = 'expanded';
export const SELECTED_PART_KEY_SEPARATOR = '$$$';
export const MODE_FIELD = 'inEdit';
export const ADD_FIELD = 'isNew';
export const DELETE_FIELD = 'isDeleted';
export const ALTERNATE_PART_KEY = 'alternatePartsList';
export const ALTERNATE_PARTS_COUNT_KEY = 'alternatePartsCount';
export const CELL_EMPTY_VALUE = '-';
export const EQUAL_OPERATOR = 'eq';
export const GREATER_THAN_OPERATOR = 'gt';
export const TREELIST_CONFIG = {
  sortable: false,
  reorderable: true,
  resizable: true,
  scrollable: 'virtual',
  rowHeight: 50,
};

export const AllocationData = {
  allocTreeRelations: [
    {
      lotAllocated: 'LOT #23072103',
      qtyNeeded: 15,
      variance: 5,
      issuedQty: 20,
      qtyOnHandBefore: 3,
      qtyOnHandAfter: 7,
      isOwner: true,
      id: 'f74b8862-5830-4a8a-8e74-1d3e9ec89db6',
      documentId: 'e121a84a-50e5-4685-b933-5073f5b4e649',
      parentNodeRevId: 'e6207db1-bd00-4ad1-9bb9-dee599ade44d',
      parentNodeDocumentId: '7647e573-8869-445a-90bd-be85c4d1c3c9',
    },
  ],
  parentRevDetails: {
    itemId: 'FG-00944-11',
    qtyNeeded: 15,
    variance: 5,
    issuedQty: 20,
    qtyOnHandBefore: 3,
    qtyOnHandAfter: 7,
    isOwner: true,
    id: 'e6207db1-bd00-4ad1-9bb9-dee599ade44d',
    documentId: '7647e573-8869-445a-90bd-be85c4d1c3c9',
  },
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
