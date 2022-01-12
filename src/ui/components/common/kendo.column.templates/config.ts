import { CustomGridCellProps } from "../kendo/types";
import { CommonCell } from "./CommonCell";
import { DateCompleted } from "./DateCompleted";
import { DateInfo } from "./DateInfo";
import { Status } from "./Status";
import { UserAvatar } from "./UserAvatar";

interface CellTemplateProps {
  UserAvatar: (props: CustomGridCellProps) => JSX.Element | null;
  Status: (props: CustomGridCellProps) => JSX.Element | null;
  DateCompleted: (props: CustomGridCellProps) => JSX.Element | null;
  DateInfo: (props: CustomGridCellProps) => JSX.Element | null;
  CommonCell: (props: CustomGridCellProps) => JSX.Element | null;
}

export const cellTemplateMapping: CellTemplateProps = {
  UserAvatar,
  Status,
  DateCompleted,
  DateInfo,
  CommonCell,
};
