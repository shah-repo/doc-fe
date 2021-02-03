/* eslint-disable max-classes-per-file */

import { CONFIG } from "../../config";


/* eslint-disable @typescript-eslint/no-namespace */
export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      imapGetTextFromLastEmail(params: {userEmail: string}): Chainable;
      imapVerifyInReviewAREmailNotification(params: {userEmail: string; arId: string}): Chainable;
      imapVerifyRejectedAREmailNotification(params: {userEmail: string; arId: string}): Chainable;
      imapVerifyApprovedAREmailNotification(params: {userEmail: string; arId: string}): Chainable;
      imapVerifyLastEmailIsNot(params: {userEmail: string; documentId: string}): Chainable;
      imapGetActivationLink(params: {userEmail: string}): Chainable;
    }
  }
}

Cypress.Commands.add("imapGetTextFromLastEmail", (params: {userEmail: string}) => cy.task("mail", params.userEmail));

Cypress.Commands.add("imapVerifyInReviewAREmailNotification", (params: { userEmail: string; arId: string}) => {
  cy.imapGetTextFromLastEmail({ userEmail: params.userEmail }).should((emailText) => {
    const startingPosition = emailText.search("<body");
    const endingPosition = emailText.search("</body>");
    const emailBody = emailText.substring(startingPosition, endingPosition);
    expect(emailBody).to.contain(`Your approval request <b>${params.arId}</b> is in review.`);
    expect(emailBody).to.contain("Please click on the buttons below to view CR or slack conversation.");
  });
});

Cypress.Commands.add("imapVerifyRejectedAREmailNotification", (params: { userEmail: string; arId: string}) => {
  cy.imapGetTextFromLastEmail({ userEmail: params.userEmail }).should((emailText) => {
    const startingPosition = emailText.search("<body");
    const endingPosition = emailText.search("</body>");
    const emailBody = emailText.substring(startingPosition, endingPosition);
    expect(emailBody).to.contain(`Your approval request <b>${params.arId}</b> is rejected.`);
    expect(emailBody).to.contain("Please click on the button below to view it.");
  });
});

Cypress.Commands.add("imapVerifyApprovedAREmailNotification", (params: { userEmail: string; arId: string}) => {
  cy.imapGetTextFromLastEmail({ userEmail: params.userEmail }).should((emailText) => {
    const startingPosition = emailText.search("<body");
    const endingPosition = emailText.search("</body>");
    const emailBody = emailText.substring(startingPosition, endingPosition);
    expect(emailBody).to.contain(`Your approval request <b>${params.arId}</b> is approved.`);
    expect(emailBody).to.contain("Please click on the button below to view it.");
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

Cypress.Commands.add("imapVerifyLastEmailIsNot", (params: { userEmail: string; documentId: string}) => {
  cy.imapGetTextFromLastEmail({ userEmail: params.userEmail }).should((emailText) => {
    const startingPosition = emailText.search("<body");
    const endingPosition = emailText.search("</body>");
    const emailBody = emailText.substring(startingPosition, endingPosition);
    expect(emailBody).to.not.contain(params.documentId);
  });
});
