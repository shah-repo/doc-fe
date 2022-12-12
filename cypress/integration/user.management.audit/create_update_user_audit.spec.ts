// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import faker from "faker";
import { CONFIG } from "../../support/config";
import { emailDateOffset, momentInPST } from "../../utils/constants/dateHandler";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let companyAdmin;
let loginResponse;
let currentDate;
let dateAfterEmailShouldArrive;

const nameOfFirstUserToSignUp = faker.name.findName();
const emailOfFirstUserToSignUp =
`enlil.testmail+${faker.fake("{{address.zipCode}}{{internet.userName}}")}@gmail.com`.toLocaleLowerCase();
const nameOfSecondUserToSignUp = faker.name.findName();
const emailOfSecondUserToSignUp =
`enlil.testmail+${faker.fake("{{address.zipCode}}{{internet.userName}}")}@gmail.com`.toLocaleLowerCase();
const nameOfThirdUserToSignUp = faker.name.findName();
const emailOfThirdUserToSignUp =
`enlil.testmail+${faker.fake("{{address.zipCode}}{{internet.userName}}")}@gmail.com`.toLocaleLowerCase();

context("User Creation Flow", () => {
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
            users: [USERS[4], { name: nameOfThirdUserToSignUp, email: emailOfThirdUserToSignUp }],
            documentTypes: [],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          companyAdmin = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          done();
        });
      });
    });
  });

  context("Login company admin", () => {
    it("Login in admin user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: companyAdmin.id });
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

  context(`Create user ${nameOfFirstUserToSignUp}`, () => {
    it("Clicks on 'Add Employee'", () => {
      cy.usrClickAddEmployee();
    });

    it("Enters e-mail", () => {
      cy.usrEnterEmail({ email: emailOfFirstUserToSignUp });
    });

    it("Enters name", () => {
      cy.usrEnterName({ name: nameOfFirstUserToSignUp });
    });

    it("Clicks the save button", () => {
      cy.usrClickSaveButton();
      currentDate = momentInPST().format("MMM D, YYYY hh:m");
    });
  });

  context(`Check if the history is created for ${nameOfFirstUserToSignUp}`, () => {
    SystemRequirement("REQ-2640");
    it("Open history panel", () => {
      cy.usrHistoryClickOpenButton();
    });

    it("Verify creator of user", () => {
      cy.usrHistoryVerifyCreator({ name: USERS[1].name });
    });

    it("Verify user added datetime", () => {
      cy.wait(3000);
      cy.usrHistoryVerifyCurrentDate({ dateTime: currentDate });
    });

    it("Verify added user's name", () => {
      cy.usrHistoryVerifyAddedNewUser({ name: nameOfFirstUserToSignUp });
    });

    it("Verify added user's email", () => {
      cy.usrHistoryVerifyAddedUserEmail({ email: emailOfFirstUserToSignUp });
    });

    it("Verify user added to group", () => {
      cy.usrHistoryAddedToGroups("Can be approver", "Owner as approver", "Everyone");
    });

    it("Verify added user's status", () => {
      cy.usrHistoryVerifyUpdatedStatus({ name: nameOfFirstUserToSignUp, status: "Active" });
    });

    it("Close history panel", () => {
      cy.usrHistoryClickCloseButton();
    });
  });

  context(`Create user ${nameOfSecondUserToSignUp} and click cancel`, () => {
    it("Clicks on 'Add Employee'", () => {
      cy.usrClickAddEmployee();
    });

    it("Enters e-mail", () => {
      cy.usrEnterEmail({ email: emailOfSecondUserToSignUp });
    });

    it("Enters name", () => {
      cy.usrEnterName({ name: nameOfSecondUserToSignUp });
    });

    it("Clicks the cancel button", () => {
      cy.usrClickCancelButton();
    });
  });

  context(`Check if the change name history is not created for ${nameOfFirstUserToSignUp}`, () => {
    it("Open history panel", () => {
      cy.usrHistoryClickOpenButton();
    });

    it("Verify no new record is added", () => {
      cy.usrHistoryVerifyRecordsCount({ records: 2 });
    });

    it("Close history panel", () => {
      cy.usrHistoryClickCloseButton();
    });
  });

  context(`Click on resend signup email for ${nameOfFirstUserToSignUp}`, () => {
    it(`Filter ${nameOfFirstUserToSignUp}`, () => {
      cy.usrFilterByEmail({ email: emailOfFirstUserToSignUp });
    });

    it("Click on resend signup email", () => {
      cy.contains("Resend signup email").arrowClick();
      currentDate = momentInPST().format("MMM D, YYYY hh:m");
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
    });

    it("Verify popup message \"Signup email sent\"", () => {
      cy.checkToastMessageContains({
        message: "Signup email sent",
      });
    });
  });

  context(`Check if the signup history is created for ${nameOfFirstUserToSignUp}`, () => {
    SystemRequirement("REQ-2640");
    it("Check history is created", () => {
      it("Open history panel", () => {
        cy.usrHistoryClickOpenButton();
      });

      it("Verify creator of user", () => {
        cy.usrHistoryVerifyCreator({ name: USERS[1].name });
      });

      it("Verify user added datetime", () => {
        cy.usrHistoryVerifyCurrentDate({ dateTime: currentDate });
      });

      it("Verify resend signup email is recorded", () => {
        cy.usrHistoryVerifyResentSignupEmail();
      });

      it("Verify resend signup email for user is recorded", () => {
        cy.usrHistoryVerifyForUser({ name: nameOfFirstUserToSignUp });
      });

      it("Close history panel", () => {
        cy.usrHistoryClickCloseButton();
      });
    });
  });

  context("Logout user", () => {
    it("Logout user", () => {
      cy.authLogout();
    });
  });

  context(`Activate user ${nameOfFirstUserToSignUp}`, () => {
    it("Verify activation email", () => {
      cy.imapGetActivationLink({ userEmail: emailOfFirstUserToSignUp, date: dateAfterEmailShouldArrive });
    });

    it("Enter password", () => {
      cy.authEnterSignUpPassword();
    });

    it("Enter password for confirmation", () => {
      cy.authEnterSignUpConfirmPassword();
    });

    it("Click 'SIGN IN'", () => {
      cy.authClickSignIn();
    });
  });

  context("Logout user", () => {
    it("Logout user", () => {
      cy.authLogout();
    });
  });

  context("Login with user by inserting wrong password 5 times", () => {
    it("Enter wrong password 5 times", () => {
      cy.authLoginWithInvalidPassword({ email: emailOfFirstUserToSignUp, password: "tester123" });
      cy.authSubmitLoginError({ show: true, message: "Incorrect username or password." });
      cy.authLoginWithInvalidPassword({ email: emailOfFirstUserToSignUp, password: "tester123" });
      cy.authSubmitLoginError({ show: true, message: "Incorrect username or password." });
      cy.authLoginWithInvalidPassword({ email: emailOfFirstUserToSignUp, password: "tester123" });
      cy.authSubmitLoginError({ show: true, message: "Incorrect username or password." });
      cy.authLoginWithInvalidPassword({ email: emailOfFirstUserToSignUp, password: "tester123" });
      cy.authSubmitLoginError({ show: true, message: "Incorrect username or password." });
      cy.authLoginWithInvalidPassword({ email: emailOfFirstUserToSignUp, password: "tester123" });
    });

    it("Should see locked notification", () => {
      cy.get("[data-cy=UserLocked-lockedInfo]").should("have.text", "Your account has been locked.");
    });
  });

  context("Log in as company admin", () => {
    it("Login in admin user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: companyAdmin.id });
    });
  });

  context(`Goto user management and reset password for ${nameOfFirstUserToSignUp}`, () => {
    it("Navigate to User management", () => {
      cy.usrNavigateToUserManagement();
    });

    it("click reset password for user", () => {
      cy.usrFilterByEmail({ email: emailOfFirstUserToSignUp });
      cy.contains("Reset Password").arrowClick();
      currentDate = momentInPST().format("MMM D, YYYY hh:m");
    });

    it("Verify popup message \"Reset password email sent\"", () => {
      cy.checkToastMessageContains({
        message: "Reset password email sent",
      });
    });
  });

  context(`Check if the reset password email history is created for ${nameOfFirstUserToSignUp}`, () => {
    SystemRequirement("REQ-2640");
    it("Check history is created", () => {
      it("Open history panel", () => {
        cy.usrHistoryClickOpenButton();
      });

      it("Verify creator of user", () => {
        cy.usrHistoryVerifyCreator({ name: USERS[1].name });
      });

      it("Verify user added datetime", () => {
        cy.usrHistoryVerifyCurrentDate({ dateTime: currentDate });
      });

      it("Verify reset password is recorded", () => {
        cy.usrHistoryVerifyResetPassword();
      });

      it("Verify reset password for user is recorded", () => {
        cy.usrHistoryVerifyForUser({ name: nameOfFirstUserToSignUp });
      });

      it("Close history panel", () => {
        cy.usrHistoryClickCloseButton();
      });
    });
  });

  context(`deactivate, reactivate user ${nameOfThirdUserToSignUp} and verify history`, () => {
    context(`Deactivate ${nameOfThirdUserToSignUp}`, () => {
      it(`Click edit button for ${nameOfThirdUserToSignUp}`, () => {
        cy.grpClearFilter();
        cy.usrClickEditUser({ name: nameOfThirdUserToSignUp });
      });

      it("Click deactivate button", () => {
        cy.usrClickStatusButton();
        cy.usrClickCloseDialogButton();
        currentDate = momentInPST().format("MMM D, YYYY hh:m");
      });
    });

    context(`Check if the deactivate history is created for ${nameOfThirdUserToSignUp}`, () => {
      SystemRequirement("REQ-2640");
      it("Check history is created", () => {
        it("Open history panel", () => {
          cy.usrHistoryClickOpenButton();
        });

        it("Verify creator of user", () => {
          cy.usrHistoryVerifyCreator({ name: USERS[1].name });
        });

        it("Verify user added datetime", () => {
          cy.usrHistoryVerifyCurrentDate({ dateTime: currentDate });
        });

        it("Verify deactivation of user is recorded", () => {
          cy.usrHistoryVerifyDeactivatedUser({ name: nameOfThirdUserToSignUp });
        });

        it("Close history panel", () => {
          cy.usrHistoryClickCloseButton();
        });
      });
    });

    context(`Reactivate ${nameOfThirdUserToSignUp}`, () => {
      it(`Click edit button for ${nameOfThirdUserToSignUp}`, () => {
        cy.grpClearFilter();
        cy.usrClickEditUser({ name: nameOfThirdUserToSignUp });
      });

      it("Click reactivate button", () => {
        cy.usrClickStatusButton();
        cy.usrClickCloseDialogButton();
        currentDate = momentInPST().format("MMM D, YYYY hh:m");
      });
    });

    context(`Check if the reactivate history is created for ${nameOfThirdUserToSignUp}`, () => {
      SystemRequirement("REQ-2640");
      it("Check history is created", () => {
        it("Open history panel", () => {
          cy.usrHistoryClickOpenButton();
        });

        it("Verify creator of user", () => {
          cy.usrHistoryVerifyCreator({ name: USERS[1].name });
        });

        it("Verify user added datetime", () => {
          cy.usrHistoryVerifyCurrentDate({ dateTime: currentDate });
        });

        it("Verify reactivation of user is recorded", () => {
          cy.usrHistoryVerifyReactivatedUser({ name: nameOfThirdUserToSignUp });
        });

        it("Close history panel", () => {
          cy.usrHistoryClickCloseButton();
        });
      });
    });
  });
});

export { };

