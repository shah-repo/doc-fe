import { CONFIG } from "../../config";
/* eslint-disable @typescript-eslint/no-namespace */

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      usrAdminPatchEmployee(params: {sessionId: string;
        employeeId: string;
        companyId: string;
        payload: any;}): Chainable;
      usrAdminGetUsers(params: {sessionId: string}): Chainable;
      usrAdminPatchUser(params: {sessionId: string; userId: string; payload: any}): Chainable;
    }
  }
}

Cypress.Commands.add("usrAdminPatchEmployee", (params: {
  sessionId: string;
  employeeId: string;
  companyId: string;
  payload: any;}) => {
  cy.request({
    method: "PATCH",
    url: `${CONFIG.BE_URL}/api/v1/employees/admin_update/${params.employeeId}/company/${params.companyId}`,
    body: params.payload,
    headers: {
      Authorization: `bearer_admin ${params.sessionId}`,
    },
  }).then((response) => response.body);
});

Cypress.Commands.add("usrAdminGetUsers", (params: {sessionId: string}) => {
  cy.request({
    method: "GET",
    url: `${CONFIG.BE_URL}/api/v1/users`,
    headers: {
      Authorization: `bearer_admin ${params.sessionId}`,
    },
  }).then((response) => response.body);
});

Cypress.Commands.add("usrAdminPatchUser", (params: {
  sessionId: string;
  userId: string;
  payload: any;}) => {
  cy.request({
    method: "PATCH",
    url: `${CONFIG.BE_URL}/api/v1/users/${params.userId}`,
    body: params.payload,
    headers: {
      Authorization: `bearer_admin ${params.sessionId}`,
    },
  }).then((response) => response.body);
});
