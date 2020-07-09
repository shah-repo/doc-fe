import { CONFIG } from "../../config";

/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      getGroupByName(params: {sessionId: string; employeeId: string;  groupName: string}): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("getGroupByName", (params: {sessionId: string; employeeId: string;  groupName: string}) => {
  cy.request({
    method: "GET",
    url: `${CONFIG.BE_URL}/api/v1/groups?groupName=${params.groupName}`,
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
    timeout: 10 * 1000,
  }).then((response) => response);
});
