/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable max-len */
import { ChangeRequestEditRequestBody } from "../../../../src/state/ducks/changeRequest/types";
import { CONFIG } from "../../config";
export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      arSelectARForm( params: { formTitle: string }): Chainable<Subject>;
      arEnterApprovalRequestTitle( params: { title: string }): Chainable<Subject>;
      arEnterApprovalRequestDescription( params: { description: string }): Chainable<Subject>;
      arClickAddDocument(): Chainable<Subject>;
      arChoseProposedDocument(): Chainable<Subject>;
      arEnterDescriptionAddDocumentsDialog( params: { description: string }): Chainable<Subject>;
      arEnterJustificationAddDocumentsDialog( params: { justification: string }): Chainable<Subject>;
      arClickAddBtnOnAddDocumentsDialog(): Chainable<Subject>;
      arAddApproverOnApproverList(params: {approver: string }): Chainable<Subject>;
      arClickCreateApprovalRequestAfterCompletingForm(): Chainable<Subject>;
      arClickSendToReview(): Chainable<Subject>;
      arAddEffectiveDate(): Chainable<Subject>;
      arVerifyStatus( params: {status: string }): Chainable<Subject>;
      arClickOnFirstAddedDocument(): Chainable<Subject>;
      arFilterARListByNameAndStatus( params: { title: string; status: string }): Chainable<Subject>;
      arApproveAR(): Chainable<Subject>;
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

Cypress.Commands.add("arEnterApprovalRequestDescription", (params: {description: string }) => {
  cy.get("[data-cy=\"field-description\"]").type(params.description).unClick();
});

Cypress.Commands.add("arSelectARForm", (params: {formTitle: string }) => {
  cy.get("div[data-cy=\"field-select-form\"]>#FormList-selectForm").click();
  cy.get("#FormList-selectForm>div>div>div[id^=react-select]").contains(params.formTitle).click();
  cy.get("#FormList-continueButton").click();
});

Cypress.Commands.add("arClickAddDocument", () => {
  cy.get("[data-cy=\"fb.add.document\"]").click().wait(200);
});

Cypress.Commands.add("arChoseProposedDocument", () => {
  cy.get("[role=dialog]>div:nth-child(2)>div>div>div>div>div>div>div>input").click();
  cy.get("[role=listbox]>li:nth-child(1)").click();
});

Cypress.Commands.add("arEnterDescriptionAddDocumentsDialog", (params: {description: string }) => {
  cy.get("[name=\"descriptionOfChange\"]").click().type(params.description);
});

Cypress.Commands.add("arEnterJustificationAddDocumentsDialog", (params: {justification: string }) => {
  cy.get("[name=\"justificationOfChange\"]").click().type(params.justification);
});

Cypress.Commands.add("arClickAddBtnOnAddDocumentsDialog", () => {
  cy.get("[role=dialog]>div>div>div>button").click();
});

Cypress.Commands.add("arAddApproverOnApproverList", (params: {approver: string }) => {
  cy.get("[name=approvers]").click();
  cy.get("[role=listbox]>li").contains(params.approver).click();
});

Cypress.Commands.add("arClickCreateApprovalRequestAfterCompletingForm", () => {
  cy.get("#submit").click().wait(3000);
});

Cypress.Commands.add("arAddEffectiveDate", () => {
  cy.xpath("//input[@name]/ ../div/button").click().wait(200);
  cy.xpath("//div[@class=\"MuiPickersCalendar-week\"] [last()]/div[@role=\"presentation\"]/button[not(@tabindex=\"-1\")]").last()
    .click().wait(300);
});

Cypress.Commands.add("arClickSendToReview", () => {
  cy.get("#transitionButton").contains("Send to review").click().wait(3000);
});

Cypress.Commands.add("arVerifyStatus", (params: {status: string }) => {
  cy.get("#HeaderInfo-status>span").contains(params.status);
});

Cypress.Commands.add("arClickOnFirstAddedDocument", () => {
  cy.get("div[data-cy=addedDocuments]>div:nth-child(2)>button>span>a").click();
});

Cypress.Commands.add("arFilterARListByNameAndStatus", (params: {title: string; status: string }) => {
  cy.get("#clearFilter").click().wait(1000);
  cy.get("#title").type(params.title);
  cy.get("[id=\"mui-component-select-state\"]").click().wait(300);
  cy.get("li[data-value]").contains(params.status).click().wait(1000);
  cy.get(".ReactVirtualized__Table__rowColumn").contains(params.title).click();
});

Cypress.Commands.add("arApproveAR", () => {
  cy.get("button[aria-label=approve]").click().wait(300);
  cy.get("input[type=password]").type("Tester1!");
  cy.get("#passwordConfirm").click().wait(8000);
});
