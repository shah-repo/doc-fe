/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable max-len */
import { int } from "aws-sdk/clients/datapipeline";
import { DocumentRevisionEditRequestBody } from "../../../../src/state/ducks/documentRevisions/types";
import { CONFIG } from "../../config";
import { CyRoutes } from "../../routes";

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      drCreateDocumentRevision(params: { payload: DocumentRevisionEditRequestBody; employeeId: string; sessionId: string }): Chainable<Subject>;
      drGetDocumentType(params: { employeeId: string; sessionId: string }): Chainable<Subject>;
      drEnterDocumentTitle(params: { name: string }): Chainable<Subject>;
      drEnterDocumentDescription(params: { description: string }): Chainable<Subject>;
      drEnterDocumentDescriptionWithWait(params: { description: string }): Chainable<Subject>;
      drSelectDocumentType(params: { documentType: string }): Chainable<Subject>;
      drSelectOutputDocumentType(params: { documentType: string }): Chainable<Subject>;
      drApproveAndReleaseDocument(): Chainable<Subject>;
      drCloseApproveAndReleaseDialog(): Chainable<Subject>;
      drClickCreateDocumentWithApiCall(): Chainable<Subject>;
      drClickCreateDocumentWithoutApiCall(): Chainable<Subject>;
      drCheckDocumentStatus(params: { status: string }): Chainable<Subject>;
      drCheckIfDocumentIdIsGenerated(): Chainable<Subject>;
      drCheckIfDocumentIdMatches(params: { docId: string }): Chainable<Subject>;
      drFilterDocListByNameAndStatus(params: { title: string; status: string }): Chainable<Subject>;
      drChangeOwner(params: { employee: string }): Chainable<Subject>;
      drChangeOwnerFromMenu(params: { employee: string }): Chainable<Subject>;
      drClickReviseDocument(): Chainable<Subject>;
      drClickTrainingRequired(): Chainable<Subject>;
      drCheckTypeOfRevisionChangeOptions(): Chainable<Subject>;
      drAddOutputDocType(params: { documentType: string }): Chainable<Subject>;
      drSelectOutputDocTypeSecondTime(params: { documentType: string }): Chainable<Subject>;
      drChooseTypeOfRevisionChangeOption(params: { option: string }): Chainable<Subject>;
      drDocumentFieldError(params: { field: string; message: string }): Chainable<Subject>;
      closeAllAlertMessages(): Chainable<Subject>;
      checkToastMessage(params: { exists: boolean }): Chainable<Subject>;

      /* Document Approval Matrix */

      drAddAnotherRoleBtn(): Chainable<Subject>;
      drEnterApprovalRole(params: { name: string }): Chainable<Subject>;
      drEnterApprovingGroups(...groups: string[]): Chainable<Subject>;
      drEnterApprovingUsers(...employees: string[]): Chainable<Subject>;
      drAddApprovalRole(): Chainable<Subject>;
      drAddApprovalMatrixItem(): Chainable<Subject>;
      drAddAMItemValue(params: { identity: string; value: string }): Chainable<Subject>;
      drAMInternalType(params: { value: string }): Chainable<Subject>;
      drAMCheckValue(params: { identity: string }): Chainable<Subject>;
      drAMCheckRole(params: { stage: string; index: number }): Chainable<Subject>;
      drUpgradeRevisionLevel(): Chainable<Subject>;
      drRoleExistsAndChecked(params: { group: number; role: string }): Chainable<Subject>;

      /* Document Approval Matrix End */
      drCreateNewDocumentFromForm(): Chainable<Subject>;
      drApproveAndReleaseDialog(): Chainable<Subject>;
      drSelectTemplateReleaseDocument(params: { template: string }): Chainable<Subject>;
      drAPIApproveAndRelease(params: { documentId: string; payload: IApproveAndReleasePayload; employeeId: string; sessionId: string }): Chainable<Subject>;
      drSetDocTypeId(params: { docId: string }): Chainable<Subject>;
      drSelectReferences(...list: string[]): Chainable<Subject>;
      drRemoveReferences(...list: int[]): Chainable<Subject>;
      drSelectReleasedVersionOfDocument(params: { docVersion: int }): Chainable<Subject>;
      drAdministrativeRevisionLevel(): Chainable<Subject>;
      drAddApprover(params: { name: string }): Chainable<Subject>;
      drUpdateDocumentTypeName(params: { employeeId: string; sessionId: string; payload: any; id: string }): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("drCreateDocumentRevision", (params: {
  payload: DocumentRevisionEditRequestBody;
  employeeId: string;
  sessionId: string;
}) => {
  cy.request({
    method: "POST",
    url: `${CONFIG.BE_URL}/api/v1/document_revisions`,
    body: params.payload,
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
  }).then((response) => response.body);
});

Cypress.Commands.add("drGetDocumentType", (params: { employeeId: string; sessionId: string }) => {
  const auth = params.employeeId === "" ? `bearer_admin ${params.sessionId}` : `bearer ${params.employeeId}:${params.sessionId}`;
  cy.request({
    method: "GET",
    url: `${CONFIG.BE_URL}/api/v1/document_type`,
    headers: {
      Authorization: auth,
    },
  }).then((response) => response ? response.body : []);
});

Cypress.Commands.add("drUpdateDocumentTypeName", (params: { employeeId: string; sessionId: string; payload: any; id: string }) => {
  cy.request({
    method: "PATCH",
    url: `${CONFIG.BE_URL}/api/v1/document_type/${params.id}`,
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
    body: params.payload,
  }).then((response) => response ? response.body : {})
    .then((response) => JSON.stringify(response));
});


Cypress.Commands.add("drSelectReferences", (...list: string[]) => {
  list.forEach((item) => {
    cy.get("[id=\"referenceTo\"]").click().type(item + "{downarrow}{enter}");
  });
});


Cypress.Commands.add("drSelectReleasedVersionOfDocument", (params: { docVersion: int }) => {
  cy.get("[data-cy=\"DocumentRevisionList-item\"]").eq(params.docVersion).click().wait(2000);
});

Cypress.Commands.add("drRemoveReferences", (...list: int[]) => {
  list.forEach((item) => {
    cy.get("[class=\"circle_remove\"]").eq(item).click({ force: true });
  });
});

Cypress.Commands.add("drEnterDocumentTitle", (params: { name: string }) => {
  cy.get("[data-cy=\"field-name\"]").type(params.name);
});

Cypress.Commands.add("drEnterDocumentDescription", (params: { description: string }) => {
  cy.get("[data-cy=\"RichTextEditor.description\"]>div>div>div>div>div[contenteditable]").type(params.description);
  cy.get("[data-cy=field-description]>label").click().wait(1000);
});

Cypress.Commands.add("drEnterDocumentDescriptionWithWait", (params: { description: string }) => {
  cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
    cy.get("[data-cy=\"RichTextEditor.description\"]>div>div>div>div>div[contenteditable]").type(params.description);
    cy.get("[data-cy=field-description]>label").click();
  });
});

Cypress.Commands.add("drSelectDocumentType", (params: { documentType: string }) => {
  cy.get("[data-cy=\"select.document.documentType.id\"]").click();
  cy.get(`[data-cy="selectItem.document.documentType.id.${params.documentType}"]`).click();
});

Cypress.Commands.add("drSelectOutputDocumentType", (params: { documentType: string }) => {
  cy.get("[data-cy=\"field-outputDocumentTypes\"]").click();
  cy.get("[data-cy=\"field-outputDocumentTypes\"]").type(`${params.documentType}{enter}`).wait(500);
});

Cypress.Commands.add("drAddOutputDocType", (params: { documentType: string }) => {
  cy.get("[data-cy=\"field-outputDocumentTypes\"]").click();
  cy.get("[data-cy=\"field-outputDocumentTypes\"]").type(`${params.documentType}{enter}`);
});

Cypress.Commands.add("drApproveAndReleaseDocument", () => {
  cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
  cy.get("#FormList-selectForm").type("Initial AR Form{enter}");

  cy.wrapWithWaitOnApiCall(
    CyRoutes.ReleaseDocRev,
    () => {
      cy.get("[data-cy=\"ApproveAndRelease-submit\"]").click();
    });
});

Cypress.Commands.add("drCloseApproveAndReleaseDialog", () => {
  cy.get("[data-cy=\"ApproveAndRelease-cancelButton\"]").click();
});

Cypress.Commands.add("drClickCreateDocument", () => {
  cy.get("[data-cy=\"DocumentRevisionForm-submit\"]", { timeout: 5 * 1000 }).click();
});

Cypress.Commands.add("drClickCreateDocumentWithApiCall", () => {
  cy.wrapWithWaitOnApiCall(
    CyRoutes.PostOrPatchDocRev,
    () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").click();
    });
});

Cypress.Commands.add("drClickCreateDocumentWithoutApiCall", () => {
  cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").click();
});

Cypress.Commands.add("drCheckDocumentStatus", (params: { status: string }) => {
  cy.wait(5000);
  cy.get("[id=HeaderInfo-status]").should("have.text", params.status);
});

Cypress.Commands.add("drCheckIfDocumentIdIsGenerated", () => {
  cy.get("[id=\"document.docId\"]").invoke("val").should("not.be.empty");
});

Cypress.Commands.add("drCheckIfDocumentIdMatches", (params: { docId: string }) => {
  cy.get("[id=\"document.docId\"]").should("have.value", params.docId);
});

Cypress.Commands.add("drSetDocTypeId", (params: { docId: string }) => {
  cy.get("[id=\"document.docId\"]").type("{backspace}{backspace}{backspace}{backspace}{backspace}" + params.docId);
});

Cypress.Commands.add("drFilterDocListByNameAndStatus", (params: { title: string; status: string }) => {
  cy.get("#clearFilter").click().wait(500);
  cy.get("#name").type(params.title).wait(500);
  cy.get("[id=\"mui-component-select-status[]\"]").click().wait(300);
  cy.get("li[data-value]").contains(params.status).click().wait(500);
  cy.get(".ReactVirtualized__Table__rowColumn").contains(params.title).click();
});

Cypress.Commands.add("drChangeOwnerFromMenu", (params: { employee: string }) => {
  cy.get("#HeaderMenuButton").click();
  cy.drChangeOwner({ employee: params.employee });
});

Cypress.Commands.add("drChangeOwner", (params: { employee: string }) => {
  cy.get("#OwnerChangerPresenter-changeOwner").click();
  cy.get("#employee").click();
  cy.get(`[data-cy="selectItem.employee.${params.employee}"]`).click();
  cy.get("#OwnerChangerPresenter-submitButton").click();
});

Cypress.Commands.add("drClickReviseDocument", () => {
  cy.get("[data-cy=\"updateRecord\"]").click();
});

Cypress.Commands.add("drClickTrainingRequired", () => {
  cy.get("input[type=checkbox]").click();
});

Cypress.Commands.add("drCheckTypeOfRevisionChangeOptions", () => {
  cy.get("[data-cy=\"field-revisionChangeType\"]");
  cy.get("#RevisionTypeChange-nextRevision").contains("Next Revision");
  cy.get("#RevisionTypeChange-nextRevisionStage").contains("Upgrade to Next Revision Level");
  cy.get("#RevisionTypeChange-obsolete").contains("Obsolete");
  cy.get("#RevisionTypeChange-administrativeChange").contains("Administrative Change");
});

Cypress.Commands.add("drChooseTypeOfRevisionChangeOption", (params: { option: string }) => {
  cy.get("[data-cy=\"field-revisionChangeType\"]");
  cy.get("label").contains(params.option).click();
});

Cypress.Commands.add("drDocumentFieldError", (params: { field: string; message: string }) => {
  cy.get(`[data-cy="${params.field}"] .MuiFormHelperText-root.Mui-error`).should("have.text", params.message);
});

Cypress.Commands.add("checkToastMessage", (params: { exists: boolean }) => {
  cy.get(".Toastify").should((params.exists ? "not." : "") + "be.empty");
});

Cypress.Commands.add("closeAllAlertMessages", () => {
  cy.get(".Toastify__close-button").click({ multiple: true, force: true });
});

Cypress.Commands.add("drCreateNewDocumentFromForm", () => {
  cy.get("[data-cy=\"PreviewControlsContainer-createNew\"]", { timeout: 50 * 1000 }).click();
});

Cypress.Commands.add("drAddAnotherRoleBtn", () => {
  cy.get("[data-cy=\"form.builder.add.another.role\"]").click();
});

Cypress.Commands.add("drEnterApprovalRole", (params: { name: string }) => {
  cy.get("[data-cy=\"name\"]").type(params.name);
});

Cypress.Commands.add("drEnterApprovingGroups", (...groups: string[]) => {
  groups.forEach((group) => {
    cy.get("[data-cy=\"groups\"]").click();
    cy.get(".MuiAutocomplete-popper").contains(group).click();
  });
});

Cypress.Commands.add("drEnterApprovingUsers", (...employees: string[]) => {
  employees.forEach((employee) => {
    cy.get("[data-cy=\"employees\"]").click();
    cy.get(".MuiAutocomplete-popper").contains(employee).click();
  });
});

Cypress.Commands.add("drAddApprovalRole", () => cy.get("[data-cy=\"common.add\"]").click());

Cypress.Commands.add("drAddApprovalMatrixItem", () => cy.get("[data-cy=\"form.builder.add.item\"]").click({ force: true }));

Cypress.Commands.add("drAddAMItemValue", (params: { identity: string; value: string }) => cy.get(`[data-cy="${params.identity}"] input`).type(params.value, { force: true }));

Cypress.Commands.add("drAMInternalType", (params: { value: string }) => {
  // TODO: Add a better identifier to get internal type dropdown
  cy.get(`.MuiTableCell-root .MuiSelect-select`).click();
  cy.get(`.MuiButtonBase-root.MuiListItem-root`).contains(params.value).click();
});

Cypress.Commands.add("drAMCheckRole", (params: { stage: string; index: number }) => {
  // We are spotting approvalMatrix.approvalRoles.stage1.0
  cy.get(`[data-cy="approvalMatrix.approvalRoles.${params.stage}.${params.index}"]`).click({ force: true });
});

Cypress.Commands.add("drAMCheckValue", (params: { identity: string }) => cy.get(`[data-cy="${params.identity}"]`).click({ force: true }));

Cypress.Commands.add("drUpgradeRevisionLevel", () => cy.get(`[data-cy="upgradeNextRevisionStage"]`).click({ force: true }));

Cypress.Commands.add("drRoleExistsAndChecked", (params: { group: number; role: string }) => {
  cy.get(`[data-cy="group-${params.group}"]`).contains(params.role);
  cy.get(`[data-cy="checked-${params.group}"]`).should("be.visible");
});

Cypress.Commands.add("drApproveAndReleaseDialog", () => {
  cy.get("[data-cy=\"ApproveAndRelease-button\"]", { timeout: 5 * 1000 }).click();
});

Cypress.Commands.add("drSelectTemplateReleaseDocument", (params: { template: string }) => {
  cy.get("#FormList-selectForm").type(`${params.template}{enter}`);
  cy.wrapWithWaitOnApiCall(
    CyRoutes.ReleaseDocRev,
    () => {
      cy.get("[data-cy=\"ApproveAndRelease-submit\"]").click();
    });
});

Cypress.Commands.add("drAdministrativeRevisionLevel", () => {
  cy.get(`[data-cy="RevisionTypeChange-administrativeChange"]`).click({ force: true });
});

Cypress.Commands.add("drAddApprover", (params: {name: string}) => {
  cy.get(`[data-cy="field-approvals"]`).type(`${params.name}{enter}`);
});

export interface IApproveAndReleasePayload{
  effectiveDate: string;
  documentType: { id: string };
  formDocument: { id: string };
}

Cypress.Commands.add("drAPIApproveAndRelease", (params: {
  documentId: string;
  payload: IApproveAndReleasePayload;
  employeeId: string;
  sessionId: string;
}) => {
  cy.request({
    method: "POST",
    url: `${CONFIG.BE_URL}/api/v1/document_revisions/release/` + params.documentId,
    body: params.payload,
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
  }).then((response) => response.body);
});

