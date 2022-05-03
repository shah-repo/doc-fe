// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

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
const newPassword = "Tester123#!";

const nameOfUserToSignUp = faker.name.findName();
const emailOfUserToSignUp =
`enlil.testmail+${faker.fake("{{address.zipCode}}{{internet.userName}}")}@gmail.com`.toLowerCase();

context("Password expire flow", () => {
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

  context("Login company admin", () => {
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
    });

    context("Log out and sign in again", () => {
      it("Logout", () => {
        cy.authLogout();
      });

      it("Log user in", () => {
        cy.authLogin({
          email: emailOfUserToSignUp,
        });
      });

      it("Verify user is loged in", () => {
        cy.navigListExistsCheck(
          NavigationItems.DASHBOARD,
          NavigationItems.DOCUMENT_CONTROL);
      });

      it("Verify no password expiration message", () => {
        cy.checkToastMessage({ exists: false });
      });
    });

    const testDays = ["85", "86", "87", "88", "89"];
    const startingTestDay = 85;
    testDays.forEach((dayToTest, i) => {
      context(`Test UI message for day ${dayToTest}`, () => {
        context("Use time tool to travel user back to future", () => {
          it("Navigate to async tasks", () => {
            cy.navigToAsyncTasks();
          });

          it("Select task TIME_TRAVEL_USER", () => {
            cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_USER });
          });

          const daysToJumpBackInFutre = startingTestDay + i === 85 ? 85 : 1;
          it(`Select ${daysToJumpBackInFutre.toString()} day to back in future`, () => {
            cy.asyncSelectBackToTheFutureTime({ day: daysToJumpBackInFutre });
          });

          it("Select next task SEND_PASSWORD_EXPIRATION_EMAILS", () => {
            cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.SEND_PASSWORD_EXPIRATION_EMAILS });
          });

          it("Submit async task", () => {
            cy.asyncTaskClickSubmit();
          });
        });

        context("Veriy UI notification is present", () => {
          it("Logout", () => {
            cy.authLogout();
          });

          it("Log user in", () => {
            cy.authLogin({
              email: emailOfUserToSignUp,
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
        });
      });
    });

    context("Test user is locked after 90 days", () => {
      context("Use time tool to travel user back to future", () => {
        it("Navigate to async tasks", () => {
          cy.navigToAsyncTasks();
        });

        it("Select task TIME_TRAVEL_USER", () => {
          cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_USER });
        });

        it("Select 1 day to back in future", () => {
          cy.asyncSelectBackToTheFutureTime({ day: 1 });
        });

        it("Select next task SEND_PASSWORD_EXPIRATION_EMAILS", () => {
          cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.SEND_PASSWORD_EXPIRATION_EMAILS });
        });

        it("Submit async task", () => {
          cy.asyncTaskClickSubmit();
        });
      });

      context("Veriy UI notification is present", () => {
        it("Logout", () => {
          cy.authLogout();
        });

        it("Log user in", () => {
          cy.authLogin({
            email: emailOfUserToSignUp,
          });
        });

        it("Verify user is locked page present on screen", () => {
          cy.get(`div[data-cy="UserLocked-infoLink"]`).should("exist");
        });
      });
    });

    context("Unlock locked user with company admin", () => {
      it("Log user in", () => {
        cy.authLogin({
          email: USERS[1].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      });

      it("click reset password for user", () => {
        cy.usrFilterByEmail({ email: emailOfUserToSignUp });
        cy.contains("Reset Password").arrowClick();
        cy.wait(10000);
      });

      it("Get email to unlock account", () => {
        cy.imapGetNewPasswordLink({ userEmail: emailOfUserToSignUp });
      });

      it("Enter password", () => {
        cy.authEnterSignUpPassword({ password: newPassword });
      });

      it("Enter password for confirmation", () => {
        cy.authEnterSignUpConfirmPassword({ password: newPassword });
      });

      it("Click 'SIGN IN'", () => {
        cy.get("[id=\"ConfirmPasswordPresenter-loginSubmit\"]").arrowClick();
      });

      it("Password Reset Successfully should be displayed", () => {
        cy.contains("Password Reset Successfully!").should("exist");
      });

      it("Logs user in", () => {
        cy.authLogin({ email: emailOfUserToSignUp, password: newPassword });
      });

      it("Verify user is loged in", () => {
        cy.navigListExistsCheck(NavigationItems.DASHBOARD, NavigationItems.DOCUMENT_CONTROL);
      });
    });
  });
});
