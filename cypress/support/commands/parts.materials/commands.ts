/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */

import { integer } from "aws-sdk/clients/cloudfront";
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
      pmAddApproverOnApproverListWithoutApi(params: {approver: string }): Chainable<Subject>;
      pmAddApproverOnApproverListNw(params: {approver: string }): Chainable<Subject>;
      lhrAddApproverOnApproverList(params: {approver: string }): Chainable<Subject>;
      lhrAddApproverOnApproverListWithoutApi(params: {approver: string }): Chainable<Subject>;
      pmDeleteApproverFromApproverList(params: {approver: string }): Chainable<Subject>;
      pmSubmitForApproval(): Chainable<Subject>;
      pmSubmitForApprovalWithoutAPI(): Chainable<Subject>;
      pmClearFilters(): Chainable<Subject>;
      pmSelectFirstDocument(): Chainable<Subject>;
      lhrSubmitForApproval(): Chainable<Subject>;
      lhrSubmitForApprovalWithoutApi(): Chainable<Subject>;
      ptClickCreateNewPart(): Chainable<Subject>;
      ptClickCreateNewPartWithoutApi(): Chainable<Subject>;
      pmToggleChangesFromPrevBuild(): Chainable<Subject>;
      ptSelectPartFormFromMultiSelect(params: {partForm: string}): Chainable<Subject>;
      pmVerifyAddedMaterial(params: {
        materialDocName: string;
        quantity: integerType;
        unit: string;}): Chainable<Subject>;
      lhrClickReviseDocument(): Chainable<Subject>;
      lhrClickSaveDocument(): Chainable<Subject>;
      lhrClearFilters(): Chainable<Subject>;
      lhrVerifyDocumentCount(params: {numberOfDoc: integerType }): Chainable<Subject>;
      lhrVerifyFilterByLot(params: {lot: string }): Chainable<Subject>;
      lhrVerifyFilterByStatus(params: {status: string }): Chainable<Subject>;
      lhrVerifyFilterByOwner(params: {owner: string }): Chainable<Subject>;
      lhrVerifyFilterByPartNumberRev(params: {part: string }): Chainable<Subject>;
      lhrVerifyFilterByCompletionDate(params: {date: string }): Chainable<Subject>;
      lhrVerifyFilterByStartQuantity(params: {quantity: string }): Chainable<Subject>;
      lhrVerifyFilterByEndQuantity(params: {quantity: string }): Chainable<Subject>;
      lhrVerifyFilterByTemplate(params: {template: string }): Chainable<Subject>;
      lhrVerifyFilterById(params: {id: string }): Chainable<Subject>;
      lhrFilterByOwner(params: {owner: string }): Chainable<Subject>;
      lhrSelectFirstDocument(): Chainable<Subject>;
      lhrSelectBuildTypeRnD(): Chainable<Subject>;
      lhrSelectBuildTypeProduction(): Chainable<Subject>;
      lhrChangeBuildTypeToRnd(): Chainable<Subject>;
      lhrSelectMaterial(params: { selectElement: integer; lot: string; quantity: string });
      lhrChangeMaterial(params: { changeElement: integer; lot: string; quantity: string });
      lhrSelectEquipment(params: { selectElement: integer; equipment: string });
      lhrChangeEquipment(params: { changeElement: integer; equipment: string });
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
  cy.listLoadingElementShouldNotExist();
  cy.wait(500);
  cy.get("[data-cy=\"title\"]").arrowClick();
  cy.get("ul>li[role=option]").contains(params.materialDoc).arrowClick({ force: true });
  cy.wait(500).listLoadingElementShouldNotExist();

  if (params.partLotDoc) {
    cy.get("[data-cy=\"partLot\"]").arrowClick();
    cy.get("ul>li[role=option]").contains(params.partLotDoc).arrowClick();
  }

  cy.get("[name=\"quantity\"]").arrowType(params.numberOfMaterial.toString());
  cy.get("[data-cy=\"unit\"]").arrowClick();
  cy.get("ul>li[role=option]").contains(params.typeOfMaterial).arrowClick();
  cy.get("[data-cy=\"form.builder.save\"]").arrowClick().wait(500);
});

Cypress.Commands.add("pmAddFreeTextMaterial", (params: {
  material: string;
  partLot?: string;
  numberOfMaterial: integerType;
  typeOfMaterial: string;}) => {
  cy.get("[data-cy=\"form.builder.materials.btn\"]").arrowClick();
  cy.listLoadingElementShouldNotExist();
  cy.wait(500);
  cy.get("[data-cy=\"title\"]").arrowType(params.material);

  if (params.partLot) {
    cy.get("[data-cy=\"partLot\"]").arrowType(params.partLot);
  }

  cy.get("[name=\"quantity\"]").arrowType(params.numberOfMaterial.toString());
  cy.get("[data-cy=\"unit\"]").arrowClick();
  cy.get("ul>li[role=option]").contains(params.typeOfMaterial).arrowClick();
  cy.get("[data-cy=\"form.builder.save\"]").arrowClick().wait(500);
});

Cypress.Commands.add("pmAddEquipmentDocument", (params: {equipmentDoc: string}) => {
  cy.get("[data-cy=\"form.builder.equipment.btn\"]").arrowClick();
  cy.listLoadingElementShouldNotExist();
  cy.wait(500);
  cy.get("[data-cy=\"title\"]").arrowClick();
  cy.get("ul>li[role=option]").contains(params.equipmentDoc).arrowClick();
  cy.unClick();
  cy.get("[data-cy=\"form.builder.save\"]").arrowClick().wait(500);
});

Cypress.Commands.add("pmAddFreeTextEquipment", (params: {equipment: string}) => {
  cy.get("[data-cy=\"form.builder.equipment.btn\"]").arrowClick();
  cy.wait(500).listLoadingElementShouldNotExist();
  cy.get("[data-cy=\"title\"]").arrowType(params.equipment);
  cy.unClick();
  cy.get("[data-cy=\"form.builder.save\"]").arrowClick().wait(500);
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
  cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
    cy.get("[data-cy^=\"fb-approvals\"]").scrollIntoView().click().autocompleteSelect(params.approver, { force: true });
  });
  cy.unClick();
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

// eslint-disable-next-line max-len
Cypress.Commands.add("pmAddApproverOnApproverListWithoutApi", (params: { approver: string; waitAggregatedAudit?: boolean }) => {
  cy.get("[data-cy^=\"fb-approvals\"]").scrollIntoView();
  cy.get("[data-cy^=\"fb-approvals\"]").click();
  cy.get("[data-cy^=\"fb-approvals\"]").autocompleteSelect(params.approver);
  cy.unClick();
  cy.wait(1000);
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("pmAddApproverOnApproverListNw", (params: { approver: string; waitAggregatedAudit?: boolean }) => {
  cy.listLoadingElementShouldNotExist();
  cy.get("[data-cy^=\"fb-approvals\"]").scrollIntoView().arrowClick({ force: true }).wait(500);
  cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
    cy.get("ul>li[role=option]").contains(params.approver).arrowClick();
  });
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("lhrAddApproverOnApproverList", (params: { approver: string; waitAggregatedAudit?: boolean }) => {
  cy.listLoadingElementShouldNotExist();
  cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
    cy.get("[data-cy^=\"fb-approvals\"]").click().autocompleteSelect(params.approver);
  });
  cy.saveBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("lhrAddApproverOnApproverListWithoutApi",
  (params: { approver: string; waitAggregatedAudit?: boolean }) => {
    cy.listLoadingElementShouldNotExist();
    cy.get("[data-cy^=\"fb-approvals\"]").scrollIntoView().arrowClick({ force: true });
    cy.get("[data-cy^=\"fb-approvals\"]").click().autocompleteSelect(params.approver);
    cy.unClick();
    cy.saveBarShouldNotExist();
    cy.listLoadingElementShouldNotExist();
  });

Cypress.Commands.add("pmDeleteApproverFromApproverList",
  (params: { approver: string; waitAggregatedAudit?: boolean }) => {
    cy.listLoadingElementShouldNotExist();
    cy.contains(`${params.approver}`).parent().next().arrowClick();
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

Cypress.Commands.add("ptClickCreateNewPartWithoutApi", () => {
  cy.get("[id=DocumentByTypeListPresenter-openDocRev]").arrowClick();
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("ptSelectPartFormFromMultiSelect", (params: {partForm: string}) => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRev, CyRoutes.DocPreview], () => {
    cy.get("[id=\"MultipleFormTemplate-selectDocForm\"]").type(params.partForm);
    cy.get(`div[id^="react-select"]`).contains(params.partForm).arrowClick();
  });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("pmSubmitForApproval", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
    cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick({ force: true });
  });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("pmSubmitForApprovalWithoutAPI", () => {
  cy.get("[data-cy=\"ApproveAndRelease-button\"]").eq(0).arrowClick({ force: true });
  cy.wait(1000);
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("lhrSubmitForApproval", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview], () => {
    cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
  });
  cy.saveBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("lhrSubmitForApprovalWithoutApi", () => {
  cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
  cy.wait(1000);
  cy.saveBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("pmToggleChangesFromPrevBuild", () => {
  cy.get("[data-cy=\"form.builder.prev.build.changes\"]").arrowClick();
});

Cypress.Commands.add("pmClearFilters", () => {
  cy.get("button[data-cy=clearFilter]").arrowClick();
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("pmSelectFirstDocument", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.DocRevPreview], () => {
    cy.get("tr.k-master-row").first().arrowClick();
  });
  cy.listLoadingElementShouldNotExist();
  cy.progressBarShouldNotExist();
});

Cypress.Commands.add("lhrClickReviseDocument", () => {
  cy.get("[data-cy=\"updateRecord\"]").arrowClick();
  cy.saveBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("lhrClickSaveDocument", () => {
  cy.wrapWithWaitOnApiCalls(
    [CyRoutes.PatchDocRev], () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
    });
  cy.checkToastMessage({ exists: false });
  cy.saveBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("lhrClearFilters", () => {
  cy.get(`button[data-cy="clearFilter"]`).arrowClick();
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("lhrVerifyDocumentCount", (params: {numberOfDoc: integerType }) => {
  cy.get("tr.k-master-row").should("have.length", params.numberOfDoc);
});

Cypress.Commands.add("lhrVerifyFilterByLot", (params: {lot: string }) => {
  cy.get("tr.k-master-row").first().find("td").eq(0).should("have.text", params.lot);
});

Cypress.Commands.add("lhrVerifyFilterByStatus", (params: {status: string }) => {
  cy.get("tr.k-master-row").first().find("td").eq(1).should("have.text", params.status);
});

Cypress.Commands.add("lhrVerifyFilterByOwner", (params: {owner: string }) => {
  cy.get("tr.k-master-row").first().find("td").eq(2).should("contain.text", params.owner);
});

Cypress.Commands.add("lhrVerifyFilterByPartNumberRev", (params: {part: string }) => {
  cy.get("tr.k-master-row").first().find("td").eq(3).should("have.text", params.part);
});

Cypress.Commands.add("lhrVerifyFilterByCompletionDate", (params: {date: string }) => {
  cy.get("tr.k-master-row").first().find("td").eq(4).should("have.text", params.date);
});

Cypress.Commands.add("lhrVerifyFilterByStartQuantity", (params: {quantity: string }) => {
  cy.get("tr.k-master-row").first().find("td").eq(5).should("have.text", params.quantity);
});

Cypress.Commands.add("lhrVerifyFilterByEndQuantity", (params: {quantity: string }) => {
  cy.get("tr.k-master-row").first().find("td").eq(6).should("have.text", params.quantity);
});

Cypress.Commands.add("lhrVerifyFilterByTemplate", (params: {template: string }) => {
  cy.get("tr.k-master-row").first().find("td").eq(7).should("have.text", params.template);
});

Cypress.Commands.add("lhrVerifyFilterById", (params: {id: string }) => {
  cy.get("tr.k-master-row").first().find("td").eq(8).should("have.text", params.id);
});

Cypress.Commands.add("lhrFilterByOwner", (params: {owner: string }) => {
  cy.get("tr.k-master-row").first().find("td").eq(2).contains(params.owner);
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("lhrSelectFirstDocument", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.DocRevPreview], () => {
    cy.get("tr.k-master-row").first().arrowClick();
  });
  cy.listLoadingElementShouldNotExist();
  cy.progressBarShouldNotExist();
});

Cypress.Commands.add("lhrSelectBuildTypeRnD", () => {
  cy.get(`[name="lhr-build-type"]`).first().should("have.value", "R&D").check();
});

Cypress.Commands.add("lhrSelectBuildTypeProduction", () => {
  cy.get(`[name="lhr-build-type"]`).last().should("have.value", "Production").check();
});

Cypress.Commands.add("lhrChangeBuildTypeToRnd", () => {
  cy.get(`[name="lhr-build-type"]`).first().should("have.value", "R&D").check();
  cy.get(`[data-cy="form.builder.lhr.build.switch"]`).arrowClick();
});

Cypress.Commands.add("lhrSelectMaterial", (params: { selectElement: integer; lot: string; quantity: string }) => {
  cy.get("[data-cy=\"form.builder.select\"]").eq(params.selectElement).arrowClick({ force: true }).wait(500);

  cy.get("input[data-cy=usedOverride]").arrowClick();
  cy.get("ul>li[role=option]").contains(params.lot).arrowClick();

  cy.get("[data-cy='quantity']").arrowType(params.quantity).wait(500);

  cy.get("[data-cy='form.builder.save']").arrowClick().wait(500);
});

Cypress.Commands.add("lhrChangeMaterial", (params: { changeElement: integer; lot: string; quantity: string }) => {
  cy.get("[data-cy=\"form.builder.change\"]").eq(params.changeElement).arrowClick({ force: true }).wait(500);

  cy.get("input[data-cy=usedOverride]").arrowClick();
  cy.get("ul>li[role=option]").contains(params.lot).arrowClick();

  cy.get("[data-cy='quantity']").arrowType(params.quantity).wait(500);

  cy.get("[data-cy='form.builder.save']").arrowClick().wait(500);
});

Cypress.Commands.add("lhrSelectEquipment", (params: { selectElement: integer; equipment: string }) => {
  cy.get("[data-cy=\"form.builder.select\"]").eq(params.selectElement).arrowClick({ force: true }).wait(500);

  cy.get("input[data-cy=usedOverride]").arrowClick().wait(500);
  cy.get("ul>li[role=option]").contains(params.equipment).arrowClick();

  cy.get("[data-cy='form.builder.save']").arrowClick().wait(500);
});

Cypress.Commands.add("lhrChangeEquipment", (params: { changeElement: integer; equipment: string }) => {
  cy.get("[data-cy=\"form.builder.change\"]").eq(params.changeElement).arrowClick({ force: true }).wait(500);

  cy.get("input[data-cy=usedOverride]").arrowClick().wait(500).autocompleteSelect(params.equipment);

  cy.get("[data-cy='form.builder.save']").arrowClick().wait(1500);
});

