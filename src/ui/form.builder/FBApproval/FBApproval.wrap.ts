import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBApprovalConfig, FBApprovalProps, FBApprovalState, FBApprovalStatus, FBApprovalValue } from ".";
import { FB } from "..";
import { getStartOfDayDateString } from "../../../common/utils/date";
import { Employee } from "../../../state/ducks/company";
import { GroupRequestBody } from "../../../state/ducks/groupManagement";
import { store } from "../../../state/store";
import FBDRStore from "../stores/ui/FBDRStore";
import FBStore from "../stores/ui/FBStore";

export const withFBApproval = <T extends FBApprovalProps>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    onApprove,
    approvalFieldState,
    approvalConfig,
    name,
    hasApproved,
    disabled,
    isApproved = false,
    isDefined = false,
    approvers,
    approverGroups,
    loading,
    ...props
  }: T) => {

    approvalFieldState = FB.useRef<FBApprovalState>(FBApprovalState);
    isApproved = approvalFieldState.isApproved;
    isDefined = !_.isEmpty(approvers) || !_.isEmpty(approverGroups);
    disabled = !FBDRStore.isOutput || (FBDRStore.isOutput && !FBStore.documentId);
    const currentUser = store.getState().auth.user;

    function groupCheck(id: string): boolean {
      const filteredGroup = _.filter(currentUser.groups, { id });
      return !_.isEmpty(filteredGroup);
    }

    function approverStatus(id: string): string {
      const approverValue = findApprover(id);
      if (_.isEmpty(approverValue)) {
        return FBApprovalStatus.Pending;
      }
      return FBApprovalStatus.Approved;
    }

    function approverIdentifier(approver: Employee | GroupRequestBody): string {
      return (approver as Employee).user?.email || (approver as GroupRequestBody).id || "";
    }

    function findApprover(id: string): FBApprovalValue | undefined {
      return _.find(hasApproved, { email: id }) || _.find(hasApproved, { groupId: id });
    }

    function approverIsVisible(id: string): boolean {
      return (
        !isApproved ||
        (isApproved && !_.isEmpty(findApprover(id)))
      );
    }

    function approverName(approver?: Employee | GroupRequestBody): string {
      return (approver as Employee).user?.email || (approver as GroupRequestBody).name || "";
    }

    function approverStatusInfo(id: string): string {
      const status = approverStatus(id);
      if (status === FBApprovalStatus.Approved) {
        const approverValue = findApprover(id);
        if (!approverValue) {
          return "";
        }
        const approver = approverValue.groupId ? `${approverValue.email}, ` : "";
        const approvedAt = getStartOfDayDateString(approverValue.approvedAt, "LL");
        return `${status}, ${approver}${approvedAt}`;
      }
      return status;
    }

    function canApprove(id: string): boolean {
      return (
        !isApproved &&
        (id === currentUser?.email || groupCheck(id)) &&
        approverStatus(id) !== FBApprovalStatus.Approved
      );
    }

    onApprove = (approver?: Employee | GroupRequestBody) => () => {
      if (!approver) {
        return;
      }
      approvalFieldState?.addApprover({
        id: currentUser.id,
        email: currentUser.email,
        groupId: !_.includes(_.keys(approver), "user") && approver?.id,
        approvedAt: (new Date()).toISOString(),
        notify: false,
      });
      name && FBStore.setValue(name, approvalFieldState?.hasApproved);
      FBStore.resetSchema();
    };

    approvalConfig = (approver?: Employee | GroupRequestBody): FBApprovalConfig | undefined => {
      if (!approver) {
        return;
      }
      const identifierId = approverIdentifier(approver);
      return {
        label: approverName(approver),
        isVisible: approverIsVisible(identifierId),
        status: approverStatusInfo(identifierId),
        canApprove: canApprove(identifierId),
      };
    };

    React.useEffect(() => {
      if (!name) {
        return;
      }
      const hasApproved = FBStore.getValue(name) as FBApprovalValue[] || [];
      approvalFieldState?.setApprovers(hasApproved);
      approvalFieldState?.load();
    }, []);

    useObserver(() => {
      hasApproved = approvalFieldState?.hasApproved;
      approvers = approvalFieldState?.approvers(approvers as string[]);
      approverGroups = approvalFieldState?.groups(approverGroups as string[]);
      loading = approvalFieldState?.loading;
    });

    return Component({
      ...(props as T),
      onApprove,
      approvalConfig,
      approvers,
      approverGroups,
      hasApproved,
      isApproved,
      isDefined,
      disabled,
      loading,
      name,
    });
  };

  return (props: T) => Comp(props);
};
