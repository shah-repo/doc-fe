import _ from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { FBOption } from "..";
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
    helperText =  formState?.helpers.get(name) || helperText;
    value = inputState?.value;
    error = !_.isUndefined(formState?.getFieldHelper(name)) && formState?.errorValidation;

    (_.isUndefined(hidden) && validationMode === "visibility") && (hidden =
      !helperText && !defaultValue
    );

    function editorOptionDefaultValue(): string {
      const options: FBOption[] | undefined = formState?.getFieldValue(name, defaultValue);
      return _.join(_.map(options, "text"), "\n") || "";
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
          return formState.getFieldValue(name, defaultValue) || "";
        },
      };
      return (value[type || ""] || value.default)();
    }

    const child = _.first(React.Children.toArray(children));
    const isClone = !_.includes(OmitInputClones, type) && !_.isUndefined(child);

    if (isClone) {
      children = React.cloneElement(child as React.ReactElement, {
        disabled,
        onChange,
        value,
        ...(type !== "datepicker" && type !== "autocomplete" && !_.isBoolean(defaultValue) && { defaultValue }),
        // ...(type === "datepicker" && { value: inputState?.value }),
      });
    }

    React.useEffect(() => {
      // Input states
      inputState && formState && formState.inputState.set(name, inputState);
      // Validation settings
      if (formState && name) {
        const validationAttrName =
          intl.formatMessage({ id: (label || "translation.empty") as string }) ||
          intl.formatMessage({ id: placeholder || "translation.empty" }) ||
          name;
        formState?.setValidationAttributeName(name, validationAttrName);
        rules && (formState.setFieldRules(name, rules));
      }
    }, []);

    return Component({
      ...(props as T),
      includeContext: inputState?.includeContext,
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
    });
  };

  return withFBOnChange((props: T) => Comp(props));
};
