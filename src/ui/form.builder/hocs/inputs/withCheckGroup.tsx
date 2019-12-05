import React from "react";
import { FBCheckGroupProps } from "../../types/inputs/check";
import { withOptions } from "../common/withOptions";

export const withCheckGroup = <T extends FBCheckGroupProps>(
  Component: React.FunctionComponent<T>,
) => {

  const component = ({
    optionLabelKey = "text",
    optionValueKey = "value",
    controls,
    ...props
  }: T) => {

    return Component({
      ...(props as T),
      optionLabelKey,
      optionValueKey,
      controls,
    });
  };

  return withOptions((props: T) => component(props));
};
