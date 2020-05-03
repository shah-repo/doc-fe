import { debounce } from "lodash";
import React, { useEffect } from "react";
import { FB } from "..";
import FBPOApprovalMatrixState from "./FBPOApprovalMatrix.state";
import { FBPOApprovalMatrixFieldProps } from "./FBPOApprovalMatrix.types";

export const withFBPOApprovalMatrix = <T extends FBPOApprovalMatrixFieldProps>(
  Component: React.FunctionComponent<T>
) => {
  const debounced = debounce((f) => {
    f();
  }, 300);
  const Comp = ({
    poamState,
    name = "",
    ...props
  }: T) => {

    poamState = FB.useRef<FBPOApprovalMatrixState>(FBPOApprovalMatrixState);

    useEffect(() => {
      debounced(() => {
        poamState.name = name;
        poamState.initialize();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name]);

    return Component({
      ...(props as T),
      poamState,
      name,
    });
  };

  return (props: T) => Comp(props);
};
