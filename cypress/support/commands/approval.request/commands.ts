/* eslint-disable @typescript-eslint/no-namespace */


/* eslint-disable max-len */
import { bool } from "aws-sdk/clients/signer";
import moment from "moment";
import "moment-timezone";
import { ChangeRequestEditRequestBody } from "../../../../src/state/ducks/changeRequest/types";
import { SQS_TYPES } from "../../../../src/ui/async.tasks/types";
import { encodeString } from "../../../utils/context/converers";
import { CONFIG } from "../../config";
import { CyRoutes } from "../../routes";

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      arSelectARForm(params: { formTitle: string }): Chainable<Subject>;
      arEnterApprovalRequestTitle(params: { title: string }): Chainable<Subject>;
      arEnterApprovalRequestDescription(params: { description: string }): Chainable<Subject>;
      arClickAddDocument(): Chainable<Subject>;
      arAddItems(): Chainable<Subject>;
      arClickAddDocumentWithoutApi(): Chainable<Subject>;
      arChoseSpecificProposedDocument(params: { name: string }): Chainable<Subject>;
      arSelectItem(params: { name: string }): Chainable<Subject>;
      arEnterDescriptionAddDocumentsDialog(params: { description: string }): Chainable<Subject>;
      arEnterItemDescription(params: { description: string }): Chainable<Subject>;
      arEnterJustificationAddDocumentsDialog(params: { justification: string }): Chainable<Subject>;
      arEnterItemJustification(params: { justification: string }): Chainable<Subject>;
      arClickAddBtnOnAddDocumentsDialog(): Chainable<Subject>;
      arClickAddItemDone(): Chainable<Subject>;
      arAddApproverOnApproverList(params: { approver: string; noWait?: bool }): Chainable<Subject>;
      arAddApproverOnApproverListWithoutApi(params: { approver: string; noWait?: bool }): Chainable<Subject>;
      arAddApproverOnApproverListWithoutApiCall(params: { approver: string; noWait?: bool  }): Chainable<Subject>;
      arClickCreateApprovalRequestAfterCompletingForm(): Chainable<Subject>;
      arClickSendToReview(): Chainable<Subject>;
      arClickSendToReviewWithoutApi(): Chainable<Subject>;
      arVerifyStatus(params: { status: string }): Chainable<Subject>;
      arCheckImplementationTaskStatus(params: { status: string }): Chainable<Subject>;
      arClickOnFirstAddedDocument(): Chainable<Subject>;
      arFilterARListByNameAndStatus(params: { title: string; status: string }): Chainable<Subject>;
      arFilterARListByNameAndStatusWithoutApi(params: { title: string; status: string }): Chainable<Subject>;
      arApproveAR(): Chainable<Subject>;
      arApproveARWithoutApi(): Chainable<Subject>;
      arSetTimeTravelInDays(params: { days: number }): Chainable<Subject>;
      arApproveARFromDashboard(): Chainable<Subject>;
      arApproveARFromDashboardWithoutApi(): Chainable<Subject>;
      arClearFilters(): Chainable<Subject>;
      arCheckTitleInEditableAndMatches(params: { name: string }): Chainable<Subject>;
      arWithdrawSubmission(): Chainable<Subject>;
      arWithdrawSubmissionWithoutApi(): Chainable<Subject>;
      arIsProposedDocumentEmpty(): Chainable<Subject>;
      arRejectComfirmationAR(): Chainable<Subject>;
      arRejectComfirmationARNew(): Chainable<Subject>;
      arSelectFirstDocument(): Chainable<Subject>;
      arSelectFirstDocumentWithoutApi(): Chainable<Subject>;
      arCreateApprovalRequest(params: {payload: ChangeRequestEditRequestBody; employeeId: string; sessionId: string}): Chainable<Subject>;
      arGetArDocumentByName(params: {employeeId: string; sessionId: string; name: string}): Chainable<Subject>;
      arCloseAR(): Chainable<Subject>;
      arCloseARWithoutApi(): Chainable<Subject>;
      arCloseARFromMenu(): Chainable<Subject>;
      arVoidAR(): Chainable<Subject>;
      arSaveApiCall(): Chainable<Subject>;
      arSaveApiCallWithoutApi(): Chainable<Subject>;
      arCheckDashboardARNotificationExistance(params: {shouldExist: boolean}): Chainable<Subject>;
      arVerifySignatureIsNotMet(): Chainable<Subject>;
      arApproverRoleStatus(params: {roleName: string; enabled: boolean}): Chainable<Subject>;
      arInReview(params: {arID: string; employeeId: string; sessionId: string}): Chainable<Subject>;
      arApprove(params: {arID: string; employeeId: string; sessionId: string}): Chainable<Subject>;
      arClose(params: {arID: string; employeeId: string; sessionId: string}): Chainable<Subject>;
      approvals(params: {
        assignedEmployeeId: string;
        fieldId: string;
        recordId: string;
        employeeId: string;
        sessionId: string;
      }): Chainable<Subject>;
      approvalSubmitForApproval(params: {docRevId: string; employeeId: string; sessionId: string}): Chainable<Subject>;
      approvalApprove(params: {
        approvalsId: string;
        employeeId: string;
        sessionId: string;
      }): Chainable<Subject>;
      arPatchAR(params: {
        payload: ChangeRequestEditRequestBody;
        arID: string;
        employeeId: string;
        sessionId: string;
      }): Chainable<Subject>;
      arClickCreateAnAR(): Chainable<Subject>;
      arSelectItemsTab(): Chainable<Subject>;
      arSelectChangeDetailsTab(): Chainable<Subject>;
      arSelectApprovalTab(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("arClickCreateAnAR", () => {
  cy.get("[data-cy=\"change.request.create\"]").arrowClick();
});

Cypress.Commands.add("arCheckDashboardARNotificationExistance", (params: {shouldExist: boolean}) => {
  cy.get("[data-cy=\"pendingActionsAR\"]").should(params.shouldExist ? "exist" : "not.exist");
});

Cypress.Commands.add("arPatchAR", (params: {
  payload: ChangeRequestEditRequestBody;
  arID: string;
  employeeId: string;
  sessionId: string;
}) => {
  cy.request({
    method: "PATCH",
    url: `${CONFIG.BE_URL}/api/v1/change_requests/${params.arID}`,
    body: params.payload,
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
  }).then((response) => response.body);
});

Cypress.Commands.add("arCreateApprovalRequest", (params: {
  payload: ChangeRequestEditRequestBody;
  employeeId: string;
  sessionId: string;
}) => {
  cy.request({
    method: "POST",
    url: `${CONFIG.BE_URL}/api/v1/change_requests`,
    body: params.payload,
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
  }).then((response) => response.body);
});

Cypress.Commands.add("arInReview", (params: {
  arID: string;
  employeeId: string;
  sessionId: string;
}) => {
  cy.request({
    method: "POST",
    url: `${CONFIG.BE_URL}/api/v1/change_requests/${params.arID}/in_review`,
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
  }).then((response) => response.body);
});

Cypress.Commands.add("approvalSubmitForApproval", (params: {
  docRevId: string;
  employeeId: string;
  sessionId: string;
}) => {
  cy.request({
    method: "POST",
    url: `${CONFIG.BE_URL}/api/v1/document_revisions/in_review/${params.docRevId}`,
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
  }).then((response) => response.body);
});

Cypress.Commands.add("arApprove", (params: {
  arID: string;
  employeeId: string;
  sessionId: string;
}) => {
  cy.request({
    method: "POST",
    url: `${CONFIG.BE_URL}/api/v1/change_requests/${params.arID}/approve`,
    headers: {
      Authorization: `bearer_password ${params.employeeId}:${params.sessionId}:${encodeString(CONFIG.DEFAULT_ENLIL_USER_PASSWORD)}`,
    },
    body: {
      password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
    },
  }).then((response) => response.body);
});

Cypress.Commands.add("approvalApprove", (params: {
  approvalsId: string;
  employeeId: string;
  sessionId: string;
}) => {
  cy.request({
    method: "POST",
    url: `${CONFIG.BE_URL}/api/v1/approvals/${params.approvalsId}/approve`,
    headers: {
      Authorization: `bearer_password ${params.employeeId}:${params.sessionId}:${encodeString(CONFIG.DEFAULT_ENLIL_USER_PASSWORD)}`,
    },
    body: {
      password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
    },
  }).then((response) => response.body);
});

Cypress.Commands.add("arClose", (params: {
  arID: string;
  employeeId: string;
  sessionId: string;
}) => {
  cy.request({
    method: "POST",
    url: `${CONFIG.BE_URL}/api/v1/change_requests/${params.arID}/closed`,
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
    body: {
      effectiveDate: moment().tz("America/Los_Angeles").toISOString(),
    },
  }).then((response) => response.body);
});

Cypress.Commands.add("approvals", (params: {
  assignedEmployeeId: string;
  fieldId: string;
  recordId: string;
  employeeId: string;
  sessionId: string;
}) => {
  cy.request({
    method: "POST",
    url: `${CONFIG.BE_URL}/api/v1/approvals`,
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
    body: {
      assigned: {
        id: params.assignedEmployeeId,
      },
      type: "MASTER",
      fieldId: params.fieldId,
      partOf: {
        id: params.recordId,
      },
    },
  }).then((response) => response.body);
});

Cypress.Commands.add("arGetArDocumentByName", (params: {
  employeeId: string;
  sessionId: string;
  name: string;
}) => {
  cy.request({
    method: "GET",
    url: `${CONFIG.BE_URL}/api/v1/document_revisions`,
    qs: {
      name: params.name,
    },
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
  }).then((response) => response.body);
});

Cypress.Commands.add("arEnterApprovalRequestTitle", (params: {title: string }) => {
  cy.get("[data-cy=\"field-title\"]").arrowClick();
  cy.get("#Title-field input").invoke("val", "").arrowType(params.title).unClick();
});

Cypress.Commands.add(`arVerifySignatureIsNotMet`, (params: {title: string }) => {
  cy.get(`.MuiListItemText-dense`).first().trigger("mouseover");
  cy.get(`[data-cy="transition-approve"]`).first().trigger("mouseover");
  cy.get(`[data-cy="transition-approve"]`).first().arrowClick();
  cy.get(`[data-cy="transition.action.password"]`).arrowType("wrongPassword");
  cy.wrapWithWaitOnApiCall(CyRoutes.ChangeRequestApprove, () => {
    cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
  });
  cy.checkToastMessage({ exists: true });
});

Cypress.Commands.add("arCheckImplementationTaskStatus", (params: {status: string }) => {
  cy.get("[data-cy=\"form.builder.status\"]").contains(params.status);
});

Cypress.Commands.add("arClearFilters", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.PostChangeRequestsSearch, () => {
    cy.get("[data-cy=\"clearFilter\"]").arrowClick();
  });

  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("arEnterApprovalRequestDescription", (params: { description: string }) => {
  cy.get("[class^=\"public-DraftStyleDefault-block\"]").arrowClick().clear();
  cy.get("[class^=\"public-DraftStyleDefault-block\"]").arrowType(params.description);
  cy.wait(2000);
});

Cypress.Commands.add("arSelectARForm", (params: { formTitle: string }) => {
  cy.get(`div[data-cy="field-select-form"]>#FormList-selectForm div[class*="-control"]`).arrowClick({ force: true });
  cy.get("div[id^=react-select]").contains(params.formTitle).arrowClick({ force: true });
  cy.get("[data-cy='create.approval.request.continue']").arrowClick({ force: true });
  cy.wait(7000);
});

Cypress.Commands.add("arClickAddDocument", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetAutocompleteOptions, () => {
    cy.contains("Add Item").arrowClick();
  });
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("arClickAddDocumentWithoutApi", () => {
  cy.contains("Add Item").arrowClick();
  cy.listLoadingElementShouldNotExist();
  cy.progressBarShouldNotExist();
});

Cypress.Commands.add("arAddItems", () => {
  cy.contains("Add Item").arrowClick();
  cy.listLoadingElementShouldNotExist();
  cy.progressBarShouldNotExist();
});

Cypress.Commands.add("arCloseAR", () => {
  cy.get("[aria-label=closed]").arrowClick();
  cy.wrapWithWaitOnApiCalls(
    [CyRoutes.PostCloseAR, CyRoutes.ARPreview], () => {
      cy.get("[data-cy=AlertDialog-continueButton]").arrowClick();
    });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("arCloseARWithoutApi", () => {
  cy.get("[aria-label=closed]").arrowClick();
  cy.get("[data-cy=AlertDialog-continueButton]").arrowClick();
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("arChoseSpecificProposedDocument", (params: { name: string }) => {
  cy.get("[data-cy=\"proposedDocumentRevision\"]").autocompleteSelect(params.name);
});

Cypress.Commands.add("arSelectItem", (params: { name: string }) => {
  cy.get("[data-cy=\"proposedDocumentRevision\"]").arrowClick();
  cy.get("[data-cy=\"proposedDocumentRevision\"]").autocompleteSelect(params.name);
  cy.unClick();
});

Cypress.Commands.add("arEnterDescriptionAddDocumentsDialog", (params: { description: string }) => {
  cy.get("[data-cy=\"descriptionOfChange\"]").arrowClick().arrowType(params.description).wait(500);
});

Cypress.Commands.add("arEnterItemDescription", (params: { description: string }) => {
  cy.get("[data-cy=\"descriptionOfChange\"]").arrowClick().arrowType(params.description).wait(500);
});

Cypress.Commands.add("arEnterJustificationAddDocumentsDialog", (params: { justification: string }) => {
  cy.get("[data-cy=\"justificationOfChange\"]").arrowClick().arrowType(params.justification).wait(500);
});

Cypress.Commands.add("arEnterItemJustification", (params: { justification: string }) => {
  cy.get("[data-cy=\"justificationOfChange\"]").arrowClick().arrowType(params.justification).wait(500);
  cy.unClick();
});

Cypress.Commands.add("arClickAddBtnOnAddDocumentsDialog", () => {
  cy.get("[data-cy='doneRecord']").arrowClick();
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("arClickAddItemDone", () => {
  cy.get("[data-cy='doneRecord']").arrowClick();
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
  cy.wait(3000);
});

Cypress.Commands.add("arAddApproverOnApproverList", (params: { approver: string; noWait?: bool }) => {
  const routesToWait = params.noWait ? [] : [CyRoutes.PatchAR, CyRoutes.ArAudit];
  cy.listLoadingElementShouldNotExist();
  cy.wrapWithWaitOnApiCalls(
    routesToWait, () => {
      cy.get("[data-cy=\"fb-approvers-approvers\"]").arrowClick({ force: true });
      cy.get("ul>li[role=option]").contains(params.approver).arrowClick({ force: true });
      cy.unClick().wait(500);
    });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("arAddApproverOnApproverListWithoutApi", (params: { approver: string; noWait?: bool }) => {
  cy.listLoadingElementShouldNotExist();
  cy.get("[data-cy=\"fb-approvers-approvers\"]").arrowClick({ force: true });
  cy.get("ul>li[role=option]").contains(params.approver).arrowClick({ force: true });
  cy.unClick().wait(500);
  cy.wait(1000);
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("arAddApproverOnApproverListWithoutApiCall", (params: { approver: string; noWait?: bool  }) => {
  cy.get(`[data-cy="fb-approvers-approvers"]`).arrowClick({ force: true });
  cy.get(`[data-cy="fb-approvers-approvers"]`).autocompleteSelect(params.approver);
  cy.unClick();
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("arClickCreateApprovalRequestAfterCompletingForm", () => {
  cy.get("[data-cy=\"common.save\"]").arrowClick();
  cy.checkToastMessage({ exists: false });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("arClickSendToReview", () => {
  cy.wrapWithWaitOnApiCalls([
    CyRoutes.ARtoReview,
    CyRoutes.ARPreview,
    CyRoutes.GetRequiredApproversDocRev,
  ],
  () => {
    cy.get("[data-cy=\"changeRequest.transition.in_review\"]").arrowClick({ force: true });
  });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("arClickSendToReviewWithoutApi", () => {
  cy.get("[data-cy=\"changeRequest.transition.in_review\"]").arrowClick({ force: true });
  cy.progressBarShouldAppear();
  cy.listLoadingElementShouldNotExist();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("arSaveApiCall", () => {
  cy.wrapWithWaitOnApiCalls(
    [CyRoutes.PatchAR], () => {
      cy.get("[data-cy=\"common.save\"]").arrowClick();
    });
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("arSaveApiCallWithoutApi", () => {
  cy.get("[data-cy=\"common.save\"]").arrowClick().wait(1000);
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("arVerifyStatus", (params: { status: string }) => {
  cy.get(`div[data-cy="HeaderInfo-status"]`).should("contain", params.status);
});

Cypress.Commands.add("arClickOnFirstAddedDocument", () => {
  cy.get(`tr[data-grid-row-index="0"]`).arrowClick();
});

Cypress.Commands.add("arFilterARListByNameAndStatus", (params: { title: string; status: string }) => {
  cy.get(`[aria-colindex="2"] .k-filtercell > input`).arrowType(params.title).wait(500);
  cy.landingPageLoadingElementShouldNotExist();
  cy.get(`[aria-colindex="4"] [class="k-input"]`).arrowClick();
  cy.landingPageLoadingElementShouldNotExist();
  cy.get("li").contains(params.status).arrowClick().wait(500);
  cy.landingPageLoadingElementShouldNotExist();
  cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
    cy.get(".k-master-row").contains(params.title).arrowClick();
  });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("arFilterARListByNameAndStatusWithoutApi", (params: { title: string; status: string }) => {
  cy.get(`[aria-colindex="2"] .k-filtercell > input`).arrowType(params.title).wait(500);
  cy.landingPageLoadingElementShouldNotExist();
  cy.get(`[aria-colindex="4"] [class="k-input"]`).arrowClick();
  cy.landingPageLoadingElementShouldNotExist();
  cy.get("li").contains(params.status).arrowClick().wait(500);
  cy.landingPageLoadingElementShouldNotExist();
  cy.get(".k-master-row").contains(params.title).arrowClick();
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("arApproveAR", () => {
  cy.wrapWithWaitOnApiCalls(
    [CyRoutes.PostApproveAR, CyRoutes.ARPreview], () => {
      cy.get("button[aria-label=approve]").first().arrowClick();
      cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
    });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("arApproveARWithoutApi", () => {
  cy.get("button[aria-label=approve]").first().arrowClick();
  cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
  cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
  cy.progressBarShouldAppear();
  cy.listLoadingElementShouldNotExist();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("arApproveARFromDashboard", () => {
  cy.wrapWithWaitOnApiCalls(
    [CyRoutes.PostApproveAR, CyRoutes.ARPreview], () => {
      cy.contains("needs your approval for").trigger("mouseover");
      cy.get("[data-cy=\"transition-approve\"]").first().arrowClick();
      cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
    });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("arApproveARFromDashboardWithoutApi", () => {
  cy.contains("needs your approval for").trigger("mouseover");
  cy.get("[data-cy=\"transition-approve\"]").first().arrowClick();
  cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
  cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("arCheckTitleInEditableAndMatches", (params: { name: string }) => {
  cy.get("[id=\"field-name\"]").should("have.text", params.name);
});

Cypress.Commands.add("arWithdrawSubmission", () => {
  cy.get("div[class=\"MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-flex-end\"]")
    .find("button[data-cy=\"change.request.withdraw.alert\"]").arrowClick();
  cy.wrapWithWaitOnApiCalls([
    CyRoutes.PostWithdrawChangeRequests,
    CyRoutes.ARPreview,
    CyRoutes.DocRevPreview], () => {
    cy.get("[data-cy=\"AlertDialog-continueButton\"]").arrowClick();
  });
});

Cypress.Commands.add("arWithdrawSubmissionWithoutApi", () => {
  cy.get("div[class=\"MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-flex-end\"]")
    .find("button[data-cy=\"change.request.withdraw.alert\"]").arrowClick();
  cy.get("[data-cy=\"AlertDialog-continueButton\"]").arrowClick();
  cy.listLoadingElementShouldNotExist();
  cy.progressBarShouldNotExist();
});

Cypress.Commands.add("arCloseARFromMenu", () => {
  cy.get("[data-cy=\"HeaderMenuButton\"]").arrowClick();
  cy.arCloseAR();
});

Cypress.Commands.add("arVoidAR", () => {
  cy.get("[data-cy=\"HeaderMenuButton\"]").arrowClick();
  cy.get("[data-cy=\"void-button\"]").arrowClick();
  cy.get("[data-cy=\"AlertDialog-continueButton\"]").arrowClick();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("arIsProposedDocumentEmpty", () => {
  cy.get("input[data-cy=\"proposedDocumentRevision\"]").arrowClick();
  cy.get("div.MuiAutocomplete-noOptions").should("have.text", "No options");
});

Cypress.Commands.add("arSetTimeTravelInDays", (params: {days: number}) => {
  cy.navigToAsyncTasks();
  cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_COMPANY });
  cy.asyncSelectBackToTheFutureTime({ day: params.days });
  cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.SELECT_ALL });
  cy.asyncTaskClickSubmit();
  cy.progressBarShouldNotExist();
  cy.wait(1000);
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("arRejectComfirmationAR", () => {
  cy.get("button[aria-label=reject]").first().arrowClick();
  cy.get("[data-cy=\"reject.request\"]").arrowClick();
});

Cypress.Commands.add("arRejectComfirmationARNew", () => {
  cy.get(`.MuiListItemText-root.MuiListItemText-dense`).first().trigger("mouseover");
  cy.get(`[data-cy="transition-reject"]`).first().trigger("mouseover");
  cy.get(`[data-cy="transition-reject"]`).first().arrowClick();
  cy.get(`[data-cy="reject.request"]`).arrowClick();
});

Cypress.Commands.add("arSelectFirstDocument", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.ARPreview], () => {
    cy.get("tr.k-master-row").first().arrowClick();
  });

  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("arSelectFirstDocumentWithoutApi", () => {
  cy.get("tr.k-master-row").first().arrowClick();
  cy.listLoadingElementShouldNotExist();
  cy.progressBarShouldNotExist();
});

Cypress.Commands.add("arApproverRoleStatus", (params: {roleName: string; enabled: boolean}) => {
  cy.get(`[data-cy="fb-approvers-${params.roleName}-check-${params.enabled ? "marked" : "disabled"}"]`).should("not.be.undefined");
});

Cypress.Commands.add("arSelectItemsTab", () => {
  cy.get("[data-cy=\"tabId.items\"]").arrowClick();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("arSelectChangeDetailsTab", () => {
  cy.get("[data-cy=\"tabId.changedetails\"]").arrowClick();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("arSelectApprovalTab", () => {
  cy.get("[data-cy=\"tabId.approvals\"]").arrowClick();
  cy.listLoadingElementShouldNotExist();
});
