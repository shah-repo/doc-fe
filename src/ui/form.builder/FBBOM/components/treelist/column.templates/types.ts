import { TreeListCellProps } from '@progress/kendo-react-treelist';
import { BOM } from '../interface';

export interface CustomTreeListCellProps extends TreeListCellProps {
  dataItem: BOM
}
