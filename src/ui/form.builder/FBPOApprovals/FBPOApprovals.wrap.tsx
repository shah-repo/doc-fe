import { Box } from "@material-ui/core";
import { useFormikContext } from "formik";
import { compact, difference, filter, find, includes, isEmpty, map, minBy, unionBy } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useEffect } from "react";
import { FB, FBApprovalPasswordForm, FBApprovalsStatusEndpoint, FBApprover, FBDialogState, FBInlineApprovalBody, FBPOApprovalsProps, FBPurchaseOrderValue, FBRequiredApprover } from "..";
import { GroupType } from "../../../state/ducks/auth/types";
import { PO_REQUESTOR_COMPONENT_NAME } from "../../../state/ducks/documentRevisions/constants";
import { RevisionChangeType } from "../../../state/ducks/documentRevisions/types";
import { ApprovalStatus, DocumentStatus } from "../../../state/ducks/documents/types";
import { store } from "../../../state/store";
import { isDocumentRevisionInDraft } from "../../documentRevision/helpers/documentRevisionStatus";
import useDidMount from "../../hooks/useDidMount";
import Colors from "../../layout/theme/utils/colors";
import FBPOApprovalsState from "./FBPOApprovals.state";

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
    const { isSubmitting } = useFormikContext();
    const { document, changeRequest, id, isOutput } = workspaceState || {};
    const outputId = isOutput ? id : null;
    const poName = workspaceState?.schema?.find((item) => item.type === "purchaseorder")?.name || "";
    const authUser = store.getState().auth.user;
    currentUser = authUser.id;
    dialogState = FB.useRef(FBDialogState);
    const isAdministrativeChange = workspaceState?.revisionChangeType === RevisionChangeType.AdministrativeChange;
    const updateApprovers = isDocumentRevisionInDraft(document?.status) && !isAdministrativeChange;
    let deletedRequestor = "";
    const poApprovalsState = FB.useRef(
      FBPOApprovalsState,
      { id: outputId, approvals: document?.approvals || changeRequest?.approvals },
    );
    const didMount = useDidMount();

    isIncluded = (group: FBRequiredApprover): boolean =>
      (includes(map(poApprovalsState?.checkedGroups, "id"), group.id));

    const getApprovals = (approvals) => approvals.filter((data) => data.status !== ApprovalStatus.Abandoned);
    function concatApprovals(approval?: FBInlineApprovalBody) {
      if (!approval) { return; }
      if (approval.status === ApprovalStatus.Rejected || approval.status === ApprovalStatus.Approved) {
        window.location.reload();
      } else {
        const stateApprovals = filter(poApprovalsState?.approvals, (a) => a.approver?.id !== approval.approver?.id);
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

    React.useEffect(() => reaction(
      () => workspaceState?.formInputSync?.get(poName),
      () => {
        outputId && poApprovalsState.fetchRequiredApprovals(outputId as unknown as string[]);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    const checkLineItems = (poItems: FBPurchaseOrderValue, requester: string) => {
      const approvers = map(poApprovalsState?.getApprovals, "approver.id");
      const proceedToNewReq = poItems.items.some((item) =>
        item.type === "service" || (item.type === "product" && item.partNumberDocId)
      );
      if (!proceedToNewReq) { return false; }
      if (updateApprovers && requester && proceedToNewReq && !approvers?.includes(requester)) {
        addApprover([requester]);
      } else if (updateApprovers && !requester && approvers?.includes(deletedRequestor)) {
        removeApprover([deletedRequestor]);
      } else if (updateApprovers && requester && !proceedToNewReq && approvers?.includes(requester)) {
        removeApprover([deletedRequestor]);
      }
    };

    // On required approval API call
    React.useEffect(() => reaction(
      () => poApprovalsState.getIsRequiredApprovals,
      () => {
        const approvers = map(poApprovalsState?.getApprovals, "approver.id");
        const poItems = workspaceState?.formInputSync?.get("po-items-built-in");
        // eslint-disable-next-line react-hooks/exhaustive-deps
        deletedRequestor = workspaceState?.formInputSync?.get(PO_REQUESTOR_COMPONENT_NAME);
        if (poItems && poItems.items.length) {
          checkLineItems(
            poItems,
            workspaceState?.revisionChangeType ===
              RevisionChangeType.AdministrativeChange
              ? ""
              : deletedRequestor
          );
        } else if (approvers?.includes(deletedRequestor)) {
          checkLineItems(poItems, "");
        }
      }
    ), []);

    // On add approver
    React.useEffect(() => reaction(
      () => poApprovalsState?.approvalApi.data,
      (data) => concatApprovals(data)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    React.useEffect(() => reaction(
      () => poApprovalsState?.transitionApi.data,
      (data) => {
        const filteredApprovals: FBInlineApprovalBody[] = compact(map(poApprovalsState.approvals, (approval) =>
          approval.approverId === data?.approverId ? data : approval
        ));
        poApprovalsState.setApprovals(getApprovals(filteredApprovals));
        if (data?.status === ApprovalStatus.Approved || data?.status === DocumentStatus.Draft) {
          window.location.reload();
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    React.useEffect(() => reaction(
      () => formState?.inputState.get(name)?.value,
      (fieldValue: string[]) => {
        const formValue: string[] = map(poApprovalsState?.getApprovals, "approver.id");
        const employeesToBeAdded = difference(fieldValue, formValue);
        employeesToBeAdded.length > 0 && addApprover(employeesToBeAdded);
        const employeesToBeRemoved = difference(formValue, fieldValue);
        employeesToBeRemoved.length > 0 && removeApprover(employeesToBeRemoved);
        formState?.getInputState(name)?.setRender();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    React.useEffect(() => reaction(
      () => workspaceState?.formInputSync?.get(PO_REQUESTOR_COMPONENT_NAME),
      (requestor) => {
        const poItems = workspaceState?.formInputSync?.get("po-items-built-in");
        if (!requestor) {
          checkLineItems(poItems, requestor);
          formState?.getInputState(name)?.setRender();
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);
    React.useEffect(() => {
      if (didMount) {
        const poItems = workspaceState?.formInputSync?.get("po-items-built-in");
        const requestor = workspaceState?.formInputSync?.get(PO_REQUESTOR_COMPONENT_NAME);
        if (requestor) {
          checkLineItems(poItems, requestor);
          formState?.getInputState(name)?.setRender();
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkGroups = (id: string) => {
      const approversGroups = compact(map(poApprovalsState.groups, (group) =>
        (group.joinedEmployees as string[]).includes(id) ? group : ""));
      const poamGroups = approversGroups.filter((group) => group.type === GroupType.PURCHASE_APPROVAL);
      const damGroups = approversGroups.filter((group) => group.type === GroupType.REVISION_APPROVAL);

      if (isEmpty(poApprovalsState.checkedGroups)) {
        const groupToSign = minBy(poamGroups, "documentStage");
        poApprovalsState.setCheckedGroups(groupToSign);
        if (damGroups) {
          const damsToSign = difference(damGroups, poApprovalsState.checkedGroups || []);
          damsToSign.map((dam) => poApprovalsState.setCheckedGroups((dam)));
        }
        return groupToSign?.name;
      } else {
        const sign = minBy(difference(poamGroups, poApprovalsState.checkedGroups || []), "documentStage");
        poApprovalsState.setCheckedGroups(sign);
        if (damGroups) {
          const damsToSign = difference(damGroups, poApprovalsState.checkedGroups || []);
          damsToSign.map((dam) => poApprovalsState.setCheckedGroups((dam)));
        }
        return sign?.name;
      }
    };

    function addApprover(ids?: string[]) {
      if (!id) { return; }
      if (!ids) { return; }
      const groupName = checkGroups(ids[0]);
      map(ids, (approver) => poApprovalsState?.addApproval({
        assigned: { id: approver },
        type: "MASTER",
        fieldId: name,
        partOf: { id },
        signatureGroupName: groupName,
      }));
    }

    function removeApprover(ids?: string[]) {
      if (!ids) { return; }
      if (formState?.workspaceMode === "preview") { return; }
      map(ids, (approver) => {
        const approval = find(poApprovalsState?.getApprovals, (a) => a.approver?.id === approver);
        poApprovalsState?.removeCheckedGroups(approval?.signatureGroupName);
        poApprovalsState?.applyTransition("abandon", (approval as FBInlineApprovalBody)?.id);
      });
    }

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
      }), []);
    const fieldValue = map(poApprovalsState?.getApprovals, "approver.id");
    formState?.setFieldValue(`${name}`, fieldValue, true);
    documentStatus = document?.status as any;
    // Should be disabled while submitting if group levels changes while adding/editing PO items
    disabled = disabled || loading || isSubmitting;

    disabledOptions = [];
    if (formState?.inputState.get(name)?.value.length) {
      disabledOptions = isAdministrativeChange
        ? formState?.inputState.get(name)?.value
        : [workspaceState?.formInputSync?.get(PO_REQUESTOR_COMPONENT_NAME)];

      const poItems = workspaceState?.formInputSync?.get("po-items-built-in");
      const proceedToNewReq = poItems.items.some((item) =>
        item.type === "service" || (item.type === "product" && item.partNumberDocId)
      );
      if (!proceedToNewReq) {
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

