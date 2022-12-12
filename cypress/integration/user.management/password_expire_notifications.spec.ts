// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

// eslint-disable-next-line spaced-comment
/// <reference types="cypress-grep" />

import faker from "faker";
import { SQS_TYPES } from "../../../src/ui/async.tasks/types";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { CONFIG } from "../../support/config";
import { emailDateOffset, momentInPST } from "../../utils/constants/dateHandler";
import { NavigationItems } from "../../utils/constants/navigationItems";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let employeeLoginFirst;
let adminLoginResponse;
let adminSessionId;
let asyncTasksGroup;
let searchMailFromDate;
let emailsFromInbox;
const newPassword = "Tester123#!";
const passExpiresInOneDay = momentInPST().add({ day: 1 }).format("MMM DD, YYYY");
const passExpiresInTwoDays = momentInPST().add({ day: 2 }).format("MMM DD, YYYY");
const passExpiresInThreeDays = momentInPST().add({ day: 3 }).format("MMM DD, YYYY");
const passExpiresInFourDays = momentInPST().add({ day: 4 }).format("MMM DD, YYYY");
const passExpiresInFiveDays = momentInPST().add({ day: 5 }).format("MMM DD, YYYY");

const nameOfUserToSignUp = faker.name.findName();
const emailOfUserToSignUp =
`enlil.testmail+${faker.fake("{{address.zipCode}}{{internet.userName}}")}@gmail.com`.toLowerCase();
const dateAfterEmailShouldArrive = new Date();

context("Password expire flow", { tags: ["@timetool"] }, () => {
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

  context("Test notifications for password expire", () => {
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
          cy.usrClickSaveButton();
        });

        it("Logout user", () => {
          cy.authLogout();
        });
      });
    });

    context("Activate new user", () => {
      it("Verify activation email", () => {
        cy.imapGetActivationLink({ userEmail: emailOfUserToSignUp });
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
            SystemRequirement("REQ-4180");
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
          cy.usrVerifyUserLockedPageIsPresented();
        });
      });
    });

    context("Verify locked user is not able to reset password with forgot password option", () => {
      it("Navigate to login page", () => {
        cy.usrNavigateToLoginPage();
      });

      it(`Click "Forgot your password?"`, () => {
        cy.usrClickForgotPasswordLoginPage();
      });

      it("Enter locked user email in forgot password window", () => {
        cy.usrForgotPageEnterEmail({ email: emailOfUserToSignUp });
      });

      it(`Click "RESET MY PASSWORD" button`, () => {
        cy.usrClickResetMyPasswordButton();
        searchMailFromDate =  new Date(new Date().getTime() - emailDateOffset);
      });

      it("Verify no password reset email has arrived", () => {
        cy.imapVerifyNoPasswordResetEmail({ userEmail: emailOfUserToSignUp, fromDate: searchMailFromDate });
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

      it("Navigate to user management", () => {
        cy.usrNavigateToUserManagement();
      });

      it("Click reset password for user", () => {
        cy.usrFilterByEmail({ email: emailOfUserToSignUp });
        cy.contains("Reset Password").arrowClick();
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

    context("Verify emails that should be received", () => {
      it("Get emails", () => {
        const getEmailSetting =  {
          to: emailOfUserToSignUp,
          // eslint-disable-next-line @typescript-eslint/camelcase
          wait_time_sec: 5,
          // eslint-disable-next-line @typescript-eslint/camelcase
          max_wait_time_sec: 50,
          // eslint-disable-next-line @typescript-eslint/camelcase
          include_body: true,
          after: dateAfterEmailShouldArrive,
        };

        cy.imapGetMails({ userEmail: emailOfUserToSignUp, options: getEmailSetting }).then((emails) => {
          emailsFromInbox = emails;
        });
      });

      it("Verify the emails that should be received", () => {
        const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
          {
            sentToUser: emailOfUserToSignUp,
            contains: [`Your Password has expired:(`],
          },
          {
            sentToUser: emailOfUserToSignUp,
            contains: [`Password expiring?`,
              passExpiresInOneDay],
          },
          {
            sentToUser: emailOfUserToSignUp,
            contains: [`Password expiring?`,
              passExpiresInTwoDays],
          },
          {
            sentToUser: emailOfUserToSignUp,
            contains: [`Password expiring?`,
              passExpiresInThreeDays],
          },
          {
            sentToUser: emailOfUserToSignUp,
            contains: [`Password expiring?`,
              passExpiresInFourDays],
          },
          {
            sentToUser: emailOfUserToSignUp,
            contains: [`Password expiring?`,
              passExpiresInFiveDays],
          },
          {
            sentToUser: emailOfUserToSignUp,
            contains: [`Your password was successfully updated!`],
          },
        ];

        cy.imapVerifyEmailsInList({
          receivedEmails: emailsFromInbox,
          emailsToTest: emailsThatShouldBeReceived,
          getEmailsSincedate: dateAfterEmailShouldArrive,
          assertNumberOfEmailsFoundInList: 1,
        });
      });

      it("Verify the emails that should not be received", () => {
        const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
          {
            sentToUser: emailOfUserToSignUp,
            contains: ["Please click on the button to reset password"],
          },
        ];

        cy.imapVerifyEmailsInList({
          receivedEmails: emailsFromInbox,
          emailsToTest: emailsThatShouldBeReceived,
          getEmailsSincedate: dateAfterEmailShouldArrive,
          assertNumberOfEmailsFoundInList: 0,
        });
      });
    });
  });
});
