/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import { first, get, includes, isArray, isBoolean, isEqual, isString, isUndefined, size } from "lodash";
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
    onChange,
    onBlur,
    inputState,
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
    withState,
    omitFormValue,
    showErrorMsg = true,
    deleted,
    isInputOwner,
    ...props
  }: T) => {

    const { formState, workspaceState, bookmarkState } = FB.useStores();
    const {
      isOutput,
      document,
      externalState: { auth: { user: { employeeId = "" } = {} } = {} } = {},
    } = workspaceState || {};
    const { submitForm } = useFormContext();
    const intl = useIntl();
    const initialValue = defaultValue;
    defaultValue = setDefaultValue();
    helperText = formState?.errors.get(name) || helperText;
    error = !isUndefined(formState?.errors.get(name)) && formState?.errorValidation && showErrorMsg;
    value = inputState?.value;
    includeContext = inputState?.includeContext;
    hidden = inputState?.hidden;
    const inputOwner = document?.inputOwners?.[name];
    isInputOwner = inputOwner === undefined ||
      inputOwner === employeeId;

    // Set validation scheme. This is union of scheme & comps configs.
    useEffect(() => {
      if (!applicableValidationSchema) { return; }
      workspaceState?.setValidationSchemaItem({ name, label, type, ...props });
    }, []);

    // TODO: Autocomplete default set as input
    // then this can be removed and handle through defaultValue
    const validationValue = get(formState?.validationValues, name);

    if ((isOutput || formState?.workspaceMode !== "design") && formState?.workspaceMode !== "formPreview") {
      const isUnderMode = (
        !helperText && (
          isUndefined(validationValue) ||
          validationValue === "" ||
          (isArray(validationValue) && size(validationValue) === 0)
        )
      );
      (isUndefined(hidden) && validationMode === "visibility") && (hidden = isUnderMode);
      (!disabled && validationMode === "disabled") && (disabled = isUnderMode);
    }

    function setDefaultValue(): any {
      if (!formState) { return; }
      const value = {
        editoroptions() {
          const options: FBOption[] | undefined = formState?.getFieldValue(name, undefined, omitFormValue);
          if (isString(options)) {
            return;
          }
          const value = optionsToString?.(options);
          formState?.setFieldValue(name, value, withState, omitFormValue);
          return value;
        },
        autocompleteasync() { return; },
        autocomplete() { return; },
        datepicker() {
          return inputState && (inputState.value = formState.getFieldValue(name, undefined, omitFormValue) || "");
        },
        default() {
          isString(initialValue) && transform && (defaultValue = setTranform?.(initialValue));
          return formState.getFieldValue(
            name,
            (isUndefined(defaultValue)) ? defaultChecked : defaultValue,
            omitFormValue
          );
        },
      };
      const transDefault = (value[type || ""] || value.default)();
      if (isTranslation(transDefault)) {
        return intl.formatMessage({ id: transDefault });
      }
      return transDefault;
    }

    const child = first(React.Children.toArray(children));
    const isClone = !includes(OmitInputClones, type) && !isUndefined(child) && !hidden;
    disabled = !isInputOwner || disabled;

    if (isClone) {
      children = cloneElement(child as React.ReactElement, {
        name,
        disabled,
        onChange,
        onBlur,
        ...(type !== "autocomplete" && { value }),
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
      if (!rules) { return; }
      formState!.setFieldRules(name, rules);
      if (!omitFinalValidation) {
        formState?.setFieldFinalValidationRules(name, rules);
      }
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
      onChange,
      onBlur,
      includeContext,
      isInputOwner,
      validationMode,
      helperText,
      children,
      disabled,
      defaultValue,
      type,
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
      showErrorMsg,
      withState,
      omitFormValue,
      deleted,
    });
  };

  return withFBEditorOptions(withFBOnChange((props: T) => Comp(props)));
};
