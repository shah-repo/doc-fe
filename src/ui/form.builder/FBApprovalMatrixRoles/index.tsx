import { Box } from '@material-ui/core';
import cx from 'classnames';
import { kebabCase, omit } from 'lodash';
import React from 'react';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { DataGridItemChangeEvent, DataGridProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import Text from '../../components/Text';
import { Button } from '../../components/forms/fields-next';
import { MODE_FIELD, Mode, SEARCHABLE_GROUPS_FIELD } from './constants';
import createSchema from './schema';
import useStyles from './styles';
import { EditableRole, FBApprovalMatrixRolesProps, RoleEditEvent } from './types';
import { withFBApprovalMatrixRoles } from './wrap';

const FBApprovalMatrixRoles: React.FC<FBApprovalMatrixRolesProps> = ({
  approvalRoles = [],
  groups,
  disabled,
  addRole,
  updateRole,
}) => {
  const classes = useStyles();
  const [editedRole, setEditedRole] = React.useState<EditableRole>();

  const addNewRole = () => setEditedRole({
    id: '',
    name: '',
    index: approvalRoles.length + 1,
    groups: [],
    employees: [],
    [MODE_FIELD]: Mode.add,
    [SEARCHABLE_GROUPS_FIELD]: '',
  });

  const editRole = ({ dataItem }: RoleEditEvent) => setEditedRole(dataItem);

  const discardRole = () => setEditedRole(undefined);

  const saveRole = () => {
    if (!editedRole) {
      return;
    }
    const roleToSave = omit(editedRole, MODE_FIELD, SEARCHABLE_GROUPS_FIELD);
    isNewRoleAdded ? addRole(roleToSave) : updateRole(roleToSave);

    discardRole();
  };

  const updateEditedRole = (event: DataGridItemChangeEvent<EditableRole>) => {
    if (!editedRole || !event.field) {
      return;
    }
    setEditedRole({
      ...editedRole,
      [event.field]: event.value as unknown,
    });
  };

  const isActive = !disabled;
  const isNewRoleAdded = editedRole?.[MODE_FIELD] === Mode.add;

  const existingRoles = approvalRoles.map((role) => {
    const isRoleEdited = editedRole && editedRole.id === role.id;
    return {
      ...(isRoleEdited ? editedRole : role),
      [MODE_FIELD]: isRoleEdited ? Mode.edit : Mode.show,
      [SEARCHABLE_GROUPS_FIELD]: role.groups.map(({ name }) => name).join(' '),
    };
  });
  const roles = isNewRoleAdded ? [...existingRoles, editedRole] : existingRoles;

  const schema = createSchema({
    groups,
    actionsClass: classes.actionsCell,
    saveRole,
    discardRole,
    onRowClick: isActive ? editRole : undefined,
  });

  const rowRender: DataGridProps<EditableRole>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableRole;
    const isUpdating = [Mode.add, Mode.edit].includes(item[MODE_FIELD]);
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
        rowRender={rowRender}
        onItemChange={updateEditedRole}
        className={cx(classes.grid, { [classes.gridWithButton]: isActive })}
        onRowClick={isActive ? editRole : undefined}
        filterable
      />
      {isActive && (
        <Button
          attached
          fullWidth
          kind="add"
          data-cy="form-builder-add-another-role"
          disabled={editedRole !== undefined}
          onClick={addNewRole}
        >
          <Text message="form.builder.add.another.role" />
        </Button>
      )}
    </Box>
  );
};

export default withFBApprovalMatrixRoles(FBApprovalMatrixRoles);
