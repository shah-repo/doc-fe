import { Box, ClickAwayListener } from "@material-ui/core";
import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import * as React from "react";
import { useState } from "react";
import { useIntl } from "react-intl";
import { createFilter } from "react-select";
import { SelectComponentsProps } from "react-select/base";
import CreatableSelect, { CreatableProps } from "react-select/creatable";
import { ActionMeta, ValueType } from "react-select/src/types";
import { SM } from "../../../../../App";
import { TypographyProps } from "../../../../../state/ducks/common/types";
import { DOCUMENT_REVISION_CREATE_URL } from "../../../../constants/urls";
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
}

type CreatablePropsWithFormik = AutocompleteOwnProps &
FormikFieldProps &
Partial<TypographyProps>;

const Creatable: React.FunctionComponent<CreatablePropsWithFormik> = ({
  creatableProps,
  options,
  isDisabled = false,
  placeholder,
  ...fieldProps
}) => {
  const formikValue = fieldProps.field.value;
  const value = React.useMemo(() => ({ value: formikValue, label: formikValue }), [formikValue]);
  React.useEffect(() => {
    setInputValue(formikValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [inputValue, setInputValue] = useState(formikValue);
  const isCreateUrl = SM.pathname.includes(DOCUMENT_REVISION_CREATE_URL);
  const [showOnlyText, setShowOnlyText] = useState(!(isCreateUrl && !inputValue));
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
    setShowOnlyText(false);
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
    if (inputValue) {
      setShowOnlyText(true);
    }
  };

  const intl = useIntl();
  const titlePlaceholder = intl.formatMessage({ id: "form.builder.enter.title" });

  return (
    <Field {...fieldProps} label={undefined}>
      <ClickAwayListener onClickAway={onAway}>
        <div>
          {showOnlyText &&
        <Box style={{
          fontFamily: "Sora",
          fontStyle: "normal",
          fontWeight: 600,
          fontSize: "19px",
          lineHeight: "24px",
        }}
        onClick={() => { setShowOnlyText(false); }}
        >{inputValue}
        </Box>}
          {!showOnlyText && <CreatableSelect
            inputValue={inputValue}
            value={value}
            styles={{
              ...selectStyles,
              input: (base) => ({
                ...base,
                input: {
                  opacity: inputValue || (isCreateUrl && !inputValue) ? "1 !important" : 0,
                  backgroundColor: "red",
                },
              }),
              control: (base) => ({
                ...base,
                backgroundColor: Colors.white,
                border: `1px solid ${Colors.clear_blue}`,
                boxShadow: `0 0 0 1px ${Colors.clear_blue}`,
                fontFamily: "Sora",
                fontSize: "19px",
                fontWeight: 600,
                lineHeight: "24px",
                // borderColor: Colors.hint_gray,
                minHeight: "32px",
                padding: "5px 3px",
              }),
            }}
            isClearable={Boolean(formikValue)}
            components={{ DropdownIndicator: null }}
            placeholder={isCreateUrl && !inputValue ?
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
