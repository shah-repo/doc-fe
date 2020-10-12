/* eslint-disable max-classes-per-file */


/* eslint-disable @typescript-eslint/no-namespace */
export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      imapGetTextFromLastEmail(params: {userEmail: string}): Chainable;
      imapVerifyApprovalNotificationIsReceived(params: {userEmail: string}): Chainable;
    }
  }
}

Cypress.Commands.add("imapGetTextFromLastEmail", (params: {userEmail: string}) => cy.task("mail", params.userEmail));

Cypress.Commands.add("imapVerifyApprovalNotificationIsReceived", (params: { userEmail: string}) => {
  cy.imapGetTextFromLastEmail({ userEmail: params.userEmail }).should((emailText) => {
    const startingPosition = emailText.search("<body");
    const endingPosition = emailText.search("</body>");
    const emailBody = emailText.substring(startingPosition, endingPosition);
    expect(emailBody).to.contain("AR00002");
    expect(emailBody).to.contain("AR00003");
  });
});
