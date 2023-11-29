import React from 'react';
import { ColumnDefinition } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { ActionsCellTemplate } from '../commonCells/ActionsCellTemplate';
import { DropDownCellTemplate } from './components/cells/DropDownCellTemplate';
import { LotIdCellTemplate } from './components/cells/LotIdCellTemplate';
import { PartIdCellTemplate } from './components/cells/PartIdCellTemplate';
import { TextInputCellTemplate } from './components/cells/TextInputCellTemplate';
import { WhereUsedCellTemplate } from './components/cells/WhereUsedCellTemplate';
import { OPTIONS } from './constants';
import { EditableMDItem, SchemaOptions } from './types';

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
      template: (props) => <PartIdCellTemplate {...props} onClick={onRowClick} />,
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
      template: (props) => <LotIdCellTemplate {...props} onClick={onRowClick} />,
      show: true,
      width: 201,
    },
    {
      id: 'whereUsedView',
      field: 'whereUsedView',
      title: 'approvalRequest.grid.heading.whereUsedView',
      template: (props) => <WhereUsedCellTemplate {...props} onClick={onRowClick} />,
      show: true,
      width: 120,
    },
    {
      id: 'onOrderPOAction',
      field: 'onOrderPOAction',
      title: 'approvalRequest.grid.heading.onOrder',
      show: true,
      template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} />,
      width: 380,
    },
    {
      id: 'inInspectionAction',
      field: 'inInspectionAction',
      title: 'approvalRequest.grid.heading.Inspection',
      show: true,
      template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} />,
      width: 380,
    },
    {
      id: 'inInventoryAction',
      field: 'inInventoryAction',
      title: 'approvalRequest.grid.heading.Inventory',
      show: true,
      template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} />,
      width: 380,
    },
    {
      id: 'inWipAction',
      field: 'inWipAction',
      title: 'approvalRequest.grid.heading.wip',
      show: true,
      template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} />,
      width: 380,
    },
    {
      id: 'asFinishedGoodsAction',
      field: 'asFinishedGoodsAction',
      title: 'approvalRequest.grid.heading.finishedGoods',
      show: true,
      template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} />,
      width: 380,
    },
    {
      field: 'usedLocation',
      id: 'usedLocation',
      title: 'approvalRequest.grid.heading.field',
      show: true,
      template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} />,
      width: 380,
    },
    {
      id: 'comment',
      field: 'comment',
      title: 'approvalRequest.grid.heading.comments',
      show: true,
      template: (props) => <TextInputCellTemplate {...props} onClick={onRowClick} />,
      width: 380,
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
