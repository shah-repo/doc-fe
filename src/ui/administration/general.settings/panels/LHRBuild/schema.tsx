import React from 'react';
import ActionsCellTemplate from '../../components/SettingsTable/components/ActionsCellTemplate';
import ActiveCellTemplate from '../../components/SettingsTable/components/ActiveCellTemplate';
import { AutocompleteCellTemplate } from '../../components/SettingsTable/components/AutocompleteCellTemplate';
import TextCellTemplate from '../../components/SettingsTable/components/TextCellTemplate';
import { SchemaBuilder } from '../../components/SettingsTable/types';
import { HeaderCell } from './components/HeaderCell';
import { EditableLHRBuild } from './types';

export const buildSchema: SchemaBuilder<EditableLHRBuild> = ({
  isActive,
  onEdit,
  onActiveStateChange,
  onDiscard,
  onConfirm,
}) => {
  return [
    {
      id: 'isActive',
      field: 'isActive',
      title: 'common.active',
      width: 70,
      template: (props) => (
        <ActiveCellTemplate
          {...props}
          onActiveStateChange={onActiveStateChange}
        />
      ),
      locked: true,
    },
    {
      id: 'internalType',
      field: 'internalType',
      title: 'administration.general.settings.suppliers.enlil.internal',
      template: AutocompleteCellTemplate,
      width: 200,
      locked: true,
    },
    {
      id: 'displayLabel',
      field: 'displayLabel',
      title: 'administration.general.settings.suppliers.customer.label',
      template: TextCellTemplate,
      width: 200,
      locked: true,
    },
    {
      id: 'enforceCurrentCalOrPm',
      field: 'enforceCurrentCalOrPm',
      headerCell: (props) => (
        <HeaderCell
          {...props}
          content="administration.general.settings.lhrBuildTypeConfig.lhrBuild.enforceCurrentCalOrPm"
          tooltipTitle="administration.general.settings.lhrBuildTypeConfig.lhrBuild.enforceCurrentCalOrPm.tooltip"
        />
      ),
      template: AutocompleteCellTemplate,
      width: 200,
    },
    {
      id: 'enforceLotQtyRange',
      field: 'enforceLotQtyRange',
      headerCell: (props) => (
        <HeaderCell
          {...props}
          content="administration.general.settings.lhrBuildTypeConfig.lhrBuild.enforceLotQtyRange"
          tooltipTitle="administration.general.settings.lhrBuildTypeConfig.lhrBuild.enforceLotQtyRange.tooltip"
        />
      ),
      template: AutocompleteCellTemplate,
      width: 200,
    },
    {
      id: 'enforceQtyReconciliation',
      field: 'enforceQtyReconciliation',
      headerCell: (props) => (
        <HeaderCell
          {...props}
          content="administration.general.settings.lhrBuildTypeConfig.lhrBuild.enforceQtyReconciliation"
          tooltipTitle="administration.general.settings.lhrBuildTypeConfig.lhrBuild.enforceQtyReconciliation.tooltip"
        />
      ),
      template: AutocompleteCellTemplate,
      width: 200,
    },
    {
      id: 'enforceLotRequired',
      field: 'enforceLotRequired',
      headerCell: (props) => (
        <HeaderCell
          {...props}
          content="administration.general.settings.lhrBuildTypeConfig.lhrBuild.enforceLotRequired"
          tooltipTitle="administration.general.settings.lhrBuildTypeConfig.lhrBuild.enforceLotRequired.tooltip"
        />
      ),
      template: AutocompleteCellTemplate,
      width: 200,
    },
    {
      id: 'enforceNonExpiredLots',
      field: 'enforceNonExpiredLots',
      headerCell: (props) => (
        <HeaderCell
          {...props}
          content="administration.general.settings.lhrBuildTypeConfig.lhrBuild.enforceNonExpiredLots"
          tooltipTitle="administration.general.settings.lhrBuildTypeConfig.lhrBuild.enforceNonExpiredLots.tooltip"
        />
      ),
      template: AutocompleteCellTemplate,
      width: 200,
    },
    {
      id: 'enforceEquipmentRequired',
      field: 'enforceEquipmentRequired',
      headerCell: (props) => (
        <HeaderCell
          {...props}
          content="administration.general.settings.lhrBuildTypeConfig.lhrBuild.enforceEquipmentRequired"
          tooltipTitle="administration.general.settings.lhrBuildTypeConfig.lhrBuild.enforceEquipmentRequired.tooltip"
        />
      ),
      template: AutocompleteCellTemplate,
      width: 200,
    },
    {
      id: 'enforceProdLotsOnly',
      field: 'enforceProdLotsOnly',
      headerCell: (props) => (
        <HeaderCell
          {...props}
          content="administration.general.settings.lhrBuildTypeConfig.lhrBuild.enforceProdLotsOnly"
          tooltipTitle="administration.general.settings.lhrBuildTypeConfig.lhrBuild.enforceProdLotsOnly.tooltip"
        />
      ),
      template: AutocompleteCellTemplate,
      width: 200,
    },
    {
      id: 'enforceDeviationApproval',
      field: 'enforceDeviationApproval',
      headerCell: (props) => (
        <HeaderCell
          {...props}
          content="administration.general.settings.lhrBuildTypeConfig.lhrBuild.enforceDeviationApproval"
          tooltipTitle="administration.general.settings.lhrBuildTypeConfig.lhrBuild.enforceDeviationApproval.tooltip"
        />
      ),
      template: AutocompleteCellTemplate,
      width: 200,
    },
    {
      id: 'enforceReworkApproval',
      field: 'enforceReworkApproval',
      headerCell: (props) => (
        <HeaderCell
          {...props}
          content="administration.general.settings.lhrBuildTypeConfig.lhrBuild.enforceReworkApproval"
          tooltipTitle="administration.general.settings.lhrBuildTypeConfig.lhrBuild.enforceReworkApproval.tooltip"
        />
      ),
      template: AutocompleteCellTemplate,
      width: 200,
    },
    {
      id: 'actions',
      field: 'actions',
      title: 'common.actions',
      width: 75,
      template: (props) => (
        <ActionsCellTemplate
          {...props}
          isActive={isActive}
          onEdit={onEdit}
          onDiscard={onDiscard}
          onConfirm={onConfirm}
        />
      ),
    },
  ];
};
