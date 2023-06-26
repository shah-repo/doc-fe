import { Box, Chip } from '@material-ui/core';
import React, { ChangeEvent } from 'react';
import { translate } from '../../../../common/intl';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { Autocomplete, FormField } from '../../../components/forms/fields-next';
import { MODE_FIELD, Mode } from '../constants';
import useStyles from '../styles';
import { EditableRole, RoleEditEvent, RoleGroup } from '../types';

interface Props extends CellTemplateProps<EditableRole> {
  groups: RoleGroup[]
  onClick?: (e: RoleEditEvent) => void
  updateField?: string
}

const GroupsCellTemplate: React.FC<Props> = ({
  field,
  updateField,
  dataIndex,
  groups,
  dataItem,
  column,
  onChange,
  onClick,
}) => {
  const classes = useStyles();
  const isEditMode = (
    dataItem[MODE_FIELD] === Mode.add || (dataItem[MODE_FIELD] === Mode.edit && column.editable)
  );

  const placeholder = dataItem.groups.length === 0 ? translate('form.builder.approving.groups') : undefined;

  const handleClick = () => onClick?.({ dataItem });

  const handleChange = (event: ChangeEvent<unknown>, value: RoleGroup[]) => {
    onChange?.({
      dataItem,
      dataIndex,
      syntheticEvent: event,
      field: updateField ?? field,
      value,
    });
  };
  if (isEditMode) {
    return (
      <FormField>
        <Autocomplete
          placeholder={placeholder}
          value={dataItem.groups}
          options={groups}
          getOptionLabel={(option: RoleGroup) => option.name}
          getOptionSelected={(option: RoleGroup, value: RoleGroup) => option.id === value.id}
          onChange={handleChange}
          multiple
        />
      </FormField>
    );
  }
  return (
    <Box className={classes.chips} onClick={handleClick}>
      {dataItem.groups.map((group) => (
        <Chip size="small" label={group.name} key={group.id} />
      ))}
    </Box>
  );
};

export default GroupsCellTemplate;
