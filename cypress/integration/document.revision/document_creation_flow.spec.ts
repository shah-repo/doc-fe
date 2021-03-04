// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;
let documentUploadFailureCaught = false;

context.skip("Document Creation Flow", () => {
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
            importerEmail: USERS[5].email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              {
                documentTypeName: "Clinical Protocol",
                documentTypeAcronym: "CP-",
                group: "OTHER",
                isQms: true,
              },
              {
                documentTypeName: "Test Document Type",
                documentTypeAcronym: "TDT-",
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

    it("Select reference for document", () => {
      SystemRequirement("REQ-0180");
      cy.drSelectReferences( "AR Form");
    });

    it("Remove reference for document", () => {
      SystemRequirement("REQ-0190");
      cy.drRemoveReferences( 0 );
    });

    it("'Training Required' should be unchecked initially", () => {
      cy.drIsTrainingRequired({ shouldBe: false });
    });

    it("Mark 'Training Required' for next revision", () => {
      cy.drClickTrainingRequired();
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    context("Uploads attachments", () => {
      it("Uploads redline attachment: test.docx", () => {
        // SystemRequirement("REQ-0260"); Removed from list.csv
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

      it("Upload multiple attachments at once: image.jpg and test_image.jpg", () => {
        SystemRequirement("REQ-0220");
        cy.get("#AttachmentFieldPresenter-linkButton").click();
        cy.get("#attachments-button-file-clean-copy")
          .attachFiles(
            [
              { name: "./image.jpg", type: "image/jpg" },
              { name: "./test_image.jpg", type: "image/jpg" },
            ]
          );
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

    context("Check permission groups", () => {
      it("Check if Selected Groups are set to 'Everyone' by default", () => {
        SystemRequirement("REQ-0300");
        cy.get("div[data-cy=field-securityEmployees]>#securityEmployees")
          .should("have.text", "Enter the name of users to access the document");
        cy.get("[data-cy=\"field-securityGroups\"]")
          .contains("Enter the name of the user groups to access the document");
      });
    });
  });

  context("Creates document", () => {
    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Document in Draft", () => {
    it("Check if document status is Draft after creating a document", () => {
      SystemRequirement("REQ-0330");
      SystemRequirement("REQ-0020");
      cy.drCheckDocumentStatus({ status: "Draft" });
    });

    context("Uploads attachments", () => {
      it("Uploads test_image.jpg", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
          cy.atchUploadAttachment({ fileName: "test_image.jpg" });
        });
      });

      it("Check test_image.jpg attachment atributes", () => {
        cy.atchCheckAtributes({ fileName: "test_image.jpg", attributes: "79.54 kB JPG File" });
      });

      it("Check two attachments are displayed: test.docx, test_image.jpg", () => {
        cy.atchCheckDisplayedAttachments({ fileNames: [ "test_image.jpg", "test.docx" ] });
      });

      it("Uploads image.jpg", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
          cy.atchUploadAttachment({ fileName: "image.jpg" });
        });
      });

      it("Check test.docx attachment atributes", () => {
        cy.atchCheckAtributes({ fileName: "image.jpg", attributes: "48.45 kB JPG File" });
      });

      it("Check three attachments are displayed: test.docx, image.jpg, test_image.jpg", () => {
        SystemRequirement("REQ-0200", "REQ-0210");
        cy.atchCheckDisplayedAttachments({ fileNames: [ "test_image.jpg", "image.jpg", "test.docx" ] });
      });
    });

    context("Check primary attachment function", () => {
      it("Set attachment as primary", () => {
        cy.atchSetPrimaryAttachment({ fileName: "test_image.jpg" });
      });

      it("Allow user to only set single attachment to be primary", () => {
        SystemRequirement("REQ-0250");
        cy.atchSetPrimaryAttachment({ fileName: "image.jpg" });
        cy.atchCheckForSinglePrimaryAttachment();
      });

      it("Remove attachment test_image.jpg", () => {
        SystemRequirement("REQ-0240");
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
          cy.atchRemoveAttachment({ fileName: "test_image.jpg" });
        });
      });

      it("Check two attachments are displayed: test.docx, image.jpg", () => {
        cy.atchCheckDisplayedAttachments({ fileNames: [ "test.docx", "image.jpg" ] });
      });
    });

    context("Check training for next revision", () => {
      it("Approve and Release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });

      it("Revise document", () => {
        cy.drClickReviseDocument();
      });

      it("'Training Required' should be checked as previous version was checked", () => {
        // SystemRequirement("REQ-0280");
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

    it("Change owner of document", () => {
      SystemRequirement("REQ-0340");
      cy.drChangeOwnerFromMenu({ employee: USERS[3].name });
    });

    it("Logs user that ownership was changed to", () => {
      cy.authLogin({
        email: USERS[3].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on specific document 'CP-00002'", () => {
      cy.drClickOnSpecificDocFromList({ item: "CP-00002" });
    });

    it("Verify owner", () => {
      cy.drVerifyDocumentOWner({ owner: USERS[3].name }).wait(1000);
    });

    it("Logs with admin", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on specific document 'CP-00002'", () => {
      cy.drClickOnSpecificDocFromList({ item: "CP-00002" });
    });

    it("Change owner of document by admin", () => {
      SystemRequirement("REQ-0340");
      cy.drChangeOwnerByAdmin({ employee: USERS[2].name });
    });

    it("Logs user that ownership was changed to", () => {
      cy.authLogin({
        email: USERS[2].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
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
      cy.drCheckDocumentStatus({ status: "Canceled" });
    });
  });
});

export { };

