import { Box, BoxProps, ClickAwayListener } from "@material-ui/core";
import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import { isEmpty } from "lodash";
import * as React from "react";
import { useState } from "react";
import { useIntl } from "react-intl";
import { createFilter } from "react-select";
import { SelectComponentsProps } from "react-select/base";
import CreatableSelect, { CreatableProps } from "react-select/creatable";
import { ActionMeta, ValueType } from "react-select/src/types";
import { TypographyProps } from "../../../../../state/ducks/common/types";
import Colors from "../../../../layout/theme/utils/colors";
import { useFormContext } from "../../FormContext";
import Field, { FieldOwnProps } from "../Field";
import { selectStyles } from "./Autocomplete";
import { OptionType } from "./types";

interface AutocompleteOwnProps extends FieldOwnProps {
  creatableProps: SelectComponentsProps & CreatableProps<any>;
  options: OptionType[];
  isDisabled?: boolean;
  placeholder?: string;
  labelProps?: BoxProps;
}

type CreatablePropsWithFormik = AutocompleteOwnProps &
FormikFieldProps &
Partial<TypographyProps>;

const Creatable: React.FunctionComponent<CreatablePropsWithFormik> = ({
  creatableProps,
  options,
  isDisabled = false,
  placeholder,
  labelProps,
  ...fieldProps
}) => {
  const formikValue = fieldProps.field.value;
  const value = React.useMemo(() => ({ value: formikValue, label: formikValue }), [formikValue]);
  React.useEffect(() => {
    setInputValue(formikValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [inputValue, setInputValue] = useState(formikValue);
  const [hover, setHover] = useState(false);
  // const [clicked, setClicked] = useState(false);
  const [showOnlyText, setShowOnlyText] = useState(isEmpty(inputValue));
  const { submitForm } = useFormContext();
  const {
    form: { setFieldValue, setFieldTouched, touched },
    field: { name },
  } = fieldProps;
  const onChange = (value: ValueType<OptionType>, action: ActionMeta) => {
    if (action.action === "clear") {
      setInputValue("");
    }
    else {
      setInputValue((value as any)?.value);
    }
    setFieldValue(name, (value as any)?.value);
    setShowOnlyText(true);
    // submitForm();
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

  const onBlur = async () => {
    // setClicked(true);
    if (formikValue !== inputValue) {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await setFieldValue(name, inputValue);
    }
    setShowOnlyText(false);
    submitForm();
  };

  const stringify = (option: OptionType) => option.label;
  const filterOption = createFilter({ ignoreAccents: false, stringify });

  const onAway = () => {
    setHover(false);
    setShowOnlyText(true);
  };

  const intl = useIntl();
  const titlePlaceholder = intl.formatMessage({ id: "form.builder.enter.title" });

  return (
    <Field {...fieldProps} label={undefined} labelProps={labelProps}>
      <ClickAwayListener onClickAway={onAway}>
        <div>
          {showOnlyText &&
        <Box style={{
          fontWeight: 600,
          fontSize: "19px",
          lineHeight: "24px",
          minHeight: "32px",
          backgroundColor: hover ? Colors.platinum : Colors.alabaster,
        }}
        justifyContent="center"
        onMouseEnter={() => { setHover(true); }}
        onMouseLeave={() => { setHover(false); }}
        onClick={() => { setShowOnlyText(false); }}
        >{inputValue || titlePlaceholder}
        </Box>}
          {!showOnlyText && <CreatableSelect
            inputValue={inputValue}
            value={value}
            styles={{
              ...selectStyles,
              input: (base) => ({
                ...base,
                input: {
                  opacity: "1 !important",
                },
              }),
              control: (base, state) => ({
                ...base,
                fontSize: "19px",
                fontWeight: 600,
                lineHeight: "24px",
                minHeight: "32px",
              }),
            }}
            isClearable={Boolean(formikValue)}
            components={{ DropdownIndicator: null }}
            placeholder={!inputValue ?
              <div style={{ color: Colors.almost_black }}>{titlePlaceholder}</div> : null}
            openMenuOnClick={false}
            openMenuOnFocus={false}
            createOptionPosition="first"
            isValidNewOption={() => true}
            blurInputOnSelect={false}
            controlShouldRenderValue={false}
            {...{ isDisabled, filterOption, onChange, onInputChange, onBlur }}
            {...creatableProps}
            options={options}
          />}
        </div>
      </ClickAwayListener>
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
