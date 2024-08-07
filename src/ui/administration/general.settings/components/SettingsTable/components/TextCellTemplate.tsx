import { useFormikContext } from 'formik';
import { get } from 'lodash';
import React from 'react';
import { CellTemplateProps, EditableItem } from '../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../../../components/OverflowTooltip';
import { FormikField, TextField } from '../../../../../components/forms/fields-next';
import useStyles from '../styles';

function TextCellTemplate<T extends EditableItem> ({
  dataItem,
  field,
}: CellTemplateProps<T>): React.ReactElement {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps } = useFormikContext();
  const classes = useStyles();

  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const defaultValue = get(dataItem, field, '') as string;

  if (isEditMode) {
    return (
      <FormikField name={field}>
        <TextField
          {...getFieldProps(field)}
          classes={{
            input: classes.inputText,
            root: classes.inputRoot,
          }}
        />
      </FormikField>
    );
  }
  return (
    <OverflowTooltip
      title={defaultValue}
      placement="top"
      arrow
    >
      {defaultValue}
    </OverflowTooltip>
  );
}

export default TextCellTemplate;
