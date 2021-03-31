/* eslint-disable @typescript-eslint/no-namespace */


/* eslint-disable max-len */
import moment from "moment";
import "moment-timezone";
import { ChangeRequestEditRequestBody } from "../../../../src/state/ducks/changeRequest";
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
      arChoseSpecificProposedDocument(params: { name: string }): Chainable<Subject>;
      arEnterDescriptionAddDocumentsDialog(params: { description: string }): Chainable<Subject>;
      arEnterJustificationAddDocumentsDialog(params: { justification: string }): Chainable<Subject>;
      arClickAddBtnOnAddDocumentsDialog(): Chainable<Subject>;
      arAddApproverOnApproverList(params: { approver: string }): Chainable<Subject>;
      arClickCreateApprovalRequestAfterCompletingForm(): Chainable<Subject>;
      arClickSendToReview(): Chainable<Subject>;
      arVerifyStatus(params: { status: string }): Chainable<Subject>;
      arCheckImplementationTaskStatus(params: { status: string }): Chainable<Subject>;
      arClickOnFirstAddedDocument(): Chainable<Subject>;
      arFilterARListByNameAndStatus(params: { title: string; status: string }): Chainable<Subject>;
      arApproveAR(): Chainable<Subject>;
      arClearFilters(): Chainable<Subject>;
      arCheckTitleInEditableAndMatches(params: { name: string }): Chainable<Subject>;
      arWithdrawSubmission(): Chainable<Subject>;
      arIsProposedDocumentEmpty(): Chainable<Subject>;
      arRejectComfirmationAR(): Chainable<Subject>;
      arSelectFirstDocument(): Chainable<Subject>;
      arCreateApprovalRequest(params: {payload: ChangeRequestEditRequestBody; employeeId: string; sessionId: string}): Chainable<Subject>;
      arGetArDocumentByName(params: {employeeId: string; sessionId: string; name: string}): Chainable<Subject>;
      arCloseAR(): Chainable<Subject>;
      arCloseARFromMenu(): Chainable<Subject>;
      arVoidAR(): Chainable<Subject>;
      arSaveApiCall(): Chainable<Subject>;
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
    }
  }
}

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
      Authorization: `bearer_password ${params.employeeId}:${params.sessionId}:Tester1!`,
    },
    body: {
      password: "Tester1!",
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
      Authorization: `bearer_password ${params.employeeId}:${params.sessionId}:Tester1!`,
    },
    body: {
      password: "Tester1!",
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
  cy.get("[data-cy=\"field-title\"]").type(params.title);
});

Cypress.Commands.add("arVerifySignatureIsNotMet", (params: {title: string }) => {
  cy.get("button[aria-label=approve]").first().click();
  cy.get("[data-cy=\"transition.action.password\"]").type("wrongPassword");
  cy.get("[data-cy=\"passwordConfirm\"]").click();
  cy.wait(2000);
  cy.checkToastMessage({ exists: true });
});

Cypress.Commands.add("arCheckImplementationTaskStatus", (params: {status: string }) => {
  cy.get("[data-cy=\"form.builder.status\"]").contains(params.status);
});

Cypress.Commands.add("arClearFilters", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetChangeRequests, () => {
    cy.get("[data-cy=\"clearFilter\"]").click();
  });
});

Cypress.Commands.add("arEnterApprovalRequestDescription", (params: { description: string }) => {
  cy.get("[data-cy=\"field-description\"]").type(params.description).unClick();
});

Cypress.Commands.add("arSelectARForm", (params: { formTitle: string }) => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetSpecificDocumentType, () => {
    cy.get("div[data-cy=\"field-select-form\"]>#FormList-selectForm").click();
    cy.get("div[id^=react-select]").contains(params.formTitle).click();
    cy.get("[data-cy=\"create.approval.request.continue\"]").click();
  });
});

Cypress.Commands.add("arClickAddDocument", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[data-cy=\"fb.add.document\"]").click();
  });
});

Cypress.Commands.add("arCloseAR", () => {
  cy.get("[aria-label=closed]").click();
  cy.wrapWithWaitOnApiCalls(
    [CyRoutes.PostCloseAR, CyRoutes.ARPreview], () => {
      cy.get("[data-cy=AlertDialog-continueButton]").click();
    });
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("arChoseSpecificProposedDocument", (params: { name: string }) => {
  cy.get("[data-cy=\"proposedDocumentRevision\"]").type(params.name + "{downarrow}{enter}");
});

Cypress.Commands.add("arEnterDescriptionAddDocumentsDialog", (params: { description: string }) => {
  cy.get("[data-cy=\"descriptionOfChange\"]").click().type(params.description);
});

Cypress.Commands.add("arEnterJustificationAddDocumentsDialog", (params: { justification: string }) => {
  cy.get("[data-cy=\"justificationOfChange\"]").click().type(params.justification);
});

Cypress.Commands.add("arClickAddBtnOnAddDocumentsDialog", () => {
  cy.get("[data-cy=\"arAddDocumentDialogAddBtn\"]").click();
});

Cypress.Commands.add("arAddApproverOnApproverList", (params: { approver: string }) => {
  cy.wrapWithWaitOnApiCalls(
    [CyRoutes.PatchAR, CyRoutes.ArAudit], () => {
      cy.get("[data-cy=\"fb-approvers-approvers\"]").click();
      cy.get("ul[role=\"listbox\"]>li").contains(params.approver).click();
      cy.unClick();
    });
});

Cypress.Commands.add("arClickCreateApprovalRequestAfterCompletingForm", () => {
  cy.wrapWithWaitOnApiCalls(
    [CyRoutes.PostChangeRequests, CyRoutes.DocRevPreview], () => {
      cy.get("[data-cy=\"navigation.createChangeRequest\"]").click();
    });
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("arClickSendToReview", () => {
  cy.wrapWithWaitOnApiCalls([
    CyRoutes.ARtoReview,
    CyRoutes.ARPreview,
    CyRoutes.DocRevGet,
  ],
  () => {
    cy.get("[data-cy=\"transitionButton\"]").click();
  });
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("arSaveApiCall", () => {
  cy.wrapWithWaitOnApiCalls(
    [CyRoutes.PatchAR], () => {
      cy.get("[data-cy=\"common.save\"]").click();
    });
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("arVerifyStatus", (params: { status: string }) => {
  cy.get("[data-cy=\"HeaderInfo-status\"]").should("have.text", params.status);
  // cy.get("#HeaderInfo-status>span").contains(params.status);
});

Cypress.Commands.add("arClickOnFirstAddedDocument", () => {
  cy.get("div[data-cy=addedDocuments]>div:nth-child(2)>button>span>a").click();
});

Cypress.Commands.add("arFilterARListByNameAndStatus", (params: { title: string; status: string }) => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetChangeRequests, () => {
    cy.get("#title").type(params.title);
  });
  cy.wrapWithWaitOnApiCall(CyRoutes.GetChangeRequests, () => {
    cy.get("[id=\"mui-component-select-state\"]").click().wait(300);
    cy.get("li[data-value]").contains(params.status).click();
  });
  cy.wrapWithWaitOnApiCalls([
    CyRoutes.GetRequiredApproversDocRev,
    CyRoutes.GetRequiredApproversDocRev,
    CyRoutes.DocRevGet,
  ], () => {
    cy.get(".ReactVirtualized__Table__rowColumn").contains(params.title).click();
  });
});

Cypress.Commands.add("arApproveAR", () => {
  cy.wrapWithWaitOnApiCalls(
    [CyRoutes.PostApproveAR, CyRoutes.ARPreview], () => {
      cy.get("button[aria-label=approve]").first().click();
      cy.get("[data-cy=\"transition.action.password\"]").type("Tester1!");
      cy.get("[data-cy=\"passwordConfirm\"]").click();
    });
  cy.checkToastMessage({ exists: false });
  cy.wait(2000);
});

Cypress.Commands.add("arCheckTitleInEditableAndMatches", (params: { name: string }) => {
  cy.get("[id=\"HeaderInfo-name\"]").should("have.text", params.name);
});

Cypress.Commands.add("arWithdrawSubmission", () => {
  cy.get("[data-cy=\"HeaderMenuButton\"]").click();
  cy.get("[data-cy=\"change.request.withdraw.alert\"]").click();
  cy.wrapWithWaitOnApiCalls([
    CyRoutes.PostWithdrawChangeRequests,
    CyRoutes.EmployeesGet,
    CyRoutes.ARPreview,
    CyRoutes.DocRevPreview,
    CyRoutes.DocRevPreview], () => {
    cy.get("[data-cy=\"AlertDialog-continueButton\"]").click();
  });
});

Cypress.Commands.add("arCloseARFromMenu", () => {
  cy.get("[data-cy=\"HeaderMenuButton\"]").click();
  cy.arCloseAR();
});

Cypress.Commands.add("arVoidAR", () => {
  cy.get("[data-cy=\"HeaderMenuButton\"]").click();
  cy.get("[id=\"void\"]").click();
  cy.get("[data-cy=\"AlertDialog-continueButton\"]").click();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("arIsProposedDocumentEmpty", () => {
  cy.get("input[data-cy=\"proposedDocumentRevision\"]").click();
  cy.get("div.MuiAutocomplete-noOptions").should("have.text", "No options");
});

Cypress.Commands.add("arRejectComfirmationAR", () => {
  cy.get("button[aria-label=reject]").first().click().wait(300);
  cy.get("[data-cy=\"reject.request\"]").click().wait(1000);
});

Cypress.Commands.add("arSelectFirstDocument", () => {
  cy.wrapWithWaitOnApiCalls([
    CyRoutes.ARPreview,
    CyRoutes.GetRequiredApproversDocRev,
    CyRoutes.DocRevGet], () => {
    cy.get(".MuiTableCell-root a:nth-child(1)").first().click();
  });
  cy.wait(3000);
});

Cypress.Commands.add("arApproverRoleStatus", (params: {roleName: string; enabled: boolean}) => {
  cy.get(`[data-cy="fb-approvers-${params.roleName}-check-${params.enabled ? "marked" : "disabled"}"]`).should("not.be.undefined");
});
