/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */

import { integerType } from "aws-sdk/clients/iam";
import { CyRoutes } from "../../routes";

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      pmAddMaterialDocumentToProcedure(params: {
        materialDoc: string;
        numberOfMaterial: integerType;
        typeOfMaterial: string;}): Chainable<Subject>;
      pmAddFreeTextMaterial(params: {
        material: string;
        numberOfMaterial: integerType;
        typeOfMaterial: string;}): Chainable<Subject>;
      pmAddEquipmentDocument(params: {equipmentDoc: string}): Chainable<Subject>;
      pmAddFreeTextEquipment(params: {equipment: string}): Chainable<Subject>;
      pmUploadAttachment(params: {fileName: string }): Chainable<Subject>;
      pmAddApproverOnApproverList(params: {approver: string }): Chainable<Subject>;
      pmSubmitForApproval(): Chainable<Subject>;
      pmToggleChangesFromPrevBuild(): Chainable<Subject>;
      pmVerifyAddedMaterial(params: {
        materialDocName: string;
        quantity: integerType;
        unit: string;}): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("pmVerifyAddedMaterial", (params: {
  materialDocName: string;
  quantity: integerType;
  unit: string;}) => {
  cy.get("[data-cy=\"form.builder.procedure.materials.title\"]").click();
});

Cypress.Commands.add("pmAddMaterialDocumentToProcedure", (params: {
  materialDoc: string;
  numberOfMaterial: integerType;
  typeOfMaterial: string;}) => {
  cy.get("[data-cy=\"form.builder.materials.btn\"]").click();
  cy.get("[data-cy=\"title\"]").click();
  cy.get("ul[role=\"listbox\"]>li").contains(params.materialDoc).click();
  cy.get("[name=\"quantity\"]").type(params.numberOfMaterial.toString());
  cy.get("[data-cy=\"unit\"]").click();
  cy.get("ul[role=\"listbox\"]>li").contains(params.typeOfMaterial).click();
  cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
    cy.get("[data-cy=\"form.builder.save\"]").click();
  });
});

Cypress.Commands.add("pmAddFreeTextMaterial", (params: {
  material: string;
  numberOfMaterial: integerType;
  typeOfMaterial: string;}) => {
  cy.get("[data-cy=\"form.builder.materials.btn\"]").click();
  cy.get("[data-cy=\"title\"]").type(params.material);
  cy.get("[name=\"quantity\"]").type(params.numberOfMaterial.toString());
  cy.get("[data-cy=\"unit\"]").click();
  cy.get("ul[role=\"listbox\"]>li").contains(params.typeOfMaterial).click();
  cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
    cy.get("[data-cy=\"form.builder.save\"]").click();
  });
});

Cypress.Commands.add("pmAddEquipmentDocument", (params: {equipmentDoc: string}) => {
  cy.get("[data-cy=\"form.builder.equipment.btn\"]").click();
  cy.get("[data-cy=\"title\"]").click();
  cy.get("ul[role=\"listbox\"]>li").contains(params.equipmentDoc).click();
  cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
    cy.get("[data-cy=\"form.builder.save\"]").click();
  });
});

Cypress.Commands.add("pmAddFreeTextEquipment", (params: {equipment: string}) => {
  cy.get("[data-cy=\"form.builder.equipment.btn\"]").click();
  cy.get("[data-cy=\"title\"]").type(params.equipment);
  cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
    cy.get("[data-cy=\"form.builder.save\"]").click();
  });
});

Cypress.Commands.add("pmUploadAttachment", (params: {fileName: string }) => {
  cy.fixture(params.fileName).then((fileContent) => {
    cy.wrapWithWaitOnApiCall(CyRoutes.UploadAttachmentMediaUpload, () => {
      cy.get("[id^=\"fb-mediaalbum-upload\"]").attachFile({
        fileContent: fileContent.toString(),
        fileName: params.fileName,
        mimeType: "*",
        filePath: `fixtures/${params.fileName}`,
      });
    });
  });
});

Cypress.Commands.add("pmAddApproverOnApproverList", (params: { approver: string }) => {
  cy.get("[data-cy^=\"fb-approvals-fb-approvals\"]").click();
  cy.wrapWithWaitOnApiCall(CyRoutes.PostApprovals, () => {
    cy.get("ul[role=\"listbox\"]>li").contains(params.approver).click();
  });
});

Cypress.Commands.add("pmSubmitForApproval", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
    cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
  });
});

Cypress.Commands.add("pmToggleChangesFromPrevBuild", () => {
  cy.get("[name=\"fb-procedure-diff\"]").click();
});

