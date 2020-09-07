import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBEditorPropertiesType, FBInputProps, FBInputState, FBOptionValueType } from "..";

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
    ...props
  }: T) => {

    inputState = FB.useRef<FBInputState>(FBInputState);
    const { formState, schemaState, workspaceState } = FB.useStores();

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
      _.isString(formValue) && transform && (formValue = setTranform?.(formValue));
      // TODO: refactor with state opt
      formState?.setFieldValue(name, formValue, state || withState, forceDefault);
      if (type && !FBInputState.omitOnChange.includes(type)) {
        formState?.setFieldAutosave(name);
      }
    }

    function checkboxGroupValue(ev: React.ChangeEvent<HTMLInputElement>) {
      const [valueName, checked] = _.at(ev.target, ["value", "checked"]);
      const checkedValue = formState?.getFieldValue(name, []);
      const groupValue: string[] = checked
        ? _.union(checkedValue, [valueName])
        : _.remove(checkedValue, (cv) => cv !== valueName);

      contextValue(groupValue);
      setValue(groupValue);
    }

    function checkValue(ev: React.ChangeEvent<HTMLInputElement>) {
      const value = _.get(ev.target, "checked");
      contextValue(value);
      setValue(value);
    }

    function contextValue(value: boolean | string | string[] | undefined = "") {
      if (!editorProperties || _.isEmpty(editorProperties)) {
        return;
      }

      if (_.isString(value)) {
        value = (value as FBEditorPropertiesType) === "includeContext";
      }

      if (_.isArray(value)) {
        value = value.includes("includeContext");
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
          ? _.map(value, (v) => v[optionValueKey])
          : value[optionValueKey],
        id: () =>  multiple
          ? _.map(value, (v) => ({ [optionValueKey]: v[optionValueKey] }))
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
        contextValue(_.get(ev.target, "value"));
        isDefault();
      }

      function isDefault() {
        const { type } = ev.target;
        let { value } = ev.target;
        if (type === "number") {
          value = _.toNumber(value);
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
      props.onBlur && props.onBlur(ev);
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
      type,
      name,
    }));
  };

  return (props: T) => Comp(props);
};
