import { VendorData } from './types';

const DATA: VendorData[] = [
  {
    id: '1',
    vendor: 'ProtoLabs',
    status: 'Released',
    partNumber: '12346',
    cost: '$10.99',
    unitsBuy: 'cm',
    conversion: 6,
    unitsUse: 'inches',
    leadTime: 14,
  },
  {
    id: '2',
    vendor: 'Qosina',
    status: 'Pending Approval',
    partNumber: '000123',
    cost: '$18.88',
    unitsBuy: 'meter',
    conversion: 3.4,
    unitsUse: 'cm',
    leadTime: 5,
  },
  {
    id: '3',
    vendor: 'Vascular',
    status: 'Draft',
    partNumber: '0001',
    cost: '$98',
    unitsBuy: 'gram',
    conversion: 8,
    unitsUse: 'kg',
    leadTime: 4,
  },
  {
    id: '4',
    vendor: 'Tioga',
    status: 'WIP',
    partNumber: '456',
    cost: '$50',
    unitsBuy: 'ltr',
    conversion: 2,
    unitsUse: 'ml',
    leadTime: 8,
  },
];

export const getVendorData = (): VendorData[] => DATA;
