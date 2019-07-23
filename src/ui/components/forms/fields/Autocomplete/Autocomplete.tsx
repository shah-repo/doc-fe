import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import * as React from "react";
import Select from "react-select";
import { SelectComponentsProps } from "react-select/lib/Select";
import { ValueType } from "react-select/lib/types";
import Field, { FieldOwnProps } from "../Field";
import AutocompleteComponents from "./AutocompleteComponents";
import { OptionType } from "./types";

interface AutocompleteOwnProps extends FieldOwnProps {
  autocompleteProps: SelectComponentsProps;
  options: OptionType[];
  onClick?: (value: any) => void; 
}

type AutocompletePropsWithFormik = AutocompleteOwnProps & FormikFieldProps;

const Autocomplete: React.FunctionComponent<AutocompletePropsWithFormik> = ({
  autocompleteProps,
  options,
  onClick,
  ...fieldProps
}) => {
  const onChange = (value: ValueType<OptionType>) => {
    fieldProps.form.setFieldValue(fieldProps.field.name, value);
  };

  return (
    <Field {...fieldProps}>
        <Select
          {...fieldProps.field}
          {...autocompleteProps}
          options={options}
          onChange={onChange}
          components={{
            ...AutocompleteComponents,
            MultiValue: (props) => AutocompleteComponents.MultiValue({ ...props, onClick }),
          }}
        />
    </Field>
  );
};

type AutocompleteFieldProps = AutocompleteOwnProps & FieldConfig;

const AutocompleteField: React.FunctionComponent<AutocompleteFieldProps> = (props) => (
  <FormikField component={Autocomplete} {...props} />
);

export default AutocompleteField;
