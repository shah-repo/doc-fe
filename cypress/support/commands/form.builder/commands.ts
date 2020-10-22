/* eslint-disable max-len */
/* eslint-disable max-classes-per-file */

import { CyRoutes } from "../../routes";


/* eslint-disable @typescript-eslint/no-namespace */
export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      fbAddNewFieldOption(): Chainable<Subject>;
      fbSelectItemFromNewFieldList(params: { field: string }): Chainable<Subject>;
      fbEnterPOLabelName(params: { name: string }): Chainable<Subject>;
      fbAddNewFieldButton(): Chainable<Subject>;
      fbAddNewField(): Chainable<Subject>;
      fbSelectApprovalMatrix(): Chainable<Subject>;
      fbSelectTextField(): Chainable<Subject>;
      fbSelectAutoComplete(): Chainable<Subject>;
      fbSelectInlineApproval(): Chainable<Subject>;
      fbSelectApprovals(): Chainable<Subject>;
      fbOpenValidation(): Chainable<Subject>;
      fbAddField(): Chainable<Subject>;
      fbAddLabelName(params: { name: string }): Chainable<Subject>;
      fbAddApproverToInlineDialog(params: { approverName: string }): Chainable<Subject>;
      fbSelectCustomControl(): Chainable<Subject>;
      fbClickAddNewHiddenBtn(): Chainable<Subject>;
      fbSelectCustomFieldToAdd(params: { name: string }): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("fbAddNewFieldOption", () => {
  cy.contains("Add a Field").click();
});

Cypress.Commands.add("fbAddNewField", () => cy.get("button[data-cy=\"form.builder.add.field\"]").click());

Cypress.Commands.add("fbClickAddNewHiddenBtn", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetDocDynamicForm, () => {
    cy.get("button[data-cy=\"fb-control-btn\"]").last().click({ force: true });
  });
});

Cypress.Commands.add("fbAddApproverToInlineDialog", (params: { approverName: string }) => {
  cy.get("[data-cy=\"editorConfig.approvers\"]").click();
  cy.get("[role=option]").contains(params.approverName).click();
  cy.get("[role=dialog]>div>h2").click();
});

Cypress.Commands.add("fbSelectItemFromNewFieldList", (params: { field: string }) => {
  cy.get("[class=\"MuiButton-label\"]").contains(new RegExp(params.field, "g")).click();
});

Cypress.Commands.add("fbEnterPOLabelName", (params: { name: string }) => {
  cy.get("[class=\"MuiInputBase-root MuiOutlinedInput-root MuiInputBase-formControl\"]").type(params.name).click();
});

Cypress.Commands.add("fbAddNewFieldButton", (params: { name: string }) => {
  cy.get("button[data-cy=\"fb-editor-actions-add\"]").contains("Add").click();
});

Cypress.Commands.add("fbAddLabelName", (params: { name: string }) => {
  cy.get("[data-cy=\"fb-editor-field-textfield\"]").type(params.name);
});

Cypress.Commands.add("fbSelectCustomFieldToAdd", (params: { name: string }) => {
  cy.get("button[data-cy^=\"form.builder\"]").contains(params.name).click().wait(500);
});

Cypress.Commands.add("fbSelectApprovalMatrix", () => cy.get("button[data-cy=\"form.builder.approvalMatrix\"]").click());
Cypress.Commands.add("fbSelectTextField", () => cy.get("button[data-cy=\"form.builder.textfield\"]").click().wait(500));

Cypress.Commands.add("fbSelectInlineApproval", () => {
  cy.wait(500);
  cy.get("button[data-cy=\"form.builder.inlineapproval\"]").click();
});

Cypress.Commands.add("fbSelectApprovals", () => cy.get("button[data-cy=\"form.builder.approvals\"]").click());

Cypress.Commands.add("fbSelectCustomControl", () => cy.get("[data-cy=\"fb-control-btn\"]").click());

Cypress.Commands.add("fbSelectAutoComplete", () => cy.get("button[data-cy=\"form.builder.autocomplete\"]").click());

Cypress.Commands.add("fbOpenValidation", () => cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").click());

Cypress.Commands.add("fbAddField", () => cy.get("[data-cy=\"fb-editor-actions-add\"]").click().wait(500));
