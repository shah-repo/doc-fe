import { omit } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBSchemaProps, FBSchemaSelectProps, FBSchemaSelectState, FBSchemeMultuValueTypes } from "..";

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
    defaultValue = formState?.getFieldValue(name);

    function getOptions(): FBSchemaProps[] {
      const scheme: FBSchemaProps[] = workspaceState?.getValidationSchema() || workspaceState?.getSchema();
      const options = scheme.reduce((reduced: FBSchemaProps[], item) => {
        const { type, deleted, multiple } = item || {};
        if (!type || deleted) { return reduced; }

        // Use only multi value fields for required if in validator
        if (name === "validators.required_if_in.name") {
          if (multiple || FBSchemeMultuValueTypes.includes(type)) {
            reduced.push(item);
          }
          return reduced;
        }
        // Use only sigle value fields for required if validator
        if (name === "validators.required_if.name") {
          if (!multiple && !FBSchemeMultuValueTypes.includes(type)) {
            reduced.push(item);
          }
          return reduced;
        }
        reduced.push(item);
        return reduced;
      }, []);
      return options;
    }

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
      options: getOptions(),
      disabled,
      schema,
      index,
      name,
    });
  };


  return (props: T) => Comp(props);
};
