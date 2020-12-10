import { int } from "aws-sdk/clients/datapipeline";
import { CONFIG } from "../../config";
import { CyRoutes } from "../../routes";
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      grpGetGroupByName(params: { sessionId: string; employeeId: string; groupName: string }): Chainable<Subject>;
      grpNavigateToGroupManagement(): Chainable;
      grpVerifyGroupNameIsPresentOnFirstGroup(): Chainable;
      grpVerifyGroupMembersIsPresentOnFirstGroup(): Chainable;
      grpVerifyGroupTypeIsPresentOnFirstGroup(): Chainable;
      grpSetNameFilter(params: { name: string }): Chainable;
      grpSetMembersFilter(params: { member: string }): Chainable;
      grpSetTypeFilter(params: { type: string }): Chainable;
      grpFilterByName(params: { name: string }): Chainable;
      grpFilterByMembers(params: { member: string }): Chainable;
      grpFilterByType(params: { type: string }): Chainable;
      grpCheckIfNameFilterIsEmpty(): Chainable;
      grpCheckIfMembersFilterIsEmpty(): Chainable;
      grpCheckIfTypeFilterIsEmpty(): Chainable;
      grpCheckIfNameFilterIsSet(params: { name: string }): Chainable;
      grpCheckIfMembersFilterIsSet(params: { member: string }): Chainable;
      grpCheckIfTypeFilterIsSet(params: { isOfficial: boolean }): Chainable;
      grpNavigateToDashboard(): Chainable;
      grpCheckIfGroupTypeExists(params: { type: string }): Chainable;
      grpClickAddGroup(): Chainable;
      grpSelectOfficial(): Chainable;
      grpEnterGroupName(params: { name: string }): Chainable;
      grpAssignUser(params: { name: string }): Chainable;
      grpRemoveUser(params: { item: int }): Chainable;
      grpSaveGroup(): Chainable;
      grpSaveGroupPatch(): Chainable;
      grpSelectGroupWithoutClosingDialog(params: { name: string }): Chainable;
      grpSelectGroup(params: { name: string }): Chainable;
      grpCloseDialog(): Chainable;
      grpSelectUnofficial(): Chainable;
      grpTypeMembers(...names: string[]): Chainable<Subject>;
      grpAddParentGroups(...groups: string[]): Chainable<Subject>;
      grpCloseGroupBtn(): Chainable<Subject>;
      grpAddGroup(): Chainable<Subject>;
      grpAPICreateNewGroup(params: {payload: any; employeeId: string;  sessionId: string}): Chainable<Subject>;
      grpCheckForNumberOfGroupMembersDisplayed(): Chainable;
      grpClearFilter(): Chainable;
      grpGetGroups(params: {sessionId: string; employeeId: string}): Chainable;
      grpAdminPatchGroup(params: {sessionId: string; groupId: string; companyId: string; payload: any}): Chainable;
      grpAdminPostGroup(params: {sessionId: string; companyId: string; payload: any}): Chainable;
      grpDeleteGroup(params: {sessionId: string;employeeId: string; groupId: string}): Chainable;
      grpAddTag(params: {tag: string}): Chainable;
      grpAddPermission(params: {permission: string}): Chainable;
      grpPatchGroup(params: {
        groupId: string;
        payload: any;
        employeeId: string;
        sessionId: string;}): Chainable<Subject>;
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

Cypress.Commands.add("grpGetGroups", (params: {sessionId: string; employeeId: string;  groupName: string}) => {
  cy.request({
    method: "GET",
    url: `${CONFIG.BE_URL}/api/v1/groups`,
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
  }).then((response) => response.body);
});

Cypress.Commands.add("grpAdminPatchGroup", (params: {
  sessionId: string;
  groupId: string;
  companyId: string;
  payload: any;}) => {
  cy.request({
    method: "PATCH",
    url: `${CONFIG.BE_URL}/api/v1/groups/admin_update/group/${params.groupId}/company/${params.companyId}`,
    body: params.payload,
    headers: {
      Authorization: `bearer_admin ${params.sessionId}`,
    },
  }).then((response) => response.body);
});

Cypress.Commands.add("grpAdminPostGroup", (params: {
  sessionId: string;
  companyId: string;
  payload: any;}) => {
  cy.request({
    method: "POST",
    url: `${CONFIG.BE_URL}/api/v1/groups/admin_create/${params.companyId}`,
    body: params.payload,
    headers: {
      Authorization: `bearer_admin ${params.sessionId}`,
    },
  }).then((response) => response.body);
});

Cypress.Commands.add("grpDeleteGroup", (params: {
  sessionId: string;
  employeeId: string;
  groupId: string;}) => {
  cy.request({
    method: "DELETE",
    url: `${CONFIG.BE_URL}/api/v1/groups/${params.groupId}`,
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
  }).then((response) => response.body);
});

Cypress.Commands.add("grpNavigateToGroupManagement", () => {
  cy.get("[data-cy=\"navigation.groupManagement\"]").click();
});

Cypress.Commands.add("grpAddTag", (params: {tag: string}) => {
  cy.get("#Group-addTags").type(params.tag);
  cy.get("#Group-addTags>div>div>div[id^=react-select]").contains(params.tag).click();
});

Cypress.Commands.add("grpAddPermission", (params: {permission: string}) => {
  cy.get("#Group-permissions").type(params.permission);
  cy.get("#Group-permissions>div>div>div[id^=react-select]").contains(params.permission).click();
});

Cypress.Commands.add("grpVerifyGroupNameIsPresentOnFirstGroup", () => {
  cy.get("div[aria-rowindex=1]")
    .within(() => {
      cy.get("div.ReactVirtualized__Table__rowColumn:first-child>div>div>div").should("not.be.empty");
    });
});

Cypress.Commands.add("grpVerifyGroupMembersIsPresentOnFirstGroup", () => {
  cy.get("div[aria-rowindex=1]")
    .within(() => {
      cy.get("div.ReactVirtualized__Table__rowColumn:nth-child(2)>div>div>div").should("not.be.empty");
    });
});

Cypress.Commands.add("grpVerifyGroupTypeIsPresentOnFirstGroup", () => {
  cy.get("div[aria-rowindex=1]")
    .within(() => {
      cy.get("div.ReactVirtualized__Table__rowColumn:nth-child(3)>div>div>div").should("not.be.empty");
    });
});

Cypress.Commands.add("grpSetNameFilter", (params: {name: string}) => {
  cy.wrapWithWaitOnApiCall(
    CyRoutes.GroupsGet,
    () => {
      cy.get("#groupName").type(params.name);
    });
});

Cypress.Commands.add("grpSetMembersFilter", (params: {member: string}) => {
  cy.wrapWithWaitOnApiCall(
    CyRoutes.GroupsGet,
    () => {
      cy.get("#userName").type(params.member);
    });
});

Cypress.Commands.add("grpSetTypeFilter", (params: {type: string}) => {
  cy.wrapWithWaitOnApiCall(
    CyRoutes.GroupsGet,
    () => {
      cy.get("#mui-component-select-isOfficial").click();
      cy.get("#menu-isOfficial>div>ul>li>span").contains(params.type).click();
    });
});

Cypress.Commands.add("grpClearFilter", (params: { name: string }) => {
  cy.wrapWithWaitOnApiCall(
    CyRoutes.GroupsGetClearFilter,
    () => {
      cy.get("#clearFilter").click();
    });
});

Cypress.Commands.add("grpFilterByName", (params: { name: string }) => {
  cy.grpClearFilter();
  cy.grpSetNameFilter(params);
  cy.get("div[aria-rowindex=1]")
    .within(() => {
      cy.get("div.ReactVirtualized__Table__rowColumn:first-child>div>div>div")
        .should("have.text", params.name);
    });
});

Cypress.Commands.add("grpFilterByMembers", (params: { member: string }) => {
  cy.grpClearFilter();
  cy.grpSetMembersFilter(params);
  cy.get("div[aria-rowindex=1]")
    .within(() => {
      cy.get("div.ReactVirtualized__Table__rowColumn:nth-child(2)>div>div>div")
        .should("have.text", params.member);
    });
});

Cypress.Commands.add("grpFilterByType", (params: { type: string }) => {
  cy.grpClearFilter();
  cy.grpSetTypeFilter(params);
  cy.get("div[aria-rowindex=1]")
    .within(() => {
      cy.get("div.ReactVirtualized__Table__rowColumn:nth-child(3)>div>div>div")
        .should("have.text", params.type);
    });
});

Cypress.Commands.add("grpCheckIfNameFilterIsEmpty", () => {
  cy.get("#groupName").should("be.empty");
});

Cypress.Commands.add("grpCheckIfMembersFilterIsEmpty", () => {
  cy.get("#userName").should("be.empty");
});

Cypress.Commands.add("grpCheckIfTypeFilterIsEmpty", () => {
  cy.get("#isOfficial").should("be.empty");
});

Cypress.Commands.add("grpCheckIfNameFilterIsSet", (params: { name: string }) => {
  cy.get("#groupName").should("have.value", params.name);
});

Cypress.Commands.add("grpCheckIfMembersFilterIsSet", (params: { member: string }) => {
  cy.get("#userName").should("have.value", params.member);
});

Cypress.Commands.add("grpCheckIfTypeFilterIsSet", (params: { isOfficial: boolean }) => {
  cy.get("#isOfficial").should("have.value", String(params.isOfficial));
});

Cypress.Commands.add("grpNavigateToDashboard", () => {
  cy.get("[data-cy=\"navigation.dashboard\"]").click();
});

Cypress.Commands.add("grpCheckIfGroupTypeExists", (params: { type: string }) => {
  cy.get("#mui-component-select-isOfficial").click();
  cy.get("#menu-isOfficial>div>ul>li>span").should("contain.text", params.type);
  cy.get("#menu-isOfficial>div>ul>li>span").contains(params.type).click();
});
Cypress.Commands.add("grpClickAddGroup", () => cy.get("button[data-cy=\"Group-openDialog\"]").click());

Cypress.Commands.add("grpSelectOfficial", () => {
  cy.get("#Group-officialOption").click();
});

Cypress.Commands.add("grpEnterGroupName", (params: { name: string }) => {
  cy.get(`[data-cy="Group-groupName"]`).type(params.name);
});

Cypress.Commands.add("grpAssignUser", (params: { name: string }) => {
  cy.get("#Group-members").type(params.name);
  cy.get("#Group-members>div>div>div[id^=react-select]").contains(params.name).click();
});

Cypress.Commands.add("grpRemoveUser", (params: { item: int }) => {
  cy.get("[class=\"circle_remove\"]").eq(params.item).click({ force: true });
});

Cypress.Commands.add("grpSaveGroup", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GroupsPost, () => {
    cy.get("#Group-createGroup").click();
  });
  cy.get("#DialogContent-close").click();
});

Cypress.Commands.add("grpSaveGroupPatch", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GroupsPatch, () => {
    cy.get("#Group-createGroup").click();
  });
});

Cypress.Commands.add("grpSelectGroup", (params: {name: string}) => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GroupsGet, () => {
    cy.get("#clearFilter").click();
  });
  cy.wrapWithWaitOnApiCall(CyRoutes.GroupsGet, () => {
    cy.get("#groupName").type(params.name);
  });
  cy.get(".ReactVirtualized__Table__rowColumn").contains(params.name).click();
  cy.grpCloseDialog();
});

Cypress.Commands.add("grpSelectGroupWithoutClosingDialog", (params: {name: string}) => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GroupsGet, () => {
    cy.get("#clearFilter").click();
  });
  cy.wrapWithWaitOnApiCall(CyRoutes.GroupsGet, () => {
    cy.get("#groupName").type(params.name);
  });
  cy.get(".ReactVirtualized__Table__rowColumn").contains(params.name).click();
});

Cypress.Commands.add("grpCloseDialog", () => {
  cy.get("#DialogContent-close").click();
});

Cypress.Commands.add("grpSelectUnofficial", () => {
  cy.get("#Group-unofficialOption").click();
});

Cypress.Commands.add("grpTypeMembers", (...names: string[]) => {
  names.forEach((name) => {
    cy.get(`#Group-members`).type(`${name}{enter}`);
  });
});

Cypress.Commands.add("grpAddParentGroups", (...groups: string[]) => {
  groups.forEach((name) => {
    cy.get(`#Group-addParentGroups`).type(`${name}{enter}`);
  });
});

Cypress.Commands.add("grpCloseGroupBtn", () => cy.get("[data-cy=\"DialogContent-close\"]").click());

Cypress.Commands.add("grpAddGroup", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GroupsPost, () => {
    cy.get("[data-cy=\"Group-createGroup\"]").click();
  });
});

Cypress.Commands.add("grpAPICreateNewGroup", (params: {
  payload: any;
  employeeId: string;
  sessionId: string;
}) => {
  cy.request({
    method: "POST",
    url: `${CONFIG.BE_URL}/api/v1/groups`,
    body: params.payload,
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
  }).then((response) => response.body);
});

Cypress.Commands.add("grpCheckForNumberOfGroupMembersDisplayed", () => {
  const hasFifteenOrLess = new RegExp("^([^,]+,){0,14}[^,]+$");
  const hasZero = new RegExp("");
  cy.get(".ReactVirtualized__Table__row > div:nth-child(2) > div > div > div").each((element) => {
    expect(element.text()).to.match(hasFifteenOrLess || hasZero);
  });
});

Cypress.Commands.add("grpPatchGroup", (params: {
  groupId: string;
  employeeId: string;
  sessionId: string;
  payload: any; }) =>
{
  cy.request({
    method: "PATCH",
    url: `${CONFIG.BE_URL}/api/v1/groups/${params.groupId}`,
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
    body: params.payload,
  }).then((response) => response ? response.body : {})
    .then((response) => JSON.stringify(response));
});
