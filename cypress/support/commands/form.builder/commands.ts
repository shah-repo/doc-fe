/* eslint-disable max-len */


/* eslint-disable @typescript-eslint/no-namespace */
export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      fbAddNewFieldOption(): Chainable<Subject>;
      fbRemoveLastAddedItem(): Chainable<Subject>;
      fbSelectNavField(params: { field: string }): Chainable<Subject>;
      fbNavToTableOverview(): Chainable<Subject>;
      fbSelectItemFromNewFieldList(params: { section: string; field: string }): Chainable<Subject>;
      fbEnterPOLabelName(params: { name: string }): Chainable<Subject>;
      fbAddNewFieldButton(): Chainable<Subject>;
      fbAddNewField(): Chainable<Subject>;
      fbSelectApprovalMatrix(): Chainable<Subject>;
      fbSelectTextField(): Chainable<Subject>;
      fbAddNewFieldWhenHidden(): Chainable<Subject>;
      fbAddNewFieldWhenHiddenLastPlace(): Chainable<Subject>;
      fbAddNewFieldWhenHidden2ndLastPlace(): Chainable<Subject>;
      fbAddNewFieldWhenHidden3rdLastPlace(): Chainable<Subject>;
      fbCheckboxGroupField(): Chainable<Subject>;
      fbRadioBtnGroupField(): Chainable<Subject>;
      fbGroupName(params: { name: string }): Chainable<Subject>;
      fbGroupOptions(...list: string[]): Chainable<Subject>;
      fbSelectAutoComplete(): Chainable<Subject>;
      fbSelectInlineApproval(): Chainable<Subject>;
      fbSelectApprovals(): Chainable<Subject>;
      fbOpenValidation(): Chainable<Subject>;
      fbFieldRequired(): Chainable<Subject>;
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
      fbSelectTextFieldRangeFromValue(params: { value: string }): Chainable<Subject>;
      fbSelectTextFieldRangeToValue(params: { value: string }): Chainable<Subject>;
      fbEnterTextEditor(params: { value: string }): Chainable<Subject>;
      fbSelectCustomFieldToAdd(params: { name: string }): Chainable<Subject>;
      fbEnterPlaceholder(params: { placeholder: string }): Chainable<Subject>;
      fbEnterLabel(params: { label: string }): Chainable<Subject>;
      fbCheckFieldsExistSectionList(...list: string[]): Chainable<Subject>;
      fbCheckFieldsExistInputsList(...list: string[]): Chainable<Subject>;
      fbCheckFieldsExistApprovalsList(...list: string[]): Chainable<Subject>;
      fbCheckFieldsExistCustomControlsList(...list: string[]): Chainable<Subject>;
      fbCheckFieldsExistInstructionsList(...list: string[]): Chainable<Subject>;
      fbCheckFieldsExistButtonsList(...list: string[]): Chainable<Subject>;
      fbCheckFieldsExistActionsList(...list: string[]): Chainable<Subject>;
      fbCheckFieldsExistFavoritesList(...list: string[]): Chainable<Subject>;
      fbCheckFieldsDoesntExistOnInputsList(...list: string[]): Chainable<Subject>;
      fbCheckFieldsDoesntExistOnApprovalsList(...list: string[]): Chainable<Subject>;
      fbEditHiddenBtn(): Chainable<Subject>;
      fbEnterNameValue(params: { name: string; value: string | number }): Chainable<Subject>;
      fbFieldRequiredIf(params: { name: string; value: string | number }): Chainable<Subject>;
      fbFieldRequiredIfNw(params: { name: string; value: string | number }): Chainable<Subject>;
      fbFieldRequiredIfIn(params: { name: string }): Chainable<Subject>;
      verifyFieldConfigExist(): Chainable<Subject>;
      verifySetRulesExist(): Chainable<Subject>;
      VerifyFBfieldLabel(): Chainable<Subject>;
      VerifyFBfieldURL(): Chainable<Subject>;
      verifyOptions(): Chainable<Subject>;
      VerifyFBfieldPlaceholder(): Chainable<Subject>;
      VerifyFBfieldSelectOptions(): Chainable<Subject>;
      VerifyFBfieldRowNumber(): Chainable<Subject>;
      VerifyFBfieldRevisionDisabled(): Chainable<Subject>;
      VerifyFBfieldDeletionDisabled(): Chainable<Subject>;
      VerifyFBfieldCopyableValue(): Chainable<Subject>;
      VerifyFBfieldIncludeNotes(): Chainable<Subject>;
      VerifyFBfieldSetCurrentDate(): Chainable<Subject>;
      VerifyFBfieldDisablePastDates(): Chainable<Subject>;
      verifyIncludeOther(): Chainable<Subject>;
      verifyIncludeNone(): Chainable<Subject>;
      verifyMultiSelect(): Chainable<Subject>;
      verifyIncludeQRScan(): Chainable<Subject>;
      VerifyFBfieldInspectionSection(): Chainable<Subject>;
      VerifySetRuleswithAllSections(): Chainable<Subject>;
      verifyFieldRequired(): Chainable<Subject>;
      verifyFieldRequiredIf(): Chainable<Subject>;
      verifyFieldRequiredIfIn(): Chainable<Subject>;
      verifyFieldRequiredWith(): Chainable<Subject>;
      verifyFieldRequiredWithout(): Chainable<Subject>;
      verifyFieldRequiredDocumentStatus(): Chainable<Subject>;
      verifyFieldRequiredDocumentType(): Chainable<Subject>;
      fbVerifySectionsOnAddField(...list: string[]): Chainable<Subject>;
      fbVerifySectionsNotOnAddField(...list: string[]): Chainable<Subject>;
      fbVerifyOptions(...list: string[]): Chainable<Subject>;
      VerifyFBfieldDescriptionOptions(...list: string[]): Chainable<Subject>;
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
      fbAddAutocompleteElement(params: { name: string; label: string; addBtnVisible?: boolean }): Chainable<Subject>;
      fbVerifyAutocompleteElementLength(params: { el: string; length: number }): Chainable<Subject>;
      fbClickLabelEditHiddenBtn(params: { label: string }): Chainable<Subject>;
      fbAutocompleteType(params: { autocompleteOption: string }): Chainable<Subject>;
      dtSelectDefaultRevisionStage(params: { defaultRevisionStage: string}): Chainable<Subject>;
      fbClickRemoveBtn(params: { label: string }): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("fbAutocompleteType", (params: { autocompleteOption: string }) => {
  cy.get("[data-cy=\"optionId\"]").autocompleteSelect(params.autocompleteOption);
});

Cypress.Commands.add("dtSelectDefaultRevisionStage", (params: { defaultRevisionStage: string }) => {
  cy.get("[id=\"defaultRevStage\"]").arrowClick();
  cy.get("div[id^=react-select]").contains(params.defaultRevisionStage).arrowClick();
});

Cypress.Commands.add("fbRemoveLastAddedItem", () => {
  cy.get("[data-cy=\"remove-schema-item\"]").last().arrowClick({ force: true });
});

Cypress.Commands.add("fbAddNewFieldOption", () => {
  cy.unClick();
  cy.contains("Add Field").arrowClick({ force: true });
});

Cypress.Commands.add("fbAddNewField", () => {
  cy.unClick();
  cy.get("button[data-cy=\"form.builder.add.field\"]").arrowClick({ force: true, multiple: true });
});

Cypress.Commands.add("fbAddNewFieldWhenHidden", () => {
  cy.get("button[data-cy=\"form.builder.add.field\"]").contains("Add Field").arrowClick({ force: true });
});

Cypress.Commands.add("fbAddNewFieldWhenHiddenLastPlace", () => {
  cy.get("button[data-cy=\"form.builder.add.field\"]").eq(-1).arrowClick({ force: true });
});

Cypress.Commands.add("fbAddNewFieldWhenHidden2ndLastPlace", () => {
  cy.get("button[data-cy=\"form.builder.add.field\"]").eq(-2).arrowClick({ force: true });
});

Cypress.Commands.add("fbAddNewFieldWhenHidden3rdLastPlace", () => {
  cy.get("button[data-cy=\"form.builder.add.field\"]").eq(-3).arrowClick({ force: true });
});

Cypress.Commands.add("fbClickAddNewHiddenBtn", () => {
  cy.get("button[data-cy=\"form.builder.add.field\"]").last().arrowClick({ force: true });
});

Cypress.Commands.add("fbAddApproverToInlineDialog", (params: { approverName: string }) => {
  cy.get("[data-cy=\"editorConfig.approvers\"]").scrollIntoView().arrowClick();
  cy.get("[role=option]").contains(params.approverName).arrowClick();
  cy.unClick();
});

Cypress.Commands.add("fbSelectNavField", (params: { field: string }) => {
  cy.get(".MuiButtonBase-root.MuiListItem-root.MuiListItem-button")
    .contains(new RegExp(params.field, "g")).arrowClick();
});

Cypress.Commands.add("fbNavToTableOverview", () => {
  cy.get("[data-cy=\"tabId.overview\"]").contains("Overview").arrowClick();
});

Cypress.Commands.add("fbSelectItemFromNewFieldList", (params: { section: string; field: string }) => {
  cy.get(`[data-cy="${params.section}"]`).arrowClick();
  cy.get(`li > [data-cy='${params.field}']`).contains(new RegExp((params.field)
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")).arrowClick();
});

Cypress.Commands.add("fbEnterPOLabelName", (params: { name: string }) => {
  cy.get("[class=\"MuiInputBase-root MuiOutlinedInput-root MuiInputBase-formControl\"]")
    .arrowType(params.name).arrowClick();
});

Cypress.Commands.add("fbEnterLabel", (params: { label: string }) => {
  cy.get("input[name=\"label\"]").arrowType(params.label).arrowClick({ force: true });
});

Cypress.Commands.add("fbEnterPlaceholder", (params: { placeholder: string }) => {
  cy.get("[data-cy=\"placeholder\"]>div>input").arrowType(params.placeholder).arrowClick({ force: true });
});

Cypress.Commands.add("fbAddNewFieldButton", () => {
  cy.get("button[data-cy=\"fb-editor-actions-add\"]").contains("Add").arrowClick({ force: true });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("fbAddLabelName", (params: { name: string }) => {
  cy.get("[data-cy=\"fb-editor-field-textfield\"]>div>input").arrowType(params.name, { force: true });
});

Cypress.Commands.add("fbGroupName", (params: { name: string }) => {
  cy.get("[name=\"label\"]").arrowType(params.name);
});

Cypress.Commands.add("fbSelectCustomFieldToAdd", (params: { name: string }) => {
  cy.get("button[data-cy^=\"form.builder\"]").contains(params.name).arrowClick();
});

Cypress.Commands.add("fbSelectCheckboxValue", (...list: string[]) => {
  list.forEach((item) => {
    cy.get(`[name="editorProperties"] [type="checkbox"]`).check(item, { force: true });
  });
});

Cypress.Commands.add("fbCheckFieldsExistSectionList", (...list: string[]) => {
  cy.get(`[data-cy="Section-btn"]`).arrowClick();

  list.forEach((item) => {
    cy.get(`[data-cy="${item}"]`).eq(0).should("exist");
    cy.get(`[data-cy="${item}"]`).arrowClick();
    cy.fbClickButton({ el: "fb-editor-actions-cancel" });
    cy.wait(2000);
    cy.get(`[data-cy="Section-btn"]`).arrowClick();
    cy.wait(1000);
  });
});

Cypress.Commands.add("fbCheckFieldsExistInputsList", (...list: string[]) => {
  cy.get(`[data-cy="Inputs"]`).arrowClick();

  list.forEach((item) => {
    cy.get(`[data-cy="${item}"]`).should("exist");
  });
});

Cypress.Commands.add("fbCheckFieldsExistApprovalsList", (...list: string[]) => {
  cy.get(`[data-cy="Approvals-btn"]`).arrowClick();

  list.forEach((item) => {
    cy.get(`[data-cy="${item}"]`).should("exist");
  });
});

Cypress.Commands.add("fbCheckFieldsExistCustomControlsList", (...list: string[]) => {
  cy.get(`[data-cy="Custom Controls"]`).arrowClick();

  list.forEach((item) => {
    cy.get(`[data-cy="${item}"]`).should("exist");
  });
});

Cypress.Commands.add("fbCheckFieldsExistInstructionsList", (...list: string[]) => {
  cy.get(`[data-cy="Instructions"]`).arrowClick();

  list.forEach((item) => {
    cy.get(`[data-cy="${item}"]`).should("exist");
  });
});

Cypress.Commands.add("fbCheckFieldsExistButtonsList", (...list: string[]) => {
  cy.get(`[data-cy="Buttons"]`).arrowClick();

  list.forEach((item) => {
    cy.get(`[data-cy="${item}"]`).should("exist");
  });
});

Cypress.Commands.add("fbCheckFieldsExistActionsList", (...list: string[]) => {
  cy.get(`[data-cy="Actions"]`).arrowClick();

  list.forEach((item) => {
    cy.get(`[data-cy="${item}"]`).should("exist");
  });
});

Cypress.Commands.add("fbCheckFieldsExistFavoritesList", (...list: string[]) => {
  cy.get(`[data-cy="Favorites"]`).arrowClick();

  list.forEach((item) => {
    cy.get(`[data-cy="${item}"]`).should("exist");
  });
});

Cypress.Commands.add("fbCheckFieldsDoesntExistOnInputsList", (...list: string[]) => {
  cy.get(`[data-cy="Inputs"]`).arrowClick();

  list.forEach((item) => {
    cy.get(`[data-cy="${item}"]`).should("not.exist");
  });
});

Cypress.Commands.add("fbCheckFieldsDoesntExistOnApprovalsList", (...list: string[]) => {
  cy.get(`[data-cy="Approvals-btn"]`).arrowClick();

  list.forEach((item) => {
    cy.get(`[data-cy="${item}"]`).should("not.exist");
  });
});

Cypress.Commands.add("fbUnSelectCheckboxValue", (...list: string[]) => {
  list.forEach((item) => {
    cy.get("[type=\"checkbox\"]").uncheck(item);
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
  cy.get("[id*=\"mui-component-select-select-field-for-inline\"]").arrowClick().wait(1000);
  cy.get("ul>li[role=option]").contains(params.value).arrowClick();
});

Cypress.Commands.add("fbSelectTextFieldRangeFromValue", (params: { value: string }) => {
  cy.get("[name=\"editorConfig.range.from\"]").arrowType(params.value);
});

Cypress.Commands.add("fbSelectTextFieldRangeToValue", (params: { value: string }) => {
  cy.get("[name=\"editorConfig.range.to\"]").arrowType(params.value);
});

Cypress.Commands.add("fbEnterTextEditor", (params: { value: string }) => {
  cy.get("[data-cy^=fb-text-editor-]>div>div>div>div>div[contenteditable]>div")
    .click({ force: true }).arrowType(params.value, { force: true });
  cy.unClick();
});

Cypress.Commands.add("fbGroupOptions", (...list: string[]) => {
  list.forEach(function(item, i) {
    cy.get("[data-cy=\"options\"]").arrowType((i === list.length - 1) ? item : item + "{enter}" ).wait(500);
  });
});

Cypress.Commands.add("fbSelectApprovalMatrix", () =>
  cy.get("button[data-cy=\"form.builder.approvalMatrix\"]").arrowClick());

Cypress.Commands.add("fbSelectTextField", () =>
  cy.get("button[data-cy=\"form.builder.textfield\"]").arrowClick());

Cypress.Commands.add("fbCheckboxGroupField", () =>
  cy.get("button[data-cy=\"form.builder.checkboxgroup\"]").arrowClick());

Cypress.Commands.add("fbRadioBtnGroupField", () =>
  cy.get("button[data-cy=\"form.builder.radiogroup\"]").arrowClick());

Cypress.Commands.add("fbSelectField", () =>
  cy.get("button[data-cy=\"form.builder.select\"]").arrowClick());

Cypress.Commands.add("fbSelectInlineApproval", () => {

  cy.get("button[data-cy=\"form.builder.inlineapproval\"]").arrowClick();
});

Cypress.Commands.add("fbSelectApprovals", () =>
  cy.get("button[data-cy=\"form.builder.approvals\"]").arrowClick());

Cypress.Commands.add("fbSelectCustomControl", () =>
  cy.get("[data-cy=\"fb-control-btn\"]").arrowClick());

Cypress.Commands.add("fbSelectAutoComplete", () =>
  cy.get("button[data-cy=\"form.builder.autocomplete\"]").arrowClick());

Cypress.Commands.add("fbOpenValidation", () =>
  cy.get("button[data-cy^=\"fb-editor-mode-validation\"]").arrowClick());

Cypress.Commands.add("fbFieldRequired", () =>
  cy.get("span[data-cy=\"fb-control-required\"]").arrowClick());

Cypress.Commands.add("fbAddField", () =>
  cy.get("button[data-cy=\"fb-editor-actions-add\"]").arrowClick());

Cypress.Commands.add("fbEditHiddenBtn", () =>
  cy.get("[data-cy=\"edit-schema-item\"]").first().arrowClick({ force: true }));

Cypress.Commands.add("fbEnterNameValue", (params: { name: string; value: string }) => {
  cy.get(`input[name^="${params.name}"]`).clear().arrowType(params.value).wait(1000).arrowClick();
});

Cypress.Commands.add("verifyFieldConfigExist", () => {
  cy.get(`[data-cy="fb-editor-mode-config-0"]`).should("exist");
});

Cypress.Commands.add("verifySetRulesExist", () => {
  cy.get(`[data-cy="fb-editor-mode-validation-1"]`).should("exist");
});

Cypress.Commands.add("VerifyFBfieldLabel", () => {
  cy.get(`[data-cy="form.builder.label"]`).should("exist");
});

Cypress.Commands.add("VerifyFBfieldURL", () => {
  cy.get(`[data-cy="URL"]`).should("exist");
});

Cypress.Commands.add("verifyOptions", () => {
  cy.get(`[data-cy="form.builder.options"]`).should("exist");
});

Cypress.Commands.add("VerifyFBfieldDescriptionOptions", () => {
  cy.get(`[data-cy="form.builder.description.options"]`).should("exist");
});

Cypress.Commands.add("VerifyFBfieldPlaceholder", () => {
  cy.get(`[data-cy="form.builder.placeholder"]`).should("exist");
});

Cypress.Commands.add("VerifyFBfieldSelectOptions", () => {
  cy.get(`[data-cy="form.builder.select.options"]`).should("exist");
});

Cypress.Commands.add("VerifyFBfieldRowNumber", () => {
  cy.get(`[data-cy="form.builder.rowNumber"]`).should("exist");
});

Cypress.Commands.add("VerifyFBfieldRevisionDisabled", () => {
  cy.get(`input[value^="reviseDisabled"]`).should("exist");
});

Cypress.Commands.add("VerifyFBfieldDeletionDisabled", () => {
  cy.get(`input[value^="deleteDisabled"]`).should("exist");
});

Cypress.Commands.add("VerifyFBfieldCopyableValue", () => {
  cy.get(`input[value^="copyableValue"]`).should("exist");
});

Cypress.Commands.add("VerifyFBfieldIncludeNotes", () => {
  cy.get(`input[value^="includeNotes"]`).should("exist");
});

Cypress.Commands.add("VerifyFBfieldSetCurrentDate", () => {
  cy.get(`input[value^="defaultCurrentDate"]`).should("exist");
});

Cypress.Commands.add("VerifyFBfieldDisablePastDates", () => {
  cy.get(`input[value^="disablePastDates"]`).should("exist");
});

Cypress.Commands.add("verifyIncludeOther", () => {
  cy.get(`input[value^="includeContext"]`).should("exist");
});

Cypress.Commands.add("verifyIncludeNone", () => {
  cy.get(`input[value^="includeNone"]`).should("exist");
});

Cypress.Commands.add("verifyMultiSelect", () => {
  cy.get(`input[value^="multiple"]`).should("exist");
});

Cypress.Commands.add("verifyIncludeQRScan", () => {
  cy.get(`input[value^="includeQRScan"]`).should("exist");
});

Cypress.Commands.add("VerifyFBfieldInspectionSection", () => {
  cy.get(`input[value^="inspectionSection"]`).should("exist");
});

Cypress.Commands.add("VerifySetRuleswithAllSections", () => {
  cy.get(`input[value^="default"]`).should("exist");
  cy.get(`input[value^="visibility"]`).should("exist");
  cy.get(`input[value^="disabled"]`).should("exist");
  cy.verifyFieldRequired();
  cy.verifyFieldRequiredIf();
  cy.verifyFieldRequiredIfIn();
  cy.verifyFieldRequiredWith();
  cy.verifyFieldRequiredWithout();
  cy.verifyFieldRequiredDocumentStatus();
  cy.verifyFieldRequiredDocumentType();
});

Cypress.Commands.add("verifyFieldRequired", () => {
  cy.get("input[name=\"validators.required\"]").should("exist");
});

Cypress.Commands.add("verifyFieldRequiredIf", () => {
  cy.get("input[name=\"validators.required_if\"]").should("exist");
});

Cypress.Commands.add("verifyFieldRequiredIfIn", () => {
  cy.get("[data-cy=\"fb-control-required_if_in:anotherfield,[value]\"]").should("exist");
});

Cypress.Commands.add("verifyFieldRequiredWith", () => {
  cy.get("[name=\"validators.required_with\"]").should("exist");
});

Cypress.Commands.add("verifyFieldRequiredWithout", () => {
  cy.get("[name=\"validators.required_without\"]").should("exist");
});

Cypress.Commands.add("verifyFieldRequiredDocumentStatus", () => {
  cy.get("[name=\"validators.required_document_status\"]").should("exist");
});

Cypress.Commands.add("verifyFieldRequiredDocumentType", () => {
  cy.get("[name=\"validators.required_document_type\"]").should("exist");
});

Cypress.Commands.add("fbFieldRequiredIf", (params: { name: string; value: string }) => {
  cy.get("input[name=\"validators.required_if\"]").arrowClick();
  cy.get(`[data-cy="validators.required_if.name"]`).autocompleteSelect(params.name);
  cy.unClick();
  cy.listLoadingElementShouldNotExist();
  cy.get(`[data-cy="validators.required_if.value"]`).autocompleteSelect(params.value);
});

Cypress.Commands.add("fbFieldRequiredIfNw", (params: { name: string; value: string }) => {
  cy.get("input[name=\"validators.required_if\"]").arrowClick();
  cy.get(`[data-cy="validators.required_if.name"]`).autocompleteSelect(params.name);
  cy.get(`[data-cy="validators.required_if.value"]`).arrowType(params.value);
});

Cypress.Commands.add("fbFieldRequiredIfIn", (params: { name: string}) => {
  cy.get("[data-cy=\"fb-control-required_if_in:anotherfield,[value]\"]").arrowClick();
  cy.get(`[data-cy="validators.required_if_in.name"]`).autocompleteSelect(params.name);
});

Cypress.Commands.add("fbVerifyCheckboxValue", (...list: string[]) => {
  list.forEach(function(item) {
    cy.get(`input[value="${item}"]`).should("be.checked");
  });
});

Cypress.Commands.add("fbVerifySectionsOnAddField", (...list: string[]) => {
  list.forEach((item) => {
    cy.get(`[data-cy="${item}"]`).should("exist");
  });
});

Cypress.Commands.add("fbVerifySectionsNotOnAddField", (...list: string[]) => {
  list.forEach((item) => {
    cy.get(`[data-cy="${item}"]`).should("not.exist");
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
  cy.get("[data-cy=\"paragraph\"]>div>div>div>div>div[contenteditable]")
    .clear().arrowType(params.paragraph);
  cy.get("[data-cy=form.builder.create.field]").arrowClick();
});

Cypress.Commands.add("fbVerifyParagraphValue", (params: { paragraph: string }) => {
  cy.get("[data-cy=\"paragraph\"]>div>div>div>div>div[contenteditable]")
    .should("have.text", params.paragraph);
});

Cypress.Commands.add("fbSelectCheckboxName", (...list: string[]) => {
  list.forEach((name) => {
    cy.get(`input[name="${name}"]`).check();
  });
});

Cypress.Commands.add("fbVerifyCheckboxName", (...list: string[]) => {
  list.forEach(function(name) {
    cy.get(`input[name="${name}"]`).should("be.checked");
  });
});

Cypress.Commands.add("fbClickButton", (params: { el: string }) => {
  cy.get(`button[data-cy="${params.el}"]`).arrowClick({ force: true });
});

Cypress.Commands.add("fbMouseOverByName", (params: { name: string }) => {
  cy.get(`input[name^="${params.name}"`).parent().trigger("mouseover").scrollIntoView({ offset: { top: -100, left: 0 } });
});

Cypress.Commands.add("fbMouseOverByLabel", (params: { label: string }) => {
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
  cy.contains(params.label).parent().trigger("mouseover", { force: true }).scrollIntoView({ offset: { top: -100, left: 0 } });
});

Cypress.Commands.add("fbVerifyElementVisibile", (params: { name: string; el: string }) => {
  cy.get(`[name^="${params.name}"`).parentsUntil("li").find(`svg[data-cy=${params.el}]`).should("be.visible");
});

Cypress.Commands.add("fbVerifyElementNotVisibile", (params: { name: string; el: string }) => {
  cy.get(`[name^="${params.name}"`).parentsUntil("li").find(`svg[data-cy=${params.el}]`).should("not.be.visible");
});

Cypress.Commands.add("fbVerifyElementVisibileByLabel", (params: { label: string; el: string }) => {
  cy.contains(params.label).parentsUntil("li").find(`[data-cy=${params.el}]`).should("be.visible");
});

Cypress.Commands.add("fbVerifyElementNotVisibileByLabel", (params: { label: string; el: string }) => {
  cy.contains(params.label).parentsUntil("li").find(`[data-cy=${params.el}]`).should("not.be.visible");
});

Cypress.Commands.add("fbVerifyElementClass", (params: { name: string; el: string; class: string }) => {
  cy.get(`[name^="${params.name}"`).parentsUntil("li").find(`svg[data-cy=${params.el}]`)
    .should("have.class", params.class);
});

Cypress.Commands.add("fbVerifyElementClassByLabel", (params: { label: string; el: string; class: string }) => {
  cy.contains(params.label).parentsUntil("li").find(`[data-cy=${params.el}]`).should("have.class", params.class);
});

Cypress.Commands.add("fbVerifyElementContainText", (params: { name: string; label: string; text: string }) => {
  cy.contains(params.label).parentsUntil("li").find(`[name^="${params.name}"]`).should("contain", params.text);
});

Cypress.Commands.add("fbVerifyElementNotContainText", (params: { name: string; label: string; text: string }) => {
  cy.contains(params.label).parentsUntil("li").find(`[name^="${params.name}"]`).should("not.contain", params.text);
});

Cypress.Commands.add("fbEnterNameData", (params: { name: string; data: string }) => {
  cy.get(`[name="${params.name}"]`).clear().arrowType(params.data);
});

Cypress.Commands.add("fbAddAutocompleteElement", (params: { name: string; label: string;
  addBtnVisible?: boolean; }) => {
  if (params.addBtnVisible) {
    cy.fbAddNewField();
  }
  else {
    cy.fbClickAddNewHiddenBtn();
  }
  cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
  cy.fbEnterNameValue({ name: "label", value: params.label });
  cy.get("[data-cy=\"optionId\"]").autocompleteSelect(`${params.name}`);
  cy.fbAddNewFieldButton();
});

Cypress.Commands.add("fbVerifyAutocompleteElementLength", (params: { el: string; length: number }) => {
  cy.get("[data-cy=\"form.builder.form.preview\"]").arrowClick();
  cy.listLoadingElementShouldNotExist();
  cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
    .find(`[data-cy^="${params.el}-"]`)
    .click();

  if (params.length > 0) {
    cy.get("ul>li[role=option]").first().scrollIntoView().trigger("mouseover").wait(500);

    const indexNumberToVerifyLengthOfList = params.length - 1;
    let i = 0;
    while (i < indexNumberToVerifyLengthOfList)
    {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find(`[data-cy^="${params.el}-"]`).type("{downarrow}");
      i++;
    }

    cy.get("ul>li[role=option]").last().should("have.attr", "data-option-index",
      indexNumberToVerifyLengthOfList);
  }
  else {
    cy.get("ul>li[role=option]").should("not.exist");
  }
});

Cypress.Commands.add("fbClickLabelEditHiddenBtn", (params: { label: string }) => {
  cy.contains(params.label).parentsUntil("li").find("[data-cy=\"edit-schema-item\"]")
    .first().arrowClick({ force: true });
});

Cypress.Commands.add("fbClickRemoveBtn", (params: { label: string }) => {
  cy.contains(params.label).parentsUntil("li").find("[data-cy=\"remove-schema-item\"]")
    .first().arrowClick({ force: true });
});
