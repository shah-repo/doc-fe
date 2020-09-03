import Base64 from "Base64";
import { get, template as lodashTemplate } from "lodash";
import React from "react";
import { FBFieldMarkDownProps } from ".";
import { FB } from "..";

export const withFBFieldMarkDown = <T extends FBFieldMarkDownProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    index = 0,
    ...props
  }: T) => {

    const { workspaceState, formState } = FB.useStores();
    const schemaItem = workspaceState?.getSchemaItemAt(index) || {};

    let { customValidator } = schemaItem;
    const { name } = schemaItem;
    customValidator = customValidator ? Base64.atob(customValidator.fn || "") : "";

    const template = lodashTemplate(`
      <%= label %>
      ========================
      - type:  <%= type %>
      - name:  <%= name %>
      - rules:  <%= rules %>
      - value:  <%= value %>
      <%= customValidator %>
    `);

    const source = template({
      ...schemaItem,
      label: get(schemaItem, "label") || "",
      rules: get(schemaItem, "rules", ""),
      value: formState?.getFieldValue(name, ""),
      customValidator,
    });

    return Component({
      ...(props as T),
      source,
    });
  };

  return (props: T) => Comp(props);
};
