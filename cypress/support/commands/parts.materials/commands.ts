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
        partLotDoc?: string;
        numberOfMaterial: integerType;
        typeOfMaterial: string;}): Chainable<Subject>;
      pmAddFreeTextMaterial(params: {
        material: string;
        partLot?: string;
        numberOfMaterial: integerType;
        typeOfMaterial: string;}): Chainable<Subject>;
      pmAddEquipmentDocument(params: {equipmentDoc: string}): Chainable<Subject>;
      pmAddFreeTextEquipment(params: {equipment: string}): Chainable<Subject>;
      pmUploadAttachment(params: {fileName: string }): Chainable<Subject>;
      pmAddApproverOnApproverList(params: {approver: string }): Chainable<Subject>;
      pmSubmitForApproval(): Chainable<Subject>;
      ptClickCreateNewPart(): Chainable<Subject>;
      pmToggleChangesFromPrevBuild(): Chainable<Subject>;
      ptSelectPartFormFromMultiSelect(params: {partForm: string}): Chainable<Subject>;
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
  partLotDoc?: string;
  numberOfMaterial: integerType;
  typeOfMaterial: string;}) => {
  cy.get("[data-cy=\"form.builder.materials.btn\"]").click();
  cy.wait(2000);

  cy.get("[data-cy=\"title\"]").click();
  cy.get("ul[role=\"listbox\"]>li").contains(params.materialDoc).click();

  if (params.partLotDoc) {
    cy.get("[data-cy=\"partLot\"]").click();
    cy.get("ul[role=\"listbox\"]>li").contains(params.partLotDoc).click();
  }

  cy.get("[name=\"quantity\"]").type(params.numberOfMaterial.toString());
  cy.get("[data-cy=\"unit\"]").click();
  cy.get("ul[role=\"listbox\"]>li").contains(params.typeOfMaterial).click();
  cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
    cy.get("[data-cy=\"form.builder.save\"]").click();
  });
});

Cypress.Commands.add("pmAddFreeTextMaterial", (params: {
  material: string;
  partLot?: string;
  numberOfMaterial: integerType;
  typeOfMaterial: string;}) => {
  cy.get("[data-cy=\"form.builder.materials.btn\"]").click();
  cy.wait(2000);
  cy.get("[data-cy=\"title\"]").type(params.material);

  if (params.partLot) {
    cy.get("[data-cy=\"partLot\"]").type(params.partLot);
  }

  cy.get("[name=\"quantity\"]").type(params.numberOfMaterial.toString());
  cy.get("[data-cy=\"unit\"]").click();
  cy.get("ul[role=\"listbox\"]>li").contains(params.typeOfMaterial).click();
  cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
    cy.get("[data-cy=\"form.builder.save\"]").click();
  });
});

Cypress.Commands.add("pmAddEquipmentDocument", (params: {equipmentDoc: string}) => {
  cy.get("[data-cy=\"form.builder.equipment.btn\"]").click();
  cy.get("[data-cy=\"title\"]").click();
  cy.get("ul[role=\"listbox\"]>li").contains(params.equipmentDoc).click();
  cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
    cy.get("[data-cy=\"form.builder.save\"]").click();
  });
});

Cypress.Commands.add("pmAddFreeTextEquipment", (params: {equipment: string}) => {
  cy.get("[data-cy=\"form.builder.equipment.btn\"]").click();
  cy.get("[data-cy=\"title\"]").type(params.equipment);
  cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
    cy.get("[data-cy=\"form.builder.save\"]").click();
  });
});

Cypress.Commands.add("pmUploadAttachment", (params: {fileName: string }) => {
  cy.fixture(params.fileName).then((fileContent) => {
    cy.wrapWithWaitOnApiCall(CyRoutes.UploadAttachment, () => {
      cy.get("[id^=\"fb-mediaalbum-upload\"]").attachFile({
        fileContent: fileContent.toString(),
        fileName: params.fileName,
        mimeType: "*",
        filePath: `fixtures/${params.fileName}`,
      });
    });
  });
});

Cypress.Commands.add("pmAddApproverOnApproverList", (params: { approver: string; waitAggregatedAudit?: boolean }) => {
  cy.get("[data-cy^=\"fb-approvals-fb-approvals\"]").click();
  cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
    cy.get("ul[role=\"listbox\"]>li").contains(params.approver).click();
  });
});

Cypress.Commands.add("ptClickCreateNewPart", () => {
  cy.get("[id=DocumentByTypeListPresenter-openDocRev]").click();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("ptSelectPartFormFromMultiSelect", (params: {partForm: string}) => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
    cy.get("[id=\"MultipleFormTemplate-selectDocForm\"]").type(params.partForm + "{downarrow}{enter}");
  });
});

Cypress.Commands.add("pmSubmitForApproval", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
    cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
  });
});

Cypress.Commands.add("pmToggleChangesFromPrevBuild", () => {
  cy.get("[name=\"fb-procedure-diff\"]").click();
});

