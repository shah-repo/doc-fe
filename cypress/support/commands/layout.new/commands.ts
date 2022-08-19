/* eslint-disable @typescript-eslint/no-namespace */

import { CyRoutes } from "../../routes";

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      verifyTitleDescriptionFields(): Chainable;
      verifyDefaultFields(): Chainable;
      verifyDocumentHeaderDetails(): Chainable;
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
      verifyHistoryTab(history, groupOne, groupTwo): Chainable;
      verifyDescriptionToolbar(): Chainable;
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
  cy.get("[data-cy=\"references-icon\"]").arrowClick();
  cy.wait(1000);
  cy.get("[data-cy=\"referenceTo\"]").arrowClick();
  cy.drSelectReferences(formId);
  cy.drRemoveReferences({ reference: formId });
});

Cypress.Commands.add("verifyHistoryTab", (history, groupOne, groupTwo) => {

  it("Open history drawer and compare history values", () => {
    cy.drSelectHistoryTab();
  });

  history.forEach((element, groupIndex) => {
    it(`Check owner name for group ${groupIndex + 1}`, () => {
      cy.get(`[data-cy="change-key-${groupIndex}"]`).should("have.text", element.owner);
    });
    element.actions.forEach((action, index, identifier) => {
      it(`'${action.key}' as '${action.value}' exists`, () => {
        const typeOfChange = action.key;
        let contentOfChange = action.value;

        if (action.key === "New description" || action.key === "Description changed" ) {
          contentOfChange = "\n" + action.value + "\n";
        }

        if (typeOfChange === "s3Link added") {
          cy.get(`[data-cy^="change-key-${groupIndex}-${index}"]`).should("have.text", typeOfChange);
          cy.get("[data-cy='downloadS3link']").should("contain.text", contentOfChange);
        }
        else {
          if (action.key === "Access granted to group") {
            cy.get(`[data-cy^="change-value-${groupIndex}-${index}"]`).should(($identifier) =>  {
              expect($identifier.text()).to.be.oneOf([groupOne, groupTwo, "Everyone"]);
            });
          }
          else {
            cy.get(`[data-cy^="change-value-${groupIndex}-${index}"]`)
              .contains(action.key === "New owner" ? new RegExp("^" + action.value) : action.value)
              .parent()
              .parent()
              .within(() => {
                cy.get(`[data-cy^=change-key-${groupIndex}-${index}]`).should("have.text", typeOfChange);
                cy.get(`[data-cy^=change-value-${groupIndex}-${index}]`).should("contain.text", contentOfChange);
              });
          }
        }
      });
    });
  });
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
  cy.get("[title=\"Block Type\"]").should("not.exist");
  cy.get("[aria-label=\"rdw-font-size-control\"]").should("not.exist");
  cy.get("[aria-label=\"rdw-font-family-control\"]").should("not.exist");
  cy.get("[data-cy=\"description\"]").first().arrowClick().wait(1000);
  cy.get("[aria-label=\"rdw-inline-control\"]").should("exist");
  cy.get("[aria-label=\"rdw-color-picker\"]").should("exist");
  cy.get("[aria-label=\"rdw-textalign-control\"]").should("exist");
  cy.get("[title=\"Block Type\"]").should("not.exist");
  cy.get("[aria-label=\"rdw-font-size-control\"]").should("not.exist");
  cy.get("[aria-label=\"rdw-font-family-control\"]").should("not.exist");
});


