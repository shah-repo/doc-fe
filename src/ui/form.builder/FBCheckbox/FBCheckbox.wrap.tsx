import { isUndefined } from "lodash";
import React from "react";
import { FBInputProps } from "..";
import { FB } from "../helpers";

export const withFBCheckbox = <T extends FBInputProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    name = "",
    defaultChecked,
    ...props
  }: T) => {

    const { formState } = FB.useStores();
    isUndefined(defaultChecked) && (defaultChecked = formState?.getFieldValue(name));

    return Component({
      ...(props as T),
      defaultChecked,
      name,
    });
  };

  return (props: T) => Comp(props);
};
