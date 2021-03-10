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
      fbAddNewFieldWhenHidden(): Chainable<Subject>;
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
      fbCheckFields(...list: string[]): Chainable<Subject>;
      fbCheckFieldsDoesntExist(...list: string[]): Chainable<Subject>;
      fbEditHiddenBtn(): Chainable<Subject>;
      fbEnterNameValue(params: { name: string; value: string }): Chainable<Subject>;
      fbVerifyOptions(...list: string[]): Chainable<Subject>;
      fbVerifyCheckboxValue(...list: string[]): Chainable<Subject>;
      fbVerifyNameValue(params: { name: string; value: string }): Chainable<Subject>;
      fbEnterParagraph(params: { paragraph: string }): Chainable<Subject>;
      fbVerifyParagraphValue(params: { paragraph: string }): Chainable<Subject>;
      fbVerifyRadioButtonValue(params: { name: string }): Chainable<Subject>;
      fbSelectCheckboxName(...list: string[]): Chainable<Subject>;
      fbVerifyCheckboxName(...list: string[]): Chainable<Subject>;
      fbMouseOverByName(params: { name: string }): Chainable<Subject>;
      fbMouseOverByLabel(params: { label: string }): Chainable<Subject>;
      fbClickButton(params: { el: string }): Chainable<Subject>;
      fbVerifyElementVisibile(params: { name: string; el: string }): Chainable<Subject>;
      fbVerifyElementNotVisibile(params: { name: string; el: string }): Chainable<Subject>;
      fbVerifyElementVisibileByLabel(params: { label: string; el: string }): Chainable<Subject>;
      fbVerifyElementNotVisibileByLabel(params: { label: string; el: string }): Chainable<Subject>;
      fbVerifyElementClass(params: { name: string; el: string; class: string }): Chainable<Subject>;
      fbVerifyElementClassByLabel(params: { label: string; el: string; class: string }): Chainable<Subject>;
      fbVerifyElementContainText(params: { name: string; label: string; text: string }): Chainable<Subject>;
      fbVerifyElementNotContainText(params: { name: string; label: string; text: string }): Chainable<Subject>;
      fbEnterNameData(params: { name: string; data: string }): Chainable<Subject>;
      fbAddAutocompleteElement(params: { name: string; label: string }): Chainable<Subject>;
      fbVerifyAutocompleteElementLength(params: { el: string; length: number }): Chainable<Subject>;
      fbClickLabelEditHiddenBtn(params: { label: string }): Chainable<Subject>;
      fbAutocompleteType(params: { autocompleteOption: string }): Chainable<Subject>;
      dtSelectDefaultRevisionStage(params: { defaultRevisionStage: string}): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("fbAutocompleteType", (params: { autocompleteOption: string }) => {
  cy.get("[data-cy=\"optionId\"]").click();
  cy.get("ul[role=listbox]>li").contains(params.autocompleteOption).click();
});

Cypress.Commands.add("dtSelectDefaultRevisionStage", (params: { defaultRevisionStage: string }) => {
  cy.get("[id=\"defaultRevStage\"]").click();
  cy.get("div[id^=react-select]").contains(params.defaultRevisionStage).click();
});

Cypress.Commands.add("fbAddNewFieldOption", () => {
  cy.unClick();
  cy.contains("Add a Field").click();
});

Cypress.Commands.add("fbAddNewField", () => {
  cy.unClick();
  cy.get("button[data-cy=\"form.builder.add.field\"]").click();
});

Cypress.Commands.add("fbAddNewFieldWhenHidden", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetDocDynamicForm, () => {
    cy.get("[data-cy=\"form.builder.add.field\"]").contains("Add a Field").click({ force: true });
  });
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
    cy.get("[type=\"checkbox\"]").check(item, { force: true }).wait(200);
  });
});

Cypress.Commands.add("fbCheckFields", (...list: string[]) => {
  list.forEach((item) => {
    cy.get(`[data-cy="form.builder.${item}"]`).should("exist");
  });
});

Cypress.Commands.add("fbCheckFieldsDoesntExist", (...list: string[]) => {
  list.forEach((item) => {
    cy.get(`[data-cy="form.builder.${item}"]`).should("not.exist");
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

Cypress.Commands.add("fbEditHiddenBtn", () => cy.get("[data-cy=\"edit-schema-item\"]").first().click({ force: true }).wait(500));

Cypress.Commands.add("fbEnterNameValue", (params: { name: string; value: string }) => {
  cy.get(`input[name="${params.name}"]`).clear().type(params.value).click();
});

Cypress.Commands.add("fbVerifyCheckboxValue", (...list: string[]) => {
  list.forEach(function(item) {
    cy.get(`input[value="${item}"]`).should("be.checked");
  });
});

Cypress.Commands.add("fbVerifyOptions", (...list: string[]) => {
  list.forEach(function(item) {
    cy.get("[data-cy=\"options\"]").should("contain", item);
  });
});

Cypress.Commands.add("fbVerifyNameValue", (params: { name: string; value: string }) => {
  cy.get(`input[name="${params.name}"]`).should("have.value", params.value);
});

Cypress.Commands.add("fbVerifyRadioButtonValue", (params: { name: string }) => {
  cy.get(`input[name="${params.name}"]`).should("be.checked");
});

Cypress.Commands.add("fbEnterParagraph", (params: { paragraph: string }) => {
  cy.get("[data-cy=\"paragraph\"]>div>div>div>div>div[contenteditable]").clear().type(params.paragraph);
  cy.get("[data-cy=form.builder.create.field]").click().wait(1000);
});

Cypress.Commands.add("fbVerifyParagraphValue", (params: { paragraph: string }) => {
  cy.get("[data-cy=\"paragraph\"]>div>div>div>div>div[contenteditable]").should("have.text", params.paragraph);
});

Cypress.Commands.add("fbSelectCheckboxName", (...list: string[]) => {
  list.forEach((name) => {
    cy.get(`input[name="${name}"]`).check().wait(200);
  });
});

Cypress.Commands.add("fbVerifyCheckboxName", (...list: string[]) => {
  list.forEach(function(name) {
    cy.get(`input[name="${name}"]`).should("be.checked");
  });
});

Cypress.Commands.add("fbClickButton", (params: { el: string }) => {
  cy.get(`[data-cy="${params.el}"]`).click();
});

Cypress.Commands.add("fbMouseOverByName", (params: { name: string }) => {
  cy.get(`input[name^="${params.name}"`).parent().trigger("mouseover");
});

Cypress.Commands.add("fbMouseOverByLabel", (params: { label: string }) => {
  cy.contains(params.label).parent().trigger("mouseover");
});

Cypress.Commands.add("fbVerifyElementVisibile", (params: { name: string; el: string }) => {
  cy.get(`input[name^="${params.name}"`).parentsUntil("li").find(`[data-cy=${params.el}]`).should("be.visible");
});

Cypress.Commands.add("fbVerifyElementNotVisibile", (params: { name: string; el: string }) => {
  cy.get(`input[name^="${params.name}"`).parentsUntil("li").find(`[data-cy=${params.el}]`).should("not.be.visible");
});

Cypress.Commands.add("fbVerifyElementVisibileByLabel", (params: { label: string; el: string }) => {
  cy.contains(params.label).parentsUntil("li").find(`[data-cy=${params.el}]`).should("be.visible");
});

Cypress.Commands.add("fbVerifyElementNotVisibileByLabel", (params: { label: string; el: string }) => {
  cy.contains(params.label).parentsUntil("li").find(`[data-cy=${params.el}]`).should("not.be.visible");
});

Cypress.Commands.add("fbVerifyElementClass", (params: { name: string; el: string; class: string }) => {
  cy.get(`input[name^="${params.name}"`).parentsUntil("li").find(`[data-cy=${params.el}]`).should("have.class", params.class);
});

Cypress.Commands.add("fbVerifyElementClassByLabel", (params: { label: string; el: string; class: string }) => {
  cy.contains(params.label).parentsUntil("li").find(`[data-cy=${params.el}]`).should("have.class", params.class);
});

Cypress.Commands.add("fbVerifyElementContainText", (params: { name: string; label: string; text: string }) => {
  cy.contains(params.label).parentsUntil("li").find(`[name^=\"${params.name}\"]`).should("contain", params.text);
});

Cypress.Commands.add("fbVerifyElementNotContainText", (params: { name: string; label: string; text: string }) => {
  cy.contains(params.label).parentsUntil("li").find(`[name^=\"${params.name}\"]`).should("not.contain", params.text);
});

Cypress.Commands.add("fbEnterNameData", (params: { name: string; data: string }) => {
  cy.get(`[name="${params.name}"]`).clear().type(params.data);
});

Cypress.Commands.add("fbAddAutocompleteElement", (params: { name: string; label: string }) => {
  cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
  cy.fbSelectItemFromNewFieldList({ field: "Autocomplete" });
  cy.fbEnterNameValue({ name: "label", value: params.label });
  cy.get("[data-cy=\"optionId\"]").type(`${params.name}{downarrow}{enter}`);
  cy.fbAddNewFieldButton();
  cy.wait(1000);
  cy.contains(params.label).trigger("mouseover");
});

Cypress.Commands.add("fbVerifyAutocompleteElementLength", (params: { el: string; length: number }) => {
  cy.get("[data-cy=\"form.builder.form.preview\"]").click();
  cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
    .find(`[data-cy^="${params.el}-"]`)
    .click();

  cy.get(".MuiAutocomplete-popper ul li").should("have.length", params.length);
});

Cypress.Commands.add("fbClickLabelEditHiddenBtn", (params: { label: string }) => {
  cy.contains(params.label).parentsUntil("li").find("[data-cy=\"edit-schema-item\"]").first().click({ force: true }).wait(500);
});
