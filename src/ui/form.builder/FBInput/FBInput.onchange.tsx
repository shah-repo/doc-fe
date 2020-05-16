import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBEditorPropertiesType, FBInputProps, FBInputState } from "..";

export const withFBOnChange = <T extends FBInputProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    type,
    name,
    editorProperties,
    inputState,
    ...props
  }: T) => {

    inputState = FB.useRef<FBInputState>(FBInputState);
    const { formState, schemaState, workspaceState } = FB.useStores();

    React.useEffect(() => {
      const defaultValue = formState?.getFieldValue(name);
      // Check include context state
      contextValue(defaultValue as string | string[] | boolean);
    }, []);

    function checkboxGroupValue(ev: React.ChangeEvent<HTMLInputElement>) {
      const [valueName, checked] = _.at(ev.target, ["value", "checked"]);
      const checkedValue = formState?.getFieldValue(name, []);
      const groupValue: string[] = checked
        ? _.union(checkedValue, [valueName])
        : _.remove(checkedValue, (cv) => cv !== valueName);

      contextValue(groupValue);
      formState?.setFieldValue(name, groupValue);
    }

    function checkValue(ev: React.ChangeEvent<HTMLInputElement>) {
      const value = _.get(ev.target, "checked");
      contextValue(value);
      if (!value) {
        return formState?.omitFieldValue(name);
      }
      formState?.setFieldValue(name, value);
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
      if (!value) {
        return formState?.omitFieldValue(name);
      }
      const { optionValueType, optionValueKey, multiple } = props;
      if (optionValueType === "key") {
        value = multiple
          ? _.map(value, (v) => v[optionValueKey])
          : value[optionValueKey];
      }
      formState?.setFieldValue(name, value);
    }

    function stringValue(value: string) {
      formState?.setFieldValue(name, value);
    }

    function dateValue(value: string) {
      stringValue((value as unknown as Date).toISOString());
      inputState && inputState.setValue(value);
    }

    const onChange = ((ev: React.ChangeEvent<any> | any, value: any) => {
      if (!formState) {
        return;
      }
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
        formState?.setFieldValue(name, value);
      }

      const changedValue = {
        checkboxgroup() { return checkboxGroupValue(ev); },
        checkbox() { return isSingleCheck(); },
        radio() { return isSingleCheck(); },
        autocomplete() { return autocompleteValue(value); },
        texteditor() { return stringValue(ev as string); },
        datepicker() { return dateValue(ev as string); },
        radiogroup() { return isGroupCheck(); },
        select() { return isGroupCheck(); },
        default() { return isDefault(); },
      };

      (changedValue[type || ""] || changedValue.default)();
      props.onChange && props.onChange(ev, value, schemaState || formState || workspaceState);
      formState.validate();
    });

    return useObserver(() => Component({
      ...(props as T),
      onChange,
      editorProperties,
      inputState,
      type,
      name,
    }));
  };

  return (props: T) => Comp(props);
};
