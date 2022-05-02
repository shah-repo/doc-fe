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

      context("Create user", () => {
        it("Clicks the save button", () => {
          cy.intercept({ method: "POST", pathname: "/api/v1/employees" }).as("postEmployee");
          cy.usrClickSaveButton();
          cy.wait("@postEmployee").then((res) => {
            if (res.response) {
              const response = res.response.body;
              newEmployeId = response.id;
            }
          });
        });
      });
    });

    context("Activate user", () => {
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

    context("Login admin and use time tool", () => {
      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLoginFirst.id });
      });

      it("Navigate to async tasks", () => {
        cy.navigToAsyncTasks();
      });

      it("Select task TIME_TRAVEL_USER", () => {
        cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_USER });
      });

      it("Select 85 days to back in future", () => {
        cy.asyncSelectBackToTheFutureTime({ day: 86 });
      });

      it("Submit async task", () => {
        cy.asyncTaskClickSubmit();
      });

      it("Select task SEND_PASSWORD_EXPIRATION_EMAILS", () => {
        cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.SEND_PASSWORD_EXPIRATION_EMAILS });
      });

      it("Submit async task", () => {
        cy.asyncTaskClickSubmit();
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
        cy.checkToastMessage({ exists: true });
      });
    });
  });
});
