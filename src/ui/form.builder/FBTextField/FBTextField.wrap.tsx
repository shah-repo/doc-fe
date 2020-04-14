import _ from "lodash";
import React from "react";
import { FBTextFieldProps } from "./FBTextField.types";

export const withFBTextField = <T extends FBTextFieldProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    multiline,
    rows = 1,
    ...props
  }: T) => {

    (_.isUndefined(multiline)) && (
      multiline = Boolean(rows && (rows as number) > 1)
    );

    return Component({
        ...(props as T),
        multiline,
        rows,
      });
  };
  return (props: T) => Comp(props);
};
