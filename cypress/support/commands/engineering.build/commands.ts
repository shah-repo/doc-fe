/* eslint-disable @typescript-eslint/no-namespace */

import { CONFIG } from "../../config";
import { CyRoutes } from "../../routes";

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      ebEnterPartName(params: { name: string }): Chainable<Subject>;
      ebEnterPartDescription(params: { description: string }): Chainable<Subject>;
      ebChoosePartType(params: { partName: string }): Chainable<Subject>;
      ebCheckIfPartIsInSummary(params: { partName: string }): Chainable<Subject>;
      ebVerifyNewRevisionCreated(): Chainable<Subject>;
      ebApprove(): Chainable<Subject>;
      ebApproveWithoutApi(): Chainable<Subject>;
      lhrApprove(): Chainable<Subject>;
      lhrApproveWithoutApi(): Chainable<Subject>;
      ebClickClone(): Chainable<Subject>;
      ebClickCloneEB(): Chainable<Subject>;
      ebCloneClickYes(): Chainable<Subject>;
      ebCloneClickNo(): Chainable<Subject>;
      ebCloneClickContinue(): Chainable<Subject>;
      ebAddMaterialDocument(params: { title: string; value: string; name: string }): Chainable<Subject>;
      ebAddStep2MaterialDocument(params: { title: string; value: string; name: string }): Chainable<Subject>;
      ebAddEquipmentDocument(params: { title: string }): Chainable<Subject>;
      ebAddStep2EquipmentDocument(params: { title: string }): Chainable<Subject>;
      ebClickCloneFromMenu(): Chainable<Subject>;
      ebSelectFirstDocument(): Chainable<Subject>;
      ebTryToApprove(): Chainable<Subject>;
      ebWithdrawSubmisison(): Chainable<Subject>;
      ebWithdrawSubmisisonWithoutApi(): Chainable<Subject>;
      ebAddApproverOnApproverList(params: {approver: string }): Chainable<Subject>;
      ebAddApproverOnApproverListWithPatchCall(params: {approver: string }): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("ebEnterPartName", (params: { name: string }) => {
  cy.get("[data-cy=\"name\"]").arrowType(params.name);
});

Cypress.Commands.add("ebEnterPartDescription", (params: { description: string }) => {
  cy.xpath("//div[@data-cy=\"description\"]/../div[2]").eq(1).arrowClick();
  cy.get("[data-cy=\"description\"]>div>div>div>div>div[contenteditable]").eq(1).clear().arrowType(params.description);
  cy.get("[data-cy=\"form.builder.field.description\"]>div").arrowClick();
});

Cypress.Commands.add("ebChoosePartType", (params: {partName: string}) => {
  cy.listLoadingElementShouldNotExist();
  cy.get("[data-cy=\"document.documentType.id\"]").autocompleteSelect(params.partName);
});

Cypress.Commands.add("ebCheckIfPartIsInSummary", (params: {partName: string}) => {
  cy.get("[data-cy=\"BuildsPresenter-link-form.builder.part\"]")
    .should("contain.text", params.partName);
});

Cypress.Commands.add("ebVerifyNewRevisionCreated", () => {
  cy.get("[data-cy=\"revision\"]").eq(0)
    .then(($el) => {
      const text = $el.text();
      expect(text.replace(/\u00a0/g, " ")).to.contain("Revision 2  - Draft");
    });
});

Cypress.Commands.add("ebClickClone", () => {
  cy.wrapWithWaitOnApiCalls([
    CyRoutes.GetRequiredApproversDocRev], () => {
    cy.get("[data-cy=\"CloneEBButton\"]").arrowClick({ force: true });
    cy.get("[data-cy=\"CloneContinue\"]").arrowClick();
  });
  cy.checkToastMessage({ exists: false });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("ebClickCloneFromMenu", () => {
  cy.get("[data-cy=\"HeaderMenuButton\"]").arrowClick();
  cy.wrapWithWaitOnApiCalls([
    CyRoutes.GetRequiredApproversDocRev], () => {
    cy.get("[data-cy=\"CloneEBButton\"]").arrowClick();
    cy.get("[data-cy=\"CloneContinue\"]").arrowClick();
  });
  cy.checkToastMessage({ exists: false });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("ebClickCloneEB", () => {
  cy.get("[data-cy=\"CloneEBButton\"]").arrowClick();
});

Cypress.Commands.add("ebCloneClickYes", () => {
  cy.get("[class^=\"MuiTypography-root MuiFormControlLabel-label MuiTypography-body1\"]").eq(3).arrowClick();
});

Cypress.Commands.add("ebCloneClickNo", () => {
  cy.get("[class^=\"MuiTypography-root MuiFormControlLabel-label MuiTypography-body1\"]").eq(4).arrowClick();
});

Cypress.Commands.add("ebCloneClickContinue", () => {
  cy.get("[data-cy=\"CloneContinue\"]").arrowClick();
});

Cypress.Commands.add("ebAddMaterialDocument", (params: { title: string; value: string; name: string }) => {
  cy.get("[data-cy=\"form.builder.materials.btn\"]").eq(0).arrowClick().wait(1000);
  cy.listLoadingElementShouldNotExist();
  cy.progressBarShouldNotExist();
  cy.get(".MuiDialogContent-root input[data-cy=\"title\"]").arrowClick();
  cy.get("ul>li[role=option]").contains(params.title).arrowClick({ force: true });
  cy.get("[name=\"quantity\"]").arrowType(params.value);
  cy.get("[data-cy=\"unit\"]").autocompleteSelect(params.name);
  cy.get("[data-cy=\"form.builder.save\"]").arrowClick();
});

Cypress.Commands.add("ebAddStep2MaterialDocument", (params: { title: string; value: string; name: string }) => {
  cy.get("[data-cy=\"form.builder.materials.btn\"]").last().arrowClick().wait(1000);
  cy.listLoadingElementShouldNotExist();
  cy.get(".MuiDialogContent-root input[data-cy=\"title\"]").arrowClick();
  cy.get("ul>li[role=option]").contains(params.title).arrowClick({ force: true });
  cy.get("[name=\"quantity\"]").arrowType(params.value);
  cy.get("[data-cy=\"unit\"]").autocompleteSelect(params.name);
  cy.get("[data-cy=\"form.builder.save\"]").arrowClick();
});

Cypress.Commands.add("ebAddEquipmentDocument", (params: { title: string }) => {
  cy.get("[data-cy=\"form.builder.equipment.btn\"]").eq(0).arrowClick().wait(1000);
  cy.listLoadingElementShouldNotExist();
  cy.get(".MuiDialogContent-root input[data-cy=\"title\"]").autocompleteSelect(params.title);
  cy.unClick();
  cy.get("[data-cy=\"form.builder.save\"]").arrowClick();
});

Cypress.Commands.add("ebAddStep2EquipmentDocument", (params: { title: string }) => {
  cy.get("[data-cy=\"form.builder.equipment.btn\"]").last().arrowClick();
  cy.listLoadingElementShouldNotExist();
  cy.get("[data-cy=\"title\"]").arrowClick().wait(1000);
  cy.get("ul>li[role=option]").contains(params.title).arrowClick({ force: true });
  cy.unClick();
  cy.get("[data-cy=\"form.builder.save\"]").arrowClick();
});

Cypress.Commands.add("ebSelectFirstDocument", () => {
  cy.wrapWithWaitOnApiCalls([
    CyRoutes.GetRequiredApproversDocRev], () => {
    cy.get("tr.k-master-row").first().arrowClick();
  });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("ebApprove", () => {
  cy.get("[data-cy=\"form.builder.request.approve\"]").contains("Approve").arrowClick({ force: true });
  cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(1500);
  cy.unClick();
  cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove, CyRoutes.SessionDetails], () => {
    cy.get("[data-cy=\"common.confirm\"]").arrowClick();
  });
  cy.checkToastMessage({ exists: false });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("ebApproveWithoutApi", () => {
  cy.get("[data-cy=\"form.builder.request.approve\"]").scrollIntoView();
  cy.get("[data-cy=\"form.builder.request.approve\"]").contains("Approve").arrowClick({ force: true }).wait(1500);
  cy.get("input[name=\"password\"]").click().arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(1500);
  cy.unClick();
  cy.get("[data-cy=\"common.confirm\"]").arrowClick();
  cy.checkToastMessage({ exists: false });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("lhrApprove", () => {
  cy.get(`[data-cy="form.builder.request.approve"]`).contains("Approve").arrowClick({ force: true }).wait(1500);
  cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(1500);
  cy.unClick();
  cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove], () => {
    cy.get("[data-cy=\"common.confirm\"]").arrowClick({ force: true });
  });
  cy.checkToastMessage({ exists: false });
  cy.saveBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("lhrApproveWithoutApi", () => {
  cy.get(`[data-cy="form.builder.request.approve"]`).contains("Approve").arrowClick({ force: true });
  cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(1500);
  cy.unClick();
  cy.listLoadingElementShouldNotExist();
  cy.get("[data-cy=\"common.confirm\"]").arrowClick({ force: true });
  cy.checkToastMessage({ exists: false });
  cy.saveBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("ebTryToApprove", () => {
  cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").arrowClick({ force: true });
  cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
  cy.get("[data-cy=\"common.confirm\"]").arrowClick();
});

Cypress.Commands.add("ebWithdrawSubmisison", () => {
  cy.get("[data-cy=\"document.revision.withdraw.alert\"]").arrowClick();
  cy.wait(2000);
  cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
    cy.get("#AlertDialog-continueButton").arrowClick();
  });
  cy.checkToastMessage({ exists: false });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("ebWithdrawSubmisisonWithoutApi", () => {
  cy.get("[data-cy=\"document.revision.withdraw.alert\"]").arrowClick();
  cy.wait(2000);
  cy.get("#AlertDialog-continueButton").arrowClick();
  cy.checkToastMessage({ exists: false });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("ebAddApproverOnApproverList", (params: { approver: string; waitAggregatedAudit?: boolean }) => {
  cy.listLoadingElementShouldNotExist();
  cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
    cy.get("[data-cy^=\"fb-approvals\"]").scrollIntoView().click().autocompleteSelect(params.approver);
  });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("ebAddApproverOnApproverListWithPatchCall", (params: { approver: string; waitAggregatedAudit?: boolean }) => {
  cy.listLoadingElementShouldNotExist();
  cy.get(`[data-cy^="fb-approvals-"]`).arrowClick();
  cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals, CyRoutes.PatchDocRev], () => {
    cy.get("[data-cy^=\"fb-approvals\"]").scrollIntoView().click().autocompleteSelect(params.approver);
  });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});
