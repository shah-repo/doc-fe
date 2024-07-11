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

// Sample Data for PART GROUP Options
export const PART_GROUPS = [
  { label: 'Component Spec (CS)', value: 'CS', category: PARTS_GROUP_NAME },
  { label: 'Sub-Assembly (SA)', value: 'SA', category: PARTS_GROUP_NAME },
  { label: 'Finished Good (FG)', value: 'FG', category: PARTS_GROUP_NAME },
];

// Sample Data for default Dropdown Options
export const DEFAULT_OPTIONS = [
  { label: 'Yes', value: 'yes' },
  { label: 'Allow with warning', value: 'warning' },
  { label: 'No', value: 'no' },
];

// Sample Data for Part purchase based on Released Revision options
export const PART_PURCHASE_OPTIONS = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

// LCP table initial data
export const initialData = [
  // { id: '1', enlilType: 'Preliminary', displayLabel: 'Preliminary', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Component Spec (CS)', isAllowedToBuy: 'Yes', selectedGroupIDs: ['CS'] },
  // { id: '2', enlilType: 'Concept', displayLabel: 'Concept', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Component Spec (CS)', isAllowedToBuy: 'No', selectedGroupIDs: ['CS'] },
  // { id: '3', enlilType: 'Planning', displayLabel: 'Planning', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Component Spec (CS)', isAllowedToBuy: 'No', selectedGroupIDs: ['CS'] },
  // { id: '4', enlilType: 'Design & Engineering', displayLabel: 'Design & Engineering', isAllowedOnPO: 'Yes', isAllowedOnLhrProd: 'Yes', category: 'Component Spec (CS)', isAllowedToBuy: 'No', selectedGroupIDs: ['CS'] },
  // { id: '5', enlilType: 'Production', displayLabel: 'Production', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Component Spec (CS)', isAllowedToBuy: 'Yes', selectedGroupIDs: ['CS'] },
  // { id: '6', enlilType: 'Obsolute', displayLabel: 'Obsolute', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Component Spec (CS)', isAllowedToBuy: 'No', selectedGroupIDs: ['CS'] },

  // { id: '7', enlilType: 'Preliminary', displayLabel: 'Preliminary', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Finished Goods (FG)', isAllowedToBuy: 'Yes', selectedGroupIDs: ['FG'] },
  // { id: '8', enlilType: 'Concept', displayLabel: 'Concept', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Finished Goods (FG)', isAllowedToBuy: 'No', selectedGroupIDs: ['FG'] },
  // { id: '9', enlilType: 'Planning', displayLabel: 'Planning', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Finished Goods (FG)', isAllowedToBuy: 'No', selectedGroupIDs: ['FG'] },
  // { id: '10', enlilType: 'Design & Engineering', displayLabel: 'Design & Engineering', isAllowedOnPO: 'Yes', isAllowedOnLhrProd: 'Yes', category: 'Finished Goods (FG)', isAllowedToBuy: 'No', selectedGroupIDs: ['FG'] },
  // { id: '11', enlilType: 'Production', displayLabel: 'Production', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Finished Goods (FG)', isAllowedToBuy: 'Yes', selectedGroupIDs: ['FG'] },
  // { id: '12', enlilType: 'Obsolute', displayLabel: 'Obsolute', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Finished Goods (FG)', isAllowedToBuy: 'No', selectedGroupIDs: ['FG'] },
];

// selected part sample data
export const newSelectedOptions = [
  { id: '13', enlilType: 'Preliminary NW', displayLabel: 'Preliminary', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'PARTS', isAllowedToBuy: 'Yes', selectedGroupIDs: ['SA'] },
  { id: '14', enlilType: 'Concept NW', displayLabel: 'Concept', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'PARTS', isAllowedToBuy: 'No', selectedGroupIDs: ['SA'] },
  { id: '15', enlilType: 'Planning NW', displayLabel: 'Planning', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'PARTS', isAllowedToBuy: 'No', selectedGroupIDs: ['SA'] },
  { id: '16', enlilType: 'Design & Engineering NW', displayLabel: 'Design & Engineering', isAllowedOnPO: 'Yes', isAllowedOnLhrProd: 'Yes', category: 'PARTS', isAllowedToBuy: 'No', selectedGroupIDs: ['SA'] },
  { id: '17', enlilType: 'Production NW', displayLabel: 'Production', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'PARTS', isAllowedToBuy: 'Yes', selectedGroupIDs: ['SA'] },
  { id: '18', enlilType: 'Obsolute NW', displayLabel: 'Obsolute', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'PARTS', isAllowedToBuy: 'No', selectedGroupIDs: ['SA'] },
];
