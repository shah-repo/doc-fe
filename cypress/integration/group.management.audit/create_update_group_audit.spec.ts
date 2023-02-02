// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { momentInPST } from "../../utils/constants/dateHandler";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";


let createdCompany;
let loginResponse;
let adminEmployee;
let secondEmployee;
let thirdEmployee;
let currentDate;
let developersGroup;
let companyGroups;
let companyAdminGroup;

context("Group Creation Flow", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  context("[API]Prepare company", () => {
    it("[API]Creates company", (done: any) => {
      cy.authApiLogin({
        email: CONFIG.SUPERADMIN_EMAIL,
        password: CONFIG.SUPERADMIN_PASSWORD,
      }).then((response) => {
        loginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: USERS[1].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          thirdEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[3].email);
          done();
        });
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Get group", (done: any) => {
      cy.grpGetGroups({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        companyGroups = response;
        developersGroup = companyGroups.find((group) => group.name === "Developers");
        companyAdminGroup = companyGroups.find((group) => group.name === "Company Admin");
        done();
      });
    });

    it("[API] Create group with access to restricted doc_types", (done: any) => {
      cy.grpAPICreateNewGroup({
        payload: {
          name: "API group",
          tags: ["CREATE_DOCS_OF_RESTRICTED_DOC_TYPES", "OWNERSHIP_CHANGE"],
          isOfficial: true,
          permissions: ["DEVELOPERS", "GROUP_DELETE"],
          defaultForNewUsers: false,
          parents: [{ id: developersGroup.id }, { id: companyAdminGroup.id }],
          employees: [{ id: secondEmployee.id }, { id: thirdEmployee.id }],
        },
        employeeId: adminEmployee.id,
        sessionId: loginResponse.sessionId,
      }).then(() => done());
      currentDate = momentInPST().format("MMM D, YYYY hh:m");
    });
  });

  context("Login company admin", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Navigates to Group management", () => {
    it("Navigates to Group management", () => {
      cy.grpNavigateToGroupManagement();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Check history button is visible", () => {
    it("Check history button is visible", () => {
      cy.grpVerifyHistoryButton();
    });

    it("Open history panel", () => {
      cy.grpHistoryClickOpenButton();
    });

    it("Verify last entry in history panel", () => {
      cy.get("[class=\"MuiListItemText-root MuiListItemText-multiline\"]").eq(2)
        .contains("Server Automation").should("exist");
      cy.get("[class=\"MuiListItemText-root MuiListItemText-multiline\"]>span").eq(1).contains(currentDate)
        .should("exist");
    });

    it("Verify latest entry in history panel", () => {
      cy.usrHistoryVerifyCreator({ name: USERS[1].name });
      cy.usrHistoryVerifyCurrentDate({ dateTime: currentDate });
      cy.grpHistoryVerifyAddedGroup({ name: "API group" });
      cy.grpHistoryVerifyAddedMember(USERS[2].name, USERS[3].name);
      cy.grpHistoryVerifyAddedPermissions("DEVELOPERS", "GROUP_DELETE");
      cy.grpHistoryVerifyAddedTags("CREATE_DOCS_OF_RESTRICTED_DOC_TYPES", "OWNERSHIP_CHANGE");
      cy.grpHistoryVerifyAddedParentGroups("Company Admin", "Developers");
    });

    it("Close history panel", () => {
      cy.grpHistoryClickCloseButton();
    });
  });

  context("Create first official group", () => {
    it("Clicks on 'Add Group'", () => {
      cy.grpClickAddGroup();
    });

    it("Selects the 'official' options", () => {
      cy.grpSelectOfficial();
    });

    it("Enters group name", () => {
      cy.grpEnterGroupName({ name: "Group A" });
    });

    it("Assigns user to the group", () => {
      cy.grpTypeMembers(USERS[1].name, USERS[2].name);
    });

    it("Assigns permissions to the group", () => {
      cy.grpAddPermission({ permission: "DOCUMENT_OWNER_CHANGE" });
      cy.grpAddPermission({ permission: "GROUP_CREATE_UNOFFICIAL" });
    });

    it("Assigns tags to the group", () => {
      cy.grpAddTag({ tag: "OWNERSHIP_CHANGE" });
      cy.grpAddTag({ tag: "USER_MANAGEMENT" });
    });

    it("Add parent group: Everyone", () => {
      cy.grpAddParentGroups("Everyone", "Can be approver");
    });

    it("Saves the group", () => {
      cy.grpSaveGroup();
      currentDate = momentInPST().format("MMM D, YYYY hh:m");
    });
  });

  context("Check if the history is created for first official group", () => {
    SystemRequirement("REQ-2640", "REQ-5240");
    context("Check history in group managment page", () => {
      it("Open history panel", () => {
        cy.grpHistoryClickOpenButton();
      });

      it("Verify creator of group", () => {
        cy.usrHistoryVerifyCreator({ name: USERS[1].name });
      });

      it("Verify group creation datetime", () => {
        cy.usrHistoryVerifyCurrentDate({ dateTime: currentDate });
      });

      it("Verify added group's name", () => {
        cy.grpHistoryVerifyAddedGroup({ name: "Group A" });
      });

      it("Verify members added in group", () => {
        cy.grpHistoryVerifyAddedMember(USERS[1].name, USERS[2].name);
      });

      it("Verify permission added for group", () => {
        cy.grpHistoryVerifyAddedPermissions("DOCUMENT_OWNER_CHANGE", "GROUP_CREATE_UNOFFICIAL");
      });

      it("Verify tags added for group", () => {
        cy.grpHistoryVerifyAddedTags("OWNERSHIP_CHANGE", "USER_MANAGEMENT");
      });

      it("Verify parent groups added for group", () => {
        cy.grpHistoryVerifyAddedParentGroups("Everyone", "Can be approver");
      });

      it("Close history panel", () => {
        cy.grpHistoryClickCloseButton();
      });
    });

    context("Check history in user managment page", () => {
      it("Navigates to user management", () => {
        cy.usrNavigateToUserManagement();
      });

      it("Open history panel", () => {
        cy.usrHistoryClickOpenButton();
      });

      it("Verify creator of group", () => {
        cy.usrHistoryVerifyCreator({ name: USERS[1].name });
      });

      it("Verify group creation datetime", () => {
        cy.usrHistoryVerifyCurrentDate({ dateTime: currentDate });
      });

      it("Verify members added in group", () => {
        cy.usrHistoryAddedMemberToGroup(USERS[1].name, USERS[2].name);
      });

      it("Verify added group's name", () => {
        cy.usrHistoryVerifyAddedToGroup({ groupName: "Group A" });
      });

      it("Close history panel", () => {
        cy.usrHistoryClickCloseButton();
      });
    });
  });

  context("Create second official group and click cancel", () => {
    it("Navigates to Group management", () => {
      cy.grpNavigateToGroupManagement();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Clicks on 'Add Group'", () => {
      cy.grpClickAddGroup();
    });

    it("Selects the 'official' options", () => {
      cy.grpSelectOfficial();
    });

    it("Enters group name", () => {
      cy.grpEnterGroupName({ name: "Group C" });
    });

    it("Assigns user to the group", () => {
      cy.grpTypeMembers(USERS[1].name, USERS[2].name);
    });

    it("Assigns permissions to the group", () => {
      cy.grpAddPermission({ permission: "DOCUMENT_OWNER_CHANGE" });
    });

    it("Assigns tags to the group", () => {
      cy.grpAddTag({ tag: "OWNERSHIP_CHANGE" });
    });

    it("Add parent group: Everyone", () => {
      cy.grpAddParentGroups("Everyone");
    });

    it("Click cancel without saving the group", () => {
      cy.grpCancelGroup();
    });
  });

  context("Check if the history is not created for canceled changes for Group C", () => {
    context("Check history in group managment page", () => {
      it("Open history panel", () => {
        cy.grpHistoryClickOpenButton();
      });

      it("Verify no new record is added", () => {
        cy.grpHistoryVerifyRecordsCount({ records: 3 });
      });

      it("Close history panel", () => {
        cy.grpHistoryClickCloseButton();
      });
    });

    context("Check history in user managment page", () => {
      it("Navigates to user management", () => {
        cy.usrNavigateToUserManagement();
      });

      it("Open history panel", () => {
        cy.usrHistoryClickOpenButton();
      });

      it("Verify no new record is added", () => {
        cy.usrHistoryVerifyRecordsCount({ records: 2 });
      });

      it("Close history panel", () => {
        cy.usrHistoryClickCloseButton();
      });
    });
  });

  context("Edit Group A and click save", () => {
    it("Navigates to Group management", () => {
      cy.grpNavigateToGroupManagement();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click edit button of Group A", () => {
      cy.cmpTurnOffAutosave();
      cy.grpClickEditGroupWithName({ name: "Group A" });
    });

    it("Edit group name", () => {
      cy.grpEditGroupName({ name: "Group A-1" });
    });

    it(`Remove ${USERS[2].name} From Group A`, () => {
      cy.grpEditRemoveMembers(USERS[2].name);
    });

    it(`Add ${USERS[4].name} and ${USERS[5].name} in Group A`, () => {
      cy.grpEditAddMembers(USERS[4].name, USERS[5].name);
    });

    it("Remove one existing permission from the group", () => {
      cy.grpEditRemovePermissions("GROUP_CREATE_UNOFFICIAL");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add one new permission in the group", () => {
      cy.grpEditAddPermissions("DEVELOPERS", "EMPLOYEE_CREATE");
    });

    it("Remove one existing tag from the group", () => {
      cy.grpEditRemoveTags("USER_MANAGEMENT");
    });

    it("Add one new tag in the group", () => {
      cy.grpEditAddTags("GROUP_MANAGEMENT");
    });

    it("Remove one existing parent group from the group", () => {
      cy.grpEditRemoveParentGroups("Can be approver");
    });

    it("Add one new parent group in the group", () => {
      cy.grpEditAddParentGroups("Developers");
    });

    it("Saves the group", () => {
      cy.grpSaveGroupPatch();
      currentDate = momentInPST().format("MMM D, YYYY hh:m");
    });
  });

  context("Check if the history is created for edited 'Group A'", () => {
    SystemRequirement("REQ-2640", "REQ-5240");
    context("Check history in group managment page", () => {
      it("Open history panel", () => {
        cy.grpHistoryClickOpenButton();
      });

      it("Verify creator of group", () => {
        cy.usrHistoryVerifyCreator({ name: USERS[1].name });
      });

      it("Verify group creation datetime", () => {
        cy.usrHistoryVerifyCurrentDate({ dateTime: currentDate });
      });

      it("Verify group's name after edit", () => {
        cy.grpHistoryVerifyGroupNameUpdated({ oldGroupName: "Group A", newGroupName: "Group A-1" });
      });

      it("Verify removed member from group", () => {
        cy.grpHistoryVerifyRemovedMember(USERS[2].name);
      });

      it("verify added member in group", () => {
        cy.grpHistoryVerifyAddedMember(USERS[4].name, USERS[5].name);
      });

      it("Verify removed permissions from group", () => {
        cy.grpHistoryVerifyRemovedPermissions("GROUP_CREATE_UNOFFICIAL");
      });

      it("Verify added permissions in group", () => {
        cy.grpHistoryVerifyAddedPermissions("DEVELOPERS", "EMPLOYEE_CREATE");
      });

      it("Verify removed tags from group", () => {
        cy.grpHistoryVerifyRemovedTags("USER_MANAGEMENT");
      });

      it("Verify added tags in group", () => {
        cy.grpHistoryVerifyAddedTags("GROUP_MANAGEMENT");
      });

      it("Verify removed parent groups from group", () => {
        cy.grpHistoryVerifyRemovedParentGroups("Can be approver");
      });

      it("verify added parent groups in group", () => {
        cy.grpHistoryVerifyAddedParentGroups("Developers");
      });

      it("Close history panel", () => {
        cy.grpHistoryClickCloseButton();
      });
    });

    context("Check history in user managment page", () => {
      it("Navigates to user management", () => {
        cy.usrNavigateToUserManagement();
      });

      it("Open history panel", () => {
        cy.usrHistoryClickOpenButton();
      });

      it("Verify creator of group", () => {
        cy.usrHistoryVerifyCreator({ name: USERS[1].name });
      });

      it("Verify group edited datetime", () => {
        cy.usrHistoryVerifyCurrentDate({ dateTime: currentDate });
      });

      it("Verify added member in group", () => {
        cy.usrHistoryAddedMemberToGroup(USERS[4].name, USERS[5].name);
      });

      it("Verify member added to group", () => {
        cy.usrHistoryVerifyAddedToGroup({ groupName: "Group A-1" });
      });

      it("Verify removed member from group", () => {
        cy.usrHistoryRemovedMemberFromGroup(USERS[2].name);
      });

      it("Verify member removed from group", () => {
        cy.usrHistoryVerifyRemovedFromGroup({ groupName: "Group A-1" });
      });

      it("Close history panel", () => {
        cy.usrHistoryClickCloseButton();
      });
    });
  });

  context("Edit Group A again and click cancel", () => {
    it("Navigates to Group management", () => {
      cy.grpNavigateToGroupManagement();
    });

    it("Click edit button of Group A", () => {
      cy.grpClickEditGroupWithName({ name: "Group A" });
    });

    it("Edit group name", () => {
      cy.grpEditGroupName({ name: "Group A-1a" });
    });

    it(`Remove ${USERS[5].name} From Group A`, () => {
      cy.grpEditRemoveMembers(USERS[5].name);
    });

    it(`Add ${USERS[2].name} and ${USERS[0].name} in Group A`, () => {
      cy.grpEditAddMembers(USERS[2].name, USERS[3].name);
    });

    it("Remove one existing permission from the group", () => {
      cy.grpEditRemovePermissions("DEVELOPERS");
    });

    it("Add one new permission in the group", () => {
      cy.grpEditAddPermissions("GROUP_CREATE_UNOFFICIAL");
    });

    it("Remove one existing tag from the group", () => {
      cy.grpEditRemoveTags("OWNERSHIP_CHANGE");
    });

    it("Add one new tag in the group", () => {
      cy.grpEditAddTags("LABEL_TOOLTIPS");
    });

    it("Remove one existing parent group from the group", () => {
      cy.grpEditRemoveParentGroups("Developers");
    });

    it("Add one new parent group in the group", () => {
      cy.grpEditAddParentGroups("Company Admin");
    });

    it("Click cancel without saving the group", () => {
      cy.grpCloseDialog();
    });
  });

  context("Check if the history is not created for canceled changes for Group A", () => {
    context("Check history in group managment page", () => {
      it("Open history panel", () => {
        cy.grpHistoryClickOpenButton();
      });

      it("Verify no new record is added", () => {
        cy.grpHistoryVerifyRecordsCount({ records: 4 });
      });

      it("Close history panel", () => {
        cy.grpHistoryClickCloseButton();
      });
    });

    context("Check history in user managment page", () => {
      it("Navigates to user management", () => {
        cy.usrNavigateToUserManagement();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Open history panel", () => {
        cy.usrHistoryClickOpenButton();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify no new record is added", () => {
        cy.usrHistoryVerifyRecordsCount({ records: 3 });
      });

      it("Close history panel", () => {
        cy.usrHistoryClickCloseButton();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });
  });

  context("Edit existing group 'API group' and save", () => {
    it("Navigates to Group management", () => {
      cy.grpNavigateToGroupManagement();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click edit button of 'API group'", () => {
      cy.grpClickEditGroupWithName({ name: "API group" });
    });

    it("Edit group name", () => {
      cy.grpEditGroupName({ name: "API group-1" });
    });

    it(`Remove ${USERS[2].name} From 'API group'`, () => {
      cy.grpEditRemoveMembers(USERS[2].name);
    });

    it(`Add ${USERS[4].name} in 'API group'`, () => {
      cy.grpEditAddMembers(USERS[4].name);
    });

    it("Remove one existing permission from the group", () => {
      cy.grpEditRemovePermissions("DEVELOPERS");
    });

    it("Add one new permission in the group", () => {
      cy.grpEditAddPermissions("GROUP_CREATE_UNOFFICIAL");
    });

    it("Remove one existing tag from the group", () => {
      cy.grpEditRemoveTags("OWNERSHIP_CHANGE");
    });

    it("Add one new tag in the group", () => {
      cy.grpEditAddTags("LABEL_TOOLTIPS");
    });

    it("Remove one existing parent group from the group", () => {
      cy.grpEditRemoveParentGroups("Developers");
    });

    it("Add one new parent group in the group", () => {
      cy.grpEditAddParentGroups("Everyone");
    });

    it("Click cancel without saving the group", () => {
      cy.grpSaveGroupPatch();
      currentDate = momentInPST().format("MMM D, YYYY hh:m");
    });
  });

  context("Check if the history is created for edited existing group 'API group'", () => {
    context("Check history in group managment page", () => {
      it("Open history panel", () => {
        cy.grpHistoryClickOpenButton();
      });

      it("Verify creator of group", () => {
        cy.usrHistoryVerifyCreator({ name: USERS[1].name });
      });

      it("Verify group creation datetime", () => {
        cy.usrHistoryVerifyCurrentDate({ dateTime: currentDate });
      });

      it("Verify group's name after edit", () => {
        cy.grpHistoryVerifyGroupNameUpdated({ oldGroupName: "API group", newGroupName: "API group-1" });
      });

      it("Verify removed member from group", () => {
        cy.grpHistoryVerifyRemovedMember(USERS[2].name);
      });

      it("verify added member in group", () => {
        cy.grpHistoryVerifyAddedMember(USERS[4].name);
      });

      it("Verify removed permissions from group", () => {
        cy.grpHistoryVerifyRemovedPermissions("DEVELOPERS");
      });

      it("Verify added permissions in group", () => {
        cy.grpHistoryVerifyAddedPermissions("GROUP_CREATE_UNOFFICIAL");
      });

      it("Verify removed tags from group", () => {
        cy.grpHistoryVerifyRemovedTags("OWNERSHIP_CHANGE");
      });

      it("Verify added tags in group", () => {
        cy.grpHistoryVerifyAddedTags("LABEL_TOOLTIPS");
      });

      it("Verify removed parent groups from group", () => {
        cy.grpHistoryVerifyRemovedParentGroups("Developers");
      });

      it("verify added parent groups in group", () => {
        cy.grpHistoryVerifyAddedParentGroups("Everyone");
      });

      it("Close history panel", () => {
        cy.grpHistoryClickCloseButton();
      });
    });

    context("Check history in user managment page", () => {
      it("Navigates to user management", () => {
        cy.usrNavigateToUserManagement();
      });

      it("Open history panel", () => {
        cy.usrHistoryClickOpenButton();
      });

      it("Verify creator of group", () => {
        cy.usrHistoryVerifyCreator({ name: USERS[1].name });
      });

      it("Verify group edited datetime", () => {
        cy.usrHistoryVerifyCurrentDate({ dateTime: currentDate });
      });

      it("Verify added member in group", () => {
        cy.usrHistoryAddedMemberToGroup(USERS[4].name);
      });

      it("Verify member added to group", () => {
        cy.usrHistoryVerifyAddedToGroup({ groupName: "API group-1" });
      });

      it("Verify removed member from group", () => {
        cy.usrHistoryRemovedMemberFromGroup(USERS[2].name);
      });

      it("Verify member removed from group", () => {
        cy.usrHistoryVerifyRemovedFromGroup({ groupName: "API group-1" });
      });

      it("Close history panel", () => {
        cy.usrHistoryClickCloseButton();
      });
    });
  });

  context("Edit 'API group' again and revert all changes", () => {
    it("Navigates to Group management", () => {
      cy.grpNavigateToGroupManagement();
    });

    it("Click edit button of 'API group'", () => {
      cy.grpClickEditGroupWithName({ name: "API group-1" });
    });

    it("Edit group name", () => {
      cy.grpEditGroupName({ name: "API group" });
    });

    it(`Remove ${USERS[4].name} From 'API group'`, () => {
      cy.grpEditRemoveMembers(USERS[4].name);
    });

    it(`Add ${USERS[2].name} in 'API group'`, () => {
      cy.grpEditAddMembers(USERS[2].name);
    });

    it("Remove one existing permission from the group", () => {
      cy.grpEditRemovePermissions("GROUP_CREATE_UNOFFICIAL");
    });

    it("Add one new permission in the group", () => {
      cy.grpEditAddPermissions("DEVELOPERS");
    });

    it("Remove one existing tag from the group", () => {
      cy.grpEditRemoveTags("LABEL_TOOLTIPS");
    });

    it("Add one new tag in the group", () => {
      cy.grpEditAddTags("OWNERSHIP_CHANGE");
    });

    it("Remove one existing parent group from the group", () => {
      cy.grpEditRemoveParentGroups("Everyone");
    });

    it("Add one new parent group in the group", () => {
      cy.grpEditAddParentGroups("Developers");
    });

    it("Click cancel without saving the group", () => {
      cy.grpSaveGroupPatch();
      currentDate = momentInPST().format("MMM D, YYYY hh:m");
    });
  });

  context("Check if the history is created for reverted changes of 'API group'", () => {
    context("Check history in group managment page", () => {
      it("Open history panel", () => {
        cy.grpHistoryClickOpenButton();
      });

      it("Verify creator of group", () => {
        cy.usrHistoryVerifyCreator({ name: USERS[1].name });
      });

      it("Verify group creation datetime", () => {
        cy.usrHistoryVerifyCurrentDate({ dateTime: currentDate });
      });

      it("Verify group's name after edit", () => {
        cy.grpHistoryVerifyGroupNameUpdated({ oldGroupName: "API group-1", newGroupName: "API group" });
      });

      it("Verify removed member from group", () => {
        cy.grpHistoryVerifyRemovedMember(USERS[4].name);
      });

      it("verify added member in group", () => {
        cy.grpHistoryVerifyAddedMember(USERS[2].name);
      });

      it("Verify removed permissions from group", () => {
        cy.grpHistoryVerifyRemovedPermissions("GROUP_CREATE_UNOFFICIAL");
      });

      it("Verify added permissions in group", () => {
        cy.grpHistoryVerifyAddedPermissions("DEVELOPERS");
      });

      it("Verify removed tags from group", () => {
        cy.grpHistoryVerifyRemovedTags("LABEL_TOOLTIPS");
      });

      it("Verify added tags in group", () => {
        cy.grpHistoryVerifyAddedTags("OWNERSHIP_CHANGE");
      });

      it("Verify removed parent groups from group", () => {
        cy.grpHistoryVerifyRemovedParentGroups("Everyone");
      });

      it("verify added parent groups in group", () => {
        cy.grpHistoryVerifyAddedParentGroups("Developers");
      });

      it("Close history panel", () => {
        cy.grpHistoryClickCloseButton();
      });
    });

    context("Check history in user managment page", () => {
      it("Navigates to user management", () => {
        cy.usrNavigateToUserManagement();
      });

      it("Open history panel", () => {
        cy.usrHistoryClickOpenButton();
      });

      it("Verify creator of group", () => {
        cy.usrHistoryVerifyCreator({ name: USERS[1].name });
      });

      it("Verify group edited datetime", () => {
        cy.usrHistoryVerifyCurrentDate({ dateTime: currentDate });
      });

      it("Verify added member in group", () => {
        cy.usrHistoryAddedMemberToGroup(USERS[2].name);
      });

      it("Verify member added to group", () => {
        cy.usrHistoryVerifyAddedToGroup({ groupName: "API group" });
      });

      it("Verify removed member from group", () => {
        cy.usrHistoryRemovedMemberFromGroup(USERS[4].name);
      });

      it("Verify member removed from group", () => {
        cy.usrHistoryVerifyRemovedFromGroup({ groupName: "API group" });
      });

      it("Close history panel", () => {
        cy.usrHistoryClickCloseButton();
      });
    });
  });
});

