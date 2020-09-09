import { Box } from "@material-ui/core";
import { compact, difference, filter, find, isEmpty, isUndefined, map, unionBy } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBApprovalsState, FBApprover, FBInlineApprovalBody, FBRequiredApprover } from "..";
import { store } from "../../../state/store";
import { FBApprovalsProps, FBApprovalsStatusEndpoint } from "./FBApprovals.types";

export const withFBApprovals = <T extends FBApprovalsProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    requestApproval,
    approvals,
    name = "",
    loading,
    disabled,
    documentStatus,
    docId,
    changeApprovalStatus,
    groups,
    renderOption,
    isIncluded,
    currentUser,
    ownerId,
    ...props
  }: T) => {

    const { workspaceState, formState } = FB.useStores();
    const {
      document,
      changeRequest,
      id,
    } = workspaceState || {};

    const {
      owner: { user: { id: userId = "" } = {} } = {},
    } = document || changeRequest || {};

    disabled = disabled || isUndefined(id) || loading;

    const authUser = store.getState().auth.user;
    const isOwner = authUser.id === userId;
    currentUser = authUser.id;

    const approvalsState = FB.useRef(
      FBApprovalsState,
      { id, approvals: document?.approvals || changeRequest?.approvals, isOwner },
    );

    changeApprovalStatus = (transition: FBApprovalsStatusEndpoint, approvalId?: string) => {
      if (!approvalId) { return; }
      approvalsState?.applyTransition(transition, approvalId);
    };

    function includesApprover(group: FBRequiredApprover, approver: string): boolean {
      return (group.joinedEmployees as string[]).includes(approver);
    }

    // On add approver
    React.useEffect(() => reaction(
      () => approvalsState?.approvalApi.data,
      (data) => concatApprovals(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // On transition
    React.useEffect(() => reaction(
      () => approvalsState?.transitionApi.data,
      (data) => concatApprovals(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    function concatApprovals(approval?: FBInlineApprovalBody) {
      if (!approval) { return; }
      const stateApprovals = filter(approvalsState?.approvals, (a) => a.approver?.id !== approval.approver?.id);
      approvalsState?.setApprovals(unionBy(stateApprovals, [approval], "id"));
    }

    requestApproval = (id?: string) => {
      if (!id) { return; }
      approvalsState?.applyTransition("pending", id);
    };

    // MARK: @observer
    useObserver(() => {
      groups = approvalsState?.groups;
      approvals = approvalsState?.getApprovals;
      loading = (
        approvalsState.loading ||
        approvalsState?.approvalApi.loading ||
        approvalsState?.transitionApi.loading
      );
    });

    React.useEffect(() => reaction(
      () => formState?.inputState.get("fb-approvals-" + name)?.value,
      (fieldValue: string[]) => {
        const formValue: string[] = map(approvalsState?.getApprovals, "approver.id");
        addApprover(difference(fieldValue, formValue));
        removeApprover(difference(formValue, fieldValue));
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    function addApprover(ids?: string[]) {
      if (!id) { return; }
      map(ids, (approver) => approvalsState?.addApproval({
        assigned: { id: approver },
        type: "MASTER",
        fieldId: name,
        partOf: { id },
      }));
    }

    function removeApprover(ids?: string[]) {
      if (!ids) { return; }
      map(ids, (approver) => {
        const approval = find(approvalsState?.getApprovals, (a) => a.approver?.id === approver);
        approvalsState?.applyTransition("abandon", (approval as FBInlineApprovalBody)?.id);
      });
    }

    isIncluded = (group: FBRequiredApprover): boolean =>
      group.joinedEmployees.some((employee) =>
        approvalsState?.approvals?.map((approval) => approval.approver?.id).includes(employee));

    // eslint-disable-next-line react/display-name
    renderOption = (option: FBApprover) => {
      const requiredGroups: string [] =
        compact(map(groups, (group) => includesApprover(group, option.id) ? group.name : ""));
      return (
        <Box display="flex" key={`fb-required-approver-${option.id}`}>
          <Box fontWeight="fontWeightMedium">{option.user?.name}</Box>
          &nbsp;({option.user?.email})
          {!isEmpty(requiredGroups) && (
            <Box>
              &nbsp;{`- ${requiredGroups.join(", ")}`}
            </Box>
          )}
        </Box>
      );
    };

    // React.useEffect(() => {
    //   reaction(
    //     () => formState?.inputState.get(name || "")?.value,
    //     (data) => {
    //       if (!id) {
    //         toastError("Please save the document first.");
    //         return;
    //       } else {
    //         approvalsState?.addApproval({
    //           assigned: {
    //             id: data.id,
    //           },
    //           partOf: { id },
    //         } as Approval);
    //       }
    //     }
    //   );
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    // useObserver(() => {
    //   groups = approvalsState?.groups;
    //   loading = approvalsState?.loading;
    // });


    return Component({
      ...(props as T),
      requestApproval,
      approvals,
      name,
      loading,
      disabled,
      documentStatus: document?.status,
      docId: id,
      changeApprovalStatus,
      groups,
      renderOption,
      isIncluded,
      currentUser,
      ownerId,
    });
  };

  Comp.displayName = "withFBApprovals";
  return Comp;
};
