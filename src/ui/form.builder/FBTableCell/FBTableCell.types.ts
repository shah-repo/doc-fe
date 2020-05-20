import { TableCellProps } from "@material-ui/core";

export type FBTableCellProps =
& Pick<TableCellProps,
| "className"
| "colSpan"
| "rowSpan"
| "align"
| "style"
| "children"
>
& {
  label?: string;
  loading?: boolean;
  tooltipTitle?: string;
};
