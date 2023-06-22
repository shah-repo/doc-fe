import { VendorData } from './types';

const DATA: VendorData[] = [
  {
    supplier: 'ProtoLabs',
    status: 'Released',
    partNumber: '12346',
    cost: '$10.99',
    unitsBuy: 'cm',
    conversion: 3.4,
    unitsUse: 'inches',
    leadTime: 14,
  },
  {
    supplier: 'Qosina',
    status: 'Pending Approval',
    partNumber: '000123',
    cost: '$18.88',
    unitsBuy: 'meter',
    conversion: 3.4,
    unitsUse: 'cm',
    leadTime: 5,
  },
  {
    supplier: 'Vascular',
    status: 'Released',
    partNumber: '0001',
    cost: '$98',
    unitsBuy: 'gram',
    conversion: 3.4,
    unitsUse: 'kg',
    leadTime: 4,
  },
  {
    supplier: 'Tioga',
    status: 'Released',
    partNumber: '456',
    cost: '$50',
    unitsBuy: 'ltr',
    conversion: 3.4,
    unitsUse: 'ml',
    leadTime: 8,
  },
];

export const getVendorData = (): VendorData[] => DATA;
