/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import { Dictionary, first, get, includes, isArray, isBoolean, isEmpty, isEqual, isString, isUndefined, last, map, size, union } from "lodash";
import { reaction } from "mobx";
import React, { cloneElement, useEffect } from "react";
import { useIntl } from "react-intl";
import { FB, FBInputProps, FBInputType, FBOption, OmitInputClones } from "..";
import { useFormContext } from "../../components/forms/FormContext";
import { isTranslation } from "../../translations/types";
import { FBClasses } from "../defaults/layout";
import { withFBEditorOptions } from "../FBEditorOptions/FBEditorOptions.wrap";
import { withFBOnChange } from "./FBInput.onchange";

export const INITIAL_VALUES = {
  placeholder: "",
  editorProperties: [],
  options: [],
  actions: [],
  // common
  formValuesRules: {},
  hidden: false,
  outputDisabled: false,
  rulesObject: {},
  deleted: false,
  deleteInFormDisabled: false,
  validationMode: "default",
  validationAttribute: "",
  sampleItemsIndicator: {
    enabled: false,
    id: "",
    sampleSection: false,
    serialNumber: 0,
  },
  rules: "",
};

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
    locked,
    lockOwnerName,
    ...props
  }: T) => {

    const { formState, workspaceState, bookmarkState, schemaState } = FB.useStores();
    const { isOutput } = workspaceState || {};
    const { submitForm } = useFormContext();
    const intl = useIntl();
    const initialValue = defaultValue;
    const { email: ownerName } = workspaceState?.document?.owner?.user || {};
    const isDesignMode = workspaceState?.isMode("design") || workspaceState?.isMode("formDesign");

    helperText = formState?.errors.get(name) || helperText;
    error = !isUndefined(formState?.errors.get(name)) && formState?.errorValidation && showErrorMsg;
    value = inputState?.value;
    includeContext = inputState?.includeContext;
    hidden = inputState?.hidden;
    isInputOwner = workspaceState?.getIsInputOwner(name);

    const setCommonDefaultValues = (initialValues: Dictionary<any> | null) => {
      // This are shared default values for all of the fields
      if (!initialValues || isEmpty(initialValues)) {
        return;
      }
      const {
        hidden,
        formValuesRules,
        outputDisabled,
        rulesObject,
        deleted,
        deleteInFormDisabled,
        validationMode,
        sampleItemsIndicator,
        validationAttribute,
        rules,
      } = initialValues || {};

      if (!hidden) {
        formState?.setFieldValue("hidden", INITIAL_VALUES.hidden, withState, omitFormValue);
      }
      if (!formValuesRules) {
        formState?.setFieldValue("formValuesRules", INITIAL_VALUES.formValuesRules, withState, omitFormValue);
      }
      if (!outputDisabled) {
        formState?.setFieldValue("outputDisabled", INITIAL_VALUES.outputDisabled, withState, omitFormValue);
      }
      if (!rulesObject) {
        formState?.setFieldValue("rulesObject", INITIAL_VALUES.rulesObject, withState, omitFormValue);
      }
      if (!deleted) {
        formState?.setFieldValue("deleted", INITIAL_VALUES.deleted, withState, omitFormValue);
      }
      if (!deleteInFormDisabled) {
        formState?.setFieldValue("deleteInFormDisabled", INITIAL_VALUES.deleteInFormDisabled, withState, omitFormValue);
      }
      if (!validationMode) {
        formState?.setFieldValue("validationMode", INITIAL_VALUES.validationMode, withState, omitFormValue);
      }
      if (!sampleItemsIndicator) {
        formState?.setFieldValue("sampleItemsIndicator", INITIAL_VALUES.sampleItemsIndicator, withState, omitFormValue);
      }
      if (!validationAttribute) {
        formState?.setFieldValue("validationAttribute", INITIAL_VALUES.validationAttribute, withState, omitFormValue);
      }
      if (!rules) {
        formState?.setFieldValue("rules", INITIAL_VALUES.rules, withState, omitFormValue);
      }
    };

    const setSpecificDefaultValue = (
      initialValues: Dictionary<any> | null,
      property: string,
    ) => {
      if (!initialValues || isEmpty(initialValues)) {
        return;
      }
      if (get(initialValues, property)) {
        return;
      }
      formState?.setFieldValue(property, get(INITIAL_VALUES, property), withState, omitFormValue);
    };

    defaultValue = setDefaultValue();

    // Set validation scheme. This is union of scheme & comps configs.
    useEffect(() => {
      if (!applicableValidationSchema) { return; }
      schemaState?.setValidationSchemaItem({ name, label, type, ...props });
    }, []);

    // TODO: Autocomplete default set as input
    // then this can be removed and handle through defaultValue
    const validationValue = get(formState?.validationValues, name);

    if (validationMode === "visibility" || validationMode === "disabled") {
      map(get(formState?.validatorRules, name), (rule) => {
        if (!formState) { return; }
        const { value = "" } = rule || {};
        const fieldName: string = first(value.split(",")) || "";
        const fieldValue = last(value.split(","));
        const validationRules = formState.validationRelatedRules[fieldName] || [];
        formState.validationRelatedRules[fieldName] = union([{ name, value: fieldValue }], validationRules);
      });
    }

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
      isDesignMode && setCommonDefaultValues(formState.initialValues);

      (name === "editorProperties") && setSpecificDefaultValue(formState.initialValues, "editorProperties");
      (name === "placeholder") && setSpecificDefaultValue(formState.initialValues, "placeholder");
      (name === "options") && setSpecificDefaultValue(formState.initialValues, "options");
      (name === "actions") && setSpecificDefaultValue(formState.initialValues, "actions");

      if (isTranslation(transDefault)) {
        return intl.formatMessage({ id: transDefault });
      }
      return transDefault;
    }

    const child = first(React.Children.toArray(children));
    const isClone = !includes(OmitInputClones, type) && !isUndefined(child) && !hidden;
    disabled = (!FB.isConsideredEmptyInput(workspaceState?.document?.formInput?.[name]) && !isInputOwner) || disabled;

    // Locked state
    locked = formState?.locked.get(name)?.locked;
    lockOwnerName = formState?.locked.get(name)?.ownerName;
    if (ownerName !== lockOwnerName) {
      disabled = disabled || locked;
    }

    if (isClone) {
      children = cloneElement(child as React.ReactElement, {
        name,
        disabled,
        onChange,
        onBlur,
        locked,
        ...(withState && type !== "autocomplete" && { value }),
        ...(type === "textfield" && { error }),
        ...(type !== "datepicker" && type !== "autocomplete" && !isBoolean(defaultValue) && { defaultValue }),
        ...(workspaceState?.mode === "preview"
            && name !== "password"
            && formState?.workspaceMode !== "form"
            && { className: FBClasses.inputPreview }),
        ...(!isInputOwner && { className: FBClasses.nonOwner }),
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
          if (!workspaceState?.autosave) {
            return;
          }
          if (autosave && !isEqual(inputState?.autosavePrevValue, value)) {
            if (type === "poreceive" || (type === "autocomplete" && name === "lot_part")) {
              submitForm({
                type: type as FBInputType,
                name,
                prevValue: inputState?.autosavePrevValue,
                nextValue: value,
              });
              return;
            }
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
      isOutput,
      locked,
      lockOwnerName,
    });
  };

  return withFBEditorOptions(withFBOnChange((props: T) => Comp(props)));
};
