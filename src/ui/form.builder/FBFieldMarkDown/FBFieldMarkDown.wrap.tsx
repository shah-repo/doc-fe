import { get, template as lodashTemplate } from 'lodash';
import React from 'react';
import { FB, FBFieldMarkDownProps } from '..';

const TEMPLATE = `<%= label %>
========================
- type:  <%= type %>
- name:  <%= name %>
- rules:  <%= rules %>
- value:  <%= value %>
`;

export const withFBFieldMarkDown = <T extends FBFieldMarkDownProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    inputProps = {},
    ...props
  }: T) => {
    const { formState } = FB.useStores();

    const { name = '' } = inputProps;

    const template = lodashTemplate(TEMPLATE);

    const source = template({
      ...inputProps,
      label: get(inputProps, 'label', ''),
      rules: get(inputProps, 'rules', '') as unknown,
      value: JSON.stringify(formState?.getFieldValue(name, ''), null, '  '),
    });

    return Component({
      ...(props as T),
      source,
    });
  };

  return (props: T) => Comp(props);
};
