import { get, template as lodashTemplate } from 'lodash';
import React from 'react';
import { FB, FBFieldMarkDownProps } from '..';

export const withFBFieldMarkDown = <T extends FBFieldMarkDownProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    index = 0,
    ...props
  }: T) => {

    const { workspaceState, formState } = FB.useStores();
    const schemaItem = workspaceState?.getSchemaItemAt(index) || {};

    const { name } = schemaItem;

    const template = lodashTemplate(`
      <%= label %>
      ========================
      - type:  <%= type %>
      - name:  <%= name %>
      - rules:  <%= rules %>
      - value:  <%= value %>
    `);

    const source = template({
      ...schemaItem,
      label: get(schemaItem, 'label') || '',
      rules: get(schemaItem, 'rules', ''),
      value: formState?.getFieldValue(name, ''),
    });

    return Component({
      ...(props as T),
      source,
    });
  };

  return (props: T) => Comp(props);
};
