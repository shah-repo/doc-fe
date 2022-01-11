import { GridCellProps } from "@progress/kendo-react-grid";
import { CommonCell } from "./CommonCell";
import { DateCompleted } from "./DateCompleted";
import { DateInfo } from "./DateInfo";
import { Status } from "./Status";
import { UserAvatar } from "./UserAvatar";

interface CellTemplateProps {
  UserAvatar: (props: GridCellProps) => JSX.Element | null;
  Status: (props: GridCellProps) => JSX.Element | null;
  DateCompleted: (props: GridCellProps) => JSX.Element | null;
  DateInfo: (props: GridCellProps) => JSX.Element | null;
  CommonCell: (props: GridCellProps) => JSX.Element | null;
}

export const cellTemplateMapping: CellTemplateProps = {
  UserAvatar,
  Status,
  DateCompleted,
  DateInfo,
  CommonCell,
};
