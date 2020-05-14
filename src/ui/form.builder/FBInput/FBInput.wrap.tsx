/* eslint-disable react-hooks/exhaustive-deps */
import _ from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { FBOption } from "..";
import { isTranslation } from "../../translations/types";
import { FBInputProps, OmitInputClones } from "../FBInput";
import { FB } from "../helpers";
import { withFBOnChange } from "./FBInput.onchange";

export const withFBInput = <T extends FBInputProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    inputState,
    onChange,
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
    error = !_.isUndefined(formState?.errors.get(name)) && formState?.errorValidation;

    if (type === "texteditor" && inputState) {
      inputState.value = inputState.value || "";
    }
    value = inputState?.value;
    includeContext = inputState?.includeContext;

    (_.isUndefined(hidden) && validationMode === "visibility") && (hidden =
      !helperText && !defaultValue
    );

    function editorOptionDefaultValue(): string {
      const options: FBOption[] | undefined = formState?.getFieldValue(name);
      const { editorProperties = [] } = formState?.values || {};
      if (!options) { return ""; }
      let editorValue = "";
      options.reduce && (editorValue = options.reduce((acc, item) => {
        const { value, text } = item;
        !editorProperties.includes(value) && (acc += `${text}\n`);
        return acc;
      }, editorValue));
      return editorValue.replace(/^\s+|\s+$/g, "");
    }

    function setDefaultValue(): any {
      if (!formState) {
        return;
      }
      const value = {
        editoroptions() {
          return editorOptionDefaultValue();
        },
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

    React.useEffect(() => {
      if (!_.isUndefined(defaultValue) && !_.isEmpty(defaultValue)) {
        formState?.setFieldValue(name, defaultValue);
      }
      inputState?.setDefaultValue(defaultValue);
    }, [defaultValue]);

    const child = _.first(React.Children.toArray(children));
    const isClone = !_.includes(OmitInputClones, type) && !_.isUndefined(child);

    if (isClone) {
      children = React.cloneElement(child as React.ReactElement, {
        disabled,
        onChange,
        // defaultValue,
        ...(type !== "texteditor" && { value }),
        // ...(type === "datepicker") && { value: inputState?.value },
        // ...(type !== "texteditor" && { value }),
        ...(type !== "datepicker" && type !== "autocomplete" && !_.isBoolean(defaultValue) && { defaultValue }),
      });
    }

    React.useEffect(() => {
      // Input states
      inputState && formState && formState.inputState.set(name, inputState);
      // Validation settings
      if (formState && name) {
        let attr = (label as string) || placeholder || name;
        isTranslation(attr) && (attr = intl.formatMessage({ id: attr }));
        formState?.setValidationAttributeName(name, attr);
        rules && (formState.setFieldRules(name, rules));
      }
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

  return withFBOnChange((props: T) => Comp(props));
};
