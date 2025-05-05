import React from 'react';
import { ColumnDefinition } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { ISupplierScanResultRev } from '../interface';
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
}: SchemaOptions): Array<ColumnDefinition<ISupplierScanResultRev>> => {
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
