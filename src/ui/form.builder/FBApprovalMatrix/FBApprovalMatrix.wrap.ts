import { debounce } from "lodash";
import React, { useEffect } from "react";
import { FB } from "..";
import FBApprovalMatrixState from "./FBApprovalMatrix.state";
import { FBApprovalMatrixFieldProps } from "./FBApprovalMatrix.types";

export const withFBApprovalMatrix = <T extends FBApprovalMatrixFieldProps>(
  Component: React.FunctionComponent<T>
) => {

  const debounced = debounce((f) => {
    f();
  }, 300);
  const Comp = ({
    amState,
    name = "",
    ...props
  }: T) => {

    amState = FB.useRef<FBApprovalMatrixState>(FBApprovalMatrixState);

    useEffect(() => {
      debounced(() => {
        amState.name = name;
        amState.initialize();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name]);

    return Component({
      ...(props as T),
      amState,
      name,
    });
  };

  return (props: T) => Comp(props);
};
