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
      drClearDocumentTitle(): Chainable<Subject>;
      drEnterDocumentDescription(params: { description: string }): Chainable<Subject>;
      drEnterDocumentDescriptionWithWait(params: { description: string }): Chainable<Subject>;
      drSelectDocumentType(params: { documentType: string }): Chainable<Subject>;
      drSelectOutputDocumentType(params: { documentType: string }): Chainable<Subject>;
      drEnterHtmlText(params: { htmlText: string }): Chainable<Subject>;
      drApproveAndReleaseDocument(): Chainable<Subject>;
      drApproveAndReleaseDocumentWithoutSelectingForm(params?: { toastifyExists: boolean }): Chainable<Subject>;
      drCloseApproveAndReleaseDialog(): Chainable<Subject>;
      drClickCreateDocumentWithApiCall(params?: { toastifyExists: boolean }): Chainable<Subject>;
      drClickCreateSupplierWithApiCall(): Chainable<Subject>;
      drClickCreateDocumentWithApiCallForForms(): Chainable<Subject>;
      drClickCreateDocumentWithApiCallForFormsExpectingToastError(): Chainable<Subject>;
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
      drSelectOutputDocTypeSecondTime(params: { documentType: string }): Chainable<Subject>;
      drChooseTypeOfRevisionChangeOption(params: { option: string }): Chainable<Subject>;
      drSelectRevisionStageOptions(params: { revisionStageOption: string }): Chainable<Subject>;
      drAssignDocumentTo(params: { username: string }): Chainable<Subject>;
      drDocumentFieldError(params: { field: string; message: string }): Chainable<Subject>;
      closeAllAlertMessages(): Chainable<Subject>;
      checkToastMessage(params: { exists: boolean }): Chainable<Subject>;
      checkToastMessageIsNotEmpty(params: { exists: boolean }): Chainable<Subject>;
      checkToastMessageIsEqual(params: { message: string }): Chainable<Subject>;
      checkToastMessageContains(params: { message: string }): Chainable<Subject>;
      drCheckApprovalsEnforcment(): Chainable<Subject>;
      drVerifyFirstDocumentRevisionList(params: { revision: string }): Chainable<Subject>;

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
      drReleaseDocAfterRoleExistsAndChecked(params: { group: number; role: string }): Chainable<Subject>;
      drNewTypeTrainingSelect(): Chainable<Subject>;
      drClickDAMEditBtn(): Chainable<Subject>;

      /* Document Approval Matrix End */
      drCreateNewDocumentFromForm(): Chainable<Subject>;
      drApproveAndReleaseDialog(): Chainable<Subject>;
      drSelectTemplateReleaseDocument(params: { template: string; selectDate?: boolean }): Chainable<Subject>;
      drAPIApproveAndRelease(params: { documentId: string; payload: IApproveAndReleasePayload; employeeId: string; sessionId: string }): Chainable<Subject>;
      drSetDocTypeId(params: { docId: string }): Chainable<Subject>;
      drSelectReferences(...list: string[]): Chainable<Subject>;
      drRemoveReferences(...list: int[]): Chainable<Subject>;
      drSelectReleasedVersionOfDocument(params: { docVersion: int }): Chainable<Subject>;
      drAdministrativeRevisionLevel(): Chainable<Subject>;
      drAddApprover(params: { name: string }): Chainable<Subject>;
      drUpdateDocumentTypeName(params: { employeeId: string; sessionId: string; payload: any; id: string }): Chainable<Subject>;
      drClickOnSpecificDocFromList(params: { item: string }): Chainable<Subject>;
      drCancelDraftButton(): Chainable<Subject>;
      drIsTrainingRequired(params: {shouldBe: boolean}): Chainable<Subject>;
      drApproveAndReleaseNonQMSDocument(): Chainable<Subject>;
      drApproveAndReleaseNonQMSDocumentWithoutSelectingFrom(): Chainable<Subject>;
      drSelectHistoryTab(): Chainable<Subject>;
      drOpenCloseSidebarDrawer(): Chainable<Subject>;
      drSelectPermissionTab(): Chainable<Subject>;
      drVerifyDocumentOWner(params: {owner: string}): Chainable<Subject>;
      drChangeOwnerByAdmin(params: {employee: string}): Chainable<Subject>;
      drSelectUser(...users: string[]): Chainable<Subject>;
      drAddUserFromPermissionTab(...users: string[]): Chainable<Subject>;
      drSelectGroup(...groups: string[]): Chainable<Subject>;
      drAddGroupFromPermissionTab(...groups: string[]): Chainable<Subject>;
      drRequestAccessVisibility(params: {isVisible: boolean}): Chainable<Subject>;
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

Cypress.Commands.add("drClickOnSpecificDocFromList", (params: {item: string}) => {
  cy.get("#clearFilter").click().wait(500);
  cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
    cy.get("[class*=\"ReactVirtualized__Table__row \"]").contains(params.item).click();
  });
  cy.wait(1000);
});

Cypress.Commands.add("drSelectReferences", (...list: string[]) => {
  list.forEach((item) => {
    cy.get("[data-cy=\"referenceTo\"]").click().type(item + "{downarrow}{enter}");
  });
});

Cypress.Commands.add("drClickDAMEditBtn", () => {
  cy.get("[data-cy=\"EditBtnDAM\"]").click();
});

Cypress.Commands.add("drVerifyFirstDocumentRevisionList", (params: {revision: string}) => {
  cy.get(" [data-cy=\"DocumentRevisionList-item\"]>a>div").first()
    .then(($el) => {
      const text = $el.text();
      expect(text.replace(/\u00a0/g, " ")).to.contain(params.revision);
    });
});

Cypress.Commands.add("drCheckApprovalsEnforcment", () => {
  cy.drApproveAndReleaseDialog();
  cy.wait(2000);
  cy.get("[data-cy=unchecked]").should("exist");
  cy.get("[data-cy=group-0]").should("have.text", "Role One");
  cy.get("[data-cy=\"ApproveAndRelease-submit\"]").click();
  cy.checkToastMessageContains({ message: "at least one approver from group Role One has to be selected" });
  cy.closeAllAlertMessages();
  cy.drCloseApproveAndReleaseDialog();
});

Cypress.Commands.add("drCancelDraftButton", () => {
  cy.wrapWithWaitOnApiCall(
    CyRoutes.PatchCancelDocRev, () => {
      cy.get("[data-cy=\"HeaderMenuButton\"]").click();
      cy.get("[data-cy=\"cancelDraftButton\"]").click();
      cy.get("[data-cy=\"AlertDialog-continueButton\"]").click();
    });
});

Cypress.Commands.add("drVerifyDocumentOWner", (params: { owner: string }) => {
  cy.get("[data-cy=\"DocumentRevisionList-item\"]").contains(params.owner);
});

Cypress.Commands.add("drSelectReleasedVersionOfDocument", (params: { docVersion: int }) => {
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevPreview, () => {
    cy.get("[data-cy=\"DocumentRevisionList-item\"]").eq(params.docVersion).click();
  });
});

Cypress.Commands.add("drRemoveReferences", (...list: int[]) => {
  list.forEach((item) => {
    cy.get("[class=\"circle_remove\"]").eq(item).click({ force: true });
  });
  cy.get("[data-cy=field-referenceTo] h5").click();
});

Cypress.Commands.add("drEnterDocumentTitle", (params: { name: string }) => {
  cy.get("[data-cy=\"field-name\"]").type(params.name);
});

Cypress.Commands.add("drClearDocumentTitle", () => {
  cy.get("[data-cy=\"field-name\"] svg").click();
});

Cypress.Commands.add("drEnterDocumentDescription", (params: { description: string }) => {
  cy.get("[data-cy=\"RichTextEditor.description\"]>div>div>div>div>div[contenteditable]").clear().type(params.description);
  cy.get("[data-cy=field-description]>label").click().wait(1000);
});

Cypress.Commands.add("drEnterDocumentDescriptionWithWait", (params: { description: string }) => {
  cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
    cy.get("[data-cy=\"RichTextEditor.description\"]>div>div>div>div>div[contenteditable]").type(params.description);
    cy.get("[data-cy=field-description]>label").click();
  });
});

Cypress.Commands.add("drSelectDocumentType", (params: { documentType: string }) => {
  cy.wrapWithWaitOnApiCall(
    CyRoutes.GetProposedDocId, () => {
      cy.get("[data-cy=\"select.document.documentType.id\"]").click();
      cy.get(`[data-cy="selectItem.document.documentType.id.${params.documentType}"]`).click();
    });
  cy.wait(500);
});

Cypress.Commands.add("drSelectOutputDocumentType", (params: { documentType: string }) => {
  cy.get("[data-cy=\"field-outputDocumentTypes\"]").click();
  cy.get("[data-cy=\"field-outputDocumentTypes\"]").type(`${params.documentType}{enter}`).wait(500);
});

Cypress.Commands.add("drEnterHtmlText", (params: { htmlText: string }) => {
  cy.get("[data-cy=\"field-renderHTML\"]").click();
  cy.get("[data-cy=\"field-renderHTML\"]").type(`${params.htmlText}{enter}`).wait(500);
});

Cypress.Commands.add("drApproveAndReleaseDocumentWithoutSelectingForm", (params: { toastifyExists: boolean }) => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApprovers, CyRoutes.GetAvailableApprovers], () => {
    cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
  });
  cy.wait(2000);
  cy.wrapWithWaitOnApiCall(
    CyRoutes.ReleaseDocRev,
    () => {
      cy.get("[data-cy=\"ApproveAndRelease-submit\"]").click();
    });
  cy.wait(500);
  if (params === undefined)
  {
    cy.checkToastMessage({ exists: false });
  }
  else {
    if (params.toastifyExists)
    {
      cy.checkToastMessage({ exists: true });
    }
    else
    {
      cy.checkToastMessage({ exists: false });
    }
  }
});

Cypress.Commands.add("drApproveAndReleaseDocument", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApprovers, CyRoutes.GetAvailableApprovers], () => {
    cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
  });
  cy.wait(500);
  cy.get("#FormList-selectForm").type("AR Form{enter}");
  cy.wrapWithWaitOnApiCall(
    CyRoutes.ReleaseDocRev,
    () => {
      cy.get("[data-cy=\"ApproveAndRelease-submit\"]").click();
    });
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("drApproveAndReleaseNonQMSDocument", () => {
  cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
  cy.get("#FormList-selectForm").type("AR Form{enter}");
  cy.get("[data-cy=\"ApproveAndRelease-submit\"]").click();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("drApproveAndReleaseNonQMSDocumentWithoutSelectingFrom", () => {
  cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
  cy.get("[data-cy=\"ApproveAndRelease-submit\"]").click();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("drCloseApproveAndReleaseDialog", () => {
  cy.get("[data-cy=\"ApproveAndRelease-cancelButton\"]").click();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("drClickCreateDocumentWithApiCall", (params?: { toastifyExists: boolean }) => {
  cy.wrapWithWaitOnApiCalls(
    [CyRoutes.PostOrPatchDocRev, CyRoutes.EmployeesGet, CyRoutes.GetRequiredApprovers], () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").click();
    });
  cy.wait(500);
  if (params === undefined)
  {
    cy.checkToastMessage({ exists: false });
  }
  else {
    if (params.toastifyExists)
    {
      cy.checkToastMessage({ exists: true });
    }
    else
    {
      cy.checkToastMessage({ exists: false });
    }
  }
});

Cypress.Commands.add("drClickCreateSupplierWithApiCall", () => {
  cy.wrapWithWaitOnApiCalls(
    [CyRoutes.GetDocAudit, CyRoutes.GetDocAggregatedAudit], () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").click();
    });
  cy.checkToastMessage({ exists: false });
  cy.wait(500);
});

Cypress.Commands.add("drClickCreateDocumentWithApiCallForForms", () => {
  cy.wrapWithWaitOnApiCalls(
    [CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").click();
    });
  cy.checkToastMessage({ exists: false });
  cy.wait(2000);
});

Cypress.Commands.add("drClickCreateDocumentWithApiCallForFormsExpectingToastError", () => {
  cy.wrapWithWaitOnApiCalls(
    [CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").click();
    });
  cy.checkToastMessage({ exists: true });
  cy.wait(500);
});

Cypress.Commands.add("drClickCreateDocumentWithoutApiCall", () => {
  cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").click();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("drCheckDocumentStatus", (params: { status: string }) => {
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
  cy.dlClearFilters();
  cy.wrapWithWaitOnApiCall(CyRoutes.GetDocRevs, () => {
    cy.get("#name").type(params.title);
  });
  cy.wrapWithWaitOnApiCall(CyRoutes.GetDocRevs, () => {
    cy.get("[id=\"mui-component-select-displayStatus\"]").click().wait(300);
    cy.get("li[data-value]").contains(params.status).click().wait(500);
  });
  cy.dlSelectFirstDocument();
});

Cypress.Commands.add("drChangeOwnerFromMenu", (params: { employee: string }) => {
  cy.get("#HeaderMenuButton").click();
  cy.drChangeOwner({ employee: params.employee });
});

Cypress.Commands.add("drChangeOwnerByAdmin", (params: { employee: string }) => {
  cy.get("[data-cy=\"changeOwner\"]").click();
  cy.get("#employee").click();
  cy.get(`[data-cy="selectItem.employee.${params.employee}"]`).click();
  cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
    cy.get("[data-cy=\"changeOwner-submit\"]").click();
  });
});

Cypress.Commands.add("drChangeOwner", (params: { employee: string }) => {
  cy.get("[data-cy=\"changeOwner\"]").click();
  cy.get("#employee").click();
  cy.get(`[data-cy="selectItem.employee.${params.employee}"]`).click();
  cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
    cy.get("[data-cy=\"changeOwner-submit\"]").click();
  });
});

Cypress.Commands.add("drClickReviseDocument", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetRequiredApprovers, () => {
    cy.get("[data-cy=\"updateRecord\"]").click();
  });
});

Cypress.Commands.add("drClickTrainingRequired", () => {
  cy.get("[data-cy=\"field-retrain\"] input[type=checkbox]").click();
});

Cypress.Commands.add("drCheckTypeOfRevisionChangeOptions", () => {
  cy.get("[data-cy=\"field-revisionChangeType\"]");
  cy.get("#RevisionTypeChange-nextRevision").contains("Next Revision");
  cy.get("#RevisionTypeChange-nextRevisionStage").contains("Upgrade to Next Revision Level");
  cy.get("#RevisionTypeChange-obsolete").contains("Obsolete");
  cy.get("#RevisionTypeChange-administrativeChange").contains("Administrative Change");
});

Cypress.Commands.add("drSelectRevisionStageOptions", (params: {revisionStageOption: string}) => {
  cy.get("[data-cy^=\"common.\"]");
  cy.get("label").contains(params.revisionStageOption).click();
});

Cypress.Commands.add("drAssignDocumentTo", (params: {username: string}) => {
  cy.get("[id='document.assing.to.sidebar']>div>div>div:nth-child(2)>div>input").type(`${params.username}{downarrow}{enter}`, { force: true });
  cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.GetRequiredApproversDocRev], () => {
    cy.get("[data-cy='add-user'").eq(2).click();
  });
});

Cypress.Commands.add("drChooseTypeOfRevisionChangeOption", (params: { option: string }) => {
  cy.get("[data-cy=\"field-revisionChangeType\"]");
  cy.get("label").contains(params.option).click();
});

Cypress.Commands.add("drDocumentFieldError", (params: { field: string; message: string }) => {
  cy.get(`[data-cy="${params.field}"] .MuiFormHelperText-root.Mui-error`).should("have.text", params.message);
});

Cypress.Commands.add("checkToastMessage", (params: { exists: boolean }) => {
  cy.get(".Toastify")
    .find("div.Toastify__toast.Toastify__toast--error", { timeout: 3000 })
    .should((params.exists ? "exist" : "not.exist"));
});

Cypress.Commands.add("checkToastMessageIsNotEmpty", (params: { exists: boolean }) => {
  cy.get(".Toastify").should((params.exists ? "not." : "") + "be.empty");
});

Cypress.Commands.add("checkToastMessageIsEqual", (params: { message: string }) => {
  cy.get(".Toastify").should("have.text", params.message);
});

Cypress.Commands.add("checkToastMessageContains", (params: { message: string }) => {
  cy.get(".Toastify").should("contain.text", params.message);
});

Cypress.Commands.add("closeAllAlertMessages", () => {
  cy.get(".Toastify__close-button").click({ multiple: true, force: true });
});

Cypress.Commands.add("drCreateNewDocumentFromForm", () => {
  cy.get("[data-cy=\"PreviewControlsContainer-createNew\"]", { timeout: 50 * 1000 }).click();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("drAddAnotherRoleBtn", () => {
  cy.get("button[data-cy=\"form.builder.add.another.role\"]").click();
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

Cypress.Commands.add("drAddApprovalRole", () => cy.get("button[data-cy=\"common.add\"]").click());

Cypress.Commands.add("drAddApprovalMatrixItem", () => cy.get("button[data-cy=\"form.builder.add.item\"]").click({ force: true }));

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

Cypress.Commands.add("drReleaseDocAfterRoleExistsAndChecked", (params: { group: number; role: string }) => {
  cy.drApproveAndReleaseDialog();
  cy.wait(5000);
  cy.get(`[data-cy="group-${params.group}"]`).contains(params.role);
  cy.get(`[data-cy="checked-${params.group}"]`).should("be.visible");
  cy.wrapWithWaitOnApiCall(
    CyRoutes.ReleaseDocRev,
    () => {
      cy.get("[data-cy=\"ApproveAndRelease-submit\"]").click();
    });
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("drNewTypeTrainingSelect", () => {
  cy.get(`[data-cy="trainingReq"]`).click();
});

Cypress.Commands.add("drApproveAndReleaseDialog", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetAvailableApprovers, () => {
    cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
  });
});

Cypress.Commands.add("drSelectTemplateReleaseDocument", (params: { template: string; selectDate?: boolean }) => {
  if (params.selectDate) {
    cy.wait(500);
    cy.get("[aria-label=\"change date\"]").click().wait(200);
    cy.get("[class=\"MuiButtonBase-root MuiIconButton-root MuiPickersDay-day MuiPickersDay-current MuiPickersDay-daySelected\"]").click().wait(300);
  }
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

Cypress.Commands.add("drIsTrainingRequired", (params: {shouldBe: boolean}) => {
  cy.get("[data-cy=\"field-retrain\"] input[type=checkbox]").should(params.shouldBe ? "be.checked" : "not.be.checked");
});

Cypress.Commands.add("drSelectHistoryTab", () => {
  cy.get("[data-cy=\"timeline-icon\"]").click();
});

Cypress.Commands.add("drOpenCloseSidebarDrawer", () => {
  cy.get("[aria-label=\"Open drawer\"]>span>svg").click();
});

Cypress.Commands.add("drSelectPermissionTab", () => {
  cy.get("[data-cy=\"permission-icon\"]").click();
});

Cypress.Commands.add("drSelectUser", (...users: string[]) => {
  users.forEach((user) => {
    cy.get(`[data-cy="field-securityEmployees"]`).type(`${user}{downarrow}{enter}`);
  });
  cy.get(`[data-cy="field-securityEmployees"]`).click();
});

Cypress.Commands.add("drAddUserFromPermissionTab", (...users: string[]) => {
  users.forEach((user) => {
    cy.get(`[id="react-select-2-input"]`).type(`${user}{downarrow}{enter}`, { force: true });
    cy.get(`[data-cy="add-user"]`).eq(0).click();
  });
});

Cypress.Commands.add("drSelectGroup", (...groups: string[]) => {
  groups.forEach((group) => {
    cy.get(`[data-cy="field-securityGroups"]`).type(`${group}{downarrow}{enter}`);
  });
  cy.get(`[data-cy="field-securityGroups"]`).click();
});

Cypress.Commands.add("drAddGroupFromPermissionTab", (...groups: string[]) => {
  groups.forEach((group) => {
    cy.get(`[id="react-select-3-input"]`).type(`${group}{downarrow}{enter}`, { force: true });
    cy.get(`[data-cy="add-user"]`).eq(1).click();
  });
});

Cypress.Commands.add("drRequestAccessVisibility", (params: {isVisible: boolean}) => {
  cy.get(`[data-cy="PreviewControlsContainer-access"]`).should((params.isVisible ? "" : "not.") + "exist");
});
