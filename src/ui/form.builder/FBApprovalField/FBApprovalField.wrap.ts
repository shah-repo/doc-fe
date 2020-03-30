import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBApprovalFieldIdentifier, FBApprovalFieldProps, FBApprovalFieldState, FBApprovalStatus, FBApprovedFieldValue } from ".";
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
    approverStatusInfo,
    disabled = !FBDRStore.isOutput,
    approverIsVisible,
    isBlocked = true,
    ...props
  }: T) => {

    approvalFieldState = FB.useRef<FBApprovalFieldState>(FBApprovalFieldState);
    isBlocked = _.isEmpty(approvalFieldState.hasApproved);

    function groupCheck(group: string): boolean {
      const filteredGroup = _.filter(currentUser.groups, { id: group });
      return !_.isEmpty(filteredGroup);
    }

    function approverStatus(identifier: string | undefined): string {
      const hasApprovedIdentifier = _.find(hasApproved, { identifier });
      if (!identifier || _.isEmpty(hasApprovedIdentifier)) {
        return FBApprovalStatus.Pending;
      }
      return FBApprovalStatus.Approved;
    }


    approverIsVisible = (identifier: string | undefined): boolean => {
      if (!identifier) {
        return false;
      }
      return (
        isBlocked ||
        (!isBlocked && !_.isEmpty(_.find(hasApproved, { identifier })))
      );
    };

    approverStatusInfo = (identifier: string | undefined): string => {
      const status = approverStatus(identifier);
      if (status === FBApprovalStatus.Approved) {
        const hasApprovedIdentifier = _.find(hasApproved, { identifier });
        return `${status}, ${hasApprovedIdentifier?.approvedAt}`;
      }
      return status;
    };

    canApprove = (identifier: string | undefined): boolean => {
      if (!identifier) {
        return false;
      }
      return (
        isBlocked &&
        (identifier === currentUser?.email || groupCheck(identifier)) &&
        approverStatus(identifier) !== FBApprovalStatus.Approved
      );
    };

    onClick = (identifierType: FBApprovalFieldIdentifier) => () => {
      const hasApproved = (identifierType === "approver")
        ? [currentUser.email]
        : _.map(currentUser.groups, "id");

      approvalFieldState?.addApprover(hasApproved);
      name && FBStore.setValue(name, approvalFieldState?.hasApproved);
      FBStore.resetSchema();
    };

    React.useEffect(() => {
      if (!name) {
        return;
      }
      const hasApproved = FBStore.getValue(name) as FBApprovedFieldValue[] || [];
      approvalFieldState?.setApprovers(hasApproved);
    }, []);

    useObserver(() => {
      hasApproved = approvalFieldState?.hasApproved;
    });

    return Component({
      ...(props as T),
      approvalFieldState,
      hasApproved,
      approverStatusInfo,
      currentUser,
      canApprove,
      approverIsVisible,
      onClick,
      isBlocked,
      disabled,
      name,
    });
  };

  return (props: T) => Comp(props);
};
