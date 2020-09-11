// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { NavigationItems } from "../../../src/state/ducks/auth/types";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});

let company;
let adminEmployeeLoginResponse;
let multipleCompanies = false;

const groupOne = "Group One";

const ADMIN_USER = USERS[10];
const FIRST_USER = USERS[11];
const SECOND_USER = USERS[12];
const THIRD_USER = USERS[13];
const INDIVIDUAL_USER = USERS[14];
const IMPORTER_USER = USERS[15];

const userPermissionDocument = "User Permission Doc";
const groupPermissionDocument = "Group Permission Doc";
const normalDocument = "Normal Document";

const documentType = "Form";
const outputDocumentType = "Component Specification";

context("Document Approval Matrix Flow", () => {
  SystemRequirement("REQ-2650");

  context("[API]Prepare company", () => {
    it("[API]Creates company", (done: any) => {
      cy.authApiLogin({
        email: "zoran.kovacevic+admin@codecons.com",
        password: "Tester1!",
      }).then((response) => {
        adminEmployeeLoginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: ADMIN_USER.email,
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: IMPORTER_USER.email,
            maxRevisionStages: 3,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [FIRST_USER, SECOND_USER, THIRD_USER, INDIVIDUAL_USER],
            documentTypes: [],
          }, sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        }).then((response) => {
          company = response;
          done();
        });
      });
    });

    it("[API]Login admin", (done: any) => {
      cy.authApiLogin({
        email: ADMIN_USER.email,
        password: "Tester1!",
      }).then((response) => {
        adminEmployeeLoginResponse = response;
        multipleCompanies = adminEmployeeLoginResponse.employees.length > 1 ? true : false;
        done();
      });
    });
  });

  context("Log in admin, select company and open group management", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: ADMIN_USER.email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: company.name, multiple: multipleCompanies });
    });

    it("Open Group Management", () => {
      cy.navigClickOnItem({ navigItem: NavigationItems.GROUP_MANAGEMENT });
    });
  });

  context("Add Group One", () => {
    it("Open 'Add Group' dialog", () => {
      cy.grpClickAddGroup();
    });

    it("Create official group", () => {
      cy.grpSelectOfficial();
    });

    it(`Fill group name: ${groupOne}`, () => {
      cy.grpEnterGroupName({ name: groupOne });
    });

    it("Select members: Admin & Second", () => {
      cy.grpTypeMembers(ADMIN_USER.name, SECOND_USER.name);
    });

    it("Add parent group: Everyone", () => {
      cy.grpAddParentGroups("Everyone");
    });

    it("Save group", () => {
      cy.grpAddGroup();
    });

    it("Close group dialog", () => {
      cy.grpCloseGroupBtn();
    });
  });

  context(`Create Document: '${normalDocument}'`, () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Type a title", () => {
      cy.drEnterDocumentTitle({ name: `${normalDocument}` });
    });

    it("Type a description", () => {
      cy.drEnterDocumentDescription({ description: normalDocument });
    });

    it(`Fill in document type: '${documentType}'`, () => {
      cy.drSelectDocumentType({ documentType });
    });

    it(`Fill in output document type: ${outputDocumentType}`, () => {
      cy.drSelectOutputDocumentType({ documentType: outputDocumentType });
    });
  });

  context("Save document And Approve & Release Document", () => {
    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocument();
    });
  });

  context(`Create Document: '${userPermissionDocument}'`, () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Type a title", () => {
      cy.drEnterDocumentTitle({ name: `${userPermissionDocument}` });
    });

    it("Type a description", () => {
      cy.drEnterDocumentDescription({ description: userPermissionDocument });
    });

    it(`Fill in document type: '${documentType}'`, () => {
      cy.drSelectDocumentType({ documentType });
    });

    it(`Fill in output document type: ${outputDocumentType}`, () => {
      cy.drSelectOutputDocumentType({ documentType: outputDocumentType });
    });

    it(`Select one user: '${FIRST_USER.name}'`, () => {
      cy.drSelectUser(FIRST_USER.name);
    });

    it(`Remove default Everyone from group`, () => {
      cy.get(`[data-cy="field-securityGroups"]`).type(`{backspace}`);
    });
  });

  context("Save document And Approve & Release Document", () => {
    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocument();
    });
  });

  context(`Create Document: '${groupPermissionDocument}'`, () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Type a title", () => {
      cy.drEnterDocumentTitle({ name: `${groupPermissionDocument}` });
    });

    it("Type a description", () => {
      cy.drEnterDocumentDescription({ description: groupPermissionDocument });
    });

    it(`Fill in document type: '${documentType}'`, () => {
      cy.drSelectDocumentType({ documentType });
    });

    it(`Fill in output document type: ${outputDocumentType}`, () => {
      cy.drSelectOutputDocumentType({ documentType: outputDocumentType });
    });

    it(`Remove default Everyone from group`, () => {
      cy.get(`[data-cy="field-securityGroups"]`).type(`{backspace}`);
    });

    it(`Select one group: '${groupOne}'`, () => {
      cy.drSelectGroup(groupOne);
    });
  });

  context("Save document And Approve & Release Document", () => {
    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocument();
    });
  });

  context(`Login Selected User: ${FIRST_USER.name}`, () => {
    it("Logout the user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: FIRST_USER.email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: company.name, multiple: true });
    });
  });

  context(`Open '${normalDocument}', check it has no restriction`, () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it(`select '${normalDocument}'`, () => {
      cy.get("#root").contains(normalDocument).click();
    });

    it("User is not restricted.", () => {
      cy.drRequestAccessVisibility({ isVisible: false });
    });
  });

  context(`Open '${userPermissionDocument}', check it has no restriction`, () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it(`select '${userPermissionDocument}'`, () => {
      cy.get("#root").contains(userPermissionDocument).click();
    });

    it("User is not restricted.", () => {
      cy.drRequestAccessVisibility({ isVisible: false });
    });
  });

  context(`Open '${groupPermissionDocument}', check it has restriction`, () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it(`select '${groupPermissionDocument}'`, () => {
      cy.get("#root").contains(groupPermissionDocument).click();
    });

    it("User is restricted.", () => {
      cy.drRequestAccessVisibility({ isVisible: true });
    });
  });

  context(`Login User selected in group: ${SECOND_USER.name}`, () => {
    it("Logout the user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: SECOND_USER.email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: company.name, multiple: true });
    });
  });

  context(`Open '${normalDocument}', check it has no restriction`, () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it(`select '${normalDocument}'`, () => {
      cy.get("#root").contains(normalDocument).click();
    });

    it("User is not restricted.", () => {
      cy.drRequestAccessVisibility({ isVisible: false });
    });
  });

  context(`Open '${userPermissionDocument}', check it has restriction`, () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it(`select '${userPermissionDocument}'`, () => {
      cy.get("#root").contains(userPermissionDocument).click();
    });

    it("User is restricted.", () => {
      cy.drRequestAccessVisibility({ isVisible: true });
    });
  });

  context(`Open '${groupPermissionDocument}', check it has restriction`, () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it(`select '${groupPermissionDocument}'`, () => {
      cy.get("#root").contains(groupPermissionDocument).click();
    });

    it("User is not restricted.", () => {
      cy.drRequestAccessVisibility({ isVisible: false });
    });
  });
});
