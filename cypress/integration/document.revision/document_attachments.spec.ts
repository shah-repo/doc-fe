// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { TestDocumentType } from "../../utils/constants/documentTypes/testTypes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let employeeLogin;

const approvalRequestTitle = "Approval request from newly created form";
const saveFileNameOne = (Math.round(Math.random() * 100000)) % 100000;
const saveFileNameTwo = (Math.round(Math.random() * 100000)) % 100000;
const saveFileNameThree = (Math.round(Math.random() * 100000)) % 100000;
const saveFileNameFour = (Math.round(Math.random() * 100000)) % 100000;
const saveFileRedlineDOCX = (Math.round(Math.random() * 100000)) % 100000;
const saveFileCleanCopyDOCX = (Math.round(Math.random() * 100000)) % 100000;

context("Document Attachment Flow", () => {
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
              TestDocumentType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLogin = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
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
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: employeeLogin.id });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
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

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Check if Selected Groups are set to 'Everyone' by default", () => {
      SystemRequirement("REQ-0300");
      cy.get("div[data-cy=field-securityEmployees]>#securityEmployees")
        .should("have.text", "Enter the name of users to access the document");
      cy.get("[data-cy=\"field-securityGroups\"]").contains("Everyone");
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    context("Test download of uploaded attachments", () => {
      context("Test redline", () => {
        it("Upload redline and verify cleanCopyStatus is created", () => {
          cy.atchUploadRedlineVerifyCleanCopyStatus({ fileName: "redline.docx" });
        });

        it("Download uploaded redline document", () => {
          SystemRequirement("REQ-0390");
          cy.atchDownloadFile({ fileName: "redline.docx", saveFileName: saveFileRedlineDOCX + "redline.docx" });
        });

        it("Check size of downloaded redline document", () => {
          cy.readFile(`cypress/downloads/${saveFileRedlineDOCX}redline.docx`).should("have.length", "15874");
        });

        it("Download clean copy of redline document", () => {
          SystemRequirement("REQ-0390");
          cy.atchDownloadCleanCopyFile({
            fileName: "redline.docx",
            saveFileName: saveFileCleanCopyDOCX + "redline_CC.docx",
          });
        });

        it("Check size of downloaded clean copydocument", () => {
          cy.readFile(`cypress/downloads/${saveFileCleanCopyDOCX}redline_CC.docx`).should("not.have.length", "15874");
        });

        it("Remove redline attachment", () => {
          cy.atchRemoveAttachment({ fileName: "redline.docx" });
        });
      });

      context("Test normal attachments", () => {
        it("Uploads text.docx", () => {
          cy.atchUploadAttachment({ fileName: "test.docx" });
        });

        it("Uploads redline attachment 'image.jpg'", () => {
          cy.atchUploadRedlineAttachment({ fileName: "image.jpg" });
        });

        it("Fail upload text.docx", () => {
          cy.atchUploadAttachmentFail({ fileName: "test.docx" });
        });

        it("Verify upload error message is shown", () => {
          SystemRequirement("REQ-0230");
          cy.checkToastMessage({ exists: true });
          cy.checkToastMessageIsEqual({ message: "Upload failed" });
          cy.closeAllAlertMessages();
        });

        it("Clicks Save button", () => {
          cy.drClickSaveWithoutApiCall();
        });

        it("Approves and releases document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
        });

        it("Download all attachments with redline document", () => {
          SystemRequirement("REQ-0390");
          cy.atchDownloadAll();
        });

        it("Revise document", () => {
          cy.drClickReviseDocument();
        });

        it("Uploads image.jpg", () => {
          cy.atchUploadAttachment({ fileName: "image.jpg" });
        });

        it("Clicks Save button", () => {
          cy.drClickSaveWithoutApiCall();
        });

        it("Approves and releases document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
        });

        it("Revise document", () => {
          cy.drClickReviseDocument();
        });

        it("Clicks Save button", () => {
          cy.drClickSaveWithoutApiCall();
        });

        it("Approves and releases document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
        });

        it("Select Superseded version of document without redline attachments", () => {
          cy.drClickRevisionsSidePanel();
          cy.drSelectReleasedVersionOfDocument({ docVersion: 1 });
        });

        it("Download all attachments without redline document on Superseded version", () => {
          SystemRequirement("REQ-0380");
          cy.atchDownloadAll();
        });

        it("Select Superseded version of document without redline attachments", () => {
          cy.drClickRevisionsSidePanel();
          cy.drSelectReleasedVersionOfDocument({ docVersion: 0 });
        });

        it("Revise document", () => {
          cy.drClickReviseDocument();
        });

        it("Select Obsolete revision option", () => {
          cy.get("[id=\"RevisionTypeChange-obsolete\"]").arrowClick();
        });

        it("Clicks Save button", () => {
          cy.drClickSaveWithoutApiCall();
        });

        it("Approves and releases document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();

        });

        it("Download all attachments without redline document on Obsolete version", () => {
          SystemRequirement("REQ-0380");
          cy.atchDownloadAll();
        });
      });
    });
  });

  context("Check Pending Change and In Review for downloading redline document", () => {
    it("Navigates to document list", () => {
      // SystemRequirement("REQ-0140");
      cy.navigToDocumentList();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enters title 'New Document Revision'", () => {
      cy.drEnterDocumentTitle({ name: "New Document for AR" });
    });

    it("Enters description 'New Document Revision description'", () => {
      cy.drEnterDocumentDescription({ description: "New Document for AR description" });
    });

    it("Selects 'Clinical Protocol' document type from dropdown", () => {
      // SystemRequirement("REQ-0490");
      cy.drSelectDocumentType({ documentType: "Clinical Protocol" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Uploads redline attachment 'image.jpg'", () => {
      cy.atchUploadRedlineAttachment({ fileName: "image.jpg" });
    });

    it("Uploads text.docx", () => {
      cy.atchUploadAttachment({ fileName: "test.docx" });
    });

    it("Clicks Save button", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("Navigate to approval request list", () => {
      SystemRequirement("REQ-0680");
      cy.navigToApprovalRequestList();
    });

    it("Click Create a Approval Request button", () => {
      cy.cmpClickCreateApprovalRequest();
    });

    it("Enter title AR title: " + approvalRequestTitle, () => {
      cy.arEnterApprovalRequestTitle({ title: approvalRequestTitle });
    });

    it("Enter description 'AR from New form template for approval request'", () => {
      cy.arEnterApprovalRequestDescription({ description: "CR from New form template for approval request" });
    });

    it("Add created document revision", () => {
      cy.arSelectItemsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.arAddItems();
      cy.arChoseSpecificProposedDocument({ name: "CP-00003" });
      cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
      cy.arClickAddBtnOnAddDocumentsDialog();
    });

    it("Click Create Approval Request", () => {
      SystemRequirement("REQ-0730");
      cy.arSaveApiCallWithoutApi();
    });

    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on specific document 'CP-00003'", () => {
      cy.drClickOnSpecificDocFromList({ item: "CP-00003" });
    });

    it("Download redline document in Pending Change state", () => {
      SystemRequirement("REQ-0390");
      cy.atchDownloadFile({ fileName: "image.jpg", saveFileName: saveFileNameOne + "image.jpg" });
    });

    it("Check size of downloaded file", () => {
      cy.readFile(`cypress/downloads/${saveFileNameOne}image.jpg`).should("have.length", "32732");
    });

    it("Navigate to added document in AR", () => {
      cy.navigToApprovalRequestList();
    });

    it("Filter approval by name and status, and select it", () => {
      cy.arFilterARListByNameAndStatus({ title: approvalRequestTitle, status: "DRAFT" });
    });

    it("Add first approver to approval request on approver list", () => {
      cy.arAddApproverOnApproverListWithoutApiCall({ approver: USERS[2].email });
    });

    it("Clicks Save button", () => {
      cy.arSaveApiCallWithoutApi();
    });

    it("Click 'Send To Review'", () => {
      cy.arClickSendToReviewWithoutApi();
    });

    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on specific document 'CP-00003'", () => {
      cy.drClickOnSpecificDocFromList({ item: "CP-00003" });
    });

    it("Download redline document in 'In Review' state", () => {
      SystemRequirement("REQ-0390");
      cy.atchDownloadFile({ fileName: "image.jpg", saveFileName: saveFileNameTwo + "image.jpg" });
    });

    it("Download non-redline document in 'In Review' state", () => {
      SystemRequirement("REQ-0390");
      cy.atchDownloadFile({ fileName: "test.docx", saveFileName: saveFileNameTwo + "test.docx" });
    });

    it("Check size of downloaded redline file", () => {
      cy.readFile(`cypress/downloads/${saveFileNameTwo}image.jpg`).should("have.length", "32732");
    });

    it("Check size of downloaded non-redline file", () => {
      cy.readFile(`cypress/downloads/${saveFileNameTwo}test.docx`).should("have.length", "11");
    });

    it("Navigate to added document in AR", () => {
      cy.navigToApprovalRequestList();
    });

    it("Filter approval by name and status, and select it", () => {
      cy.alClearFilters();
      cy.arFilterARListByNameAndStatus({ title: approvalRequestTitle, status: "IN_REVIEW" });
    });

    it("Approve AR", () => {
      SystemRequirement("REQ-0920");
      cy.arApproveARWithoutApi();
    });

    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Click on specific document 'CP-00003'", () => {
      cy.drClickOnSpecificDocFromList({ item: "CP-00003" });
    });

    it("Download redline document in 'Approved' state", () => {
      SystemRequirement("REQ-0390");
      cy.atchDownloadFile({ fileName: "image.jpg", saveFileName: saveFileNameThree + "image.jpg" });
    });

    it("Check size of downloaded file", () => {
      cy.readFile(`cypress/downloads/${saveFileNameThree}image.jpg`).should("have.length", "32732");
    });

    it("Navigate to approved document in AR", () => {
      cy.navigToApprovalRequestList();
    });

    it("Filter approval by name and status, and select it", () => {
      cy.alClearFilters();
      cy.arFilterARListByNameAndStatus({ title: approvalRequestTitle, status: "APPROVED" });
    });

    it("Close AR", () => {
      cy.arCloseAR();
    });

    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on specific document 'CP-00003'", () => {
      cy.drClickOnSpecificDocFromList({ item: "CP-00003" });
    });

    it("Download redline document in 'Released' state", () => {
      SystemRequirement("REQ-0390");
      cy.atchDownloadFile({ fileName: "image.jpg", saveFileName: saveFileNameFour + "image.jpg" });
    });

    it("Check size of downloaded file", () => {
      cy.readFile(`cypress/downloads/${saveFileNameFour}image.jpg`).should("have.length", "32732");
    });
  });
});

export { };

