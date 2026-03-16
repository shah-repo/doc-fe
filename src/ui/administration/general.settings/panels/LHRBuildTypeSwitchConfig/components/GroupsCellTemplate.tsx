import { Box, Chip } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React, { ChangeEvent } from 'react';
import { CellTemplateProps } from '../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { Mode, MODE_FIELD } from '../../../../../components/KendoDataGrid/constants';
import { Autocomplete, FormikField } from '../../../../../components/forms/fields-next';
import { useStyles } from '../styles';
import { EditableLHRBuildSwitch, GroupOption } from '../types';
import { get, isEmpty } from 'lodash';

interface GroupsCellTemplateProps extends CellTemplateProps<EditableLHRBuildSwitch> {
  options: GroupOption[]
}

const GroupsCellTemplate: React.FC<GroupsCellTemplateProps> = ({
  field,
  options,
  dataItem,
  onClick,
}) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, getFieldProps, setFieldValue, errors } = useFormikContext<EditableLHRBuildSwitch>();
  const classes = useStyles();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const handleChange = (event: ChangeEvent<unknown>, value?: GroupOption[]) => {
    setFieldValue(field, value?.map(item => item.id));
  };

  const value = isEditMode ? options?.filter(group => values[field]?.includes(group.id)) : options?.filter(group => dataItem[field]?.includes(group.id));

  if (isEditMode) {
    return (
      <FormikField name={field} error={get(errors, field)}>
        <Autocomplete
          {...getFieldProps(field)}
          key={isEmpty(value) ? 'disabled' : 'enabled'}
          blurOnSelect
          multiple
          value={value}
          options={options}
          getOptionLabel={(option: GroupOption) => option.name}
          getOptionSelected={(option: GroupOption, value: GroupOption) => option.id === value.id}
          onChange={handleChange}
          size="small"
          classes={{
            root: classes.inputRoot,
          }}
        />
      </FormikField>
    );
  }

  return (
    <Box className={classes.chips} onClick={() => onClick?.({ dataItem })}>
      {value?.map((group) => (
        <Chip size="small" label={group.name} key={group.id} />
      ))}
    </Box>
  );
};

export default GroupsCellTemplate;
