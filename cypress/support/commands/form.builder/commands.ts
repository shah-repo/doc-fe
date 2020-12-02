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
      fbCheckboxGroupField(): Chainable<Subject>;
      fbRadioBtnGroupField(): Chainable<Subject>;
      fbGroupName(params: { name: string }): Chainable<Subject>;
      fbGroupOptions(...list: string[]): Chainable<Subject>;
      fbSelectAutoComplete(): Chainable<Subject>;
      fbSelectInlineApproval(): Chainable<Subject>;
      fbSelectApprovals(): Chainable<Subject>;
      fbOpenValidation(): Chainable<Subject>;
      fbAddField(): Chainable<Subject>;
      fbSelectField(): Chainable<Subject>;
      fbAddLabelName(params: { name: string }): Chainable<Subject>;
      fbAddApproverToInlineDialog(params: { approverName: string }): Chainable<Subject>;
      fbSelectCustomControl(): Chainable<Subject>;
      fbClickAddNewHiddenBtn(): Chainable<Subject>;
      fbSelectCheckboxValue(...list: string[]): Chainable<Subject>;
      fbUnSelectCheckboxValue(...list: string[]): Chainable<Subject>;
      fbInlineApprovalHisotryCheck(...list: string[]): Chainable<Subject>;
      fbSelectRadioButtonValue(params: { value: string }): Chainable<Subject>;
      fbSelectFieldValue(params: { value: string }): Chainable<Subject>;
      fbSelectCustomFieldToAdd(params: { name: string }): Chainable<Subject>;
      fbEnterPlaceholder(params: { placeholder: string }): Chainable<Subject>;
      fbEnterLabel(params: { label: string }): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("fbAddNewFieldOption", () => {
  cy.unClick();
  cy.contains("Add a Field").click();
});

Cypress.Commands.add("fbAddNewField", () => {
  cy.unClick();
  cy.get("button[data-cy=\"form.builder.add.field\"]").click();
});

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

Cypress.Commands.add("fbEnterLabel", (params: { label: string }) => {
  cy.get("input[name=\"label\"]").type(params.label).click();
});

Cypress.Commands.add("fbEnterPlaceholder", (params: { placeholder: string }) => {
  cy.get("[data-cy=\"placeholder\"]>div>input").type(params.placeholder).click();
});

Cypress.Commands.add("fbAddNewFieldButton", (params: { name: string }) => {
  cy.get("button[data-cy=\"fb-editor-actions-add\"]").contains("Add").click();
});

Cypress.Commands.add("fbAddLabelName", (params: { name: string }) => {
  cy.get("[data-cy=\"fb-editor-field-textfield\"]").type(params.name);
});

Cypress.Commands.add("fbGroupName", (params: { name: string }) => {
  cy.get("[name=\"label\"]").type(params.name);
});

Cypress.Commands.add("fbSelectCustomFieldToAdd", (params: { name: string }) => {
  cy.get("button[data-cy^=\"form.builder\"]").contains(params.name).click().wait(500);
});

Cypress.Commands.add("fbSelectCheckboxValue", (...list: string[]) => {
  list.forEach((item) => {
    cy.get("[type=\"checkbox\"]").check(item).wait(200);
  });
});

Cypress.Commands.add("fbUnSelectCheckboxValue", (...list: string[]) => {
  list.forEach((item) => {
    cy.get("[type=\"checkbox\"]").uncheck(item).wait(200);
  });
});

Cypress.Commands.add("fbInlineApprovalHisotryCheck", (...list: string[]) => {
  list.forEach((item) => {
    cy.get("[data-cy*=\"fb-approval-history\"]").contains(item);
  });
});

Cypress.Commands.add("fbSelectRadioButtonValue", (params: { value: string }) => {
  cy.get("[type=\"radio\"]").check(params.value);
});

Cypress.Commands.add("fbSelectFieldValue", (params: { value: string }) => {
  cy.get("[id*=\"mui-component-select-select-field-for-inline\"]").click().wait(400);
  cy.get("ul[role=listbox]>li").contains(params.value).click().wait(500);
});

Cypress.Commands.add("fbGroupOptions", (...list: string[]) => {
  list.forEach(function(item, i) {
    cy.get("[data-cy=\"options\"]").type((i === list.length - 1) ? item : item + "{enter}" );
  });
});

Cypress.Commands.add("fbSelectApprovalMatrix", () => cy.get("button[data-cy=\"form.builder.approvalMatrix\"]").click());

Cypress.Commands.add("fbSelectTextField", () => cy.get("button[data-cy=\"form.builder.textfield\"]").click());

Cypress.Commands.add("fbCheckboxGroupField", () => cy.get("button[data-cy=\"form.builder.checkboxgroup\"]").click());

Cypress.Commands.add("fbRadioBtnGroupField", () => cy.get("button[data-cy=\"form.builder.radiogroup\"]").click());

Cypress.Commands.add("fbSelectField", () => cy.get("button[data-cy=\"form.builder.select\"]").click());

Cypress.Commands.add("fbSelectInlineApproval", () => {
  cy.wait(500);
  cy.get("button[data-cy=\"form.builder.inlineapproval\"]").click();
});

Cypress.Commands.add("fbSelectApprovals", () => cy.get("button[data-cy=\"form.builder.approvals\"]").click());

Cypress.Commands.add("fbSelectCustomControl", () => cy.get("[data-cy=\"fb-control-btn\"]").click());

Cypress.Commands.add("fbSelectAutoComplete", () => cy.get("button[data-cy=\"form.builder.autocomplete\"]").click());

Cypress.Commands.add("fbOpenValidation", () => cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").click());

Cypress.Commands.add("fbAddField", () => cy.get("[data-cy=\"fb-editor-actions-add\"]").click().wait(500));
