import { CONFIG } from "../../config";
import { CyRoutes } from "../../routes";

/* eslint-disable @typescript-eslint/no-namespace */

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      usrNavigateToUserManagement(): Chainable;
      usrClickAddEmployee(): Chainable;
      usrGetInitials(params: {fullName: string}): Chainable;
      usrEnterEmail(params: {email: string}): Chainable;
      usrFilterByEmail(params: {email: string}): Chainable;
      usrEnterName(params: {name: string}): Chainable;
      usrClickEditUser(params: {name: string}): Chainable;
      usrClickSaveButton(): Chainable;
      usrClickCloseDialogButton(): Chainable;
      usrCheckIfUserIsCreated(params: {email: string}): Chainable;
      authLoginWithInvalidPassword(params: { email: string; password: string }): Chainable<Subject>;
      usrAddGroupNewUser(params: {group: string}): Chainable;
      usrVerifyUserLockedPageIsPresented(): Chainable;
      usrClickForgotPasswordLoginPage(): Chainable;
      usrNavigateToLoginPage(): Chainable;
      usrForgotPageEnterEmail(params: { email: string}): Chainable;
      usrClickResetMyPasswordButton(): Chainable;
    }
  }
}

Cypress.Commands.add("usrClickResetMyPasswordButton", () => {
  cy.get("#ForgotPasswordPage-submitNewPassword").arrowClick();
});

Cypress.Commands.add("usrForgotPageEnterEmail", (params: { email: string}) => {
  cy.get("input[name=email]").arrowType(params.email);
});

Cypress.Commands.add("usrNavigateToLoginPage", () => {
  cy.visit(`${CONFIG.FE_URL}/login`, { timeout: 50000 });
});

Cypress.Commands.add("usrClickForgotPasswordLoginPage", () => {
  cy.get("#LoginFormPresenter-forgotLink").arrowClick();
});

Cypress.Commands.add("usrVerifyUserLockedPageIsPresented", () => {
  cy.get(`div[data-cy="UserLocked-infoLink"]`).should("exist");
});

Cypress.Commands.add("usrNavigateToUserManagement", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.EmployeesGet, () => {
    cy.get("[data-cy=\"navigation.userManagement\"]").arrowClick();
  });
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("usrFilterByEmail", (params: {email: string }) => {
  cy.get(`th[aria-colindex="3"] input`).arrowType(params.email);
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("usrClickAddEmployee", () => {
  cy.get("#AddEmployeePresenter-openDialog").arrowClick();
});

Cypress.Commands.add("usrEnterEmail", (params: {email: string }) => {
  cy.get("[id=\"input-with-icon-textfield\"]").eq(1).arrowType(params.email);
});

Cypress.Commands.add("usrEnterName", (params: {name: string }) => {
  cy.get("[id=\"input-with-icon-textfield\"]").eq(0).arrowType(params.name);
});

Cypress.Commands.add("usrClickEditUser", (params: {name: string }) => {
  cy.get("tr.k-master-row").contains(params.name).parents("tr").find(`td[data-grid-col-index="5"]>span>button`).eq(0)
    .arrowClick();
});

Cypress.Commands.add("usrGetInitials", (params: {fullName: string }) => {
  function getInitials(fullName) {
    const nameArr = fullName.split("");
    const initials = nameArr.filter(function(char) {
      return /[A-Z]/.test(char);
    });
    return initials.join("").substring(0, 2);
  }

  cy.get("[data-cy=header-userInitials]").should("have.text", getInitials(params.fullName));
});

Cypress.Commands.add("usrClickSaveButton", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.EmployeesPost, CyRoutes.EmployeesGet], () => {
    cy.get("button>span>svg>path").eq(1).arrowClick();
  });
  cy.checkToastMessage({ exists: false });
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("usrClickCloseDialogButton", () => {
  cy.get("#AddEmployeeDialogPresenter-closeDialog").arrowClick();
});

Cypress.Commands.add("usrCheckIfUserIsCreated", (params: {email: string}) => {
  cy.get("#clearFilter").arrowClick();
  cy.landingPageLoadingElementShouldNotExist();
  cy.get(`th[aria-colindex="3"] input`).arrowType(params.email);
  cy.landingPageLoadingElementShouldNotExist();
  cy.get("tr.k-master-row").should("contain.text", params.email);
});

Cypress.Commands.add("usrAddGroupNewUser", (params: {group: string}) => {
  cy.get(`tr.k-master-row > td[data-grid-col-index="3"] input`).autocompleteSelect(params.group);
});

Cypress.Commands.add("authLoginWithInvalidPassword", (params: { email: string; password: string }) => {
  cy.visit(`${CONFIG.FE_URL}/login`, { timeout: 50000 });
  cy.wrapWithWaitOnApiCall(
    CyRoutes.Login, () => {
      cy.log(params.email);
      cy.get("[data-cy=\"LoginFormPresenter-email\"]").arrowType(params.email);
      cy.get("[data-cy=\"LoginFormPresenter-password\"]")
        .arrowType(params.password)
      ;
      cy.get("[data-cy=\"LoginFormPresenter-submit\"]").arrowClick();
    });
});
