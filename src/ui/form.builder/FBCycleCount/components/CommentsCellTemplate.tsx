import { useFormikContext } from 'formik';
import { get } from 'lodash';
import React from 'react';
import { translate } from '../../../../common/intl';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import { FormikField, TextField } from '../../../components/forms/fields-next';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps, EditableCycleCount } from '../types';
import OverflowingContent from './OveflowContent';

const Editor: React.FC<CustomTemplateProps> = ({ field }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, getFieldProps } = useFormikContext<EditableCycleCount>();

  const value = values.comments ?? '';

  return (
    <FormikField
      name={field}
    >
      <TextField
        {...getFieldProps(field)}
        autosize
        size="small"
        inputProps={{
          rowsMax: 5,
        }}
        value={value}
        placeholder={translate('form.builder.lot.transfers.comments')}
      />
    </FormikField>
  );
};

export const CommentsCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const { dataItem, field, onClick } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    return <Editor {...props} />;
  }

  const handleClick = () => onClick?.({ dataItem });
  const displayValue = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER) as string;

  return (
    <OverflowingContent onClick={handleClick}>
      {displayValue}
    </OverflowingContent>
  );
};
