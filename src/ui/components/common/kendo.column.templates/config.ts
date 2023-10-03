import { DurationCell } from '../../../async.tasks/grid/cell.templates/DurationCell';
import { DocumentTypeCellTemplate } from '../../../document.revision/grid/cell.templates/DocumentTypeCellTemplate';
import { CustomGridCellProps, KendoCellTemplates } from '../kendo/types';
import { Active } from './Active';
import { CommonCell } from './CommonCell';
import { DateCompleted } from './DateCompleted';
import { DateInfo } from './DateInfo';
import { POAmount } from './POAmount';
import { Status } from './Status';
import { UserAvatar } from './UserAvatar';
import { MultiSelectList } from './MultiSelectList';

export const cellTemplateMapping: Record<KendoCellTemplates, (props: CustomGridCellProps) => JSX.Element | null> = {
  Active,
  UserAvatar,
  Status,
  DateCompleted,
  DateInfo,
  CommonCell,
  POAmount,
  DocumentTypeCellTemplate,
  DurationCell,
  MultiSelectList,
};
