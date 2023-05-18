import { Box, Chip } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/ClearRounded';
import DoneIcon from '@material-ui/icons/DoneRounded';
import cx from 'classnames';
import { kebabCase } from 'lodash';
import React from 'react';
import { FBApprovalMatrixRolesProps, FBApprovalRole, FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBDialog, FBMapWrapper, FBProvider, FBTextField } from '..';
import { translate } from '../../../common/intl';
import { Autocomplete, Button, TextField } from '../../components/forms/fields-next';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { ColumnDefinition, DataGridRowClickEvent } from '../../components/KendoDataGrid/KendoDataGrid.types';
import Text from '../../components/Text';
import { StyleTooltip } from '../../dashboard.new/line.items/common/StyleTooltip';
import useStyles from '../FBApprovalMatrix/components/Grid/styles';
import { GridProps } from '../FBApprovalMatrix/components/Grid/types';
import { withFBApprovalMatrixRoles } from './FBApprovalMatrixRoles.wrap';

export const MODE_FIELD = '_mode';

export enum Mode {
  show = 'show',
  add = 'add',
  edit = 'edit',
}

type EditableRole = FBApprovalRole & { [MODE_FIELD]: Mode };

const schema: Array<ColumnDefinition<EditableRole>> = [
  {
    id: 'name',
    title: 'form.builder.approval.role',
    width: 150,
    template: ({ dataItem }) => {
      if (dataItem[MODE_FIELD] === Mode.edit) {
        return (
          <TextField
            value={dataItem.name}
          />
        );
      }
      return dataItem.name;
    },
  },
  {
    id: 'groups',
    title: 'form.builder.approving.groups',
    template: ({ dataItem }) => {
      if (dataItem[MODE_FIELD] === Mode.edit) {
        return (
          <Autocomplete
            value={dataItem.groups}
            // TODO pass actual groups here
            options={dataItem.groups}
            getOptionLabel={(option) => option.id}
            multiple
          />
        );
      }
      return dataItem.groups.map((group) => <Chip size="small" label={group.id} />);
    },
  },
];

const FBApprovalMatrixRoles: React.FunctionComponent<FBApprovalMatrixRolesProps> = ({
  onClick,
  dialogState,
  approvalRoles = [],
  disabled,
  name,
}) => {
  const [editedItem, setEditedItem] = React.useState<FBApprovalRole | null>(null);
  const classes = useStyles();

  const editItem = ({ dataItem }: DataGridRowClickEvent<FBApprovalRole>) => setEditedItem(dataItem);

  const handleItemDiscard: React.MouseEventHandler = () => {
    console.log('handleItemDiscard');
  };

  const handleItemSave: React.MouseEventHandler = () => {
    console.log('handleItemSave');
  };

  const rowRender: GridProps<T>['rowRender'] = (row, props) => {
    const { dataItem } = props;

    const isUpdating = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
    const isActive = Boolean(dataItem?.docType?.active);
    const dataCy = `row-${kebabCase(dataItem?.docType?.name?.toLowerCase())}`;

    if (!isUpdating) {
      return React.cloneElement(
        row,
        {
          ...row.props,
          ['data-cy' as string]: dataCy,
          className: cx(row.props.className, { [classes.inactive]: !isActive }),
        },
      );
    }

    const actions = (
      <td className={classes.actionsTd}>
        <div className={classes.line} />
        <div className={classes.actions}>
          <StyleTooltip
            title={translate('common.discard')}
            placement="top"
            arrow
          >
            <Button
              data-cy="action-discard"
              className={classes.actionButton}
              variant="outlined"
              onClick={handleItemDiscard}
            >
              <ClearIcon className={classes.iconButton} />
            </Button>
          </StyleTooltip>
          <StyleTooltip
            title={translate('common.save')}
            placement="top"
            arrow
          >
            <Button
              data-cy="action-save"
              className={classes.actionButton}
              variant="outlined"
              onClick={handleItemSave}
            >
              <DoneIcon className={classes.iconButton} />
            </Button>
          </StyleTooltip>
        </div>
      </td>
    );

    return React.cloneElement(
      row,
      {
        ...row.props,
        className: cx(row.props.className, classes.updating),
      },
      row.props.children,
      actions,
    );
  };

  const data = approvalRoles.map((role) => ({
    ...role,
    // TODO enhance this logic to get additional fields for groups
    groups: role.groups.map((group) => group),
    [MODE_FIELD]: role.id === editedItem?.id ? Mode.edit : Mode.show,
  }));

  return (
    <FBProvider {...{ dialogState }}>
      <Box mb={5}>
        <Box mb={2}>
          <KendoDataGrid
            schema={schema}
            data={data}
            rowRender={rowRender}
            style={disabled ? undefined : {
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              borderBottom: 'none',
            }}
            onRowClick={!disabled ? editItem : undefined}
          />
          {!disabled && (
            <Button
              kind="add"
              data-cy="form.builder.add.another.role"
              attached
              fullWidth
              onClick={onClick}
            >
              <Text message="form.builder.add.another.role" />
            </Button>
          )}
        </Box>
        <FBDialog />
        {approvalRoles && (
          <FBMapWrapper<FBApprovalRole[]> collection={approvalRoles}>
            {(role: FBApprovalRole, index) => (
              <React.Fragment key={`fb-approval-matrix-role-${role.id}`}>
                <FBTextField
                  label="form.builder.approval.role"
                  name={`${name}.${index}.name`}
                  disabled={true}
                />
                <FBAutocompleteAsync
                  label="form.builder.approving.users"
                  name={`${name}.${index}.employees`}
                  placeholder="form.builder.approving.roles.placeholder"
                  optionId={FBAutocompleteAsyncOption.employees}
                  optionValueType="id"
                  forceDefault={true}
                  multiple={true}
                  defaultValue={[]}
                  autosave={true}
                  {...{ disabled }}
                />
                <FBAutocompleteAsync
                  label="form.builder.approving.groups"
                  name={`${name}.${index}.groups`}
                  placeholder="form.builder.approving.roles.placeholder"
                  optionId={FBAutocompleteAsyncOption.officialGroups}
                  optionValueType="id"
                  forceDefault={true}
                  multiple={true}
                  defaultValue={[]}
                  autosave={true}
                  {...{ disabled }}
                />
              </React.Fragment>
            )}
          </FBMapWrapper>
        )}
        <FBButton
          fullWidth={true}
          label="form.builder.add.another.role"
          dataCy="form.builder.add.another.role"
          variant="outlined"
          style={{ margin: 0 }}
          {...{ disabled, onClick }}
        />
      </Box>
    </FBProvider>
  );
};

export default withFBApprovalMatrixRoles(FBApprovalMatrixRoles);
