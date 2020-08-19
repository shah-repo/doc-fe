import { cloneDeep, filter, findLast, groupBy, includes, isEmpty, isUndefined, sortBy } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import moment from "moment";
import React from "react";
import { FBApprovalConfig, FBApprovalProps, FBApprovalState, FBApprovalStatus, FBApprovalValue, FBInlineApprovalRole, FBInlineApproverType } from ".";
import { FB } from "..";
import { TIME_ZONE } from "../../../common/utils/date";
import { Employee } from "../../../state/ducks/company";
import { GroupRequestBody } from "../../../state/ducks/groupManagement";
import { store } from "../../../state/store";
import FBAutocompleteAsyncStore from "../FBAutocompleteAsync/FBAutocompleteAsync.store";

export const withFBApproval = <T extends FBApprovalProps>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    onApprove,
    approvalConfig,
    approvalState,
    name = "",
    hasApproved,
    disabled,
    isApproved = false,
    isDefined = false,
    approvers,
    approverGroups,
    approvalRoles,
    editorProperties = [],
    reviseDisabled,
    approveLoading,
    autosave,
    loading,
    ...props
  }: T) => {

    const { workspaceState, formState } = FB.useStores();
    const approvalNonVersioned = includes(editorProperties, "approvalNonVersioned");
    autosave = approvalNonVersioned;
    const currentUser = store.getState().auth.user;
    const {
      id: documentId,
      isOutput,
      isReleased,
      document: { released = new Date(), revisionStage = "" } = { },
    } = workspaceState || {};

    const isRecord = workspaceState?.document?.document?.documentType?.groupOptions?.includes("RECORD") || false;
    const formValue = sortBy(formState?.getFieldValue(name), "approvedAt")
      .filter((value) => new Date(value.approvedAt) <= new Date(released));

    approvalState = FB.useRef<FBApprovalState>(FBApprovalState, {
      value: formValue,
      approversValue: approvers,
      groupsValue: approverGroups,
      approvalRolesValue: approvalRoles,
      documentId,
    });

    isApproved = approvalState.isApproved;
    isDefined = !isEmpty(approvers) || !isEmpty(approverGroups);
    disabled = (
      isReleased ||
      !isOutput ||
      (isOutput && !documentId) ||
      (reviseDisabled && workspaceState?.isRevised) ||
      (revisionStage === 3 && isRecord)
    );

    function getGroup(id: string): GroupRequestBody | undefined {
      return FBAutocompleteAsyncStore.getValue<GroupRequestBody>(approvalState?.groupsId, id);
    }

    function getRole(id: string): FBInlineApprovalRole | undefined {
      return FBAutocompleteAsyncStore.getValue<FBInlineApprovalRole>(approvalState?.approvalRolesId, id);
    }

    function isGroup(id?: string): boolean {
      if (!id) { return false; }
      return !isUndefined(getGroup(id));
    }

    function isApprovalRole(id?: string): boolean {
      if (!id) { return false; }
      return !isUndefined(getRole(id));
    }

    function groupCheck(id: string): boolean {
      const filteredGroup = filter(currentUser?.groups, { id });
      return !isEmpty(filteredGroup);
    }

    function roleCheck(id: string): boolean {
      const roles = groupBy(getRole(id)?.joinedEmployees || [], "id");
      return !isUndefined(roles[currentUser?.employeeId || ""]);
    }

    function approverStatus(id: string): string {
      const approverValue = findApprover(id);
      if (isEmpty(approverValue)) {
        return FBApprovalStatus.Pending;
      }
      return FBApprovalStatus.Approved;
    }

    function findApprover(id: string): FBApprovalValue | undefined {
      return (
        findLast(hasApproved, { userId: id }) ||
        findLast(hasApproved, { groupId: id }) ||
        findLast(hasApproved, { approvalRoleId: id })
      );
    }

    function approverIsVisible(id: string): boolean {
      return (
        !isApproved ||
        (isApproved && !isEmpty(findApprover(id)))
      );
    }

    function approverName(approver?: FBInlineApproverType): string {
      return (
        (approver as Employee)?.user?.email ||
        (approver as GroupRequestBody)?.name ||
        (approver as FBInlineApprovalRole)?.name ||
        ""
      );
    }

    function approverStatusInfo(id: string): string {
      const status = approverStatus(id);
      if (status === FBApprovalStatus.Approved) {
        const { userId, groupId, approvalRoleId, approvedAt } = findApprover(id) || {};
        if (!approvedAt) { return ""; }
        let approver = "";
        if (userId && (groupId || approvalRoleId)) {
          const approverObj = FBAutocompleteAsyncStore.getValue<Employee>(approvalState?.approversId, userId);
          approver = approverName(approverObj) + ",";
        }

        const mom = moment(approvedAt).tz(TIME_ZONE, true).format("D MMM YYYY hh:mm a");
        return `${status}, ${approver} ${mom}`;
      }
      return status;
    }

    function canApprove(id: string): boolean {
      return id === currentUser?.employeeId || groupCheck(id) || roleCheck(id);
    }

    onApprove = (approver?: FBInlineApproverType) => () => {
      if (!approver) {
        return;
      }
      approvalState?.addApprover({
        id: FB.uniqid,
        userId: currentUser?.employeeId,
        ...isGroup(approver.id) && { groupId: approver?.id },
        ...isApprovalRole(approver.id) && { approvalRoleId: approver?.id },
        approvedAt: (new Date()).toISOString(),
      });

      // API post
      if (approvalNonVersioned) { return; }

      approvalState?.postApi.setBody({
        fieldName: name,
        fieldValue: approvalState?.hasApproved,
      });
      approvalState?.postApi.post();
    };

    approvalConfig = (approver?: FBInlineApproverType): FBApprovalConfig | undefined => {
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
      approvers = approvalState?.approvers as unknown as Employee[];
      approverGroups = approvalState?.groups as unknown as GroupRequestBody[];
      approvalRoles = approvalState?.approvalRoles as unknown as FBInlineApprovalRole[];
      hasApproved = approvalState?.hasApproved;
      loading = (
        approvalState?.approversApi.loading ||
        approvalState?.groupsApi.loading ||
        approvalState?.approvalRolesApi.loading
      );
      approveLoading = approvalState?.postApi.loading;
    });

    React.useEffect(() => {
      reaction( // Form sync & autosave
        () => approvalState?.hasApproved,
        (data) => {
          formState?.setFieldValue(name, cloneDeep(data));
          if (!approvalNonVersioned) { return; }
          formState?.setFieldAutosave(name);
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return Component({
      ...(props as T),
      onApprove,
      approvalConfig,
      approvalState,
      approvers,
      approverGroups,
      approvalRoles,
      reviseDisabled,
      hasApproved,
      isApproved,
      isDefined,
      disabled,
      loading,
      name,
      approveLoading,
      autosave,
    });
  };

  return (props: T) => Comp(props);
};
