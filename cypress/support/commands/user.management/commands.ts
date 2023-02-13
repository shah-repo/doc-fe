import { CONFIG } from "../../config";
import { CyRoutes } from "../../routes";

/* eslint-disable @typescript-eslint/no-namespace */

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      usrGetUserByName(params: {
        sessionId: string;
        employeeId: string;
        userName: string;}): Chainable<Subject>;
      usrPatchUser(params: {
        // userId: string;
        payload: any;
        employeeId: string;
        sessionId: string;}): Chainable<Subject>;
      usrNavigateToUserManagement(): Chainable;
      usrClickAddEmployee(): Chainable;
      usrGetInitials(params: {fullName: string}): Chainable;
      usrEnterEmail(params: {email: string}): Chainable;
      usrFilterByEmail(params: {email: string}): Chainable;
      usrEnterName(params: {name: string}): Chainable;
      usrClickEditUser(params: {name: string}): Chainable;
      usrClickSaveButton(): Chainable;
      usrClickPlusSaveButton(): Chainable;
      usrClickCancelButton(): Chainable;
      usrClickStatusButton(): Chainable;
      usrClickCloseDialogButton(): Chainable;
      usrCheckIfUserIsCreated(params: {email: string}): Chainable;
      authLoginWithInvalidPassword(params: { email: string; password: string }): Chainable<Subject>;
      usrAddGroupNewUser(params: {group: string}): Chainable;
      usrVerifyUserLockedPageIsPresented(): Chainable;
      usrClickForgotPasswordLoginPage(): Chainable;
      usrNavigateToLoginPage(): Chainable;
      usrForgotPageEnterEmail(params: { email: string}): Chainable;
      usrClickResetMyPasswordButton(): Chainable;
      usrClickUserMenuButton(): Chainable;
      usrClickMyProfile(): Chainable;
      usrMyProfileClickEdit(): Chainable;
      usrMyProfileClickNameEdit(params: {name: string}): Chainable;
      usrClickUpdateProfile(): Chainable;
      usrClickSwitchCompanyButton(): Chainable;
      usrChangeAvatar(params: {fileName: string }): Chainable<Subject>;
      usrVerifyHistoryButton(): Chainable;
      usrHistoryClickOpenButton(): Chainable;
      usrHistoryVerifyCreator(params: {name: string}): Chainable;
      usrHistoryVerifyCurrentDate(params: { dateTime: string }): Chainable;
      usrHistoryVerifyUpdatedAvatarFor(params: {name: string}): Chainable;
      usrHistoryVerifyAddedNewUser(params: {name: string}): Chainable;
      usrHistoryVerifyAddedUserEmail(params: {email: string}): Chainable;
      usrHistoryAddedToGroups(...list: string[]): Chainable<Subject>;
      usrHistoryAddedMemberToGroup(...list: string[]): Chainable<Subject>;
      usrHistoryVerifyAddedToGroup(params: {groupName: string}): Chainable;
      usrHistoryVerifyUpdatedStatus(params: {name: string; status: string}): Chainable;
      usrHistoryVerifyUserNameUpdated(params: {oldUserName: string; newUserName: string}): Chainable;
      usrHistoryRemovedMemberFromGroup(...list: string[]): Chainable<Subject>;
      usrHistoryVerifyRemovedFromGroup(params: {groupName: string}): Chainable;
      usrHistoryVerifyResentSignupEmail(): Chainable;
      usrHistoryVerifyResetPassword(): Chainable;
      usrHistoryVerifyForUser(params: {name: string}): Chainable;
      usrHistoryVerifyDeactivatedUser(params: {name: string}): Chainable;
      usrHistoryVerifyReactivatedUser(params: {name: string}): Chainable;
      usrHistoryVerifyRecordsCount(params: {records: number}): Chainable;
      usrHistoryClickCloseButton(): Chainable;
    }
  }
}

Cypress.Commands.add("usrGetUserByName", (params: {sessionId: string; employeeId: string;  userName: string}) => {
  cy.request({
    method: "GET",
    url: `${CONFIG.BE_URL}/api/v1/employees`,
    qs: {
      userName: { user: params.userName },
    },
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
  }).then((response) => response);
});

Cypress.Commands.add("usrPatchUser", (params: {
  // userId: string;
  employeeId: string;
  sessionId: string;
  payload: any; }) =>
{
  cy.request({
    method: "PATCH",
    url: `${CONFIG.BE_URL}/api/v1/auth/new_user_set_password`,
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
    body: params.payload,
  }).then((response) => response ? response.body : {})
    .then((response) => JSON.stringify(response));
});

Cypress.Commands.add("usrClickResetMyPasswordButton", () => {
  cy.get("#ForgotPasswordPage-submitNewPassword").arrowClick();
});

Cypress.Commands.add("usrForgotPageEnterEmail", (params: { email: string}) => {
  cy.get("input[name=email]", { timeout: 10000 }).arrowType(params.email);
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
  cy.get(`th[aria-colindex="3"] .k-filtercell>input`).arrowType(params.email);
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("usrClickAddEmployee", () => {
  cy.get("#AddEmployeePresenter-openDialog").arrowClick();
});

Cypress.Commands.add("usrEnterEmail", (params: {email: string }) => {
  cy.get("[id=\"input-with-icon-textfield\"]").eq(1).arrowType(params.email, { force: true });
});

Cypress.Commands.add("usrEnterName", (params: {name: string }) => {
  cy.get("[id=\"input-with-icon-textfield\"]").eq(0).arrowType(params.name, { force: true });
});

Cypress.Commands.add("usrClickEditUser", (params: {name: string }) => {
  cy.get("tr.k-master-row").contains(params.name).parents("tr")
    .find(`td[data-grid-col-index="5"]>span>button>span>svg`)
    .eq(0).arrowClick();
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
  cy.get("td>span>button>span>svg>path").eq(0).arrowClick({ force: true });
  cy.checkToastMessage({ exists: false });
  cy.landingPageLoadingElementShouldAppear();
});


Cypress.Commands.add("usrClickPlusSaveButton", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.EmployeesPost, CyRoutes.EmployeesGet], () => {
    cy.get("td>span>button>span>svg>path").eq(0).arrowClick({ force: true });
  });
  cy.checkToastMessage({ exists: false });
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("usrClickCancelButton", () => {
  cy.get(`td[role="gridcell"] button`).eq(1).arrowClick();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("usrClickStatusButton", () => {
  cy.get("#DialogContent-activeStatusButton").arrowClick();
});

Cypress.Commands.add("usrClickCloseDialogButton", () => {
  cy.get("#DialogContent-close").arrowClick();
});

Cypress.Commands.add("usrCheckIfUserIsCreated", (params: {email: string}) => {
  cy.get("#clearFilter").arrowClick();
  cy.landingPageLoadingElementShouldNotExist();
  cy.get(`th[aria-colindex="3"] .k-filtercell>input`).arrowType(params.email);
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

Cypress.Commands.add("usrClickUserMenuButton", () => {
  cy.get("[data-cy=\"UserMenuButton\"]").arrowClick();
});

Cypress.Commands.add("usrClickMyProfile", () => {
  cy.contains("My profile").arrowClick();
});

Cypress.Commands.add("usrMyProfileClickEdit", () => {
  cy.get("#DialogContent-showEdit").arrowClick();
});

Cypress.Commands.add("usrMyProfileClickNameEdit", (params: { name: string }) => {
  cy.get("#DialogTitle-nameEdit").clear().arrowType(params.name);
});

Cypress.Commands.add("usrClickUpdateProfile", () => {
  cy.get("#DialogContent-updateProfile").arrowClick();
});

Cypress.Commands.add("usrClickSwitchCompanyButton", () => {
  cy.get("#switchCompanyButton").arrowClick();
});

Cypress.Commands.add("usrChangeAvatar", (params: {fileName: string }) => {
  cy.fixture(params.fileName).then((fileContent) => {
    cy.get("[id^=\"AvatarUploadContainer-avatar\"]").attachFile({
      fileContent: fileContent.toString(),
      fileName: params.fileName,
      mimeType: "*",
      filePath: `fixtures/${params.fileName}`,
    });
  });
});

Cypress.Commands.add("usrVerifyHistoryButton", () => {
  cy.get("[data-cy=\"um-open-history-panel\"]").should("exist");
});

Cypress.Commands.add("usrHistoryClickOpenButton", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetUsersAudit, () => {
    cy.get("[data-cy=\"um-open-history-panel\"]").arrowClick();
    cy.listLoadingElementShouldNotExist();
  });
});

Cypress.Commands.add("usrHistoryVerifyCreator", (params: { name: string }) => {
  cy.get("[class=\"MuiListItemText-root MuiListItemText-multiline\"]").eq(1).contains(params.name).should("exist");
});

Cypress.Commands.add("usrHistoryVerifyCurrentDate", (params: { dateTime: string }) => {
  cy.get("[class=\"MuiListItemText-root MuiListItemText-multiline\"]>span").eq(0).contains(params.dateTime)
    .should("exist");
});

Cypress.Commands.add("usrHistoryVerifyUpdatedAvatarFor", (params: { name: string }) => {
  cy.contains("Updated Avatar for ").eq(0).next().should("have.text", params.name);
});

Cypress.Commands.add("usrHistoryVerifyAddedNewUser", (params: { name: string }) => {
  cy.contains("Added a New User").eq(0).parent().next()
    .should("have.text", params.name);
});

Cypress.Commands.add("usrHistoryVerifyAddedUserEmail", (params: { email: string }) => {
  cy.contains("Added User Email").eq(0).next().should("have.text", params.email);
});

Cypress.Commands.add("usrHistoryAddedToGroups", (...list: string[]) => {
  list.forEach((item) => {
    cy.contains("Added to Groups").eq(0).parent().next().contains(item).should("exist");
  });
});

Cypress.Commands.add("usrHistoryAddedMemberToGroup", (...list: string[]) => {
  list.forEach((item) => {
    cy.contains("Added").eq(0).contains(item).should("exist");
  });
});

Cypress.Commands.add("usrHistoryVerifyAddedToGroup", (params: { groupName: string }) => {
  cy.contains(" to group ").eq(0).parent().next().next().contains(params.groupName).should("exist");
});

Cypress.Commands.add("usrHistoryVerifyUpdatedStatus", (params: { name: string; status: string }) => {
  cy.contains(`Updated status for ${params.name}`).eq(0).parent().next().contains(params.status)
    .should("exist");
});

Cypress.Commands.add("usrHistoryVerifyUserNameUpdated", (params: { oldUserName: string; newUserName: string }) => {
  cy.contains("Username updated").eq(0).parent().next().should("contain.text", params.oldUserName);
  cy.contains(params.oldUserName + "to").eq(0).should("contain.text", params.newUserName);
});

Cypress.Commands.add("usrHistoryRemovedMemberFromGroup", (...list: string[]) => {
  list.forEach((item) => {
    cy.contains("Removed").eq(0).contains(item).should("exist");
  });
});

Cypress.Commands.add("usrHistoryVerifyRemovedFromGroup", (params: { groupName: string }) => {
  cy.contains(" from group ").eq(0).parent().contains(params.groupName).should("exist");
});

Cypress.Commands.add("usrHistoryVerifyResentSignupEmail", () => {
  cy.contains("Resent").eq(0).parent().next().contains("Resend signed up email").should("exist");
});

Cypress.Commands.add("usrHistoryVerifyResetPassword", () => {
  cy.contains("Password Support").eq(0).parent().next().contains("Reset Password").should("exist");
});

Cypress.Commands.add("usrHistoryVerifyForUser", (params: { name: string }) => {
  cy.contains("For user").eq(0).parent().contains(params.name).should("exist");
});

Cypress.Commands.add("usrHistoryVerifyDeactivatedUser", (params: { name: string }) => {
  cy.contains("Deactivated User").eq(0).parent().next().contains(params.name).should("exist");
});

Cypress.Commands.add("usrHistoryVerifyReactivatedUser", (params: { name: string }) => {
  cy.contains("Reactivated User").eq(0).parent().next().contains(params.name).should("exist");
});

Cypress.Commands.add("usrHistoryVerifyRecordsCount", (params: { records: number }) => {
  cy.listLoadingElementShouldNotExist();
  cy.get("[data-cy='external-container']").last().next()
    .find("[data-cy=\"header-userInitials\"]").should("have.length", params.records);
});

Cypress.Commands.add("usrHistoryClickCloseButton", () => {
  cy.get("[data-cy=\"um-close-history-panel\"]").arrowClick();
});

