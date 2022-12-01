/* eslint-disable react-hooks/exhaustive-deps */
import { Dictionary, find, first, get, includes, isArray, isBoolean, isEmpty, isEqual, isString, isUndefined, last, map, size, union, uniqWith } from "lodash";
import { autorun, reaction } from "mobx";
import { useLocalStore } from "mobx-react";
import React, { cloneElement, useEffect } from "react";
import { useIntl } from "react-intl";
import { FB, FBAutosave, FBInputProps, FBInputType, FBLHRBuildOptions, FBOption, OmitInputClones } from "..";
import { useFormContext } from "../../components/forms/FormContext";
import { isTranslation } from "../../translations/types";
import { FBClasses } from "../defaults/layout";
import { withFBEditorOptions } from "../FBEditorOptions/FBEditorOptions.wrap";
import { withFBOnChange } from "./FBInput.onchange";

// Initial values only some of the fields have
export const INDIVIDUAL_INITIAL_VALUES = {
  placeholder: "",
  options: [],
  actions: [],
  paragraph: "",
};

// Initial values all the fields share
export const COMMON_INITIAL_VALUES = {
  formValuesRules: {},
  hidden: false,
  outputDisabled: false,
  rulesObject: {},
  deleted: false,
  deleteInFormDisabled: false,
  validationMode: "default",
  validationAttribute: "",
  rules: "",
  applicableOn: [],
  applicableValidationSchema: true,
  editorProperties: [],
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
    lockOwnerName,
    includeNotes,
    ...props
  }: T) => {
    const { formState, workspaceState, bookmarkState, schemaState } = FB.useStores();
    const { isOutput, isChangeRequest } = workspaceState || {};
    const { submitForm } = useFormContext();
    const intl = useIntl();
    const initialValue = defaultValue;
    let showValidationField;
    let isFieldUnderValidation;
    const { email: ownerName } = workspaceState?.document?.owner?.user || {};

    const feedbackDetails = useLocalStore(() => ({
      error, helperText,
    }));

    useEffect(() => {
      includeNotes =
      (includeNotes || editorProperties?.includes("includeNotes")) &&
      isOutput &&
      type !== "blanktplform" &&
      !workspaceState?.isLHRProductionBuild;
      inputState?.setIncludeNotes(includeNotes || false);
    }, []);

    useEffect(() => {
      const disposeAutorun = autorun(() => {
        const errorName = formState?.errors.get(name) || helperText;
        feedbackDetails.error = formState?.errorValidation && showErrorMsg && !isUndefined(errorName);
        feedbackDetails.helperText = errorName;
      });
      return disposeAutorun;
    }, []);

    value = inputState?.value;
    includeContext = inputState?.includeContext;
    hidden = inputState?.hidden;
    isInputOwner = workspaceState?.getIsInputOwner(name);

    const setSpecificDefaultValue = (
      initialValues: Dictionary<any> | null,
      property: string,
    ) => {
      // This sets individual default values for the specific fields
      if (!initialValues || isEmpty(initialValues)) {
        return;
      }
      if (get(initialValues, property)) {
        return;
      }
      formState?.setFieldValue(property, get(INDIVIDUAL_INITIAL_VALUES, property), withState, omitFormValue);
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
        const { value = "" } = rule || {};
        const fieldName: string = first(value.split(",")) || "";
        const fieldValue = last(value.split(","));

        if (!fieldName || !formState) {
          return;
        }

        const validationRules = formState.validationRelatedRules[fieldName] || [];

        formState.validationRelatedRules[fieldName] = uniqWith(
          union([{ name, value: fieldValue }], validationRules),
          isEqual
        );

        isFieldUnderValidation = formState.validationRelatedRules[fieldName]?.some((data) => data.name === name);

        let convertedFieldValue;
        try {
          convertedFieldValue = JSON.parse(fieldValue as string);
        } catch (error) {
          convertedFieldValue = fieldValue;
        }

        if (typeof convertedFieldValue === "string") {
          showValidationField = formState?.getFieldValue(fieldName) === fieldValue;
        } else if (typeof convertedFieldValue === "object") {
          for (const [, fieldValueEntry] of Object.entries(convertedFieldValue)) {
            if (Array.isArray(formState?.getFieldValue(fieldName)) &&
            formState?.getFieldValue(fieldName).includes(fieldValueEntry)) {
              showValidationField = true;
            }
          }
        }
      });
    }

    if (isChangeRequest || isOutput || formState?.shouldValidate) {
      let isUnderMode = (
        !feedbackDetails.helperText && (
          isUndefined(validationValue) ||
          validationValue === "" ||
          (isArray(validationValue) && size(validationValue) === 0)
        )
      );

      if (validationMode === "visibility") {
        if (isFieldUnderValidation) {
          isUnderMode = !showValidationField;
        }
        hidden = isUnderMode;

        if (isUnderMode) {
          workspaceState?.addHiddenFieldByRules(name);
        } else {
          workspaceState?.deleteHiddenFieldByRules(name);
        }
      }
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

      (name === "placeholder") && setSpecificDefaultValue(formState.initialValues, "placeholder");
      (name === "options") && setSpecificDefaultValue(formState.initialValues, "options");
      (name === "actions") && setSpecificDefaultValue(formState.initialValues, "actions");
      (name === "paragraph") && setSpecificDefaultValue(formState.initialValues, "paragraph");

      if (isTranslation(transDefault)) {
        return intl.formatMessage({ id: transDefault });
      }
      return transDefault;
    }

    const child = first(React.Children.toArray(children));
    const isClone = !includes(OmitInputClones, type) && !isUndefined(child) && !hidden;
    disabled = (!FB.isConsideredEmptyInput(workspaceState?.document?.formInput?.[name]) && !isInputOwner) || disabled;

    // Locked state
    const lockedData = formState?.locked.get(name);
    lockOwnerName = lockedData?.ownerName;
    if (lockOwnerName && (ownerName !== lockOwnerName)) {
      disabled = disabled || lockedData?.locked || formState?.isBackdropOpen;
    }

    if (isClone) {
      children = cloneElement(child as React.ReactElement, {
        name,
        disabled,
        onChange,
        ...(type !== "textfield" && { onBlur }),
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
      formState?.inputState.set(name, inputState!);

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

            if (workspaceState.isChangeRequest) {
              submitForm();
              return;
            }

            if (type && FBAutosave.includes(type)) {
              workspaceState.saveDocRev(formState?.getValues());
            } else {
              submitForm();
            }
          }
        }
      );
    }, []);

    useEffect(() => {
      if (!bookmarked) { return; }
      isTranslation(label as string) && (label = intl.formatMessage({ id: label as string }));
      const schemaItem = find(
        workspaceState?.schema,
        (schemaItem) => !!(schemaItem.name && name?.includes(schemaItem.name))
      );

      if (schemaItem) {
        bookmarkState?.addBookmark({ name, label, tabId: schemaItem.tabId });
      }
    }, [bookmarked]);

    useEffect(() => {
      const lhrBuilds = workspaceState?.getItemsByType("lhrbuild");
      map(lhrBuilds, (item) => {
        reaction(
          () => workspaceState?.formInputSync.get(item.name || ""),
          (value) => {
            if (!includeNotes) {
              inputState?.setIncludeNotes(false);
              return;
            }
            inputState?.setIncludeNotes(value === FBLHRBuildOptions["R&D"]);
          },
          { fireImmediately: true }
        );
      });
    }, []);

    useEffect(() => {
      formState?.validate();
    }, [formState]);

    return Component({
      ...(props as T),
      onChange,
      onBlur,
      formState,
      includeContext,
      isInputOwner,
      validationMode,
      helperText: feedbackDetails.helperText,
      children,
      disabled,
      defaultValue,
      type,
      name,
      error: feedbackDetails.error,
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
      lockOwnerName,
      includeNotes,
    });
  };

  return withFBEditorOptions(withFBOnChange((props: T) => Comp(props)));
};
