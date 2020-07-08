import { InputBaseProps, MenuItem, Select as MuiSelect } from "@material-ui/core";
import { SelectProps as MuiSelectProps } from "@material-ui/core/Select";
import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import * as React from "react";
import { TypographyProps } from "../../../../state/ducks/common";
import Text from "../../Text";
import { useFormContext } from "../FormContext";
import Field, { FieldOwnProps } from "./Field";
import { InputField } from "./Input.styles";

export interface SelectOption {
  value: string | number;
  text: string;
}

export interface SelectOwnProps extends FieldOwnProps {
  selectProps?: MuiSelectProps;
  options: SelectOption[];
  includeEmpty?: boolean;
  inputFieldProps?: InputBaseProps;
}

type SelectPropsWithFormik = SelectOwnProps &
FormikFieldProps &
Partial<TypographyProps>;

const Select: React.FunctionComponent<SelectPropsWithFormik> = ({
  selectProps,
  options,
  includeEmpty = true,
  inputFieldProps,
  ...fieldProps
}) => {
  const { field } = fieldProps;
  const { submitForm } = useFormContext();
  const EmptyItem = includeEmpty && (
    <MenuItem value="">
      <Text translation="fields.select.none" tagName="em" />
    </MenuItem>
  );

  const Items = options.map((option) => (
    <MenuItem key={option.value} value={option.value} data-cy={`selectItem.${fieldProps.field.name}.${option.text}`}>
      <Text message={option.text} />
    </MenuItem>
  ));

  return (
    <Field {...fieldProps} >
      <MuiSelect
        {...fieldProps.field}
        {...selectProps}
        data-cy={`select.${fieldProps.field.name}`}
        input={<InputField name={fieldProps.field.name} {...inputFieldProps}/>}
        onChange={(evt, child) => {
          field.onChange(evt);
          selectProps?.onChange?.(evt, child);
          submitForm();
        }}
      >
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
