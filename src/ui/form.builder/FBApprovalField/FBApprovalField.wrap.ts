import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBApprovalFieldIdentifier, FBApprovalFieldProps, FBApprovalFieldState, FBApprovalStatus } from ".";
import { FB } from "..";
import { store } from "../../../state/store";
import FBDRStore from "../stores/ui/FBDRStore";
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
    disabled = !FBDRStore.isOutput,
    ...props
  }: T) => {

    approvalFieldState = FB.useRef<FBApprovalFieldState>(FBApprovalFieldState);

    function groupCheck(group: string): boolean {
      const filteredGroup = _.filter(currentUser.groups, { id: group });
      return !_.isEmpty(filteredGroup);
    }

    approverStatus = (identifier: string | undefined): string => {
      if (!identifier || !_.includes(approvalFieldState?.hasApproved, identifier)) {
        return FBApprovalStatus.Pending;
      }
      return FBApprovalStatus.Approved;
    };

    canApprove = (identifier: string | undefined): boolean => {
      if (!identifier) {
        return false;
      }
      return (
        (identifier === currentUser?.email || groupCheck(identifier)) &&
        approverStatus!(identifier) !== FBApprovalStatus.Approved
      );
    };

    onClick = (identifierType: FBApprovalFieldIdentifier) => () => {
      if (identifierType === "approver") {
        approvalFieldState?.addApprover([currentUser.email]);
      } else {
        approvalFieldState?.addApprover(_.map(currentUser.groups, "id"));
      }
      name && FBStore.setValue(name, hasApproved);
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
      disabled,
      name,
    });
  };

  return (props: T) => Comp(props);
};
