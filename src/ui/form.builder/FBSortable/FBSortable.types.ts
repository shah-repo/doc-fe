import { SortEnd } from "react-sortable-hoc";

export interface FBSortableProps {
  items?: JSX.Element[];
  onSortEnd?: (sortEnd: SortEnd) => any;
  shouldCancelStart?: (e: any) => any;
}
