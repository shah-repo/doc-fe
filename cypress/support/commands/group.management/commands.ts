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
      grpSetPermissionsFilter(params: { permission: string }): Chainable;
      grpSetTagsFilter(params: { tag: string }): Chainable;
      grpSetMembersFilter(params: { member: string }): Chainable;
      grpSetTypeFilter(params: { type: string }): Chainable;
      grpFilterByName(params: { name: string }): Chainable;
      grpClickEditGroupWithName(params: { name: string }): Chainable;
      grpFilterByMembers(params: { member: string }): Chainable;
      grpFilterByType(params: { type: string }): Chainable;
      grpCheckIfNameFilterIsEmpty(): Chainable;
      grpCheckIfMembersFilterIsEmpty(): Chainable;
      grpCheckIfTypeFilterIsEmpty(): Chainable;
      grpCheckIfNameFilterIsSet(params: { name: string }): Chainable;
      grpCheckIfMembersFilterIsSet(params: { member: string }): Chainable;
      grpCheckIfTypeFilterIsSet(params: { groupType: string }): Chainable;
      grpCheckIfPermissionFilterIsSet(params: { permission: string }): Chainable;
      grpCheckIfTagFilterIsSet(params: { tag: string }): Chainable;
      grpNavigateToDashboard(): Chainable;
      grpCheckIfGroupTypeExists(params: { type: string }): Chainable;
      grpClickAddGroup(): Chainable;
      grpSelectOfficial(): Chainable;
      grpEnterGroupName(params: { name: string }): Chainable;
      grpAssignUser(params: { name: string }): Chainable;
      grpRemoveUser(params: { name: string }): Chainable;
      grpAssignUserDialog(params: { name: string }): Chainable;
      grpRemoveUserDialog(params: { name: string }): Chainable;
      grpSaveGroup(): Chainable;
      grpSaveGroupPatch(): Chainable;
      grpSelectGroupWithoutClosingDialog(params: { name: string }): Chainable;
      grpSelectGroup(params: { name: string }): Chainable;
      grpCloseDialog(): Chainable;
      grpSelectUnofficial(): Chainable;
      grpTypeMembers(...names: string[]): Chainable<Subject>;
      grpAddParentGroups(...groups: string[]): Chainable<Subject>;
      grpCloseGroupBtn(): Chainable<Subject>;
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
  cy.wrapWithWaitOnApiCalls([CyRoutes.EmployeesGet, CyRoutes.GroupsGet], () => {
    cy.get("[data-cy=\"navigation.groupManagement\"]").arrowClick();
  });
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("grpAddTag", (params: {tag: string}) => {
  cy.get(`td[role="gridcell"] input`).eq(3).scrollIntoView().arrowType(params.tag);
  cy.get("li.k-item").contains(params.tag).arrowClick();
});

Cypress.Commands.add("grpAddPermission", (params: {permission: string}) => {
  cy.get(`td[role="gridcell"] input`).eq(2).arrowType(params.permission);
  cy.get("li.k-item").contains(params.permission).arrowClick();
});

Cypress.Commands.add("grpVerifyGroupNameIsPresentOnFirstGroup", () => {
  cy.get("tr.k-master-row").first().find("td").eq(1).should("not.be.empty");
});

Cypress.Commands.add("grpVerifyGroupMembersIsPresentOnFirstGroup", () => {
  cy.get("tr.k-master-row").first().find("td").eq(2).should("not.be.empty");
});

Cypress.Commands.add("grpVerifyGroupTypeIsPresentOnFirstGroup", () => {
  cy.get("tr.k-master-row").first().find("td").eq(0).should("not.be.empty");
});

Cypress.Commands.add("grpSetNameFilter", (params: {name: string}) => {
  cy.get(`[aria-colindex="2"] input`).arrowType(params.name).wait(500);
});

Cypress.Commands.add("grpSetMembersFilter", (params: {member: string}) => {
  cy.get(`[aria-colindex="3"] input`).arrowType(params.member);
});

Cypress.Commands.add("grpSetTypeFilter", (params: {type: string}) => {
  cy.get(`[aria-colindex="1"] [class="k-input"]`).arrowClick();
  cy.get("li").contains(params.type).arrowClick().wait(500);
});

Cypress.Commands.add("grpSetPermissionsFilter", (params: {permission: string}) => {
  cy.get(`[aria-colindex="4"] input`).arrowType(params.permission).wait(500);
});

Cypress.Commands.add("grpSetTagsFilter", (params: {tag: string}) => {
  cy.get(`[aria-colindex="5"] input`).arrowType(params.tag).wait(500);
});

Cypress.Commands.add("grpClearFilter", () => {
  cy.get("#clearFilter").arrowClick();
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("grpFilterByName", (params: { name: string }) => {
  cy.grpClearFilter();
  cy.grpSetNameFilter(params);
  cy.get("tr.k-master-row").first().find("td").eq(1).should("have.text", params.name);
});

Cypress.Commands.add("grpFilterByMembers", (params: { member: string }) => {
  cy.grpClearFilter();
  cy.grpSetMembersFilter(params);
  cy.get("tr.k-master-row").first().find("td").eq(2).should("contain.text", params.member);
});

Cypress.Commands.add("grpFilterByType", (params: { type: string }) => {
  cy.grpClearFilter();
  cy.grpSetTypeFilter(params);
  cy.get("tr.k-master-row").first().find("td").eq(0).should("have.text", params.type);
});

Cypress.Commands.add("grpCheckIfNameFilterIsEmpty", () => {
  cy.get(`[aria-colindex="2"] input`).should("be.empty");
});

Cypress.Commands.add("grpCheckIfMembersFilterIsEmpty", () => {
  cy.get(`[aria-colindex="3"] input`).should("be.empty");
});

Cypress.Commands.add("grpCheckIfTypeFilterIsEmpty", () => {
  cy.get(`[aria-colindex="1"] [class="k-input"]`).should("have.text", "All");
});

Cypress.Commands.add("grpCheckIfNameFilterIsSet", (params: { name: string }) => {
  cy.get(`[aria-colindex="2"] input`).should("have.value", params.name);
});

Cypress.Commands.add("grpCheckIfMembersFilterIsSet", (params: { member: string }) => {
  cy.get(`[aria-colindex="3"] input`).should("have.value", params.member);
});

Cypress.Commands.add("grpCheckIfTypeFilterIsSet", (params: { groupType: string }) => {
  cy.get(`[aria-colindex="1"] [class="k-input"]`).should("have.text", params.groupType);
});

Cypress.Commands.add("grpCheckIfPermissionFilterIsSet", (params: { permission: string }) => {
  cy.get(`[aria-colindex="4"] input`).should("have.value", params.permission);
});

Cypress.Commands.add("grpCheckIfTagFilterIsSet", (params: { tag: string }) => {
  cy.get(`[aria-colindex="5"] input`).should("have.value", params.tag);
});

Cypress.Commands.add("grpNavigateToDashboard", () => {
  cy.get("[data-cy=\"navigation.dashboard\"]").arrowClick();
});

Cypress.Commands.add("grpCheckIfGroupTypeExists", (params: { type: string }) => {
  cy.get(`[aria-colindex="1"] [class="k-input"]`).arrowClick();
  cy.get("li").should("contain.text", params.type);
  cy.get("li").contains(params.type).arrowClick();
});
Cypress.Commands.add("grpClickAddGroup", () => cy.get("button[data-cy=\"Group-openDialog\"]").arrowClick());

Cypress.Commands.add("grpSelectOfficial", () => {
  cy.get(`td[role="gridcell"] span.k-input`).arrowClick();
  cy.get("li").contains("Official").arrowClick();
});

Cypress.Commands.add("grpEnterGroupName", (params: { name: string }) => {
  cy.get(`td[role="gridcell"] input`).eq(0).clear().arrowType(params.name);
});

Cypress.Commands.add("grpAssignUser", (params: { name: string }) => {
  cy.get(`td[role="gridcell"] input`).eq(1).arrowType(params.name);
  cy.get("li.k-item").contains(params.name).arrowClick();
});

Cypress.Commands.add("grpAssignUserDialog", (params: { name: string }) => {
  cy.get("#Group-members").arrowType(params.name);
  cy.get("#Group-members>div>div>div[id^=react-select]").contains(params.name).arrowClick();
});

Cypress.Commands.add("grpRemoveUser", (params: { name: string }) => {
  cy.get(`ul>li>span`).contains(params.name).parent().find(`span[aria-label="delete"]`).arrowClick();
});

Cypress.Commands.add("grpRemoveUserDialog", (params: { name: string }) => {
  cy.xpath(`//div[@id="Group-members"]//div[text()="${params.name}"]/../div[2]`).arrowClick();
});

Cypress.Commands.add("grpSaveGroup", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.GroupsPost, CyRoutes.GroupsGet], () => {
    cy.get(`td[role="gridcell"] button`).eq(0).arrowClick();
  });
  cy.checkToastMessage({ exists: false });
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("grpSaveGroupPatch", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GroupsPatch, () => {
    cy.get("#Group-createGroup").arrowClick();
  });
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("grpSelectGroup", (params: {name: string}) => {
  cy.grpClearFilter();
  cy.get(`[aria-colindex="2"] input`).arrowType(params.name).wait(500);
  cy.get("tr.k-master-row").first().find("td").last().find("button").arrowClick();
  cy.grpCloseDialog();
});

Cypress.Commands.add("grpClickEditGroupWithName", (params: {name: string}) => {
  cy.get("tr.k-master-row").contains(params.name).parents("tr").find("button").arrowClick();
});

Cypress.Commands.add("grpSelectGroupWithoutClosingDialog", (params: {name: string}) => {
  cy.grpClearFilter();
  cy.get(`[aria-colindex="2"] input`).arrowType(params.name).wait(500);
  cy.get("tr.k-master-row").first().find("td").last().find("button").arrowClick();
});

Cypress.Commands.add("grpCloseDialog", () => {
  cy.get("#DialogContent-close").arrowClick();
});

Cypress.Commands.add("grpSelectUnofficial", () => {
  cy.get(`td[role="gridcell"] span.k-input`).arrowClick();
  cy.get("li").contains("Unofficial").arrowClick();
});

Cypress.Commands.add("grpTypeMembers", (...names: string[]) => {
  names.forEach((name) => {
    cy.get(`td[role="gridcell"] input`).eq(1).arrowType(name);
    cy.get("li.k-item").contains(name).arrowClick();
    cy.wait(500);
    cy.landingPageLoadingElementShouldNotExist();
  });
});

Cypress.Commands.add("grpAddParentGroups", (...groups: string[]) => {
  groups.forEach((name) => {
    cy.get(`td[role="gridcell"] input`).eq(4).scrollIntoView().arrowType(name);
    cy.get("li.k-item").contains(name).arrowClick();
  });
});

Cypress.Commands.add("grpCloseGroupBtn", () => cy.get("[data-cy=\"DialogContent-close\"]").arrowClick());

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
  const hasFifteenOrLess = new RegExp("^([^,]+,){0,14}[^,]+$|^(?![\s\S])");
  cy.get(`td[role=gridcell]:nth-child(3)`).each((element) => {
    expect(element.text()).to.match(hasFifteenOrLess);
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
