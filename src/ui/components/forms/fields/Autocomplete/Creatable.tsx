import { Box, Typography } from "@material-ui/core";
import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import * as React from "react";
import { createFilter } from "react-select";
import { SelectComponentsProps } from "react-select/base";
import CreatableSelect, { CreatableProps } from "react-select/creatable";
import { ValueType } from "react-select/src/types";
import { TypographyProps } from "../../../../../state/ducks/common";
import Text from "../../../../components/Text";
import Field, { FieldOwnProps } from "../Field";
import { selectStyles } from "./Autocomplete";
import { OptionType } from "./types";

interface AutocompleteOwnProps extends FieldOwnProps {
  creatableProps: SelectComponentsProps & CreatableProps<any>;
  options: OptionType[];
  isDisabled?: boolean;
}

type CreatablePropsWithFormik = AutocompleteOwnProps &
FormikFieldProps &
Partial<TypographyProps>;

const Creatable: React.FunctionComponent<CreatablePropsWithFormik> = ({
  creatableProps,
  options,
  isDisabled = false,
  ...fieldProps
}) => {
  // const { submitForm } = useFormContext();
  const {
    form: { setFieldValue, setFieldTouched, touched },
    field: { name },
  } = fieldProps;
  const onChange = (value: ValueType<OptionType>) => {
    setFieldValue(name, value);
  };
  const onInputChange = () => {
    if (!touched[name]) {
      setFieldTouched(name, true);
    }
  };

  const stringify = (option: OptionType) => option.label;
  const filterOption = createFilter({ ignoreAccents: false, stringify });

  return (
    <Field {...fieldProps} label={undefined}>
      <Box mb={1}>
        <Typography variant="h6">
          <Text message={fieldProps.label} />
        </Typography>
      </Box>
      <CreatableSelect
        styles={selectStyles}
        isClearable={true}
        components={{ DropdownIndicator: null }}
        placeholder={null}
        openMenuOnClick={false}
        openMenuOnFocus={false}
        createOptionPosition="first"
        isValidNewOption={() => true}
        {...{ isDisabled, filterOption, onChange, onInputChange }}
        {...creatableProps}
        options={options}
      />
    </Field>
  );
};

type AutocompleteFieldProps = AutocompleteOwnProps &
FieldConfig &
Partial<TypographyProps>;

const CreatableField: React.FunctionComponent<
AutocompleteFieldProps
> = (props) => <FormikField component={Creatable} {...props} />;

export default CreatableField;
