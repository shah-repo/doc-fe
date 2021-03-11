/* eslint-disable @typescript-eslint/no-namespace */

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
      ebClickClone(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("ebEnterPartName", (params: { name: string }) => {
  cy.get("[data-cy=\"name\"]").type(params.name);
});

Cypress.Commands.add("ebEnterPartDescription", (params: { description: string }) => {
  cy.xpath("//div[@data-cy=\"description\"]/../div[2]").click();
  cy.get("[data-cy=\"description\"]>div>div>div>div>div[contenteditable]").clear().type(params.description);
  cy.get("[data-cy=\"form.builder.field.description\"]>div").click().wait(1000);
});

Cypress.Commands.add("ebChoosePartType", (params: {partName: string}) => {
  cy.get("[data-cy=\"document.documentType.id\"]").type(params.partName + "{downarrow}{enter}");
});

Cypress.Commands.add("ebCheckIfPartIsInSummary", (params: {partName: string}) => {
  cy.get("[data-cy=\"BuildsPresenter-link-form.builder.part\"]")
    .should("contain.text", params.partName);
});

Cypress.Commands.add("ebVerifyNewRevisionCreated", () => {
  cy.get(" [data-cy=\"DocumentRevisionList-item\"]>a>div").first()
    .then(($el) => {
      const text = $el.text();
      expect(text.replace(/\u00a0/g, " ")).to.contain("Revision 2  - Draft");
    });
});

Cypress.Commands.add("ebClickClone", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.EmployeesGet, CyRoutes.GetRequiredApproversDocRev], () => {
    cy.get("[data-cy=\"CloneEBButton\"]").click();
  });
});


Cypress.Commands.add("ebApprove", () => {
  cy.get("[data-cy=\"fb-control-btn\"]").eq(1).click();
  cy.get("input[name=\"password\"]").type("Tester1!");
  cy.wait(500);
  cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove, CyRoutes.DocPreview], () => {
    cy.get("[data-cy=\"common.confirm\"]").click();
  });
  cy.checkToastMessage({ exists: false });
});
