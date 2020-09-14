import { Box, Typography } from "@material-ui/core";
import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import * as React from "react";
import Select, { components, createFilter } from "react-select";
import { SelectComponentsProps } from "react-select/base";
import { ValueType } from "react-select/src/types";
import { ReactComponent as DeleteIcon } from "../../../../../assets/images/circle-remove.svg";
import { TypographyProps } from "../../../../../state/ducks/common";
import Text from "../../../../components/Text";
import Colors from "../../../../layout/theme/utils/colors";
import { useFormContext } from "../../FormContext";
import Field, { FieldOwnProps } from "../Field";
import { InputField } from "../Input.styles";
import { OptionType } from "./types";

interface AutocompleteOwnProps extends FieldOwnProps {
  autocompleteProps: SelectComponentsProps;
  options: OptionType[];
  onClick?: (value: any) => void;
  isDisabled?: boolean;
}

export const selectStyles = {
  multiValue: (base) => ({
    ...base,
    background: Colors.light_blue,
  }),
  multiValueRemove: (base) => ({
    ...base,
    "&:hover": {
      background: "transparent",
      cursor: "pointer",
    },
  }),
  control: (base) => ({
    ...base,
    minHeight: "52px",
    padding: "5px 3px",
  }),
};

export const MultiValueRemove = (props) => (
  <components.MultiValueRemove {...props}>
    <DeleteIcon style={{ width: 12, height: 12 }} />
  </components.MultiValueRemove>
);

type AutocompletePropsWithFormik = AutocompleteOwnProps &
FormikFieldProps &
Partial<TypographyProps>;

const Autocomplete: React.FunctionComponent<AutocompletePropsWithFormik> = ({
  autocompleteProps,
  options,
  onClick,
  isDisabled = false,
  ...fieldProps
}) => {
  const { submitForm } = useFormContext();
  const onChange = (value: ValueType<OptionType>) => {
    const {
      form: { setFieldValue, setFieldTouched, touched },
      field: { name },
    } = fieldProps;

    if (!touched[name]) {
      setFieldTouched(name, true);
    }

    setFieldValue(name, value);

    if (onClick) {
      onClick(value);
    }
  };

  const stringify = (option: OptionType) => option.label;
  const filterOption = createFilter({ ignoreAccents: false, stringify });

  return (
    <Field {...fieldProps} label={undefined}>
      <Box mb={0.3}>
        <Typography variant="h5">
          <Text message={fieldProps.label} />
        </Typography>
      </Box>
      <Select
        {...fieldProps.field}
        {...autocompleteProps}
        options={options}
        onChange={onChange}
        styles={selectStyles}
        filterOption={filterOption}
        data-cy={`select_${fieldProps.field.name}`}
        input={<InputField name={fieldProps.field.name} />}
        isDisabled={isDisabled}
        components={{ MultiValueRemove }}
        onBlur={() => {
          submitForm();
        }}
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
