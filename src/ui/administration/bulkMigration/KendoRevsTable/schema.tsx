import { GridFilterCellProps } from '@progress/kendo-react-grid';
import React from 'react';
import { translate } from '../../../../common/intl';
import { DropdownFilterTemplate } from '../../../components/common/kendo.column.templates/DropdownFilterTemplate';
import { ColumnDefinition } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { createOption } from '../../../form.builder/FBApprovalMatrix/components/Grid';
import { MIGRATION_STATUS_ENUM, SupplierScanResultRevision } from '../interface';
import CheckboxCell from './components/CheckboxCell';
import { DocIdCellTemplate } from './components/DocIdCellTemplate';
import { ExpandCollapseCell } from './components/ExpandCollapseCell';
import { FieldsUnmatchedCellTemplate } from './components/FieldsUnmatchedCellTemplate';
import { NameCellTemplate } from './components/NameCellTemplate';
import { OwnerCellTemplate } from './components/OwnerCellTemplate';
import SelectFilter from './components/SelectFilter';
import { TextInputCellTemplate } from './components/TextInputCellTemplate';
import { SchemaOptions } from './types';

export const buildSchema = ({
  scanId,
  rowCount,
  numSelected,
  handlePopoverOpen,
  handlePopoverClose,
  handleHeaderCheckedChange,
  handleRequestSort,
  onDataItemExpanded,
}: SchemaOptions): Array<ColumnDefinition<SupplierScanResultRevision>> => {
  const statuses = [
    MIGRATION_STATUS_ENUM.INITIALIZED,
    MIGRATION_STATUS_ENUM.STARTED,
    MIGRATION_STATUS_ENUM.IN_PROGRESS,
    MIGRATION_STATUS_ENUM.FAILED,
    MIGRATION_STATUS_ENUM.CANCELLED,
    MIGRATION_STATUS_ENUM.COMPLETED,
    MIGRATION_STATUS_ENUM.MAPPING,
  ];

  const statusOptions = statuses.map(status => createOption(status, status));
  const StatusFilter: React.FC<GridFilterCellProps> = (props) => (
    <DropdownFilterTemplate
      {...props}
      data={statusOptions}
      defaultItem={createOption('', translate('common.all'))}
    />
  );

  return [
    {
      id: '_expanded',
      field: '_expanded',
      filterable: false,
      title: '',
      template: (props) => <ExpandCollapseCell {...props} onDataItemExpanded={onDataItemExpanded} />,
      width: 50,
    },
    {
      id: 'id',
      field: 'selected',
      title: 'administration.bulk.migration.rev.grid.heading.selectAll',
      filterCell: (props) => <SelectFilter {...{ props, rowCount, numSelected, handleHeaderCheckedChange }} />,
      template: (props) => <CheckboxCell {...props} {...{ handlePopoverClose, handlePopoverOpen }} />,
      show: true,
      width: 90,
    },
    {
      id: 'docId',
      field: 'docId',
      title: 'administration.bulk.migration.rev.grid.heading.docId',
      show: true,
      template: (props) => <DocIdCellTemplate {...props} />,
      width: 140,
    },
    {
      id: 'docRevName',
      field: 'docRevName',
      title: 'administration.bulk.migration.rev.grid.heading.name',
      show: true,
      template: (props) => <NameCellTemplate {...props} />,
      width: 235,
      sortable: false,
    },
    {
      id: 'status',
      field: 'status',
      title: 'administration.bulk.migration.rev.grid.heading.migration.status',
      filterCell: StatusFilter,
      width: 200,
    },
    {
      id: 'owner',
      field: 'name',
      title: 'administration.bulk.migration.rev.grid.heading.owner',
      show: true,
      template: (props) => <OwnerCellTemplate {...props} />,
      width: 200,
    },
    {
      id: 'fieldNamesUnmatched',
      field: 'fieldNamesUnmatched',
      title: 'administration.bulk.migration.rev.grid.heading.fieldsUnmatched',
      show: true,
      filterable: false,
      template: (props) => <FieldsUnmatchedCellTemplate {...props} scanId={scanId} />,
      width: 200,
    },
    {
      id: 'proposedAction',
      field: 'proposedAction',
      title: 'administration.bulk.migration.rev.grid.heading.proposedAction',
      show: true,
      filterable: false,
      template: (props) => <TextInputCellTemplate {...props} />,
      width: 200,
    },
  ];
};
