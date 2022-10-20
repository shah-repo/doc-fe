/* eslint-disable @typescript-eslint/no-namespace */

import { CyRoutes } from "../../routes";

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      verifyTitleDescriptionFields(): Chainable;
      verifyDefaultFields(): Chainable;
      verifyDocumentHeaderDetails(): Chainable;
      verifyListItemExistsOnHeader(params: {listItem: string; breadcrump?: boolean}): Chainable<Subject>;
      verifySelectedTab(params: {tab: string}): Chainable;
      verifyFixedTab(): Chainable;
      verifyApprovalsField(): Chainable;
      verifyFormOptionsVisibility(): Chainable;
      verifyExpandCollpase(): Chainable;
      verifyRightSidePanelOtherTabs(): Chainable;
      verifyReferencesGeneralInfo(params: {user: string}): Chainable;
      verifyReferencesOtherInfo(): Chainable;
      verifyHistoryScroll(): Chainable;
      verifyPredefiendFields(): Chainable;
      verifyReferenceInfo(): Chainable;
      verifyReferenceTab({ user, formId, shortName }): Chainable;
      verifyAddRemoveReference({ formId }): Chainable;
      verifyDescriptionToolbar(): Chainable;
      verifyHeaderInfoContent(HeaderInfo): Chainable;
      isTabActive(tabInfo: {name: string; index: number}): Chainable;
      verifyTabs(...tabs: string[]): Chainable;
      verifyReferencesTabAsActive(): Chainable;
      openRevisionsTabAndVerifyCurrentRevision(rev: string): Chainable;
      verifyStatusbarBgcolor(params: {bcolor: string}): Chainable;
      verifyLastSavedExists(): Chainable;
      verifyLastSavedNotExists(): Chainable;
      verifyTitleIsHighlightedonHover(): Chainable;
      verifyDescriptionIsHighlightedonHover(): Chainable;
      verifyTitleNotHighlightedonHover(): Chainable;
      verifyDescriptionNotHighlightedonHover(): Chainable;
    }
  }
}

Cypress.Commands.add("verifyTitleDescriptionFields", () => {
  cy.get("[data-cy=\"field-name\"]").should("exist");
  cy.get("[data-cy=\"description\"]").should("exist");
});

Cypress.Commands.add("verifyDefaultFields", () => {
  cy.get("[data-cy=\"field-document.documentType.id\"]").should("exist");
  cy.get("[data-cy=\"field-document.docId\"]").should("exist");
  cy.get("[data-cy=\"field-revisionStage\"]").should("exist");
  cy.get("[data-cy=\"field-retrain\"]").should("exist");
  cy.get("[data-cy=\"AttachmentFieldPresenter-field\"]").should("exist");
});

Cypress.Commands.add("verifyDocumentHeaderDetails", () => {
  cy.get("div[data-cy=\"Header-listIcon\"]").should("exist");
  cy.get("div[data-cy=\"Header-listTitle\"]").should("exist");
  cy.get("span[data-cy=\"HeaderInfo-docId\"]").should("exist");
  cy.get("div[data-cy=\"HeaderInfo-Rev\"]").should("exist");
  cy.get("div[data-cy=\"HeaderInfo-status\"]").should("exist");
});

Cypress.Commands.add("verifyListItemExistsOnHeader", (params: { listItem: string; breadcrump?: boolean}) => {
  cy.get("div[data-cy=\"Header-listIcon\"]").should("exist");
  cy.get("[data-cy='header-section']>div").eq(0).contains(params.listItem).should("exist");
  if (params.breadcrump) {
    cy.get(`li[class*="MuiBreadcrumbs-separator"]>svg`).should("exist");
  }
});

Cypress.Commands.add("verifySelectedTab", (params: {tab: string}) => {
  cy.get(`[data-cy="tabId.${params.tab}"]`).parent().parent().should("have.class", "Mui-selected");
});

Cypress.Commands.add("verifyFixedTab", () => {
  cy.get(".MuiTabs-fixed").should("exist");
});

Cypress.Commands.add("verifyApprovalsField", () => {
  cy.get("[id^=\"fb-approvals-section-fb-approvals\"]").should("exist");
  cy.get("input[data-cy^=\"fb-approvals-fb-approvals\"]").should("exist");
});

Cypress.Commands.add("verifyFormOptionsVisibility", () => {
  cy.get("button[data-cy=\"FBWorkspace-clickView\"]").should("be.visible");
  cy.get("[data-cy=\"FBWorkspace-exportTemplate\"]").should("be.visible");
  cy.get("[data-cy=\"FBWorkspace-importTemplate\"]").should("be.visible");
});

Cypress.Commands.add("verifyExpandCollpase", () => {
  cy.get("main span>button").eq(0).should("not.have.class", "maximize").click().should("have.class", "maximize");
  cy.get("main span>button").eq(0).arrowClick();
});

Cypress.Commands.add("verifyRightSidePanelOtherTabs", () => {
  cy.get("[data-cy=\"note-icon\"]").should("be.visible");
  cy.get("[data-cy=\"timeline-icon\"]").should("be.visible");
  cy.get("[data-cy=\"permission-icon\"]").should("be.visible");
  cy.get("[data-cy=\"bookmark-icon\"]").should("be.visible");
  cy.get("[data-cy=\"cr-icon\"]").should("be.visible");
});

Cypress.Commands.add("verifyReferencesGeneralInfo", (params: {user: string}) => {
  cy.get("[data-cy=\"references-icon\"]").should("be.visible");
  cy.get("[data-cy=\"generalInfo\"]>p").should("contain.text", "General Info");
  cy.get("[data-cy=\"user-avatar\"]").should("exist");
  cy.get("[data-cy=\"user-name\"]").should("contain.text", params.user);
  cy.get("[data-cy=\"secondary-text\"]").should("contain.text", "Owner");
});

Cypress.Commands.add("verifyReferencesOtherInfo", () => {
  cy.get("[data-cy=\"generalInfo\"]")
    .should("contain.text", "Referenced By")
    .and("contain.text", "Training")
    .and("contain.text", "Release Date")
    .and("contain.text", "Form Info");
});

Cypress.Commands.add("verifyHistoryScroll", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAudit], () => {
    cy.drSelectHistoryTab();
    cy.get(`[data-cy="History-detail"]`).realHover().wait(500).scrollTo("top");
    cy.get("[data-cy=\"History-detail\"]").scrollTo("bottom");
  });
});

Cypress.Commands.add("verifyPredefiendFields", () => {
  cy.get("[data-cy=\"field-name\"]").should("exist");
  cy.get("[data-cy=\"description\"]").should("exist");
  cy.get("[data-cy=\"select.document.documentType.id\"]").should("exist");
  cy.get("[data-cy=\"field-document.docId\"]").should("exist");
  cy.get("[data-cy=\"field-revisionStage\"]").should("exist");
  cy.get("[data-cy=\"field-retrain\"]").should("exist");
});

Cypress.Commands.add("verifyReferenceInfo", () => {
  cy.get("[data-cy=\"References-detail\"] h6").should("exist");
  cy.get("[data-cy=\"releaseDate\"]").should("exist");
  cy.get("[data-cy=\"training\"]").should("exist");
  cy.get("[data-cy=\"output.info\"]").should("exist");
});

Cypress.Commands.add("verifyReferenceTab", ({ user, formId, shortName }) => {
  cy.get("[data-cy=\"references-icon\"]").should("be.visible");
  cy.get("[data-cy=\"references-icon\"]").arrowClick();
  cy.get("[data-cy=\"generalInfo\"]>p").should("contain.text", "General Info");
  cy.get("[data-cy=\"generalInfo\"]>li>div>div").should("contain.text", shortName);
  cy.get("[data-cy=\"generalInfo\"]>li>div>p").should("contain.text", user.name);
  cy.get("[data-cy=\"generalInfo\"]>li>div>span").should("have.text", "Owner");
  if (formId) {
    cy.get("[data-cy=\"common.revision\"]").parent().should("contain.text", formId);
  }
});

Cypress.Commands.add("verifyAddRemoveReference", ({ formId }) => {
  cy.get("[data-cy=\"references-icon\"]").arrowClick().wait(500);
  cy.get("[data-cy=\"referenceTo\"]").arrowClick();
  cy.listLoadingElementShouldNotExist();
  cy.drSelectReferences(formId);
  cy.wait(1000);
  cy.drRemoveReferences({ reference: formId });
});

Cypress.Commands.add("verifyDescriptionToolbar", () => {
  cy.get("[data-cy=\"description\"]").first().arrowClick().wait(1000);
  cy.get("div[class^=\"rdw-editor-toolbar\"]").should("exist");
  cy.get("div[title=\"Bold\"]").should("exist");
  cy.get("div[title=\"Italic\"]").should("exist");
  cy.get("div[title=\"Underline\"]").should("exist");
  cy.get("div[title=\"Strikethrough\"]").should("exist");
  cy.get("div[title=\"Monospace\"]").should("exist");
  cy.get("div[title=\"Superscript\"]").should("exist");
  cy.get("div[title=\"Subscript\"]").should("exist");
  cy.get("[aria-label=\"rdw-color-picker\"]").should("exist");
  cy.get("div[title=\"Unordered\"]").should("exist");
  cy.get("div[title=\"Ordered\"]").should("exist");
  cy.get("div[title=\"Indent\"]").should("exist");
  cy.get("div[title=\"Outdent\"]").should("exist");
  cy.get("[aria-label=\"rdw-inline-control\"]").should("exist");
  cy.get("[aria-label=\"rdw-textalign-control\"]").should("exist");
  cy.get("[data-cy=\"description\"][aria-label=\"rdw-font-size-control\"]").should("not.exist");
  cy.get("[data-cy=\"description\"][aria-label=\"rdw-font-family-control\"]").should("not.exist");
  cy.get("[aria-label=\"rdw-inline-control\"]").should("exist");
  cy.get("[aria-label=\"rdw-color-picker\"]").should("exist");
  cy.get("[aria-label=\"rdw-textalign-control\"]").should("exist");
});

Cypress.Commands.add("verifyHeaderInfoContent", (HeaderInfo) => {
  if (HeaderInfo.status) {
    cy.drCheckDocumentStatus({ status: HeaderInfo.status });
  }
  cy.get("[data-cy=\"Header-listIcon\"]").should("exist");
  cy.get("[data-cy=\"Header-listTitle\"]").should("have.text", HeaderInfo.title);
  if (HeaderInfo.docId) {
    cy.get("[data-cy='HeaderInfo-docId']").should("contain.text", HeaderInfo.docId);
  }
  cy.get("[data-cy='HeaderInfo-Rev']").should("contain.text", HeaderInfo.revision);
});

Cypress.Commands.add("isTabActive", (tabInfo) => {
  cy.get(`[data-cy="tabCon-tabId.${tabInfo.name}"]`).should("have.attr", "aria-selected", "true");
  cy.get(`#sm-tabpanel-${tabInfo.index}`).should("be.visible");
});

Cypress.Commands.add("verifyTabs", (...tabs: string[]) => {
  tabs.forEach((tab) => {
    cy.get(`[data-cy="tabId.${tab}"]`).should("exist");
  });
});

Cypress.Commands.add("verifyReferencesTabAsActive", () => {
  cy.get(`[data-cy="references-icon"]`).should("be.visible");
  cy.get(`[data-cy="References-detail"]`).should("exist");
  cy.get(`[data-cy="generalInfo"]`).should("be.visible");
});

Cypress.Commands.add("openRevisionsTabAndVerifyCurrentRevision", (rev) => {
  cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
    cy.drClickRevisionsSidePanel();
    cy.get(`[data-cy="DocumentRevisionList-item"]`).eq(0).arrowClick();
    cy.recCheckRevisionStage({ stage: `Revision ${rev}` });
    cy.get(`[data-cy="HeaderInfo-Rev"]`).contains(`Rev ${rev}`);
  });
});

Cypress.Commands.add("verifyLastSavedExists", () => {
  // eslint-disable-next-line max-len
  const tmpRegex = new RegExp(`Last saved [0-9]+ minutes ago|Last saved a minute ago|Last saved a few minutes ago|Last saved a few seconds ago`, "gi");
  cy.get(`div[class*="MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-flex-end"]`)
    .contains(tmpRegex);
});

Cypress.Commands.add("verifyLastSavedNotExists", () => {
  // eslint-disable-next-line max-len
  const tmpRegex = new RegExp(`Last saved [0-9]+ minutes ago|Last saved a minute ago|Last saved a few minutes ago|Last saved a few seconds ago`, "gi");
  cy.get(`div[class*="MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-flex-end"]`)
    .should("not.contain", tmpRegex);
});

Cypress.Commands.add("verifyTitleIsHighlightedonHover", () => {
  cy.get("#field-name").trigger("mouseover");
  cy.get("#field-name>div>div").should("have.css", "background-color", "rgb(235, 237, 242)");
  cy.get("#field-name").trigger("mouseout");
});

Cypress.Commands.add("verifyDescriptionIsHighlightedonHover", () => {
  cy.get("[data-cy='description']").eq(0).trigger("mouseover");
  cy.get("[data-cy='description']>div").should("have.css", "background-color", "rgb(235, 237, 242)");
  cy.get("[data-cy='description']").eq(0).trigger("mouseout");
});

Cypress.Commands.add("verifyTitleNotHighlightedonHover", () => {
  cy.get("#field-name").trigger("mouseover");
  cy.get("#field-name>div>div").should("not.have.css", "background-color", "rgb(235, 237, 242)");
  cy.get("#field-name").trigger("mouseout");
});

Cypress.Commands.add("verifyDescriptionNotHighlightedonHover", () => {
  cy.get("[data-cy='BaseWithhtml-editor']").eq(0).trigger("mouseover");
  cy.get("[data-cy='BaseWithhtml-editor']>div").should("not.have.css", "background-color", "rgb(235, 237, 242)");
  cy.get("[data-cy='BaseWithhtml-editor']>div").eq(0).trigger("mouseout");
});

Cypress.Commands.add("verifyStatusbarBgcolor", (params: { bcolor: string}) => {
  cy.get("[data-cy='header-section']").should("have.css", "background-color", params.bcolor);
});
