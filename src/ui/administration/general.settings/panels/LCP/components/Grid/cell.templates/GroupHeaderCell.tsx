import { light, regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Tooltip } from '@material-ui/core';
import { GridRowProps } from '@progress/kendo-react-grid';
import { kebabCase } from 'lodash';
import * as React from 'react';
import { translate } from '../../../../../../../../common/intl';
import { Autocomplete, Checkbox, IconButton } from '../../../../../../../components/forms/fields-next';
import useHover from '../../../../../../../hooks/useHover';
import { EXPAND_FIELD } from '../constants';
import { CustomGroupDataItem, CustomGroupOptions } from '../types';
import useStyles from './styles';

type CustomGroupDataItemHandler = (groupDataItem: CustomGroupDataItem) => void;

interface GroupHeaderCellProps extends GridRowProps {
  onExpandChange: CustomGroupDataItemHandler
  onEditGroup: CustomGroupDataItemHandler
  onDiscardGroup: CustomGroupDataItemHandler
  onUpdateAddOrEditGroup: CustomGroupDataItemHandler
  onToggleGroupActivation: CustomGroupDataItemHandler
  onGroupChange: (value: CustomGroupOptions, groupId: string) => void
  partGroups: CustomGroupOptions[]
  selectedPartGroups: CustomGroupOptions[]
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
    selectedPartGroups,
  } = props;
  const groupLabel = dataItem.value;
  const classes = useStyles();
  const groupId = dataItem.groupId;
  const isEditMode = editGroup === groupId;
  const isEditModeAndHasEditLCPPermission = isEditMode && hasEditLCPPermission;
  const isEditGroup = isEditMode && dataItem.items.length > 1;
  const isReadModeAndHasEditLCPPermission = !isEditMode && hasEditLCPPermission;
  const displayGroupSelection = isEditModeAndHasEditLCPPermission && !isEditGroup;
  const [saveRef, isSaveHovered] = useHover<HTMLButtonElement>();
  const [discardRef, isDiscardHovered] = useHover<HTMLButtonElement>();

  const handleGroupChange = (e, value: CustomGroupOptions) => {
    onGroupChange(value, groupId);
  };

  const documentTypeId = dataItem.items?.[0].documentTypeId;
  const isLCPActive = dataItem.items?.every(item => item.isActive === true);
  const defaultValue = (partGroups?.length ? partGroups : selectedPartGroups)?.filter((groups: CustomGroupOptions) => documentTypeId === groups.value);
  const displayValue = defaultValue?.map(data => data.label).join(', ');
  const selectedIDs = selectedPartGroups?.map((group) => group.value);
  const options = partGroups?.filter((group) => !selectedIDs.includes(group.value));

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
          <Grid item alignItems="center" justify="center">
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
              disabled={hasEditLCPPermission ? displayGroupSelection : !isEditModeAndHasEditLCPPermission}
              className={classes.groupCheckBox}
              onChange={handleChange}
            />
            {!displayGroupSelection && displayValue}
          </Grid>
          {displayGroupSelection && (
            <Grid item xs={11} className={classes.autocomplete}>
              <Autocomplete
                options={options}
                defaultValue= {defaultValue[0]}
                getOptionLabel={(option: CustomGroupOptions) => option.label}
                getOptionSelected={(option, value) =>
                    option?.value === value?.value
                }
                data-cy={`${kebabCase(groupId)}-field`}
                onChange={handleGroupChange}
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
              ref={discardRef}
              onClick={() => onDiscardGroup(dataItem)}
              className={classes.editButtons}
            >
              <FontAwesomeIcon
                icon={isDiscardHovered ? solid('square-xmark') : light('square-xmark')}
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
              ref={saveRef}
              className={classes.editButtons}
              onClick={() => onUpdateAddOrEditGroup(dataItem)}
            >
              <FontAwesomeIcon
                icon={isSaveHovered ? solid('square-check') : light('square-check')}
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
