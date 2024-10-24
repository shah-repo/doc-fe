import React from 'react';
import { CompanyLocation } from '../../../../../state/ducks/company/types';
import ActiveCellTemplate from '../../components/SettingsTable/components/ActiveCellTemplate';
import { SchemaBuilder } from '../../components/SettingsTable/types';
import { LocationCellTemplate } from './components/LocationCellTemplate';
import { LotStatusCellTemplate } from './components/LotStatusCellTemplate';
import { TransferTypeCellTemplate } from './components/TransferTypeCellTemplate';
import WhenCellTemplate from './components/WhenCellTemplate';
import { EditableSystemTransactionsRule, LocationField } from './types';

interface SchemaOptions {
  locations: CompanyLocation[]
  onLocationChange?: (rule: EditableSystemTransactionsRule, field: LocationField, location?: CompanyLocation) => void
}

export const buildSchema: SchemaBuilder<EditableSystemTransactionsRule, SchemaOptions> = ({
  locations,
  isActive,
  onActiveStateChange,
  onLocationChange,
}) => ([
  {
    id: 'active',
    field: 'active',
    title: 'common.active',
    width: 70,
    template: (props) => (
      <ActiveCellTemplate
        {...props}
        onActiveStateChange={onActiveStateChange}
      />
    ),
  },
  {
    id: 'event',
    field: 'event',
    title: 'administration.general.settings.system.transactions.when',
    template: WhenCellTemplate,
  },
  {
    id: 'action',
    field: 'action',
    title: 'common.token.action',
    template: TransferTypeCellTemplate,
    width: 100,
  },
  {
    id: 'from',
    field: 'from',
    title: 'administration.general.settings.material.flow.location.from',
    template: (props) => (
      <LocationCellTemplate
        {...props}
        options={locations}
        isActive={isActive}
        onLocationChange={onLocationChange}
      />
    ),
  },
  {
    id: 'to',
    field: 'to',
    title: 'administration.general.settings.material.flow.location.to',
    template: (props) => (
      <LocationCellTemplate
        {...props}
        options={locations}
        isActive={isActive}
        onLocationChange={onLocationChange}
      />
    ),
  },
  {
    id: 'status',
    field: 'lotStatus',
    title: 'administration.general.settings.material.flow.location.lot.status',
    template: LotStatusCellTemplate,
    width: 120,
  },
]);
