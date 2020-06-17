import _ from "lodash";
import { useObserver } from "mobx-react";
import moment from "moment";
import React from "react";
import { FBApprovalConfig, FBApprovalProps, FBApprovalState, FBApprovalStatus, FBApprovalValue } from ".";
import { FB, FBAutocompleteAsyncOption } from "..";
import { TIME_ZONE } from "../../../common/utils/date";
import { Employee } from "../../../state/ducks/company";
import { GroupRequestBody } from "../../../state/ducks/groupManagement";
import FBAutocompleteAsyncStore from "../FBAutocompleteAsync/FBAutocompleteAsync.store";

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
    reviseDisabled,
    loading,
    ...props
  }: T) => {

    const { workspaceState, formState } = FB.useStores();
    const { id: documentId, isOutput, isReleased, currentUser } = workspaceState || {};
    const formValue = formState?.getFieldValue(name) as FBApprovalValue[];

    approvalFieldState = FB.useRef<FBApprovalState>(FBApprovalState, {
      value: formValue,
      documentId,
      name,
    });

    isApproved = approvalFieldState.isApproved;
    isDefined = !_.isEmpty(approvers) || !_.isEmpty(approverGroups);
    disabled = (
      isReleased ||
      !isOutput ||
      (isOutput && !documentId) ||
      (reviseDisabled && workspaceState?.isRevised)
    );

    function isApprover(approver: Employee | GroupRequestBody): boolean {
      return _.includes(_.keys(approver), "user");
    }

    function groupCheck(id: string): boolean {
      const filteredGroup = _.filter(currentUser?.groups, { id });
      return !_.isEmpty(filteredGroup);
    }

    function approverStatus(id: string): string {
      const approverValue = findApprover(id);
      if (_.isEmpty(approverValue)) {
        return FBApprovalStatus.Pending;
      }
      return FBApprovalStatus.Approved;
    }

    function findApprover(id: string): FBApprovalValue | undefined {
      return _.find(hasApproved, { userId: id }) || _.find(hasApproved, { groupId: id });
    }

    function approverIsVisible(id: string): boolean {
      return (
        !isApproved ||
        (isApproved && !_.isEmpty(findApprover(id)))
      );
    }

    function approverName(approver?: Employee | GroupRequestBody): string {
      return (approver as Employee)?.user?.email || (approver as GroupRequestBody)?.name || "";
    }

    function approverStatusInfo(id: string): string {
      const status = approverStatus(id);
      if (status === FBApprovalStatus.Approved) {
        const { userId, groupId, approvedAt } = findApprover(id) || {};
        if (!approvedAt) { return ""; }
        let approver = "";
        if (userId && groupId) {
          const approverObj = _.first(approvalFieldState?.approvers([userId]));
          approver = `${approverName(approverObj)},`;
        }

        const mom = moment(approvedAt).tz(TIME_ZONE, true).format("D MMM YYYY hh:mm a");
        return `${status}, ${approver} ${mom}`;
      }
      return status;
    }

    function canApprove(id: string): boolean {
      return id === currentUser?.employeeId || groupCheck(id);
    }

    onApprove = (approver?: Employee | GroupRequestBody) => () => {
      if (!approver) {
        return;
      }
      approvalFieldState?.addApprover({
        id: FB.uniqid,
        userId: currentUser?.employeeId,
        ...!isApprover(approver) && { groupId: approver.id },
        approvedAt: (new Date()).toISOString(),
      });

      // API post
      if (!name) { return; }

      approvalFieldState?.postApi.setBody({
        fieldName: name,
        fieldValue: approvalFieldState?.hasApproved,
      });
      approvalFieldState?.postApi.post();
    };

    approvalConfig = (approver?: Employee | GroupRequestBody): FBApprovalConfig | undefined => {
      if (!approver) {
        return;
      }
      const id = approver.id || "";
      return {
        label: approverName(approver),
        isVisible: approverIsVisible(id),
        status: approverStatusInfo(id),
        canApprove: canApprove(id),
      };
    };

    useObserver(() => {
      FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.approver) &&
        (approvers = approvalFieldState?.approvers(approvers as string[]));
      FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.group) &&
        (approverGroups = approvalFieldState?.groups(approverGroups as string[]));
      hasApproved = approvalFieldState?.hasApproved;
      loading = approvalFieldState?.approversApi.loading || approvalFieldState?.groupsApi.loading;
    });

    return Component({
      ...(props as T),
      onApprove,
      approvalConfig,
      approvers,
      approverGroups,
      reviseDisabled,
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
