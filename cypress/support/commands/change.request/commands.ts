export { };

declare global {
    namespace Cypress {
      interface Chainable<Subject> {
        selectLastAddedCRForm(): Chainable<Subject>;
        enterChangeRequestTitle( params: {title: string }): Chainable<Subject>;
        enterChangeRequestDescription( params: {description: string }): Chainable<Subject>;
        clickAddDocument(): Chainable<Subject>;
        choseProposedDocument(): Chainable<Subject>;
        enterDescriptionAddDocumentsDialog( params: {description: string }): Chainable<Subject>;
        enterJustificationAddDocumentsDialog( params: {justification: string }): Chainable<Subject>;
        clickAddBtnOnAddDocumentsDialog(): Chainable<Subject>;
        addFirstApproverOnChangeRequestApproverList(): Chainable<Subject>;
        clickCreateChangeRequestAfterCompletingForm(): Chainable<Subject>;
        clickSendToReview(): Chainable<Subject>;
        addEffectiveDate(): Chainable<Subject>;
      }
    }
  }

  Cypress.Commands.add("enterChangeRequestTitle", (params: {title: string }) => {
    cy.get("[data-cy=\"field-title\"]").type(params.title);
  });
  
  Cypress.Commands.add("enterChangeRequestDescription", (params: {description: string }) => {
    cy.get("[data-cy=\"field-description\"]").type(params.description);
  });

  Cypress.Commands.add("selectLastAddedCRForm", () => {
    cy.get("[type=\"radio\"]").last().check().get("#FormList-continueButton").click();
  });

  Cypress.Commands.add("clickAddDocument", () => {
    cy.get("[data-cy=\"fb.add.document\"]").click().click().wait(200);
  });

  Cypress.Commands.add("choseProposedDocument", () => {
    cy.get("[role=dialog]>div:nth-child(2)>div>div>div>div>div>div>div>input").click().get("[role=listbox]>li:nth-child(1)").click();
  });

  Cypress.Commands.add("enterDescriptionAddDocumentsDialog", (params: {description: string }) => {
    cy.get("[name=\"descriptionOfChange\"]").click().type(params.description);
  });

  Cypress.Commands.add("enterJustificationAddDocumentsDialog", (params: {justification: string }) => {
    cy.get("[name=\"justificationOfChange\"]").click().type(params.justification);
  });

  Cypress.Commands.add("clickAddBtnOnAddDocumentsDialog", () => {
    cy.get("[role=dialog]>div>div>div>button").click();
  });

  Cypress.Commands.add("addFirstApproverOnChangeRequestApproverList", () => {
    cy.get("[name=approvers]").click().get("[role=listbox]>li:nth-child(1)").click();
  });

  Cypress.Commands.add("addFirstApproverOnChangeRequestApproverList", () => {
    cy.get("[name=approvers]").click().get("[role=listbox]>li:nth-child(1)").click();
  });

  Cypress.Commands.add("clickCreateChangeRequestAfterCompletingForm", () => {
    cy.get("#submit").click();
  });

  Cypress.Commands.add("clickSendToReview", () => {
    cy.get("#transitionButton").contains("Send to review").click();
  });

  Cypress.Commands.add("addEffectiveDate", () => {
    cy.get(".MuiInputAdornment-root > .MuiButtonBase-root").click();
  });
