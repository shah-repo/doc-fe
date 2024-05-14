import React from 'react';
import { EditableCompanyLocation } from '../../administration/general.settings/panels/CompanyLocations/types';
import { ColumnDefinition, DataGridRowClickEvent } from '../KendoDataGrid/KendoDataGrid.types';
import ActionsCellTemplate from './components/ActionsCellTemplate';
import { ActiveCellTemplate } from './components/ActiveCellTemplate';
import { IncludedTotalQtyCellTemplate } from './components/IncludedTotalQtyCellTemplate';
import { TextCellTemplate } from './components/TextCellTemplate';

export interface EditableCompanyLocationEvent {
  dataItem: EditableCompanyLocation
}

interface SchemaOptions {
  actionsClass: string
  isActive: boolean
  renderIncludedTotalQty: boolean
  onDiscard: () => void
  onDelete: () => void
  onConfirm: () => unknown
  onRowClick?: (e: DataGridRowClickEvent<EditableCompanyLocation>) => void

}

type schemaBuilder = (options: SchemaOptions) => Array<ColumnDefinition<EditableCompanyLocation>>;

export const buildSchema: schemaBuilder = ({ actionsClass, onDiscard, onConfirm, onDelete, renderIncludedTotalQty, onRowClick }) => {
  return [
    {
      id: 'active',
      field: 'active',
      title: 'common.active',
      width: 100,
      template: ActiveCellTemplate,
    },
    {
      id: 'name',
      field: 'name',
      title: 'common.name',
      template: TextCellTemplate,
    },
    {
      id: 'includedTotalQty',
      field: 'includedTotalQty',
      title: 'settings.locations.included.total.quantity',
      template: IncludedTotalQtyCellTemplate,
      hidden: !renderIncludedTotalQty,
    },
    {
      id: 'actions',
      field: 'actions',
      title: 'common.actions',
      filterable: false,
      template: (props) => <ActionsCellTemplate {...props} onClick ={onRowClick} onDiscard={onDiscard} onConfirm={onConfirm} onDelete={onDelete} />,
      hidden: !renderIncludedTotalQty,
      width: 100,
    },
  ];
};
