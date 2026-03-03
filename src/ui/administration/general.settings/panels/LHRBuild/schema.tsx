import React from 'react';
import { translate } from '../../../../../common/intl';
import ActionsCellTemplate from '../../components/SettingsTable/components/ActionsCellTemplate';
import ActiveCellTemplate from '../../components/SettingsTable/components/ActiveCellTemplate';
import { AutocompleteCellTemplate } from '../../components/SettingsTable/components/AutocompleteCellTemplate';
import TextCellTemplate from '../../components/SettingsTable/components/TextCellTemplate';
import { SchemaBuilder } from '../../components/SettingsTable/types';
import { EditableLHRBuild } from './types';
import { useStyles } from './styles';

export const buildSchema: SchemaBuilder<EditableLHRBuild> = ({
  isActive,
  onEdit,
  onActiveStateChange,
  onDiscard,
  onConfirm,
}) => {
  const classes = useStyles();
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
      headerCell: () => (
        <span className={classes.header}>
          {translate('administration.general.settings.lhrBuildTypeConfig.lhrBuild.allowCalOrPm')}
        </span>),
      template: AutocompleteCellTemplate,
      width: 200,
    },
    {
      id: 'allowOverdueQuantityMismatch',
      field: 'allowOverdueQuantityMismatch',
      headerCell: () => (
        <span className={classes.header}>
          {translate('administration.general.settings.lhrBuildTypeConfig.lhrBuild.allowOverdueQuantityMismatch')}
        </span>),
      template: AutocompleteCellTemplate,
      width: 200,
    },
    {
      id: 'allowQuantityDiscrepancy',
      field: 'allowQuantityDiscrepancy',
      headerCell: () => (
        <span className={classes.header}>
          {translate('administration.general.settings.lhrBuildTypeConfig.lhrBuild.allowQuantityDiscrepancy')}
        </span>),
      template: AutocompleteCellTemplate,
      width: 200,
    },
    {
      id: 'requireLotSelection',
      field: 'requireLotSelection',
      headerCell: () => (
        <span className={classes.header}>
          {translate('administration.general.settings.lhrBuildTypeConfig.lhrBuild.requireLotSelection')}
        </span>),
      template: AutocompleteCellTemplate,
      width: 200,
    },
    {
      id: 'allowExpiredLot',
      field: 'allowExpiredLot',
      headerCell: () => (
        <span className={classes.header}>
          {translate('administration.general.settings.lhrBuildTypeConfig.lhrBuild.allowExpiredLot')}
        </span>),
      template: AutocompleteCellTemplate,
      width: 200,
    },
    {
      id: 'requireEquipmentSelection',
      field: 'requireEquipmentSelection',
      headerCell: () => (
        <span className={classes.header}>
          {translate('administration.general.settings.lhrBuildTypeConfig.lhrBuild.requireEquipmentSelection')}
        </span>),
      template: AutocompleteCellTemplate,
      width: 200,
    },
    {
      id: 'requireDeviationApproval',
      field: 'requireDeviationApproval',
      headerCell: () => (
        <span className={classes.header}>
          {translate('administration.general.settings.lhrBuildTypeConfig.lhrBuild.requireDeviationApproval')}
        </span>),
      template: AutocompleteCellTemplate,
      width: 200,
    },
    {
      id: 'requireReworkApproval',
      field: 'requireReworkApproval',
      headerCell: () => (
        <span className={classes.header}>
          {translate('administration.general.settings.lhrBuildTypeConfig.lhrBuild.requireReworkApproval')}
        </span>),
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
