import React from 'react';
import { ColumnDefinition, DataGridRowClickEvent } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { ActiveCellTemplate } from '../../components/LocationsSetting/components/ActiveCellTemplate';
import { IncludedInTotalQtyCellTemplate } from '../../components/LocationsSetting/components/IncludedInTotalQtyCellTemplate';
import LocationActionsCellTemplate from '../../components/LocationsSetting/components/LocationActionsCellTemplate';
import { TextCellTemplate } from '../../components/LocationsSetting/components/TextCellTemplate';
import { EditableCompanyLocation } from './types';

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
      id: 'includedInTotalQty',
      field: 'includedInTotalQty',
      title: 'settings.locations.included.total.quantity',
      template: IncludedInTotalQtyCellTemplate,
    },
    {
      id: 'actions',
      field: 'actions',
      title: 'common.actions',
      filterable: false,
      template: (props) => (
        <LocationActionsCellTemplate
          {...props}
          onClick={onRowClick as ((e: { dataItem: EditableCompanyLocation }) => void) & ((e: DataGridRowClickEvent<EditableCompanyLocation>) => void)}
          onDiscard={onDiscard}
          onConfirm={onConfirm}
        />
      ),
      width: 100,
    },
  ];
};
