import React from "react";
import { FBInputProps } from "../../types/common";
import { withFormik } from "./withFormik";

export const withIndicator = <T extends FBInputProps>(
  Component: React.FunctionComponent<T>,
) => {
  const component = ({
    field,
    ...props
  }: T) => Component({
    ...(props as T),
    field,
  });

  return withFormik((props: T) => component(props));
};
