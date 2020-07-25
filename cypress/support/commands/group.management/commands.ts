import { CONFIG } from "../../config";

/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      grpGetGroupByName(params: {sessionId: string; employeeId: string;  groupName: string}): Chainable<Subject>;
      grpNavigateToGroupManagement(): Chainable;
      grpClickAddGroup(): Chainable;
      grpSelectOfficial(): Chainable;
      grpEnterGroupName(params: {name: string}): Chainable;
      grpAssignUser(params: {name: string}): Chainable;
      grpSaveGroup(): Chainable;
      grpSelectGroup(params: {name: string}): Chainable;
      grpCloseDialog(): Chainable;
      grpSelectUnofficial(): Chainable;
    }
  }
}

Cypress.Commands.add("grpGetGroupByName", (params: {sessionId: string; employeeId: string;  groupName: string}) => {
  cy.request({
    method: "GET",
    url: `${CONFIG.BE_URL}/api/v1/groups`,
    qs: {
      groupName: params.groupName,
    },
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
  }).then((response) => response);
});

Cypress.Commands.add("grpNavigateToGroupManagement", () => {
  cy.get("[data-cy=\"navigation.groupManagement\"]").click();
});

Cypress.Commands.add("grpClickAddGroup", () => {
  cy.get("#Group-openDialog").click();
});

Cypress.Commands.add("grpSelectOfficial", () => {
  cy.get("#Group-officialOption").click();
});

Cypress.Commands.add("grpEnterGroupName", (params: {name: string}) => {
  cy.get("#Group-groupName").type(params.name);
});

Cypress.Commands.add("grpAssignUser", (params: {name: string}) => {
  cy.get("#Group-members").type(params.name);
  cy.get("#Group-members>div>div>div[id^=react-select]").contains(params.name).click();
});

Cypress.Commands.add("grpSaveGroup", () => {
  cy.get("#Group-createGroup").click();
  cy.get("#DialogContent-close").click();
});

Cypress.Commands.add("grpSelectGroup", (params: {name: string}) => {
  cy.get("#clearFilter").click();
  cy.get("#groupName").type(params.name);
  cy.get(".ReactVirtualized__Table__rowColumn").contains(params.name).click();
  cy.grpCloseDialog();
});

Cypress.Commands.add("grpCloseDialog", () => {
  cy.get("#DialogContent-close").click();
});

Cypress.Commands.add("grpSelectUnofficial", () => {
  cy.get("#Group-unofficialOption").click();
});
