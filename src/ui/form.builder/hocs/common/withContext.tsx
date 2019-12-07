import React from "react";
import { FBContextProps } from "../../types/common/context";

export const withContext = <T extends FBContextProps>(
  Component: React.FunctionComponent<T>,
) => {
  return ({
    showContext,
    setContext,
    includeContext,
    ...props
  }: T) => {

    [showContext, setContext] = React.useState<boolean>(false);

    return Component({
      ...(props as T),
      showContext: includeContext && showContext,
      setContext: includeContext && setContext,
      includeContext,
    });
  };
};
