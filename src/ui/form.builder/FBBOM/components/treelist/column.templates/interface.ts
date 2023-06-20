import { TreeListCellProps } from '@progress/kendo-react-treelist';
import { BOM } from '../interface';

export type CustomTreeListCellProps = TreeListCellProps & {
  dataItem: BOM
};
