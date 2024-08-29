import { Box } from '@material-ui/core';
import cx from 'classnames';
import { kebabCase, omit } from 'lodash';
import React from 'react';
import { translate } from '../../../common/intl';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { DataGridItemChangeEvent, DataGridProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { toastError } from '../../components/notifications';
import { APPROVAL_MATRIX_ROLE_TABLE_NAME, ERROR_FIELD, ErrorField, Mode, MODE_FIELD, SEARCHABLE_GROUPS_FIELD } from './constants';
import createSchema from './schema';
import useStyles from './styles';
import { EditableRole, FBApprovalMatrixRolesProps, RoleEditEvent } from './types';
import useTableCriteria from './utils';
import { withFBApprovalMatrixRoles } from './wrap';

const FBApprovalMatrixRoles: React.FC<FBApprovalMatrixRolesProps> = ({
  approvalRoles = [],
  groups,
  disabled,
  updateRole,
}) => {
  const classes = useStyles();
  const [editedRole, setEditedRole] = React.useState<EditableRole>();

  const editRole = ({ dataItem }: RoleEditEvent) => setEditedRole(dataItem);

  const discardRole = () => setEditedRole(undefined);

  const setFieldError = (field: ErrorField) => setEditedRole(prev => {
    if (!prev) {
      return prev;
    }
    return {
      ...prev,
      [ERROR_FIELD]: field,
    };
  });

  const isRoleValid = (role: EditableRole) => {
    if (role.name === '') {
      toastError(translate('form.builder.approvalRoles.error.empty'));
      setFieldError(ErrorField.name);
      return false;
    }

    return true;
  };

  const saveRole = () => {
    if (!editedRole || !isRoleValid(editedRole)) {
      return;
    }
    const roleToSave = omit(editedRole, MODE_FIELD, SEARCHABLE_GROUPS_FIELD);

    updateRole(roleToSave);

    discardRole();
  };

  const updateEditedRole = (event: DataGridItemChangeEvent<EditableRole>) => {
    if (!editedRole || !event.field) {
      return;
    }
    setEditedRole({
      ...omit(editedRole, ERROR_FIELD),
      [event.field]: event.value as unknown,
    });
  };

  const isActive = !disabled;

  const roles = approvalRoles.map((role) => {
    const isRoleEdited = editedRole && editedRole.id === role.id;
    return {
      ...(isRoleEdited ? editedRole : role),
      [MODE_FIELD]: isRoleEdited ? Mode.edit : Mode.show,
      [SEARCHABLE_GROUPS_FIELD]: role.groups.map(({ name }) => name).join(' '),
    };
  });

  const { dataState, dataStateChange } = useTableCriteria(APPROVAL_MATRIX_ROLE_TABLE_NAME);

  const schema = createSchema({
    groups,
    actionsClass: classes.actionsCell,
    saveRole,
    discardRole,
    onRowClick: isActive ? editRole : undefined,
  });

  const rowRender: DataGridProps<EditableRole>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableRole;
    const isUpdating = item[MODE_FIELD] === Mode.edit;
    const dataCy = `row-${kebabCase(item.name)}`;

    return React.cloneElement(
      row,
      {
        ['data-cy' as string]: dataCy,
        className: cx(row.props.className, { [classes.updatingRow]: isUpdating }),
      },
    );
  };

  return (
    <Box className={classes.root}>
      <KendoDataGrid<EditableRole>
        schema={schema}
        data={roles}
        {...dataState}
        onDataStateChange={dataStateChange}
        rowRender={rowRender}
        onItemChange={updateEditedRole}
        className={classes.grid}
        onRowClick={isActive ? editRole : undefined}
        filterable
      />
    </Box>
  );
};

export default withFBApprovalMatrixRoles(FBApprovalMatrixRoles);
