import { BoxProps, InputBaseProps, MenuItem, Select as MuiSelect } from '@material-ui/core';
import { SelectProps as MuiSelectProps } from '@material-ui/core/Select';
import { FieldConfig, Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import * as React from 'react';
import { TypographyProps } from '../../../../state/ducks/common/types';
import { Translation } from '../../../translations/types';
import Text from '../../Text';
import { useFormContext } from '../FormContext';
import Field, { FieldOwnProps } from './Field';
import { InputField } from './Input.styles';

export interface SelectOption {
  value: string | number
  text?: string
}

interface SelectOwnProps extends FieldOwnProps {
  selectProps?: MuiSelectProps
  options: SelectOption[]
  includeEmpty?: boolean
  inputFieldProps?: InputBaseProps
  inputStyleProps?: string
  labelProps?: BoxProps
  placeholder?: Translation
}

type SelectPropsWithFormik = SelectOwnProps &
FormikFieldProps &
Partial<TypographyProps>;

const Select: React.FunctionComponent<SelectPropsWithFormik> = ({
  selectProps,
  options,
  includeEmpty = true,
  inputFieldProps,
  inputStyleProps,
  labelProps,
  placeholder,
  ...fieldProps
}) => {
  const { field } = fieldProps;
  const { submitForm } = useFormContext();
  const EmptyItem = includeEmpty && (
    <MenuItem value="">
      <Text translation="fields.select.none" tagName="em" />
    </MenuItem>
  );

  const PlaceholderItem = placeholder ? (
    <MenuItem value="" disabled>
      <Text translation={placeholder} />
    </MenuItem>
  ) : null;

  const Items = options.map((option) => (
    <MenuItem key={option.value} value={option.value} data-cy={`selectItem.${fieldProps.field.name}.${option.text}`}>
      <Text message={option.text} />
    </MenuItem>
  ));

  return (
    <Field {...fieldProps} labelProps={labelProps} >
      <MuiSelect
        {...fieldProps.field}
        {...selectProps}
        className={inputStyleProps}
        data-cy={`select.${fieldProps.field.name}`}
        input={<InputField name={fieldProps.field.name} {...inputFieldProps} />}
        displayEmpty
        onChange={(evt, child) => {
          field.onChange(evt);
          selectProps?.onChange?.(evt, child);
          submitForm();
        }}
      >
        {PlaceholderItem}
        {EmptyItem}
        {Items}
      </MuiSelect>
    </Field>
  );
};

type SelectFieldProps = SelectOwnProps & FieldConfig & Partial<TypographyProps>;

const SelectField: React.FunctionComponent<SelectFieldProps> = (props) => (
  <FormikField component={Select} {...props} />
);

export default SelectField;
