/* eslint-disable @typescript-eslint/no-namespace */


/* eslint-disable max-len */
import { ChangeRequestEditRequestBody } from "../../../../src/state/ducks/changeRequest/types";
import { CONFIG } from "../../config";
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
      arAddEffectiveDate(): Chainable<Subject>;
      arVerifyStatus(params: { status: string }): Chainable<Subject>;
      arClickOnFirstAddedDocument(): Chainable<Subject>;
      arFilterARListByNameAndStatus(params: { title: string; status: string }): Chainable<Subject>;
      arApproveAR(): Chainable<Subject>;
      arCheckTitleInEditableAndMatches(params: { name: string }): Chainable<Subject>;
      arWithdrawSubmission(): Chainable<Subject>;
      arIsProposedDocumentEmpty(): Chainable<Subject>;
      arRejectComfirmationAR(): Chainable<Subject>;
      arSelectFirstDocument(): Chainable<Subject>;
      arCreateApprovalRequest(params: {payload: ChangeRequestEditRequestBody; employeeId: string; sessionId: string}): Chainable<Subject>;
      arGetArDocumentByName(params: {employeeId: string; sessionId: string; name: string}): Chainable<Subject>;
    }
  }
}

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

Cypress.Commands.add("arEnterApprovalRequestDescription", (params: { description: string }) => {
  cy.get("[data-cy=\"field-description\"]").type(params.description).unClick();
});

Cypress.Commands.add("arSelectARForm", (params: { formTitle: string }) => {
  cy.get("div[data-cy=\"field-select-form\"]>#FormList-selectForm").click();
  cy.get("div[data-cy=\"field-select-form\"]>#FormList-selectForm").type(`${params.formTitle}{downarrow}{enter}`);
  // cy.get("#FormList-selectForm>div>div>div[id^=react-select]").type(`${params.formTitle}{downarrow}{enter}`).click();
  cy.get("[data-cy=\"create.approval.request.continue\"]").click();
});

Cypress.Commands.add("arClickAddDocument", () => {
  cy.get("[data-cy=\"fb.add.document\"]").click().wait(200);
});

Cypress.Commands.add("arChoseProposedDocument", ({ name }) => {
  cy.get("[role=dialog]>div:nth-child(2)>div>div>div>div>div>div>div>input").click();
  cy.get("[role=listbox]>li").contains(name).click();
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
  cy.get("[data-cy=\"fb-control-btn\"]").click();
});

Cypress.Commands.add("arAddApproverOnApproverList", (params: { approver: string }) => {
  cy.get("[data-cy=\"approvers\"]").click();
  cy.get("[data-cy=\"approvers\"]").type(`${params.approver}{downarrow}{enter}`);
});

Cypress.Commands.add("arClickCreateApprovalRequestAfterCompletingForm", () => {
  cy.get("[data-cy=\"navigation.createChangeRequest\"]").click().wait(3000);
});

Cypress.Commands.add("arAddEffectiveDate", () => {
  cy.xpath("//input[@name]/ ../div/button").click().wait(200);
  cy.xpath("//div[@class=\"MuiPickersCalendar-week\"] [last()]/div[@role=\"presentation\"]/button[not(@tabindex=\"-1\")]").last()
    .click().wait(300);
});

Cypress.Commands.add("arClickSendToReview", () => {
  cy.get("[data-cy=\"transitionButton\"]").click().wait(3000);
});

Cypress.Commands.add("arVerifyStatus", (params: { status: string }) => {
  cy.get("[data-cy=\"HeaderInfo-status\"]").should("have.text", params.status);
  // cy.get("#HeaderInfo-status>span").contains(params.status);
});

Cypress.Commands.add("arClickOnFirstAddedDocument", () => {
  cy.get("div[data-cy=addedDocuments]>div:nth-child(2)>button>span>a").click();
});

Cypress.Commands.add("arFilterARListByNameAndStatus", (params: { title: string; status: string }) => {
  cy.get("#clearFilter").click().wait(1000);
  cy.get("#title").type(params.title);
  cy.get("[id=\"mui-component-select-state\"]").click().wait(300);
  cy.get("li[data-value]").contains(params.status).click().wait(1000);
  cy.get(".ReactVirtualized__Table__rowColumn").contains(params.title).click();
});

Cypress.Commands.add("arApproveAR", () => {
  cy.get("button[aria-label=approve]").first().click().wait(300);
  cy.get("[data-cy=\"transition.action.password\"]").type("Tester1!");
  cy.get("[data-cy=\"passwordConfirm\"]").click().wait(2000);
});

Cypress.Commands.add("arCheckTitleInEditableAndMatches", (params: { name: string }) => {
  cy.get("[id=\"HeaderInfo-name\"]").should("have.text", params.name);
});

Cypress.Commands.add("arWithdrawSubmission", () => {
  cy.get("[data-cy=\"HeaderMenuButton\"]").click();
  cy.get("[data-cy=\"change.request.withdraw.alert\"]").click();
  cy.get("[data-cy=\"AlertDialog-continueButton\"]", { timeout: 1000 }).click();
});

Cypress.Commands.add("arIsProposedDocumentEmpty", () => {
  cy.get("[data-cy=\"proposedDocumentRevision\"] input").should("be.empty");
});

Cypress.Commands.add("arRejectComfirmationAR", () => {
  cy.get("button[aria-label=reject]").first().click().wait(300);
  cy.get("[data-cy=\"reject.request\"]").click().wait(1000);
});

Cypress.Commands.add("arSelectFirstDocument", () => {
  cy.get(".MuiTableCell-root a:nth-child(1)").first().click().wait(3000);
});
