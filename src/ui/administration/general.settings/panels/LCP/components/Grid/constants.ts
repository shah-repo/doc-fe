export const DATA_ITEM_KEY = 'id';
export const EXPAND_FIELD = 'expanded';
export const TREELIST_CONFIG = {
  sortable: false,
  reorderable: false,
  resizable: true,
  scrollable: 'virtual',
  rowHeight: 50,
};

export const initialData = [
  { id: '1', type: 'Preliminary', label: 'Preliminary', AllowOnPOWithApprovedSupplier: 'No', AllowOnLHRProduction: 'Yes', category: 'FG', AllowToBuy: 'Yes' },
  { id: '2', type: 'Concept', label: 'Concept', AllowOnPOWithApprovedSupplier: 'No', AllowOnLHRProduction: 'Yes', category: 'FG', AllowToBuy: 'No' },
  { id: '3', type: 'Planning', label: 'Planning', AllowOnPOWithApprovedSupplier: 'No', AllowOnLHRProduction: 'Yes', category: 'FG', AllowToBuy: 'No' },
  { id: '4', type: 'Design & Engineering', label: 'Design & Engineering', AllowOnPOWithApprovedSupplier: 'Yes', AllowOnLHRProduction: 'Yes', category: 'FG', AllowToBuy: 'No' },
  { id: '5', type: 'Production', label: 'Production', AllowOnPOWithApprovedSupplier: 'No', AllowOnLHRProduction: 'Yes', category: 'FG', AllowToBuy: 'Yes' },
  { id: '6', type: 'Obsolute', label: 'Obsolute', AllowOnPOWithApprovedSupplier: 'No', AllowOnLHRProduction: 'Yes', category: 'FG', AllowToBuy: 'No' },
];
