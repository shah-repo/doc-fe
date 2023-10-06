import { ColumnDefinition } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { ActionsCellTemplate } from './components/cells/ActionsCellTemplate';
import { DropDownCellTemplate } from './components/cells/DropDownCellTemplate';
import { TextInputCellTemplate } from './components/cells/TextInputCellTemplate';
import { WhereUsedCellTemplate } from './components/cells/WhereUsedCellTemplate';
import { OPTIONS } from './constants';
import { EditableMDItem, SchemaOptions } from './interface';
import React from 'react';

export const buildSchema = ({
  actionsClass,
  onRowClick,
  onConfirm,
  onDiscard,
}: SchemaOptions): Array<ColumnDefinition<EditableMDItem>> => {
  return [
    {
      id: 'partDocId',
      field: 'partDocId',
      title: 'approvalRequest.grid.heading.partId',
      show: true,
      width: 201,
    },
    {
      id: 'revisionsFromTo',
      field: 'revisionsFromTo',
      title: 'approvalRequest.grid.heading.rev',
      show: true,
      width: 201,
      sortable: false,
    },
    {
      id: 'lotDocId',
      field: 'lotDocId',
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
      id: 'onOrderPOAction',
      field: 'onOrderPOAction',
      title: 'approvalRequest.grid.heading.onOrder',
      show: true,
      template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} />,
      width: 201,
    },
    {
      id: 'inInspectionAction',
      field: 'inInspectionAction',
      title: 'approvalRequest.grid.heading.Inspection',
      show: true,
      template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} />,
      width: 201,
    },
    {
      id: 'inInventoryAction',
      field: 'inInventoryAction',
      title: 'approvalRequest.grid.heading.Inventory',
      show: true,
      template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} />,
      width: 201,
    },
    {
      id: 'inWipAction',
      field: 'inWipAction',
      title: 'approvalRequest.grid.heading.wip',
      show: true,
      template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} />,
      width: 201,
    },
    {
      id: 'asFinishedGoodsAction',
      field: 'asFinishedGoodsAction',
      title: 'approvalRequest.grid.heading.finishedGoods',
      show: true,
      template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} />,
      width: 201,
    },
    {
      field: 'usedLocation',
      id: 'usedLocation',
      title: 'approvalRequest.grid.heading.field',
      show: true,
      template: (props) => <TextInputCellTemplate {...props} onClick={onRowClick} />,
      width: 201,
    },
    {
      id: 'comment',
      field: 'comment',
      title: 'approvalRequest.grid.heading.comments',
      show: true,
      template: (props) => <TextInputCellTemplate {...props} onClick={onRowClick} />,
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
        />
      ),
      width: 1,
    },
  ];
};
