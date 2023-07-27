import { VendorData } from './types';

const DATA: VendorData[] = [
  {
    id: '9c222bbc-e4d7-4542-b504-e61cd97f1850',
    primary: true,
    supplier: 'AWAIBA GmbH',
    status: 'Released',
    partNumber: '12346',
    cost: '$10.99',
    unitsBuy: 'cm',
    conversion: 6,
    unitsUse: 'inches',
    leadTime: 14,
  },
  {
    id: '4f63fe31-25ea-42c3-b0f5-6d544829db3e',
    primary: false,
    supplier: 'test',
    status: 'Pending Approval',
    partNumber: '000123',
    cost: '$18.88',
    unitsBuy: 'meters',
    conversion: 3.4,
    unitsUse: 'cm',
    leadTime: 5,
  },
  {
    id: 'c65068dd-b10e-4d5c-8334-85c623b1d82e',
    primary: false,
    supplier: 'Computer & Peripherals Group, Inc. dba Source Graphics',
    status: 'Draft',
    partNumber: '0001',
    cost: '$98',
    unitsBuy: 'gram',
    conversion: 8,
    unitsUse: 'kg',
    leadTime: 4,
  },
  {
    id: '081a8ecc-d822-43f3-88f4-597e8d3aeff0',
    primary: false,
    supplier: 'Epoxy Technology Inc',
    status: 'WIP',
    partNumber: '456',
    cost: '$50',
    unitsBuy: 'liter',
    conversion: 2,
    unitsUse: 'ml',
    leadTime: 8,
  },
];

export const getVendorData = (): VendorData[] => DATA;
