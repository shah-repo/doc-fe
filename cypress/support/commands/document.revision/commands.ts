/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable max-len */
import { int } from "aws-sdk/clients/datapipeline";
import { bool } from "aws-sdk/clients/signer";
import { DocumentRevisionEditRequestBody } from "../../../../src/state/ducks/documentRevisions/types";
import { encodeString } from "../../../utils/context/converers";
import { CONFIG } from "../../config";
import { CyRoutes } from "../../routes";

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      drCreateDocumentRevision(params: { payload: DocumentRevisionEditRequestBody; employeeId: string; sessionId: string }): Chainable<Subject>;
      drGetDocumentType(params: { employeeId: string; sessionId: string }): Chainable<Subject>;
      drGetDocRevs(params: { employeeId: string; sessionId: string }): Chainable<Subject>;
      drEnterDocumentTitle(params: { name: string }): Chainable<Subject>;
      drEnterDocumentTitleWithWait(params: { name: string }): Chainable<Subject>;
      drClearDocumentTitle(): Chainable<Subject>;
      drSelectDetailsTab(): Chainable<Subject>;
      drSelectTrainingTab(): Chainable<Subject>;
      drSelectProcedureTab(): Chainable<Subject>;
      drSelectMaterialsAndEquipmentTab(): Chainable<Subject>;
      drSelectOverviewTab(): Chainable<Subject>;
      drSelectDocumentTab(): Chainable<Subject>;
      drSelectChangeDetailsTab(): Chainable<Subject>;
      drSelectLineItems(): Chainable<Subject>;
      drSelectSpecificationTab(): Chainable<Subject>;
      drSelectCalPmHistoryTab(): Chainable<Subject>;
      drSelectPrimaryOwner(params: { owner: string; noWait?: bool }): Chainable<Subject>;
      drEnterDocumentDescription(params: { description: string }): Chainable<Subject>;
      drEnterDocumentDescriptionWithPatchWrapCall(params: { description: string }): Chainable<Subject>;
      drSelectDocumentType(params: { documentType: string }): Chainable<Subject>;
      drSelectOutputDocumentType(params: { documentType: string }): Chainable<Subject>;
      drEnterHtmlText(params: { htmlText: string }): Chainable<Subject>;
      drApproveAndReleaseDocument(): Chainable<Subject>;
      drApproveAndReleaseDocumentWithoutSelectingForm(params?: { approverName?: string; toastifyExists?: boolean }): Chainable<Subject>;
      drCloseApproveAndReleaseDialog(): Chainable<Subject>;
      drClickCreateDocumentWithApiCall(params?: { toastifyExists?: boolean; requiredApproversDocRev?: boolean}): Chainable<Subject>;
      drClickCreateSupplierWithApiCall(): Chainable<Subject>;
      drClickCreateDocumentWithApiCallForForms(): Chainable<Subject>;
      drClickCreateDocumentWithApiCallForFormsExpectingToastError(): Chainable<Subject>;
      drClickCreateSupplierWithApiCallAudit(): Chainable<Subject>;
      drSaveDocumentWithoutaudit(): Chainable<Subject>;
      drClickCreateDocumentWithoutApiCall(): Chainable<Subject>;
      drCheckDocumentStatus(params: { status: string }): Chainable<Subject>;
      drGetDocIdElementFromUI(): Chainable<JQuery<HTMLElement>>;
      drGetChangeRequestLinkElementFromUI(): Chainable<JQuery<HTMLElement>>;
      drCheckIfDocumentIdIsGenerated(): Chainable<Subject>;
      drCheckIfDocumentIdMatches(params: { docId: string }): Chainable<Subject>;
      drFilterDocListByNameAndStatus(params: { title: string; status: string }): Chainable<Subject>;
      drFilterDocListByDocIdAndStatus(params: { docId: string; status: string }): Chainable<Subject>;
      drFilterDocListByDocIdAndName(params: { docId: string; title: string }): Chainable<Subject>;
      drChangeOwner(params: { employee: string }): Chainable<Subject>;
      drChangeOwnerFromMenu(params: { employee: string }): Chainable<Subject>;
      drCancelDraftFromMenu(): Chainable<Subject>;
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
      drVerifyFirstDocumentRevisionList(params: { revision: string; status: string }): Chainable<Subject>;
      drApproveAndReleaseDocumentWithSelectingApprover(users: string[], params?: { toastifyExists: boolean }): Chainable<Subject>;
      drClickUpgradeForm(): Chainable<Subject>;
      drClickRevisionsSidePanel(): Chainable<Subject>;
      drVerifyTitle(params: { title: string }): Chainable<Subject>;
      drVerifyDescription(params: { description: string }): Chainable<Subject>;
      drPatchDocType(params: {
        docTypeId: string;
        employeeId: string;
        sessionId: string;
        payload: any; }): Chainable<Subject>;

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
      drEditAddApprovingGroups(params: {eq: number}, ...groups: string[]): Chainable<Subject>;
      drEditRemoveApprovingGroups(params: {eq: number}, ...groups: string[]): Chainable<Subject>;
      drEditAddApprovingUsers(params: {eq: number}, ...users: string[]): Chainable<Subject>;
      drEditRemoveApprovingUsers(params: {eq: number}, ...users: string[]): Chainable<Subject>;

      /* Document Approval Matrix End */
      drCreateNewDocumentFromForm(): Chainable<Subject>;
      drCreateNewDocumentFromFormRecord(): Chainable<Subject>;
      drApproveAndReleaseDialog(): Chainable<Subject>;
      drSelectTemplateReleaseDocument(params: { template: string; selectDate?: boolean }): Chainable<Subject>;
      drAPIApproveAndRelease(params: { documentId: string; payload: IApproveAndReleasePayload; employeeId: string; sessionId: string }): Chainable<Subject>;
      drSetDocTypeId(params: { docId: string }): Chainable<Subject>;
      drSelectReferences(...list: string[]): Chainable<Subject>;
      drRemoveReferences(params: {reference: string}): Chainable<Subject>;
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
      drSelectBookmarksTab(): Chainable<Subject>;
      drSelectRevisionHistoryTab(): Chainable<Subject>;
      drSelectMigrateFormTab(): Chainable<Subject>;
      drOpenCloseSidebarDrawer(): Chainable<Subject>;
      drSelectPermissionTab(): Chainable<Subject>;
      drSelectApprovalRolesTab(): Chainable<Subject>;
      drSelectMatrixDetailsTab(): Chainable<Subject>;
      drVerifyDocumentOWner(params: {owner: string}): Chainable<Subject>;
      drChangeOwnerByAdmin(params: {employee: string}): Chainable<Subject>;
      drSelectUser(...users: string[]): Chainable<Subject>;
      drAddUserFromPermissionTab(...users: string[]): Chainable<Subject>;
      drSelectGroup(...groups: string[]): Chainable<Subject>;
      drAddGroupFromPermissionTab(...groups: string[]): Chainable<Subject>;
      drRequestAccessVisibility(params: {isVisible: boolean}): Chainable<Subject>;

      verifyDesSort(params: { index: number; colLength: number }): Chainable<Subject>;
      verifyAscSort(params: { index: number; colLength: number }): Chainable<Subject>;
      drClickMigrateForm(): Chainable<Subject>;
      drClickConfirmChange(): Chainable<Subject>;
      drSelectFormToBeMigrated(params: {formContains: string}): Chainable<Subject>;
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
  cy.request({
    method: "GET",
    url: `${CONFIG.BE_URL}/api/v1/document_type`,
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
  }).then((response) => response ? response.body : []);
});

Cypress.Commands.add("drGetDocRevs", (params: { employeeId: string; sessionId: string }) => {
  cy.request({
    method: "GET",
    url: `${CONFIG.BE_URL}/api/v1/document_revisions`,
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
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
  cy.dlClearFilters();
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevPreview, () => {
    cy.get("tr.k-master-row").contains(params.item).arrowClick();
  });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("drSelectReferences", (...list: string[]) => {
  list.forEach((item) => {
    cy.get("[data-cy=\"referenceTo\"]").autocompleteSelect(item);
  });
});

Cypress.Commands.add("drClickDAMEditBtn", () => {
  cy.get("[data-cy=\"EditBtnDAM\"]").arrowClick();
});

Cypress.Commands.add("drEditAddApprovingGroups", (params: {eq: number}, ...groups: string[]) => {
  groups.forEach((item) => {
    cy.get(`[data-cy="dar-built-in.${params.eq}.groups"]`).autocompleteSelect(item);
  });
});

Cypress.Commands.add("drEditRemoveApprovingGroups", (params: {eq: number}, ...groups: string[]) => {
  groups.forEach((item) => {
    cy.get(`[data-cy="dar-built-in.${params.eq}.groups"]`).parent()
      .contains(item).parent().parent().find("svg").arrowClick();
  });
});

Cypress.Commands.add("drEditAddApprovingUsers", (params: {eq: number}, ...users: string[]) => {
  users.forEach((item) => {
    cy.get(`[data-cy="dar-built-in.${params.eq}.employees"]`).autocompleteSelect(item);
  });
});

Cypress.Commands.add("drEditRemoveApprovingUsers", (params: {eq: number}, ...users: string[]) => {
  users.forEach((item) => {
    cy.get(`[data-cy="dar-built-in.${params.eq}.employees"]`).parent()
      .contains(item).parent().parent().find("svg").arrowClick();
  });
});

Cypress.Commands.add("drVerifyFirstDocumentRevisionList", (params: {revision: string; status: string}) => {
  cy.get(" [data-cy=\"HeaderInfo-Rev\"]").should("have.text", params.revision);
  cy.get(" div[data-cy=\"HeaderInfo-status\"]>span").should("contain", params.status);
});

Cypress.Commands.add("drCheckApprovalsEnforcment", () => {
  cy.drApproveAndReleaseDialog();

  cy.get("[data-cy=unchecked]").should("exist");
  cy.get("[data-cy=group-0]").should("have.text", "Role One");
  cy.get("input[name=password]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
  cy.get("[data-cy=\"ApproveAndRelease-submit\"]").arrowClick();
  cy.checkToastMessageContains({ message: "at least one approver from group Role One has to be selected" });
  cy.closeAllAlertMessages();
  cy.drCloseApproveAndReleaseDialog();
});

Cypress.Commands.add("drCancelDraftButton", () => {
  cy.wrapWithWaitOnApiCall(
    CyRoutes.PatchCancelDocRev, () => {
      cy.get("[data-cy=\"HeaderMenuButton\"]").arrowClick();
      cy.get("[data-cy=\"cancelDraftButton\"]").arrowClick();
      cy.get("[data-cy=\"AlertDialog-continueButton\"]").arrowClick();
    });
});

Cypress.Commands.add("drVerifyDocumentOWner", (params: { owner: string }) => {
  cy.get("[data-cy=\"generalInfo\"]>li>div>p").contains(params.owner);
});

Cypress.Commands.add("drSelectReleasedVersionOfDocument", (params: { docVersion: int }) => {
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevPreview, () => {
    cy.get("[data-cy=\"DocumentRevisionList-item\"]").eq(params.docVersion).arrowClick();
  });
});

Cypress.Commands.add("drSelectDetailsTab", () => {
  cy.get("[data-cy=\"tabCon-tabId.details\"]").arrowClick({ force: true });
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("drSelectTrainingTab", () => {
  cy.get("[data-cy=\"tabId.training\"]").arrowClick({ force: true });
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("drSelectProcedureTab", () => {
  cy.get("[data-cy=\"tabId.procedure\"]").arrowClick();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("drSelectMaterialsAndEquipmentTab", () => {
  cy.get("[data-cy=\"tabId.materialsandequipment\"]").arrowClick({ force: true });
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("drSelectDocumentTab", () => {
  cy.get("[data-cy=\"tabId.documents\"]").arrowClick();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("drSelectChangeDetailsTab", () => {
  cy.get("[data-cy=\"tabId.changedetails\"]").arrowClick();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("drSelectLineItems", () => {
  cy.get("[data-cy=\"tabId.lineitems\"]").arrowClick();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("drSelectSpecificationTab", () => {
  cy.get("[data-cy=\"tabId.specification\"]").arrowClick();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("drSelectCalPmHistoryTab", () => {
  cy.get("[data-cy=\"tabId.specification\"]").arrowClick();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("drSelectOverviewTab", () => {
  cy.get("[data-cy=\"tabId.overview\"]").arrowClick();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("drSelectPrimaryOwner", (params: { owner: string; noWait?: bool }) => {
  cy.get("[data-cy*='fb-primary-owner-eq']").eq(0).arrowClick({ force: true });
  cy.get("ul>li[role=\"option\"]").contains(params.owner).arrowClick({ force: true });
});

Cypress.Commands.add("drRemoveReferences", (params: {reference: string}) => {
  cy.get(`div[data-cy="field-referenceTo"]`).contains(params.reference)
    .parent().parent().parent()
    .find("svg").arrowClick({ force: true });
});

Cypress.Commands.add("drEnterDocumentTitle", (params: { name: string }) => {
  cy.get("[data-cy=\"field-name\"]").arrowClick().wait(500);
  cy.get("[data-cy=\"field-name\"]").arrowType(params.name).scrollIntoView();
  cy.unClick();
});

Cypress.Commands.add("drClearDocumentTitle", () => {
  cy.get("div[data-cy=\"field-name\"]").arrowClick();
  cy.get("div[data-cy=\"field-name\"]").find("svg").arrowClick();
});

Cypress.Commands.add("drEnterDocumentTitleWithWait", (params: { name: string }) => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
    cy.get("[data-cy=\"field-name\"]").arrowType(params.name);
    cy.unClick();
  });
  cy.progressBarShouldNotExist();
});

Cypress.Commands.add("drEnterDocumentDescription", (params: { description: string }) => {
  cy.get("[data-cy=\"description\"]").first().arrowClick().wait(1000);
  cy.get(`[data-cy="description"] [contenteditable]`).first().clear().arrowType(params.description);
  cy.unClick();
});

Cypress.Commands.add("drEnterDocumentDescriptionWithPatchWrapCall", (params: { description: string }) => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
    cy.get("[data-cy=\"description\"]").first().arrowClick().wait(1000);
    cy.get(`[data-cy="description"] [contenteditable]`).first().clear().arrowType(params.description);
    cy.unClick();
  });
});

Cypress.Commands.add("drSelectDocumentType", (params: { documentType: string }) => {
  cy.wrapWithWaitOnApiCall(
    CyRoutes.GetProposedDocId, () => {
      cy.get("[data-cy=\"select.document.documentType.id\"]").arrowClick();
      cy.get(`[data-cy="selectItem.document.documentType.id.${params.documentType}"]`).arrowClick();
    });

});

Cypress.Commands.add("drSelectOutputDocumentType", (params: { documentType: string }) => {
  cy.get("[data-cy=\"field-outputDocumentTypes\"]").type(params.documentType);
  cy.wait(1500);
  cy.get(`div[id^="react-select"]`).contains(params.documentType).arrowClick({ force: true });
  cy.unClick();
});

Cypress.Commands.add("drEnterHtmlText", (params: { htmlText: string }) => {
  cy.get("[name=\"renderHTML\"]")
    .click()
    .then(($element) => {
      $element.text(params.htmlText);
      $element.val(params.htmlText);
      cy.get("[name=\"renderHTML\"]").arrowType("{enter}");
    });
  cy.unClick();
});

Cypress.Commands.add("drApproveAndReleaseDocumentWithoutSelectingForm", (params?: { approverName?: string; toastifyExists?: boolean }) => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApprovers], () => {
    cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick().wait(1000);
  });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
  if (params !== undefined && params.approverName !== undefined)
  {
    cy.get("[data-cy='field-approvals']").arrowType(params.approverName);
    cy.get("[id^='react-select-']").contains(params.approverName).arrowClick();
  }
  cy.get("input[name=password]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(500);
  cy.unClick();
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
  cy.wrapWithWaitOnApiCall(
    CyRoutes.ReleaseDocRev,
    () => {
      cy.get("[data-cy=\"ApproveAndRelease-submit\"]").arrowClick().wait(1000);
    });
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
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("drApproveAndReleaseDocument", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApprovers, CyRoutes.GetAvailableApprovers], () => {
    cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
  });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
  cy.get("#FormList-selectForm").arrowType("AR Form{enter}").wait(500);
  cy.wrapWithWaitOnApiCall(
    CyRoutes.ReleaseDocRev,
    () => {
      cy.get("[data-cy=\"ApproveAndRelease-submit\"]").arrowClick();
    });
  cy.checkToastMessage({ exists: false });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("drApproveAndReleaseNonQMSDocument", () => {
  cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
  cy.get("#FormList-selectForm").arrowType("AR Form{enter}");
  cy.get("[data-cy=\"ApproveAndRelease-submit\"]").arrowClick();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("drApproveAndReleaseNonQMSDocumentWithoutSelectingFrom", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApprovers], () => {
    cy.get(`[data-cy="ApproveAndRelease-button"]`).arrowClick().wait(500);
  });
  cy.get("input[name=password]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(500);
  cy.unClick();
  cy.get(`[data-cy="ApproveAndRelease-submit"]`).arrowClick().wait(500);
  cy.checkToastMessage({ exists: false });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("drCloseApproveAndReleaseDialog", () => {
  cy.get("[data-cy=\"transition.action.cancel\"]").arrowClick();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("drClickCreateDocumentWithApiCall", (params?: { toastifyExists: boolean; requiredApproversDocRev?: boolean }) => {
  let routesToWait;
  if (params && params.requiredApproversDocRev) {
    routesToWait = [CyRoutes.PostOrPatchDocRev, CyRoutes.GetRequiredApproversDocRev];
  }
  else {
    routesToWait = [CyRoutes.PostOrPatchDocRev];
  }
  cy.wrapWithWaitOnApiCalls(
    routesToWait, () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick({ force: true });
    });
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
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("drClickCreateSupplierWithApiCall", () => {
  cy.wrapWithWaitOnApiCalls(
    [CyRoutes.PatchDocRev], () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
    });
  cy.checkToastMessage({ exists: false });

});

Cypress.Commands.add("drClickCreateSupplierWithApiCallAudit", () => {
  cy.wrapWithWaitOnApiCalls(
    [CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
    });
  cy.checkToastMessage({ exists: false });

});

Cypress.Commands.add("drClickCreateDocumentWithApiCallForForms", () => {
  cy.wrapWithWaitOnApiCalls(
    [CyRoutes.PatchDocRev], () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
    });
  cy.wait(1000);
  cy.checkToastMessage({ exists: false });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("drSaveDocumentWithoutaudit", () => {
  cy.wrapWithWaitOnApiCalls(
    [CyRoutes.PatchDocRev], () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
    });
  cy.checkToastMessage({ exists: false });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("drClickCreateDocumentWithApiCallForFormsExpectingToastError", () => {
  cy.wrapWithWaitOnApiCalls(
    [CyRoutes.PatchDocRev], () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
    });
  cy.checkToastMessage({ exists: true });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("drClickCreateDocumentWithoutApiCall", () => {
  cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
  cy.checkToastMessage({ exists: false });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("drCheckDocumentStatus", (params: { status: string }) => {
  cy.get(`div[data-cy="HeaderInfo-status"]>span`).should("contain", params.status);
});

Cypress.Commands.add("drGetDocIdElementFromUI", () => {
  cy.get(`span[data-cy="HeaderInfo-docId"]`);
});

Cypress.Commands.add("drGetChangeRequestLinkElementFromUI", () => {
  cy.get(`[id="ChangeRequestLink-linkButton"]`);
});

Cypress.Commands.add("drCheckIfDocumentIdIsGenerated", () => {
  cy.get("[id=\"document.docId\"]").invoke("val").should("not.be.empty");
});

Cypress.Commands.add("drCheckIfDocumentIdMatches", (params: { docId: string }) => {
  cy.get("[id=\"document.docId\"]").should("have.value", params.docId);
});

Cypress.Commands.add("drSetDocTypeId", (params: { docId: string }) => {
  cy.get("[id=\"document.docId\"]").arrowType("{backspace}{backspace}{backspace}{backspace}{backspace}" + params.docId);
});

Cypress.Commands.add("drFilterDocListByNameAndStatus", (params: { title: string; status: string }) => {
  cy.dlClearFilters();
  cy.landingPageLoadingElementShouldNotExist();
  cy.get(`[aria-colindex="3"] input`).arrowType(params.title).wait(500);
  cy.landingPageLoadingElementShouldNotExist();
  cy.get(`[aria-colindex="7"] [class="k-input"]`).arrowClick();
  cy.landingPageLoadingElementShouldNotExist();
  cy.get("li").contains(params.status).arrowClick().wait(500);
  cy.landingPageLoadingElementShouldNotExist();
  cy.dlSelectFirstDocument();
});

Cypress.Commands.add("drFilterDocListByNameAndStatus", (params: { title: string; status: string }) => {
  cy.dlClearFilters();
  cy.landingPageLoadingElementShouldNotExist();
  cy.get(`[aria-colindex="3"] input`).arrowType(params.title).wait(500);
  cy.landingPageLoadingElementShouldNotExist();
  cy.get(`[aria-colindex="7"] [class="k-input"]`).arrowClick();
  cy.landingPageLoadingElementShouldNotExist();
  cy.get("li").contains(params.status).arrowClick().wait(500);
  cy.landingPageLoadingElementShouldNotExist();
  cy.dlSelectFirstDocument();
});

Cypress.Commands.add("drFilterDocListByDocIdAndStatus", (params: { docId: string; status: string }) => {
  cy.dlClearFilters();
  cy.listLoadingElementShouldNotExist();
  cy.get(`[aria-colindex="1"] input`).arrowType(params.docId).wait(500);
  cy.listLoadingElementShouldNotExist();
  cy.get(`[aria-colindex="7"] [class="k-input"]`).scrollIntoView().arrowClick({ force: true });
  cy.get("li").contains(params.status).arrowClick({ force: true }).wait(500);
  cy.listLoadingElementShouldNotExist();
  cy.dlSelectFirstDocument();
});

Cypress.Commands.add("drFilterDocListByDocIdAndName", (params: { docId: string; title: string }) => {
  cy.dlClearFilters();
  cy.listLoadingElementShouldNotExist();
  cy.get(`[aria-colindex="1"] input`).arrowType(params.docId).wait(500);
  cy.listLoadingElementShouldNotExist();
  cy.get(`[aria-colindex="3"] input`).arrowType(params.title).wait(500);
  cy.listLoadingElementShouldNotExist();
  cy.dlSelectFirstDocument();
});

Cypress.Commands.add("drChangeOwnerFromMenu", (params: { employee: string }) => {
  cy.get("#HeaderMenuButton").arrowClick();
  cy.drChangeOwner({ employee: params.employee });
});

Cypress.Commands.add("drCancelDraftFromMenu", () => {
  cy.get("#HeaderMenuButton").arrowClick();
  cy.get("[data-cy=\"cancelDraftButton\"]").arrowClick();
  cy.wrapWithWaitOnApiCalls([CyRoutes.CancelDraft], () => {
    cy.get("[data-cy=\"AlertDialog-continueButton\"]").arrowClick();
  });
});

Cypress.Commands.add("drClickUpgradeForm", () => {
  cy.get("[data-cy=\"HeaderMenuButton\"]").arrowClick();
  cy.get("#UpgradeToLatest-upgrade").arrowClick();
  cy.wrapWithWaitOnApiCall(CyRoutes.UpgradeToReleasedForm, () => {
    cy.get("#UpgradeToLatest-proceed").arrowClick();
  });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("drChangeOwnerByAdmin", (params: { employee: string }) => {
  cy.get("[data-cy=\"changeOwner\"]").arrowClick();
  cy.get("#employee").arrowClick();
  cy.get(`[data-cy="selectItem.employee.${params.employee}"]`).arrowClick();
  cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRevOwner, () => {
    cy.get("[data-cy=\"changeOwner-submit\"]").arrowClick();
  });
});

Cypress.Commands.add("drChangeOwner", (params: { employee: string }) => {
  cy.get("[data-cy=\"changeOwner\"]").arrowClick();
  cy.get("#employee").arrowClick();
  cy.get(`[data-cy="selectItem.employee.${params.employee}"]`).arrowClick();
  cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRevOwner, () => {
    cy.get("[data-cy=\"changeOwner-submit\"]").arrowClick();
  });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("drClickReviseDocument", () => {
  cy.get("[data-cy=\"updateRecord\"]").arrowClick();
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("drClickTrainingRequired", () => {
  cy.get("[data-cy=\"field-retrain\"] input[type=checkbox]").arrowClick();
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
  cy.get("label").contains(new RegExp("^" + params.revisionStageOption + "$", "g")).arrowClick({ force: true });
});

Cypress.Commands.add("drAssignDocumentTo", (params: {username: string}) => {
  cy.get("[id='document.assing.to.sidebar']>div>div>div:nth-child(2)>div>input").should("exist");
  cy.get("[id='document.assing.to.sidebar']>div>div>div:nth-child(2)>div>input")
    .autocompleteSelect(`${params.username}`, { force: true });
  cy.get("[data-cy='add-user'").eq(2).arrowClick({ force: true });
  cy.unClick();
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("drChooseTypeOfRevisionChangeOption", (params: { option: string }) => {
  cy.get("[data-cy=\"field-revisionChangeType\"]");
  cy.get("label").contains(params.option).arrowClick({ force: true });
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
  cy.closeAllAlertMessages();
});

Cypress.Commands.add("checkToastMessageContains", (params: { message: string }) => {
  cy.get(".Toastify").should("contain.text", params.message);
});

Cypress.Commands.add("closeAllAlertMessages", () => {
  cy.get(".Toastify__close-button").arrowClick({ multiple: true, force: true });
});

Cypress.Commands.add("drCreateNewDocumentFromForm", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRev], () => {
    cy.get("[data-cy=\"PreviewControlsContainer-createNew\"]").arrowClick({ force: true });
  });
  cy.progressBarShouldAppear();
  cy.listLoadingElementShouldNotExist();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("drCreateNewDocumentFromFormRecord", () => {
  cy.get("[data-cy=\"PreviewControlsContainer-createNew\"]").arrowClick({ force: true });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("drAddAnotherRoleBtn", () => {
  cy.get("button[data-cy=\"form.builder.add.another.role\"]").arrowClick();
});

Cypress.Commands.add("drEnterApprovalRole", (params: { name: string }) => {
  cy.get("[data-cy=\"name\"]").arrowType(params.name);
});

Cypress.Commands.add("drEnterApprovingGroups", (...groups: string[]) => {
  cy.listLoadingElementShouldNotExist();
  groups.forEach((group) => {
    cy.get("[data-cy=\"groups\"]").arrowClick();
    cy.get(".MuiAutocomplete-popper").contains(group).arrowClick();
  });
});

Cypress.Commands.add("drEnterApprovingUsers", (...employees: string[]) => {
  cy.listLoadingElementShouldNotExist();
  employees.forEach((employee) => {
    cy.get("[data-cy=\"employees\"]").autocompleteSelect(employee);
  });
});

Cypress.Commands.add("drAddApprovalRole", () => cy.get("button[data-cy=\"common.add\"]").arrowClick());

Cypress.Commands.add("drAddApprovalMatrixItem", () => cy.get("button[data-cy=\"form.builder.add.item\"]").arrowClick({ force: true }));

Cypress.Commands.add("drAddAMItemValue", (params: { identity: string; value: string }) => cy.get(`[data-cy="${params.identity}"] input`).arrowType(params.value, { force: true }));

Cypress.Commands.add("drAMInternalType", (params: { value: string }) => {
  // TODO: Add a better identifier to get internal type dropdown
  cy.get(`.MuiTableCell-root .MuiSelect-select`).arrowClick();
  cy.get(`.MuiButtonBase-root.MuiListItem-root`).contains(params.value).arrowClick();
});

Cypress.Commands.add("drAMCheckRole", (params: { stage: string; index: number }) => {
  // We are spotting approvalMatrix.approvalRoles.stage1.0
  cy.get(`[data-cy="approvalMatrix.approvalRoles.${params.stage}.${params.index}"]`).arrowClick({ force: true });
});

Cypress.Commands.add("drAMCheckValue", (params: { identity: string }) => cy.get(`[data-cy="${params.identity}"]`).arrowClick({ force: true }));

Cypress.Commands.add("drUpgradeRevisionLevel", () => cy.get(`[data-cy="upgradeNextRevisionStage"]`).arrowClick({ force: true }));

Cypress.Commands.add("drReleaseDocAfterRoleExistsAndChecked", (params: { group: number; role: string }) => {
  cy.drApproveAndReleaseDialog();

  cy.get(`[data-cy="group-${params.group}"]`).contains(params.role);
  cy.get(`[data-cy="checked-${params.group}"]`).should("be.visible");
  cy.get("input[name=password]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
  cy.wrapWithWaitOnApiCall(
    CyRoutes.ReleaseDocRev,
    () => {
      cy.get("[data-cy=\"ApproveAndRelease-submit\"]").arrowClick();
    });
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("drNewTypeTrainingSelect", () => {
  cy.get(`[data-cy="trainingReq"]`).arrowClick();
});

Cypress.Commands.add("drApproveAndReleaseDialog", () => {
  cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();

  cy.listLoadingElementShouldNotExist();
  cy.progressBarShouldNotExist();
});

Cypress.Commands.add("drSelectTemplateReleaseDocument", (params: { template: string; selectDate?: boolean }) => {
  if (params.selectDate) {

    cy.get("[aria-label=\"change date\"]").arrowClick();
    cy.get("[class=\"MuiButtonBase-root MuiIconButton-root MuiPickersDay-day MuiPickersDay-current MuiPickersDay-daySelected\"]").arrowClick();
  }
  cy.get("#FormList-selectForm").arrowType(`${params.template}{enter}`);
  cy.wrapWithWaitOnApiCall(
    CyRoutes.ReleaseDocRev,
    () => {
      cy.get("[data-cy=\"ApproveAndRelease-submit\"]").arrowClick();
    });
});

Cypress.Commands.add("drAdministrativeRevisionLevel", () => {
  cy.get(`[data-cy="RevisionTypeChange-administrativeChange"]`).arrowClick({ force: true });
});

Cypress.Commands.add("drAddApprover", (params: {name: string}) => {
  cy.get(`[data-cy="field-approvals"]`).arrowType(`${params.name}{enter}`);
});

export interface IApproveAndReleasePayload{
  effectiveDate: string;
  documentType: { id: string };
  formDocument: { id: string };
  approversWithSignatures?: [{ approver: {id: string} }];
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
      Authorization: `bearer_password ${params.employeeId}:${params.sessionId}:${encodeString(CONFIG.DEFAULT_ENLIL_USER_PASSWORD)}`,
    },
  }).then((response) => response.body);
});

Cypress.Commands.add("drIsTrainingRequired", (params: {shouldBe: boolean}) => {
  cy.get("[data-cy=\"field-retrain\"] input[type=checkbox]").should(params.shouldBe ? "be.checked" : "not.be.checked");
});

Cypress.Commands.add("drSelectHistoryTab", () => {
  cy.get("[data-cy=\"timeline-icon\"]").arrowClick();
});

Cypress.Commands.add("drSelectBookmarksTab", () => {
  cy.get("[data-cy=\"bookmark-icon\"]").arrowClick();
});
Cypress.Commands.add("drSelectRevisionHistoryTab", () => {
  cy.get("[data-cy=\"cr-icon\"]").arrowClick();
});
Cypress.Commands.add("drSelectMigrateFormTab", () => {
  cy.get("[data-cy=\"form-migration-icon\"]").arrowClick();
});


Cypress.Commands.add("drOpenCloseSidebarDrawer", () => {
  cy.get("[aria-label=\"Open drawer\"]>span>svg").arrowClick();
});

Cypress.Commands.add("drSelectPermissionTab", () => {
  cy.get("[data-cy=\"permission-icon\"]").arrowClick({ force: true });
});

Cypress.Commands.add("drSelectApprovalRolesTab", () => {
  cy.wrapWithWaitOnApiCalls([
    CyRoutes.GetFieldLocks,
  ],
  () => {
    cy.get("[data-cy=\"tabId.approvalroles\"]").arrowClick();
  });
});

Cypress.Commands.add("drSelectMatrixDetailsTab", () => {
  cy.get("[data-cy=\"tabId.matrixdetails\"]").arrowClick();
});

Cypress.Commands.add("drSelectUser", (...users: string[]) => {
  users.forEach((user) => {
    cy.get(`[data-cy="field-securityEmployees"]`).arrowType(`${user}`).wait(500);
    cy.get(`div[id^=react-select]`).contains(user).arrowClick();
  });
  cy.unClick();
});

Cypress.Commands.add("drAddUserFromPermissionTab", (...users: string[]) => {
  users.forEach((user) => {
    cy.get("div")
      .contains("Search users")
      .click();

    cy.get("[id^=react-select]").contains(user).arrowClick();
    cy.get(`[data-cy="add-user"]`).eq(0).arrowClick({ force: true });
  });
});

Cypress.Commands.add("drSelectGroup", (...groups: string[]) => {
  groups.forEach((group) => {
    cy.get(`[data-cy="field-securityGroups"]`).arrowType(group);
    cy.get("div[id^=react-select]").contains(group).arrowClick();
  });

  cy.unClick();
});

Cypress.Commands.add("drAddGroupFromPermissionTab", (...groups: string[]) => {
  groups.forEach((group) => {
    cy.get("div")
      .contains("Search groups")
      .click();
    cy.get("[id^=react-select]").contains(group).arrowClick();
    cy.get(`[data-cy="add-user"]`).eq(1).arrowClick();
  });
});

Cypress.Commands.add("drRequestAccessVisibility", (params: {isVisible: boolean}) => {
  cy.get(`[data-cy="PreviewControlsContainer-access"]`).should((params.isVisible ? "" : "not.") + "exist");
});

Cypress.Commands.add("drApproveAndReleaseDocumentWithSelectingApprover", (names: string[], params?: { toastifyExists: boolean }) => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApprovers], () => {
    cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
  });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
  names.forEach((name) => {
    cy.get(`[data-cy="field-approvals"]`).arrowType(`${name}{enter}`);
  });
  cy.get("input[name=password]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
  cy.wrapWithWaitOnApiCall(
    CyRoutes.ReleaseDocRev,
    () => {
      cy.get("[data-cy=\"ApproveAndRelease-submit\"]").arrowClick();
    });
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
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

function compareStringsEmptyStringLast(a: string, b: string) {
  if (a.length === 0) {
    return 1;
  }

  if (b.length === 0) {
    return -1;
  }

  return (a <= b) ? -1 : 1;
}

Cypress.Commands.add("verifyDesSort", (params: {index: number; colLength: number}) => {
  const cellContents: string[] = [];
  cy.get("tr.k-master-row")
    .children()
    .each(($el, $index) => {
      if ($index % params.colLength === params.index) {
        cellContents.push($el.text());
      }
    })
    .then(() => {
      const actual = cellContents.slice();
      cy.wrap(actual).should("deep.eq", cellContents.sort(compareStringsEmptyStringLast).reverse());
    });
});

Cypress.Commands.add("verifyAscSort", (params: {index: number; colLength: number}) => {
  const cellContents: string[] = [];
  cy.get("tr.k-master-row")
    .children()
    .each(($el, $index) => {
      if ($index % params.colLength === params.index) {
        cellContents.push($el.text());
      }
    })
    .then(() => {
      const actual = cellContents.slice();
      cy.wrap(actual).should("deep.eq", cellContents.sort(compareStringsEmptyStringLast));
    });
});

Cypress.Commands.add("drVerifyTitle", (params: {title: string}) => {
  cy.get("#field-name").should("have.text", params.title);
});

Cypress.Commands.add("drVerifyDescription", (params: {description: string}) => {
  cy.get("[data-cy=\"description\"]").find("span[data-text]").should("have.text", params.description);
});

Cypress.Commands.add("drClickRevisionsSidePanel", () => {
  cy.get(`button[data-cy="note-icon"]`).arrowClick();
});

Cypress.Commands.add("drPatchDocType", (params: {
  docTypeId: string;
  employeeId: string;
  sessionId: string;
  payload: any; }) =>
{
  cy.request({
    method: "PATCH",
    url: `${CONFIG.BE_URL}/api/v1/document_type/${params.docTypeId}`,
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
    body: params.payload,
  }).then((response) => response ? response.body : {})
    .then((response) => JSON.stringify(response));
});

Cypress.Commands.add("drClickMigrateForm", () => {
  cy.get(`[data-cy="common.form.migration"]`).arrowClick();
});

Cypress.Commands.add("drClickConfirmChange", () => {
  cy.get("[data-cy='common.confirm.change']").arrowClick();
});

Cypress.Commands.add("drSelectFormToBeMigrated", (params: {formContains: string}) => {
  cy.get("[data-cy='field-changeDocumentForm']").arrowClick();
  cy.get("[id^='react-select']").contains(params.formContains).arrowClick();
});
