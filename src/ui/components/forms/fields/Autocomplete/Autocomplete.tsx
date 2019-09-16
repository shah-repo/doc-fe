import { Box, Typography } from "@material-ui/core";
import {
  Field as FormikField,
  FieldConfig,
  FieldProps as FormikFieldProps,
} from "formik";
import * as React from "react";
import Select from "react-select";
import { SelectComponentsProps } from "react-select/lib/Select";
import { ValueType } from "react-select/lib/types";
import {
  TypographyColor,
  TypographyProps,
  TypographySize,
  Approval,
} from "../../../../../state/ducks/common";
import Text from "../../../../components/Text";
import Field, { FieldOwnProps } from "../Field";
import { InputField, LabelField } from "../Input.styles";
import { OptionType } from "./types";

interface AutocompleteOwnProps extends FieldOwnProps {
  autocompleteProps: SelectComponentsProps;
  options: OptionType[];
  onClick?: (value: any) => void;
  dataProp?: Approval[];
}

type AutocompletePropsWithFormik = AutocompleteOwnProps &
  FormikFieldProps &
  Partial<TypographyProps>;

const Autocomplete: React.FunctionComponent<AutocompletePropsWithFormik> = ({
  autocompleteProps,
  options,
  onClick,
  dataProp,
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

  const styles = {
    multiValueRemove: (base: React.CSSProperties, state: any) => {
      return dataProp!.some(approver => approver.approver.name === state.data.label) ? { ...base, display: "none" } : base ;
    },
  };

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
        input={<InputField name={fieldProps.field.name} />}
        styles={styles}
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
