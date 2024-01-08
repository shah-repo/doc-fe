import React from 'react';
import { ColumnDefinition } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { ActionsCellTemplate } from '../commonCells/ActionsCellTemplate';
import { DropDownCellTemplate } from './components/cells/DropDownCellTemplate';
import { CustomHeaderTooltipCell } from './components/cells/HeaderCell';
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
  onSelectCell,
}: SchemaOptions): Array<ColumnDefinition<EditableMDItem>> => {
  return [
    {
      id: 'partDocId',
      field: 'partDocId',
      title: 'approvalRequest.grid.heading.partId',
      template: (props) => <PartIdCellTemplate {...props} onClick={onRowClick} />,
      show: true,
      selectable: false,
      width: 201,
    },
    {
      id: 'revisionsFromTo',
      field: 'revisionsFromTo',
      title: 'approvalRequest.grid.heading.rev',
      show: true,
      width: 201,
      selectable: false,
      sortable: false,
    },
    {
      id: 'lotDocId',
      field: 'lotDocId',
      headerCell: () => <CustomHeaderTooltipCell
        content ="approvalRequest.grid.heading.lot"
        title="approvalRequest.grid.heading.tooltip.lot" />,
      template: (props) => <LotIdCellTemplate {...props} onClick={onRowClick} />,
      show: true,
      selectable: false,
      width: 201,
    },
    {
      id: 'location',
      field: 'location',
      title: 'approvalRequest.grid.heading.location',
      show: true,
      sortable: false,
      selectable: false,
      width: 201,
    },
    {
      id: 'whereUsedView',
      field: 'whereUsedView',
      headerCell: () => <CustomHeaderTooltipCell
        content ="approvalRequest.grid.heading.whereUsedView"
        title="approvalRequest.grid.heading.tooltip.whereUsedView" />,
      template: (props) => <WhereUsedCellTemplate {...props} onClick={onRowClick} />,
      show: true,
      selectable: false,
      width: 120,
    },
    {
      id: 'onOrderPOAction',
      field: 'onOrderPOAction',
      show: true,
      selectable: true,
      headerCell: () => <CustomHeaderTooltipCell
        content ="approvalRequest.grid.heading.onOrder"
        title="approvalRequest.grid.heading.tooltip.onOrder" />,
      template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} onSelectCell={onSelectCell} />,
      width: 380,
    },
    {
      id: 'inInspectionAction',
      field: 'inInspectionAction',
      show: true,
      selectable: true,
      headerCell: () => <CustomHeaderTooltipCell
        content ="approvalRequest.grid.heading.Inspection"
        title="approvalRequest.grid.heading.tooltip.Inspection" />,
      template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} onSelectCell={onSelectCell} />,
      width: 380,
    },
    {
      id: 'inInventoryAction',
      field: 'inInventoryAction',
      show: true,
      selectable: true,
      headerCell: () => <CustomHeaderTooltipCell
        title ="approvalRequest.grid.heading.tooltip.Inventory"
        content="approvalRequest.grid.heading.Inventory" />,
      template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} onSelectCell={onSelectCell} />,
      width: 380,
    },
    {
      id: 'inWipAction',
      field: 'inWipAction',
      title: 'approvalRequest.grid.heading.wip',
      show: true,
      selectable: true,
      headerCell: () => <CustomHeaderTooltipCell
        content ="approvalRequest.grid.heading.wip"
        title="approvalRequest.grid.heading.tooltip.wip" />,
      template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} onSelectCell={onSelectCell} />,
      width: 380,
    },
    {
      id: 'asFinishedGoodsAction',
      field: 'asFinishedGoodsAction',
      title: 'approvalRequest.grid.heading.finishedGoods',
      show: true,
      selectable: true,
      headerCell: () => <CustomHeaderTooltipCell
        content ="approvalRequest.grid.heading.finishedGoods"
        title="approvalRequest.grid.heading.tooltip.finishedGoods" />,
      template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} onSelectCell={onSelectCell} />,
      width: 380,
    },
    {
      field: 'usedLocation',
      id: 'usedLocation',
      selectable: true,
      title: 'approvalRequest.grid.heading.field',
      show: true,
      headerCell: () => <CustomHeaderTooltipCell
        title ="approvalRequest.grid.heading.tooltip.field"
        content="approvalRequest.grid.heading.field" />,
      template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} onSelectCell={onSelectCell} />,
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
