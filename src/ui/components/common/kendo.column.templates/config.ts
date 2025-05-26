import { DurationCell } from '../../../async.tasks/grid/cell.templates/DurationCell';
import { DocumentTypeCellTemplate } from '../../../document.revision/grid/cell.templates/DocumentTypeCellTemplate';
import { CustomGridCellProps, KendoCellTemplates } from '../kendo/types';
import { Active } from './Active';
import { AttachmentCount } from './AttachmentCount';
import { CommonCell } from './CommonCell';
import { DateCompleted } from './DateCompleted';
import { DateInfo } from './DateInfo';
import { DocIdListCell } from './DocIdListCell';
import { EQStatus } from './EQStatus';
import { OverflowCell } from './OverflowCell';
import { POAmount } from './POAmount';
import { POAmountWithCurrency } from './POAmountWithCurrency';
import { Status } from './Status';
import { SupplierStatus } from './SupplierStatus';
import { UserAvatar } from './UserAvatar';

export const cellTemplateMapping: Record<KendoCellTemplates, (props: CustomGridCellProps) => JSX.Element | null> = {
  Active,
  UserAvatar,
  Status,
  EQStatus,
  SupplierStatus,
  AttachmentCount,
  DateCompleted,
  DateInfo,
  CommonCell,
  POAmount,
  OverflowCell,
  DocumentTypeCellTemplate,
  DurationCell,
  POAmountWithCurrency,
  DocIdListCell,
};
