/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable max-classes-per-file */

import { integer } from "aws-sdk/clients/cloudfront";
import { CONFIG } from "../../config";
import { IMAPEmail } from "./imap";


/* eslint-disable @typescript-eslint/no-namespace */
export { };

export interface IMAPEmailsInTesting {
  sentToUser: string;
  contains: string[];
}

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      imapGetTextFromLastEmail(params: {userEmail: string}): Chainable;
      imapGetMails(params: {userEmail: string; options: any}): Chainable;
      imapVerifyLastEmailDoesNotContain(params: {userEmail: string; content: string}): Chainable;
      imapVerifyNumberOfEmailsReceivedSince(params: {userEmail: string; emailCount: integer; date: Date}): Chainable;
      imapGetActivationLink(params: {userEmail: string}): Chainable;
      imapVerifyLastEmailContains(params: {userEmail: string; content: string; date: Date}): Chainable;
      imapVerifyEmailsInList(params: {
        receivedEmails: IMAPEmail[];
        emailsToTest: IMAPEmailsInTesting[];
        getEmailsSincedate: Date;
        assertNumberOfEmailsFoundInList: integer;}): Chainable;
    }
  }
}

Cypress.Commands.add("imapGetTextFromLastEmail",
  (params: {userEmail: string}) => cy.task("gmailGetLastMail", params.userEmail));

Cypress.Commands.add("imapGetMails", (params: {userEmail: string; options: any}) => cy.task("gmailGetMails", {
  email: params.userEmail,
  options: params.options,
}));

Cypress.Commands.add("imapVerifyLastEmailContains", (params: { userEmail: string; content: string; date: Date}) => {
  const getEmailSetting =  {
    to: params.userEmail,
    wait_time_sec: 5,
    max_wait_time_sec: 50,
    include_body: true,
    after: params.date,
  };

  cy.imapGetMails({ userEmail: params.userEmail, options: getEmailSetting }).should((emails) => {
    if (emails) {
      const emailText = emails[0].body.html;
      const startingPosition = emailText.search("<body");
      const endingPosition = emailText.search("</body>");
      const emailBody = emailText.substring(startingPosition, endingPosition);
      expect(emailBody).to.contain(params.content);
    }
    else {
      assert.fail("No email found");
    }
  });
});

Cypress.Commands.add("imapGetActivationLink", (params: { userEmail: string}) => {
  cy.imapGetTextFromLastEmail({ userEmail: params.userEmail }).should((emailText) => {
    const startingPosition = emailText.search("/new_user");
    const endingPosition = emailText.search("\" target");
    const activationLink = emailText.substring(startingPosition, endingPosition);
    cy.visit(CONFIG.FE_URL + activationLink);
  });
});

Cypress.Commands.add("imapVerifyLastEmailDoesNotContain", (params: { userEmail: string; content: string}) => {
  cy.imapGetTextFromLastEmail({ userEmail: params.userEmail }).should((emailText) => {
    if (emailText) {
      const startingPosition = emailText.search("<body");
      const endingPosition = emailText.search("</body>");
      const emailBody = emailText.substring(startingPosition, endingPosition);
      expect(emailBody).to.not.contain(params.content);
    }
  });
});

Cypress.Commands.add("imapVerifyNumberOfEmailsReceivedSince", (params: {
  userEmail: string;
  emailCount: integer;
  date: Date;}) => {
  const options =  {
    to: params.userEmail,
    wait_time_sec: 5,
    max_wait_time_sec: 30,
    include_body: true,
    after: params.date,
  };
  cy.imapGetMails({ userEmail: params.userEmail, options }).should((emails) => {
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

