import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Tooltip } from '@material-ui/core';
import { GridRowProps } from '@progress/kendo-react-grid';
import * as React from 'react';
import { translate } from '../../../../../../../../common/intl';
import { Autocomplete, FormField, IconButton } from '../../../../../../../components/forms/fields-next';
import { OptionType } from '../../../../../../../components/forms/fields/Autocomplete/types';
import { EXPAND_FIELD, PART_GROUPS } from '../constants';
import { CustomGroupDataItem } from '../types';
import useStyles from './styles';

interface GroupHeaderCellProps extends GridRowProps {
  onExpandChange: (groupDataItem: CustomGroupDataItem) => void
  onEditGroup: (groupDataItem: CustomGroupDataItem) => void
  discardGroup: (groupDataItem: CustomGroupDataItem) => void
  editGroup?: string
}

export const GroupHeaderCell: React.FC<GroupHeaderCellProps> = (props) => {
  const classes = useStyles();
  const { dataItem, onExpandChange, onEditGroup, editGroup, discardGroup } = props;
  const groupLabel = dataItem.value;
  const isEditMode = editGroup === dataItem.groupId;

  const handleChange = (data) => {
    console.log('inside editor', data);
  };

  return (
    <Grid container justify= "space-between" alignItems="center">
      <Grid item alignItems="center" className={classes.container} >
        <Grid container justify= "flex-start" alignItems="center" className={classes.editContainer}>
          <Grid item>
            <FontAwesomeIcon
              data-cy={`${groupLabel}-toggle-group`}
              size="sm"
              className={classes.toggleExpandCollapse}
              onClick={() => onExpandChange(dataItem)}
              icon={
                dataItem[EXPAND_FIELD] ? regular('square-minus') : solid('square-plus')
              }
            />
            {!isEditMode && groupLabel}
          </Grid>
          {isEditMode && <Grid item xs={11} className={classes.autocomplete}>
            <FormField>
              <Autocomplete
                placeholder={translate('administration.general.settings.lcp.group.select.placeholder')}
                // value={PART_GROUPS[0]}
                options={PART_GROUPS}
                getOptionLabel={(option: OptionType) => option.label}
                getOptionSelected={(option, value) => option?.value === value?.value}
                onChange={handleChange}
                multiple
              />
            </FormField>
          </Grid>}
        </Grid>
      </Grid>
      <Grid item>
        {isEditMode && <Tooltip title={translate('common.discard')} placement="top">
          <IconButton
            color="primary"
            kind="white"
            onClick={() => discardGroup(dataItem)}
            className={classes.editButtons}
          >
            <FontAwesomeIcon
              icon={regular('square-xmark')}
              className={classes.editButtons}
            />
          </IconButton>
        </Tooltip>}
        {isEditMode && <Tooltip title={translate('common.save')} placement="top">
          <IconButton
            color="primary"
            kind="white"
            className={classes.editButtons}
          >
            <FontAwesomeIcon icon={solid('square-check')} className={classes.editButtons} />
          </IconButton>
        </Tooltip>}
        {!isEditMode && <Tooltip title={translate('common.edit')} placement="top">
          <IconButton
            kind="simple"
            color="primary"
            className={classes.buttons}
            onClick={() => onEditGroup(dataItem)}
          >
            <FontAwesomeIcon
              icon={regular('pen-to-square')}
            />
          </IconButton>
        </Tooltip>}
        {!isEditMode && <Tooltip title={translate('common.delete')} placement="top">
          <IconButton
            kind="simple"
            // onClick={() => onDelete(dataItem)}
            // onClick={() => onDeleteGroup(dataItem)}
            className={classes.deleteButton}
          >
            <FontAwesomeIcon
              icon={regular('trash-can')}
            />
          </IconButton>
        </Tooltip>}
      </Grid>
    </Grid>
  );
};
