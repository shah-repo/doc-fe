/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import { first, get, includes, isBoolean, isEmpty, isString, isUndefined } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { FBOption } from "..";
import { isTranslation } from "../../translations/types";
import { withFBEditorOptions } from "../FBEditorOptions/FBEditorOptions.wrap";
import { FBInputProps, OmitInputClones } from "../FBInput";
import { FB } from "../helpers";
import { withFBOnChange } from "./FBInput.onchange";

export const withFBInput = <T extends FBInputProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    optionsToString,
    inputState,
    onChange,
    onBlur,
    name = "",
    children,
    disabled,
    defaultValue,
    defaultChecked,
    type,
    editorProperties,
    helperText,
    validationMode,
    includeContext,
    label,
    placeholder,
    error,
    hidden,
    rules,
    value,
    ...props
  }: T) => {

    const { formState } = FB.useStores();
    const intl = useIntl();
    defaultValue = setDefaultValue();
    helperText = formState?.errors.get(name) || helperText;
    error = !isUndefined(formState?.errors.get(name)) && formState?.errorValidation;
    value = inputState?.value;
    includeContext = inputState?.includeContext;

    // TODO: Autocomplete default set as input
    // then this can be removed and handle through defaultValue
    const validationValue = get(formState?.values, name);
    (isUndefined(hidden) && formState?.workspaceMode === "form" && validationMode === "visibility") && (hidden =
      !helperText && (!validationValue || isEmpty(validationValue))
    );

    (!disabled && formState?.workspaceMode === "form" && validationMode === "disabled") && (disabled =
      !helperText && (!validationValue || isEmpty(validationValue))
    );

    function setDefaultValue(): any {
      if (!formState) { return; }
      const value = {
        editoroptions() {
          const options: FBOption[] | undefined = formState?.getFieldValue(name);
          if (isString(options)) {
            return;
          }
          const value = optionsToString && optionsToString(options);
          formState?.setFieldValue(name, value);
          return value || "";
        },
        autocompleteasync() { return; },
        autocomplete() { return; },
        datepicker() {
          return inputState && (inputState.value = formState.getFieldValue(name, ""));
        },
        default() {
          return formState.getFieldValue(name, defaultValue || defaultChecked);
        },
      };
      const transDefault = (value[type || ""] || value.default)();
      if (isTranslation(transDefault)) {
        return intl.formatMessage({ id: transDefault });
      }
      return transDefault;
    }

    const child = first(React.Children.toArray(children));
    const isClone = !includes(OmitInputClones, type) && !isUndefined(child);

    if (isClone) {
      children = React.cloneElement(child as React.ReactElement, {
        name,
        disabled,
        onChange,
        onBlur,
        ...(type === "textfield" && { error }),
        ...(type !== "texteditor" && { value }),
        ...(type !== "datepicker" && type !== "autocomplete" && !isBoolean(defaultValue) && { defaultValue }),
      });
    }

    React.useEffect(() => {
      if (!formState && !inputState) { return; }
      // Input states
      formState!.inputState.set(name, inputState!);
      formState!.inputState.set(name, inputState!);

      // Validation settings
      let attr = (label as string) || placeholder || name;
      isTranslation(attr) && (attr = intl.formatMessage({ id: attr }));
      formState?.setValidationAttributeName(name, attr);
      rules && (formState!.setFieldRules(name, rules));
    }, [rules]);

    return Component({
      ...(props as T),
      includeContext,
      validationMode,
      helperText,
      children,
      disabled,
      defaultValue,
      type,
      onChange,
      onBlur,
      name,
      error,
      inputState,
      editorProperties,
      hidden,
      label,
      placeholder,
      rules,
      value,
    });
  };

  return withFBEditorOptions(withFBOnChange((props: T) => Comp(props)));
};
