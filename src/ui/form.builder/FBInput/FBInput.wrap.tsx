/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import { first, get, includes, isBoolean, isEmpty, isEqual, isString, isUndefined } from "lodash";
import { reaction } from "mobx";
import React, { cloneElement, useEffect } from "react";
import { useIntl } from "react-intl";
import { FBOption } from "..";
import { useFormContext } from "../../components/forms/FormContext";
import { isTranslation } from "../../translations/types";
import { FBClasses } from "../defaults/layout";
import { withFBEditorOptions } from "../FBEditorOptions/FBEditorOptions.wrap";
import { FBInputProps, OmitInputClones } from "../FBInput";
import { FB } from "../helpers";
import { withFBOnChange } from "./FBInput.onchange";

export const withFBInput = <T extends FBInputProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    setTranform,
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
    autosave = false,
    transform,
    bookmarked,
    omitFinalValidation = false,
    applicableValidationSchema,
    validationAttribute,
    ...props
  }: T) => {

    const { formState, workspaceState, bookmarkState } = FB.useStores();
    const { isOutput } = workspaceState || {};
    const { submitForm } = useFormContext();
    const intl = useIntl();
    defaultValue = setDefaultValue();
    helperText = formState?.errors.get(name) || helperText;
    error = !isUndefined(formState?.errors.get(name)) && formState?.errorValidation;
    value = inputState?.value;
    includeContext = inputState?.includeContext;

    // Set validation scheme. This is union of scheme & comps configs.
    useEffect(() => {
      if (!applicableValidationSchema) { return; }
      workspaceState?.setValidationSchemaItem({ name, label, type, ...props });
    }, []);

    // TODO: Autocomplete default set as input
    // then this can be removed and handle through defaultValue
    const validationValue = get(formState?.values, name);

    if ((isOutput || formState?.workspaceMode !== "design") && formState?.workspaceMode !== "formPreview") {
      (isUndefined(hidden) && validationMode === "visibility") && (hidden =
        !helperText && (!validationValue || isEmpty(validationValue))
      );

      (!disabled && validationMode === "disabled") && (disabled =
        !helperText && (!validationValue || isEmpty(validationValue))
      );
    }

    function setDefaultValue(): any {
      if (!formState) { return; }
      const value = {
        editoroptions() {
          const options: FBOption[] | undefined = formState?.getFieldValue(name);
          if (isString(options)) {
            return;
          }
          const value = optionsToString?.(options);
          formState?.setFieldValue(name, value);
          return value;
        },
        autocompleteasync() { return; },
        autocomplete() { return; },
        datepicker() {
          return inputState && (inputState.value = formState.getFieldValue(name, ""));
        },
        default() {
          isString(defaultValue) && transform && (defaultValue = setTranform?.(defaultValue));
          return formState.getFieldValue(name, (isUndefined(defaultValue)) ? defaultChecked : defaultValue );
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
      children = cloneElement(child as React.ReactElement, {
        name,
        disabled,
        onChange,
        onBlur,
        value,
        ...(type === "textfield" && { error }),
        ...(type !== "datepicker" && type !== "autocomplete" && !isBoolean(defaultValue) && { defaultValue }),
        ...( workspaceState?.mode === "preview" && { className: FBClasses.inputPreview }),
      });
    }

    useEffect(() => {
      if (!formState && !inputState) { return; }
      // Input states
      formState!.inputState.set(name, inputState!);

      // Validation settings
      let attr = (label as string) || placeholder || validationAttribute || name;
      isTranslation(attr) && (attr = intl.formatMessage({ id: attr }));
      formState?.setValidationAttributeName(name, attr);
      rules && (formState!.setFieldRules(name, rules));
    }, [rules]);

    useEffect(() => {
      reaction(
        () => inputState?.autosaveNextValue,
        (value) => {
          if (autosave && !isEqual(inputState?.autosavePrevValue, value)) {
            submitForm();
          }
        }
      );
    }, []);

    useEffect(() => {
      if (!bookmarked) { return; }
      isTranslation(label as string) && (label = intl.formatMessage({ id: label as string }));
      bookmarkState?.addBookmark({ name, label });
    }, [bookmarked]);

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
      autosave,
      transform,
      bookmarked,
      applicableValidationSchema,
      validationAttribute,
    });
  };

  return withFBEditorOptions(withFBOnChange((props: T) => Comp(props)));
};
