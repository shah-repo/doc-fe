import React from 'react';
import { ColumnDefinition } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { ISupplierScanResultRev } from '../interface';
import CheckboxCell from './components/CheckboxCell';
import SelectFilter from './components/SelectFilter';
import { SchemaOptions } from './types';

export const buildSchema = ({
  isDisabled,
  isClosed,
  rowCount,
  numSelected,
  handleHeaderCheckedChange,
}: SchemaOptions): Array<ColumnDefinition<ISupplierScanResultRev>> => {
  return [
    {
      id: 'id',
      field: 'selected',
      title: 'Select All',
      filterCell: (props) => <SelectFilter {...{ props, rowCount, numSelected, handleHeaderCheckedChange }} />,
      template: CheckboxCell,
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
    // {
    //   id: 'assigneeAction',
    //   title: 'approvalRequest.grid.heading.assignee.action',
    //   show: false,
    //   // template: (props) => <AssigneeActionCellTemplate {...props} {...{ employeeStatusUpdates, isDisabled, isClosed }} />,
    //   width: 350,
    // },
  ];
};
