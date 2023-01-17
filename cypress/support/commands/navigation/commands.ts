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
      navigToDashboardWithoutApi(): Chainable<Subject>;
      navigToDocumentTypeManagement(): Chainable<Subject>;
      navigToPageDetailsManagement(): Chainable<Subject>;
      navigToDocumentList(): Chainable<Subject>;
      navigToApprovalRequestList(): Chainable<Subject>;
      navigToApprovalRequestListWithoutApi(): Chainable<Subject>;
      navigToPurchaseOrder(): Chainable<Subject>;
      navigToPurchaseOrderWithoutApi(): Chainable<Subject>;
      navigToSuppliers(): Chainable<Subject>;
      navigToSuppliersWithoutApi(): Chainable<Subject>;
      navigToReceivableList(): Chainable<Subject>;
      navigToWorkOrders(): Chainable<Subject>;
      navigToRecords(): Chainable<Subject>;
      navigToDocTypeManagement(): Chainable<Subject>;
      navigToEquipment(): Chainable<Subject>;
      navigToEquipmentList(): Chainable<Subject>;
      navigToParts(): Chainable<Subject>;
      navigToLots(): Chainable<Subject>;
      navigToLHR(): Chainable<Subject>;
      navigToLHRWithoutAPI(): Chainable<Subject>;
      navigToEB(): Chainable<Subject>;
      navigToDocumentListWithUnsavedChanges(params: { confirmPopup: boolean }): Chainable<Subject>;
      navigToTrainingRecords(): Chainable<Subject>;
      navigToTrainingCurriculums(): Chainable<Subject>;
      navigToAsyncTasks(): Chainable<Subject>;
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
  cy.get("[data-cy=\"navigation." + params.navigItem + "\"]").arrowClick({ force: true });
});

Cypress.Commands.add("navigToDashboard", () => {
  cy.wrapWithWaitOnApiCall(
    CyRoutes.PostDashboardFeedSearch,
    () => {
      cy.navigClickOnItem({ navigItem: NavigationItems.DASHBOARD });
    });

  cy.progressBarShouldNotExist();
});

Cypress.Commands.add("navigToDashboardWithoutApi", () => {
  cy.navigClickOnItem({ navigItem: NavigationItems.DASHBOARD });
  cy.progressBarShouldNotExist();
});

Cypress.Commands.add("navigToDocTypeManagement", () => {
  cy.get("a[href=\"/document_type_management\"]").arrowClick();
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("navigToRecords", () => {
  cy.navigToNestedItem({
    navigItems: [
      NavigationItems.DASHBOARD,
      NavigationItems.DOCUMENT_CONTROL,
      NavigationItems.RECORDS,
    ],
  });

  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("navigToParts", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocRevStatusesCategory], () => {
    cy.navigToNestedItem({
      navigItems: [
        NavigationItems.DASHBOARD,
        NavigationItems.MANUFACTURING,
        NavigationItems.PARTS,
      ],
    });
  });
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("navigToLots", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocRevStatusesCategory], () => {
    cy.navigToNestedItem({
      navigItems: [
        NavigationItems.DASHBOARD,
        NavigationItems.MANUFACTURING,
        NavigationItems.LOTS,
      ],
    });
  });
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("navigToLHR", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocRevStatusesCategory], () => {
    cy.navigToNestedItem({
      navigItems: [
        NavigationItems.DASHBOARD,
        NavigationItems.MANUFACTURING,
        NavigationItems.LHR,
      ],
    });
  });
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("navigToLHRWithoutAPI", () => {
  cy.navigToNestedItem({
    navigItems: [
      NavigationItems.DASHBOARD,
      NavigationItems.MANUFACTURING,
      NavigationItems.LHR,
    ],
  });
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("navigToEB", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocRevStatusesCategory], () => {
    cy.navigToNestedItem({
      navigItems: [
        NavigationItems.DASHBOARD,
        NavigationItems.MANUFACTURING,
        NavigationItems.EB,
      ],
    });
  });
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("navigToReceivableList", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocRevStatusesCategory], () => {
    cy.navigClickOnItem({ navigItem: NavigationItems.RECEIVING });
  });
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("navigToEquipment", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocRevStatusesCategory], () => {
    cy.navigClickOnItem({ navigItem: NavigationItems.EQUIPMENT });
  });
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("navigToEquipmentList", () => {
  cy.wrapWithWaitOnApiCalls([
    CyRoutes.GetDocRevStatusesCategory],
  () => {
    cy.navigToNestedItem({
      navigItems: [
        NavigationItems.DASHBOARD,
        NavigationItems.EQUIPMENT,
        NavigationItems.EQUIPMENT_LIST,
      ],
    });
  });
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("navigToDocumentList", () => {
  cy.wrapWithWaitOnApiCalls([
    CyRoutes.GetDocRevStatusesCategory],
  () => {
    cy.navigToNestedItem({
      navigItems: [
        NavigationItems.DASHBOARD,
        NavigationItems.DOCUMENT_CONTROL,
        NavigationItems.DOCUMENT_LIST,
      ],
    });
  });
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("navigToDocumentTypeManagement", () => {
  cy.navigToNestedItem({
    navigItems: [
      NavigationItems.DASHBOARD,
      NavigationItems.DOCUMENT_TYPE_MANAGEMENT,
    ],
  });
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("navigToPageDetailsManagement", () => {
  cy.navigToNestedItem({
    navigItems: [
      NavigationItems.DASHBOARD,
      NavigationItems.PAGE_DETAILS_MANAGEMENT,
    ],
  });
  cy.landingPageLoadingElementShouldNotExist();
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
  cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocTypeGroupOptions], () => {
    cy.navigToNestedItem({
      navigItems: [
        NavigationItems.DASHBOARD,
        NavigationItems.DOCUMENT_CONTROL,
        NavigationItems.APPROVAL_REQUEST,
      ],
    });
  });
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("navigToApprovalRequestListWithoutApi", () => {
  cy.navigToNestedItem({
    navigItems: [
      NavigationItems.DASHBOARD,
      NavigationItems.DOCUMENT_CONTROL,
      NavigationItems.APPROVAL_REQUEST,
    ],
  });
  cy.landingPageLoadingElementShouldNotExist();
});


Cypress.Commands.add("navigToWorkOrders", () => {
  cy.navigToNestedItem({
    navigItems: [
      NavigationItems.DASHBOARD,
      NavigationItems.MANUFACTURING,
    ],
  });
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("navigToPurchaseOrder", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetDocRevStatusesCategory, () => {
    cy.navigClickOnItem({ navigItem: NavigationItems.PURCHASE_ORDERS });
  });
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("navigToPurchaseOrderWithoutApi", () => {
  cy.navigClickOnItem({ navigItem: NavigationItems.PURCHASE_ORDERS });
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("navigToSuppliers", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocRevStatusesCategory], () => {
    cy.navigToNestedItem({
      navigItems: [
        NavigationItems.DASHBOARD,
        NavigationItems.SUPPLIER_MANAGEMENT,
        NavigationItems.SUPPLIER_LIST,
      ],
    });
  });
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("navigToSuppliersWithoutApi", () => {
  cy.navigToNestedItem({
    navigItems: [
      NavigationItems.DASHBOARD,
      NavigationItems.SUPPLIER_MANAGEMENT,
      NavigationItems.SUPPLIER_LIST,
    ],
  });
  cy.landingPageLoadingElementShouldNotExist();
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

Cypress.Commands.add("navigToTrainingRecords", () => {
  cy.navigToNestedItem({
    navigItems: [
      NavigationItems.DASHBOARD,
      NavigationItems.TRAINING,
      NavigationItems.TRAINING_RECORDS,
    ],
  });
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("navigToTrainingCurriculums", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocRevStatusesCategory], () => {
    cy.navigToNestedItem({
      navigItems: [
        NavigationItems.DASHBOARD,
        NavigationItems.TRAINING,
        NavigationItems.TRAINING_CURRICULUMS,
      ],
    });
  });
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("navigToAsyncTasks", () => {
  cy.navigToNestedItem({
    navigItems: [
      NavigationItems.DASHBOARD,
      NavigationItems.ASYNC_TASKS,
    ],
  });
  cy.landingPageLoadingElementShouldNotExist();
});
