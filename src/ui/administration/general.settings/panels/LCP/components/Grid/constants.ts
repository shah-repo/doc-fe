export const DATA_ITEM_KEY = 'id';
export const EXPAND_FIELD = 'expanded';
export const EDIT_FIELD = 'inEdit';
export const ADD_GROUP_NAME = 'ADD';
const PARTS_GROUP_NAME = 'PARTS';
export const LCP_KEYS = {
  isAllowedToBuy: 'isAllowedToBuy',
  isAllowedOnPO: 'isAllowedOnPO',
  category: 'category',
};
export const ADD_GROUP_ID = `${ADD_GROUP_NAME}${LCP_KEYS.category}`;
export const PARTS_GROUP_ID = `${PARTS_GROUP_NAME}${LCP_KEYS.category}`;
export const DATA_GROUP = [{ field: LCP_KEYS.category }];
export const CUSTOM_GROUP_ORDER = [ADD_GROUP_NAME, PARTS_GROUP_NAME];
export const initialDataState = {
  take: 1000,
  skip: 0,
  group: DATA_GROUP,
};
export const REQUEST_PAYLOAD_KEYS = ['order', 'displayOrder', 'internalType', 'displayLabel', 'isAllowedOnPO', 'isAllowedOnLhrProd', 'isAllowedToBuy', 'documentTypeIdArr', 'isUserAdded', 'isUserModified', 'isActive'];

export const DEFAULT_OPTIONS = [
  { label: 'Yes', value: 'YES' },
  { label: 'Allow with warning', value: 'ALLOW_WITH_WARNING' },
  { label: 'No', value: 'NO' },
];

export const PART_PURCHASE_OPTIONS = [
  { label: 'Yes', value: 'YES' },
  { label: 'No', value: 'NO' },
];
