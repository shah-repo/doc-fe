import { useFormikContext } from 'formik';
import { get } from 'lodash';
import React from 'react';
import { truncateByMaxChars } from '../../../../../../components/common/header/Helpers';
import { FormikField, TextField } from '../../../../../../components/forms/fields-next';
import { Mode, MODE_FIELD } from '../../../../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../../../../components/OverflowTooltip';
import { MAX_ASL_STATUS_CHAR_LIMIT } from '../../../../../../form.builder/FBProductOrService/constants';
import { CustomCellProps } from '../types';
import useStyles from './styles';

interface ASLTextEditorProps {
  field: string
}

const ASLTextEditor: React.FC<ASLTextEditorProps> = ({ field }) => {
  const { getFieldProps } = useFormikContext();
  const classes = useStyles();

  return (
    <FormikField name={field}>
      <TextField
        {...getFieldProps(field)}
        classes={{ root: classes.inputRoot }}
        size="small"
      />
    </FormikField>
  );
};

const ASLDisplayLabel: React.FC<CustomCellProps> = ({ dataItem, field }) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const defaultValue = get(dataItem, field, '');
  const forceTooltip = defaultValue?.length > MAX_ASL_STATUS_CHAR_LIMIT;

  if (isEditMode) {
    return <ASLTextEditor field={field} />;
  }

  return (
    <OverflowTooltip title={defaultValue} placement="top" arrow forceTooltip={forceTooltip}>
      {truncateByMaxChars(defaultValue, MAX_ASL_STATUS_CHAR_LIMIT)}
    </OverflowTooltip>
  );
};

export default ASLDisplayLabel;
