import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../../../common/intl';
import { companyActions, companySelectors } from '../../../../../state/ducks/company';
import { ApprovalRoles, GeneralSettings } from '../../../../../state/ducks/company/types';
import { Checkbox } from '../../../../components/forms/fields-next';
import KendoDataGrid from '../../../../components/KendoDataGrid/KendoDataGrid';
import { CellTemplateProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { TextCellTemplate } from '../../../../components/LocationsSetting/components/TextCellTemplate';
import useStyles from '../../../../components/LocationsSetting/styles';
import { toastError } from '../../../../components/notifications';
import { CompanyLocation } from '../../../../form.builder/FBLotTransfers/types';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import SettingsPanel from '../../components/SettingsPanel';

interface SchemaOptions {
  onChange: () => void
}

type schemaBuilder = (options: SchemaOptions) => Array<ColumnDefinition<CompanyLocation>>;

const ActiveCellTemplate: React.FC<CellTemplateProps> = ({ dataItem, onChange }) => {
  return (
    <Checkbox
      checked={dataItem.active}
      onChange={() => onChange?.({ dataItem })}
    />
  );
};

export const buildSchema: schemaBuilder = ({ onChange }) => {
  return [
    {
      id: 'active',
      field: 'active',
      title: 'common.active',
      width: 80,
      template: (props) => <ActiveCellTemplate {...props} onChange={onChange} />,
    },
    {
      id: 'name',
      field: 'name',
      title: 'common.name',
      template: TextCellTemplate,
    },
  ];
};

const ApprovalRolesSettingsPanel: React.FC<> = (props) => {
  const { getFieldProps, values: formValues } = useFormikContext<GeneralSettings>();
  const classes = useStyles();
  const approvalRoles = getFieldProps('approvalRoles').value as ApprovalRoles[];
  const settingsId = useSelector(companySelectors.getGeneralSettingsId);
  const [approvalRolesData, setApprovalRolesData] = React.useState(approvalRoles);

  const onChange = ({ dataItem }) => {
    const updatedApprovalRoles = approvalRolesData.map(item => item.id === dataItem.id ? { ...dataItem, active: !dataItem.active } : item);
    formValues.approvalRoles = updatedApprovalRoles;
    setApprovalRolesData(updatedApprovalRoles);
    async.start(updateEquipmentLocationAction, formValues, settingsId, 'PUT', async);
  };

  useEffect(() => {
    setApprovalRolesData(approvalRoles);
  }, [approvalRoles]);

  const async = useAsync({
    onError: (error) => {
      setApprovalRolesData(approvalRoles);
      toastError(error);
    },
  });
  const updateEquipmentLocationAction = useActionCreator(companyActions.updateGeneralSettings);

  const schema = buildSchema({ onChange: onChange });

  return (
    <SettingsPanel {...props} title={translate('administration.general.settings.approvalRoles.tab')}>
      <Box className={classes.root}>
        <KendoDataGrid
          data={approvalRolesData ?? []}
          schema={schema}
        />
      </Box>
    </SettingsPanel>
  );
};

export default ApprovalRolesSettingsPanel;
