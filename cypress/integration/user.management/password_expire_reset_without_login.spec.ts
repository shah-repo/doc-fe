// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

// eslint-disable-next-line spaced-comment
/// <reference types="cypress-grep" />

import faker from "faker";
import { SQS_TYPES } from "../../../src/ui/async.tasks/types";
import { CONFIG } from "../../support/config";
import { NavigationItems } from "../../utils/constants/navigationItems";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let employeeLoginFirst;
let adminLoginResponse;
let adminSessionId;
let asyncTasksGroup;
let newEmployeId;
let searchMailFromDate;

const newPasswordsEmail = [
  "@Tester1#!",
  "@Tester2#!",
  "@Tester3#!",
  "@Tester4#!",
  "@Tester5#!"];

const nameOfUserToSignUp = faker.name.findName();
const emailOfUserToSignUp =
`enlil.testmail+${faker.fake("{{address.zipCode}}{{internet.userName}}")}@gmail.com`.toLowerCase();

context("Password expire reset flow", { tags: ["@timetool"] }, () => {
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
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [],
            scheduledForDeletion: false,
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLoginFirst = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          done();
        });
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        adminLoginResponse = response;
        adminSessionId = adminLoginResponse.sessionId;
        done();
      });
    });

    it("[API]Get group", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Async Tasks",
        sessionId: adminSessionId,
        employeeId: employeeLoginFirst.id,
      }).then((response) => {
        asyncTasksGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: asyncTasksGroup.body[0].id,
        sessionId: adminSessionId,
        employeeId: employeeLoginFirst.id,
        payload: {
          employees: [{ id: employeeLoginFirst.id }],
        },
      });
    });
  });

  context("Sign up new user for test", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLoginFirst.id });
    });

    context("Sign new user for password expiration flow", () => {
      it("Navigate to User management", () => {
        cy.usrNavigateToUserManagement();
      });

      it("Click 'ADD EMPLOYEE'", () => {
        cy.usrClickAddEmployee();
      });

      context("Fill in user attributes", () => {
        it("Enters e-mail", () => {
          cy.usrEnterEmail({ email: emailOfUserToSignUp });
        });

        it("Enters name", () => {
          cy.usrEnterName({ name: nameOfUserToSignUp });
        });

        it("Add Async group", () => {
          cy.usrAddGroupNewUser({ group: "Async Tasks" });
        });
      });

      context("Create new user", () => {
        it("Clicks the save button", () => {
          cy.intercept({ method: "POST", pathname: "/api/v1/employees" }).as("postEmployee");
          cy.get("button>span>svg>path").eq(1).arrowClick();
          cy.wait("@postEmployee").then((res) => {
            if (res.response) {
              const response = res.response.body;
              newEmployeId = response.id;
            }
          });
          cy.landingPageLoadingElementShouldNotExist();
        });

        it("Logout", () => {
          cy.authLogout();
        });
      });
    });

    context("Activate new user", () => {
      it("Verify activation email", () => {
        cy.imapGetActivationLink({ userEmail: emailOfUserToSignUp });
        cy.log(newEmployeId);
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

      it("Verify user is loged in", () => {
        cy.navigListExistsCheck(
          NavigationItems.DASHBOARD,
          NavigationItems.DOCUMENT_CONTROL);
      });

      it("Logout", () => {
        cy.authLogout();
      });
    });

    context("Relog to verify new user is able to login normally", () => {
      it("Log user in", () => {
        cy.authLogin({
          email: emailOfUserToSignUp,
        });
      });

      it("Verify user is logged in", () => {
        cy.navigListExistsCheck(
          NavigationItems.DASHBOARD,
          NavigationItems.DOCUMENT_CONTROL);
      });

      it("Verify no password expiration message", () => {
        cy.checkToastMessage({ exists: false });
      });
    });
  });

  const daysToTest = ["85", "86", "87", "88", "89"];
  daysToTest.forEach((dayToTest, i) => {
    const previousPassword = i === 0 ? CONFIG.DEFAULT_ENLIL_USER_PASSWORD : newPasswordsEmail[i - 1];
    const newPassword = newPasswordsEmail[i];

    context(`Test password reset from email day ${dayToTest}`, () => {
      context("Use time tool to travel back in future", () => {
        it("Navigate to async tasks", () => {
          cy.navigToAsyncTasks();
        });

        it("Select task TIME_TRAVEL_USER", () => {
          cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_USER });
        });

        it(`Select ${dayToTest} days to back in future`, () => {
          cy.asyncSelectBackToTheFutureTime({ day: parseInt(dayToTest, 10) });
        });

        it("Select next task SEND_PASSWORD_EXPIRATION_EMAILS", () => {
          cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.SEND_PASSWORD_EXPIRATION_EMAILS });
        });

        it("Submit async task", () => {
          cy.asyncTaskClickSubmit({ password: previousPassword });
          searchMailFromDate = new Date();
        });
      });

      context("Veriy UI notification is present", () => {
        it("Logout", () => {
          cy.authLogout();
        });

        it("Log user in", () => {
          cy.authLogin({
            email: emailOfUserToSignUp,
            password: previousPassword,
          });
        });

        it("Verify user is loged in", () => {
          cy.navigListExistsCheck(
            NavigationItems.DASHBOARD,
            NavigationItems.DOCUMENT_CONTROL);
        });

        it("Verify password expiration message", () => {
          // eslint-disable-next-line no-irregular-whitespace
          cy.checkToastMessageIsEqual({ message: `Your password will expire in ${5 - i} days. Reset it now.` });
        });

        it("Logout", () => {
          cy.authLogout();
        });
      });

      context("Reset password through email notification", () => {
        it("Get email to unlock account", () => {
          cy.imapNavigToPasswordResetLink({ userEmail: emailOfUserToSignUp, fromDate: searchMailFromDate });
        });

        it("Enter email", () => {
          cy.usrForgotPageEnterEmail({ email: emailOfUserToSignUp });
        });

        it("Enter current password", () => {
          cy.get("[data-cy=\"currentPassword\"]").arrowType( previousPassword );
        });

        it("Enter new password", () => {
          cy.get(`input[name="newPassword"]`).arrowType( newPassword );
        });

        it("Enter password for confirmation", () => {
          cy.get(`input[name="newPasswordConfirmation"]`).arrowType( newPassword );
        });

        it(`Click "RESET PASSWORD"`, () => {
          cy.get("[data-cy=\"resetButtonSubmit\"]").arrowClick();
        });

        it("Password Reset Successfully should be displayed", () => {
          cy.contains("Password Reset Successfully!").should("exist");
        });
      });

      context("Sign in with new password", () => {
        it("Log user in", () => {
          cy.authLogin({
            email: emailOfUserToSignUp,
            password: newPassword,
          });
        });

        it("Verify user is logged in", () => {
          cy.navigListExistsCheck(
            NavigationItems.DASHBOARD,
            NavigationItems.DOCUMENT_CONTROL);
        });

        it("Verify no password expiration message", () => {
          cy.checkToastMessage({ exists: false });
        });
      });
    });
  });
});
