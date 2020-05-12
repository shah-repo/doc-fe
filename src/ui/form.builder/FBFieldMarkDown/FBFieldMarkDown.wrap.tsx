import Base64 from "Base64";
import _ from "lodash";
import React from "react";
import { FBFieldMarkDownProps } from ".";
import FBStore from "../stores/ui/FBStore";

export const withFBFieldMarkDown = <T extends FBFieldMarkDownProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    index = 0,
    ...props
  }: T) => {

    const schemaItem = FBStore.getSchemaItem(index) || {};
    let { customValidator } = schemaItem;
    const { name } = schemaItem;
    customValidator = customValidator ? Base64.atob(customValidator.fn || "") : "";

    const template = _.template(`
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
      label: _.get(schemaItem, "label", ""),
      rules: _.get(schemaItem, "rules", ""),
      value: FBStore.getValues()[name || ""],
      customValidator,
    });

    return Component({
      ...(props as T),
      source,
    });
  };

  return (props: T) => Comp(props);
};
