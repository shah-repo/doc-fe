import { Location, LotTransfer, LotTransferType } from './types';

const LOCATIONS: Location[] = [
  {
    id: 'loc_1',
    name: 'Storage (bin 1)',
  },
  {
    id: 'loc_2',
    name: 'Cleanroom 1',
  },
  {
    id: 'loc_3',
    name: 'Cleanroom 2',
  },
  {
    id: 'loc_3',
    name: 'IQC',
  },
  {
    id: 'loc_4',
    name: 'Inventory',
  },
];

const TRANSACTIONS: LotTransfer[] = [
  {
    type: LotTransferType.Allocate,
    from: 'loc_1',
    to: 'loc_2',
    build: '315d5432-e89a-458b-8d97-5c354e61ab6a',
    quantity: 12,
    date: new Date(),
    by: '43d2119f-795f-49ff-bb2d-faad728fd6f5',
    comment: 'Allocated to cleanroom 1',
  },
  {
    type: LotTransferType.Return,
    from: 'loc_2',
    to: 'loc_1',
    quantity: 3,
    date: new Date(),
    by: '43d2119f-795f-49ff-bb2d-faad728fd6f5',
  },
];

export const getLotTransactions = (): LotTransfer[] => TRANSACTIONS;
export const getLocations = (): Location[] => LOCATIONS;
