import { Box } from "@material-ui/core";
import { compact, difference, filter, find, isEmpty, isUndefined, map, unionBy } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBApprovalPasswordForm, FBApprovalsState, FBApprover, FBDialogState, FBInlineApprovalBody, FBRequiredApprover } from "..";
import { ChangeRequestStatus } from "../../../state/ducks/changeRequest";
import { DocumentRevisionStatus } from "../../../state/ducks/documentRevisions";
import { store } from "../../../state/store";
import { FBApprovalsProps, FBApprovalsStatusEndpoint } from "./FBApprovals.types";

export const withFBApprovals = <T extends FBApprovalsProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onApproveClick,
    requestApproval,
    approvals,
    name = "",
    loading,
    disabled,
    documentStatus,
    docId,
    approvalTransition,
    groups,
    renderOption,
    isIncluded,
    currentUser,
    ownerId,
    dialogState,
    ...props
  }: T) => {
    let isComponentVisible = false;
    let inlineApprovalExists = false;

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
    if (document?.status === DocumentRevisionStatus.InReview
      || changeRequest?.state === ChangeRequestStatus.InReview) {
      disabled = false;
    }
    if (document?.status === DocumentRevisionStatus.Released) {
      disabled = true;
    }

    const authUser = store.getState().auth.user;
    const isOwner = authUser.id === userId;
    currentUser = authUser.id;

    const approvalsState = FB.useRef(
      FBApprovalsState,
      { id, approvals: document?.approvals || changeRequest?.approvals, isOwner },
    );
    dialogState = FB.useRef(FBDialogState);

    approvalTransition = (transition: FBApprovalsStatusEndpoint, approvalId?: string, password?: string) => {
      if (!approvalId) { return; }
      approvalsState?.applyTransition(transition, approvalId, { password });
    };

    function includesApprover(group: FBRequiredApprover, approver: string): boolean {
      return (group.joinedEmployees as string[]).includes(approver);
    }

    onApproveClick = (approvalId: string) => {
      dialogState?.config({
        title: "form.builder.password.prompt",
        open: true,
        content: <FBApprovalPasswordForm {...{ approvalId, approvalTransition }} />,
      });
    };

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
      if (approval.status === "REJECTED" || approval.status === "APPROVED") {
        window.location.reload();
      } else {
        const stateApprovals = filter(approvalsState?.approvals, (a) => a.approver?.id !== approval.approver?.id);
        approvalsState?.setApprovals(unionBy(stateApprovals, [approval], "id"));
      }
    }

    requestApproval = (id?: string) => {
      if (!id) { return; }
      approvalsState?.applyTransition("pending", id);
    };

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
        approvals?.map((approval) => approval.approver?.id).includes(employee));

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

    // MARK: @observer
    useObserver(() => {
      inlineApprovalExists = Boolean(document?.formDocument?.formTemplate?.schema
      .some((e) => (e.type === "inlineapproval" as string)));

      groups = approvalsState?.groups;
      approvals = approvalsState?.getApprovals;

      const isRevisionAfterA = document?.revisionStage !== 1
        && (document?.revision !== 1 || document?.subRevision !== 0);

      isComponentVisible = document?.status !== DocumentRevisionStatus.Voided
        && (!inlineApprovalExists || isRevisionAfterA);


      loading = (
        approvalsState.loading ||
        approvalsState?.approvalApi.loading ||
        approvalsState?.transitionApi.loading
      );
    });

    const fieldValue = map(approvalsState?.getApprovals, "approver.id");
    formState?.setFieldValue(`fb-approvals-${name}`, fieldValue);

    if (!isComponentVisible) {
      return null;
    }

    return Component({
      ...(props as T),
      requestApproval,
      dialogState,
      approvals,
      name,
      loading,
      disabled,
      documentStatus: document?.status,
      docId: id,
      approvalTransition,
      groups,
      renderOption,
      isIncluded,
      currentUser,
      ownerId,
      inlineApprovalExists,
      onApproveClick,
    });
  };

  Comp.displayName = "withFBApprovals";
  return Comp;
};
