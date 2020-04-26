import React from "react";
import { FBInputProps } from "..";
import { FB } from "../helpers";

export const withFBCheckbox = <T extends FBInputProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    name = "",
    ...props
  }: T) => {

    const { formState } = FB.useStores();
    const formValue = formState?.getFieldValue(name, false);

    return Component({
      ...(props as T),
      defaultChecked: formValue,
      name,
    });
  };

  return (props: T) => Comp(props);
};
