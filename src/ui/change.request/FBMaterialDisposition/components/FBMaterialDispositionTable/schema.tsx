import { ColumnDefinition } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { ActionsCellTemplate } from './components/cells/ActionsCellTemplate';
import { CommentsCellTemplate } from './components/cells/CommentsCellTemplate';
import { DropDownCellTemplate } from './components/cells/DropDownCellTemplate';
import { WhereUsedCellTemplate } from './components/cells/WhereUsedCellTemplate';
import { OPTIONS } from './constants';
import { EditableMDItem, SchemaOptions } from './interface';
import React from 'react';

export const buildSchema = ({
  actionsClass,
  onRowClick,
  onConfirm,
  onDiscard,
  onDelete,
}: SchemaOptions): Array<ColumnDefinition<EditableMDItem>> => {
  return [
    {
      id: 'partId',
      field: 'partId',
      title: 'approvalRequest.grid.heading.partId',
      show: true,
      width: 201,
    },
    {
      id: 'rev',
      field: 'rev',
      title: 'approvalRequest.grid.heading.rev',
      show: true,
      width: 201,
      sortable: false,
    },
    {
      id: 'lot',
      field: 'lot',
      title: 'approvalRequest.grid.heading.lot',
      show: true,
      width: 201,
    },
    {
      id: 'whereUsed',
      field: 'whereUsed',
      title: 'approvalRequest.grid.heading.where.used',
      show: true,
      cell: (props) => <WhereUsedCellTemplate {...props} />,
      width: 112,
    },
    {
      id: 'onOrder',
      field: 'onOrder',
      title: 'approvalRequest.grid.heading.onOrder',
      show: true,
      template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} />,
      width: 201,
    },
    {
      id: 'Inspection',
      field: 'Inspection',
      title: 'approvalRequest.grid.heading.Inspection',
      show: true,
      template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} />,
      width: 201,
    },
    {
      id: 'Inventory',
      field: 'Inventory',
      title: 'approvalRequest.grid.heading.Inventory',
      show: true,
      template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} />,
      width: 201,
    },
    {
      id: 'wip',
      field: 'wip',
      title: 'approvalRequest.grid.heading.wip',
      show: true,
      template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} />,
      width: 201,
    },
    {
      id: 'finishedGoods',
      field: 'finishedGoods',
      title: 'approvalRequest.grid.heading.finishedGoods',
      show: true,
      template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} />,
      width: 201,
    },
    {
      field: 'field',
      id: 'field',
      title: 'approvalRequest.grid.heading.field',
      show: true,
      width: 201,
    },
    {
      id: 'comments',
      field: 'comments',
      title: 'approvalRequest.grid.heading.comments',
      show: true,
      template: (props) => <CommentsCellTemplate {...props} onClick={onRowClick} />,
      width: 324,
    },
    {
      id: 'actions',
      title: 'actions',
      className: actionsClass,
      show: true,
      template: (props) => (
        <ActionsCellTemplate
          {...props}
          onConfirm={onConfirm}
          onDiscard={onDiscard}
          onDelete={onDelete}
        />
      ),
      width: 1,
    },
  ];
};
