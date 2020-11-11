import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;
const owner = USERS[2].name;
const sharedUser = USERS[1];
const sharedUserTwo = USERS[3];
const groupOne = "Developers";
const groupTwo = "User Management";
const documentId = { value: "00004", fullId: "FM-00004" };
const reference = {
  value: "FM-00001 - 1 - Initial AR Form", valueCode: "FM-00001",
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
      { key: "Attachments removed", value: "test_image.jpg" },
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
      { key: "New Doc ID", value: documentId.fullId },
      { key: "Access granted to user", value: sharedUser.name },
      { key: "Access granted to group", value: "Everyone" },
      { key: "Access granted to group", value: groupOne },
      { key: "New status", value: `Set to Draft by ${owner}` },
      { key: "New owner", value: `${owner}` },
      { key: "New name", value: formTitle.value },
      { key: "New description", value: `${formDescription.value}` },
      { key: "Attachment added", value: `test_image.jpg` },
    ],
  },
];

context("Check Document History", () => {
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
            documentTypes: [
              {
                documentTypeName: "Clinical Protocol",
                documentTypeAcronym: "CP",
                group: "OTHER",
                isQms: true,
              },
            ],
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
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
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

    it("Select reference for document", () => {
      cy.drSelectReferences( reference.value );
    });

    it("Mark 'Training Required'", () => {
      cy.drClickTrainingRequired();
    });

    it("Uploads test_image.jpg", () => {
      cy.atchUploadAttachment({ fileName: "test_image.jpg" });
    });

    it(`Select user: ${sharedUser.name}`, () => {
      cy.drSelectUser(sharedUser.name);
    });

    it(`Select group: ${groupOne}`, () => {
      cy.drSelectGroup(groupOne);
    });

    it("fill in output document type: Clinical Protocol, Component Specification", () => {
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.drSelectOutputDocumentType({ documentType: "Component Specification" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });
  });

  context("Create document", () => {
    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Edit document attributes", () => {
    it("edit the title", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
        cy.drEnterDocumentTitle({ name: `${formTitle.newChunk}` });
        cy.get("[data-cy=field-description]>label").click();
        // auto-save
        cy.wait(1000);
      });
    });

    it("edit the description", () => {
      cy.drEnterDocumentDescription({ description: formDescription.newValue });
    });

    it("Remove reference for document", () => {
      cy.drRemoveReferences(0);
    });

    it("Unmark 'Training Required'", () => {
      cy.drClickTrainingRequired();
    });

    it("Remove attachment test_image.jpg", () => {
      cy.atchRemoveAttachment({ fileName: "test_image.jpg" });
    });

    it("Upload test.docx", () => {
      cy.atchUploadAttachment({ fileName: "test.docx" });
    });

    it("add another output document type: Lots", () => {
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
          cy.drSelectOutputDocumentType({ documentType: "Lots" });
        });
    });
  });

  context(`Logout user: '${USERS[2].name}' and Login user: '${sharedUser.name}'`, () => {
    it("Logout existing user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: sharedUser.email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context(`Open created document, ${formTitle.newValue} document creation`, () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Filter the DRAFT document", () => {
      cy.dlFilterByStatus({ status: "Draft" });
    });

    it(`select '${formTitle.newValue}'`, () => {
      cy.get("#root").contains(formTitle.newValue).click();
    });
  });

  context("Edit permissions", () => {
    it("Open permissions tab", () => {
      cy.drSelectPermissionTab();
    });

    it("Add another user permission", () => {
      cy.drAddUserFromPermissionTab(sharedUserTwo.name);
    });

    it("Add another group permission", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocSecurity, () => {
        cy.drAddGroupFromPermissionTab(groupTwo);
      });
    });
  });

  context(`Logout user: '${sharedUser.name}' and Login user: '${USERS[2].name}'`, () => {
    it("Logout existing user", () => {
      cy.authLogout();
    });

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

  context(`Open created document, ${formTitle.newValue} document creation`, () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Filter the DRAFT document", () => {
      cy.dlFilterByStatus({ status: "Draft" });
    });

    it(`select '${formTitle.newValue}'`, () => {
      cy.get("#root").contains(formTitle.newValue).click();
    });
  });

  context("Approve and Release document", () => {
    it("Approves and releases document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Check document history", () => {
    it("Open history drawer", () => {
      SystemRequirement("REQ-0360");
      cy.drSelectHistoryTab();
    });

    history.forEach((element, groupIndex) => {
      it(`Check owner name for group ${groupIndex + 1}`, () => {
        cy.get(`[data-cy="owner-${groupIndex}"]`).should("have.text", element.owner);
      });

      element.actions.forEach((action) => {
        it(`'${action.key}' as '${action.value}' exists`, () => {
          const typeOfChange = action.key;
          let contentOfChange = action.value;

          if (action.key === "New description" || action.key === "Description changed" ) {
            contentOfChange = "\n" + action.value + "\n";
          }


          cy.get(`[data-cy^=\"change-value-${groupIndex}-\"]`)
            .contains(action.key === "New owner" ? new RegExp("^" + action.value + "$", "g") : action.value)
            .parent()
            .parent()
            .within(() => {
              cy.get("[data-cy^=change-key]").should("have.text", typeOfChange);
              cy.get("[data-cy^=change-value]").should("have.text", contentOfChange);
            });
        });
      });
    });
  });
});

export { };

