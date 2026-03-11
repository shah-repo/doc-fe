import React from 'react';
import ActionsCellTemplate from '../../components/SettingsTable/components/ActionsCellTemplate';
import ActiveCellTemplate from '../../components/SettingsTable/components/ActiveCellTemplate';
import { AutocompleteCellTemplate } from '../../components/SettingsTable/components/AutocompleteCellTemplate';
import TextCellTemplate from '../../components/SettingsTable/components/TextCellTemplate';
import { SchemaBuilder } from '../../components/SettingsTable/types';
import { HeaderCell } from './components/HeaderCell';
// import { useStyles } from './styles';
import { EditableLHRBuild } from './types';

export const buildSchema: SchemaBuilder<EditableLHRBuild> = ({
  isActive,
  onEdit,
  onActiveStateChange,
  onDiscard,
  onConfirm,
}) => {
  // const classes = useStyles();
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
      id: 'allowCalOrPm',
      field: 'allowCalOrPm',
      headerCell: (props) => (
        <HeaderCell
          {...props}
          content="administration.general.settings.lhrBuildTypeConfig.lhrBuild.allowCalOrPm"
          tooltipTitle="administration.general.settings.lhrBuildTypeConfig.lhrBuild.allowCalOrPm.tooltip"
        />
      ),
      template: AutocompleteCellTemplate,
      width: 200,
    },
    {
      id: 'allowOverdueQuantityMismatch',
      field: 'allowOverdueQuantityMismatch',
      headerCell: (props) => (
        <HeaderCell
          {...props}
          content="administration.general.settings.lhrBuildTypeConfig.lhrBuild.allowOverdueQuantityMismatch"
          tooltipTitle="administration.general.settings.lhrBuildTypeConfig.lhrBuild.allowOverdueQuantityMismatch.tooltip"
        />
      ),
      template: AutocompleteCellTemplate,
      width: 200,
    },
    {
      id: 'allowQuantityDiscrepancy',
      field: 'allowQuantityDiscrepancy',
      headerCell: (props) => (
        <HeaderCell
          {...props}
          content="administration.general.settings.lhrBuildTypeConfig.lhrBuild.allowQuantityDiscrepancy"
          tooltipTitle="administration.general.settings.lhrBuildTypeConfig.lhrBuild.allowQuantityDiscrepancy.tooltip"
        />
      ),
      template: AutocompleteCellTemplate,
      width: 200,
    },
    {
      id: 'requireLotSelection',
      field: 'requireLotSelection',
      headerCell: (props) => (
        <HeaderCell
          {...props}
          content="administration.general.settings.lhrBuildTypeConfig.lhrBuild.requireLotSelection"
          tooltipTitle="administration.general.settings.lhrBuildTypeConfig.lhrBuild.requireLotSelection.tooltip"
        />
      ),
      template: AutocompleteCellTemplate,
      width: 200,
    },
    {
      id: 'allowExpiredLot',
      field: 'allowExpiredLot',
      headerCell: (props) => (
        <HeaderCell
          {...props}
          content="administration.general.settings.lhrBuildTypeConfig.lhrBuild.allowExpiredLot"
          tooltipTitle="administration.general.settings.lhrBuildTypeConfig.lhrBuild.allowExpiredLot.tooltip"
        />
      ),
      template: AutocompleteCellTemplate,
      width: 200,
    },
    {
      id: 'requireEquipmentSelection',
      field: 'requireEquipmentSelection',
      headerCell: (props) => (
        <HeaderCell
          {...props}
          content="administration.general.settings.lhrBuildTypeConfig.lhrBuild.requireEquipmentSelection"
          tooltipTitle="administration.general.settings.lhrBuildTypeConfig.lhrBuild.requireEquipmentSelection.tooltip"
        />
      ),
      template: AutocompleteCellTemplate,
      width: 200,
    },
    {
      id: 'requireDeviationApproval',
      field: 'requireDeviationApproval',
      headerCell: (props) => (
        <HeaderCell
          {...props}
          content="administration.general.settings.lhrBuildTypeConfig.lhrBuild.requireDeviationApproval"
          tooltipTitle="administration.general.settings.lhrBuildTypeConfig.lhrBuild.requireDeviationApproval.tooltip"
        />
      ),
      template: AutocompleteCellTemplate,
      width: 200,
    },
    {
      id: 'requireReworkApproval',
      field: 'requireReworkApproval',
      headerCell: (props) => (
        <HeaderCell
          {...props}
          content="administration.general.settings.lhrBuildTypeConfig.lhrBuild.requireReworkApproval"
          tooltipTitle="administration.general.settings.lhrBuildTypeConfig.lhrBuild.requireReworkApproval.tooltip"
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
