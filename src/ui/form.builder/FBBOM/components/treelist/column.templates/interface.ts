import { TreeListCellProps } from '@progress/kendo-react-treelist';
import { Employee } from '../interface';

export type CustomTreeListCellProps = TreeListCellProps & {
  dataItem: Employee
};
