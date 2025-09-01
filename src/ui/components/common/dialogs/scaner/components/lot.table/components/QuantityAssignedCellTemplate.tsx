import { useFormikContext } from 'formik';
import { get } from 'lodash';
import React from 'react';
import { translate } from '../../../../../../../../common/intl';
import { EMPTY_VALUE_PLACEHOLDER, MODE_FIELD, Mode } from '../../../../../../../components/KendoDataGrid/constants';
import OverflowContent from '../../../../../../../components/OverflowContent';
import { FormikField, TextField } from '../../../../../../../components/forms/fields-next';
import { positiveNumber, validator } from '../../../../../../../components/forms/fields/validators';
import { toastError } from '../../../../../../notifications';
import { CustomTemplateProps } from '../types';

const Editor: React.FC<CustomTemplateProps> = ({ field, dataItem }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps, setFieldValue } = useFormikContext();
  const max = dataItem?.onHand;

  const onChange = (event) => {
    const value = event.target.value;

    if (max && value > max) {
      toastError(translate('scan.lot.grid.quantity.max.error.message', { max }));
      return;
    } else if (value < 0) {
      toastError(translate('scan.lot.grid.quantity.min.error.message'));
      return;
    }

    setFieldValue(field, value);
  };

  return (
    <FormikField
      name={field}
      validate={validator(positiveNumber)}
    >
      <TextField
        {...getFieldProps(field)}
        defaultValue={undefined}
        type="number"
        placeholder={translate('common.enter')}
        onChange={onChange}
        inputProps={{ min: 0, max }}
        size="small"
      />
    </FormikField>
  );
};

export const QuantityAssignedCellTemplate: React.FC<CustomTemplateProps> = (props) => {
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
