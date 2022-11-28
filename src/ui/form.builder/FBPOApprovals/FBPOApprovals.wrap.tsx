import { Box } from "@material-ui/core";
import { useFormikContext } from "formik";
import { compact, concat, difference, filter, find, includes, isEmpty, map, unionBy } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { FB, FBApprovalPasswordForm, FBApprovalsStatusEndpoint, FBApprover, FBDialogState, FBInlineApprovalBody, FBPOApprovalsProps, FBRequiredApprover } from "..";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { PO_ITEMS_COMPONENT_NAME, PO_REQUESTOR_COMPONENT_NAME } from "../../../state/ducks/documentRevisions/constants";
import { RevisionChangeType } from "../../../state/ducks/documentRevisions/types";
import { ApprovalStatus, DocumentStatus } from "../../../state/ducks/documents/types";
import { store } from "../../../state/store";
import { FBDataStoreApprovalKeys } from "../../documentRevision/forms/types";
import Colors from "../../layout/theme/utils/colors";
import FBDataStore from "../FBStore/FBDataStore";
import FBPOApprovalsState from "./FBPOApprovals.state";
import { checkServiceOrProductPartExists, checkGroups, checkLineItems } from "./helpers";

export const withFBPOApprovals = <T extends FBPOApprovalsProps>(
  Component: React.FunctionComponent<T>,
) => {

  const Comp = ({
    renderOption,
    isIncluded,
    approvalTransition,
    onApproveClick,
    name = "",
    loading,
    value,
    groups,
    approvals,
    checkedGroups,
    currentUser,
    documentStatus,
    dialogState,
    disabled,
    disabledOptions,
    disableChipDelete,
    ...props
  }: T) => {
    const { workspaceState, formState } = FB.useStores();
    const formik = useFormikContext();
    const { document, changeRequest, id, isOutput } = workspaceState || {};
    const outputId = isOutput ? id : null;
    const poName = workspaceState?.schema?.find((item) => item.type === "purchaseorder")?.name || "";
    const authUser = store.getState().auth.user;
    currentUser = authUser.id;
    dialogState = FB.useRef(FBDialogState);
    const isAdministrativeChange = workspaceState?.revisionChangeType === RevisionChangeType.AdministrativeChange;
    const poApprovalsState = FB.useRef(
      FBPOApprovalsState,
      {
        id: outputId,
        approvals: FBDataStore?.refreshData?.approvals || document?.approvals || changeRequest?.approvals,
      },
    );
    let availableApprovers: string[] = [];
    const hasPOItems = useRef(false);
    const dispatch = useDispatch();
    const prevRequester = useRef<string>();

    isIncluded = (group: FBRequiredApprover): boolean =>
      (includes(map(poApprovalsState?.checkedGroups, "id"), group.id));

    const getApprovals = (approvals) => approvals.filter((data) => data.status !== ApprovalStatus.Abandoned);
    function concatApprovals(approval?: FBInlineApprovalBody) {
      if (!approval) { return; }
      if (approval.status === ApprovalStatus.Rejected || approval.status === ApprovalStatus.Approved) {
        window.location.reload();
      } else {
        const stateApprovals = filter(poApprovalsState?.approvals, (a) => a.approver?.id !== approval.approver?.id);
        availableApprovers = getApprovals(unionBy(stateApprovals, [approval], "id"));
        poApprovalsState?.setApprovals(getApprovals(unionBy(stateApprovals, [approval], "id")));
      }
    }

    function includesApprover(group: FBRequiredApprover, approver: string): boolean {
      return (group.joinedEmployees as string[]).includes(approver);
    }
    // Rendering groups beside approvers in autocomplete options
    // eslint-disable-next-line react/display-name
    renderOption = (option: FBApprover) => {
      const requiredGroups: string [] =
        compact(map(groups, (group) => includesApprover(group, option.id) ? group.name : ""));
      return (
        <Box display="flex" key={`fb-required-approver-${option.id}`}>
          <Box fontWeight="fontWeightMedium">{option.user?.name}</Box>
          &nbsp;({option.user?.email})
          {!isEmpty(requiredGroups) && (
            <Box color={Colors.gray}>
              &nbsp;{`- ${requiredGroups.join(", ")}`}
            </Box>
          )}
        </Box>
      );
    };

    useEffect(() => reaction(
      () => workspaceState?.formInputSync?.get(poName),
      (poItems) => {
        const previousPOItems = poApprovalsState.getPrevPOItems;
        const isServiceOrProductPartExist = checkServiceOrProductPartExists(poItems);
        const isPrevServiceOrProductPartExist = checkServiceOrProductPartExists(previousPOItems);
        poApprovalsState.setPrevPOItems(poItems);
        hasPOItems.current = !(isServiceOrProductPartExist || isPrevServiceOrProductPartExist);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // On add approver
    useEffect(() => reaction(
      () => poApprovalsState?.approvalApi.data,
      (data) => {
        concatApprovals(data);
        FBDataStore.setApprovals(data, FBDataStoreApprovalKeys.PO_APPROVALS);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    useEffect(() => reaction(
      () => poApprovalsState?.transitionApi.data,
      (data) => {
        const filteredApprovals: FBInlineApprovalBody[] = compact(map(poApprovalsState.approvals, (approval) =>
          approval.approverId === data?.approverId ? data : approval
        ));
        FBDataStore.setApprovals(data, FBDataStoreApprovalKeys.PO_APPROVALS);
        poApprovalsState.setApprovals(getApprovals(filteredApprovals));
        if (data?.status === ApprovalStatus.Approved || data?.status === DocumentStatus.Draft) {
          window.location.reload();
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // This runs when you manually remove an approver from the list
    useEffect(() => reaction(
      () => formState?.inputState.get(name)?.value,
      (fieldValue: string[]) => {
        const formValue: string[] = map(poApprovalsState?.getApprovals, "approver.id");
        const employeesToBeAdded = difference(fieldValue, formValue);
        employeesToBeAdded.length > 0 && addApprover(employeesToBeAdded, { manually: true });
        const employeesToBeRemoved = difference(formValue, fieldValue);
        employeesToBeRemoved.length > 0 && removeApprover(employeesToBeRemoved);
        formState?.getInputState(name)?.setRender();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // Store previous requester value.
    useEffect(
      () => {
        prevRequester.current = workspaceState?.formInputSync?.get(PO_REQUESTOR_COMPONENT_NAME);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );

    // On requester change.
    useEffect(() => reaction(
      () => workspaceState?.formInputSync?.get(PO_REQUESTOR_COMPONENT_NAME),
      (requester) => {
        if (workspaceState) {
          checkLineItems({
            workspaceState,
            poApprovalsState,
            prevRequesterValue: prevRequester.current,
            addApprover,
            removeApprover,
          });
        }
        prevRequester.current = requester;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);


    useEffect(() => {
      const poItems = workspaceState?.formInputSync?.get(PO_ITEMS_COMPONENT_NAME);
      poApprovalsState.setPrevPOItems(poItems);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => reaction(
      () => Object.values((poApprovalsState?.groups as {})).slice(),
      (groups) => {
        if (groups && workspaceState) {
          checkLineItems({
            workspaceState,
            poApprovalsState,
            prevRequesterValue: prevRequester.current,
            addApprover,
            removeApprover,
          });
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    const addApprover = (ids: string[], { manually = true } = {}) => {
      if (!id) { return; }
      if (!ids) { return; }
      const groupName = checkGroups({ id: ids[0], poApprovalsState });
      if (
        poApprovalsState.getDidMountPhase &&
        ( difference(ids, availableApprovers).length === 0 )
      ) {
        return;
      }
      ids.length && (availableApprovers = concat(availableApprovers, ids));
      map(ids, (approver) => poApprovalsState?.addApproval({
        assigned: { id: approver },
        type: "MASTER",
        fieldId: name,
        partOf: { id },
        signatureGroupName: groupName,
        manually,
      }, () => {
        const id  = workspaceState?.id;
        if (id) { dispatch(documentRevisionsActions.loadAudit(id)); }
      }));
    };

    const removeApprover = (ids?: string[]) => {
      if (!ids) { return; }
      if (formState?.workspaceMode === "preview") { return; }
      availableApprovers = difference(availableApprovers, ids);
      map(ids, (approver) => {
        const approval = find(poApprovalsState?.getApprovals, (a) => a.approver?.id === approver);
        poApprovalsState?.removeCheckedGroups(approval?.signatureGroupName);
        poApprovalsState?.applyTransition("abandon", (approval as FBInlineApprovalBody)?.id, undefined, () => {
          const id  = workspaceState?.id;
          if (id) { dispatch(documentRevisionsActions.loadAudit(id)); }
        });
      });
    };

    approvalTransition = (transition: FBApprovalsStatusEndpoint, approvalId?: string, password?: string) => {
      if (!approvalId) { return; }
      poApprovalsState?.applyTransition(transition, approvalId, { password });
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
      groups = poApprovalsState?.groups;
      approvals = poApprovalsState?.getApprovals;
      checkedGroups = poApprovalsState?.checkedGroups;

      loading = (
        poApprovalsState?.loading ||
        poApprovalsState?.approvalApi.loading ||
        poApprovalsState?.transitionApi.loading
      );
    });

    useEffect(() => reaction(
      () => poApprovalsState?.transitionApi.loading,
      (loading) => {
        if (id && !loading) {
          poApprovalsState.fetchRequiredApprovals(id as unknown as string[]);
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }), []);
    const fieldValue = map(poApprovalsState?.getApprovals, "approver.id");
    formState?.setFieldValue(`${name}`, fieldValue, true);
    documentStatus = document?.status as any;
    // Should be disabled while submitting if group levels changes while adding/editing PO items
    disabled = disabled || loading || formik?.isSubmitting;

    disabledOptions = [];
    if (formState?.inputState.get(name)?.value.length) {
      disabledOptions = isAdministrativeChange
        ? formState?.inputState.get(name)?.value
        : [workspaceState?.formInputSync?.get(PO_REQUESTOR_COMPONENT_NAME)];

      const poItems = workspaceState?.formInputSync?.get(PO_ITEMS_COMPONENT_NAME);
      if (!checkServiceOrProductPartExists(poItems)) {
        disabledOptions = [];
      }
    }

    return Component({
      ...(props as T),
      renderOption,
      isIncluded,
      approvalTransition,
      onApproveClick,
      loading,
      name,
      value,
      groups,
      approvals,
      checkedGroups,
      currentUser,
      documentStatus,
      dialogState,
      disabled,
      disabledOptions,
      disableChipDelete: !isAdministrativeChange,
    });
  };

  Comp.displayName = "withFBPOApprovals";
  return Comp;
};

