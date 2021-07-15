/* eslint-disable max-classes-per-file */

import { NavigationItems } from "../../../utils/constants/navigationItems";
import { CyRoutes } from "../../routes";

/* eslint-disable @typescript-eslint/no-namespace */
export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      navigListExistsCheck(...list: NavigationItems[]): Chainable<Subject>;
      navigListNotExistsCheck(...list: NavigationItems[]): Chainable<Subject>;
      navigClickOnItem(params: { navigItem: NavigationItems }): Chainable<Subject>;
      navigToNestedItem(params: {navigItems: NavigationItems[]}): Chainable<Subject>;
      navigToDashboard(): Chainable<Subject>;
      navigToDocumentList(): Chainable<Subject>;
      navigToApprovalRequestList(): Chainable<Subject>;
      navigToPurchaseOrder(): Chainable<Subject>;
      navigToSuppliers(): Chainable<Subject>;
      navigToReceivableList(): Chainable<Subject>;
      navigToWorkOrders(): Chainable<Subject>;
      navigToRecords(): Chainable<Subject>;
      navigToDocTypeManagement(): Chainable<Subject>;
      navigToEquipment(): Chainable<Subject>;
      navigToParts(): Chainable<Subject>;
      navigToLots(): Chainable<Subject>;
      navigToDocumentListWithUnsavedChanges(params: { confirmPopup: boolean }): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("navigListExistsCheck", (...list: NavigationItems[]) => {
  list.forEach((item) => {
    cy.get("[data-cy=\"navigation." + item + "\"]").should("be.visible");
  });
});

Cypress.Commands.add("navigListNotExistsCheck", (...list: NavigationItems[]) => {
  list.forEach((item) => {
    cy.get("[data-cy=\"navigation." + item + "\"]").should("not.exist");
  });
});

Cypress.Commands.add("navigClickOnItem", (params: { navigItem: string }) => {
  cy.wait(1000).get("[data-cy=\"navigation." + params.navigItem + "\"]").click({ force: true });
});

Cypress.Commands.add("navigToDashboard", () => {
  cy.wrapWithWaitOnApiCall(
    CyRoutes.GetPendingActions,
    () => {
      cy.navigClickOnItem({ navigItem: NavigationItems.DASHBOARD });
    }).wait(1000);
});

Cypress.Commands.add("navigToDocTypeManagement", () => {
  cy.get("a[href=\"/document_type_management\"]").click().wait(1000);
});

Cypress.Commands.add("navigToRecords", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocRevDocTypeCategory, CyRoutes.GetDocRevStatusesCategory], () => {
    cy.navigToNestedItem({
      navigItems: [
        NavigationItems.DASHBOARD,
        NavigationItems.DOCUMENT_CONTROL,
        NavigationItems.RECORDS,
      ],
    });
  });
});

Cypress.Commands.add("navigToParts", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocRevStatusesCategory, CyRoutes.GetDocRevDocTypeCategory], () => {
    cy.navigToNestedItem({
      navigItems: [
        NavigationItems.DASHBOARD,
        NavigationItems.MANUFACTURING,
        NavigationItems.PARTS,
      ],
    });
  });
});

Cypress.Commands.add("navigToLots", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocRevStatusesCategory, CyRoutes.GetDocRevDocTypeCategory], () => {
    cy.navigToNestedItem({
      navigItems: [
        NavigationItems.DASHBOARD,
        NavigationItems.MANUFACTURING,
        NavigationItems.LOTS,
      ],
    });
  });
});

Cypress.Commands.add("navigToReceivableList", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocRevStatusesCategory, CyRoutes.GetDocRevDocTypeCategory], () => {
    cy.navigClickOnItem({ navigItem: NavigationItems.RECEIVING });
  });
});

Cypress.Commands.add("navigToEquipment", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocRevStatusesCategory, CyRoutes.GetDocRevDocTypeCategory], () => {
    cy.navigClickOnItem({ navigItem: NavigationItems.EQUIPMENT });
  });
});

Cypress.Commands.add("navigToDocumentList", () => {
  cy.wrapWithWaitOnApiCalls([
    CyRoutes.GetDocRevStatusesCategory,
    CyRoutes.GetDocumentTypes],
  () => {
    cy.navigToNestedItem({
      navigItems: [
        NavigationItems.DASHBOARD,
        NavigationItems.DOCUMENT_CONTROL,
        NavigationItems.DOCUMENT_LIST,
      ],
    });
  });
});

Cypress.Commands.add("navigToDocumentListWithUnsavedChanges", (params: { confirmPopup: boolean }) => {
  cy.navigToNestedItem({
    navigItems: [
      NavigationItems.DASHBOARD,
      NavigationItems.DOCUMENT_CONTROL,
      NavigationItems.DOCUMENT_LIST,
    ],
  });
  cy.on("window:confirm", (txt) => {
    expect(txt).to.equal("Are you sure you want to leave? You have unsaved changes.");
    return params.confirmPopup;
  });
});


Cypress.Commands.add("navigToApprovalRequestList", () => {
  cy.wrapWithWaitOnApiCalls([
    CyRoutes.GetChangeRequests,
    CyRoutes.GetDocTypeGroupOptions],
  () => {
    cy.navigToNestedItem({
      navigItems: [
        NavigationItems.DASHBOARD,
        NavigationItems.DOCUMENT_CONTROL,
        NavigationItems.APPROVAL_REQUEST,
      ],
    });
  });
});

Cypress.Commands.add("navigToWorkOrders", () => {
  cy.navigToNestedItem({
    navigItems: [
      NavigationItems.DASHBOARD,
      NavigationItems.MANUFACTURING,
    ],
  });
});

Cypress.Commands.add("navigToPurchaseOrder", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetDocRevStatusesCategory, () => {
    cy.navigClickOnItem({ navigItem: NavigationItems.PURCHASE_ORDERS });
  });
});

Cypress.Commands.add("navigToSuppliers", () => {
  cy.navigToNestedItem({
    navigItems: [
      NavigationItems.DASHBOARD,
      NavigationItems.SUPPLIER_MANAGEMENT,
      NavigationItems.SUPPLIER_LIST,
    ],
  });
});


Cypress.Commands.add("navigToNestedItem", (params: {navigItems: NavigationItems[]}) => {
  if (params.navigItems.length === 1) {
    cy.navigClickOnItem({ navigItem: params.navigItems[0] });
  } else {
    const [first, second, ...other] = params.navigItems;
    cy.get("body").then(($body) => {
      if ($body.find("[data-cy=\"navigation." + second + "\"]").length === 0) {

        cy.navigClickOnItem({ navigItem: first });
        cy.navigToNestedItem({ navigItems: [second, ...other] });
      } else {
        cy.navigToNestedItem({ navigItems: [second, ...other] });
      }
    });
  }
});
