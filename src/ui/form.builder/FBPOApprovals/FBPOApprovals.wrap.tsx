import { Box } from "@material-ui/core";
import { compact, difference, filter, find, isEmpty, map, unionBy } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBApprover, FBInlineApprovalBody, FBRequiredApprover } from "..";
import Colors from "../../layout/theme/utils/colors";
import FBPOApprovalsState from "./FBPOApprovals.state";
import { FBPOApprovalsProps } from "./FBPOApprovals.types";

export const withFBPOApprovals = <T extends FBPOApprovalsProps>(
  Component: React.FunctionComponent<T>,
) => {

  const Comp = ({
    renderOption,
    isIncluded,
    name = "",
    loading,
    value,
    groups,
    approvals,
    checkedGroups,
    ...props
  }: T) => {
    const { workspaceState, formState } = FB.useStores();
    const { document, changeRequest, id, isOutput } = workspaceState || {};
    const outputId = isOutput ? id : null;

    const poApprovalsState = FB.useRef(
      FBPOApprovalsState,
      { id: outputId, approvals: document?.approvals || changeRequest?.approvals },
    );

    function concatApprovals(approval?: FBInlineApprovalBody) {
      if (!approval) { return; }
      if (approval.status === "REJECTED" || approval.status === "APPROVED") {
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

    // On add approver
    React.useEffect(() => reaction(
      () => poApprovalsState?.approvalApi.data,
      (data) => concatApprovals(data)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    React.useEffect(() => reaction(
      () => formState?.inputState.get("fb-po-approvals-" + name)?.value,
      (fieldValue: string[]) => {
        const formValue: string[] = map(poApprovalsState?.getApprovals, "approver.id");
        addApprover(difference(fieldValue, formValue));
        removeApprover(difference(formValue, fieldValue));
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    function addApprover(ids?: string[]) {
      if (!id) { return; }
      if (!ids) { return; }
      // Groups that selected approver can sign
      const approversGroups = compact(map(poApprovalsState.groups, (group) =>
        includesApprover(group, ids[0]) ? group : ""));
      console.log(approversGroups);


      map(ids, (approver) => poApprovalsState?.addApproval({
        assigned: { id: approver },
        type: "MASTER",
        fieldId: name,
        partOf: { id },
        // Needs to be added signatureGroupName
      }));
    }

    function removeApprover(ids?: string[]) {
      if (!ids) { return; }
      map(ids, (approver) => {
        const approval = find(poApprovalsState?.getApprovals, (a) => a.approver?.id === approver);
        poApprovalsState?.applyTransition("abandon", (approval as FBInlineApprovalBody)?.id);
      });
    }

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
    formState?.setFieldValue(`fb-po-approvals-${name}`, fieldValue);

    return Component({
      ...(props as T),
      renderOption,
      isIncluded,
      loading,
      name,
      value,
      groups,
      approvals,
      checkedGroups,
    });
  };

  Comp.displayName = "withFBPOApprovals";
  return Comp;
};

