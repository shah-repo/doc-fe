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
  cy.get("[data-cy=\"form.builder.procedure.materials.title\"]").arrowClick();
});

Cypress.Commands.add("pmAddMaterialDocumentToProcedure", (params: {
  materialDoc: string;
  partLotDoc?: string;
  numberOfMaterial: integerType;
  typeOfMaterial: string;}) => {
  cy.get("[data-cy=\"form.builder.materials.btn\"]").arrowClick();


  cy.get("[data-cy=\"title\"]").arrowClick();
  cy.get("ul>li[role=option]").contains(params.materialDoc).arrowClick();

  if (params.partLotDoc) {
    cy.get("[data-cy=\"partLot\"]").arrowClick();
    cy.get("ul>li[role=option]").contains(params.partLotDoc).arrowClick();
  }

  cy.get("[name=\"quantity\"]").arrowType(params.numberOfMaterial.toString());
  cy.get("[data-cy=\"unit\"]").arrowClick();
  cy.get("ul>li[role=option]").contains(params.typeOfMaterial).arrowClick();
  cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
    cy.get("[data-cy=\"form.builder.save\"]").arrowClick();
  });
});

Cypress.Commands.add("pmAddFreeTextMaterial", (params: {
  material: string;
  partLot?: string;
  numberOfMaterial: integerType;
  typeOfMaterial: string;}) => {
  cy.get("[data-cy=\"form.builder.materials.btn\"]").arrowClick();

  cy.get("[data-cy=\"title\"]").arrowType(params.material);

  if (params.partLot) {
    cy.get("[data-cy=\"partLot\"]").arrowType(params.partLot);
  }

  cy.get("[name=\"quantity\"]").arrowType(params.numberOfMaterial.toString());
  cy.get("[data-cy=\"unit\"]").arrowClick();
  cy.get("ul>li[role=option]").contains(params.typeOfMaterial).arrowClick();
  cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
    cy.get("[data-cy=\"form.builder.save\"]").arrowClick();
  });
});

Cypress.Commands.add("pmAddEquipmentDocument", (params: {equipmentDoc: string}) => {
  cy.get("[data-cy=\"form.builder.equipment.btn\"]").arrowClick();
  cy.get("[data-cy=\"title\"]").arrowClick();
  cy.get("ul>li[role=option]").contains(params.equipmentDoc).arrowClick();
  cy.unClick();

  cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
    cy.unClick();
    cy.get("[data-cy=\"form.builder.save\"]").arrowClick();
  });
});

Cypress.Commands.add("pmAddFreeTextEquipment", (params: {equipment: string}) => {
  cy.get("[data-cy=\"form.builder.equipment.btn\"]").arrowClick();
  cy.get("[data-cy=\"title\"]").arrowType(params.equipment);
  cy.unClick();

  cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
    cy.unClick();
    cy.get("[data-cy=\"form.builder.save\"]").arrowClick();
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
  cy.listLoadingElementShouldNotExist();

  cy.get("[data-cy^=\"fb-approvals\"]").arrowClick();
  cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
    cy.get("ul>li[role=option]").contains(params.approver).arrowClick();
  });

  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("ptClickCreateNewPart", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetDocumentType, () => {
    cy.get("[id=DocumentByTypeListPresenter-openDocRev]").arrowClick();
  });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("ptSelectPartFormFromMultiSelect", (params: {partForm: string}) => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRev, CyRoutes.DocPreview], () => {
    cy.get("[id=\"MultipleFormTemplate-selectDocForm\"]").arrowType(params.partForm + "{downarrow}{enter}");
  });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("pmSubmitForApproval", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
    cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
  });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("pmToggleChangesFromPrevBuild", () => {
  cy.get("[name=\"fb-procedure-diff\"]").arrowClick();
});

