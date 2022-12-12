// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { ClinicalProtocolNotRedline } from "../../utils/constants/documentTypes/clinicalProtocol";
import { TestDocumentType } from "../../utils/constants/documentTypes/testTypes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let documentUploadFailureCaught = false;
let developersGroup;
let adminSessionId;
let adminEmployee;
let employeeToDevs;
let employeeLoginThird;

context("Document Creation Flow", () => {
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
      SystemRequirement("REQ-0400", "REQ-0420", "REQ-0440");
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
            documentTypes: [
              ClinicalProtocolNotRedline,
              TestDocumentType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          employeeToDevs = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          employeeLoginThird = createdCompany.employees.find((employee) => employee.user.email === USERS[3].email);
          done();
        });
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        adminSessionId = loginResponse.sessionId;
        done();
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

  context("[API]Add employee to developers group", () => {
    it("[API]Get group", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Developers",
        sessionId: adminSessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        developersGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: developersGroup.body[0].id,
        sessionId: adminSessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: employeeToDevs.id }],
        },
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: employeeToDevs.id });
    });
  });

  context("Start document creation flow", () => {
    it("Navigates to document list", () => {
      // SystemRequirement("REQ-0140");
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Fill in document attributes", () => {
    it("Enters title 'New Document Revision'", () => {
      cy.drEnterDocumentTitle({ name: "New Document Revision" });
    });

    it("Enters description 'New Document Revision description'", () => {
      cy.drEnterDocumentDescription({ description: "New Document Revision description" });
    });

    it("Selects 'Test Document Type' document type from dropdown", () => {
      // SystemRequirement("REQ-0490");
      cy.drSelectDocumentType({ documentType: "Test Document Type" });
    });

    it("Checks if document type id is 'TDT-00002'", () => {
      SystemRequirement("REQ-0320");
      cy.drCheckIfDocumentIdMatches({ docId: "TDT-00002" });
    });

    it("Set document type id manually to 'TDT-00999'", () => {
      SystemRequirement("REQ-0170");
      cy.drSetDocTypeId({ docId: "00999" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Check if Selected Groups are set to 'Everyone' by default", () => {
      SystemRequirement("REQ-0300");
      cy.get("div[data-cy=field-securityEmployees]>#securityEmployees")
        .should("have.text", "Enter the name of users to access the document");
      cy.get("[data-cy=\"field-securityGroups\"]").contains("Everyone");
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Select reference for document", () => {
      SystemRequirement("REQ-0180");
      cy.drSelectReferences( "AR Form");
    });

    it("Remove reference for document", () => {
      SystemRequirement("REQ-0190");
      cy.drRemoveReferences({ reference: "FM-00001" });
    });

    it("'Training Required' should be unchecked initially", () => {
      cy.drIsTrainingRequired({ shouldBe: false });
    });

    it("Mark 'Training Required' for next revision", () => {
      cy.drClickTrainingRequired();
    });

    context("Uploads attachments", () => {
      it("Uploads redline attachment: test.docx", () => {
        SystemRequirement("REQ-0260");
        cy.wait(2000);
        cy.atchUploadRedlineAttachment({ fileName: "test.docx" });
      });

      it("Check test.docx attachment atributes", () => {
        cy.atchCheckAtributes({ fileName: "test.docx", attributes: "11.00 B Microsoft Word File" });
      });

      it("check if it has the redline indicator", () => {
        cy.atchCheckRedLineIndicator({ fileName: "test.docx" });
      });

      it("Check one attachment is displayed: test.docx", () => {
        cy.atchCheckDisplayedAttachments({ fileNames: [ "test.docx" ] });
      });

      it("Uploads invalid-docType.doc", () => {
        cy.on("fail", () => {
          documentUploadFailureCaught = true;
          return false;
        });
        cy.atchUploadAttachment({ fileName: "invalid-docType.doc" });
      });

      it("Check if document failure was caught", () => {
        SystemRequirement("REQ-0230");
        expect(documentUploadFailureCaught).equal(true);
        cy.closeAtchUploadDialog();
      });

      it("Upload image.jpg", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
      });

      it("Check image.jpg attachment atributes", () => {
        cy.atchCheckAtributes({ fileName: "image.jpg", attributes: "48.45 kB JPG File" });
      });

      it("Check two attachment are displayed: test.docx, image.jpg", () => {
        cy.atchCheckDisplayedAttachments({ fileNames: [ "test.docx", "image.jpg" ] });
      });

      it("Remove attachment image.jpg", () => {
        cy.atchRemoveAttachment({ fileName: "image.jpg" });
      });

      it("Check one attachment is displayed: test.docx", () => {
        cy.atchCheckDisplayedAttachments({ fileNames: [ "test.docx" ] });
      });

      it("Upload multiple attachments at once: 'image.jpg' and 'test_image.jpg'", () => {
        SystemRequirement("REQ-0220");
        cy.wait(2000);
        cy.get("#AttachmentFieldPresenter-linkButton").arrowClick();
        cy.get("#attachments-button-file-clean-copy")
          .attachFiles(
            [
              { name: "./image.jpg", type: "image/jpg" },
              { name: "./test_image.jpg", type: "image/jpg" },
            ]
          );
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Check three attachments are displayed: test.docx, image.jpg and test_image.jpg", () => {
        cy.atchCheckDisplayedAttachments({ fileNames: [ "test.docx", "image.jpg", "test_image.jpg" ] });
      });

      it("Redline attachment should be last on the list", () => {
        cy.atchCheckDisplayedAtLast({ fileName: "test.docx" });
      });

      it("Remove attachment image.jpg", () => {
        cy.atchRemoveAttachment({ fileName: "image.jpg" });
      });

      it("Remove attachment test_image.jpg", () => {
        cy.atchRemoveAttachment({ fileName: "test_image.jpg" });
      });
    });
  });

  context("Document in Draft", () => {
    it("Check if document status is Draft after creating a document", () => {
      SystemRequirement("REQ-0330");
      SystemRequirement("REQ-0020");
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    context("Uploads attachments", () => {
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Uploads test_image.jpg", () => {
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.atchUploadAttachment({ fileName: "test_image.jpg" });
      });

      it("Check test_image.jpg attachment atributes", () => {
        cy.atchCheckAtributes({ fileName: "test_image.jpg", attributes: "79.54 kB JPG File" });
      });

      it("Check two attachments are displayed: test.docx, test_image.jpg", () => {
        cy.atchCheckDisplayedAttachments({ fileNames: [ "test_image.jpg", "test.docx" ] });
      });

      it("Uploads image.jpg", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
      });

      it("Check test.docx attachment atributes", () => {
        cy.atchCheckAtributes({ fileName: "image.jpg", attributes: "48.45 kB JPG File" });
      });

      it("Check three attachments are displayed: `test.docx`, `image.jpg`, `test_image.jpg`", () => {
        SystemRequirement("REQ-0200", "REQ-0210");
        cy.atchCheckDisplayedAttachments({ fileNames: [ "test_image.jpg", "image.jpg", "test.docx" ] });
      });
    });

    context("Check primary attachment function", () => {
      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Set attachment as primary", () => {
        cy.atchSetPrimaryAttachment({ fileName: "test_image.jpg" });
      });

      it("Allow user to only set single attachment to be primary", () => {
        SystemRequirement("REQ-0250");
        cy.atchSetPrimaryAttachment({ fileName: "image.jpg" });
        cy.atchCheckForSinglePrimaryAttachment();
      });

      it("Remove attachment 'test_image.jpg'", () => {
        SystemRequirement("REQ-0240");
        cy.atchRemoveAttachment({ fileName: "test_image.jpg" });
      });

      it("Check two attachments are displayed: test.docx, image.jpg", () => {
        cy.atchCheckDisplayedAttachments({ fileNames: [ "test.docx", "image.jpg" ] });
      });
    });

    context("Check training for next revision", () => {
      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Approve and Release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });

      it("Revise document", () => {
        cy.drClickReviseDocument();
      });

      it("'Training Required' should be checked as previous version was checked", () => {
        SystemRequirement("REQ-0280");
        cy.drIsTrainingRequired({ shouldBe: true });
      });
    });
  });

  context("Create new document, change owner and cancel it", () => {
    it("Navigates to document list", () => {
      // SystemRequirement("REQ-0140");
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enters title 'New Document Revision'", () => {
      cy.drEnterDocumentTitle({ name: "New Document Revision" });
    });

    it("Enters description 'New Document Revision description'", () => {
      cy.drEnterDocumentDescription({ description: "New Document Revision description" });
    });

    it("Selects 'Clinical Protocol' document type from dropdown", () => {
      // SystemRequirement("REQ-0490");
      cy.drSelectDocumentType({ documentType: "Clinical Protocol" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    context("Check document type redLine option", () => {
      it("Open attachment upload dialog", () => {
        cy.get("[id=AttachmentFieldPresenter-linkButton]").arrowClick();
      });

      it("Verify there is no option to upload redline attachment", () => {
        cy.get("[id=AttachmentFieldPresenter-linkButton-red-line]").should("not.exist");
      });

      it("Close attachment upload dialog", () => {
        cy.get("[data-cy=\"AttachmentFieldPresenter-handleRemove\"]").arrowClick();
      });
    });

    context("Verify ownership mechanism", () => {
      it("Change owner of document", () => {
        SystemRequirement("REQ-0340");
        cy.get("#HeaderMenuButton").arrowClick();
        cy.drChangeOwnerByAdmin({ employee: USERS[3].name });
      });

      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({ USER: USERS[3], employeeId: employeeLoginThird.id });
      });

      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on specific document 'CP-00002'", () => {
        cy.drClickOnSpecificDocFromList({ item: "CP-00002" });
      });

      it("Verify owner", () => {
        cy.drVerifyDocumentOWner({ owner: USERS[3].name });
      });

      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
      });

      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on specific document 'CP-00002'", () => {
        cy.drClickOnSpecificDocFromList({ item: "CP-00002" });
      });

      it("Change owner of document by admin", () => {
        SystemRequirement("REQ-0340");
        cy.get("#HeaderMenuButton").arrowClick();
        cy.drChangeOwnerByAdmin({ employee: USERS[2].name });
      });

      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({ USER: USERS[2], employeeId: employeeToDevs.id });
      });

      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on specific document 'CP-00002'", () => {
        cy.drClickOnSpecificDocFromList({ item: "CP-00002" });
      });

      it("Approves and releases document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });

      it("Clicks on revise document", () => {
        SystemRequirement("REQ-0150");
        cy.drClickReviseDocument();
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Cancel draft document", () => {
        SystemRequirement("REQ-0350");
        cy.drCancelDraftButton();
      });

      it("Check document status is 'Canceled'", () => {
        SystemRequirement("REQ-0350");
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.CANCELED });
      });
    });
  });
});

export { };

