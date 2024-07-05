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

export const initialData = [
  { id: '1', enlilType: 'Preliminary', displayLabel: 'Preliminary', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Component Spec (CS)', isAllowedToBuy: 'Yes' },
  { id: '2', enlilType: 'Concept', displayLabel: 'Concept', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Component Spec (CS)', isAllowedToBuy: 'No' },
  { id: '3', enlilType: 'Planning', displayLabel: 'Planning', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Component Spec (CS)', isAllowedToBuy: 'No' },
  { id: '4', enlilType: 'Design & Engineering', displayLabel: 'Design & Engineering', isAllowedOnPO: 'Yes', isAllowedOnLhrProd: 'Yes', category: 'Component Spec (CS)', isAllowedToBuy: 'No' },
  { id: '5', enlilType: 'Production', displayLabel: 'Production', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Component Spec (CS)', isAllowedToBuy: 'Yes' },
  { id: '6', enlilType: 'Obsolute', displayLabel: 'Obsolute', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Component Spec (CS)', isAllowedToBuy: 'No' },
];
