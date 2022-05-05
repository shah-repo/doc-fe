// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import faker from "faker";
import { SQS_TYPES } from "../../../src/ui/async.tasks/types";
import { CONFIG } from "../../support/config";
import { momentInPST } from "../../utils/constants/dateHandler";
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
let emailsFromInbox;
const newPasswords = ["Tester1#!", "Tester2#!", "Tester3#!", "Tester4#!", "Tester5#!"];
const passExpiresInOneDay = momentInPST().add({ day: 1 }).format("MMM DD, YYYY");
const passExpiresInTwoDays = momentInPST().add({ day: 2 }).format("MMM DD, YYYY");
const passExpiresInThreeDays = momentInPST().add({ day: 3 }).format("MMM DD, YYYY");
const passExpiresInFourDays = momentInPST().add({ day: 4 }).format("MMM DD, YYYY");
const passExpiresInFiveDays = momentInPST().add({ day: 5 }).format("MMM DD, YYYY");

const nameOfUserToSignUp = faker.name.findName();
const emailOfUserToSignUp =
`enlil.testmail+${faker.fake("{{address.zipCode}}{{internet.userName}}")}@gmail.com`.toLowerCase();
const dateAfterEmailShouldArrive = new Date();

context("Password expire reset flow", () => {
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

    context("Relog to verify new user is able to login normally", () => {
      it("Logout", () => {
        cy.authLogout();
      });

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

  context("Test password reset from notification", () => {
    context("Use time tool to travel back in future", () => {
      it("Navigate to async tasks", () => {
        cy.navigToAsyncTasks();
      });

      it("Select task TIME_TRAVEL_USER", () => {
        cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_USER });
      });

      it(`Select 85 days to back in future`, () => {
        cy.asyncSelectBackToTheFutureTime({ day: 85 });
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
        cy.checkToastMessageIsEqual({ message: `Your password will expire in 6 days. Reset it now.` });
      });
    });

    context("Reset password through UI notification", () => {
      it("Click on reset password on notificaion", () => {
        cy.get("div.Toastify__toast-body>div>a").arrowClick();
      });

      it("Enter password", () => {
        cy.get(`[name="newPassword"]`).arrowType(newPasswords[0]);
      });

      it("Enter password for confirmation", () => {
        cy.get(`[name="newPasswordConfirmation"]`).arrowType(newPasswords[0]);
      });

      it("Verify password change notification", () => {
        cy.get(`[name="newPasswordConfirmation"]`).arrowType(newPasswords[0]);
      });
    });
  });
});
