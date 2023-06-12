import { SortEnd } from 'react-sortable-hoc';
import FBSortableState from './FBSortable.state';

export interface FBSortableProps {
  items?: JSX.Element[];
  sortableState?: FBSortableState;
  onSortEnd?: (sortEnd: SortEnd) => any;
  shouldCancelStart?: (e: any) => any;
}
