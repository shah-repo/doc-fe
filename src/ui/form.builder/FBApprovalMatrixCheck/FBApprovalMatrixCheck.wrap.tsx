import { useObserver } from "mobx-react";
import React from "react";
import { FBApprovalMatrixCheckProps, FBApprovalMatrixCheckState } from "..";
import { FB } from "../helpers";

export const withFBApprovalMatrixCheck = <T extends FBApprovalMatrixCheckProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleCheck,
    approvalMatrixCheckState,
    checked,
    name,
    ...props
  }: T) => {

    const { formState } = FB.useStores();
    approvalMatrixCheckState = FB.useRef<FBApprovalMatrixCheckState>(FBApprovalMatrixCheckState, checked);

    handleCheck = () => {
      approvalMatrixCheckState?.toggle();
      formState?.setFieldValue(name, approvalMatrixCheckState?.checked);
    };

    useObserver(() => {
      checked = approvalMatrixCheckState?.checked;
    });

    return Component({
      ...(props as T),
      handleCheck,
      checked,
    });
  };

  return (props: T) => Comp(props);
};
