import { Box } from "@material-ui/core";
import { compact, isEmpty, map } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBApprovalsState, FBApprover, FBRequiredApprover } from "..";
import { Approval } from "../../../state/ducks/common";
import { store } from "../../../state/store";
import { toastError } from "../../components/notifications";
import { FBApprovalsProps, FBApprovalsStatusEndpoint } from "./FBApprovals.types";

/* Hack for approvals being added twice.
TODO: Remove once the double mounting problem is fixed. */
let tempId = "";

export const withFBApprovals = <T extends FBApprovalsProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    approvals,
    name,
    loading,
    disabled,
    documentStatus,
    docId,
    changeApprovalStatus,
    groups,
    renderOption,
    isIncluded,
    currentEmployeeId,
    ownerId,
    ...props
  }: T) => {

    const { workspaceState, formState } = FB.useStores();
    const {
      document,
      changeRequest,
      id,
    } = workspaceState || {};
    const approvalsState = FB.useRef(
      FBApprovalsState,
      { id, approvals: document?.approvals || changeRequest?.approvals },
    );
    disabled = loading || !id;

    ownerId = document?.owner?.id || changeRequest?.owner?.id;
    currentEmployeeId = store.getState().auth.user.employeeId;

    changeApprovalStatus = (transition: FBApprovalsStatusEndpoint, approvalId: string) => {
      approvalsState?.applyTransition(transition, approvalId);
    };

    function includesApprover(group: FBRequiredApprover, approver: string): boolean {
      return (group.joinedEmployees as string[]).includes(approver);
    }

    isIncluded = (group: FBRequiredApprover): boolean =>
      group.joinedEmployees.some((employee) =>
        approvalsState?.approvals?.map((approval) => approval.approver.id).includes(employee));

    // eslint-disable-next-line react/display-name
    renderOption = (option: FBApprover) => {
      const requiredGroups: string [] =
        compact(map(groups, (group) => includesApprover(group, option.id) ? group.name : ""));
      return (
        <Box display="flex" key={`fb-required-approver-${option.id}`}>
          <b>{option.user?.name}</b>&nbsp; ({option.user?.email})
          {!isEmpty(requiredGroups) && (
            <Box>
              &nbsp;{`- ${requiredGroups.join(", ")}`}
            </Box>
          )}
        </Box>
      );
    };

    React.useEffect(() => {
      reaction(
        () => formState?.inputState.get(name || "")?.value,
        (data) => {
          if (!id) {
            toastError("Please save the document first.");
            return;
            /* Condition below is a hack for approvals being added twice.
            TODO: Remove once the double mounting problem is fixed. */
          } else if (data.id !== tempId) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            tempId = data.id;
            approvalsState?.addApproval({
              assigned: {
                id: data.id,
              },
              partOf: { id },
            } as Approval);
          }
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useObserver(() => {
      groups = approvalsState?.groups;
      approvals = approvalsState?.approvals;
    });


    return Component({
      ...(props as T),
      approvalsState,
      approvals,
      name,
      loading,
      disabled,
      formState,
      documentStatus: document?.status,
      docId: id,
      changeApprovalStatus,
      groups,
      renderOption,
      isIncluded,
      currentEmployeeId,
      ownerId,
    });
  };

  Comp.displayName = "withFBApprovals";
  return Comp;
};
