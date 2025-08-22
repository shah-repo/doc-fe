export const SUB_ITEMS_FIELD = 'actualItems';
export const DATA_ITEM_KEY = 'id';
export const EXPAND_FIELD = 'expanded';
export const MODE_FIELD = 'inEdit';
export const ADD_FIELD = 'isNew';
export const IS_ACTUAL_ID_ADDITION = 'isActualIdAddition';
export const CELL_EMPTY_VALUE = '-';
export const MAX_DECIMALS = 4;
export const TREELIST_CONFIG = {
  sortable: false,
  reorderable: false,
  resizable: true,
  scrollable: 'virtual',
  rowHeight: 50,
};

export const EquipTableDtata = [
  {
    id: '1',
    plannedId: 'ES-01065 - Soldering Iron',
    actualId: '',
    calDueDate: '',
    pmDueDate: '',
    actualItems: [
      {
        id: '11',
        actualId: 'ES-01065',
      },
    ],
  },
  {
    id: '2',
    plannedId: 'EQ-00002 - Mitutoyo Digital Snap Gauge 0.0 to 0.5"',
    actualId: '',
    calDueDate: '',
    pmDueDate: '',
    actualItems: [
      {
        id: '21',
        actualId: 'EQ-00653',
        calDueDate: '01/01/2024',
        pmDueDate: '11/12/2024',
      },
    ],
  },
  {
    id: '3',
    plannedId: 'EQ-02039 - CAP Sealing Sleeve Assembly',
    actualId: '',
    calDueDate: '',
    pmDueDate: '',
    actualItems: [
      {
        id: '31',
        actualId: 'EQ-00653',
        calDueDate: '01/01/2024',
        pmDueDate: '11/12/2024',
      },
    ],
  },
];
