import { FormikProvider, useFormik, useFormikContext } from 'formik';
import { omit } from 'lodash';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../../../common/intl';
import { companyActions, companySelectors } from '../../../../../state/ducks/company';
import { ApprovalRoles, GeneralSettings } from '../../../../../state/ducks/company/types';
import TextCellTemplate from '../../../../administration/general.settings/components/SettingsTable/components/TextCellTemplate';
// import useStyles from '../../../../administration/general.settings/components/SettingsTable/styles';
import { Checkbox } from '../../../../components/forms/fields-next';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import { CellTemplateProps, ColumnDefinition } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { toastError } from '../../../../components/notifications';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import SettingsPanel from '../../components/SettingsPanel';
import SettingsTable from '../../components/SettingsTable';
import ActionsCellTemplate from '../../components/SettingsTable/components/ActionsCellTemplate';
import { EditableApprovalRoles } from './types';

interface SchemaOptions {
  onChange: () => void
  onConfirm: () => void
  onDiscard: () => void
}

type schemaBuilder = (options: SchemaOptions) => Array<ColumnDefinition<ApprovalRoles>>;

const ActiveCellTemplate: React.FC<CellTemplateProps> = ({ dataItem, onChange }) => {
  return (
    <Checkbox
      checked={dataItem.active}
      onChange={() => onChange?.({ dataItem })}
    />
  );
};

const buildSchema: schemaBuilder = ({ onChange, onConfirm, onDiscard }) => {
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
    {
      id: 'actions',
      title: 'actions',
      template: (props) => (
        <ActionsCellTemplate
          {...props}
          onConfirm={onConfirm}
          onDiscard={onDiscard}
        />
      ),
      width: 75,
    },
  ];
};

const ApprovalRolesSettingsPanel: React.FC<> = (props) => {
  const { getFieldProps, values: formValues } = useFormikContext<GeneralSettings>();
  const approvalRoles = getFieldProps('approvalRoles').value as ApprovalRoles[];
  const settingsId = useSelector(companySelectors.getGeneralSettingsId);
  const [approvalRolesData, setApprovalRolesData] = React.useState(approvalRoles);
  const [editedApprovalRoles, setEditedApprovalRoles] = React.useState<EditableApprovalRoles>();

  const discardApprovalRoles = () => setEditedApprovalRoles(undefined);
  const onChange = ({ dataItem }) => {
    console.log('--dataItem---', { dataItem, values });
    if(dataItem[MODE_FIELD] === Mode.add) {
      return setEditedApprovalRoles(prevValue => ({ ...prevValue, active: !editedApprovalRoles?.active, name: values.name }));
    }
    const updatedApprovalRoles = approvalRolesData?.map(item => item.id === dataItem.id ? { ...dataItem, active: !dataItem.active } : item);
    formValues.approvalRoles = updatedApprovalRoles;
    setApprovalRolesData(updatedApprovalRoles);
    async.start(updateApprovalRolesAction, formValues, settingsId, 'PUT', async);
  };

  const formik = useFormik<EditableApprovalRoles | Record<string, never>>({
    initialValues: {},
    validate: (values) => {
      const error: Record<string, string> = {};
      const isDuplicate = approvalRoles?.some(({ name, id }) => name.toLowerCase() === values.name.toLowerCase() && id !== values.id);
      if (values.name && isDuplicate) {
        error.name = 'validator.approval.role.same.name.exist';
      }
      return error;
    },
    onSubmit: (values) => {
      const isAdding = values[MODE_FIELD] === Mode.add;
      const newApprovalRoles = approvalRoles ?? [];
      const updatedApprovalRoles = isAdding
        ? [...newApprovalRoles, omit(values, MODE_FIELD)]
        : newApprovalRoles?.map(item => item.id === values.id ? { ...item, ...omit(values, MODE_FIELD) } : item);
        discardApprovalRoles();
        formValues.approvalRoles = updatedApprovalRoles;
        setApprovalRolesData(updatedApprovalRoles);
        async.start(updateApprovalRolesAction, formValues, settingsId, 'PUT', async);
    },
  });

  const { setValues, submitForm, values } = formik;

  useEffect(() => {
    setValues(editedApprovalRoles ?? {});
  }, [editedApprovalRoles, setValues]);

  const onDiscard = () => {
    discardApprovalRoles();
  };

  const addApprovalRole = () => {
    setEditedApprovalRoles({
      id: uuidv4(),
      name: '',
      active: true,
      [MODE_FIELD]: Mode.add,
    });
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
  const updateApprovalRolesAction = useActionCreator(companyActions.updateGeneralSettings);

  const mappedApprovalRoles = approvalRolesData?.map((approvalRoles) => {
    return {
      ...approvalRoles,
      [MODE_FIELD]: approvalRoles.id === editedApprovalRoles?.id ? Mode.edit : Mode.show,
    };
  }) ?? [];

  const approvalRoleList
  = editedApprovalRoles?.[MODE_FIELD] === Mode.add
    ? [...mappedApprovalRoles, editedApprovalRoles]
    : mappedApprovalRoles;
  const schema = buildSchema({ onChange: onChange, onConfirm: submitForm, onDiscard: onDiscard });

  return (
    <SettingsPanel {...props} title={translate('administration.general.settings.approvalRoles.tab')}>
      <FormikProvider value={formik}>
      <SettingsTable
          isActive
          data={approvalRoleList}
          isEditing={editedApprovalRoles !== undefined}
          schema={schema}
          addButtonLabel={translate('administration.general.settings.approvalRoles.add')}
          onAdd={addApprovalRole}
        />
      </FormikProvider>
    </SettingsPanel>
  );
};

export default ApprovalRolesSettingsPanel;
