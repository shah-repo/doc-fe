import { Box } from '@material-ui/core';
import { FormikProvider, useFormik, useFormikContext } from 'formik';
import { omit } from 'lodash';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../../../common/intl';
import { companyActions, companySelectors } from '../../../../../state/ducks/company';
import { ApprovalRole, Dam, GeneralSettings } from '../../../../../state/ducks/company/types';
import TextCellTemplate from '../../../../administration/general.settings/components/SettingsTable/components/TextCellTemplate';
import { Checkbox } from '../../../../components/forms/fields-next';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { toastError } from '../../../../components/notifications';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import SettingsPanel from '../../components/SettingsPanel';
import SettingsTable from '../../components/SettingsTable';
import ActionsCellTemplate from '../../components/SettingsTable/components/ActionsCellTemplate';
import SyncMessageDialog from './SyncMessageDialog';
import { EditableApprovalRoles, SchemaBuilder } from './types';

const ActiveCellTemplate: React.FC<CellTemplateProps<EditableApprovalRoles>> = ({ dataItem, dataIndex, onChange }) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  return (
    <Box display="flex" justifyContent="center" marginTop={ isEditMode ? '4px' : '' }>
      <Checkbox
        checked={dataItem.isActive}
        onChange={(event) => onChange?.({ dataItem, dataIndex, syntheticEvent: event })}
      />
    </Box>
  );
};

const buildSchema: SchemaBuilder = ({ onChange, onConfirm, onDiscard, editedApprovalRoles }) => {
  return [
    {
      id: 'active',
      field: 'isActive',
      title: 'common.active',
      width: 80,
      template: (props) => (
        <ActiveCellTemplate
          {...props}
          onChange={onChange}
        />
      ),
    },
    {
      id: 'name',
      field: 'name',
      title: 'common.name',
      template: TextCellTemplate,
    },
    {
      id: 'actions',
      template: (props) => (
        <ActionsCellTemplate
          {...props}
          onConfirm={onConfirm}
          onDiscard={onDiscard}
          hideEditButton
        />
      ),
      width: editedApprovalRoles?.[MODE_FIELD] === Mode.add ? 75 : 0,
    },
  ];
};

const ApprovalRolesSettingsPanel: React.FC<> = (props) => {
  const { getFieldProps, values: formValues } = useFormikContext<GeneralSettings>();
  const approvalRoles = getFieldProps('approvalRoles.approvalRoles').value as ApprovalRole[];
  const dam = getFieldProps('approvalRoles.dam').value as Dam;
  const settingsId = useSelector(companySelectors.getGeneralSettingsId);
  const [approvalRolesData, setApprovalRolesData] = React.useState(approvalRoles);
  const [editedApprovalRoles, setEditedApprovalRoles] = React.useState<EditableApprovalRoles>();
  const [isOpen, setIsOpen] = React.useState(false);

  const discardApprovalRoles = () => setEditedApprovalRoles(undefined);
  const onChange = ({ dataItem }) => {
    if (dataItem[MODE_FIELD] === Mode.add) {
      return setEditedApprovalRoles(prevValue => ({ ...prevValue, isActive: !editedApprovalRoles?.active, name: values.name }));
    }
    if(!dam?.isSynced) {
      setIsOpen(true);
    }
    const updatedApprovalRoles = approvalRolesData?.map(item => item.id === dataItem.id ? { ...dataItem, isActive: !dataItem.isActive } : item);
    formValues.approvalRoles.approvalRoles = updatedApprovalRoles;
    setApprovalRolesData(updatedApprovalRoles);
    async.start(updateApprovalRolesAction, { isActive: !dataItem.isActive, formValues: formValues }, dataItem.id, 'PATCH', async);
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
      formValues.approvalRoles.approvalRoles = updatedApprovalRoles;
      setApprovalRolesData(updatedApprovalRoles);
      async.start(createApprovalRolesAction, { values, formValues }, settingsId, 'POST', async);
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
      isActive: true,
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
  const updateApprovalRolesAction = useActionCreator(companyActions.updateApprovalRoles);
  const createApprovalRolesAction = useActionCreator(companyActions.createApprovalRoles);

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
  const schema = buildSchema({ onChange, onDiscard, editedApprovalRoles, onConfirm: submitForm });

  return (
    <>
    <SettingsPanel {...props} title={translate('administration.general.settings.approvalRoles.tab')} isOutOfSync={!dam?.isSynced}>
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
    {isOpen && (
    <SyncMessageDialog
      { ...{ isOpen, dam } }
      closeDialog={() => setIsOpen(false)}
    />
    )}
    </>
  );
};

export default ApprovalRolesSettingsPanel;
