/* eslint-disable @typescript-eslint/no-namespace */
import { integer } from "aws-sdk/clients/cloudfront";
import { CyRoutes } from "../../routes";

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      mpiEnterDescriptionToStep(params: {numbOfStep: integer; description: string}): Chainable;
      mpiAddStep(): Chainable;
      mpiAddMaterialToStep(params: {numbOfStep: integer; material: string; quntity: string; unit: string}): Chainable;
      mpiAddEquipmentToStep(params: {numbOfStep: integer; equipment: string}): Chainable;
    }
  }
}


Cypress.Commands.add("mpiEnterDescriptionToStep", (params: {numbOfStep: integer; description: string}) => {
  const descriptionField = params.numbOfStep === 1 ? params.numbOfStep : params.numbOfStep + 1;
  cy.get("[id$=\"description\"][id^=\"fb-mpiprocedure\"]>div>div>div>div>div")
    .eq(descriptionField)
    .click();
  cy.get("[data-cy$=\"description\"]>div>div>div>div>div[contenteditable]")
    .eq(params.numbOfStep)
    .type(params.description)
    .wait(300);
  cy.unClick();
});

Cypress.Commands.add("mpiAddStep", () => {
  cy.get("[data-cy=\"form.builder.add.step\"]").last().click();
});

Cypress.Commands.add("mpiAddMaterialToStep", (params: {
  numbOfStep: integer;
  material: string;
  quntity: string;
  unit: string;}) => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetAutocompleteOptions, () => {
    cy.get("[data-cy=\"form.builder.materials.btn\"]").eq(params.numbOfStep - 1).click();
  });
  cy.get("[data-cy=\"title\"]").click();
  cy.get("ul[role=listbox]>li").contains(params.material).click();
  cy.get("[name=\"quantity\"]").type(params.quntity);
  cy.get("[data-cy=\"unit\"]").click();
  cy.get("ul[role=listbox]>li").contains(params.unit).click();
  cy.get("[data-cy=\"form.builder.save\"]").click();
});

Cypress.Commands.add("mpiAddEquipmentToStep", (params: {numbOfStep: integer; equipment: string}) => {
  cy.get("[data-cy=\"form.builder.equipment.btn\"]").eq(params.numbOfStep - 1).click();
  cy.get("[data-cy=\"title\"]").click();
  cy.get("ul[role=listbox]>li").contains(params.equipment).click();
  cy.get("[data-cy=\"form.builder.save\"]").click();
});
