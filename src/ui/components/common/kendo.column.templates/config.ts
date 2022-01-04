import { GridCellProperties } from "../kendo/types";
import { CommonCell } from "./CommonCell";
import { DateCompleted } from "./DateCompleted";
import { DateInfo } from "./DateInfo";
import { Status } from "./Status";
import { UserAvatar } from "./UserAvatar";

interface CellTemplateProps {
  UserAvatar: (props: GridCellProperties) => JSX.Element | null;
  Status: (props: GridCellProperties) => JSX.Element | null;
  DateCompleted: (props: GridCellProperties) => JSX.Element | null;
  DateInfo: (props: GridCellProperties) => JSX.Element | null;
  CommonCell: (props: GridCellProperties) => JSX.Element | null;
}

export const cellTemplateMapping: CellTemplateProps = {
  UserAvatar,
  Status,
  DateCompleted,
  DateInfo,
  CommonCell,
};
