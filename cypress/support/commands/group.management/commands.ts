import { CONFIG } from "../../config";

/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      grpGetGroupByName(params: { sessionId: string; employeeId: string; groupName: string }): Chainable<Subject>;
      grpNavigate(): Chainable<Subject>;
      grpAddGroupBtn(): Chainable<Subject>;
      grpCloseGroupBtn(): Chainable<Subject>;
      grpAddGroup(): Chainable<Subject>;
      grpOfficialGroupType(params: { isOfficial: boolean }): Chainable<Subject>;
      grpTypeGroupName(params: { name: string }): Chainable<Subject>;
      grpTypeMembers(...names: string[]): Chainable<Subject>;
      grpAddParentGroups(...groups: string[]): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("grpGetGroupByName", (params: { sessionId: string; employeeId: string; groupName: string }) => {
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

Cypress.Commands.add("grpNavigate", () => cy.get("[data-cy=\"navigation.groupManagement\"]").click());

Cypress.Commands.add("grpAddGroupBtn", () => cy.get("[data-cy=\"Group-openDialog\"]").click());

Cypress.Commands.add("grpCloseGroupBtn", () => cy.get("[data-cy=\"DialogContent-close\"]").click());

Cypress.Commands.add("grpAddGroup", () => cy.get("[data-cy=\"Group-createGroup\"]").click());

Cypress.Commands.add("grpOfficialGroupType", (params: { isOfficial: boolean }) =>
  cy.get(`[data-cy=\"Group-${params.isOfficial ? 'official' : 'unofficial'}Option\"]`).click());

Cypress.Commands.add("grpTypeGroupName", (params: { name: string }) =>
  cy.get(`[data-cy=\"Group-groupName\"]`).type(params.name));

Cypress.Commands.add("grpTypeMembers", (...names: string[]) => {
  names.forEach(name => cy.get(`#Group-members`).type(`${name}{enter}`));
})

Cypress.Commands.add("grpAddParentGroups", (...groups: string[]) => {
  groups.forEach(name => cy.get(`#Group-addParentGroups`).type(`${name}{enter}`));
})