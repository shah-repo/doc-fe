import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBApprovalConfig, FBApprovalProps, FBApprovalState, FBApprovalStatus, FBApprovalValue } from ".";
import { FB, FBAutocompleteAsyncOption } from "..";
import { getStartOfDayDateString } from "../../../common/utils/date";
import { Employee } from "../../../state/ducks/company";
import { GroupRequestBody } from "../../../state/ducks/groupManagement";
import { store } from "../../../state/store";
import FBAutocompleteAsyncStore from "../FBAutocompleteAsync/FBAutocompleteAsync.store";
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
    disabled = !FBDRStore.isOutput || (FBDRStore.isOutput && !FBStore.docId);
    const currentUser = store.getState().auth.user;

    function isApprover(approver: Employee | GroupRequestBody): boolean {
      return _.includes(_.keys(approver), "user");
    }

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
      return (approver as Employee).user?.email || (approver as GroupRequestBody).name || "";
    }

    function approverStatusInfo(id: string): string {
      const status = approverStatus(id);
      if (status === FBApprovalStatus.Approved) {
        const approverValue = findApprover(id);
        if (!approverValue) {
          return "";
        }
        const approvedAt = getStartOfDayDateString(approverValue.approvedAt, "LL");
        return `${status}, ${approvedAt}`;
      }
      return status;
    }

    function canApprove(id: string): boolean {
      return (
        !isApproved &&
        (id === currentUser?.employeeId || groupCheck(id)) &&
        approverStatus(id) !== FBApprovalStatus.Approved
      );
    }

    onApprove = (approver?: Employee | GroupRequestBody) => () => {
      if (!approver) {
        return;
      }
      approvalFieldState?.addApprover({
        id: currentUser.id,
        userId: currentUser.employeeId,
        ...!isApprover(approver) && { groupId: approver.id },
        approvedAt: (new Date()).toISOString(),
      });

      // API post
      if (!name) {
        return;
      }

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

    React.useEffect(() => {
      if (!name) {
        return;
      }
      const hasApproved = FBStore.getValue(name) as FBApprovalValue[] || [];
      approvalFieldState?.setApprovers(hasApproved);
    }, []);

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
