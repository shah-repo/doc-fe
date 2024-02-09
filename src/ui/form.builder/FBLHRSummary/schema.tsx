import React from 'react';
import { ActionsCellTemplate } from '../../change.request/FBMaterialDisposition/components/commonCells/ActionsCellTemplate';
import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { TextInputCellTemplate } from './components/cells/TextInputCellTemplate';
import { EditableLHRSummaryItem, SchemaOptions } from './types';

export const buildSchema = ({
  actionsClass,
  onRowClick,
  onConfirm,
  onDiscard,
}: SchemaOptions): Array<ColumnDefinition<EditableLHRSummaryItem>> => {
  return [
    {
      id: 'type',
      field: 'type',
      title: 'lhr.summary.grid.heading.type',
      // template: (props) => <PartIdCellTemplate {...props} onClick={onRowClick} />,
      show: true,
      width: 201,
    },
    {
      id: 'step',
      field: 'step',
      title: 'lhr.summary.grid.heading.step',
      show: true,
      width: 201,
      sortable: false,
    },
    {
      id: 'plannedId',
      field: 'plannedId',
      title: 'lhr.summary.grid.heading.planned.id',
      // headerCell: () => <CustomHeaderTooltipCell
      //   content ="approvalRequest.grid.heading.lot"
      //   title="approvalRequest.grid.heading.tooltip.lot" />,
      // template: (props) => <LotIdCellTemplate {...props} onClick={onRowClick} />,
      show: true,
      width: 201,
    },
    {
      id: 'actualId',
      field: 'actualId',
      title: 'lhr.summary.grid.heading.actual.id',
      show: true,
      sortable: false,
      // headerCell: () => <CustomHeaderTooltipCell
      //   content ="approvalRequest.grid.heading.location"
      //   title="approvalRequest.grid.heading.tooltip.location" />,
      // filterCell: (props) => <DropDownOptionsFilterCell
      //   {...props}
      //   data={LOCATION_DATA}
      //   defaultItem=""
      // />,
      // template: (props) => <LocationCellTemplate {...props} onClick={onRowClick} />,
      selectable: false,
      width: 201,
    },
    {
      id: 'title',
      field: 'title',
      title: 'lhr.summary.grid.heading.title',
      // headerCell: () => <CustomHeaderTooltipCell
      //   content ="approvalRequest.grid.heading.whereUsedView"
      //   title="approvalRequest.grid.heading.tooltip.whereUsedView" />,
      // template: (props) => <WhereUsedCellTemplate {...props} onClick={onRowClick} />,
      show: true,
      selectable: false,
      width: 201,
    },
    {
      id: 'lotId',
      field: 'lotId',
      title: 'lhr.summary.grid.heading.lot',
      show: true,
      selectable: false,
      // headerCell: () => <CustomHeaderTooltipCell
      //   content ="approvalRequest.grid.heading.onOrder"
      //   title="approvalRequest.grid.heading.tooltip.onOrder" />,
      // template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} onSelectCell={onSelectCell} />,
      width: 201,
    },
    {
      id: 'expiryDate',
      field: 'expiryDate',
      title: 'lhr.summary.grid.heading.expiry.date',
      show: true,
      selectable: false,
      // headerCell: () => <CustomHeaderTooltipCell
      //   content ="approvalRequest.grid.heading.Inspection"
      //   title="approvalRequest.grid.heading.tooltip.Inspection" />,
      // template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} onSelectCell={onSelectCell} />,
      width: 201,
    },
    {
      id: 'startQuantity',
      field: 'startQuantity',
      title: 'lhr.summary.grid.heading.start.qty',
      show: true,
      selectable: false,
      // headerCell: () => <CustomHeaderTooltipCell
      //   title ="approvalRequest.grid.heading.tooltip.Inventory"
      //   content="approvalRequest.grid.heading.Inventory" />,
      // template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} onSelectCell={onSelectCell} />,
      width: 201,
    },
    {
      id: 'endQuantity',
      field: 'endQuantity',
      title: 'lhr.summary.grid.heading.end.qty',
      show: true,
      selectable: false,
      // headerCell: () => <CustomHeaderTooltipCell
      //   content ="approvalRequest.grid.heading.wip"
      //   title="approvalRequest.grid.heading.tooltip.wip" />,
      // template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} onSelectCell={onSelectCell} />,
      width: 201,
    },
    {
      id: 'status',
      field: 'status',
      title: 'lhr.summary.grid.heading.status',
      show: true,
      selectable: false,
      // headerCell: () => <CustomHeaderTooltipCell
      //   content ="approvalRequest.grid.heading.finishedGoods"
      //   title="approvalRequest.grid.heading.tooltip.finishedGoods" />,
      // template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} onSelectCell={onSelectCell} />,
      width: 201,
    },
    {
      field: 'calDueDate',
      id: 'calDueDate',
      selectable: false,
      title: 'lhr.summary.grid.heading.cal.due.date',
      show: true,
      // headerCell: () => <CustomHeaderTooltipCell
      //   title ="approvalRequest.grid.heading.tooltip.field"
      //   content="approvalRequest.grid.heading.field" />,
      // template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} onSelectCell={onSelectCell} />,
      width: 201,
    },
    {
      id: 'pmDueDate',
      field: 'pmDueDate',
      title: 'lhr.summary.grid.heading.pm.due.date',
      show: true,
      template: (props) => <TextInputCellTemplate {...props} onClick={onRowClick} />,
      width: 201,
    },
    {
      id: 'ncmr',
      field: 'ncmr',
      title: 'lhr.summary.grid.heading.ncmr',
      show: true,
      // template: (props) => <TextInputCellTemplate {...props} onClick={onRowClick} />,
      width: 201,
    },
    {
      id: 'comments',
      field: 'comments',
      title: 'lhr.summary.grid.heading.comments',
      show: true,
      template: (props) => <TextInputCellTemplate {...props} onClick={onRowClick} />,
      width: 201,
    },
    {
      id: 'createdBy',
      field: 'createdBy',
      title: 'lhr.summary.grid.heading.entered.by',
      show: true,
      // template: (props) => <TextInputCellTemplate {...props} onClick={onRowClick} />,
      width: 201,
    },
    {
      id: 'createdAt',
      field: 'createdAt',
      title: 'lhr.summary.grid.heading.date',
      show: true,
      // template: (props) => <TextInputCellTemplate {...props} onClick={onRowClick} />,
      width: 201,
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
