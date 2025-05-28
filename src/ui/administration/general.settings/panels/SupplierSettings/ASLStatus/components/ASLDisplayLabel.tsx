import { useFormikContext } from 'formik';
import { get } from 'lodash';
import React from 'react';
import { truncateByMaxChars } from '../../../../../../components/common/header/Helpers';
import { FormikField, TextField } from '../../../../../../components/forms/fields-next';
import { Mode, MODE_FIELD } from '../../../../../../components/KendoDataGrid/constants';
import { CellTemplateProps, EditableItem } from '../../../../../../components/KendoDataGrid/KendoDataGrid.types';
import OverflowTooltip from '../../../../../../components/OverflowTooltip';
import { MAX_ASL_STATUS_CHAR_LIMIT } from '../../../../../../form.builder/FBProductOrService/constants';
import useStyles from './styles';

function ASLDisplayLabel<T extends EditableItem> ({
  dataItem,
  field,
}: CellTemplateProps<T>): React.ReactElement {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps } = useFormikContext();
  const classes = useStyles();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const defaultValue = get(dataItem, field, '') as string;
  const forceTooltip = defaultValue.length > MAX_ASL_STATUS_CHAR_LIMIT;

  if (isEditMode) {
    return (
      <FormikField name={field}>
        <TextField
          {...getFieldProps(field)}
          classes={{
            root: classes.inputRoot,
          }}
          size="small"
        />
      </FormikField>
    );
  }
  return (
    <OverflowTooltip
      title={defaultValue}
      placement="top"
      arrow
      forceTooltip={forceTooltip}
    >
      {truncateByMaxChars(defaultValue, MAX_ASL_STATUS_CHAR_LIMIT)}
    </OverflowTooltip>
  );
}

export default ASLDisplayLabel;
