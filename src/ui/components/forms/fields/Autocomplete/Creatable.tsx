import { Box, Typography } from "@material-ui/core";
import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import * as React from "react";
import { useState } from "react";
import { createFilter } from "react-select";
import { SelectComponentsProps } from "react-select/base";
import CreatableSelect, { CreatableProps } from "react-select/creatable";
import { ActionMeta, ValueType } from "react-select/src/types";
import { TypographyProps } from "../../../../../state/ducks/common/types";
import Text from "../../../../components/Text";
import Colors from "../../../../layout/theme/utils/colors";
import { useFormContext } from "../../FormContext";
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
  const formikValue = fieldProps.field.value;
  const value = React.useMemo(() => ({ value: formikValue, label: formikValue }), [formikValue]);
  React.useEffect(() => {
    setInputValue(formikValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formikValue]);
  const [inputValue, setInputValue] = useState(formikValue);
  const { submitForm } = useFormContext();
  const {
    form: { setFieldValue, setFieldTouched, touched },
    field: { name },
  } = fieldProps;
  const onChange = (value: ValueType<OptionType>, action: ActionMeta) => {
    if (action.action === "clear") {
      setInputValue("");
    }
    setFieldValue(name, (value as any)?.value);
    submitForm();
  };
  const onInputChange = (value) => {
    if (!touched[name]) {
      setFieldTouched(name, true);
    }
    if (value) {
      setInputValue(value);
    }
    if (!value && inputValue?.length === 1) {
      setInputValue(value);
    }
  };
  const onFocus = () => {
    setInputValue(formikValue || "");
  };
  const onBlur = () => {
    if (formikValue !== inputValue) {
      setFieldValue(name, inputValue);
      submitForm();
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
        inputValue={inputValue}
        value={value}
        styles={{
          ...selectStyles,
          input: (base) => ({
            ...base,
            input: { opacity: inputValue ? "1 !important" : 0, backgroundColor: "red" },
          }),
          control: (base) => ({
            ...base,
            backgroundColor: Colors.white,
            borderColor: Colors.hint_gray,
            minHeight: "52px",
            padding: "5px 3px",
          }),
        }}
        isClearable={Boolean(formikValue)}
        components={{ DropdownIndicator: null }}
        placeholder={null}
        openMenuOnClick={false}
        openMenuOnFocus={false}
        createOptionPosition="first"
        isValidNewOption={() => true}
        blurInputOnSelect={false}
        controlShouldRenderValue={false}
        {...{ isDisabled, filterOption, onChange, onInputChange, onFocus, onBlur }}
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
