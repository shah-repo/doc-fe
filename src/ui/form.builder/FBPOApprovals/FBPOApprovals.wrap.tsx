import { Box } from "@material-ui/core";
import { compact, difference, isEmpty, map, some } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useEffect, useRef } from "react";
import { FB, FBApprovalPasswordForm, FBApprovalsStatusEndpoint, FBApprover, FBDialogState, FBPOApprovalsProps, FBRequiredApprover } from "..";
import { PO_ITEMS_COMPONENT_NAME, PO_REQUESTOR_COMPONENT_NAME } from "../../../state/ducks/documentRevisions/constants";
import { RevisionChangeType } from "../../../state/ducks/documentRevisions/types";
import { store } from "../../../state/store";
import Colors from "../../layout/theme/utils/colors";
import { checkServiceOrProductPartExists } from "../FBPurchaseOrderTable/helpers";
import FBStore from "../FBStore/FBStore";
import { usePoApprovals } from "./hooks";

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
    const { document, id, isOutput } = workspaceState || {};
    const outputId = isOutput ? id : undefined;
    const authUser = store.getState().auth.user;
    currentUser = authUser.id;
    dialogState = FB.useRef(FBDialogState);
    const isAdministrativeChange = workspaceState?.revisionChangeType === RevisionChangeType.AdministrativeChange;

    const {
      poApprovalsState,
      addApprover,
      removeApprover,
      updateApprovals,
    } = usePoApprovals(
      name,
      outputId,
    );

    const prevRequester = useRef<string>();

    isIncluded = (group: FBRequiredApprover) => some(poApprovalsState?.checkedGroups, { id: group.id });

    function includesApprover(group: FBRequiredApprover, approver: string) {
      return (group.joinedEmployees as string[]).includes(approver);
    }

    // Rendering groups beside approvers in autocomplete options
    // eslint-disable-next-line react/display-name
    renderOption = (option: FBApprover) => {
      const requiredGroups: string[] = compact(
        map(groups, (group) => includesApprover(group, option.id) ? group.name : "")
      );
      return (
        <Box display="flex" key={`fb-required-approver-${option.id}`}>
          <Box fontWeight="fontWeightMedium">{option.user?.name}</Box>
          &nbsp;({option.user?.email})
          {!isEmpty(requiredGroups) && (
            <Box color={Colors.gray}>
              &nbsp;{`- ${requiredGroups.sort().join(", ")}`}
            </Box>
          )}
        </Box>
      );
    };

    // This runs when you manually remove an approver from the list
    useEffect(() => reaction(
      () => formState?.inputState.get(name)?.value,
      (fieldValue: string[]) => {
        const formValue: string[] = map(poApprovalsState?.activeApprovals, "approver.id");

        const employeesToBeAdded = difference(fieldValue, formValue);
        if (employeesToBeAdded.length > 0) {
          addApprover(employeesToBeAdded, { manually: true });
        }

        const employeesToBeRemoved = difference(formValue, fieldValue);
        if (employeesToBeRemoved.length > 0) {
          removeApprover(employeesToBeRemoved);
        }
        if (FBStore?.typeChangeBeforeApprovals.length) {
          const ApproverIDs: string[] = map(FBStore?.typeChangeBeforeApprovals, "approver.id");
          if (ApproverIDs.length > 0) {
            addApprover(ApproverIDs, { manually: true });
            FBStore.typeChangeBeforeApprovals = [];
          }
        }
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

    // On revisionChangeType change.
    useEffect(() => reaction(
      () => workspaceState?.revisionChangeType,
      () => {
        if (workspaceState) {
          updateApprovals({ prevRequester: prevRequester.current });
        }
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // On requester change.
    useEffect(() => reaction(
      () => workspaceState?.formInputSync?.get(PO_REQUESTOR_COMPONENT_NAME),
      (requester) => {
        if (workspaceState) {
          updateApprovals({ prevRequester: prevRequester.current });
        }
        prevRequester.current = requester;
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

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
      approvals = poApprovalsState?.activeApprovals;
      checkedGroups = poApprovalsState?.checkedGroups;

      loading = (
        poApprovalsState?.loading ||
        poApprovalsState?.approvalApi.loading ||
        poApprovalsState?.transitionApi.loading
      );

      disabledOptions = isAdministrativeChange
        ? formState?.inputState.get(name)?.value
        : [workspaceState?.formInputSync?.get(PO_REQUESTOR_COMPONENT_NAME)];
    });

    const fieldValue = map(poApprovalsState?.activeApprovals, "approver.id");

    formState?.setFieldValue(`${name}`, fieldValue, true);
    documentStatus = document?.status;

    const poItems = workspaceState?.formInputSync?.get(PO_ITEMS_COMPONENT_NAME);
    if (!checkServiceOrProductPartExists(poItems)) {
      disabledOptions = [];
    }

    disabled = disabled || loading;

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

