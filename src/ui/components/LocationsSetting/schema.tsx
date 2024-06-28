import React from 'react';
import { EditableCompanyLocation } from '../../user.management/profile/CompanyLocations/types';
import { ColumnDefinition } from '../KendoDataGrid/KendoDataGrid.types';
import ActionsCellTemplate from './components/ActionsCellTemplate';
import { ActiveCellTemplate } from './components/ActiveCellTemplate';
import { TextCellTemplate } from './components/TextCellTemplate';

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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      template: (props) => <ActionsCellTemplate {...props} onDiscard={onDiscard} onConfirm={onConfirm} />,
      hidden: !isActive,
      width: 0,
    },
  ];
};
