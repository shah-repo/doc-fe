import { values } from 'lodash';
import React from 'react';
import { translate } from '../../../../../common/intl';
import { ColumnDefinition } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { ActionsCellTemplate } from '../commonCells/ActionsCellTemplate';
import { DropDownCellTemplate } from './components/cells/DropDownCellTemplate';
import { DropDownOptionsFilterCell } from './components/cells/DropDownOptionsFilterCell';
import { CustomHeaderTooltipCell } from './components/cells/HeaderCell';
import { LocationCellTemplate } from './components/cells/LocationCellTemplate';
import { LotIdCellTemplate } from './components/cells/LotIdCellTemplate';
import { PartIdCellTemplate } from './components/cells/PartIdCellTemplate';
import { TextInputCellTemplate } from './components/cells/TextInputCellTemplate';
import { WhereUsedCellTemplate } from './components/cells/WhereUsedCellTemplate';
import { MD_LOCATION_KEYS_MAPPING, OPTIONS } from './constants';
import { EditableMDItem, SchemaOptions } from './types';

const LOCATION_DATA = values(MD_LOCATION_KEYS_MAPPING).map(data => translate(data));

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
      title: 'approvalRequest.grid.heading.itemId',
      template: (props) => <PartIdCellTemplate {...props} onClick={onRowClick} />,
      show: true,
      selectable: false,
      width: 201,
    },
    {
      id: 'lotPartDisplayRev',
      field: 'lotPartDisplayRev',
      title: 'approvalRequest.md.grid.heading.rev',
      show: true,
      width: 201,
      selectable: false,
      sortable: false,
    },
    {
      id: 'lotDocId',
      field: 'lotDocId',
      title: 'approvalRequest.grid.heading.lot',
      headerCell: (props) => <CustomHeaderTooltipCell
        {...props}
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
      headerCell: (props) => <CustomHeaderTooltipCell
        {...props}
        content ="approvalRequest.grid.heading.location"
        title="approvalRequest.grid.heading.tooltip.location" />,
      filterCell: (props) => <DropDownOptionsFilterCell
        {...props}
        data={LOCATION_DATA}
        defaultItem=""
      />,
      template: (props) => <LocationCellTemplate {...props} onClick={onRowClick} />,
      selectable: false,
      width: 140,
    },
    {
      id: 'whereUsedView',
      field: 'whereUsedView',
      title: 'approvalRequest.grid.heading.whereUsedView',
      headerCell: (props) => <CustomHeaderTooltipCell
        {...props}
        content ="approvalRequest.grid.heading.whereUsedView"
        title="approvalRequest.grid.heading.tooltip.whereUsedView" />,
      template: (props) => <WhereUsedCellTemplate {...props} onClick={onRowClick} />,
      show: true,
      filterable: false,
      selectable: false,
      width: 110,
    },
    {
      id: 'onOrderPOAction',
      field: 'onOrderPOAction',
      title: 'approvalRequest.grid.heading.onOrder',
      show: true,
      selectable: true,
      headerCell: (props) => <CustomHeaderTooltipCell
        {...props}
        content ="approvalRequest.grid.heading.onOrder"
        title="approvalRequest.grid.heading.tooltip.onOrder" />,
      template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} onSelectCell={onSelectCell} />,
      width: 201,
    },
    {
      id: 'inInspectionAction',
      field: 'inInspectionAction',
      title: 'approvalRequest.grid.heading.Inspection',
      show: true,
      selectable: true,
      headerCell: (props) => <CustomHeaderTooltipCell
        {...props}
        content ="approvalRequest.grid.heading.Inspection"
        title="approvalRequest.grid.heading.tooltip.Inspection" />,
      template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} onSelectCell={onSelectCell} />,
      width: 201,
    },
    {
      id: 'inInventoryAction',
      field: 'inInventoryAction',
      title: 'approvalRequest.grid.heading.Inventory',
      show: true,
      selectable: true,
      headerCell: (props) => <CustomHeaderTooltipCell
        {...props}
        title ="approvalRequest.grid.heading.tooltip.Inventory"
        content="approvalRequest.grid.heading.Inventory" />,
      template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} onSelectCell={onSelectCell} />,
      width: 201,
    },
    {
      id: 'inWipAction',
      field: 'inWipAction',
      title: 'approvalRequest.grid.heading.wip',
      show: true,
      selectable: true,
      headerCell: (props) => <CustomHeaderTooltipCell
        {...props}
        content ="approvalRequest.grid.heading.wip"
        title="approvalRequest.grid.heading.tooltip.wip" />,
      template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} onSelectCell={onSelectCell} />,
      width: 201,
    },
    {
      id: 'asFinishedGoodsAction',
      field: 'asFinishedGoodsAction',
      title: 'approvalRequest.grid.heading.finishedGoods',
      show: true,
      selectable: true,
      headerCell: (props) => <CustomHeaderTooltipCell
        {...props}
        content ="approvalRequest.grid.heading.finishedGoods"
        title="approvalRequest.grid.heading.tooltip.finishedGoods" />,
      template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} onSelectCell={onSelectCell} />,
      width: 201,
    },
    {
      field: 'usedLocation',
      id: 'usedLocation',
      selectable: true,
      title: 'approvalRequest.grid.heading.field',
      show: true,
      headerCell: (props) => <CustomHeaderTooltipCell
        {...props}
        title ="approvalRequest.grid.heading.tooltip.field"
        content="approvalRequest.grid.heading.field" />,
      template: (props) => <DropDownCellTemplate {...props} options={OPTIONS} onClick={onRowClick} onSelectCell={onSelectCell} />,
      width: 201,
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
