import { Box } from "@material-ui/core";
import { compact, difference, isEmpty, isEqual, map, some } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { FB, FBApprovalPasswordForm, FBApprovalsStatusEndpoint, FBApprover, FBDialogState, FBPOApprovalsProps, FBRequiredApprover } from "..";
import { documentRevisionsSelectors } from "../../../state/ducks/documentRevisions";
import { PO_ITEMS_COMPONENT_NAME, PO_REQUESTOR_COMPONENT_NAME } from "../../../state/ducks/documentRevisions/constants";
import { RevisionChangeType } from "../../../state/ducks/documentRevisions/types";
import { ApplicationState } from "../../../state/reducers";
import { store } from "../../../state/store";
import { canEditDocumentRevision } from "../../documentRevision/helpers/documentRevisionPermissions";
import Colors from "../../layout/theme/utils/colors";
import { checkServiceOrProductPartExists } from "../FBPurchaseOrderTable/helpers";
import FBDataStore from "../FBStore/FBDataStore";
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
    ...props
  }: T) => {
    const { workspaceState, formState } = FB.useStores();
    const { document, id, isOutput } = workspaceState || {};
    const outputId = isOutput ? id : undefined;
    const authUser = store.getState().auth.user;
    currentUser = authUser.id;
    dialogState = FB.useRef(FBDialogState);
    const documentRevision = useSelector((state: ApplicationState) =>
      documentRevisionsSelectors.getDocumentRevision(state, document?.id || ""));
    const isCurrentUserOperator = some(document?.document.operators, ["user.email", authUser.email ]);
    const canEditDocRev = document && canEditDocumentRevision(documentRevision, authUser.email, isCurrentUserOperator);

    const {
      poApprovalsState,
      addApprover,
      removeApprover,
      updateApprovals,
      fetchRequiredGroups,
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

    useObserver(() => {
      groups = poApprovalsState?.groups;
      approvals = poApprovalsState?.activeApprovals;
      checkedGroups = poApprovalsState?.checkedGroups;
      loading = poApprovalsState?.busy;
      disabled = disabled || loading;

      const poItems = workspaceState?.formInputSync?.get(PO_ITEMS_COMPONENT_NAME);
      const requestor = workspaceState?.formInputSync?.get(PO_REQUESTOR_COMPONENT_NAME);
      const isAdministrativeChange = workspaceState?.revisionChangeType === RevisionChangeType.AdministrativeChange;
      const disableRequestorApprovalDeletion = !isAdministrativeChange && checkServiceOrProductPartExists(poItems);
      disabledOptions = disableRequestorApprovalDeletion ? [requestor] : [];
    });

    // This runs when you manually remove an approver from the list
    useEffect(() => reaction(
      () => formState?.inputState.get(name)?.value,
      (formValue) => {
        if (typeof formValue !== "object") {
          formState?.setFieldValue(name, map(poApprovalsState?.activeApprovals, "approver.id"), true);
          return formState?.getInputState(name)?.setRender();
        }
        const stateValue = map(poApprovalsState?.activeApprovals, "approver.id");

        const employeesToBeAdded = difference(formValue, stateValue);
        const employeesToBeRemoved = difference(stateValue, formValue);

        if (employeesToBeAdded.length > 0) {
          addApprover(employeesToBeAdded, { manually: true });
          return;
        }

        if (employeesToBeRemoved.length > 0) {
          removeApprover(employeesToBeRemoved);
          return;
        }

        formState?.getInputState(name)?.setRender();
      },
      {
        equals: isEqual,
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // Store previous requester value
    useEffect(
      () => {
        prevRequester.current = workspaceState?.formInputSync?.get(PO_REQUESTOR_COMPONENT_NAME);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );

    // On revisionChangeType change
    useEffect(() => reaction(
      () => FBDataStore.revisionChangeType,
      (revisionChangeType) => {
        if (revisionChangeType) {
          Promise.resolve(fetchRequiredGroups()).then(() => {
            updateApprovals({ prevRequester: prevRequester.current });
          });
        }
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // On requester change
    useEffect(() => reaction(
      () => workspaceState?.formInputSync?.get(PO_REQUESTOR_COMPONENT_NAME),
      (requester) => {
        if (workspaceState && canEditDocRev) {
          updateApprovals({ prevRequester: prevRequester.current });
        }
        prevRequester.current = requester;
      },
      {
        fireImmediately: true,
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    useEffect(() => reaction(
      () => poApprovalsState?.busy,
      () => {
        formState?.getInputState(name)?.setRender();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    formState?.setFieldValue(name, map(poApprovalsState?.activeApprovals, "approver.id"), true);

    documentStatus = document?.status;

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
    });
  };

  Comp.displayName = "withFBPOApprovals";
  return Comp;
};

