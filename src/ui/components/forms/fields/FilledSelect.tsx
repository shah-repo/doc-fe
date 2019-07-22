import {
  FilledInput,
  MenuItem,
  Select as MuiSelect,
} from "@material-ui/core";
import { SelectProps as MuiSelectProps } from "@material-ui/core/Select";
import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import * as React from "react";
import Text from "../../Text";
import Field, { FieldOwnProps } from "./Field";

export interface SelectOption {
  value: string | number;
  text: string;
}

export interface SelectOwnProps extends FieldOwnProps {
  selectProps?: MuiSelectProps;
  options: SelectOption[];
  includeEmpty?: boolean;
}

type SelectPropsWithFormik = SelectOwnProps & FormikFieldProps;

const Select: React.FunctionComponent<SelectPropsWithFormik> =
  ({ selectProps, options, includeEmpty = true, ...fieldProps }) => {
    const EmptyItem = includeEmpty && (
      <MenuItem value="">
        <Text translation="fields.select.none" tagName="em" />
      </MenuItem>
    );

    const Items = options.map((option) => (
      <MenuItem key={option.value} value={option.value}>{option.text}</MenuItem>
    ));

    return (
      <Field variant="filled" {...fieldProps}>
        <MuiSelect
          {...fieldProps.field}
          {...selectProps}
          input={<FilledInput name={fieldProps.field.name} />}
        >
          {EmptyItem}
          {Items}
        </MuiSelect>
      </Field>
    );
  };

type SelectFieldProps = SelectOwnProps & FieldConfig;

const FilledSelectField: React.FunctionComponent<SelectFieldProps> = (props) =>
  <FormikField component={Select} {...props} />;

export default FilledSelectField;
