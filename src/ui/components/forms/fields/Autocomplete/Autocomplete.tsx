import { Box, Typography } from "@material-ui/core";
import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import * as React from "react";
import Select from "react-select";
import { SelectComponentsProps } from "react-select/lib/Select";
import { ValueType } from "react-select/lib/types";
import { TypographySize } from "../../../../../state/ducks/common";
import Text from "../../../../components/Text";
import Field, { FieldOwnProps } from "../Field";
import { InputField, LabelField } from "../Input.styles";
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
    const { 
      form: { setFieldValue, setFieldTouched, touched },
      field: { name }
    } = fieldProps;

    if (!touched[name]) {
      setFieldTouched(name, true);
    }

    setFieldValue(name, value);
  };

  return (
    <Field {...fieldProps} label={undefined}>
        <Box mb={0.3}>
          <Typography variant={TypographySize[fieldProps.size || "md"]}>
            <Text message={fieldProps.label}/>
          </Typography>
        </Box>
        <Select
          {...fieldProps.field}
          {...autocompleteProps}
          options={options}
          onChange={onChange}
          input={<InputField name={fieldProps.field.name} />}
        />
    </Field>
  );
};

type AutocompleteFieldProps = AutocompleteOwnProps & FieldConfig;

const AutocompleteField: React.FunctionComponent<AutocompleteFieldProps> = (props) => (
  <FormikField component={Autocomplete} {...props} />
);

export default AutocompleteField;
