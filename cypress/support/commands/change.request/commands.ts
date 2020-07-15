/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable max-len */
export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      crSelectLastAddedCRForm(): Chainable<Subject>;
      crEnterChangeRequestTitle( params: {title: string }): Chainable<Subject>;
      crEnterChangeRequestDescription( params: {description: string }): Chainable<Subject>;
      crClickAddDocument(): Chainable<Subject>;
      crChoseProposedDocument(): Chainable<Subject>;
      crEnterDescriptionAddDocumentsDialog( params: {description: string }): Chainable<Subject>;
      crEnterJustificationAddDocumentsDialog( params: {justification: string }): Chainable<Subject>;
      crClickAddBtnOnAddDocumentsDialog(): Chainable<Subject>;
      crAddFirstApproverOnChangeRequestApproverList(): Chainable<Subject>;
      crClickCreateChangeRequestAfterCompletingForm(): Chainable<Subject>;
      crClickSendToReview(): Chainable<Subject>;
      crAddEffectiveDate(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("crEnterChangeRequestTitle", (params: {title: string }) => {
  cy.get("[data-cy=\"field-title\"]").type(params.title);
});

Cypress.Commands.add("crEnterChangeRequestDescription", (params: {description: string }) => {
  cy.get("[data-cy=\"field-description\"]").type(params.description).unClick();
});

Cypress.Commands.add("crSelectLastAddedCRForm", () => {
  cy.get("[type=\"radio\"]").last().check();
  cy.get("#FormList-continueButton").click();
});

Cypress.Commands.add("crClickAddDocument", () => {
  cy.get("[data-cy=\"fb.add.document\"]").click().wait(200);
});

Cypress.Commands.add("crChoseProposedDocument", () => {
  cy.get("[role=dialog]>div:nth-child(2)>div>div>div>div>div>div>div>input").click();
  cy.get("[role=listbox]>li:nth-child(1)").click();
});

Cypress.Commands.add("crEnterDescriptionAddDocumentsDialog", (params: {description: string }) => {
  cy.get("[name=\"descriptionOfChange\"]").click().type(params.description);
});

Cypress.Commands.add("crEnterJustificationAddDocumentsDialog", (params: {justification: string }) => {
  cy.get("[name=\"justificationOfChange\"]").click().type(params.justification);
});

Cypress.Commands.add("crClickAddBtnOnAddDocumentsDialog", () => {
  cy.get("[role=dialog]>div>div>div>button").click();
});

Cypress.Commands.add("crAddFirstApproverOnChangeRequestApproverList", () => {
  cy.get("[name=approvers]").click();
  cy.get("[role=listbox]>li:nth-child(1)").click();
});

Cypress.Commands.add("crAddFirstApproverOnChangeRequestApproverList", () => {
  cy.get("[name=approvers]").click();
  cy.get("[role=listbox]>li:nth-child(1)").click();
});

Cypress.Commands.add("crClickCreateChangeRequestAfterCompletingForm", () => {
  cy.get("#submit").click();
});

Cypress.Commands.add("crAddEffectiveDate", () => {
  cy.xpath("//input[@name]/ ../div/button").click().wait(200);
  cy.xpath("//div[@class=\"MuiPickersCalendar-week\"] [last()]/div[@role=\"presentation\"]/button[not(@tabindex=\"-1\")]").last()
    .click().wait(300);
});

Cypress.Commands.add("crClickSendToReview", () => {
  cy.get("#transitionButton").contains("Send to review").click();
});
