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
export const REQUEST_PAYLOAD_KEYS = ['order', 'displayOrder', 'internalType', 'displayLabel', 'isAllowedOnPO', 'isAllowedOnLhrProd', 'isAllowedToBuy', 'documentTypeIdArr'];
export const EMPTY_VALUE_PLACEHOLDER = '-';

// Sample Data for PART GROUP Options
export const PART_GROUPS = [
  { label: 'Component Spec (CS)', value: 'CS', category: PARTS_GROUP_NAME },
  { label: 'Sub-Assembly (SA)', value: 'SA', category: PARTS_GROUP_NAME },
  { label: 'Finished Good (FG)', value: 'FG', category: PARTS_GROUP_NAME },
];

// Sample Data for default Dropdown Options
export const DEFAULT_OPTIONS = [
  { label: 'Yes', value: 'YES' },
  { label: 'Allow with warning', value: 'WARNING' },
  { label: 'No', value: 'NO' },
];

// Sample Data for Part purchase based on Released Revision options
export const PART_PURCHASE_OPTIONS = [
  { label: 'Yes', value: 'YES' },
  { label: 'No', value: 'NO' },
];

export const DEFAULT_PART_PURCHASE_OPTIONS = [
  { label: 'No', value: 'NO' },
];

// LCP table initial data remove at last
export const initialData = [
  { id: '1', internalType: 'Preliminary', displayLabel: 'Preliminary', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Component Spec (CS)', isAllowedToBuy: 'Yes', documentTypeIdArr: ['CS'] },
  { id: '2', internalType: 'Concept', displayLabel: 'Concept', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Component Spec (CS)', isAllowedToBuy: 'No', documentTypeIdArr: ['CS'] },
  { id: '3', internalType: 'Planning', displayLabel: 'Planning', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Component Spec (CS)', isAllowedToBuy: 'No', documentTypeIdArr: ['CS'] },
  { id: '4', internalType: 'Design & Engineering', displayLabel: 'Design & Engineering', isAllowedOnPO: 'Yes', isAllowedOnLhrProd: 'Yes', category: 'Component Spec (CS)', isAllowedToBuy: 'No', documentTypeIdArr: ['CS'] },
  { id: '5', internalType: 'Production', displayLabel: 'Production', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Component Spec (CS)', isAllowedToBuy: 'Yes', documentTypeIdArr: ['CS'] },
  { id: '6', internalType: 'Obsolute', displayLabel: 'Obsolute', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Component Spec (CS)', isAllowedToBuy: 'No', documentTypeIdArr: ['CS'] },

  { id: '7', internalType: 'Preliminary', displayLabel: 'Preliminary', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Finished Goods (FG)', isAllowedToBuy: 'Yes', documentTypeIdArr: ['FG'] },
  { id: '8', internalType: 'Concept', displayLabel: 'Concept', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Finished Goods (FG)', isAllowedToBuy: 'No', documentTypeIdArr: ['FG'] },
  { id: '9', internalType: 'Planning', displayLabel: 'Planning', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Finished Goods (FG)', isAllowedToBuy: 'No', documentTypeIdArr: ['FG'] },
  { id: '10', internalType: 'Design & Engineering', displayLabel: 'Design & Engineering', isAllowedOnPO: 'Yes', isAllowedOnLhrProd: 'Yes', category: 'Finished Goods (FG)', isAllowedToBuy: 'No', documentTypeIdArr: ['FG'] },
  { id: '11', internalType: 'Production', displayLabel: 'Production', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Finished Goods (FG)', isAllowedToBuy: 'Yes', documentTypeIdArr: ['FG'] },
  { id: '12', internalType: 'Obsolute', displayLabel: 'Obsolute', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'Finished Goods (FG)', isAllowedToBuy: 'No', documentTypeIdArr: ['FG'] },
];

// selected part sample data remove at last
export const newSelectedOptions = [
  { id: '13', internalType: 'Preliminary NW', displayLabel: 'Preliminary', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'PARTS', isAllowedToBuy: 'Yes', documentTypeIdArr: ['SA'] },
  { id: '14', internalType: 'Concept NW', displayLabel: 'Concept', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'PARTS', isAllowedToBuy: 'No', documentTypeIdArr: ['SA'] },
  { id: '15', internalType: 'Planning NW', displayLabel: 'Planning', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'PARTS', isAllowedToBuy: 'No', documentTypeIdArr: ['SA'] },
  { id: '16', internalType: 'Design & Engineering NW', displayLabel: 'Design & Engineering', isAllowedOnPO: 'Yes', isAllowedOnLhrProd: 'Yes', category: 'PARTS', isAllowedToBuy: 'No', documentTypeIdArr: ['SA'] },
  { id: '17', internalType: 'Production NW', displayLabel: 'Production', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'PARTS', isAllowedToBuy: 'Yes', documentTypeIdArr: ['SA'] },
  { id: '18', internalType: 'Obsolute NW', displayLabel: 'Obsolute', isAllowedOnPO: 'No', isAllowedOnLhrProd: 'Yes', category: 'PARTS', isAllowedToBuy: 'No', documentTypeIdArr: ['SA'] },
];

// real time data remove at last
export const realTimeData = {
  categories: [
    {
      docTypes: [
        {
          id: 'd87b7274-560f-4c99-a435-755653e5f3e6',
          documentTypeName: 'Finished Good',
          documentTypeAcronym: 'FG-',
          group: 'PART',
        },
        {
          id: 'f9e45be5-d386-4c13-baea-018872e84c4f',
          documentTypeName: 'Component Specification',
          documentTypeAcronym: 'CS-',
          group: 'PART',
        },
      ],
      phases: [
        {
          createdAt: '2024-07-11T13:18:40.870Z',
          updatedAt: '2024-07-11T13:18:40.870Z',
          id: '47bbea32-075b-457d-8d77-8767bcfc3277',
          order: 1,
          internalType: 'Preliminary',
          displayLabel: 'Preliminary',
          companyId: 'f818830c-9e7f-4e35-be17-b7fa19412b09',
          companySettingsId: 'e2150256-caa4-4abe-91fc-0e1d21654476',
          isAllowedOnPO: 'yes',
          isAllowedOnLhrProd: 'no',
          isAllowedToBuy: 'allow_with_warning',
          isUserAdded: false,
          isUserModified: false,
        },
        {
          createdAt: '2024-07-11T13:18:40.910Z',
          updatedAt: '2024-07-11T13:18:40.910Z',
          id: 'ad59dab7-2953-4a2d-9710-8b19dcd6f62d',
          order: 4,
          internalType: 'Design & Engineering',
          displayLabel: 'V & V',
          companyId: 'f818830c-9e7f-4e35-be17-b7fa19412b09',
          companySettingsId: 'e2150256-caa4-4abe-91fc-0e1d21654476',
          isAllowedOnPO: 'yes',
          isAllowedOnLhrProd: 'no',
          isAllowedToBuy: 'allow_with_warning',
          isUserAdded: false,
          isUserModified: false,
        },
        {
          createdAt: '2024-07-11T13:18:40.957Z',
          updatedAt: '2024-07-11T13:18:40.957Z',
          id: 'dce171dc-c593-4684-93e8-bf91f3829ce5',
          order: 6,
          internalType: 'Obsolete',
          displayLabel: 'Retire',
          companyId: 'f818830c-9e7f-4e35-be17-b7fa19412b09',
          companySettingsId: 'e2150256-caa4-4abe-91fc-0e1d21654476',
          isAllowedOnPO: 'yes',
          isAllowedOnLhrProd: 'no',
          isAllowedToBuy: 'allow_with_warning',
          isUserAdded: false,
          isUserModified: false,
        },
        {
          createdAt: '2024-07-11T13:18:40.957Z',
          updatedAt: '2024-07-11T13:18:40.957Z',
          id: '5374ae40-90c4-48c9-adc2-e6b9f0f3d354',
          order: 3,
          internalType: 'Planning',
          displayLabel: 'Planning',
          companyId: 'f818830c-9e7f-4e35-be17-b7fa19412b09',
          companySettingsId: 'e2150256-caa4-4abe-91fc-0e1d21654476',
          isAllowedOnPO: 'yes',
          isAllowedOnLhrProd: 'no',
          isAllowedToBuy: 'allow_with_warning',
          isUserAdded: false,
          isUserModified: false,
        },
        {
          createdAt: '2024-07-11T13:18:40.957Z',
          updatedAt: '2024-07-11T13:18:40.957Z',
          id: 'b2a585b0-9a76-45a4-8b47-5e9d42915749',
          order: 2,
          internalType: 'Concept',
          displayLabel: 'Concept',
          companyId: 'f818830c-9e7f-4e35-be17-b7fa19412b09',
          companySettingsId: 'e2150256-caa4-4abe-91fc-0e1d21654476',
          isAllowedOnPO: 'yes',
          isAllowedOnLhrProd: 'no',
          isAllowedToBuy: 'allow_with_warning',
          isUserAdded: false,
          isUserModified: false,
        },
        {
          createdAt: '2024-07-11T13:18:41.015Z',
          updatedAt: '2024-07-11T13:18:41.015Z',
          id: 'c08433d6-2fdf-43b1-bfd8-9a727943160d',
          order: 5,
          internalType: 'Production',
          displayLabel: 'Production',
          companyId: 'f818830c-9e7f-4e35-be17-b7fa19412b09',
          companySettingsId: 'e2150256-caa4-4abe-91fc-0e1d21654476',
          isAllowedOnPO: 'yes',
          isAllowedOnLhrProd: 'no',
          isAllowedToBuy: 'allow_with_warning',
          isUserAdded: false,
          isUserModified: false,
        },
      ],
    },
    {
      docTypes: [
        {
          id: '1e71860f-4417-4047-a3b8-3b2e54fa2d87',
          documentTypeName: 'Subassembly',
          documentTypeAcronym: 'SA-',
          group: 'PART',
        },
      ],
      phases: [
        {
          createdAt: '2024-07-11T13:18:41.018Z',
          updatedAt: '2024-07-11T13:18:41.018Z',
          id: '86c5bb24-9c44-4caf-b6c0-1850a8afbbdb',
          order: 4,
          internalType: 'Design & Engineering',
          displayLabel: 'V & V',
          companyId: 'f818830c-9e7f-4e35-be17-b7fa19412b09',
          companySettingsId: 'e2150256-caa4-4abe-91fc-0e1d21654476',
          isAllowedOnPO: 'yes',
          isAllowedOnLhrProd: 'no',
          isAllowedToBuy: 'allow_with_warning',
          isUserAdded: false,
          isUserModified: false,
        },
        {
          createdAt: '2024-07-11T13:18:41.018Z',
          updatedAt: '2024-07-11T13:18:41.018Z',
          id: '40507568-0c03-47ca-a09e-aa3421001ccd',
          order: 3,
          internalType: 'Planning',
          displayLabel: 'Planning',
          companyId: 'f818830c-9e7f-4e35-be17-b7fa19412b09',
          companySettingsId: 'e2150256-caa4-4abe-91fc-0e1d21654476',
          isAllowedOnPO: 'yes',
          isAllowedOnLhrProd: 'no',
          isAllowedToBuy: 'allow_with_warning',
          isUserAdded: false,
          isUserModified: false,
        },
        {
          createdAt: '2024-07-11T13:18:41.018Z',
          updatedAt: '2024-07-11T13:18:41.018Z',
          id: '0332c838-20dd-4285-86a1-68ec13ce20bf',
          order: 5,
          internalType: 'Production',
          displayLabel: 'Production',
          companyId: 'f818830c-9e7f-4e35-be17-b7fa19412b09',
          companySettingsId: 'e2150256-caa4-4abe-91fc-0e1d21654476',
          isAllowedOnPO: 'yes',
          isAllowedOnLhrProd: 'no',
          isAllowedToBuy: 'allow_with_warning',
          isUserAdded: false,
          isUserModified: false,
        },
        {
          createdAt: '2024-07-11T13:18:41.018Z',
          updatedAt: '2024-07-11T13:18:41.018Z',
          id: 'ad5e9fc5-f034-4957-84d9-76af7b7b85b8',
          order: 1,
          internalType: 'Preliminary',
          displayLabel: 'Preliminary',
          companyId: 'f818830c-9e7f-4e35-be17-b7fa19412b09',
          companySettingsId: 'e2150256-caa4-4abe-91fc-0e1d21654476',
          isAllowedOnPO: 'yes',
          isAllowedOnLhrProd: 'no',
          isAllowedToBuy: 'allow_with_warning',
          isUserAdded: false,
          isUserModified: false,
        },
        {
          createdAt: '2024-07-11T13:18:41.019Z',
          updatedAt: '2024-07-11T13:18:41.019Z',
          id: 'f1b90eee-4f27-4ab8-b13e-aa49942e871f',
          order: 6,
          internalType: 'Obsolete',
          displayLabel: 'Retire',
          companyId: 'f818830c-9e7f-4e35-be17-b7fa19412b09',
          companySettingsId: 'e2150256-caa4-4abe-91fc-0e1d21654476',
          isAllowedOnPO: 'yes',
          isAllowedOnLhrProd: 'no',
          isAllowedToBuy: 'allow_with_warning',
          isUserAdded: false,
          isUserModified: false,
        },
        {
          createdAt: '2024-07-11T13:18:41.022Z',
          updatedAt: '2024-07-11T13:18:41.022Z',
          id: '88623c6c-203a-45ce-ac0f-59a435ac7731',
          order: 2,
          internalType: 'Concept',
          displayLabel: 'Concept',
          companyId: 'f818830c-9e7f-4e35-be17-b7fa19412b09',
          companySettingsId: 'e2150256-caa4-4abe-91fc-0e1d21654476',
          isAllowedOnPO: 'yes',
          isAllowedOnLhrProd: 'no',
          isAllowedToBuy: 'allow_with_warning',
          isUserAdded: false,
          isUserModified: false,
        },
      ],
    },
  ],
};
