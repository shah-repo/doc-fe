import { map } from "lodash";
import React from "react";
import { FBValidationModeOption, FBValidationModeProps } from ".";

export const withFBValidationMode = <T extends FBValidationModeProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    options,
    ...props
  }: T) => {

    options = map(FBValidationModeOption, (text, value) => ({ text, value }));

    return Component({
      ...(props as T),
      options,
    });
  };

  return (props: T) => Comp(props);
};
