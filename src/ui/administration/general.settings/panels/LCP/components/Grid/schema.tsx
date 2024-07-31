import React from 'react';
import { translate } from '../../../../../../../common/intl';
import { ColumnDefinition } from '../../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { ActiveCell } from './cell.templates/ActiveCell';
import { DropdownCell } from './cell.templates/DropdownCell';
import { EnlilTypeCell } from './cell.templates/EnlilTypeCell';
import { HeaderCell } from './cell.templates/HeaderCell';
import { LabelCell } from './cell.templates/LabelCell';
import LCPActionsCellTemplate from './cell.templates/LCPActionsCellTemplate';
import { LCP, SchemaOptions } from './types';

export const LCPSchema = ({
  onConfirm,
  onDiscard,
  onDelete,
  onDeletePhase,
}: SchemaOptions): Array<ColumnDefinition<LCP>> => {
  return [
    {
      id: 'isActive',
      field: 'isActive',
      title: translate('administration.general.settings.lcp.isActive'),
      width: 80,
      filterable: false,
      locked: false,
      cell: (props) => <ActiveCell {...props} />,
      groupable: false,
      sortable: false,
    },
    {
      id: 'internalType',
      field: 'internalType',
      title: translate('administration.general.settings.lcp.internalType'),
      width: 200,
      locked: false,
      cell: (props) => <EnlilTypeCell {...props} onDeletePhase={onDeletePhase} />,
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
      id: 'isApprovedSupplierEnforcedOnPO',
      field: 'isApprovedSupplierEnforcedOnPO',
      locked: false,
      groupable: false,
      title: translate('administration.general.settings.lcp.isApprovedSupplierEnforcedOnPO'),
      headerCell: (props) => <HeaderCell
        {...props}
        content="administration.general.settings.lcp.isApprovedSupplierEnforcedOnPO" />,
      width: 250,
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
      headerCell: (props) => <HeaderCell
        {...props}
        content="administration.general.settings.lcp.isAllowedOnLhrProd" />,
      cell: DropdownCell,
      mainOrderIndex: 4,
    },
    {
      id: 'isAllowedToBuy',
      field: 'isAllowedToBuy',
      locked: false,
      groupable: false,
      title: translate('administration.general.settings.lcp.isAllowedToBuy'),
      headerCell: (props) => <HeaderCell
        {...props}
        content="administration.general.settings.lcp.isAllowedToBuy" />,
      cell: DropdownCell,
      width: 250,
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
      field: 'actions',
      title: 'common.actions',
      filterable: false,
      template: (props) => (
        <LCPActionsCellTemplate
          {...props}
          onDiscard={onDiscard}
          onConfirm={onConfirm}
        />
      ),
      width: 100,
    },
  ];
};
