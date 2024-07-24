import React from 'react';
import { ColumnDefinition } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { ActiveCellTemplate } from '../../components/LocationsSetting/components/ActiveCellTemplate';
import EquipmentActionsCellTemplate from '../../components/LocationsSetting/components/EquipmentActionsCellTemplate';
import { TextCellTemplate } from '../../components/LocationsSetting/components/TextCellTemplate';
import { EditableCompanyLocation } from '../CompanyLocations/types';

interface SchemaOptions {
  actionsClass: string
  isActive: boolean
  onDiscard: () => void
  onConfirm: () => unknown
}

type schemaBuilder = (options: SchemaOptions) => Array<ColumnDefinition<EditableCompanyLocation>>;

export const buildSchema: schemaBuilder = ({ actionsClass, onDiscard, onConfirm, isActive }) => {
  return [
    {
      id: 'name',
      field: 'name',
      title: 'common.name',
      template: TextCellTemplate,
    },
    {
      id: 'active',
      field: 'active',
      title: 'common.active',
      width: 100,
      template: ActiveCellTemplate,
    },
    {
      id: 'actions',
      field: 'actions',
      filterable: false,
      className: actionsClass,
      template: (props) => <EquipmentActionsCellTemplate {...props} onDiscard={onDiscard} onConfirm={onConfirm} />,
      hidden: !isActive,
      width: 0,
    },
  ];
};
