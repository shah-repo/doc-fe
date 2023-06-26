import { DurationCell } from '../../../async.tasks/grid/cell.templates/DurationCell';
import { DocumentTypeCellTemplate } from '../../../document.revision/grid/cell.templates/DocumentTypeCellTemplate';
import { CustomGridCellProps } from '../kendo/types';
import { Active } from './Active';
import { CommonCell } from './CommonCell';
import { DateCompleted } from './DateCompleted';
import { DateInfo } from './DateInfo';
import { POAmount } from './POAmount';
import { Status } from './Status';
import { UserAvatar } from './UserAvatar';

interface CellTemplateProps {
  Active: (props: CustomGridCellProps) => JSX.Element | null
  UserAvatar: (props: CustomGridCellProps) => JSX.Element | null
  Status: (props: CustomGridCellProps) => JSX.Element | null
  DateCompleted: (props: CustomGridCellProps) => JSX.Element | null
  DateInfo: (props: CustomGridCellProps) => JSX.Element | null
  CommonCell: (props: CustomGridCellProps) => JSX.Element | null
  POAmount: (props: CustomGridCellProps) => JSX.Element | null
  DocumentTypeCellTemplate: (props: CustomGridCellProps) => JSX.Element | null
  DurationCell: (props: CustomGridCellProps) => JSX.Element | null
}

export const cellTemplateMapping: CellTemplateProps = {
  Active,
  UserAvatar,
  Status,
  DateCompleted,
  DateInfo,
  CommonCell,
  POAmount,
  DocumentTypeCellTemplate,
  DurationCell,
};
