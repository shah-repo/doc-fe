// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

// eslint-disable-next-line spaced-comment
/// <reference types="cypress-grep" />

import faker from "faker";
import { SQS_TYPES } from "../../../src/ui/async.tasks/types";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
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
let emailsFromInbox;

const nameOfUserToSignUp = faker.name.findName();
const emailOfUserToSignUp =
`enlil.testmail+${faker.fake("{{address.zipCode}}{{internet.userName}}")}@gmail.com`.toLowerCase();
let dateAfterEmailShouldArrive = new Date();

context("Password expiration emails & locked screen test", { tags: ["@timetool"] }, () => {
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
          cy.usrClickPlusSaveButton();
          cy.checkToastMessage({ exists: false });
          cy.landingPageLoadingElementShouldNotExist();
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
            dateAfterEmailShouldArrive = new Date();
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

          it("Get emails", () => {
            cy.wait(10000);
            const getEmailSetting =  {
              to: emailOfUserToSignUp,
              // eslint-disable-next-line @typescript-eslint/camelcase
              wait_time_sec: 5,
              // eslint-disable-next-line @typescript-eslint/camelcase
              max_wait_time_sec: 50,
              // eslint-disable-next-line @typescript-eslint/camelcase
              include_body: true,
              after: dateAfterEmailShouldArrive,
              subject: "Password expiring? No worries — ready, change, and go!",
            };

            cy.imapGetMails({ userEmail: emailOfUserToSignUp, options: getEmailSetting }).then((emails) => {
              emailsFromInbox = emails;
            });
          });

          it("Verify the emails that should be received", () => {
            const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
              {
                sentToUser: emailOfUserToSignUp,
                contains: [`Hello <b>${nameOfUserToSignUp},</b>`],
              },
              {
                sentToUser: emailOfUserToSignUp,
                contains: ["Your password for the Enlil Account associated with",
                  `<b>${emailOfUserToSignUp}</b> is about to expire.`,
                ],
              },
              {
                sentToUser: emailOfUserToSignUp,
                contains: ["Change\r\n                        your password now before it expires on"],
              },
              {
                sentToUser: emailOfUserToSignUp,
                contains: [momentInPST().add({ day: 5 - i }).format("MMM DD, YYYY")],
              },
              {
                sentToUser: emailOfUserToSignUp,
                contains: ["\r\n                            Change Password\r\n"],
              },
              {
                sentToUser: emailOfUserToSignUp,
                contains: ["If you are still having problems with changing your password,",
                  "please contact your Company\r\n                          Admin for Enlil.",
                ],
              },
              {
                sentToUser: emailOfUserToSignUp,
                contains: ["Thank you,"],
              },
              {
                sentToUser: emailOfUserToSignUp,
                contains: ["\r\n                        The Enlil team\r\n"],
              },
            ];

            cy.imapVerifyEmailsInList({
              receivedEmails: emailsFromInbox,
              emailsToTest: emailsThatShouldBeReceived,
              getEmailsSincedate: dateAfterEmailShouldArrive,
              assertNumberOfEmailsFoundInList: 1,
            });
          });

          it("Confirm message is not in email", () => {
            cy.imapVerifyLastEmailDoesNotContain({
              userEmail: emailOfUserToSignUp,
              content: "For your security, this link will expire in 24 hours or immediately after you change your password.",
            });
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
            subject: "Your Password has expired:",
          };

          cy.imapGetMails({ userEmail: emailOfUserToSignUp, options: getEmailSetting }).then((emails) => {
            emailsFromInbox = emails;
          });
        });

        it("Verify the emails that should be received", () => {
          const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
            {
              sentToUser: emailOfUserToSignUp,
              contains: [`Hello <b>${nameOfUserToSignUp},</b>`],
            },
            {
              sentToUser: emailOfUserToSignUp,
              contains: ["Your password for the Enlil Account associated with",
                `<b>${emailOfUserToSignUp}</b> expired on`,
              ],
            },
            {
              sentToUser: emailOfUserToSignUp,
              contains: [momentInPST().format("MMM DD, YYYY")],
            },
            {
              sentToUser: emailOfUserToSignUp,
              contains: ["Please contact your Company Admin for Enlil to reset your password."],
            },
            {
              sentToUser: emailOfUserToSignUp,
              contains: ["Thank you,"],
            },
            {
              sentToUser: emailOfUserToSignUp,
              contains: ["\r\n                        The Enlil team\r\n"],
            },
          ];

          cy.imapVerifyEmailsInList({
            receivedEmails: emailsFromInbox,
            emailsToTest: emailsThatShouldBeReceived,
            getEmailsSincedate: dateAfterEmailShouldArrive,
            assertNumberOfEmailsFoundInList: 1,
          });
        });

        it("Confirm message is not in email", () => {
          cy.imapVerifyLastEmailDoesNotContain({
            userEmail: emailOfUserToSignUp,
            content: "In order to change your password you must reply to this link enlil-feedback@shifamed.com" +
            "to change your password. We're here to help you at any step along the way",
          });
        });
      });

      context("Check locked user message", () => {
        it("Log user in", () => {
          cy.authLogin({
            email: emailOfUserToSignUp,
          });
        });

        it("Should see locked notification", () => {
          cy.get("[data-cy=UserLocked-lockedInfo]").should("have.text", "Your account has been locked.");
          cy.get("[data-cy=UserLocked-infoLink]").should("have.text",
            "Please contact your Company Admin for Enlil to reset your password.");
        });
      });
    });
  });
});
