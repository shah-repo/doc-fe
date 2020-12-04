import { Box, Chip, TextField, Typography } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { RenderInputParams } from "@material-ui/lab/Autocomplete";
import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import * as React from "react";
import { components } from "react-select";
import { ValueType } from "react-select/src/types";
import { ReactComponent as DeleteIcon } from "../../../../../assets/images/circle-remove.svg";
import { TypographyProps } from "../../../../../state/ducks/common";
import Text from "../../../../components/Text";
import Colors from "../../../../layout/theme/utils/colors";
import Field, { FieldOwnProps } from "../Field";
import { OptionType } from "./types";

interface AutocompleteOwnProps extends FieldOwnProps {
  options: OptionType[];
  onClick?: (value: any) => void;
  onChange?: (value: ValueType<OptionType>) => void;
  disabled?: boolean;
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

const AvailableReferences: React.FunctionComponent<AutocompletePropsWithFormik> = ({
  onClick,
  options,
  disabled = false,
  ...fieldProps
}) => {
  const onChange = (e, value) => {
    console.log(value);
    fieldProps.onChange?.(value);
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

  return (
    <Field {...fieldProps} label={undefined}>
      <Box mb={0.3}>
        <Typography variant="h5">
          <Text message={fieldProps.label} />
        </Typography>
      </Box>
      <Autocomplete
        onChange={onChange}
        {...{ disabled, options }}
        renderInput={(params: RenderInputParams) => (
          <Box display="flex">
            <Box width="100%">
              <TextField
                {...params}
                fullWidth
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                }}
                inputProps={{
                  ...params.inputProps,
                  style: { padding: "10.5px 0" },
                }}
              />
            </Box>
          </Box>
        )}
        renderOption={(option) => option.label}
        renderTags={(value, getTagProps) => (
          value.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option.value}
              label={option.label}
              style={{ minHeight: "32px", height: "auto" }}
              disabled={option.deleteDisabled}
            />
          ))
        )}
        multiple
        options={options}
      />
    </Field>
  ); };

type AutocompleteFieldProps = AutocompleteOwnProps &
FieldConfig &
Partial<TypographyProps>;

const AvailableReferencesField: React.FunctionComponent<
  AutocompleteFieldProps
> = (props) => <FormikField component={AvailableReferences} {...props} />;

export default AvailableReferencesField;
