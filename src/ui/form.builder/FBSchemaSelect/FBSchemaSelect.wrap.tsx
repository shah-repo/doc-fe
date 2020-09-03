import { omit } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBSchemaSelectProps, FBSchemaSelectState } from ".";
import { FB, FBSchemaProps } from "..";

export const withFBSchemaSelect = <T extends FBSchemaSelectProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    options,
    optionValueKey = "name",
    optionLabelKey = "label",
    includeSelectedSchema = false,
    defaultValue,
    schemaSelectState,
    schema,
    onChange,
    name,
    disabled,
    index = 0,
    ...props
  }: T) => {
    const { workspaceState, schemaState, formState } = FB.useStores();
    schemaSelectState = FB.useRef<FBSchemaSelectState>(FBSchemaSelectState);
    options = workspaceState?.getSchema();
    defaultValue = formState?.getFieldValue(name);

    function setIncludedSchemaItem(value?: FBSchemaProps) {
      if (!value) {
        return;
      }
      const { type } = value;
      schemaState?.setSchemaItemAt({
        ...omit(value, ["validationMode"]),
        name: name?.replace("name", "value"),
        ...(type === "checkbox" && { defaultChecked: false }),
        ...(type === "radiogroup" && { type: "checkboxgroup" }),
        rules: `required_with:${name}`,
      }, index + 1);
    }

    function initialIncludedSchemaItem() {
      if (!includeSelectedSchema) {
        return;
      }
      const selectedSchemaItem = workspaceState?.getSchemaItem(defaultValue);
      selectedSchemaItem && setIncludedSchemaItem(selectedSchemaItem);
    }

    React.useEffect(() => {
      initialIncludedSchemaItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    onChange = (_ev: React.ChangeEvent<any> | any, value: FBSchemaProps) => {
      if (!includeSelectedSchema) {
        return;
      }
      setIncludedSchemaItem(value);
    };

    useObserver(() => {
      includeSelectedSchema && schemaSelectState && (schema = schemaSelectState.schema);
    });

    return Component({
      ...(props as T),
      onChange,
      includeSelectedSchema,
      optionLabelKey,
      optionValueKey,
      defaultValue,
      options,
      disabled,
      schema,
      index,
      name,
    });
  };


  return (props: T) => Comp(props);
};
