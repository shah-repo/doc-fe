import React from 'react';
import { ColumnDefinition } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { ISupplierScanResultRev } from '../interface';
import CheckboxCell from './components/CheckboxCell';
import { ExpandCollapseCell } from './components/ExpandCollapseCell';
import SelectFilter from './components/SelectFilter';
import { SchemaOptions } from './types';

export const buildSchema = ({
  rowCount,
  numSelected,
  handlePopoverOpen,
  handlePopoverClose,
  handleHeaderCheckedChange,
  onDataItemExpanded,
}: SchemaOptions): Array<ColumnDefinition<ISupplierScanResultRev>> => {
  return [
    {
      id: '_expanded',
      field: '_expanded',
      filterable: false,
      title: '',
      template: (props) => (
        <ExpandCollapseCell
          {...props}
          onDataItemExpanded={onDataItemExpanded}
        />
      ),
      width: 60,
    },
    {
      id: 'id',
      field: 'selected',
      title: 'Select All',
      filterCell: (props) => <SelectFilter {...{ props, rowCount, numSelected, handleHeaderCheckedChange }} />,
      template: (props) => <CheckboxCell {...props} {...{ handlePopoverClose, handlePopoverOpen }} />,
      show: true,
      width: 65,
    },
    {
      id: 'docId',
      field: 'docId',
      title: 'administration.bulk.migration.rev.grid.heading.docId',
      show: true,
      width: 150,
    },
    {
      id: 'name',
      field: 'name',
      title: 'administration.bulk.migration.rev.grid.heading.name',
      show: true,
      // template: (props) => <InstructionsCellTemplate {...props} onClick={onRowClick} />,
      width: 250,
      sortable: false,
    },
    {
      id: 'owner',
      field: 'owner',
      title: 'administration.bulk.migration.rev.grid.heading.owner',
      show: true,
      // template: (props) => <AssignedTOCellTemplate {...props} onClick={onRowClick} />,
      width: 200,
    },
    {
      id: 'fieldsUnmatched',
      field: 'fieldsUnmatched',
      title: 'administration.bulk.migration.rev.grid.heading.fieldsUnmatched',
      show: true,
      filterable: false,
      // template: (props) => <UploadEvidenceCellTemplate {...props} {...{ employeeEvidenceUpdates, isDisabled, isClosed }} />,
      width: 200,
    },
    {
      id: 'proposedAction',
      field: 'proposedAction',
      title: 'administration.bulk.migration.rev.grid.heading.proposedAction',
      show: true,
      filterable: false,
      // template: (props) => <CommentCellTemplate {...props} {...{ isDisabled, isClosed }} />,
      width: 200,
    },
  ];
};
