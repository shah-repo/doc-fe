// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let employeeLoginOwner;
let employeeLoginShared;
const owner = USERS[2].name;
const sharedUser = USERS[1];
const sharedUserTwo = USERS[3];
const groupOne = "Developers";
const groupTwo = "User Management";
const documentId = { value: "00004", fullId: "FM-00004" };
const reference = {
  value: "FM-00001 - 1 - AR Form", valueCode: "FM-00001",
};
const formTitle = { value: "My Form", newValue: "My Form Edited", newChunk: " Edited" };
const formDescription = { value: "Description", newValue: "Description Edited" };

const history = [
  {
    owner,
    actions: [
      { key: "Updated status", value: `Set to Released by ${owner}` },
      { key: "Updated status", value: `Set to Approved by ${owner}` },
      { key: "Updated status", value: `Set to In Review by ${owner}` },
      { key: "Updated status", value: `Set to Pending Change by ${owner}` },
    ],
  },
  {
    owner: sharedUser.name,
    actions: [
      { key: "Access granted to group", value: groupTwo },
    ],
  },
  {
    owner: sharedUser.name,
    actions: [
      { key: "Access granted to user", value: sharedUserTwo.name },
    ],
  },
  {
    owner,
    actions: [
      { key: "Attachment added", value: "test.docx" },
    ],
  },
  {
    owner,
    actions: [
      { key: "s3Link added", value: "test.docx" },
    ],
  },
  {
    owner,
    actions: [
      { key: "Attachments removed", value: "test_image.jpg" },
    ],
  },
  {
    owner,
    actions: [
      { key: "Attachment added", value: "test_image.jpg" },
    ],
  },
  {
    owner,
    actions: [
      { key: "Reference removed", value: reference.valueCode },
    ],
  },
  {
    owner,
    actions: [
      { key: "New reference to", value: reference.valueCode },
    ],
  },
  {
    owner,
    actions: [
      { key: "Description changed", value: `${formDescription.newValue}` },
    ],
  },
  {
    owner,
    actions: [
      { key: "Name changed", value: formTitle.newValue },
    ],
  },
  {
    owner,
    actions: [
      { key: "New description", value: `${formDescription.value}` },
      { key: "New Doc ID", value: documentId.fullId },
      { key: "New owner", value: `${owner}` },
      { key: "New name", value: formTitle.value },
      { key: "Access granted to user", value: sharedUser.name },
      { key: "Access granted to group", value: "Everyone" },
      { key: "Access granted to group", value: groupOne },
      { key: "New status", value: `Set to Draft by ${owner}` },
    ],
  },
];

context("Check Document History", () => {
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
            companyAdminEmail: USERS[2].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[1], USERS[3], USERS[4]],
            documentTypes: [
              ClinicalProtocolDocType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLoginOwner = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          employeeLoginShared = createdCompany.employees.find((employee) => employee.user.email === sharedUser.email);
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: employeeLoginOwner.id });
    });
  });

  context("Start document creation", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Fill in document attributes", () => {
    it("type a title", () => {
      cy.drEnterDocumentTitle({ name: `${formTitle.value}` });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: formDescription.value });
    });

    it("fill in document type: Form", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Change document type id to 'FM-00004'", () => {
      cy.drSetDocTypeId({ docId: documentId.value });
    });

    it("Mark 'Training Required'", () => {
      cy.drClickTrainingRequired();
    });

    it(`Select user: ${sharedUser.name}`, () => {
      cy.drSelectUser(sharedUser.name);
    });

    it(`Select group: ${groupOne}`, () => {
      cy.drSelectGroup(groupOne);
    });

    it("fill in output document type: Clinical Protocol, Component Specification", () => {
      cy.drSelectOutputDocumentType({ documentType: "Component Specification" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });
  });

  context("Create document", () => {
    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("Edit document attributes", () => {
    it("edit the title", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
        cy.drEnterDocumentTitle({ name: `${formTitle.newChunk}` });
      });
      cy.progressBarShouldNotExist();
    });

    it("edit the description", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
        cy.drEnterDocumentDescription({ description: formDescription.newValue });
      });
      cy.progressBarShouldNotExist();
    });


    it("Select reference for document", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
        cy.drSelectReferences( reference.value );
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });


    it("Remove reference for document", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
        cy.contains(reference.valueCode).arrowClick();
        cy.contains(reference.valueCode).parent().parent().parent().find("svg").arrowClick({ force: true });
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Unmark 'Training Required'", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
        cy.drClickTrainingRequired();
      });
    });

    it("Uploads test_image.jpg", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
        cy.atchUploadAttachment({ fileName: "test_image.jpg" });
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Remove attachment test_image.jpg", () => {
      cy.atchRemoveAttachment({ fileName: "test_image.jpg" });
      cy.wait(1000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Upload test.docx", () => {
      cy.atchUploadAttachment({ fileName: "test.docx" });
      cy.wait(1000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context(`Logout user: '${USERS[2].name}' and Login user: '${sharedUser.name}'`, () => {
    it("Logout existing user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: sharedUser, employeeId: employeeLoginShared.id });
    });
  });

  context(`Open created document, ${formTitle.newValue} document creation`, () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clear document filter", () => {
      cy.dlClearFilters();
    });

    it("Filter the DRAFT document", () => {
      cy.dlFilterByStatus({ status: "Draft" });
    });

    it(`select '${formTitle.newValue}'`, () => {
      cy.get("#root").contains(formTitle.newValue).arrowClick();
    });
  });

  context("Edit permissions", () => {
    it("Open permissions tab", () => {
      SystemRequirement("REQ-4240");
      cy.drSelectPermissionTab();
    });

    it("Add another user permission", () => {
      SystemRequirement("REQ-4240");
      cy.drAddUserFromPermissionTab(sharedUserTwo.name);
    });

    it("Add another group permission", () => {
      SystemRequirement("REQ-4240");
      cy.drAddGroupFromPermissionTab(groupTwo);
    });
  });

  context(`Logout user: '${sharedUser.name}' and Login user: '${USERS[2].name}'`, () => {
    it("Logout existing user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: employeeLoginOwner.id });
    });
  });

  context(`Open created document, ${formTitle.newValue} document creation`, () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clear document filter", () => {
      cy.dlClearFilters();
    });

    it("Filter the DRAFT document", () => {
      cy.dlFilterByStatus({ status: "Draft" });
    });

    it(`select '${formTitle.newValue}'`, () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.DocRevPreview], () => {
        cy.get("#root").contains(formTitle.newValue).arrowClick();
      });
    });
  });

  context("Approve and Release document", () => {
    it("Approves and releases document", () => {
      SystemRequirement("REQ-4020", "REQ-4040");
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Check document history", () => {
    it("Open history drawer and compare history values", () => {
      SystemRequirement("REQ-0360", "REQ-2670", "REQ-4000", "REQ-4250");
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAudit], () => {
        cy.drSelectHistoryTab();
      });
    });

    history.forEach((element, groupIndex) => {
      it(`Check owner name for group ${groupIndex + 1}`, () => {
        cy.get(`[data-cy="user-name"]`).find(`[data-cy="change-key-${groupIndex}"]`)
          .should("have.text", element.owner);
      });

      element.actions.forEach((action) => {
        it(`'${action.key}' as '${action.value}' exists`, () => {
          const typeOfChange = action.key;
          let contentOfChange = action.value;
          if (action.key === "New description" || action.key === "Description changed" ) {
            contentOfChange = action.value;
          }

          if (typeOfChange === "s3Link added") {
            cy.get(`[data-cy^="change-key-${groupIndex}-"]`).should("have.text", typeOfChange);
            cy.get(`[data-cy="downloadS3link"]`).should("have.text", contentOfChange);
          }
          else {
            cy.get(`[data-cy^="change-value-${groupIndex}-"]`)
              .contains(action.key === "New owner" ? new RegExp("^" + action.value + "$", "g") : action.value)
              .parent()
              .parent()
              .within(() => {
                cy.get("[data-cy^=change-key]").should("have.text", typeOfChange);
                cy.get("[data-cy^=change-value]").should("contain.text", contentOfChange);
              });
          }
        });
      });
    });
  });
});

export { };

