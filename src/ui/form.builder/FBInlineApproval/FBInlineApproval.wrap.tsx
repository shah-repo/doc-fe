import { difference, filter, find, isEmpty, isUndefined, map, pick, some, sortBy, unionBy } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useMemo } from "react";
import { FB, FBApprovalPasswordForm, FBAutocompleteAsyncOption, FBEmployee, FBInlineApprovalBody, FBInlineApprovalOptions, FBInlineApprovalProps, FBInlineApprovalState, FBInlineApprovalTransition } from "..";
import { store } from "../../../state/store";
import FBAutocompleteAsyncStore from "../FBAutocompleteAsync/FBAutocompleteAsync.store";
import { FBDialogState } from "../FBDialog/FBDialog.state";
import { FBRequestApprovalTransitionBody } from "./FBInlineApproval.types";

export const withFBInlineApproval = <T extends FBInlineApprovalProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    approvalTransition,
    inlineApprovalState,
    dialogState,
    editorConfig: { approvers, groups, roles } = {},
    currentUser,
    isApproved,
    isPreview,
    approvals,
    disabled,
    options,
    name = "",
    loading,
    onApproveClick,
    ...props
  }: T) => {

    // MARK: @config
    const { workspaceState, formState } = FB.useStores();
    dialogState = FB.useRef(FBDialogState);
    const {
      id,
      document,
      changeRequest,
      isOutput,
      document: { version: docVersion = 1 } = {},
    } = workspaceState || {};
    const docApprovals = document?.approvals || changeRequest?.approvals;
    const userId = (
      document?.owner?.user?.id ||
      changeRequest?.owner?.user?.id
    );

    isPreview = workspaceState?.mode === "preview";
    const fieldApprovals = useMemo(() => filter(docApprovals, { fieldId: name }), [docApprovals, name]);

    const authUser = store.getState().auth.user;
    const isOwner = authUser.id === userId;
    currentUser = authUser.id;
    inlineApprovalState = FB.useRef(FBInlineApprovalState, {
      approvals: fieldApprovals,
      isOwner,
    });
    const shouldShowRequestAllApprovals = isOwner && !isEmpty(inlineApprovalState.getApprovals);
    dialogState = FB.useRef(FBDialogState);
    const shouldShowApprovals = document?.status === "DRAFT" || document?.status === "IN_REVIEW";

    onApproveClick = (approvalId: string) => {
      dialogState?.config({
        title: "form.builder.password.prompt",
        open: true,
        content: (
          <FBApprovalPasswordForm
            {...{ approvalTransition, approvalId }}
          />
        ),
      });
    };

    // MARK: @reaction
    // Approvals sync
    React.useEffect(() => reaction(
      () => workspaceState?.approvals,
      (data) => {
        if (!difference(inlineApprovalState?.approvals, data || [])) {
          return;
        }
        const fieldApprovals = filter(data, { fieldId: name });
        inlineApprovalState?.setApprovals(fieldApprovals);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // On transition
    React.useEffect(() => reaction(
      () => inlineApprovalState?.transitionApi.data,
      (data) => concatApprovals(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // On requestApprovalTransition
    React.useEffect(() => reaction(
      () => inlineApprovalState?.requestApprovalApi.data,
      (data) => concatApprovals(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // Form sync
    React.useEffect(() => reaction(
      () => formState?.inputState.get("fb-ia-" + name)?.value,
      (fieldValue: string[]) => {
        const formValue: string[] = map(inlineApprovalState?.getApprovals, "approver.id");
        addApprover(difference(fieldValue, formValue));
        removeApprover(difference(formValue, fieldValue));
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // Init
    React.useEffect(() => {
      const fieldValue = map(inlineApprovalState?.getApprovals, "approver.id");
      formState?.setFieldValue(`fb-ia-${name}`, fieldValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // On add approver
    React.useEffect(() => reaction(
      () => inlineApprovalState?.approvalApi.data,
      (data) => concatApprovals(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // Approvers list
    React.useEffect(() => reaction(
      () => FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.availableApprovers),
      (data) => {
        if (!data) { return; }
        const value = Array.from(map(approvers as string[], (i) => data.get(i)));
        concatOptions(value, "Approvers");
      }, {
        fireImmediately: true,
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // Groups list
    React.useEffect(() => reaction(
      () => FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.groups),
      (data) => {
        if (!data) { return; }
        const value = Array.from(map(groups as string[], (i) => data.get(i)));
        map(value, (v) => concatOptions(v.employees, v.name));
      }, {
        fireImmediately: true,
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // Roles list
    React.useEffect(() => reaction(
      () => FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.approvalRoles),
      (data) => {
        if (!data) { return; }
        const value = Array.from(map(roles as string[], (i) => data.get(i)));
        map(value, (v) => concatOptions(v.joinedEmployees, v.name));
      }, {
        fireImmediately: true,
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // MARK: @helpers
    function concatOptions(approvers: FBEmployee[], listGroup: string) {
      let options = map(approvers, (o) => ({ ...o, listGroup }));
      options = sortBy(unionBy(inlineApprovalState?.options || [], options, "id"), "listGroup");
      inlineApprovalState?.setOptions(options as FBInlineApprovalOptions[]);
    }

    function concatApprovals(approval?: FBInlineApprovalBody | FBInlineApprovalBody[]) {
      if (!approval) { return; }
      return [approval].flat().map((app) => {
        const stateApprovals = filter(inlineApprovalState?.approvals, (a) => a.approver?.id !== app?.approver?.id);
        inlineApprovalState?.setApprovals(unionBy(stateApprovals, [app], "id"));
        return app;
      });
    }

    function addApprover(ids?: string[]) {
      if (!id) { return; }
      map(ids, (approver) => inlineApprovalState?.approvalBody({
        assigned: { id: approver },
        type: "SECTION",
        fieldId: name,
        partOf: { id },
      }));
    }

    function removeApprover(ids?: string[]) {
      if (!ids) { return; }
      map(ids, (approver) => {
        const approval = find(inlineApprovalState?.getApprovals, (a) => a.approver?.id === approver);
        inlineApprovalState?.approvalTransition("abandon", (approval as FBInlineApprovalBody)?.id);
      });
    }

    function requestAllApprovals(id?: string) {
      if (!id) { return; }
      const body = {
        docRev: pick(workspaceState?.document, "id"),
      } as FBRequestApprovalTransitionBody;
      inlineApprovalState?.requestApprovalTransition("pending_by_field", id, body);
    }

    // MARK: @methods
    approvalTransition = (transition: FBInlineApprovalTransition, id?: string, password?: string) => {
      if (!id || !password) { return; }
      inlineApprovalState?.approvalTransition(transition, id, { password });
    };

    onApproveClick = (approvalId: string) => {
      dialogState?.config({
        title: "form.builder.password.prompt",
        open: true,
        content: <FBApprovalPasswordForm {...{ approvalId, approvalTransition }} />,
      });
    };

    // MARK: @observer
    useObserver(() => {
      options = inlineApprovalState?.getOptions;
      approvals = inlineApprovalState?.getApprovals;

      loading = (
        inlineApprovalState?.approvalApi.loading ||
        inlineApprovalState?.transitionApi.loading ||
        inlineApprovalState?.documentApi.loading
      );

      disabled = loading
        || !(isOutput && Boolean(id))
        || document?.status === "RELEASED"
        || document?.status === "VOIDED"
        || document?.revisionStage !== 1;
    });

    // MARK: @final config
    isApproved = (
      docVersion > 1 &&
      isEmpty(inlineApprovalState.getApprovals) &&
      Boolean(formState?.getFieldValue(name))
    ) ? some(fieldApprovals, (approval) => approval.status === "APPROVED") || !fieldApprovals.length
      : !isUndefined(find(approvals, { status: "APPROVED" }));

    return Component({
      ...(props as T),
      approvalTransition,
      requestAllApprovals,
      dialogState,
      inlineApprovalState,
      currentUser,
      isApproved,
      isPreview,
      approvals,
      disabled,
      loading,
      options,
      name,
      onApproveClick,
      shouldShowApprovals,
      shouldShowRequestAllApprovals,
    });
  };

  Comp.displayName = "withFBInlineApproval";
  return Comp;
};
