import { useFormikContext } from 'formik';
import { get } from 'lodash';
import React from 'react';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import { FormikField, TextField } from '../../../components/forms/fields-next';
import { positiveNumber, requiredNumber, validator } from '../../../components/forms/fields/validators';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps, EditableCycleCount } from '../types';
import OverflowContent from '../../../components/OverflowContent';
import cx from 'classnames';
import useStyles from '../styles';

interface Props extends CustomTemplateProps {
  defaultValue?: number
  disabled?: boolean
}

const Editor: React.FC<Props> = ({ disabled, defaultValue, field }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps, values } = useFormikContext<EditableCycleCount>();

  return (
    <FormikField
      name={field}
      validate={!disabled ? validator(requiredNumber, positiveNumber) : undefined}
      disabled={disabled}
    >
      <TextField
        {...getFieldProps(field)}
        value={defaultValue ?? values[field] as number}
        defaultValue={undefined}
        type="number"
        inputProps={{ min: 0 }}
        size="small"
      />
    </FormikField>
  );
};

export const QuantityCellTemplate: React.FC<Props> = (props) => {
  const { dataItem, field, onClick } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const classes = useStyles();

  if (isEditMode) {
    return <Editor {...props} />;
  }

  const handleClick = () => onClick?.({ dataItem });
  const displayValue = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER) as string;

  return (
    <OverflowContent
      title={<div className={cx('containing-box-scrollbar', classes.tooltipContent)}>{displayValue}</div>}
      onClick={handleClick}
    >
      {displayValue}
    </OverflowContent>
  );
};
