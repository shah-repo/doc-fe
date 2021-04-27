/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */

import { CyRoutes } from "../../routes";

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      recApproveAndReleaseInlineRecord(): Chainable<Subject>;
      recCreateRecordFromLandingPage(): Chainable<Subject>;
      recCheckIfMultilpeFormsAreAvailable(params: {recordType: string; recordForms: string[]}): Chainable<Subject>;
      recSelectRecordFormFromMultiSelect( params: {recordType: string; recordForm?: string} ): Chainable<Subject>;
      equipSelectRecordFormFromMultiSelect( params: {recordType: string; recordForm?: string} ): Chainable<Subject>;
      inspecSelectRecordFormFromMultiSelect( params: {recordType: string; recordForm?: string} ): Chainable<Subject>;
      recCheckRevisionStage(params: {stage: string}): Chainable<Subject>;
      recFilterRecordListByNameAndStatus(params: { title: string; status: string }): Chainable<Subject>;
      equipClickCreateNew(): Chainable<Subject>;
      recFilterByRev(params: {revision: string }): Chainable<Subject>;
      recFilterByStatus(params: {status: string }): Chainable<Subject>;
      equipReloadDocument(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("recFilterByStatus", (params: {status: string }) => {
  cy.get("div[id=\"mui-component-select-displayStatus\"]").click().wait(500);
  cy.wrapWithWaitOnApiCall(CyRoutes.GetDocRevDocTypeCategory, () => {
    cy.get("ul[role=listbox]>li").contains(params.status).click();
  });
});

Cypress.Commands.add("recFilterByRev", (params: {revision: string }) => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetDocRevDocTypeCategory, () => {
    cy.get("input[name=name]").type(params.revision).wait(500);
  });
});

Cypress.Commands.add("recFilterRecordListByNameAndStatus", (params: { title: string; status: string }) => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetDocRevDocTypeCategory, () => {
    cy.get("#clearFilter").click();
  });
  cy.wrapWithWaitOnApiCall(CyRoutes.GetDocRevDocTypeCategory, () => {
    cy.get("#name").type(params.title).wait(500);
    cy.unClick();
  });
  cy.wrapWithWaitOnApiCall(CyRoutes.GetDocRevDocTypeCategory, () => {
    cy.get("[id=\"mui-component-select-displayStatus\"]").click().wait(300);
    cy.get("li[data-value]").contains(params.status).click();
  });
  cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.GetRequiredApproversDocRev], () => {
    cy.get(".ReactVirtualized__Table__rowColumn").contains(params.title).click();
  });
});

Cypress.Commands.add("recCreateRecordFromLandingPage", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetDocumentType, () => {
    cy.get("[id=\"DocumentByTypeListPresenter-openDocRev\"]").click();
  });
});

Cypress.Commands.add("recCheckIfMultilpeFormsAreAvailable", (params: {recordType: string; recordForms: string[]}) => {
  cy.get("[id=\"MultipleFormTemplate-selectDocForm\"]").click();
  cy.wait(500);
  cy.get("div[id^=react-select]").contains(params.recordType).click();
  cy.get("[id=\"MultipleFormTemplate-selectDocType\"]").click();
  params.recordForms.forEach((item) => {
    cy.get("[id=\"MultipleFormTemplate-selectDocType\"]").contains(item);
  });
  cy.get("[id=\"MultipleFormTemplate-selectDocType\"]").click();
  cy.get("[data-cy=\"suggestFormCancelBtn\"]").click();
});

Cypress.Commands.add("recSelectRecordFormFromMultiSelect", (params: {recordType: string; recordForm: string}) => {
  cy.wrapWithWaitOnApiCalls([
    CyRoutes.EmployeesGet,
    CyRoutes.DocPreview,
    CyRoutes.GetRequiredApproversDocRev], () => {
    cy.get("[id=\"MultipleFormTemplate-selectDocForm\"]").click();
    cy.wait(500);
    cy.get("div[id^=react-select]").contains(params.recordType).click();
    if (params.recordForm) {
      cy.get("[id=\"MultipleFormTemplate-selectDocType\"]").type(params.recordForm + "{downarrow}{enter}");
    }
  });
});

Cypress.Commands.add("equipSelectRecordFormFromMultiSelect", (params: {recordType: string; recordForm: string}) => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocumentType, CyRoutes.GetSpecificDocumentType], () => {
    cy.get("[id=DocumentByTypeListPresenter-openDocRev]").click();
  });
  cy.wrapWithWaitOnApiCalls([
    CyRoutes.EmployeesGet,
    CyRoutes.DocPreview,
    CyRoutes.GetRequiredApprovers], () => {
    cy.get("[id=\"MultipleFormTemplate-selectDocForm\"]").click();
    cy.wait(500);
    cy.get("div[id^=react-select]").contains(params.recordType).click();
    if (params.recordForm) {
      cy.get("[id=\"MultipleFormTemplate-selectDocType\"]").click();
      cy.get("div[id^=react-select]").contains(params.recordForm).click();
    }
  });
});

Cypress.Commands.add("equipClickCreateNew", () => {
  cy.wrapWithWaitOnApiCalls([
    CyRoutes.GetDocumentType,
    CyRoutes.GetSpecificDocumentType,
    CyRoutes.EmployeesGet,
    CyRoutes.DocPreview,
    CyRoutes.GetRequiredApprovers], () => {
    cy.get("[id=DocumentByTypeListPresenter-openDocRev]").click();
  });
});

Cypress.Commands.add("equipReloadDocument", () => {
  cy.wrapWithWaitOnApiCalls([
    CyRoutes.DocPreview,
    CyRoutes.EmployeesGet,
    CyRoutes.GetAutocompleteOptions,
    CyRoutes.DocPreview], () => {
    cy.reload();
  });
});


Cypress.Commands.add("inspecSelectRecordFormFromMultiSelect", (params: {recordType: string; recordForm: string}) => {
  cy.wrapWithWaitOnApiCalls([
    CyRoutes.EmployeesGet,
    CyRoutes.DocPreview], () => {
    cy.get("[id=\"MultipleFormTemplate-selectDocForm\"]").click();
    cy.wait(500);
    cy.get("div[id^=react-select]").contains(params.recordType).click();
    if (params.recordForm) {
      cy.get("[id=\"MultipleFormTemplate-selectDocType\"]").type(params.recordForm + "{downarrow}{enter}");
    }
  });
});

Cypress.Commands.add("recCheckRevisionStage", (params: {stage: string}) => {
  cy.get("[data-cy=\"DocumentRevisionList-item\"]").contains(params.stage);
});

Cypress.Commands.add("recApproveAndReleaseInlineRecord", () => {
  cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
  cy.wait(500);
  cy.wrapWithWaitOnApiCall(
    CyRoutes.ReleaseDocRevWithoutAr,
    () => {
      cy.get("[data-cy=\"AlertDialog-continueButton\"]").click();
    });
});
