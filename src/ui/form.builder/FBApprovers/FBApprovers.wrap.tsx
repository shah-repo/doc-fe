import React from "react";
import { FBApproversProps } from "./FBApprovers.types";

export const withFBApprovers = <T extends FBApproversProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    name,
    ...props
  }: T) => Component({
    ...(props as T),
  });

  return (props: T) => Comp(props);
};
