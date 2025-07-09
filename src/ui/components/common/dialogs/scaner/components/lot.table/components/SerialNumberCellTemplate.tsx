import { useFormikContext } from 'formik';
import { get } from 'lodash';
import React from 'react';
import { translate } from '../../../../../../../../common/intl';
import { EMPTY_VALUE_PLACEHOLDER, MODE_FIELD, Mode } from '../../../../../../KendoDataGrid/constants';
import OverflowContent from '../../../../../../OverflowContent';
import { FormikField, TextField } from '../../../../../../forms/fields-next';
import { CustomTemplateProps } from '../types';

const Editor: React.FC<CustomTemplateProps> = ({ field }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps } = useFormikContext();

  return (
    <FormikField
      name={field}
    >
      <TextField
        {...getFieldProps(field)}
        defaultValue={undefined}
        placeholder={translate('common.scan')}
        type="text"
        size="small"
      />
    </FormikField>
  );
};

export const SerialNumberCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const { dataItem, field, onClick } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    return <Editor {...props} />;
  }

  const handleClick = () => onClick?.({ dataItem });
  const displayValue = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER) as string;

  return (
    <OverflowContent onClick={handleClick}>
      {displayValue}
    </OverflowContent>
  );
};
