import { useFormikContext } from 'formik';
import { get } from 'lodash';
import React from 'react';
import { translate } from '../../../../../common/intl';
import OverflowingContent from '../../../../change.request/FBMaterialDisposition/components/commonCells/OveflowContent';
import { MODE_FIELD, Mode } from '../../../../components/KendoDataGrid/constants';
import { FormikField, TextField } from '../../../../components/forms/fields-next';
import { EMPTY_VALUE_PLACEHOLDER } from '../../constants';
import { CustomTemplateProps } from '../../types';

const Editor: React.FC<CustomTemplateProps> = ({ field }) => {
  const { getFieldProps } = useFormikContext();

  return (
    <FormikField
      name={field}
    >
      <TextField
        {...getFieldProps(field)}
        defaultValue={undefined}
        type="text"
        placeholder={translate('lhr.summary.placeholder.enter')}
        size="small"
      />
    </FormikField>
  );
};

export const TextInputCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const { field, dataItem, onClick } = props;
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
