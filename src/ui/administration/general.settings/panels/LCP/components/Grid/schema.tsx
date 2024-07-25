import React from 'react';
import { translate } from '../../../../../../../common/intl';
import { ColumnDefinition } from '../../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { ActionsCell } from './cell.templates/ActionsCell';
import { DropdownCell } from './cell.templates/DropdownCell';
import { EnlilTypeCell } from './cell.templates/EnlilTypeCell';
import { LabelCell } from './cell.templates/LabelCell';
import { LCP, SchemaOptions } from './types';

export const LCPSchema = ({
  actionsClass,
  onConfirm,
  onDiscard,
  onDelete,
}: SchemaOptions): Array<ColumnDefinition<LCP>> => {
  return [
    {
      id: 'internalType',
      field: 'internalType',
      title: translate('administration.general.settings.lcp.internalType'),
      width: 200,
      locked: false,
      cell: EnlilTypeCell,
      groupable: false,
      sortable: false,
    },
    {
      id: 'displayLabel',
      field: 'displayLabel',
      locked: false,
      groupable: false,
      cell: LabelCell,
      title: translate('administration.general.settings.lcp.displayLabel'),
      width: 250,
    },
    {
      id: 'isAllowedOnPO',
      field: 'isAllowedOnPO',
      locked: false,
      groupable: false,
      title: translate('administration.general.settings.lcp.isAllowedOnPO'),
      width: 200,
      cell: DropdownCell,
      mainOrderIndex: 3,
    },
    {
      id: 'isAllowedOnLhrProd',
      field: 'isAllowedOnLhrProd',
      locked: false,
      groupable: false,
      title: translate('administration.general.settings.lcp.isAllowedOnLhrProd'),
      width: 200,
      cell: DropdownCell,
      mainOrderIndex: 4,
    },
    {
      id: 'isAllowedToBuy',
      field: 'isAllowedToBuy',
      locked: false,
      groupable: false,
      title: translate('administration.general.settings.lcp.isAllowedToBuy'),
      cell: DropdownCell,
      width: 220,
      mainOrderIndex: 5,
    },
    {
      id: 'category',
      field: 'category',
      hidden: true,
      locked: false,
      groupable: false,
      mainOrderIndex: 5,
    },
    {
      id: 'actions',
      title: 'actions',
      className: actionsClass,
      template: (props) => (
        <ActionsCell
          {...props}
          onConfirm={onConfirm}
          onDiscard={onDiscard}
          onDelete={onDelete}
        />
      ),
      width: 1,
    },
  ];
};
