/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */

import { RevisionChangeType } from "../../../../src/state/ducks/documentRevisions/types";
import { SQS_TYPES } from "../../../../src/ui/async.tasks/types";
import { CONFIG } from "../../config";
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
      recFilterRecordListByIdAndStatus(params: { id: string; status: string }): Chainable<Subject>;
      recFilterRecordListByIdAndStatusNw(params: { id: string; status: string }): Chainable<Subject>;
      equipClickCreateNew(): Chainable<Subject>;
      recFilterByTitle(params: {revision: string }): Chainable<Subject>;
      recFilterByStatus(params: {status: string }): Chainable<Subject>;
      recVerifyTitle(params: {title: string }): Chainable<Subject>;
      recVerifyTitleWIP(params: {title: string }): Chainable<Subject>;
      recVerifyDescription(params: {description: string }): Chainable<Subject>;
      recVerifyDescriptionWIP(params: {description: string }): Chainable<Subject>;
      equipReloadDocument(): Chainable<Subject>;
      recAPICreateVoidedDocument(params: {
        fromDocumentId: string;
        formInputFieldName: string;
        formInputApprovalId: string;
        documentId: string;
        employeeId: string;
        sessionId: string;}): Chainable<Subject>;
      equipSetTimeTravelInDays(params: { days: number }): Chainable<Subject>;
      recFinalizeAndReleaseRecord(): Chainable<Subject>;
      recFinalizeAndReleaseRecordWithoutApi(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("recAPICreateVoidedDocument", (params: {
  fromDocumentId: string;
  formInputFieldName: string;
  formInputApprovalId: string;
  documentId: string;
  employeeId: string;
  sessionId: string;}) => {

  const requestBody = {
    formDocument: {
      id: params.fromDocumentId,
    },
    formInput: {
    },
    schema: null,
    parentParts: [],
    description: "<p>Supplier voided</p>",
    name: "Supplier voided",
    attachments: [],
    referenceTo: [],
    revisionStage: null,
    revisionChangeType: RevisionChangeType.Obsolete,
    retrain: false,
    renderHTML: null,
    document: {
      id: params.documentId,
    },
  };
  requestBody.formInput[params.formInputFieldName] = [params.formInputApprovalId];

  cy.request({
    method: "POST",
    url: `${CONFIG.BE_URL}/api/v1/document_revisions`,
    body: requestBody,
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
  }).then((response) => response.body);
});

Cypress.Commands.add("recFilterByStatus", (params: {status: string }) => {
  cy.get(`[aria-colindex="3"] [class="k-input"]`).arrowClick();
  cy.get("li").contains(params.status).arrowClick().wait(500);
});

Cypress.Commands.add("recFilterByTitle", (params: {revision: string }) => {
  cy.get(`[aria-colindex="4"] .k-filtercell>input`).arrowType(params.revision);
});

Cypress.Commands.add("recFilterRecordListByNameAndStatus", (params: { title: string; status: string }) => {
  cy.get("#clearFilter").arrowClick();
  cy.landingPageLoadingElementShouldNotExist();
  cy.get(`[aria-colindex="4"] .k-filtercell>input`).arrowType(params.title).wait(500);
  cy.unClick();
  cy.get(`[aria-colindex="3"] [class="k-input"]`).arrowClick({ force: true });
  cy.get("li").contains(params.status).scrollIntoView().arrowClick({ force: true }).wait(500);
  cy.unClick();
  cy.landingPageLoadingElementShouldNotExist();
  cy.get("tr.k-master-row").contains(params.title).arrowClick({ force: true });
  cy.progressBarShouldAppear();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("recFilterRecordListByIdAndStatus", (params: { id: string; status: string }) => {
  cy.get("#clearFilter").arrowClick();
  cy.landingPageLoadingElementShouldNotExist();
  cy.get(`[aria-colindex="1"] .k-filtercell > input`).arrowType(params.id).wait(500);
  cy.unClick();
  cy.get(`[aria-colindex="3"] [class="k-select"]`).arrowClick();
  cy.get("li").contains(params.status).arrowClick().wait(500);
  cy.unClick();
  cy.landingPageLoadingElementShouldNotExist();
  cy.get("tr.k-master-row").contains(params.id).arrowClick();
  cy.progressBarShouldAppear();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("recFilterRecordListByIdAndStatusNw", (params: { id: string; status: string }) => {
  cy.get("#clearFilter").arrowClick();
  cy.landingPageLoadingElementShouldNotExist();
  cy.get(`[aria-colindex="1"] .k-filtercell > input`).arrowType(params.id).wait(500);
  cy.unClick();
  cy.get(`[aria-colindex="3"] [class="k-select"]`).arrowClick();
  cy.get("li").contains(params.status).arrowClick().wait(500);
  cy.unClick();
  cy.dlSelectFirstDocument();
});

Cypress.Commands.add("recCreateRecordFromLandingPage", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetDocumentType, () => {
    cy.get("[id=\"DocumentByTypeListPresenter-openDocRev\"]").arrowClick();
  });
});

Cypress.Commands.add("recCheckIfMultilpeFormsAreAvailable", (params: {recordType: string; recordForms: string[]}) => {
  cy.get("[id=\"MultipleFormTemplate-selectDocForm\"]").arrowClick().wait(1000);

  cy.get("div[id^=react-select]").contains(params.recordType).arrowClick();
  cy.get("[id=\"MultipleFormTemplate-selectDocType\"]").arrowClick();
  params.recordForms.forEach((item) => {
    cy.get("[id=\"MultipleFormTemplate-selectDocType\"]").contains(item);
  });
  cy.get("[id=\"MultipleFormTemplate-selectDocType\"]").arrowClick();
  cy.get("[data-cy=\"suggestFormCancelBtn\"]").arrowClick();
});


Cypress.Commands.add("recSelectRecordFormFromMultiSelect", (params: {recordType: string; recordForm?: string}) => {
  cy.landingPageLoadingElementShouldNotExist();
  cy.get("[data-cy=\"field-selectType\"]").arrowClick().wait(500);
  cy.get("div[id^=react-select]").contains(params.recordType).arrowClick().wait(500);

  if (params.recordForm) {
    cy.get("[data-cy=\"field-selectForm\"]").arrowClick().wait(500);
    cy.get("div[id^=react-select]").contains(params.recordForm).arrowClick();
  }
  cy.unClick();
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("equipSelectRecordFormFromMultiSelect", (params: {recordType: string; recordForm?: string}) => {
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
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("equipClickCreateNew", () => {
  cy.wrapWithWaitOnApiCalls([
    CyRoutes.GetDocumentType,
    CyRoutes.GetSpecificDocumentType,
    CyRoutes.DocPreview], () => {
    cy.get("[id=DocumentByTypeListPresenter-openDocRev]").arrowClick();
  });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("equipReloadDocument", () => {
  cy.wrapWithWaitOnApiCalls([
    CyRoutes.DocPreview,
    CyRoutes.DocPreview], () => {
    cy.reload();
  });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});


Cypress.Commands.add("inspecSelectRecordFormFromMultiSelect", (params: {recordType: string; recordForm?: string}) => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
    cy.get("[id=\"MultipleFormTemplate-selectDocForm\"]").arrowClick();

    cy.get("div[id^=react-select]").contains(params.recordType).arrowClick();
    if (params.recordForm) {
      cy.get("[id=\"MultipleFormTemplate-selectDocType\"]").autocompleteSelect(params.recordForm);
    }
    cy.progressBarShouldAppear();
  });
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("equipSetTimeTravelInDays", (params: {days: number}) => {
  cy.navigToAsyncTasks();
  cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_COMPANY });
  cy.asyncSelectBackToTheFutureTime({ day: params.days });
  cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.RECALC_COMPLIANCE_FOR_EQUIPMENTS });
  cy.asyncTaskClickSubmit();
  cy.progressBarShouldNotExist();
  cy.wait(1000);
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("recCheckRevisionStage", (params: {stage: string}) => {
  cy.get("[data-cy=\"DocumentRevisionList-item\"]").contains(params.stage);
});

Cypress.Commands.add("recVerifyTitle", (params: {title: string}) => {
  cy.get("h5[id^=\"SummaryBaseProps\"]").should("have.text", params.title);
});

Cypress.Commands.add("recVerifyTitleWIP", (params: {title: string}) => {
  cy.get("[id=\"Title-field\"] input").should("have.attr", "value", params.title);
});

Cypress.Commands.add("recVerifyDescription", (params: {description: string}) => {
  cy.get("[data-cy=\"BaseWithhtml-editor\"] span>span").should("have.text", params.description);
});

Cypress.Commands.add("recVerifyDescriptionWIP", (params: {description: string}) => {
  cy.get("[data-cy^=\"RichTextEditor.description\"] span[data-text]").should("have.text", params.description);
});

Cypress.Commands.add("recApproveAndReleaseInlineRecord", () => {
  cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();

  cy.wrapWithWaitOnApiCalls([
    CyRoutes.ReleaseDocRevWithoutAr,
    CyRoutes.GetRequiredApproversDocRev],
  () => {
    cy.get("[data-cy=\"AlertDialog-continueButton\"]").arrowClick();
  });
});


Cypress.Commands.add("recFinalizeAndReleaseRecordWithoutApi", () => {
  cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
  cy.get("[data-cy=\"AlertDialog-continueButton\"]").arrowClick();
  cy.listLoadingElementShouldNotExist();
  cy.progressBarShouldNotExist();
});

Cypress.Commands.add("recFinalizeAndReleaseRecord", () => {
  cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();

  cy.wrapWithWaitOnApiCalls([ CyRoutes.ReleaseDocRevWithoutAr ],
    () => {
      cy.get("[data-cy=\"AlertDialog-continueButton\"]").arrowClick();
    });
});
