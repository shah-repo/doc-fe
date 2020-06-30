import { TableCellProps } from "@material-ui/core";
import { Translation } from "../../translations/types";

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
  label?: string | Translation;
  loading?: boolean;
  tooltipTitle?: string;
};
