import React from "react";
import { FBCheckGroupProps } from "../../types/inputs/check";
import { withOptions } from "../common/withOptions";

export const withCheckGroup = <T extends FBCheckGroupProps>(
  Component: React.FunctionComponent<T>,
) => {

  const component = ({
    optionLabelKey = "text",
    optionValueKey = "value",
    ...props
  }: T) => {

    return Component({
      ...(props as T),
      optionLabelKey,
      optionValueKey,
    });
  };

  return withOptions((props: T) => component(props));
};
