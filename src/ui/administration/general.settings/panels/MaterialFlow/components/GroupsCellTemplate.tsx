import { Box, Chip } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React, { ChangeEvent } from 'react';
import { CellTemplateProps } from '../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { Mode, MODE_FIELD } from '../../../../../components/KendoDataGrid/constants';
import { Autocomplete, FormikField } from '../../../../../components/forms/fields-next';
import useStyles from '../styles';
import { EditableMaterialFlowAclRule, GroupOption } from '../types';

interface Props extends CellTemplateProps<EditableMaterialFlowAclRule> {
  options: GroupOption[]
  updateField?: string
}

const GroupsCellTemplate: React.FC<Props> = ({
  field,
  options,
  dataItem,
  onClick,
}) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, getFieldProps, setFieldValue } = useFormikContext<EditableMaterialFlowAclRule>();
  const classes = useStyles();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const handleChange = (event: ChangeEvent<unknown>, value?: GroupOption) => {
    setFieldValue(field, value);
  };

  const value = (isEditMode ? values[field] : dataItem[field]) as GroupOption[];

  if (isEditMode) {
    return (
      <FormikField name={field}>
        <Autocomplete
          {...getFieldProps(field)}
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
      {value.map((group) => (
        <Chip size="small" label={group.name} key={group.id} />
      ))}
    </Box>
  );
};

export default GroupsCellTemplate;
