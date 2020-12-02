// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { PreventSkipOnFailure } from "../../support";
import { CONFIG } from "../../support/config";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;

context("Group Permissions Flow", () => {
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
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: USERS[5].email,
            numOfRevStages: 3,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1;
        done();
      });
    });
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[2].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Check that groups and users management are not visible in navigation", () => {
    it("Check that user management is not visible", () => {
      cy.get("[data-cy=\"navigation.userManagement\"]").should("not.exist");
    });

    it("Check that group management is not visible", () => {
      cy.get("[data-cy=\"navigation.groupManagement\"]").should("not.exist");
    });

    it("Navigates to document list", () => {
      // SystemRequirement("REQ-0140");
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("fill in document type: Form", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click 'Add field'", () => {
      cy.fbAddNewFieldOption();
    });

    it("Check if specific fields are shown in list", () => {
      cy.fbCheckFieldsDoesntExist("purchaseorder", "poreceive", "requestapproval");
    });
  });

  context("Login company admin", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Start add an official group flow", () => {
    it("Navigates to Group management", () => {
      cy.grpNavigateToGroupManagement();
    });

    it("Clicks on 'Add Group'", () => {
      cy.grpClickAddGroup();
    });
  });

  context("Fill in official group attributes", () => {
    it("Selects the 'official' options", () => {
      cy.grpSelectOfficial();
    });

    it("Enters group name", () => {
      cy.grpEnterGroupName({ name: "Official Group" });
    });

    it("Assigns user to the group", () => {
      SystemRequirement("REQ-2510");
      cy.grpAssignUser({ name: USERS[2].name });
    });

    it("Assigns tags to the group", () => {
      SystemRequirement("REQ-2510");
      cy.grpAddTag({ tag: "DOCUMENT_TYPE_MANAGEMENT" });
    });
  });

  context("Create official group", () => {
    it("Saves the group", () => {
      cy.grpSaveGroup();
    });
  });

  context("Start adding user without permission to groups and users management", () => {
    it("Navigates to Group management", () => {
      cy.grpNavigateToGroupManagement();
    });

    it("Filters groups by name and selects 'Groups Management'", function() {
      PreventSkipOnFailure.call(this);
      // SystemRequirement("REQ-2550");
      cy.grpSelectGroupWithoutClosingDialog({ name: "Groups Management" });
    });

    it("Assigns user to the group", () => {
      // SystemRequirement("REQ-2560");
      cy.grpAssignUser({ name: USERS[2].name });
    });

    it("Saves the group", () => {
      cy.grpSaveGroupPatch();
    });

    it("Navigates to 'Group management'", () => {
      cy.grpNavigateToGroupManagement();
    });

    it("Filters groups by name and selects 'User Management'", function() {
      PreventSkipOnFailure.call(this);
      // SystemRequirement("REQ-2550");
      cy.grpSelectGroupWithoutClosingDialog({ name: "User Management" });
    });

    it("Assigns user to the group", () => {
      // SystemRequirement("REQ-2560");
      cy.grpAssignUser({ name: USERS[2].name });
    });

    it("Saves the group", () => {
      cy.grpSaveGroupPatch();
    });
  });

  context(`Remove and add permissions for ${USERS[3].name}`, () => {
    it("Navigates to Group management", () => {
      cy.grpNavigateToGroupManagement();
    });

    it("Filters groups by name and selects 'Everyone'", () => {
      cy.grpSelectGroupWithoutClosingDialog({ name: "Everyone" });
    });

    it(`Remove permissions for  'Everyone' for ${USERS[3].name}`, () => {
      cy.grpRemoveUser({ item: 1 });
    });

    it("Saves the group", () => {
      cy.grpSaveGroupPatch();
    });

    it("Filters groups by name and selects 'Developers'", () => {
      cy.grpSelectGroupWithoutClosingDialog({ name: "Developers" });
    });

    it("Assigns user to the group", () => {
      SystemRequirement("REQ-2510");
      cy.grpAssignUser({ name: USERS[3].name });
    });

    it("Saves the group", () => {
      cy.grpSaveGroupPatch();
    });
  });

  context(`Login first user ${USERS[2].name}`, () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[2].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Check that 'User Management' is visible in navigation", () => {
      cy.get("[data-cy=\"navigation.userManagement\"]").should("exist");
    });

    it("Check that 'Group Management' is visible in navigation", () => {
      cy.get("[data-cy=\"navigation.groupManagement\"]").should("exist");
    });

    it("Check that 'Document Type Management' is visible in navigation", () => {
      cy.get("[data-cy=\"navigation.documentTypeManagement\"]").should("exist");
    });
  });

  context(`Login second user ${USERS[3].name}`, () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[3].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Navigates to document list", () => {
      // SystemRequirement("REQ-0140");
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("fill in document type: Form", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click 'Add field'", () => {
      cy.fbAddNewFieldOption();
    });

    it("Check if specific fields are shown in list", () => {
      cy.fbCheckFields("purchaseorder", "poreceive", "requestapproval");
    });

    it("Navigate to existing document", () => {
      cy.navigToDocumentList();
      cy.drClickOnSpecificDocFromList({ item: "AR Form" });
    });

    it("Check if 'Request Access' button exists", () => {
      cy.get("#PreviewControlsContainer-access").should("exist");
    });
  });
});
