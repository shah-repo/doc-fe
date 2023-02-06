// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import faker from "faker";
import { CONFIG } from "../../support/config";
import { emailDateOffset, momentInPST } from "../../utils/constants/dateHandler";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompanyA;
let createdCompanyB;
let createdCompanyC;
let loginResponse;
let multipleCompanies;
let currentDate;
let dateAfterEmailShouldArrive;

const nameOfFirstUserToSignUp = faker.name.findName();
const emailOfFirstUserToSignUp =
`enlil.testmail+${faker.fake("{{address.zipCode}}{{internet.userName}}")}@gmail.com`.toLocaleLowerCase();


context("Sigle user multiple company test", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  context("[API]Prepare company", () => {
    it("[API]Creates company", (done: any) => {
      cy.authApiLogin({
        email: CONFIG.SUPERADMIN_EMAIL,
        password: CONFIG.SUPERADMIN_PASSWORD,
      }).then((response) => {
        loginResponse = response;

        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: USERS[1].email,
            importerEmail: IMPORTER_USER.email,
            users: [{ name: nameOfFirstUserToSignUp, email: emailOfFirstUserToSignUp }],
            documentTypes: [],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompanyA = response;
          done();
          dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });
  });

  context("Login with admin user", () => {
    it("Logs user in", () => {
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompanyA.name, multiple: multipleCompanies });
    });
  });

  context(`Provide groups permission to ${nameOfFirstUserToSignUp} for company A`, () => {
    it("Navigate to User management", () => {
      cy.grpNavigateToGroupManagement();
    });

    it("Provide group permission", () => {
      cy.grpFilterByName({ name: "Groups Management Unofficial" });
      cy.get("[class=\"k-grid-content-sticky\"]").find("button").arrowClick();
      cy.grpEditAddMembers(nameOfFirstUserToSignUp);
      cy.grpSaveGroupPatch();
      cy.grpFilterByName({ name: "User Management" });
      cy.get("[class=\"k-grid-content-sticky\"]").find("button").arrowClick();
      cy.grpEditAddMembers(nameOfFirstUserToSignUp);
      cy.grpSaveGroupPatch();
      cy.authLogout();
    });
  });

  context("Activate first user", () => {
    it("Verify activation email", () => {
      cy.imapGetActivationLink({ userEmail: emailOfFirstUserToSignUp, date: dateAfterEmailShouldArrive });
      cy.authEnterSignUpPassword();
      cy.authEnterSignUpConfirmPassword();
      cy.authClickSignIn();
      cy.authLogout();
    });
  });

  context("[API]Create company B & C", () => {
    it("[API]Creates company B", (done: any) => {
      cy.authApiLogin({
        email: CONFIG.SUPERADMIN_EMAIL,
        password: CONFIG.SUPERADMIN_PASSWORD,
      }).then((response) => {
        loginResponse = response;

        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: USERS[1].email,
            importerEmail: IMPORTER_USER.email,
            users: [{ name: nameOfFirstUserToSignUp, email: emailOfFirstUserToSignUp }],
            documentTypes: [],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompanyB = response;
          done();
        });
      });
    });

    it("[API]Creates company C", (done: any) => {
      cy.cmpCreateCompany({
        specFilePath: __filename,
        payload: {
          companyAdminEmail: USERS[1].email,
          importerEmail: IMPORTER_USER.email,
          users: [{ name: nameOfFirstUserToSignUp, email: emailOfFirstUserToSignUp }],
          documentTypes: [],
        }, sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdCompanyC = response;
        done();
      });
    });
  });

  context("Login in admin user", () => {
    it("Logs user in", () => {
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompanyA.name, multiple: multipleCompanies });
    });
  });

  context(`Provide groups permission to ${nameOfFirstUserToSignUp} for company B`, () => {
    it("Switch company", () => {
      cy.usrClickUserMenuButton();
      cy.usrClickSwitchCompanyButton();
      cy.cmpSelectCompany({ name: createdCompanyB.name, multiple: multipleCompanies });
    });

    it("Navigate to Group management", () => {
      cy.grpNavigateToGroupManagement();
    });

    it("Provide groups permission", () => {
      cy.grpFilterByName({ name: "Groups Management Unofficial" });
      cy.get("[class=\"k-grid-content-sticky\"]").find("button").arrowClick();
      cy.grpEditAddMembers(nameOfFirstUserToSignUp);
      cy.grpSaveGroupPatch();
      cy.grpFilterByName({ name: "User Management" });
      cy.get("[class=\"k-grid-content-sticky\"]").find("button").arrowClick();
      cy.grpEditAddMembers(nameOfFirstUserToSignUp);
      cy.grpSaveGroupPatch();
    });
  });

  context(`Provide groups permission to ${nameOfFirstUserToSignUp} for company C`, () => {
    it("Switch company", () => {
      cy.usrClickUserMenuButton();
      cy.usrClickSwitchCompanyButton();
      cy.cmpSelectCompany({ name: createdCompanyC.name, multiple: multipleCompanies });
    });

    it("Navigate to Group management", () => {
      cy.grpNavigateToGroupManagement();
    });

    it("Provide groups permission", () => {
      cy.grpFilterByName({ name: "Groups Management Unofficial" });
      cy.get("[class=\"k-grid-content-sticky\"]").find("button").arrowClick();
      cy.grpEditAddMembers(nameOfFirstUserToSignUp);
      cy.grpSaveGroupPatch();
      cy.grpFilterByName({ name: "User Management" });
      cy.get("[class=\"k-grid-content-sticky\"]").find("button").arrowClick();
      cy.grpEditAddMembers(nameOfFirstUserToSignUp);
      cy.grpSaveGroupPatch();
      cy.authLogout();
    });
  });

  context(`Login to 'Company A' with user ${nameOfFirstUserToSignUp}`, () => {
    it("Logs user in", () => {
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.authLogin({
        email: emailOfFirstUserToSignUp,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompanyA.name, multiple: multipleCompanies });
    });
  });

  context("Navigates to User management", () => {
    it("Navigates to User management", () => {
      cy.usrNavigateToUserManagement();
    });
  });

  context("Check history button is visible", () => {
    it("Check history button is visible", () => {
      cy.usrVerifyHistoryButton();
    });
  });

  context("Open My Profile and change the user's name", () => {
    it("Open 'My Profile' and change the user's name", () => {
      cy.usrClickUserMenuButton();
      cy.usrClickMyProfile();
      cy.usrMyProfileClickEdit();
      cy.usrMyProfileClickNameEdit({ name: `Dr. ${nameOfFirstUserToSignUp}` });
      cy.usrClickUpdateProfile();
      cy.usrClickCloseDialogButton();
      currentDate = momentInPST().format("MMM D, YYYY hh:m");
    });
  });

  context(`Check if the change name history is created for ${nameOfFirstUserToSignUp}`, () => {
    SystemRequirement("REQ-2640", "REQ-5240");
    it("Open history panel", () => {
      cy.usrHistoryClickOpenButton();
    });

    it("Verify editor of user", () => {
      cy.usrHistoryVerifyCreator({ name: nameOfFirstUserToSignUp });
    });

    it("Verify user edited datetime", () => {
      cy.usrHistoryVerifyCurrentDate({ dateTime: currentDate });
    });

    it("Verify user's updated name", () => {
      cy.usrHistoryVerifyUserNameUpdated({
        oldUserName: nameOfFirstUserToSignUp,
        newUserName: `Dr. ${nameOfFirstUserToSignUp}`,
      });
    });

    it("Close history panel", () => {
      cy.usrHistoryClickCloseButton();
    });
  });

  context("Open My Profile and change the user's name and without saving click close ", () => {
    it("Open 'My Profile'", () => {
      cy.usrClickUserMenuButton();
      cy.usrClickMyProfile();
      cy.usrMyProfileClickEdit();
      cy.usrMyProfileClickNameEdit({ name: nameOfFirstUserToSignUp });
      cy.usrClickCloseDialogButton();
    });
  });

  context(`Check if the change name history is not created for ${nameOfFirstUserToSignUp}`, () => {
    it("Open history panel", () => {
      cy.usrHistoryClickOpenButton();
    });

    it("verify no new record is added in history panel", () => {
      cy.usrHistoryVerifyRecordsCount({ records: 4 });
    });

    it("Close history panel", () => {
      cy.usrHistoryClickCloseButton();
    });
  });

  context("Switch to 'Company B'", () => {
    it("Switch company", () => {
      cy.usrClickUserMenuButton();
      cy.usrClickSwitchCompanyButton();
      cy.cmpSelectCompany({ name: createdCompanyB.name, multiple: multipleCompanies });
    });
  });

  context("Navigates to User management", () => {
    it("Navigates to User management", () => {
      cy.usrNavigateToUserManagement();
    });
  });

  context(`Check if the change name history is visible for ${nameOfFirstUserToSignUp} in company B`, () => {
    it("Open history panel", () => {
      cy.usrHistoryClickOpenButton();
    });

    it("Verify editor of user", () => {
      cy.usrHistoryVerifyCreator({ name: "Server Automation" });
    });

    it("Verify user edited datetime", () => {
      cy.usrHistoryVerifyCurrentDate({ dateTime: currentDate });
    });

    it("Verify user's updated name", () => {
      cy.usrHistoryVerifyUserNameUpdated({
        oldUserName: nameOfFirstUserToSignUp,
        newUserName: `Dr. ${nameOfFirstUserToSignUp}`,
      });
    });

    it("Close history panel", () => {
      cy.usrHistoryClickCloseButton();
    });
  });

  context("Switch to 'Company C'", () => {
    it("Switch company C", () => {
      cy.usrClickUserMenuButton();
      cy.usrClickSwitchCompanyButton();
      cy.cmpSelectCompany({ name: createdCompanyC.name, multiple: multipleCompanies });
    });
  });

  context("Navigates to User management", () => {
    it("Navigates to User management", () => {
      cy.usrNavigateToUserManagement();
    });
  });

  context(`Check if the change name history is visible for ${nameOfFirstUserToSignUp} in company C`, () => {
    it("Open history panel", () => {
      cy.usrHistoryClickOpenButton();
    });

    it("Verify editor of user", () => {
      cy.usrHistoryVerifyCreator({ name: "Server Automation" });
    });

    it("Verify user edited datetime", () => {
      cy.usrHistoryVerifyCurrentDate({ dateTime: currentDate });
    });

    it("Verify user's updated name", () => {
      cy.usrHistoryVerifyUserNameUpdated({
        oldUserName: nameOfFirstUserToSignUp,
        newUserName: `Dr. ${nameOfFirstUserToSignUp}`,
      });
    });

    it("Close history panel", () => {
      cy.usrHistoryClickCloseButton();
    });
  });

  context(`Change avatar for user ${nameOfFirstUserToSignUp}`, () => {
    it("Change avatar", () => {
      cy.usrClickUserMenuButton();
      cy.usrClickMyProfile();
      cy.usrMyProfileClickEdit();
      cy.usrChangeAvatar({ fileName: "32.png" });
      cy.usrClickUpdateProfile();
      cy.wait(5000);
      cy.usrClickCloseDialogButton();
      currentDate = momentInPST().format("MMM D, YYYY hh:m");
    });
  });

  context(`Check if the change avatar history is created for ${nameOfFirstUserToSignUp}`, () => {
    SystemRequirement("REQ-2640", "REQ-5240");
    it("Open history panel", () => {
      cy.usrHistoryClickOpenButton();
    });

    it("Verify editor of user", () => {
      cy.usrHistoryVerifyCreator({ name: `Dr. ${nameOfFirstUserToSignUp}` });
    });

    it("Verify user edited datetime", () => {
      cy.usrHistoryVerifyCurrentDate({ dateTime: currentDate });
    });

    it("Verify updated avatar for user", () => {
      cy.usrHistoryVerifyUpdatedAvatarFor({ name: `Dr. ${nameOfFirstUserToSignUp}` });
    });

    it("Close history panel", () => {
      cy.usrHistoryClickCloseButton();
    });
  });

  context(`Check if the change avatar history is visible for ${nameOfFirstUserToSignUp} in company A`, () => {
    it("Switch company A", () => {
      cy.usrClickUserMenuButton();
      cy.usrClickSwitchCompanyButton();
      cy.cmpSelectCompany({ name: createdCompanyA.name, multiple: multipleCompanies });
    });

    it("Navigates to User management", () => {
      cy.usrNavigateToUserManagement();
    });

    context("Check history is visible", () => {
      it("Open history panel", () => {
        cy.usrHistoryClickOpenButton();
      });

      it("Verify editor of user", () => {
        cy.usrHistoryVerifyCreator({ name: "Server Automation" });
      });

      it("Verify user edited datetime", () => {
        cy.usrHistoryVerifyCurrentDate({ dateTime: currentDate });
      });

      it("Verify updated avatar for user", () => {
        cy.usrHistoryVerifyUpdatedAvatarFor({ name: `Dr. ${nameOfFirstUserToSignUp}` });
      });

      it("Close history panel", () => {
        cy.usrHistoryClickCloseButton();
      });
    });
  });

  context(`Check if the change avatar history is visible for ${nameOfFirstUserToSignUp} in company B`, () => {
    it("Switch company B", () => {
      cy.usrClickUserMenuButton();
      cy.usrClickSwitchCompanyButton();
      cy.cmpSelectCompany({ name: createdCompanyB.name, multiple: multipleCompanies });
    });

    it("Navigates to User management", () => {
      cy.usrNavigateToUserManagement();
    });

    context("Check history is visible", () => {
      it("Open history panel", () => {
        cy.usrHistoryClickOpenButton();
      });

      it("Verify editor of user", () => {
        cy.usrHistoryVerifyCreator({ name: "Server Automation" });
      });

      it("Verify user edited datetime", () => {
        cy.usrHistoryVerifyCurrentDate({ dateTime: currentDate });
      });

      it("Verify updated avatar for user", () => {
        cy.usrHistoryVerifyUpdatedAvatarFor({ name: `Dr. ${nameOfFirstUserToSignUp}` });
      });

      it("Close history panel", () => {
        cy.usrHistoryClickCloseButton();
      });
    });
  });
});
