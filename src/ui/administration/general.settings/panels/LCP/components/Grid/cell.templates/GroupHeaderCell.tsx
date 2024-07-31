import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Tooltip } from '@material-ui/core';
import { GridRowProps } from '@progress/kendo-react-grid';
import cx from 'classnames';
import { every, kebabCase } from 'lodash';
import * as React from 'react';
import { translate } from '../../../../../../../../common/intl';
import { Autocomplete, Checkbox, IconButton } from '../../../../../../../components/forms/fields-next';
import { EXPAND_FIELD } from '../constants';
import { CustomGroupDataItem, CustomGroupOptions } from '../types';
import useStyles from './styles';

interface GroupHeaderCellProps extends GridRowProps {
  onExpandChange: (groupDataItem: CustomGroupDataItem) => void
  onEditGroup: (groupDataItem: CustomGroupDataItem) => void
  onDiscardGroup: (groupDataItem: CustomGroupDataItem) => void
  onUpdateAddOrEditGroup: (groupDataItem: CustomGroupDataItem) => void
  onToggleGroupActivation: (groupDataItem: CustomGroupDataItem) => void
  onGroupChange: (value: CustomGroupOptions[], groupId: string) => void
  partGroups: CustomGroupOptions[]
  hasEditLCPPermission?: boolean
  editGroup?: string
}

export const GroupHeaderCell: React.FC<GroupHeaderCellProps> = (props) => {
  const {
    dataItem,
    onExpandChange,
    onEditGroup,
    editGroup,
    onDiscardGroup,
    onUpdateAddOrEditGroup,
    onGroupChange,
    onToggleGroupActivation,
    hasEditLCPPermission,
    partGroups,
  } = props;
  const groupLabel = dataItem.value;
  const classes = useStyles();
  const groupId = dataItem.groupId;
  const isEditMode = editGroup === groupId;
  const isEditModeAndHasEditLCPPermission = isEditMode && hasEditLCPPermission;
  const isReadModeAndHasEditLCPPermission = !isEditMode && hasEditLCPPermission;

  const handleGroupChange = (e, value: CustomGroupOptions[]) => {
    onGroupChange(value, groupId);
  };

  const checkAllIsActiveTrue = (array) => {
    return every(array, item => item.isActive === true);
  };

  const documentTypeIdArr = dataItem.items?.[0].documentTypeIdArr;
  const isLCPActive = checkAllIsActiveTrue(dataItem.items);
  const defaultValue = partGroups.filter((groups: CustomGroupOptions) => documentTypeIdArr?.includes(groups.value));
  const displayValue = defaultValue.map(data => data.label).join(', ');

  const handleChange = (event, checked: boolean) => {
    onToggleGroupActivation({ ...dataItem, isLCPActive: checked });
  };

  return (
    <Grid container justify="space-between" alignItems="center">
      <Grid item alignItems="center" className={classes.container}>
        <Grid
          container
          justify="flex-start"
          alignItems="center"
          className={classes.editContainer}
        >
          <Grid item>
            <FontAwesomeIcon
              data-cy={`${groupLabel}-toggle-group`}
              size="sm"
              className={classes.toggleExpandCollapse}
              onClick={() => onExpandChange(dataItem)}
              icon={
                dataItem[EXPAND_FIELD]
                  ? regular('square-minus')
                  : solid('square-plus')
              }
            />
            <Checkbox
              checked={isLCPActive}
              className={classes.groupCheckBox}
              onChange={handleChange}
            />
            {!isEditMode && displayValue}
          </Grid>
          {isEditModeAndHasEditLCPPermission && (
            <Grid item xs={11} className={classes.autocomplete}>
              <Autocomplete
                options={partGroups}
                defaultValue= {defaultValue}
                getOptionLabel={(option: CustomGroupOptions) => option.label}
                getOptionSelected={(option, value) =>
                    option?.value === value?.value
                }
                data-cy={`${kebabCase(groupId)}-field`}
                onChange={handleGroupChange}
                multiple
              />
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid item>
        {isEditModeAndHasEditLCPPermission && (
          <Tooltip title={translate('common.discard')} placement="top" arrow>
            <IconButton
              color="primary"
              kind="white"
              onClick={() => onDiscardGroup(dataItem)}
              className={cx(classes.editButtons, classes.buttons)}
            >
              <FontAwesomeIcon
                icon={regular('square-xmark')}
                className={classes.editButtons}
              />
            </IconButton>
          </Tooltip>
        )}
        {isEditModeAndHasEditLCPPermission && (
          <Tooltip title={translate('common.save')} placement="top" arrow>
            <IconButton
              color="primary"
              kind="white"
              className={classes.editButtons}
              onClick={() => onUpdateAddOrEditGroup(dataItem)}
            >
              <FontAwesomeIcon
                icon={solid('square-check')}
                className={classes.editButtons}
              />
            </IconButton>
          </Tooltip>
        )}
        {isReadModeAndHasEditLCPPermission && (
          <Tooltip title={translate('common.edit')} placement="top" arrow>
            <IconButton
              kind="simple"
              color="primary"
              className={classes.buttons}
              onClick={() => onEditGroup(dataItem)}
            >
              <FontAwesomeIcon icon={regular('pen-to-square')} />
            </IconButton>
          </Tooltip>
        )}
      </Grid>
    </Grid>
  );
};
