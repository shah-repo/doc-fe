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
  cy.get("div[id=\"mui-component-select-displayStatus\"]").arrowClick();
  cy.wrapWithWaitOnApiCall(CyRoutes.GetDocRevDocTypeCategory, () => {
    cy.get("ul[role=listbox]>li").contains(params.status).arrowClick();
  });
});

Cypress.Commands.add("recFilterByRev", (params: {revision: string }) => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetDocRevDocTypeCategory, () => {
    cy.get("input[name=name]").arrowType(params.revision);
  });
});

Cypress.Commands.add("recFilterRecordListByNameAndStatus", (params: { title: string; status: string }) => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetDocRevDocTypeCategory, () => {
    cy.get("#clearFilter").arrowClick();
  });
  cy.listLoadingElementShouldNotExist();
  cy.wrapWithWaitOnApiCall(CyRoutes.GetDocRevDocTypeCategory, () => {
    cy.get("#name").arrowType(params.title).wait(500);
    cy.unClick();
  });
  cy.listLoadingElementShouldNotExist();
  cy.wrapWithWaitOnApiCall(CyRoutes.GetDocRevDocTypeCategory, () => {
    cy.get("[id=\"mui-component-select-displayStatus\"]").arrowClick();
    cy.get("li[data-value]").contains(params.status).arrowClick().wait(500);
    cy.unClick();
  });
  cy.listLoadingElementShouldNotExist();
  cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.GetRequiredApproversDocRev], () => {
    cy.get(".ReactVirtualized__Table__rowColumn").contains(params.title).arrowClick();
  });
});

Cypress.Commands.add("recCreateRecordFromLandingPage", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetDocumentType, () => {
    cy.get("[id=\"DocumentByTypeListPresenter-openDocRev\"]").arrowClick();
  });
});

Cypress.Commands.add("recCheckIfMultilpeFormsAreAvailable", (params: {recordType: string; recordForms: string[]}) => {
  cy.get("[id=\"MultipleFormTemplate-selectDocForm\"]").arrowClick();

  cy.get("div[id^=react-select]").contains(params.recordType).arrowClick();
  cy.get("[id=\"MultipleFormTemplate-selectDocType\"]").arrowClick();
  params.recordForms.forEach((item) => {
    cy.get("[id=\"MultipleFormTemplate-selectDocType\"]").contains(item);
  });
  cy.get("[id=\"MultipleFormTemplate-selectDocType\"]").arrowClick();
  cy.get("[data-cy=\"suggestFormCancelBtn\"]").arrowClick();
});

Cypress.Commands.add("recSelectRecordFormFromMultiSelect", (params: {recordType: string; recordForm: string}) => {
  cy.wrapWithWaitOnApiCalls([
    CyRoutes.DocPreview,
    CyRoutes.GetRequiredApproversDocRev], () => {
    cy.get("[id=\"MultipleFormTemplate-selectDocForm\"]").arrowClick();

    cy.get("div[id^=react-select]").contains(params.recordType).arrowClick();
    if (params.recordForm) {
      cy.get("[id=\"MultipleFormTemplate-selectDocType\"]").arrowType(params.recordForm + "{downarrow}{enter}");
    }
  });
});

Cypress.Commands.add("equipSelectRecordFormFromMultiSelect", (params: {recordType: string; recordForm: string}) => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocumentType, CyRoutes.GetSpecificDocumentType], () => {
    cy.get("[id=DocumentByTypeListPresenter-openDocRev]").arrowClick();
  });
  cy.wrapWithWaitOnApiCalls([
    CyRoutes.DocPreview,
    CyRoutes.GetRequiredApprovers], () => {
    cy.get("[id=\"MultipleFormTemplate-selectDocForm\"]").arrowClick();

    cy.get("div[id^=react-select]").contains(params.recordType).arrowClick();
    if (params.recordForm) {
      cy.get("[id=\"MultipleFormTemplate-selectDocType\"]").arrowClick();
      cy.get("div[id^=react-select]").contains(params.recordForm).arrowClick();
    }
  });
});

Cypress.Commands.add("equipClickCreateNew", () => {
  cy.wrapWithWaitOnApiCalls([
    CyRoutes.GetDocumentType,
    CyRoutes.GetSpecificDocumentType,
    CyRoutes.DocPreview,
    CyRoutes.GetRequiredApprovers], () => {
    cy.get("[id=DocumentByTypeListPresenter-openDocRev]").arrowClick();
  });
});

Cypress.Commands.add("equipReloadDocument", () => {
  cy.wrapWithWaitOnApiCalls([
    CyRoutes.DocPreview,
    CyRoutes.GetAutocompleteOptions,
    CyRoutes.DocPreview], () => {
    cy.reload();
  });
});


Cypress.Commands.add("inspecSelectRecordFormFromMultiSelect", (params: {recordType: string; recordForm: string}) => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
    cy.get("[id=\"MultipleFormTemplate-selectDocForm\"]").arrowClick();

    cy.get("div[id^=react-select]").contains(params.recordType).arrowClick();
    if (params.recordForm) {
      cy.get("[id=\"MultipleFormTemplate-selectDocType\"]").arrowType(params.recordForm + "{downarrow}{enter}");
    }
  });
});

Cypress.Commands.add("recCheckRevisionStage", (params: {stage: string}) => {
  cy.get("[data-cy=\"DocumentRevisionList-item\"]").contains(params.stage);
});

Cypress.Commands.add("recApproveAndReleaseInlineRecord", () => {
  cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();

  cy.wrapWithWaitOnApiCalls([
    CyRoutes.ReleaseDocRevWithoutAr,
    CyRoutes.GetDocAggregatedAudit],
  () => {
    cy.get("[data-cy=\"AlertDialog-continueButton\"]").arrowClick();
  });
});
