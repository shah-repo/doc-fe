import { Box, Typography } from "@material-ui/core";
import {
  Field as FormikField,
  FieldConfig,
  FieldProps as FormikFieldProps,
} from "formik";
import * as React from "react";
import Select, { createFilter } from "react-select";
import { SelectComponentsProps } from "react-select/base";
import { ValueType } from "react-select/src/types";
import {
  TypographyColor,
  TypographyProps,
  TypographySize,
} from "../../../../../state/ducks/common";
import Text from "../../../../components/Text";
import Field, { FieldOwnProps } from "../Field";
import { InputField } from "../Input.styles";
import { OptionType } from "./types";

interface AutocompleteOwnProps extends FieldOwnProps {
  autocompleteProps: SelectComponentsProps;
  options: OptionType[];
  onClick?: (value: any) => void;
}

type AutocompletePropsWithFormik = AutocompleteOwnProps &
FormikFieldProps &
Partial<TypographyProps>;

const Autocomplete: React.FunctionComponent<AutocompletePropsWithFormik> = ({
  autocompleteProps,
  options,
  onClick,
  ...fieldProps
}) => {
  const onChange = (value: ValueType<OptionType>) => {
    const {
      form: { setFieldValue, setFieldTouched, touched },
      field: { name },
    } = fieldProps;

    if (!touched[name]) {
      setFieldTouched(name, true);
    }

    setFieldValue(name, value);
  };

  const stringify = (option: OptionType) => option.label;
  const filterOption = createFilter({ ignoreAccents: false, stringify });

  return (
    <Field {...fieldProps} label={undefined}>
      <Box mb={0.3}>
        <Typography
          variant={TypographySize[fieldProps.size || "md"]}
          color={TypographyColor[fieldProps.color || "secondary"]}
        >
          <Text message={fieldProps.label} />
        </Typography>
      </Box>
      <Select
        {...fieldProps.field}
        {...autocompleteProps}
        options={options}
        onChange={onChange}
        filterOption={filterOption}
        input={<InputField name={fieldProps.field.name} />}
      />
    </Field>
  );
};

type AutocompleteFieldProps = AutocompleteOwnProps &
FieldConfig &
Partial<TypographyProps>;

const AutocompleteField: React.FunctionComponent<
AutocompleteFieldProps
> = (props) => <FormikField component={Autocomplete} {...props} />;

export default AutocompleteField;
