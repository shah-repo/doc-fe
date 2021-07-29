import { Box } from "@material-ui/core";
import { useFormikContext } from "formik";
import { compact, difference, filter, find, includes, isEmpty, map, minBy, unionBy } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBApprovalPasswordForm, FBApprovalsStatusEndpoint, FBApprover, FBDialogState, FBInlineApprovalBody, FBPOApprovalsProps, FBRequiredApprover } from "..";
import { GroupType } from "../../../state/ducks/auth/types";
import { ApprovalStatus, DocumentStatus } from "../../../state/ducks/documents/types";
import { store } from "../../../state/store";
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
    ...props
  }: T) => {
    const { workspaceState, formState } = FB.useStores();
    const { isSubmitting } = useFormikContext();
    const { document, changeRequest, id, isOutput, formInput } = workspaceState || {};
    const outputId = isOutput ? id : null;
    const poName = workspaceState?.schema?.find((item) => item.type === "purchaseorder")?.name || "";
    const totalAmount = formInput?.[poName]?.totalAmount;
    const revisionChangeType = document?.revisionChangeType;
    const revisionStage = document?.revisionStage;
    const authUser = store.getState().auth.user;
    currentUser = authUser.id;
    dialogState = FB.useRef(FBDialogState);

    const poApprovalsState = FB.useRef(
      FBPOApprovalsState,
      { id: outputId, approvals: document?.approvals || changeRequest?.approvals },
    );

    isIncluded = (group: FBRequiredApprover): boolean =>
      (includes(map(poApprovalsState?.checkedGroups, "id"), group.id));

    function concatApprovals(approval?: FBInlineApprovalBody) {
      if (!approval) { return; }
      if (approval.status === ApprovalStatus.Rejected || approval.status === ApprovalStatus.Approved) {
        window.location.reload();
      } else {
        const stateApprovals = filter(poApprovalsState?.approvals, (a) => a.approver?.id !== approval.approver?.id);
        poApprovalsState?.setApprovals(unionBy(stateApprovals, [approval], "id"));
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


    React.useEffect(() => {
      outputId && poApprovalsState.fetchRequiredApprovals(outputId as unknown as string[]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalAmount, revisionChangeType, revisionStage]);

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
        poApprovalsState.setApprovals(filteredApprovals);
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
        addApprover(difference(fieldValue, formValue));
        removeApprover(difference(formValue, fieldValue));
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

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
    const fieldValue = map(poApprovalsState?.getApprovals, "approver.id");
    formState?.setFieldValue(`${name}`, fieldValue);
    documentStatus = document?.status as any;
    // Should be disabled while submitting if group levels changes while adding/editing PO items
    disabled = disabled || loading || isSubmitting;

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
    });
  };

  Comp.displayName = "withFBPOApprovals";
  return Comp;
};

