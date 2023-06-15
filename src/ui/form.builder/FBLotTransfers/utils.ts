import { CompanyLocation, LotTransfer, LotTransferType } from './types';

const LOCATIONS: CompanyLocation[] = [
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

const TRANSFERS: LotTransfer[] = [
  {
    id: '1',
    type: LotTransferType.Allocate,
    from: 'loc_1',
    to: 'loc_2',
    build: { id: '368433e7-43d7-400f-b0c0-56f2a24f18c6', docId: 'EB-00301' },
    quantity: 12,
    date: new Date(),
    by: '43d2119f-795f-49ff-bb2d-faad728fd6f5',
    comments: 'Allocated to cleanroom 1',
  },
  {
    id: '2',
    type: LotTransferType.Return,
    from: 'loc_2',
    to: 'loc_1',
    quantity: 3,
    date: new Date(),
    by: '43d2119f-795f-49ff-bb2d-faad728fd6f5',
  },
];

export const getLotTransfers = (): LotTransfer[] => TRANSFERS;
export const getLocations = (): CompanyLocation[] => LOCATIONS;
