export const DATA_ITEM_KEY = 'id';
export const EXPAND_FIELD = 'expanded';
export const DATA_GROUP = [{ field: 'category' }];
export const TREELIST_CONFIG = {
  sortable: false,
  reorderable: false,
  resizable: true,
  scrollable: 'virtual',
  rowHeight: 50,
};
export const EDIT_FIELD = 'inEdit';
export const ADD_GROUP_ID = 'Addcategory';
export const PARTS_GROUP_ID = 'PARTScategory';

export const initialDataState = {
  take: 100,
  skip: 0,
  group: DATA_GROUP,
};

export const PART_GROUPS = [
  { label: 'Component Spec (CS)', value: 'CS', category: 'PARTS' },
  { label: 'Sub-Assembly (SA)', value: 'SA', category: 'PARTS' },
  { label: 'Finished Good (FG)', value: 'FG', category: 'PARTS' },
];

export const OPTIONS = [
  { label: 'Yes', value: 'yes' },
  { label: 'Allow with warning', value: 'warning' },
  { label: 'No', value: 'no' },
];

export const initialData = [
  { id: '1', enlilType: 'Preliminary', displayLabel: 'Preliminary', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Component Spec (CS)', isAllowedToBuy: 'Yes' },
  { id: '2', enlilType: 'Concept', displayLabel: 'Concept', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Component Spec (CS)', isAllowedToBuy: 'No' },
  { id: '3', enlilType: 'Planning', displayLabel: 'Planning', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Component Spec (CS)', isAllowedToBuy: 'No' },
  { id: '4', enlilType: 'Design & Engineering', displayLabel: 'Design & Engineering', isAllowedOnPO: 'Yes', isAllowedOnLhrProd: 'Yes', category: 'Component Spec (CS)', isAllowedToBuy: 'No' },
  { id: '5', enlilType: 'Production', displayLabel: 'Production', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Component Spec (CS)', isAllowedToBuy: 'Yes' },
  { id: '6', enlilType: 'Obsolute', displayLabel: 'Obsolute', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Component Spec (CS)', isAllowedToBuy: 'No' },

  { id: '7', enlilType: 'Preliminary', displayLabel: 'Preliminary', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Finished Goods (FG)', isAllowedToBuy: 'Yes' },
  { id: '8', enlilType: 'Concept', displayLabel: 'Concept', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Finished Goods (FG)', isAllowedToBuy: 'No' },
  { id: '9', enlilType: 'Planning', displayLabel: 'Planning', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Finished Goods (FG)', isAllowedToBuy: 'No' },
  { id: '10', enlilType: 'Design & Engineering', displayLabel: 'Design & Engineering', isAllowedOnPO: 'Yes', isAllowedOnLhrProd: 'Yes', category: 'Finished Goods (FG)', isAllowedToBuy: 'No' },
  { id: '11', enlilType: 'Production', displayLabel: 'Production', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Finished Goods (FG)', isAllowedToBuy: 'Yes' },
  { id: '12', enlilType: 'Obsolute', displayLabel: 'Obsolute', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Finished Goods (FG)', isAllowedToBuy: 'No' },
];

export const newSelectedOptions = [
  { id: '13', enlilType: 'Preliminary NW', displayLabel: 'Preliminary', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'PARTS', isAllowedToBuy: 'Yes' },
  { id: '14', enlilType: 'Concept NW', displayLabel: 'Concept', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'PARTS', isAllowedToBuy: 'No' },
  { id: '15', enlilType: 'Planning NW', displayLabel: 'Planning', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'PARTS', isAllowedToBuy: 'No' },
  { id: '16', enlilType: 'Design & Engineering NW', displayLabel: 'Design & Engineering', isAllowedOnPO: 'Yes', isAllowedOnLhrProd: 'Yes', category: 'PARTS', isAllowedToBuy: 'No' },
  { id: '17', enlilType: 'Production NW', displayLabel: 'Production', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'PARTS', isAllowedToBuy: 'Yes' },
  { id: '18', enlilType: 'Obsolute NW', displayLabel: 'Obsolute', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'PARTS', isAllowedToBuy: 'No' },
];
