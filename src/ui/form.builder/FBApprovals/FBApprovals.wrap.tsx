import { reaction } from "mobx";
import React from "react";
import { FB, FBApprovalsState } from "..";
import { Approval } from "../../../state/ducks/common";
import { toastError } from "../../components/notifications";
import { FBApprovalsProps } from "./FBApprovals.types";

export const withFBApprovals = <T extends FBApprovalsProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleAdd,
    approvalsState,
    name,
    loading,
    disabled,
    ...props
  }: T) => {

    const { workspaceState, formState } = FB.useStores();
    const {
      document,
      id,
    } = workspaceState || {};
    approvalsState = FB.useRef(FBApprovalsState);
    disabled = loading || disabled;

    React.useEffect(() => {
      reaction(
        () => formState?.inputState.get(name || "")?.value,
        (data) => {
          if (!id) {
            toastError("Please save the document first.");
            return;
          } else {
          approvalsState?.addApproval({
            assigned: {
              id: data.id,
            },
            partOf: { id },
          } as Approval);
          }
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return Component({
      ...(props as T),
      handleAdd,
      approvalsState,
      approvals: document?.approvals,
      name,
      loading,
      disabled,
      formState,
      documentStatus: document?.status,
      docId: id,
    });
  };

  Comp.displayName = "withFBApprovals";
  return Comp;
};
