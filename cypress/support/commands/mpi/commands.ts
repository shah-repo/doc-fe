/* eslint-disable @typescript-eslint/no-namespace */
import { integer } from "aws-sdk/clients/cloudfront";
import { CyRoutes } from "../../routes";

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      mpiEnterDescriptionToStep(params: {numbOfStep: integer; description: string}): Chainable;
      mpiAddStep(): Chainable;
      mpiAddMaterialDocumentToStep(params:
      {checkParameter?: boolean;
        numbOfStep: integer;
        material: string;
        quntity: string;
        unit: string;}): Chainable;
      lhrsAddMaterialDocumentToStep(params:
      {checkParameter?: boolean;
        numbOfStep: integer;
        material: string;
        quntity: string;
        unit: string;}): Chainable;
      mpiAddMaterialParameterToStep(params: {numbOfStep: integer; material: string}): Chainable;
      mpiAddEquipmentToStep(params: {checkParameter?: boolean; numbOfStep: integer; equipment: string}): Chainable;
      mpiAddEquipmentParameterToStep(params: {numbOfStep: integer; equipmentDescription: string}): Chainable;
      mpiStartStep(params: {stepNumber: number}): Chainable;
      mpiStartStepWithoutApi(params: {stepNumber: number}): Chainable;
      mpiClickNotStarted(params: {stepNumber: number}): Chainable;
      selectLot(params: {lot: string}): Chainable;
    }
  }
}


Cypress.Commands.add("mpiEnterDescriptionToStep", (params: {numbOfStep: integer; description: string}) => {
  const descriptionField = params.numbOfStep === 1 ? params.numbOfStep : params.numbOfStep + 1;
  cy.get("[id$=\"description\"][id^=\"fb-mpiprocedure\"]>div>div>div>div>div")
    .eq(descriptionField)
    .click();
  cy.get("[data-cy$=\"description\"]>div>div>div>div>div[contenteditable]")
    .eq(params.numbOfStep).clear()
    .type(params.description);
  cy.wait(500);
  cy.unClick();
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("mpiAddStep", () => {
  cy.get("[data-cy=\"form.builder.add.step\"]").last().arrowClick();
});

Cypress.Commands.add("mpiAddMaterialDocumentToStep", (params: {
  numbOfStep: integer;
  material: string;
  quntity: string;
  unit: string;}) => {
  cy.get("[data-cy=\"form.builder.materials.btn\"]").eq(params.numbOfStep - 1).arrowClick().wait(500);
  cy.listLoadingElementShouldNotExist();
  cy.get("[name=\"LHRTparameter\"]").uncheck();
  cy.get("[data-cy=\"title\"]").arrowClick();
  cy.get("ul>li[role=option]").contains(params.material).arrowClick();
  cy.get("[name=\"quantity\"]").arrowType(params.quntity);
  cy.wait(500);
  cy.get("[data-cy=\"unit\"]").autocompleteSelect(params.unit);
  cy.get("[data-cy=\"form.builder.save\"]").arrowClick().wait(500);
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("lhrsAddMaterialDocumentToStep", (params: {
  numbOfStep: integer;
  material: string;
  quntity: string;
  unit: string;}) => {
  cy.get("[data-cy=\"form.builder.materials.btn\"]").eq(params.numbOfStep - 1).arrowClick().wait(500);
  cy.listLoadingElementShouldNotExist();
  cy.get("[data-cy=\"title\"]").arrowClick();
  cy.get("ul>li[role=option]").contains(params.material).arrowClick();
  cy.get("[name=\"quantity\"]").arrowType(params.quntity);
  cy.wait(500);
  cy.get("[data-cy=\"unit\"]").arrowClick();
  cy.get("ul>li[role=option]").contains(params.unit).arrowClick();
  cy.get("[data-cy=\"form.builder.save\"]").arrowClick().wait(500);
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("mpiAddMaterialParameterToStep", (params: {
  numbOfStep: integer;
  material: string;}) => {
  cy.get("[data-cy=\"form.builder.materials.btn\"]").eq(params.numbOfStep - 1).arrowClick().wait(500);
  cy.listLoadingElementShouldNotExist();
  cy.get("[data-cy=\"title\"]").arrowType(params.material, { force: true }).wait(500);
  cy.get("[data-cy=\"form.builder.save\"]").arrowClick({ force: true }).wait(500);
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("mpiAddEquipmentToStep", (params: {
  checkParameter: boolean;
  numbOfStep: integer;
  equipment: string;}) => {
  cy.get("[data-cy=\"form.builder.equipment.btn\"]").eq(params.numbOfStep - 1).arrowClick().wait(500);
  cy.listLoadingElementShouldNotExist();
  cy.get("[data-cy=\"title\"]").arrowClick();
  cy.wait(500);
  cy.get("ul>li[role=option]").contains(params.equipment).arrowClick();
  params.checkParameter ? cy.get("[name=\"LHRTparameter\"]").check() : "";
  cy.get("[data-cy=\"form.builder.save\"]").arrowClick().wait(500);
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("mpiAddEquipmentParameterToStep", (params: {
  numbOfStep: integer;
  equipmentDescription: string;}) => {
  cy.get("[data-cy=\"form.builder.equipment.btn\"]").eq(params.numbOfStep - 1).arrowClick().wait(500);
  cy.listLoadingElementShouldNotExist();
  cy.get("[name=\"LHRTparameter\"]").check();
  cy.get("[data-cy=\"title\"]").arrowType(params.equipmentDescription);
  cy.wait(500);
  cy.get("[data-cy=\"form.builder.save\"]").arrowClick().wait(500);
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("mpiStartStep", (params: {stepNumber: number}) => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.StartMpi, CyRoutes.GetRequiredApproversDocRev], () => {
    cy.get("[data-cy=\"form.builder.start.step\"]").eq(params.stepNumber - 1).arrowClick();
  });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});


Cypress.Commands.add("mpiStartStepWithoutApi", (params: {stepNumber: number}) => {
  cy.get("[data-cy=\"form.builder.start.step\"]").eq(params.stepNumber - 1).arrowClick();
  cy.listLoadingElementShouldAppear();
  cy.progressBarShouldNotExist();
});

Cypress.Commands.add("mpiClickNotStarted", (params: {stepNumber: number}) => {
  cy.get("[data-cy=\"form.builder.step.noStarted\"]").eq(params.stepNumber - 1).arrowClick();
});

Cypress.Commands.add("mpiSelectRedLine", () => {
  cy.get("[data-cy='HeaderMenuButton']").arrowClick();
  cy.get("[data-cy='redlineButton']").arrowClick();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("selectLot", (params: {lot: string}) => {
  cy.listLoadingElementShouldNotExist();
  cy.wait(2000);
  cy.get("input[data-cy=usedOverride]").arrowClick();
  cy.get("ul>li[role=option]").contains(params.lot).arrowClick();
});
