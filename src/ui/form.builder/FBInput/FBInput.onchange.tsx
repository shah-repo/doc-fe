import { at, cloneDeep, get, has, isArray, isEmpty, isObject, isString, map, remove, toNumber, union } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBEditorPropertiesType, FBInputProps, FBInputState, FBOptionValueType } from "..";
import { FBFieldName } from "../helpers/FBFieldName";

export const withFBOnChange = <T extends FBInputProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    setTranform,
    type,
    name,
    editorProperties,
    forceDefault,
    inputState,
    transform,
    withState,
    omitFormValue,
    hidden,
    ...props
  }: T) => {

    const { formState, schemaState, workspaceState } = FB.useStores();
    const inputValue =
      formState?.getFieldValue(name) ||
      formState?.getInputState(name || "")?.value;

    inputState = FB.useRef<FBInputState>(FBInputState, {
      value: cloneDeep(inputValue),
      hidden,
    });

    React.useEffect(() => {
      const defaultValue = formState?.getFieldValue(name);
      // Check include context state
      contextValue(defaultValue as string | string[] | boolean);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    setTranform = (value: string): string => {
      // In case we want to update transform type
      switch (transform) {
        case "upper":
          return value.toUpperCase();
        default:
          return value.toLowerCase();
      }
    };

    function setValue(formValue: any, state = false, forceDefault = false) {
      if (!name) { return; }
      isString(formValue) && transform && (formValue = setTranform?.(formValue));
      // TODO: refactor with state opt
      formState?.setFieldValue(name, formValue, state || withState, omitFormValue);
      if (type && !FBInputState.omitOnChange.includes(type)) {
        formState?.setFieldAutosave(name);
      }
      if (formState?.validationRelatedRules[name]) {
        map(formState?.validationRelatedRules[name], (field) => {
          const { name: fieldName, value: fieldValue } = field;
          if (formValue !== fieldValue) {
            formState.omitFieldValue((fieldName || ""));
            formState.errors.set(fieldName, "");
          }
        });
      }
    }

    function checkboxGroupValue(ev: React.ChangeEvent<HTMLInputElement>) {
      const [valueName, checked] = at(ev.target, ["value", "checked"]);
      const checkedValue = formState?.getFieldValue(name, []);
      const groupValue: string[] = checked
        ? union(checkedValue, [valueName])
        : remove(checkedValue, (cv) => cv !== valueName);

      contextValue(groupValue);
      setValue(groupValue);
    }

    function checkValue(ev: React.ChangeEvent<HTMLInputElement>) {
      const value = get(ev.target, "checked");
      contextValue(value);
      setValue(value);
    }

    function contextValue(value: boolean | string | string[] | undefined = "") {
      if (!editorProperties || isEmpty(editorProperties)) {
        return;
      }

      if (isString(value)) {
        value = (value as FBEditorPropertiesType) === "includeContext";
      }

      if (isArray(value)) {
        value = value.includes("includeContext");
      }

      if (isObject(value)) {
        value = has(value, "includeContext");
      }
      if (!value) {
        formState?.omitFieldValue(`${FBFieldName.Context}-${name}`);
      }
      inputState?.setIncludeContext(value);
    }

    function autocompleteValue(value: any) {
      const { optionValueType = "key", optionValueKey = "id", multiple } = props;
      if (!value) {
        return setValue(multiple ? [] : "");
      }
      const simpleValue: Record<FBOptionValueType, () => any> = {
        object: () => value,
        key: () => multiple
          ? map(value, (v) => v[optionValueKey])
          : value[optionValueKey],
        id: () =>  multiple
          ? map(value, (v) => ({ [optionValueKey]: v[optionValueKey] }))
          : { [optionValueKey]: value[optionValueKey] },
      };
      setValue(simpleValue[optionValueType](), false, forceDefault);
    }

    function stringValue(value: string) {
      setValue(value);
    }

    function dateValue(value: string) {
      stringValue((value as unknown as Date).toISOString());
      inputState && inputState.setValue(value);
    }

    const onChange = ((ev: React.ChangeEvent<any> | any, value: any) => {
      if (!formState) {
        return;
      }
      // TODO: Remove this. Check how to handle validator required with without double onchange
      props.onChange && props.onChange(ev, value, schemaState || formState || workspaceState);
      function isSingleCheck() {
        return checkValue(ev);
      }

      function isGroupCheck() {
        contextValue(get(ev.target, "value"));
        isDefault();
      }

      function isDefault() {
        const { type } = ev.target;
        let { value } = ev.target;
        if (type === "number") {
          value = toNumber(value);
        }
        setValue(value);
      }

      const changedValue = {
        checkboxgroup() { return checkboxGroupValue(ev); },
        checkbox() { return isSingleCheck(); },
        radio() { return isSingleCheck(); },
        autocomplete() { return autocompleteValue(value); },
        texteditor() { return; },
        datepicker() { return dateValue(ev as string); },
        radiogroup() { return isGroupCheck(); },
        select() { return isGroupCheck(); },
        default() { return isDefault(); },
      };

      (changedValue[type || ""] || changedValue.default)();
      props.onChange && props.onChange(ev, value, schemaState || formState || workspaceState);
      formState.validate();
    });

    const onBlur = (ev) => {
      if (ev.target.type === "number" && ev.target.step === ".01") {
        ev.target.value = Math.abs(ev.target.value).toFixed(2).toString();
      }
      props.onBlur && props.onBlur(ev);
      if (!name) { return; }
      const lockData = formState?.locked.get(name);
      formState?.expireLockedFields(lockData?.lockId);
      if (type && FBInputState.omitOnChange.includes(type)) {
        formState?.setFieldAutosave(name);
      }
    };

    return useObserver(() => Component({
      ...(props as T),
      onChange,
      onBlur,
      setTranform,
      editorProperties,
      forceDefault,
      inputState,
      transform,
      withState,
      omitFormValue,
      type,
      name,
      hidden,
    }));
  };

  return (props: T) => Comp(props);
};
