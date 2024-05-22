import React from 'react';
import { ColumnDefinition, DataGridRowClickEvent } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { ActiveCellTemplate } from '../../components/LocationsSetting/components/ActiveCellTemplate';
import { IncludedTotalQtyCellTemplate } from '../../components/LocationsSetting/components/IncludedTotalQtyCellTemplate';
import LocationActionsCellTemplate from '../../components/LocationsSetting/components/LocationActionsCellTemplate';
import { TextCellTemplate } from '../../components/LocationsSetting/components/TextCellTemplate';
import { EditableCompanyLocation } from './types';

export interface EditableCompanyLocationEvent {
  dataItem: EditableCompanyLocation
}

interface SchemaOptions {
  actionsClass: string
  isActive: boolean
  onDiscard: () => void
  onConfirm: () => unknown
  onRowClick?: (e: DataGridRowClickEvent<EditableCompanyLocation>) => void
}

type schemaBuilder = (options: SchemaOptions) => Array<ColumnDefinition<EditableCompanyLocation>>;
export const buildSchema: schemaBuilder = ({ onDiscard, onConfirm, onRowClick }) => {
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
    },
    {
      id: 'actions',
      field: 'actions',
      title: 'common.actions',
      filterable: false,
      template: (props) => <LocationActionsCellTemplate {...props} onClick ={onRowClick} onDiscard={onDiscard} onConfirm={onConfirm} />,
      width: 100,
    },
  ];
};
