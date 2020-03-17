import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBApprovalFieldProps, FBApprovalFieldState, FBApprovalStatus } from ".";
import { FB } from "..";
import { store } from "../../../state/store";
import FBStore from "../stores/ui/FBStore";

export const withFBApprovalField = <T extends FBApprovalFieldProps>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    canApprove,
    onClick,
    name,
    currentUser = store.getState().auth.user,
    approvalFieldState,
    hasApproved,
    approverStatus,
    ...props
  }: T) => {

    approvalFieldState = FB.useRef<FBApprovalFieldState>(FBApprovalFieldState);

    approverStatus = (email: string | undefined): string => {
      if (!email || !_.includes(approvalFieldState?.hasApproved, email)) {
        return FBApprovalStatus.Pending;
      }
      return FBApprovalStatus.Approved;
    };

    canApprove = (email: string | undefined): boolean => {
      if (!email) {
        return false;
      }
      return (
        email === currentUser?.email &&
        approverStatus!(email) !== FBApprovalStatus.Approved
      );
    };

    onClick = () => {
      approvalFieldState?.addApprover(currentUser.email);
    };

    React.useEffect(() => {
      if (!name) {
        return;
      }
      const hasApproved = FBStore.getValue(name) as string[] || [];
      approvalFieldState?.setApprovers(hasApproved);
    }, []);

    useObserver(() => {
      hasApproved = approvalFieldState?.hasApproved;
    });

    return Component({
      ...(props as T),
      approvalFieldState,
      approverStatus,
      currentUser,
      canApprove,
      onClick,
      name,
    });
  };

  return (props: T) => Comp(props);
};
