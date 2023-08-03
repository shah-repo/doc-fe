import { AlternatePart } from '../treelist/interface';

const alternateParts: AlternatePart[] = [
  {
    id: '1',
    revision: '1',
    status: 'Released',
    name: 'Right Lens',
    docId: 'CS-00005-01',
    cost: '$1,000',
    leadTime: '4 days',
  },
  {
    id: '2',
    revision: '3',
    status: 'Released',
    name: 'Right Lens 2',
    docId: 'CS-00005-03',
    cost: '$1,500',
    leadTime: '4 days',
  },
  {
    id: '3',
    revision: '1',
    status: 'Pending Approval',
    name: 'Right Lens 3',
    docId: 'CS-00043',
    cost: '$1,025',
    leadTime: '1 week',
  },
  {
    id: '4',
    revision: '4',
    status: 'Released',
    name: 'Right Lens 4',
    docId: 'CS-00189',
    cost: '$950',
    leadTime: '3 days',
  },
];

export default alternateParts;
