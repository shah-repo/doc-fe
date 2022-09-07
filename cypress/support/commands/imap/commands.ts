/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable max-classes-per-file */

import { integer } from "aws-sdk/clients/cloudfront";
import { CONFIG } from "../../config";
import { GmailTesterOptions, IMAPEmail } from "./imap";


/* eslint-disable @typescript-eslint/no-namespace */
export { };

export interface IMAPEmailsInTesting {
  sentToUser: string;
  contains: string[];
}

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      imapGetMails(params: {userEmail: string; options?: GmailTesterOptions}): Chainable;
      imapGetMailsNoValidation(params: {userEmail: string; options?: GmailTesterOptions}): Chainable;
      imapVerifyLastEmailDoesNotContain(params: {userEmail: string; content: string}): Chainable;
      imapVerifyNumberOfEmailsReceivedSince(params: {userEmail: string; emailCount: integer; date: Date}): Chainable;
      imapGetActivationLink(params: {userEmail: string; date?: Date}): Chainable;
      imapGetApprovalRequestLink(params: {userEmail: string; options?: GmailTesterOptions}): Chainable;
      imapGetRecordRequestLink(params: {userEmail: string; options?: GmailTesterOptions}): Chainable;
      imapVerifyLastEmailContains(params: {userEmail: string; content: string; date: Date}): Chainable;
      imapVerifyEmailsInList(params: {
        receivedEmails: IMAPEmail[];
        emailsToTest: IMAPEmailsInTesting[];
        getEmailsSincedate: Date;
        assertNumberOfEmailsFoundInList: integer;}): Chainable;
      imapGetNewPasswordLink(params: {userEmail: string}): Chainable;
      imapVerifyNoPasswordResetEmail(params: {userEmail: string; fromDate: Date}): Chainable;
      imapNavigToPasswordResetLink(params: {userEmail: string; fromDate: Date}): Chainable;
    }
  }
}

Cypress.Commands.add("imapGetMailsNoValidation", (params: {userEmail: string; options?: GmailTesterOptions}) => {
  cy.task("gmailGetMails", {
    email: params.userEmail,
    options: params.options || {},
  });
});

Cypress.Commands.add("imapGetMails", (params: {userEmail: string; options?: GmailTesterOptions}) => {
  cy.task("gmailGetMails", {
    email: params.userEmail,
    options: params.options || {},
  }).then((emails) => {
    if (!emails || !(emails as any[]).length) {
      assert.fail("No emails found");
    }
    return emails;
  });
});

Cypress.Commands.add("imapVerifyLastEmailContains", (params: { userEmail: string; content: string; date: Date}) => {
  const getEmailSetting: GmailTesterOptions =  {
    to: params.userEmail,
    after: params.date,
  };

  cy.imapGetMails({ userEmail: params.userEmail, options: getEmailSetting }).then((emails) => {
    const emailText = emails[0].body.html;
    const startingPosition = emailText.search("<body");
    const endingPosition = emailText.search("</body>");
    const emailBody = emailText.substring(startingPosition, endingPosition);
    expect(emailBody).to.contain(params.content);

  });
});

function decodeHTMLEntities(text) {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  return textArea.value;
}

Cypress.Commands.add("imapGetActivationLink", (params: { userEmail: string; date?: Date }) => {
  cy.imapGetMails({
    userEmail: params.userEmail,
    options: {
      subject: "Welcome to Enlil",
      after: params.date,
    },
  }).then((emails) => {
    const emailText = emails[0].body.html;
    const startingPosition = emailText.search("new_user_set_password");
    const endingPosition = emailText.search("\" target");
    const activationLink = emailText.substring(startingPosition, endingPosition);
    cy.visit(CONFIG.FE_URL + "/" + decodeHTMLEntities(activationLink));
  });
});

Cypress.Commands.add("imapGetApprovalRequestLink", (params: {userEmail: string; options?: GmailTesterOptions}) => {
  cy.imapGetMails({ userEmail: params.userEmail, options: params.options || {} })
    .then((emails) => {
      const emailText = emails[0].body.html;
      const startingPosition = emailText.search("/change_request/");
      const endingPosition = emailText.search(`/preview"`);
      const urlToAR = emailText.substring(startingPosition, endingPosition);
      cy.visit(CONFIG.FE_URL + decodeHTMLEntities(`${urlToAR}/preview`));
    });
});

Cypress.Commands.add("imapGetRecordRequestLink", (params: { userEmail: string; options?: GmailTesterOptions}) => {
  cy.imapGetMails({ userEmail: params.userEmail, options: params.options || {} })
    .then((emails) => {
      const emailText = emails[0].body.html;
      const filteredExtraSpaceEmailText = emailText.replace(/\s+/g, " ").trim();
      const startingPosition = filteredExtraSpaceEmailText.search("/document_revision/");
      const endingPosition = filteredExtraSpaceEmailText.search(`" target`);
      const urlToAR = filteredExtraSpaceEmailText.substring(startingPosition, endingPosition);
      cy.visit(CONFIG.FE_URL + decodeHTMLEntities(urlToAR));
    });
});

Cypress.Commands.add("imapVerifyLastEmailDoesNotContain", (params: { userEmail: string; content: string}) => {
  cy.imapGetMails({ userEmail: params.userEmail }).then((emails) => {
    const emailText = emails[0].body.html;
    const startingPosition = emailText.search("<body");
    const endingPosition = emailText.search("</body>");
    const emailBody = emailText.substring(startingPosition, endingPosition);
    expect(emailBody).to.not.contain(params.content);
  });
});

Cypress.Commands.add("imapVerifyNumberOfEmailsReceivedSince", (params: {
  userEmail: string;
  emailCount: integer;
  date: Date;}) => {
  const options =  {
    to: params.userEmail,
    after: params.date,
  };
  cy.imapGetMails({ userEmail: params.userEmail, options }).then((emails) => {
    assert.lengthOf(emails, params.emailCount);
  });
});

Cypress.Commands.add("imapVerifyEmailsInList", (params: {
  receivedEmails: IMAPEmail[];
  emailsToTest: IMAPEmailsInTesting[];
  getEmailsSincedate: Date;
  assertNumberOfEmailsFoundInList: integer;}) => {

  params.emailsToTest.forEach((email) => {
    const numberOfEmails = getEmailsThatAreInReceivedList(params.receivedEmails, email);
    assert.lengthOf(numberOfEmails, params.assertNumberOfEmailsFoundInList);
  });
});

Cypress.Commands.add("imapGetNewPasswordLink", (params: { userEmail: string}) => {
  cy.imapGetMails({
    userEmail: params.userEmail,
    options: { subject: "Your Enlil account was locked" },
  }).then((emails) => {
    const emailText = emails[0].body.html;
    const endingPosition = emailText.search("\" target");
    const startingPosition = emailText.search("sign_up");
    const activationLink = emailText.substring(startingPosition, endingPosition);
    cy.visit(CONFIG.FE_URL + "/" + decodeHTMLEntities(activationLink));
  });
});

Cypress.Commands.add("imapNavigToPasswordResetLink", (params: { userEmail: string; fromDate: Date}) => {
  cy.imapGetMails({
    userEmail: params.userEmail,
    options: {
      after: params.fromDate,
      subject: "Password expiring? No worries — ready, change, and go!",
    },
  }).then((emails) => {
    const emailText = emails[0].body.html;
    if (emailText.includes("reset_password")) {
      cy.visit(CONFIG.FE_URL + "/reset_password");
    }
    else {
      assert.fail("No reset link found");
    }
  });
});

Cypress.Commands.add("imapVerifyNoPasswordResetEmail", (params: { userEmail: string; fromDate: Date}) => {
  cy.imapGetMailsNoValidation({
    userEmail: params.userEmail,
    options: {
      after: params.fromDate,
      subject: "Need to reset your password? We gotcha — ready, reset and go!",
      max_wait_time_sec: 30,
    },
  })
    .then((emails) => {
      if (emails) { assert.fail("Password reset found"); }
    });
});

function getEmailsThatAreInReceivedList(receivedEmails, emailToTest) {
  return receivedEmails.filter(
    (receivedEmail) => receivedEmail.receiver === emailToTest.sentToUser &&
      arrayContainsArray(receivedEmail.body.html, emailToTest.contains));
}

function arrayContainsArray(superset, subset) {
  if (0 === subset.length) {
    return false;
  }
  return subset.every(function(value) {
    return (superset.indexOf(value) >= 0);
  });
}

