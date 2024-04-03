import { Mode, MODE_FIELD } from '../../components/KendoDataGrid/constants';

export const EMPTY_VALUE_PLACEHOLDER = '-';
export const EMPTY_DROPDOWN_PLACEHOLDER = 'N/A';
export const SELECTED_FIELD = 'selected';
export const DATA_ITEM_KEY = 'id';
export const TYPE_OPTIONS = [
  { label: 'Equipment', value: 'equipment' },
  { label: 'Material', value: 'material' },
];

export const STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'In Review', value: 'In Review' },
  { label: 'Released', value: 'Released' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Active', value: 'active' },
  { label: 'Quarantine', value: 'quarantine' },
  { label: 'Approved', value: 'Approved' },
];
export const EMPTY_PLACEHOLDER = '-';
export const NA_PLACEHOLDER = 'NA';
export const SampleLHRSummaryData = [
  {
    id: '123',
    step: '#1',
    type: 'equipment',
    plannedId: 'PL-1289',
    actualId: 'AL-1289',
    title: 'Sample LHR Summary',
    lotId: 'LOT #24567889',
    equipmentId: 'EQ-435890',
    mpiId: 'MPI-435832',
    expiryDate: '12-03-24',
    startQuantity: 12,
    endQuantity: 23,
    status: 'DRAFT',
    calDueDate: '12-03-24',
    pmDueDate: '12-04-24',
    ncmr: 'NCMR',
    comments: 'Comments',
    enteredBy: 'Vildana',
    createdAt: '12-04-24',
    [MODE_FIELD]: Mode.show,
  },
];
export const FIELDS_TO_PICK = ['plannedId', 'actualId', 'startQuantity', 'endQuantity', 'status', 'expiryDate', 'calDueDate', 'pmDueDate', 'comments', 'type', 'enteredBy', 'lotOrEquipment'];
export const COLUMN_LOCK_FIELDS = ['locked', 'reorderable', 'orderIndex'];

export enum DocType {
  equipment = 'equipment',
  process = 'process',
  material = 'material',
}
